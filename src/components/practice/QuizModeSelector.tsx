import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { FileText, MessageCircle, ScrollText } from "lucide-react";
import { dummyChapters, type QuestionType, type Chapter } from "@/lib/data";
import { cn } from "@/lib/utils";

type QuizModeConfig = {
  type: QuestionType;
  selectedChapters: string[];
  questionCount: number;
};

type QuizModeSelectorProps = {
  onStartQuiz: (config: QuizModeConfig) => void;
  onCancel: () => void;
};

const questionTypeOptions = [
  {
    id: 'mcq' as QuestionType,
    title: 'Multiple Choice',
    description: 'Quick practice with instant feedback',
    icon: FileText,
    color: 'text-primary',
    bgColor: 'bg-primary/10'
  },
  {
    id: 'short-answer' as QuestionType,
    title: 'Short Answer',
    description: 'Brief explanations and key points',
    icon: MessageCircle,
    color: 'text-accent',
    bgColor: 'bg-accent/10'
  },
  {
    id: 'long-answer' as QuestionType,
    title: 'Long Answer',
    description: 'Detailed explanations and analysis',
    icon: ScrollText,
    color: 'text-success',
    bgColor: 'bg-success/10'
  }
];

export function QuizModeSelector({ onStartQuiz, onCancel }: QuizModeSelectorProps) {
  const [selectedType, setSelectedType] = useState<QuestionType>('mcq');
  const [selectedChapters, setSelectedChapters] = useState<string[]>([]);
  const [questionCount, setQuestionCount] = useState(5);

  const handleChapterToggle = (chapterId: string, checked: boolean) => {
    if (checked) {
      setSelectedChapters(prev => [...prev, chapterId]);
    } else {
      setSelectedChapters(prev => prev.filter(id => id !== chapterId));
    }
  };

  const getTotalQuestions = () => {
    return dummyChapters
      .filter(chapter => selectedChapters.includes(chapter.id))
      .reduce((total, chapter) => total + chapter.questionCount[selectedType], 0);
  };

  const canStartQuiz = selectedChapters.length > 0 && questionCount > 0;

  return (
    <div className="space-y-6">
      {/* Question Type Selection */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Choose Question Type</h3>
        <div className="grid gap-3">
          {questionTypeOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <Card
                key={option.id}
                className={cn(
                  "cursor-pointer transition-all hover:shadow-md",
                  selectedType === option.id
                    ? "ring-2 ring-primary border-primary"
                    : "hover:border-primary/50"
                )}
                onClick={() => setSelectedType(option.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", option.bgColor)}>
                      <IconComponent className={cn("h-5 w-5", option.color)} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{option.title}</h4>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                    </div>
                    <div className={cn(
                      "w-4 h-4 rounded-full border-2",
                      selectedType === option.id
                        ? "border-primary bg-primary"
                        : "border-muted-foreground"
                    )}>
                      {selectedType === option.id && (
                        <div className="w-2 h-2 bg-primary-foreground rounded-full m-0.5" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Chapter Selection */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Select Chapters</h3>
        <div className="space-y-3">
          {dummyChapters.map((chapter) => (
            <Card key={chapter.id} className="hover:shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id={chapter.id}
                    checked={selectedChapters.includes(chapter.id)}
                    onCheckedChange={(checked) => handleChapterToggle(chapter.id, !!checked)}
                    className="mt-0.5"
                  />
                  <div className="flex-1">
                    <Label htmlFor={chapter.id} className="cursor-pointer">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{chapter.title}</span>
                        <Badge variant="secondary" className="text-xs">
                          {chapter.subject}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {chapter.questionCount[selectedType]} {selectedType.replace('-', ' ')} questions available
                      </p>
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Question Count */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Number of Questions</h3>
        <RadioGroup
          value={questionCount.toString()}
          onValueChange={(value) => setQuestionCount(parseInt(value))}
          className="grid grid-cols-4 gap-3"
        >
          {[5, 10, 15, 20].map((count) => (
            <div key={count} className="relative">
              <RadioGroupItem
                value={count.toString()}
                id={`count-${count}`}
                className="peer sr-only"
              />
              <Label
                htmlFor={`count-${count}`}
                className="flex items-center justify-center p-3 border border-border rounded-lg cursor-pointer hover:bg-accent/50 peer-checked:border-primary peer-checked:bg-primary/5"
              >
                {count}
              </Label>
            </div>
          ))}
        </RadioGroup>
        {selectedChapters.length > 0 && (
          <p className="text-sm text-muted-foreground mt-2">
            {getTotalQuestions()} questions available from selected chapters
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Button variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button
          onClick={() => onStartQuiz({ type: selectedType, selectedChapters, questionCount })}
          disabled={!canStartQuiz}
          className="flex-1 medical-gradient text-primary-foreground"
        >
          Start Quiz
        </Button>
      </div>
    </div>
  );
}