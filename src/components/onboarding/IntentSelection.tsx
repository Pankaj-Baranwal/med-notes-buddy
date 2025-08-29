import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { studyIntents, type StudyIntent } from "@/lib/data";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface IntentSelectionProps {
  onIntentSelected: (intent: StudyIntent) => void;
}

export function IntentSelection({ onIntentSelected }: IntentSelectionProps) {
  const [selectedIntent, setSelectedIntent] = useState<StudyIntent | null>(null);

  const handleContinue = () => {
    if (selectedIntent) {
      onIntentSelected(selectedIntent);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-primary/5 p-4 flex flex-col">
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🩺</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">Welcome to MedStudy</h1>
          <p className="text-muted-foreground">
            Choose your study approach to get personalized recommendations
          </p>
        </div>

        <div className="space-y-4 mb-8">
          {studyIntents.map((intent) => (
            <Card
              key={intent.id}
              className={cn(
                "cursor-pointer transition-all duration-200 hover:shadow-md",
                selectedIntent === intent.id
                  ? "ring-2 ring-primary border-primary bg-primary/5"
                  : "hover:border-primary/50"
              )}
              onClick={() => setSelectedIntent(intent.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <span className="text-lg">{intent.icon}</span>
                    </div>
                    <div>
                      <CardTitle className="text-lg">{intent.title}</CardTitle>
                    </div>
                  </div>
                  {selectedIntent === intent.id && (
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="leading-relaxed">
                  {intent.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <Button
          onClick={handleContinue}
          disabled={!selectedIntent}
          className="w-full medical-gradient text-primary-foreground font-medium py-3"
          size="lg"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}