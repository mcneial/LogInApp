import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SecurityQuestion as SecurityQuestionType } from "@shared/schema";

interface SecurityQuestionProps {
  question: SecurityQuestionType;
  absurdityLevel: number;
  petName?: string;
  onSubmit: (answer: string) => void;
  isLast: boolean;
}

export default function SecurityQuestion({
  question,
  absurdityLevel,
  petName = "Fluffy",
  onSubmit,
  isLast
}: SecurityQuestionProps) {
  const [textAnswer, setTextAnswer] = useState("");
  const [radioAnswer, setRadioAnswer] = useState("");
  const [rangeAnswer, setRangeAnswer] = useState("5");
  const [checkboxAnswers, setCheckboxAnswers] = useState<string[]>([]);
  const [selectAnswer, setSelectAnswer] = useState("");
  const [agreement, setAgreement] = useState(false);
  
  // Reset state when question changes
  useEffect(() => {
    setTextAnswer("");
    setRadioAnswer("");
    setRangeAnswer("5");
    setCheckboxAnswers([]);
    setSelectAnswer("");
    setAgreement(false);
  }, [question.id]);

  // Replace placeholder in question text if needed
  const processedQuestionText = question.questionText.replace("[PET_NAME]", petName);
  
  // Add a container class with proper padding and background for better readability
  const getContainerClass = () => {
    let baseClass = "p-5 rounded-lg shadow-sm";
    
    if (absurdityLevel > 4) {
      baseClass += " border border-gray-200";
    }
    
    return baseClass;
  };

  const getFontClass = () => {
    return absurdityLevel >= 3 ? "font-comic" : "";
  };

  const getTextClass = () => {
    if (absurdityLevel <= 2) return "text-gray-800";
    if (absurdityLevel <= 5) return "text-primary font-medium";
    if (absurdityLevel <= 8) return "text-purple-900 font-semibold";
    return "text-red-800 font-bold transform rotate-1 animate-pulse";
  };

  const getBgClass = () => {
    if (absurdityLevel <= 4) return "";
    if (absurdityLevel <= 6) return "bg-yellow-50";
    if (absurdityLevel <= 8) return "bg-purple-100";
    return "bg-pink-100";
  };

  const handleSubmit = () => {
    let answer = "";
    
    switch (question.questionType) {
      case "text":
        answer = textAnswer;
        break;
      case "radio":
        answer = radioAnswer;
        break;
      case "range":
        answer = rangeAnswer;
        break;
      case "checkbox":
        answer = checkboxAnswers.join(", ");
        break;
      case "select":
        answer = selectAnswer;
        break;
      default:
        answer = textAnswer;
    }
    
    onSubmit(answer);
  };

  const handleCheckboxChange = (option: string, checked: boolean) => {
    if (checked) {
      setCheckboxAnswers([...checkboxAnswers, option]);
    } else {
      setCheckboxAnswers(checkboxAnswers.filter(item => item !== option));
    }
  };

  const isSubmitDisabled = () => {
    if (question.questionType === "text" && !textAnswer.trim()) return true;
    if (question.questionType === "radio" && !radioAnswer) return true;
    if (question.questionType === "select" && !selectAnswer) return true;
    if (question.questionType === "checkbox" && checkboxAnswers.length === 0) return true;
    if (isLast && !agreement) return true;
    return false;
  };

  return (
    <div className={`question-item ${getBgClass()} ${getContainerClass()}`}>
      <h3 className={`text-lg font-medium mb-4 ${getFontClass()} ${getTextClass()}`}>
        {processedQuestionText}
      </h3>
      
      {question.questionType === "text" && (
        <div className="space-y-2">
          {absurdityLevel >= 9 ? (
            <Textarea
              value={textAnswer}
              onChange={(e) => setTextAnswer(e.target.value)}
              placeholder={absurdityLevel >= 9 ? "Be specific. For security purposes only." : "Type your answer here"}
              className={absurdityLevel >= 7 ? "border-green-300 focus:ring-green-500" : ""}
              rows={3}
            />
          ) : (
            <Input
              type="text"
              value={textAnswer}
              onChange={(e) => setTextAnswer(e.target.value)}
              placeholder="Type your answer here"
              className={absurdityLevel >= 7 ? "border-green-300 focus:ring-green-500" : ""}
            />
          )}
          
          {absurdityLevel >= 3 && absurdityLevel < 9 && (
            <p className="text-xs text-gray-500">
              {absurdityLevel === 3 ? "Please be specific about condiments." : 
               absurdityLevel >= 7 ? "Your password's self-esteem depends on this." :
               "This is critical security information."}
            </p>
          )}
        </div>
      )}
      
      {question.questionType === "radio" && question.options && (
        <div className="space-y-3">
          <RadioGroup 
            value={radioAnswer} 
            onValueChange={(value) => {
              setRadioAnswer(value);
            }}
            className="space-y-3"
          >
            {question.options.map((option, index) => (
              <div className="flex items-center" key={`radio-option-${question.id}-${index}`}>
                <RadioGroupItem 
                  id={`q-option-${question.id}-${index}`} 
                  value={option}
                  className={absurdityLevel >= 4 ? "text-primary border-primary focus:ring-primary" : ""}
                />
                <Label 
                  htmlFor={`q-option-${question.id}-${index}`}
                  className={`ml-2 block text-sm ${radioAnswer === option ? "font-semibold" : ""}`}
                >
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
          {absurdityLevel >= 4 && (
            <p className="text-xs text-gray-500 italic">
              {absurdityLevel >= 7 
                ? "Remember, your lies are being monitored for security purposes." 
                : "Your selection will be scrutinized by our advanced truth detection algorithm."}
            </p>
          )}
        </div>
      )}
      
      {question.questionType === "range" && (
        <div className="space-y-2">
          <Slider
            defaultValue={[5]}
            max={10}
            min={1}
            step={1}
            onValueChange={(value) => setRangeAnswer(value[0].toString())}
            className={absurdityLevel >= 7 ? "h-2 bg-purple-200" : ""}
          />
          <div className="flex justify-between text-xs text-gray-600">
            <span>Ugly</span>
            <span>Breathtaking</span>
          </div>
          <p className="text-xs text-purple-500 mt-2">
            We need this for artistic security measures.
          </p>
        </div>
      )}
      
      {question.questionType === "checkbox" && question.options && (
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <div className="flex items-center" key={`check-option-${question.id}-${index}`}>
              <Checkbox
                id={`check-option-${question.id}-${index}`}
                checked={checkboxAnswers.includes(option)}
                onCheckedChange={(checked) => 
                  handleCheckboxChange(option, checked as boolean)
                }
                className={absurdityLevel >= 8 ? "text-pink-600 focus:ring-pink-600 border-pink-400" : "text-primary border-primary"}
              />
              <Label
                htmlFor={`check-option-${question.id}-${index}`}
                className={`ml-2 block text-sm ${checkboxAnswers.includes(option) ? "font-semibold" : ""}`}
              >
                {option}
              </Label>
            </div>
          ))}
          <p className="text-xs text-pink-500 mt-1">
            {absurdityLevel >= 7 
              ? "Select all that apply. Musical analysis is critical for account recovery." 
              : "Your password's musical taste will be used to verify your identity."}
          </p>
        </div>
      )}
      
      {question.questionType === "select" && question.options && (
        <div className="space-y-2">
          <Select 
            onValueChange={(value) => {
              setSelectAnswer(value);
            }} 
            value={selectAnswer}
            defaultValue={selectAnswer}
          >
            <SelectTrigger className={`border-2 ${selectAnswer ? "border-primary" : "border-gray-300"} ${absurdityLevel >= 5 ? "bg-yellow-50" : ""}`}>
              <SelectValue placeholder="Select your answer" />
            </SelectTrigger>
            <SelectContent>
              {question.options.map((option, index) => (
                <SelectItem 
                  key={`select-option-${index}`} 
                  value={option}
                  className={selectAnswer === option ? "font-semibold bg-primary/10" : ""}
                >
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500">
            {absurdityLevel >= 6 ? 
              "Your weapon choice reveals more about you than you think." : 
              "This is critical security information."}
          </p>
        </div>
      )}
      
      {isLast && (
        <div className="flex items-center mt-4">
          <Checkbox
            id="agreement"
            checked={agreement}
            onCheckedChange={(checked) => setAgreement(checked as boolean)}
            className="text-red-500 focus:ring-red-500"
          />
          <Label
            htmlFor="agreement"
            className="ml-2 block text-sm text-red-500"
          >
            I agree that this confession may be used for comedic purposes
          </Label>
        </div>
      )}
      
      <div className="mt-6">
        <Button
          onClick={handleSubmit}
          disabled={isSubmitDisabled()}
          className={`w-full ${
            absurdityLevel >= 9 
              ? "bg-secondary hover:bg-red-500 animate-pulse text-white" 
              : "bg-primary hover:bg-primary/90 text-white"
          }`}
        >
          {isLast ? "Complete Verification" : "Continue"}
        </Button>
      </div>
    </div>
  );
}
