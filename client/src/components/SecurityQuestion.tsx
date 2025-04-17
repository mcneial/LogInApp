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

  // Replace placeholder in question text if needed
  const processedQuestionText = question.questionText.replace("[PET_NAME]", petName);

  const getFontClass = () => {
    return absurdityLevel >= 3 ? "font-comic" : "";
  };

  const getTextClass = () => {
    if (absurdityLevel <= 2) return "text-gray-800";
    if (absurdityLevel <= 5) return "text-secondary";
    if (absurdityLevel <= 8) return "text-purple-800";
    return "text-yellow-800 transform rotate-1 animate-pulse";
  };

  const getBgClass = () => {
    if (absurdityLevel <= 4) return "";
    if (absurdityLevel <= 6) return "bg-yellow-50";
    if (absurdityLevel <= 8) return "bg-purple-50";
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
    <div className={`question-item ${getBgClass()}`}>
      <h3 className={`text-lg font-medium mb-3 ${getFontClass()} ${getTextClass()}`}>
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
        <RadioGroup 
          value={radioAnswer} 
          onValueChange={setRadioAnswer}
          className="space-y-3"
        >
          {question.options.map((option, index) => (
            <div className="flex items-center" key={index}>
              <RadioGroupItem 
                id={`q-option-${index}`} 
                value={option}
                className={absurdityLevel >= 4 ? "text-secondary focus:ring-secondary" : ""}
              />
              <Label 
                htmlFor={`q-option-${index}`}
                className="ml-2 block text-sm"
              >
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
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
            <div className="flex items-center" key={index}>
              <Checkbox
                id={`check-option-${index}`}
                checked={checkboxAnswers.includes(option)}
                onCheckedChange={(checked) => 
                  handleCheckboxChange(option, checked as boolean)
                }
                className={absurdityLevel >= 8 ? "text-pink-500 focus:ring-pink-500" : ""}
              />
              <Label
                htmlFor={`check-option-${index}`}
                className="ml-2 block text-sm"
              >
                {option}
              </Label>
            </div>
          ))}
          <p className="text-xs text-pink-500 mt-1">
            Select all that apply. Musical analysis is critical for account recovery.
          </p>
        </div>
      )}
      
      {question.questionType === "select" && question.options && (
        <div className="space-y-2">
          <Select onValueChange={setSelectAnswer} value={selectAnswer}>
            <SelectTrigger className={absurdityLevel >= 5 ? "bg-yellow-50" : ""}>
              <SelectValue placeholder="Select your answer" />
            </SelectTrigger>
            <SelectContent>
              {question.options.map((option, index) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500">
            This is critical security information.
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
              ? "bg-secondary hover:bg-red-500 animate-pulse" 
              : ""
          }`}
        >
          {isLast ? "Complete Verification" : "Continue"}
        </Button>
      </div>
    </div>
  );
}
