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
      
      // Import witty response function from client-side code 
      // to ensure consistent responses across frontend/backend
      const { getWittyResponse } = require("../client/src/lib/questions");
      let responseMessage = getWittyResponse(question.questionType, answer, questionId);
      
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
