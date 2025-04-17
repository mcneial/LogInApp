import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const securityQuestions = pgTable("security_questions", {
  id: serial("id").primaryKey(),
  questionText: text("question_text").notNull(),
  questionType: text("question_type").notNull(), // "text", "radio", "checkbox", "range", "select"
  options: text("options").array(), // For radio, checkbox, select types
  order: integer("order").notNull(),
  absurdityLevel: integer("absurdity_level").notNull(), // 1-10 scale of absurdity
});

export const userAnswers = pgTable("user_answers", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  questionId: integer("question_id").notNull(),
  answerText: text("answer_text").notNull(),
  timestamp: text("timestamp").notNull(),
});

export const insertQuestionSchema = createInsertSchema(securityQuestions).omit({
  id: true,
});

export const insertAnswerSchema = createInsertSchema(userAnswers).omit({
  id: true,
});

export type InsertQuestion = z.infer<typeof insertQuestionSchema>;
export type Question = typeof securityQuestions.$inferSelect;
export type InsertAnswer = z.infer<typeof insertAnswerSchema>;
export type Answer = typeof userAnswers.$inferSelect;

// Client-side schema extensions
export const securityQuestionSchema = z.object({
  id: z.number(),
  questionText: z.string(),
  questionType: z.enum(['text', 'radio', 'checkbox', 'range', 'select']),
  options: z.array(z.string()).optional(),
  order: z.number(),
  absurdityLevel: z.number(),
  responseMessages: z.array(z.string()).optional(),
});

export const answerSubmissionSchema = z.object({
  questionId: z.number(),
  answer: z.string(),
  sessionId: z.string(),
});

export type SecurityQuestion = z.infer<typeof securityQuestionSchema>;
export type AnswerSubmission = z.infer<typeof answerSubmissionSchema>;
