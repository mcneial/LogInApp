import { useState, useEffect } from "react";

interface LoadingStateProps {
  initialMessage: string;
  isFinal?: boolean;
}

export default function LoadingState({ initialMessage, isFinal = false }: LoadingStateProps) {
  const [message, setMessage] = useState(initialMessage);
  const [submessage, setSubmessage] = useState("This won't take long.");

  useEffect(() => {
    if (!isFinal) return;

    const messages = [
      "Analyzing your personality from answers...",
      "Running quantum authentication protocol...",
      "Determining if you're human or very clever AI...",
      "Cross-referencing with parallel universe versions of you...",
      "Validating absurdity threshold..."
    ];

    let index = 0;
    const interval = setInterval(() => {
      setMessage(messages[index]);
      setSubmessage("This is definitely a real process.");
      index++;
      
      if (index >= messages.length) {
        clearInterval(interval);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [isFinal]);

  return (
    <div className="p-6">
      <div className="text-center">
        <svg className="animate-spin h-10 w-10 text-primary mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-gray-600">{message}</p>
        <p className="text-sm text-gray-500 mt-2">{submessage}</p>
      </div>
    </div>
  );
}
