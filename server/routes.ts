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
          // Specific responses based on the question ID and actual answer
          if (questionId === 4) { // Lying on forms
            if (answer === "Never (I'm honest)") {
              responseMessage = "That's obviously a lie. No one is that honest on forms.";
            } else if (answer === "1-3 times (rookie numbers)") {
              responseMessage = "At least you're honest about your dishonesty. We appreciate the paradox.";
            } else if (answer === "4+ times (professional)") {
              responseMessage = "A professional liar! Your ability to lie about lying is impressive.";
            } else if (answer === "I'm lying right now") {
              responseMessage = "If you're lying about lying, are you actually telling the truth? Our security AI is having an existential crisis.";
            }
          } else if (questionId === 5) { // Zombie weapon
            if (answer === "Baseball bat") {
              responseMessage = "Classic choice! Though our security team rates this a 3/10 for zombie defense. Try adding nails next time.";
            } else if (answer === "Chainsaw") {
              responseMessage = "Loud and messy. You'd attract more zombies AND run out of gas. Your password is judging your survival skills.";
            } else if (answer === "Katana") {
              responseMessage = "While you studied security questions, your password studied the blade. *Tips fedora*";
            } else if (answer === "My bare hands") {
              responseMessage = "Bold strategy! We've noted your overconfidence in our 'Will Be Zombie Food First' database.";
            }
          } else if (questionId === 6) { // Pet password opinion
            if (answer === "They loved it") {
              responseMessage = "Your pet has surprisingly low security standards. We're concerned.";
            } else if (answer === "They thought it was too predictable") {
              responseMessage = "Your pet is more security-conscious than most of our human users. Consider letting them manage your accounts.";
            } else if (answer === "They suggested I add more special characters") {
              responseMessage = "Ah, your pet must be a cybersecurity professional. Those special characters will protect against their claws.";
            } else if (answer === "They tried to eat my keyboard") {
              responseMessage = "Keyboard eating: the most secure way to prevent password theft. Your pet is a security genius.";
            }
          } else if (questionId === 8) { // Password music
            if (answer && answer.includes("Classical")) {
              responseMessage = "Your password appreciates the sophistication. It's wearing a monocle now.";
            } else if (answer && answer.includes("Rock")) {
              responseMessage = "Your password is headbanging so hard, it might break its encryption.";
            } else if (answer && answer.includes("Hip hop")) {
              responseMessage = "Your password's mixtape is fire. Literally. Our servers are overheating.";
            } else if (answer && answer.includes("Country")) {
              responseMessage = "Your password just put on a cowboy hat and started singing about broken relationships.";
            } else if (answer && answer.includes("Electronic")) {
              responseMessage = "Your password is now blinking in sync with a 140 BPM techno beat. It's quite distracting.";
            } else {
              responseMessage = "Your password's musical choices have been noted, though it seems to have eclectic taste.";
            }
          } else {
            // Fallback random responses
            const multipleChoiceResponses = [
              "An excellent choice! Or is it?",
              "Really? That's what you're going with?",
              "Our security experts are very impressed with this selection.",
              "That's exactly what someone trying to hack an account would choose!",
              "Fascinating selection. We're adding this to your psychological profile."
            ];
            responseMessage = multipleChoiceResponses[Math.floor(Math.random() * multipleChoiceResponses.length)];
          }
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
