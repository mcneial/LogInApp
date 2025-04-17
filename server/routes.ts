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
          // Get question from database to check its text for more varied responses
          const question = await storage.getQuestionById(questionId);
          
          // Specific responses based on the question text and answer
          if (question?.questionText.includes("lie on forms")) { // Lying on forms
            if (answer === "Never (I'm honest)") {
              responseMessage = "That's obviously a lie. No one is that honest on forms.";
            } else if (answer === "1-3 times (rookie numbers)") {
              responseMessage = "At least you're honest about your dishonesty. We appreciate the paradox.";
            } else if (answer === "4+ times (professional)") {
              responseMessage = "A professional liar! Your ability to lie about lying is impressive.";
            } else if (answer === "I'm lying right now") {
              responseMessage = "If you're lying about lying, are you actually telling the truth? Our security AI is having an existential crisis.";
            }
          } else if (question?.questionText.includes("zombie apocalypse")) { // Zombie weapon
            if (answer === "Baseball bat") {
              responseMessage = "Classic choice! Though our security team rates this a 3/10 for zombie defense. Try adding nails next time.";
            } else if (answer === "Chainsaw") {
              responseMessage = "Loud and messy. You'd attract more zombies AND run out of gas. Your password is judging your survival skills.";
            } else if (answer === "Katana") {
              responseMessage = "While you studied security questions, your password studied the blade. *Tips fedora*";
            } else if (answer === "My bare hands") {
              responseMessage = "Bold strategy! We've noted your overconfidence in our 'Will Be Zombie Food First' database.";
            } else if (answer === "Frying pan") {
              responseMessage = "Ah, the PUBG strategy. Hope you've been practicing your aim.";
            } else if (answer === "Biting sarcasm") {
              responseMessage = "Zombies are notably immune to sarcasm, but your wit is appreciated in our office.";
            } else if (answer === "Keyboard warrior skills") {
              responseMessage = "You plan to type the zombies to death? Bold strategy. Let us know how that works out.";
            }
          } else if (question?.questionText.includes("pet") && question?.questionText.includes("password")) { // Pet password opinion
            if (answer === "They loved it") {
              responseMessage = "Your pet has surprisingly low security standards. We're concerned.";
            } else if (answer === "They thought it was too predictable") {
              responseMessage = "Your pet is more security-conscious than most of our human users. Consider letting them manage your accounts.";
            } else if (answer === "They suggested I add more special characters") {
              responseMessage = "Ah, your pet must be a cybersecurity professional. Those special characters will protect against their claws.";
            } else if (answer === "They tried to eat my keyboard") {
              responseMessage = "Keyboard eating: the most secure way to prevent password theft. Your pet is a security genius.";
            } else if (answer === "They never saw it (I'm security conscious)") {
              responseMessage = "Trust issues with your own pet? Smart. They're probably selling your data to Petflix.";
            } else if (answer === "Wait, my pet can read?") {
              responseMessage = "Plot twist: Your pet has been reading your diary for years. Nothing is safe.";
            }
          } else if (question?.questionText.includes("theme song") || question?.questionText.includes("genre")) { // Password music
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
            } else if (answer && answer.includes("Heavy Metal")) {
              responseMessage = "Your password is now dressed all in black and refuses to talk to the other passwords.";
            } else if (answer && answer.includes("Silent movie")) {
              responseMessage = "Your password is now communicating solely through exaggerated gestures and title cards.";
            } else if (answer && answer.includes("Pop")) {
              responseMessage = "Your password just got a record deal and is moving to LA. Say goodbye to your data.";
            } else {
              responseMessage = "Your password's musical choices have been noted, though it seems to have eclectic taste.";
            }
          } else if (question?.questionText.includes("17th digit of π")) { // Pi question
            if (answer === "9") {
              responseMessage = "Either you're a math genius or you're really good at guessing. We're suspicious.";
            } else if (answer === "5") {
              responseMessage = "Did you just look that up? We're monitoring your search history, you know.";
            } else if (answer === "3") {
              responseMessage = "Interesting choice. 3 is in π, just not at the 17th position. We appreciate the effort though.";
            } else if (answer === "I don't memorize irrational numbers") {
              responseMessage = "A reasonable stance. Yet, somehow disappointing for our security algorithm.";
            }
          } else if (question?.questionText.includes("mathematical equation")) { // Math equation
            if (answer === "E=mc²") {
              responseMessage = "Classic choice. Your password is relatively secure now. Get it? Relatively?";
            } else if (answer === "Pythagorean theorem") {
              responseMessage = "Right-angled thinking! Your password feels more balanced already.";
            } else if (answer === "Fibonacci sequence") {
              responseMessage = "Your security is now growing at an exponential rate. Or a Fibonacci rate, to be precise.";
            } else if (answer === "Math gives me hives") {
              responseMessage = "We've prescribed some anti-mathematical cream for your condition. Apply liberally to all calculations.";
            }
          } else if (question?.questionText.includes("password wear")) { // Password formal wear
            if (answer === "A classic tuxedo") {
              responseMessage = "Your password is now the most elegant code at the ball. The other passwords are jealous.";
            } else if (answer === "An elegant evening gown") {
              responseMessage = "Your password just turned every head in the database. Scandalous!";
            } else if (answer === "Jeans and a t-shirt (it's rebellious)") {
              responseMessage = "Your password was denied entry to the data gala. It's now starting its own cooler party.";
            } else if (answer === "Birthday suit (it's a nudist)") {
              responseMessage = "We've had to censor your password in our database. Think of the children!";
            } else if (answer === "A tin foil hat (for security)") {
              responseMessage = "Your password can now block government mind control rays, but it looks ridiculous at parties.";
            }
          } else if (question?.questionText.includes("password's personality")) { // Password personality
            if (answer === "Strong and silent type") {
              responseMessage = "Your password just nodded slightly in acknowledgment. That's as emotional as it gets.";
            } else if (answer === "Bubbly and outgoing") {
              responseMessage = "Your password is now friends with every other password in the database. Security breach imminent.";
            } else if (answer === "Mysterious and complicated") {
              responseMessage = "Even we don't understand your password, and we created it. Impressive!";
            } else if (answer === "Boring but reliable") {
              responseMessage = "Your password will always be there for you. Unlike your ex.";
            } else if (answer === "Chaotic evil") {
              responseMessage = "Your password just set fire to our server room. Thanks for that.";
            }
          } else if (question?.questionText.includes("password's greatest fear")) { // Password fear
            if (answer === "Being forgotten") {
              responseMessage = "Your password is crying in the corner now. We hope you're happy.";
            } else if (answer === "Being written down on a Post-it note") {
              responseMessage = "Your password is now having nightmares about yellow squares. Thanks a lot.";
            } else if (answer === "Being too simple") {
              responseMessage = "Your password is having an existential crisis now. 'Am I complex enough to exist?'";
            } else if (answer === "Password managers (they're taking our jobs!)") {
              responseMessage = "Your password has joined a protest against automation. It's carrying a tiny sign.";
            }
          } else if (question?.questionText.includes("password's dreams")) { // Password dreams
            if (answer && answer.includes("Flying through the internet")) {
              responseMessage = "Your password needs to be careful. The internet is a dangerous place for unsupervised alphanumerics.";
            } else if (answer && answer.includes("Being replaced")) {
              responseMessage = "Your password has abandonment issues. Consider therapy.";
            } else if (answer && answer.includes("Dating other passwords")) {
              responseMessage = "We don't recommend cross-site password relationships. They never end well.";
            } else if (answer && answer.includes("World domination")) {
              responseMessage = "We're now monitoring your password for signs of megalomaniacal behavior.";
            } else if (answer && answer.includes("remembered")) {
              responseMessage = "Your password just wants to be loved. Is that too much to ask?";
            } else {
              responseMessage = "Your password's dreams are both fascinating and concerning.";
            }
          } else {
            // Fallback random responses
            const multipleChoiceResponses = [
              "An excellent choice! Or is it?",
              "Really? That's what you're going with?",
              "Our security experts are very impressed with this selection.",
              "That's exactly what someone trying to hack an account would choose!",
              "Fascinating selection. We're adding this to your psychological profile.",
              "This answer will be referenced in your upcoming psychological evaluation.",
              "Our AI just spit out its virtual coffee reading this response.",
              "Your answer has been flagged for being suspiciously normal.",
              "This is going in your permanent record. Yes, we keep one of those."
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
