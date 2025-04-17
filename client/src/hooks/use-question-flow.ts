import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { SecurityQuestion, AnswerSubmission } from "@shared/schema";
import { getWittyResponse } from "@/lib/questions";

interface Answer {
  questionId: number;
  answerText: string;
}

export function useQuestionFlow() {
  const { toast } = useToast();
  const [sessionId, setSessionId] = useState<string>("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(1);
  const [answeredQuestions, setAnsweredQuestions] = useState<Record<number, Answer>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all questions
  const { data: questions = [], isLoading: questionsLoading } = useQuery({
    queryKey: ["/api/questions"],
    enabled: !!sessionId,
  });

  // Get current question
  const currentQuestion: SecurityQuestion | undefined = questions.find(
    (q: SecurityQuestion) => q.order === currentQuestionIndex
  );

  // Calculate total questions and progress
  const totalQuestions = questions.length;
  const progressPercent = (currentQuestionIndex / totalQuestions) * 100;

  // Create a new session
  const createSession = async () => {
    try {
      const response = await apiRequest("POST", "/api/sessions", {});
      const data = await response.json();
      return data.sessionId;
    } catch (error) {
      console.error("Failed to create session:", error);
      toast({
        title: "Error",
        description: "Failed to start recovery process. Please try again.",
        variant: "destructive",
      });
      return nanoid(); // Fallback to client-side ID if server fails
    }
  };

  // Submit answer mutation
  const submitAnswerMutation = useMutation({
    mutationFn: async (data: AnswerSubmission) => {
      const response = await apiRequest("POST", "/api/answers", data);
      return response.json();
    },
    onSuccess: (data, variables) => {
      // Store the answer locally
      setAnsweredQuestions(prev => ({
        ...prev,
        [variables.questionId]: {
          questionId: variables.questionId,
          answerText: variables.answer
        }
      }));

      // Show toast with witty response
      toast({
        title: "Answer Recorded",
        description: data.message || getWittyResponse(
          currentQuestion?.questionType || "text",
          variables.answer,
          variables.questionId
        ),
      });

      // Move to next question if there is one
      if (data.nextQuestionId) {
        setCurrentQuestionIndex(data.nextQuestionId);
      }
    },
    onError: (error) => {
      console.error("Failed to submit answer:", error);
      toast({
        title: "Error",
        description: "Failed to submit your answer. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Initialize session
  const initSession = async () => {
    setIsLoading(true);
    const newSessionId = await createSession();
    setSessionId(newSessionId);
    setCurrentQuestionIndex(1);
    setAnsweredQuestions({});
    setIsLoading(false);
  };

  // Submit an answer and move to next question
  const submitAnswer = (answer: string) => {
    if (!sessionId || !currentQuestion) return;
    
    submitAnswerMutation.mutate({
      questionId: currentQuestion.id,
      answer,
      sessionId
    });
  };

  // Go to previous question
  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 1) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Reset the flow
  const resetFlow = () => {
    setSessionId("");
    setCurrentQuestionIndex(1);
    setAnsweredQuestions({});
  };

  return {
    sessionId,
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    answeredQuestions,
    isLoading: isLoading || questionsLoading || submitAnswerMutation.isPending,
    progressPercent,
    initSession,
    submitAnswer,
    goToPreviousQuestion,
    resetFlow
  };
}
