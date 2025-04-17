import { SecurityQuestion } from "@shared/schema";

export const mockResponses = {
  petName: [
    "That's a cute name! Our security team will verify with your pet directly.",
    "Hmm, your pet might not appreciate you sharing their name so easily.",
    "I'm forwarding this information to all pet-related security agencies.",
    "Did you just share your pet's name with a stranger? Tsk tsk...",
    "Your pet just logged in using that name as a password! Oh wait, false alarm."
  ],
  sandwich: [
    "That sounds delicious! Your password seems tastier than most.",
    "Security note: Passwords should not be edible, even metaphorically.",
    "Our analysis shows 72% of hackers prefer that exact sandwich. Concerning.",
    "We've added your sandwich to our 'Passwords That Make Us Hungry' database.",
    "Your sandwich choice has been flagged by the Culinary Security Administration."
  ],
  pi: [
    "We're impressed. Most people don't even know there are 17 digits in π.",
    "Fun fact: Memorizing digits of π is inversely correlated with having friends.",
    "Our mathematicians are questioning your answer, but they question everything.",
    "π-based security is the future! Or so our eccentric CTO keeps insisting."
  ],
  lies: [
    "Your honesty about dishonesty is refreshing!",
    "We've added this to your permanent record. Just kidding, we don't have those... or do we?",
    "Statistically, you're probably lying about how much you lie.",
    "Our lie detectors are beeping wildly right now. Interesting!"
  ],
  zombie: [
    "Interesting choice! Our security team is concerned about your apocalypse preparedness.",
    "That weapon wouldn't last against our security team. I mean... zombies.",
    "Your choice has been added to your psychological profile. No reason.",
    "9 out of 10 zombie survival experts question your decision."
  ],
  petPassword: [
    "We've notified your pet about this serious privacy breach.",
    "Your pet has requested two-factor authentication after this incident.",
    "We've cross-referenced this with your pet's diary. The stories match.",
    "Your pet seems to have better security practices than you do."
  ],
  passwordBeauty: [
    "Beauty is in the eye of the beholder, especially for passwords.",
    "We've added your password to a museum of digital art. Anonymously, of course.",
    "Our AI can't stop crying after seeing how beautiful your password visualization is.",
    "Studies show password aesthetics directly correlate with security. Or not."
  ],
  music: [
    "Your password's playlist has been updated accordingly.",
    "Our security DJ approves of your musical taste.",
    "We're concerned your password might start dancing and compromise security.",
    "Your password's musical preferences have been noted for future reference."
  ],
  complaint: [
    "Your password appreciates the kind words!",
    "We've forwarded your compliment to your password. It's feeling much better now.",
    "Your password is blushing. How cute!",
    "Your password's therapist says this compliment is a breakthrough moment.",
    "Password confidence levels improved by 150%! Security enhanced!"
  ],
  embarrassing: [
    "Wow. Just... wow. This will be securely stored in our 'Blackmail Material' database.",
    "Our moderators are currently laughing hysterically. Thanks for that!",
    "This confession has been automatically forwarded to all your contacts. Just kidding! Or are we?",
    "We've matched this confession with 7 similar incidents in our database. You're not alone.",
    "This story has earned you VIP status in our 'Humans Are Weird' club."
  ],
  generic: [
    "Fascinating choice! Our AI will analyze this... thoroughly.",
    "I see you're taking this very seriously. Good for you!",
    "That's an interesting approach to security verification!",
    "Our security team is both impressed and concerned by your answer.",
    "We've added this to your psychological profile. For security reasons, of course.",
    "This answer reveals more about you than you might think...",
    "Hmm, that's exactly what a hacker would say. But also exactly what a legitimate user might say.",
    "Your answer has been flagged for being too reasonable for this absurd process."
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
    case 2: // Pi digit
      return getRandomResponse("pi");
    case 3: // Password sandwich
      return getRandomResponse("sandwich");
    case 4: // Lying on forms
      return getRandomResponse("lies");
    case 5: // Zombie weapon
      return getRandomResponse("zombie");
    case 6: // Pet password opinion
      return getRandomResponse("petPassword");
    case 7: // Password beauty
      return getRandomResponse("passwordBeauty");
    case 8: // Password music
      return getRandomResponse("music");
    case 9: // Password compliment
      return getRandomResponse("complaint");
    case 10: // Embarrassing story
      return getRandomResponse("embarrassing");
    default:
      return getRandomResponse("generic");
  }
}
