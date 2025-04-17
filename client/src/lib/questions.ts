import { SecurityQuestion } from "@shared/schema";

export const mockResponses = {
  petName: [
    "That's a cute name! Our security team will verify with your pet directly.",
    "Hmm, your pet might not appreciate you sharing their name so easily.",
    "I'm forwarding this information to all pet-related security agencies."
  ],
  sandwich: [
    "That sounds delicious! Your password seems tastier than most.",
    "Security note: Passwords should not be edible, even metaphorically.",
    "Our analysis shows 72% of hackers prefer that exact sandwich. Concerning."
  ],
  complaint: [
    "Your password appreciates the kind words!",
    "We've forwarded your compliment to your password. It's feeling much better now.",
    "Your password is blushing. How cute!"
  ],
  embarrassing: [
    "Wow. Just... wow. This will be securely stored in our 'Blackmail Material' database.",
    "Our moderators are currently laughing hysterically. Thanks for that!",
    "This confession has been automatically forwarded to all your contacts. Just kidding! Or are we?"
  ],
  generic: [
    "Fascinating choice! Our AI will analyze this... thoroughly.",
    "I see you're taking this very seriously. Good for you!",
    "That's an interesting approach to security verification!"
  ]
};

export function getRandomResponse(type: keyof typeof mockResponses): string {
  const responses = mockResponses[type];
  return responses[Math.floor(Math.random() * responses.length)];
}

export function getWittyResponse(questionType: string, answer: string, questionId: number): string {
  // Return different responses based on question ID and answer content
  switch (questionId) {
    case 1: // Pet name
      return getRandomResponse("petName");
    case 3: // Password sandwich
      return getRandomResponse("sandwich");
    case 9: // Password compliment
      return getRandomResponse("complaint");
    case 10: // Embarrassing story
      return getRandomResponse("embarrassing");
    default:
      return getRandomResponse("generic");
  }
}
