import { 
  securityQuestions, 
  userAnswers, 
  type Question, 
  type InsertQuestion,
  type Answer,
  type InsertAnswer 
} from "@shared/schema";

export interface IStorage {
  getQuestions(): Promise<Question[]>;
  getQuestionById(id: number): Promise<Question | undefined>;
  createQuestion(question: InsertQuestion): Promise<Question>;
  getAllAnswersForSession(sessionId: string): Promise<Answer[]>;
  saveAnswer(answer: InsertAnswer): Promise<Answer>;
}

export class MemStorage implements IStorage {
  private questions: Map<number, Question>;
  private answers: Map<string, Answer[]>;
  private questionIdCounter: number;
  private answerIdCounter: number;

  constructor() {
    this.questions = new Map();
    this.answers = new Map();
    this.questionIdCounter = 1;
    this.answerIdCounter = 1;
    
    // Seed initial questions with the current timestamp to ensure randomness
    this.seedQuestions(Date.now());
  }

  async getQuestions(): Promise<Question[]> {
    return Array.from(this.questions.values()).sort((a, b) => a.order - b.order);
  }

  async getQuestionById(id: number): Promise<Question | undefined> {
    return this.questions.get(id);
  }

  async createQuestion(question: InsertQuestion): Promise<Question> {
    const id = this.questionIdCounter++;
    // Ensure options is an array and not undefined
    const options = question.options || [];
    const newQuestion: Question = { ...question, options, id };
    this.questions.set(id, newQuestion);
    return newQuestion;
  }

  async getAllAnswersForSession(sessionId: string): Promise<Answer[]> {
    return this.answers.get(sessionId) || [];
  }

  async saveAnswer(answer: InsertAnswer): Promise<Answer> {
    const id = this.answerIdCounter++;
    const newAnswer: Answer = { ...answer, id };
    
    // Initialize session answers array if it doesn't exist
    if (!this.answers.has(answer.sessionId)) {
      this.answers.set(answer.sessionId, []);
    }
    
    // Add answer to session
    const sessionAnswers = this.answers.get(answer.sessionId)!;
    sessionAnswers.push(newAnswer);
    
    return newAnswer;
  }

  private seedQuestions(seed: number = Date.now()) {
    // Use the seed to create a simple seeded random function
    const seededRandom = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    // Predefined questions for testing - we'll pick 10 random questions from this larger set
    const questionPool: InsertQuestion[] = [
      // Basic questions (absurdity level 1-3)
      {
        questionText: "What was the name of your first pet?",
        questionType: "text",
        options: [],
        order: 1,
        absurdityLevel: 1
      },
      {
        questionText: "What street did you grow up on?",
        questionType: "text",
        options: [],
        order: 1,
        absurdityLevel: 1
      },
      {
        questionText: "What was your mother's maiden name?",
        questionType: "text",
        options: [],
        order: 1,
        absurdityLevel: 1
      },
      {
        questionText: "What is the 17th digit of π?",
        questionType: "radio",
        options: ["9", "5", "3", "I don't memorize irrational numbers"],
        order: 2,
        absurdityLevel: 3
      },
      {
        questionText: "What is the name of the invisible friend you had as a child?",
        questionType: "text",
        options: [],
        order: 2,
        absurdityLevel: 3
      },
      {
        questionText: "What mathematical equation do you find most attractive?",
        questionType: "radio",
        options: ["E=mc²", "Pythagorean theorem", "Fibonacci sequence", "Math gives me hives"],
        order: 2,
        absurdityLevel: 3
      },
      
      // Medium questions (absurdity level 4-6)
      {
        questionText: "If your password was a sandwich, what kind would it be?",
        questionType: "text",
        options: [],
        order: 3,
        absurdityLevel: 4
      },
      {
        questionText: "What would your password wear to a formal dinner party?",
        questionType: "select",
        options: [
          "A classic tuxedo",
          "An elegant evening gown",
          "Jeans and a t-shirt (it's rebellious)",
          "Birthday suit (it's a nudist)",
          "A tin foil hat (for security)"
        ],
        order: 3,
        absurdityLevel: 4
      },
      {
        questionText: "How many times did you lie on forms today?",
        questionType: "radio",
        options: [
          "Never (I'm honest)",
          "1-3 times (rookie numbers)",
          "4+ times (professional)",
          "I'm lying right now"
        ],
        order: 4,
        absurdityLevel: 5
      },
      {
        questionText: "How would you describe your password's personality?",
        questionType: "select",
        options: [
          "Strong and silent type",
          "Bubbly and outgoing",
          "Mysterious and complicated",
          "Boring but reliable",
          "Chaotic evil"
        ],
        order: 4,
        absurdityLevel: 5
      },
      {
        questionText: "In the event of a zombie apocalypse, what would be your weapon of choice?",
        questionType: "select",
        options: [
          "Baseball bat",
          "Chainsaw",
          "Katana",
          "My bare hands"
        ],
        order: 5,
        absurdityLevel: 6
      },
      {
        questionText: "If your password was an ice cream flavor, what would it be?",
        questionType: "text",
        options: [],
        order: 5,
        absurdityLevel: 6
      },
      {
        questionText: "What's your password's greatest fear?",
        questionType: "radio",
        options: [
          "Being forgotten",
          "Being written down on a Post-it note",
          "Being too simple",
          "Password managers (they're taking our jobs!)"
        ],
        order: 5,
        absurdityLevel: 6
      },
      
      // Advanced questions (absurdity level 7-10)
      {
        questionText: "What did your pet [PET_NAME] think of your first password?",
        questionType: "radio",
        options: [
          "They loved it",
          "They thought it was too predictable",
          "They suggested I add more special characters",
          "They tried to eat my keyboard"
        ],
        order: 6,
        absurdityLevel: 7
      },
      {
        questionText: "If your password was running for political office, what would be its campaign slogan?",
        questionType: "text",
        options: [],
        order: 7,
        absurdityLevel: 7
      },
      {
        questionText: "Please draw a picture of your password in your mind. On a scale of 1-10, how beautiful was it?",
        questionType: "range",
        options: [],
        order: 8,
        absurdityLevel: 8
      },
      {
        questionText: "If your consciousness was uploaded to the cloud, what would be your new username?",
        questionType: "text",
        options: [],
        order: 9,
        absurdityLevel: 8
      },
      {
        questionText: "If your password had a theme song, which genre would it be?",
        questionType: "checkbox",
        options: [
          "Classical",
          "Rock",
          "Hip hop",
          "Country",
          "Electronic"
        ],
        order: 8,
        absurdityLevel: 8
      },
      {
        questionText: "Which of these dreams has your password had recently?",
        questionType: "checkbox",
        options: [
          "Flying through the internet",
          "Being replaced by a stronger password",
          "Dating other passwords from different websites",
          "World domination",
          "Just trying to be remembered"
        ],
        order: 8,
        absurdityLevel: 8
      },
      {
        questionText: "URGENT: Your password is feeling insecure. Write it a compliment:",
        questionType: "text",
        options: [],
        order: 9,
        absurdityLevel: 9
      },
      {
        questionText: "Your password has started a support group. What is it called?",
        questionType: "text",
        options: [],
        order: 9,
        absurdityLevel: 9
      },
      {
        questionText: "Final security verification: The most embarrassing thing I've ever done while no one was watching is...",
        questionType: "text",
        options: [],
        order: 10,
        absurdityLevel: 10
      },
      {
        questionText: "If your password could see what websites you visit, what would it think of you?",
        questionType: "text",
        options: [],
        order: 10,
        absurdityLevel: 10
      }
    ];
    
    // Select 10 questions, ensuring we maintain a progression of absurdity
    const selectedQuestions: InsertQuestion[] = [];
    
    // Add one question from each absurdity level (1-10)
    for (let level = 1; level <= 10; level++) {
      const questionsAtLevel = questionPool.filter(q => q.absurdityLevel === level);
      if (questionsAtLevel.length > 0) {
        const randomIndex = Math.floor(seededRandom() * questionsAtLevel.length);
        const selected = {...questionsAtLevel[randomIndex]};
        selected.order = level; // Ensure order matches the loop iteration
        
        // Skip pet name-related question if it has [PET_NAME]
        if (selected.questionText.includes("[PET_NAME]")) {
          // Try again with a different question if possible
          if (questionsAtLevel.length > 1) {
            let newIndex;
            do {
              newIndex = Math.floor(seededRandom() * questionsAtLevel.length);
            } while (newIndex === randomIndex);
            selected.questionText = questionsAtLevel[newIndex].questionText;
            selected.options = [...(questionsAtLevel[newIndex].options || [])];
          } else {
            // Replace [PET_NAME] with "a pet" if no alternative
            selected.questionText = selected.questionText.replace("[PET_NAME]", "a pet");
          }
        }
        
        selectedQuestions.push(selected);
      }
    }
    
    // If we don't have 10 questions yet (due to missing absurdity levels), fill in with any remaining
    while (selectedQuestions.length < 10) {
      const remainingQuestions = questionPool.filter(q => 
        !selectedQuestions.some(selected => selected.questionText === q.questionText)
      );
      if (remainingQuestions.length === 0) break;
      
      const randomIndex = Math.floor(seededRandom() * remainingQuestions.length);
      const selected = {...remainingQuestions[randomIndex]};
      
      // Check for [PET_NAME] in this question too
      if (selected.questionText.includes("[PET_NAME]")) {
        // Try to find a non-pet alternative
        const nonPetOptions = remainingQuestions.filter(q => !q.questionText.includes("[PET_NAME]"));
        if (nonPetOptions.length > 0) {
          const newIndex = Math.floor(seededRandom() * nonPetOptions.length);
          selected.questionText = nonPetOptions[newIndex].questionText;
          selected.options = [...(nonPetOptions[newIndex].options || [])];
        } else {
          // If no alternatives, replace [PET_NAME] with "a pet"
          selected.questionText = selected.questionText.replace("[PET_NAME]", "a pet");
        }
      }
      
      // Find the next available order number
      const usedOrders = selectedQuestions.map(q => q.order);
      for (let i = 1; i <= 10; i++) {
        if (!usedOrders.includes(i)) {
          selected.order = i;
          break;
        }
      }
      
      selectedQuestions.push(selected);
    }
    
    // Sort by order for consistency
    selectedQuestions.sort((a, b) => a.order - b.order);
    
    // Create the questions
    selectedQuestions.forEach(question => {
      this.createQuestion(question);
    });
  }
}

export const storage = new MemStorage();
