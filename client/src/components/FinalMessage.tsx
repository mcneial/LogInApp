import { Button } from "@/components/ui/button";

interface FinalMessageProps {
  onStartOver: () => void;
}

export default function FinalMessage({ onStartOver }: FinalMessageProps) {
  const handleShare = () => {
    // In a real app, this would share to social media
    // For now, just show a copied message
    navigator.clipboard.writeText(
      "I just completed the most absurd password recovery flow ever at SecureLogin™!"
    ).then(() => {
      alert("Link copied! Share this madness with your friends.");
    }).catch(() => {
      alert("Failed to copy link. Tell your friends about this anyway!");
    });
  };

  return (
    <div className="p-6">
      <div className="text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h3 className="text-xl font-comic text-primary mb-2">Congratulations!</h3>
        <p className="text-gray-600 mb-4">
          You've completed our extremely secure verification process.
        </p>
        <p className="text-sm text-gray-500 mb-6">
          Unfortunately, we still can't recover your password because you never had an account here.
        </p>
        <div className="space-y-3">
          <Button
            onClick={onStartOver}
            className="w-full bg-secondary hover:bg-red-500"
          >
            Do It All Again!
          </Button>
          <Button
            onClick={handleShare}
            variant="outline"
            className="w-full"
          >
            Share This Madness
          </Button>
        </div>
      </div>
    </div>
  );
}
