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
    
    // Seed initial questions
    this.seedQuestions();
  }

  async getQuestions(): Promise<Question[]> {
    return Array.from(this.questions.values()).sort((a, b) => a.order - b.order);
  }

  async getQuestionById(id: number): Promise<Question | undefined> {
    return this.questions.get(id);
  }

  async createQuestion(question: InsertQuestion): Promise<Question> {
    const id = this.questionIdCounter++;
    const newQuestion: Question = { ...question, id };
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

  private seedQuestions() {
    const predefinedQuestions: InsertQuestion[] = [
      {
        questionText: "What was the name of your first pet?",
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
        questionText: "If your password was a sandwich, what kind would it be?",
        questionType: "text",
        options: [],
        order: 3,
        absurdityLevel: 4
      },
      {
        questionText: "How many times did you lie on forms today?",
        questionType: "radio",
        options: [
          "None, I am a paragon of honesty",
          "1-3 times (rookie numbers)",
          "4+ times (professional)",
          "I'm lying right now"
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
          "Frying pan",
          "Biting sarcasm",
          "Keyboard warrior skills"
        ],
        order: 5,
        absurdityLevel: 6
      },
      {
        questionText: "What did your pet [PET_NAME] think of your first password?",
        questionType: "radio",
        options: [
          "They loved it",
          "They thought it was too predictable",
          "They never saw it (I'm security conscious)",
          "Wait, my pet can read?"
        ],
        order: 6,
        absurdityLevel: 7
      },
      {
        questionText: "Please draw a picture of your password in your mind. On a scale of 1-10, how beautiful was it?",
        questionType: "range",
        options: [],
        order: 7,
        absurdityLevel: 8
      },
      {
        questionText: "If your password had a theme song, which genre would it be?",
        questionType: "checkbox",
        options: [
          "Classical (so sophisticated!)",
          "Heavy Metal (secure but hard to remember)",
          "Pop (probably too common)",
          "Silent movie soundtrack (you use 'password123', don't you?)"
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
        questionText: "Final security verification: The most embarrassing thing I've ever done while no one was watching is...",
        questionType: "text",
        options: [],
        order: 10,
        absurdityLevel: 10
      }
    ];

    predefinedQuestions.forEach(question => {
      this.createQuestion(question);
    });
  }
}

export const storage = new MemStorage();
