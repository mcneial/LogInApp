import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuestionFlow } from "@/hooks/use-question-flow";
import SecurityQuestion from "@/components/SecurityQuestion";
import LoadingState from "@/components/LoadingState";
import FinalMessage from "@/components/FinalMessage";

export default function RecoveryFlow() {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [recoveryStep, setRecoveryStep] = useState<"initial" | "loading" | "questions" | "final">("initial");
  
  const {
    sessionId,
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    answeredQuestions,
    isLoading,
    progressPercent,
    initSession,
    submitAnswer,
    goToPreviousQuestion,
    resetFlow
  } = useQuestionFlow();

  const handleBackToLogin = () => {
    setLocation("/");
  };

  const handleContinueRecovery = () => {
    if (!email.trim()) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive"
      });
      return;
    }

    // Show loading state before showing questions
    setRecoveryStep("loading");
    
    // Initialize the question session
    initSession();
    
    // Simulate delay before showing questions
    setTimeout(() => {
      setRecoveryStep("questions");
    }, 2000);
  };

  const handleCompleteVerification = () => {
    setRecoveryStep("loading");
    
    // Simulating final processing
    setTimeout(() => {
      setRecoveryStep("final");
    }, 5000);
  };

  const handleStartOver = () => {
    resetFlow();
    setRecoveryStep("initial");
    setEmail("");
    setLocation("/");
  };

  // Apply progressively weirder styles based on question index
  const containerClassName = () => {
    let className = "max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300";
    
    if (currentQuestionIndex >= 3) {
      className += " border-2 border-secondary";
    }
    
    if (currentQuestionIndex >= 5) {
      className += " transform";
    }
    
    return className;
  };

  const containerStyle = () => {
    if (currentQuestionIndex >= 5 && currentQuestionIndex < 10) {
      return { transform: `rotate(${(currentQuestionIndex - 5) * 0.5}deg)` };
    }
    return {};
  };

  return (
    <div className="bg-neutral-50 min-h-screen font-sans text-gray-800 flex items-center justify-center p-4">
      <div className="container mx-auto">
        <Card className={containerClassName()} style={containerStyle()}>
          {recoveryStep === "initial" && (
            <CardContent className="p-6">
              <div className="flex items-center mb-6">
                <button
                  onClick={handleBackToLogin}
                  className="text-gray-500 hover:text-gray-700 mr-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-semibold">Account Recovery</h2>
              </div>
              <p className="text-gray-600 mb-4">
                Please enter your email address to verify your identity.
              </p>
              <div className="space-y-4">
                <div>
                  <label htmlFor="recovery-email" className="block text-sm font-medium mb-1">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    id="recovery-email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <Button
                    onClick={handleContinueRecovery}
                    className="w-full"
                  >
                    Continue
                  </Button>
                </div>
              </div>
            </CardContent>
          )}

          {recoveryStep === "loading" && (
            <LoadingState 
              initialMessage={
                currentQuestionIndex === 0 
                  ? "Searching for your account..." 
                  : currentQuestionIndex === totalQuestions 
                    ? "Finalizing your verification..." 
                    : "Processing your answer..."
              } 
              isFinal={currentQuestionIndex === totalQuestions}
            />
          )}

          {recoveryStep === "questions" && (
            <>
              {/* Progress bar */}
              <div className="px-6 pt-6">
                <div className="flex justify-between items-center mb-2">
                  <button
                    onClick={goToPreviousQuestion}
                    className={`text-gray-500 hover:text-gray-700 ${
                      currentQuestionIndex === 1 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={currentQuestionIndex === 1}
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="text-sm font-medium text-gray-500">
                    Question <span>{currentQuestionIndex}</span> of <span>{totalQuestions}</span>
                  </div>
                  <div className="w-5"></div> {/* Empty div for flex alignment */}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-primary h-2.5 rounded-full transition-all duration-300" 
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
              </div>

              {/* Question Container */}
              <div className="p-6">
                {currentQuestion && (
                  <SecurityQuestion
                    question={currentQuestion}
                    absurdityLevel={currentQuestion.absurdityLevel}
                    petName={answeredQuestions[1]?.answerText || "Fluffy"}
                    onSubmit={(answer) => {
                      submitAnswer(answer);
                      
                      if (currentQuestionIndex === totalQuestions) {
                        handleCompleteVerification();
                      }
                    }}
                    isLast={currentQuestionIndex === totalQuestions}
                  />
                )}
              </div>
            </>
          )}

          {recoveryStep === "final" && (
            <FinalMessage onStartOver={handleStartOver} />
          )}
        </Card>
      </div>
    </div>
  );
}
