import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IntentSelection } from "@/components/onboarding/IntentSelection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, CheckCircle2 } from "lucide-react";
import { StudyIntent } from "@/lib/data";

type OnboardingStep = 'intent' | 'upload' | 'complete';

export default function Onboarding() {
  const [step, setStep] = useState<OnboardingStep>('intent');
  const [selectedIntent, setSelectedIntent] = useState<StudyIntent | null>(null);
  const navigate = useNavigate();

  const handleIntentSelected = (intent: StudyIntent) => {
    setSelectedIntent(intent);
    setStep('upload');
  };

  const handleSkipUpload = () => {
    setStep('complete');
  };

  const handleComplete = () => {
    // Store onboarding completion in localStorage
    localStorage.setItem('onboarding_completed', 'true');
    localStorage.setItem('study_intent', selectedIntent || '');
    navigate('/chat');
  };

  if (step === 'intent') {
    return <IntentSelection onIntentSelected={handleIntentSelected} />;
  }

  if (step === 'upload') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-primary/5 p-4 flex flex-col">
        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Upload Your First PDF</h1>
            <p className="text-muted-foreground">
              Add your textbooks, notes, or question papers to get started
            </p>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Document
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground mb-2">
                  Drag and drop your PDF here, or click to browse
                </p>
                <p className="text-xs text-muted-foreground">
                  Maximum file size: 100MB
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <Button
              onClick={() => setStep('complete')}
              className="w-full medical-gradient text-primary-foreground font-medium py-3"
              size="lg"
            >
              Upload PDF
            </Button>
            <Button
              onClick={handleSkipUpload}
              variant="outline"
              className="w-full"
              size="lg"
            >
              Skip for now
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-primary/5 p-4 flex flex-col">
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full text-center">
        <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="h-10 w-10 text-success" />
        </div>
        <h1 className="text-2xl font-bold mb-4">You're all set!</h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          Welcome to MedStudy! Start asking questions, uploading PDFs, and practicing MCQs to enhance your medical education.
        </p>
        <Button
          onClick={handleComplete}
          className="w-full medical-gradient text-primary-foreground font-medium py-3"
          size="lg"
        >
          Start Studying
        </Button>
      </div>
    </div>
  );
}