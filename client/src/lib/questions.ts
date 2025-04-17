import { SecurityQuestion } from "@shared/schema";

export const mockResponses = {
  // Original responses
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
  
  // New responses for additional questions
  childhood: [
    "Ah yes, your imaginary friend has been quite helpful to our investigation.",
    "We've contacted your invisible friend for verification. They didn't respond, strangely.",
    "Your imaginary friend has also been trying to recover their password. Coincidence?",
    "Our system shows your invisible friend has been logging into your account for years.",
    "Your childhood friend is now working in our security department. Small world!"
  ],
  street: [
    "That street has been flagged in our 'Suspiciously Normal Addresses' database.",
    "We've dispatched a security team to verify this street exists. Results pending.",
    "Interesting. That's where our CEO grew up. Are you stalking our CEO?",
    "Our geographical analysis suggests 43% of hackers grew up on streets with that name.",
    "We've added this street to our 'Places to Avoid During the Apocalypse' map."
  ],
  maidenName: [
    "Your mother's maiden name has been added to our 'Things Everyone Knows About You' database.",
    "We're notifying your mother about this security breach immediately.",
    "Did you know that sharing this is equivalent to writing your password on a billboard?",
    "This name has been cross-referenced with our 'Family Secrets' archive. Interesting matches.",
    "Your mother just called us very concerned about your password recovery habits."
  ],
  iceCream: [
    "That flavor sounds delicious and completely insecure as a password!",
    "We've alerted the Ice Cream Security Alliance about your flavor preferences.",
    "Your password's flavor profile has been added to our culinary database.",
    "Our AI predicts you'll change this flavor preference in 3-5 business days.",
    "We're concerned this ice cream might melt, compromising your account security."
  ],
  campaignSlogan: [
    "Your password's political career is off to a promising start!",
    "We've registered your password for the next digital election.",
    "Your password's approval rating just jumped 15 points!",
    "This slogan has been flagged by our 'Passwords With Political Ambitions' department.",
    "Your password has hired a campaign manager and is requesting donations."
  ],
  cloudUsername: [
    "Your digital consciousness username has been reserved for the singularity.",
    "This username has been flagged by our 'Humans Who Are Too Prepared For The Future' department.",
    "The cloud has rejected your username due to 'existential concerns.'",
    "Your digital avatar is now being rendered. Please hold for 47 years.",
    "The AI overlords approve of your choice. That's either good or terrifying."
  ],
  supportGroup: [
    "Your password's support group has 247 members already!",
    "We've signed your password up for the next meeting. It's this Thursday at 7 PM.",
    "Your password's support group has been flagged for 'radical encryption ideologies.'",
    "We've added this group name to our 'Surprisingly Wholesome Security Answers' list.",
    "Your password feels seen and heard for the first time. Healing has begun."
  ],
  websitesJudgment: [
    "Your browsing history has been flagged by your password for 'concerning patterns.'",
    "Your password is writing a tell-all book about your internet habits.",
    "Based on this answer, we've enrolled both you and your password in therapy.",
    "Your password has requested a transfer to a more reputable user.",
    "We've started a support group for passwords exposed to questionable websites."
  ],
  generic: [
    "Fascinating choice! Our AI will analyze this... thoroughly.",
    "I see you're taking this very seriously. Good for you!",
    "That's an interesting approach to security verification!",
    "Our security team is both impressed and concerned by your answer.",
    "We've added this to your psychological profile. For security reasons, of course.",
    "This answer reveals more about you than you might think...",
    "Hmm, that's exactly what a hacker would say. But also exactly what a legitimate user might say.",
    "Your answer has been flagged for being too reasonable for this absurd process.",
    "Our algorithm is questioning if you're a human or just very good at pretending.",
    "This response will be studied by future digital archaeologists.",
    "We've archived this answer in our 'Humans Are Strange' collection.",
    "Your creativity has impressed our AI. It wants to be friends."
  ]
};

export function getRandomResponse(type: keyof typeof mockResponses): string {
  const responses = mockResponses[type];
  return responses[Math.floor(Math.random() * responses.length)];
}

export function getWittyResponse(questionType: string, answer: string, questionId: number, questionText?: string): string {
  // Use questionText for more context-aware responses
  if (questionText) {
    // First pet name, street, or mother's maiden name
    if (questionText.includes("first pet")) {
      return getRandomResponse("petName");
    } else if (questionText.includes("street did you grow up")) {
      return getRandomResponse("street");
    } else if (questionText.includes("mother's maiden name")) {
      return getRandomResponse("maidenName");
    } 
    // Math-related questions
    else if (questionText.includes("digit of π") || questionText.includes("digit of pi")) {
      return getRandomResponse("pi");
    } else if (questionText.includes("mathematical equation")) {
      return getRandomResponse("pi"); // Reuse pi responses for math questions
    } 
    // Password personification questions
    else if (questionText.includes("password was a sandwich")) {
      return getRandomResponse("sandwich");
    } else if (questionText.includes("ice cream flavor")) {
      return getRandomResponse("iceCream");
    } else if (questionText.includes("password wear")) {
      return getRandomResponse("sandwich"); // Reuse sandwich responses for attire questions
    } else if (questionText.includes("password's personality")) {
      return getRandomResponse("complaint"); // Reuse complaint responses
    }
    // Lie-related questions 
    else if (questionText.includes("lie on forms")) {
      return getRandomResponse("lies");
    } 
    // Zombie questions
    else if (questionText.includes("zombie apocalypse")) {
      return getRandomResponse("zombie");
    } 
    // Pet questions
    else if (questionText.includes("pet") && questionText.includes("password")) {
      return getRandomResponse("petPassword");
    } 
    // Imagination questions
    else if (questionText.includes("invisible friend") || questionText.includes("imaginary friend")) {
      return getRandomResponse("childhood");
    }
    // Drawing/aesthetic questions
    else if (questionText.includes("draw a picture") || questionText.includes("beautiful")) {
      return getRandomResponse("passwordBeauty");
    } 
    // Music questions
    else if (questionText.includes("theme song") || questionText.includes("genre")) {
      return getRandomResponse("music");
    } 
    // Password feeling questions
    else if (questionText.includes("password is feeling insecure") || questionText.includes("compliment")) {
      return getRandomResponse("complaint");
    } 
    // Campaign/political questions
    else if (questionText.includes("political office") || questionText.includes("campaign slogan")) {
      return getRandomResponse("campaignSlogan");
    }
    // Digital/cloud questions
    else if (questionText.includes("uploaded to the cloud") || questionText.includes("username")) {
      return getRandomResponse("cloudUsername"); 
    }
    // Support group questions
    else if (questionText.includes("support group")) {
      return getRandomResponse("supportGroup");
    }
    // Website judgment questions
    else if (questionText.includes("websites you visit") || questionText.includes("what would it think")) {
      return getRandomResponse("websitesJudgment");
    }
    // Dreams questions
    else if (questionText.includes("dreams")) {
      return getRandomResponse("generic"); // Use generic for dreams
    }
    // Embarrassing questions
    else if (questionText.includes("embarrassing")) {
      return getRandomResponse("embarrassing");
    }
    // Fallback for any other question types
    else {
      return getRandomResponse("generic");
    }
  } 
  // Fallback to old ID-based system if questionText is not provided
  else {
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
}
