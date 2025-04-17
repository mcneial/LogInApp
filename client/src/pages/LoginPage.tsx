import { useLocation } from "wouter";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const [_, setLocation] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [signUpVisible, setSignUpVisible] = useState(true);
  const { toast } = useToast();

  const handleForgotPassword = () => {
    setLocation("/recovery");
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Increment login attempts
    const newAttempts = loginAttempts + 1;
    setLoginAttempts(newAttempts);
    
    // Generate increasingly annoyed error messages
    let errorMessage: string;
    
    if (newAttempts === 1) {
      errorMessage = "Login failed. Invalid username or password.";
    } else if (newAttempts === 2) {
      errorMessage = "Login attempt failed again. Please check your credentials.";
    } else if (newAttempts === 3) {
      errorMessage = "Still not working? Maybe you don't have an account...";
    } else if (newAttempts === 4) {
      errorMessage = "We're pretty sure you don't have an account. Try the 'Forgot Password' link?";
    } else if (newAttempts === 5) {
      errorMessage = "Ok, we'll be honest - you definitely don't have an account here.";
    } else if (newAttempts === 6) {
      errorMessage = "Seriously, stop trying. This account doesn't exist. Never has.";
    } else if (newAttempts === 7) {
      errorMessage = "This is getting awkward. There's literally no account to log into.";
    } else if (newAttempts >= 8) {
      errorMessage = "Fine. Keep clicking. Maybe on the 100th try, we'll create an account for you. (We won't)";
    }
    
    setLoginError(errorMessage);
    
    // Clear form fields
    setUsername("");
    setPassword("");
  };

  const handleSignUp = () => {
    setSignUpVisible(false);
    toast({
      title: "Account Already Exists",
      description: "You already have an account with us! Please try logging in instead.",
      variant: "destructive",
    });
  };

  return (
    <div className="bg-neutral-50 min-h-screen font-sans text-gray-800 flex items-center justify-center p-4">
      <div className="container mx-auto max-w-md">
        <Card className="bg-white rounded-lg shadow-md overflow-hidden">
          <CardContent className="p-6">
            <div className="flex justify-center mb-6">
              <CheckCircle className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-center mb-6">SecureLogin™</h1>
            
            {loginError && (
              <Alert className="mb-4 bg-red-50 border-red-200">
                <AlertDescription className="text-red-800">
                  {loginError}
                </AlertDescription>
              </Alert>
            )}
            
            <form className="space-y-4" onSubmit={handleSignIn}>
              <div>
                <Label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email or Username
                </Label>
                <Input 
                  type="text" 
                  id="email" 
                  placeholder="Enter your email or username" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="password" className="block text-sm font-medium mb-1">
                  Password
                </Label>
                <Input 
                  type="password" 
                  id="password" 
                  placeholder="Enter your password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Checkbox id="remember" />
                  <Label htmlFor="remember" className="ml-2 text-sm text-gray-500">
                    Remember me
                  </Label>
                </div>
                <button 
                  type="button" 
                  className="text-primary hover:text-blue-700 text-sm font-medium"
                  onClick={handleForgotPassword}
                >
                  Forgot password?
                </button>
              </div>
              <div>
                <Button 
                  type="submit" 
                  className="w-full text-white"
                >
                  Sign in
                </Button>
              </div>
            </form>
            {signUpVisible && (
              <div className="mt-4 text-center">
                <span className="text-sm text-gray-500">Don't have an account?</span>
                <button 
                  className="ml-1 text-primary hover:text-blue-700 text-sm font-medium"
                  onClick={handleSignUp}
                >
                  Sign up
                </button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
