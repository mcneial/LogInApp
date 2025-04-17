import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle } from "lucide-react";

export default function LoginPage() {
  const [_, setLocation] = useLocation();

  const handleForgotPassword = () => {
    setLocation("/recovery");
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
            <form className="space-y-4">
              <div>
                <Label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email or Username
                </Label>
                <Input 
                  type="text" 
                  id="email" 
                  placeholder="Enter your email or username" 
                  disabled 
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
                  disabled 
                />
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Checkbox id="remember" disabled />
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
                  className="w-full cursor-not-allowed opacity-70" 
                  disabled
                >
                  Sign in
                </Button>
              </div>
            </form>
            <div className="mt-4 text-center">
              <span className="text-sm text-gray-500">Don't have an account?</span>
              <button 
                className="ml-1 text-primary hover:text-blue-700 text-sm font-medium cursor-not-allowed"
                disabled
              >
                Sign up
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
