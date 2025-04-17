import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { nanoid } from "nanoid";
import { answerSubmissionSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for security questions
  
  // Get all security questions
  app.get("/api/questions", async (_req: Request, res: Response) => {
    try {
      const questions = await storage.getQuestions();
      res.json(questions);
    } catch (error) {
      console.error("Error fetching questions:", error);
      res.status(500).json({ message: "Failed to fetch security questions" });
    }
  });

  // Get a specific question by ID
  app.get("/api/questions/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid question ID" });
      }

      const question = await storage.getQuestionById(id);
      if (!question) {
        return res.status(404).json({ message: "Question not found" });
      }

      res.json(question);
    } catch (error) {
      console.error("Error fetching question:", error);
      res.status(500).json({ message: "Failed to fetch question" });
    }
  });

  // Submit an answer
  app.post("/api/answers", async (req: Request, res: Response) => {
    try {
      const validationResult = answerSubmissionSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        const errorMessage = fromZodError(validationResult.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      
      const { questionId, answer, sessionId } = validationResult.data;
      
      // Validate that the question exists
      const question = await storage.getQuestionById(questionId);
      if (!question) {
        return res.status(404).json({ message: "Question not found" });
      }
      
      // Save the answer
      const savedAnswer = await storage.saveAnswer({
        questionId,
        answerText: answer,
        sessionId,
        timestamp: new Date().toISOString()
      });
      
      // Generate some witty response based on the answer
      let responseMessage = "";
      
      switch (question.questionType) {
        case "text":
          if (answer.trim().length < 3) {
            responseMessage = "That's... surprisingly brief. Are you hiding something?";
          } else if (answer.trim().length > 50) {
            responseMessage = "Wow, somebody likes to type! We appreciate the enthusiasm.";
          } else {
            responseMessage = "Interesting choice. Our AI will judge this... I mean, verify this shortly.";
          }
          break;
          
        case "radio":
        case "select":
          // Get random response for multiple choice
          const multipleChoiceResponses = [
            "An excellent choice! Or is it?",
            "Really? That's what you're going with?",
            "Our security experts are very impressed with this selection.",
            "That's exactly what someone trying to hack an account would choose!"
          ];
          responseMessage = multipleChoiceResponses[Math.floor(Math.random() * multipleChoiceResponses.length)];
          break;
          
        case "checkbox":
          if (answer.includes(",")) {
            responseMessage = "Choosing multiple options? Overachiever!";
          } else {
            responseMessage = "Just one option? Playing it safe, aren't we?";
          }
          break;
          
        case "range":
          const rating = parseInt(answer);
          if (rating <= 3) {
            responseMessage = "Such a harsh critic of your own password!";
          } else if (rating >= 8) {
            responseMessage = "Someone's quite proud of their password artistry!";
          } else {
            responseMessage = "A middle-of-the-road password artist. Not bad.";
          }
          break;
      }
      
      res.json({ 
        success: true, 
        message: responseMessage,
        nextQuestionId: question.order < 10 ? question.order + 1 : null
      });
      
    } catch (error) {
      console.error("Error submitting answer:", error);
      res.status(500).json({ message: "Failed to submit answer" });
    }
  });
  
  // Create a new session
  app.post("/api/sessions", async (_req: Request, res: Response) => {
    try {
      const sessionId = nanoid();
      res.json({ sessionId });
    } catch (error) {
      console.error("Error creating session:", error);
      res.status(500).json({ message: "Failed to create session" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
