import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, Trophy, Clock, Target, Plus, CheckCircle2, XCircle, BarChart3, Settings } from "lucide-react";
import { dummyQuizAttempts, dummyMCQs, dummyShortAnswers, dummyLongAnswers, type QuizAttempt, type Question, type QuestionType } from "@/lib/data";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { QuizModeSelector } from "@/components/practice/QuizModeSelector";
import { ProgressDashboard } from "@/components/practice/ProgressDashboard";
import { cn } from "@/lib/utils";

type QuizState = 'overview' | 'mode-select' | 'active' | 'results' | 'progress';

export default function Practice() {
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>(dummyQuizAttempts);
  const [quizState, setQuizState] = useState<QuizState>('overview');
  const [currentQuiz, setCurrentQuiz] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(number | string)[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [currentQuizType, setCurrentQuizType] = useState<QuestionType>('mcq');
  const [selectedChapters, setSelectedChapters] = useState<string[]>([]);

  const startNewQuiz = () => {
    setQuizState('mode-select');
  };

  const startQuizWithConfig = (config: { type: QuestionType; selectedChapters: string[]; questionCount: number }) => {
    // Generate questions based on type
    let questions: Question[] = [];
    switch (config.type) {
      case 'mcq':
        questions = dummyMCQs.slice(0, Math.min(config.questionCount, dummyMCQs.length));
        break;
      case 'short-answer':
        questions = dummyShortAnswers.slice(0, Math.min(config.questionCount, dummyShortAnswers.length));
        break;
      case 'long-answer':
        questions = dummyLongAnswers.slice(0, Math.min(config.questionCount, dummyLongAnswers.length));
        break;
    }

    setCurrentQuiz(questions);
    setCurrentQuizType(config.type);
    setSelectedChapters(config.selectedChapters);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setShowResults(false);
    setQuizState('active');
  };

  const selectAnswer = (answer: number | string) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answer;
    setUserAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < currentQuiz.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      finishQuiz();
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const finishQuiz = () => {
    setShowResults(true);
    
    // Calculate score based on question type
    let score = 0;
    userAnswers.forEach((answer, index) => {
      const question = currentQuiz[index];
      if (question.type === 'mcq') {
        score += answer === (question as any).correctAnswer ? 1 : 0;
      } else {
        // For short/long answers, simulate basic scoring
        score += typeof answer === 'string' && answer.length > 10 ? 1 : 0;
      }
    });

    const newAttempt: QuizAttempt = {
      id: Date.now().toString(),
      title: `${currentQuizType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} Quiz`,
      type: currentQuizType,
      questions: currentQuiz,
      userAnswers,
      score,
      totalQuestions: currentQuiz.length,
      completedAt: new Date().toISOString(),
      timeSpent: 15,
      selectedChapters
    };

    setQuizAttempts(prev => [newAttempt, ...prev]);
  };

  const backToOverview = () => {
    setQuizState('overview');
    setCurrentQuiz([]);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setShowResults(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getScoreColor = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return 'text-success';
    if (percentage >= 60) return 'text-accent';
    return 'text-destructive';
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      'easy': 'bg-success/10 text-success',
      'medium': 'bg-accent/10 text-accent',
      'hard': 'bg-destructive/10 text-destructive'
    };
    return colors[difficulty as keyof typeof colors] || 'bg-muted text-muted-foreground';
  };

  // Mode Selection Screen
  if (quizState === 'mode-select') {
    return (
      <div className="flex flex-col h-screen bg-background">
        <header className="bg-card border-b border-border px-4 py-4">
          <h1 className="text-xl font-semibold">Start New Quiz</h1>
        </header>
        
        <div className="flex-1 overflow-y-auto px-4 py-6 pb-24">
          <div className="max-w-2xl mx-auto">
            <QuizModeSelector
              onStartQuiz={startQuizWithConfig}
              onCancel={() => setQuizState('overview')}
            />
          </div>
        </div>
        
        <BottomNavigation />
      </div>
    );
  }

  // Progress Dashboard Screen
  if (quizState === 'progress') {
    return (
      <div className="flex flex-col h-screen bg-background">
        <header className="bg-card border-b border-border px-4 py-4">
          <h1 className="text-xl font-semibold">Progress Analytics</h1>
        </header>
        
        <div className="flex-1 overflow-y-auto px-4 py-6 pb-24">
          <div className="max-w-2xl mx-auto">
            <ProgressDashboard
              onRetryWeakTopics={() => {
                // Start quiz with weak topics
                setQuizState('mode-select');
              }}
              onBack={() => setQuizState('overview')}
            />
          </div>
        </div>
        
        <BottomNavigation />
      </div>
    );
  }

  if (quizState === 'active') {
    const currentQuestion = currentQuiz[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / currentQuiz.length) * 100;
    const currentAnswer = userAnswers[currentQuestionIndex];

    if (showResults) {
      let score = 0;
      userAnswers.forEach((answer, index) => {
        const question = currentQuiz[index];
        if (question.type === 'mcq') {
          score += answer === (question as any).correctAnswer ? 1 : 0;
        } else {
          score += typeof answer === 'string' && answer.length > 10 ? 1 : 0;
        }
      });
      const percentage = Math.round((score / currentQuiz.length) * 100);

      return (
        <div className="flex flex-col h-screen bg-background">
          <header className="bg-card border-b border-border px-4 py-4">
            <h1 className="text-xl font-semibold">Quiz Results</h1>
          </header>

          <div className="flex-1 overflow-y-auto px-4 py-6 pb-24">
            <div className="max-w-2xl mx-auto">
              <Card className="mb-6">
                <CardHeader className="text-center">
                  <div className={cn(
                    "w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4",
                    percentage >= 80 ? "bg-success/10" : percentage >= 60 ? "bg-accent/10" : "bg-destructive/10"
                  )}>
                    <Trophy className={cn(
                      "h-8 w-8",
                      percentage >= 80 ? "text-success" : percentage >= 60 ? "text-accent" : "text-destructive"
                    )} />
                  </div>
                  <CardTitle className="text-2xl">
                    {score}/{currentQuiz.length}
                  </CardTitle>
                  <CardDescription className="text-lg">
                    {percentage}% Score
                  </CardDescription>
                </CardHeader>
              </Card>

              <div className="space-y-4 mb-6">
                {currentQuiz.map((question, index) => {
                  const userAnswer = userAnswers[index];
                  let isCorrect = false;
                  
                  if (question.type === 'mcq') {
                    isCorrect = userAnswer === (question as any).correctAnswer;
                  } else {
                    // For short/long answers, simulate scoring based on length
                    isCorrect = typeof userAnswer === 'string' && userAnswer.length > 10;
                  }

                  return (
                    <Card key={index} className={cn(
                      "border-l-4",
                      isCorrect ? "border-l-success bg-success/5" : "border-l-destructive bg-destructive/5"
                    )}>
                      <CardHeader>
                        <div className="flex items-start gap-3">
                          {isCorrect ? (
                            <CheckCircle2 className="h-5 w-5 text-success mt-0.5" />
                          ) : (
                            <XCircle className="h-5 w-5 text-destructive mt-0.5" />
                          )}
                          <div className="flex-1">
                            <CardTitle className="text-base mb-2">
                              {question.question}
                            </CardTitle>
                            <div className="space-y-2">
                              {question.type === 'mcq' ? (
                                (question as any).options.map((option: string, optionIndex: number) => (
                                  <div
                                    key={optionIndex}
                                    className={cn(
                                      "p-2 rounded text-sm",
                                      optionIndex === (question as any).correctAnswer
                                        ? "bg-success/20 text-success font-medium"
                                        : optionIndex === userAnswer && !isCorrect
                                        ? "bg-destructive/20 text-destructive"
                                        : "bg-muted/50"
                                    )}
                                  >
                                    {option}
                                  </div>
                                ))
                              ) : (
                                <div className="space-y-2">
                                  <div className="p-3 bg-muted/50 rounded">
                                    <p className="text-sm font-medium mb-1">Your Answer:</p>
                                    <p className="text-sm">{userAnswer || 'No answer provided'}</p>
                                  </div>
                                  <div className="p-3 bg-success/10 rounded">
                                    <p className="text-sm font-medium mb-1">Sample Answer:</p>
                                    <p className="text-sm">{(question as any).sampleAnswer}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                            {!isCorrect && (
                              <p className="text-sm text-muted-foreground mt-3">
                                {question.explanation}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  );
                })}
              </div>

              <Button
                onClick={backToOverview}
                className="w-full medical-gradient text-primary-foreground"
                size="lg"
              >
                Back to Practice
              </Button>
            </div>
          </div>

          <BottomNavigation />
        </div>
      );
    }

    return (
      <div className="flex flex-col h-screen bg-background">
        <header className="bg-card border-b border-border px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-lg font-semibold">
              Question {currentQuestionIndex + 1} of {currentQuiz.length}
            </h1>
            <Badge className={getDifficultyColor(currentQuestion.difficulty)}>
              {currentQuestion.difficulty}
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-6 pb-24">
          <div className="max-w-2xl mx-auto">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg leading-relaxed">
                  {currentQuestion.question}
                </CardTitle>
                <CardDescription>
                  {currentQuestion.chapter}
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="space-y-3 mb-6">
              {currentQuestion.type === 'mcq' ? (
                (currentQuestion as any).options.map((option: string, index: number) => (
                  <Card
                    key={index}
                    className={cn(
                      "cursor-pointer transition-all hover:shadow-md",
                      currentAnswer === index
                        ? "ring-2 ring-primary border-primary bg-primary/5"
                        : "hover:border-primary/50"
                    )}
                    onClick={() => selectAnswer(index)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-medium",
                          currentAnswer === index
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-muted-foreground"
                        )}>
                          {String.fromCharCode(65 + index)}
                        </div>
                        <p className="text-sm leading-relaxed">{option}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="p-4">
                    <textarea
                      value={(currentAnswer as string) || ''}
                      onChange={(e) => selectAnswer(e.target.value)}
                      placeholder={currentQuestion.type === 'short-answer' 
                        ? 'Write a brief answer (2-3 sentences)...' 
                        : 'Write a detailed explanation...'
                      }
                      rows={currentQuestion.type === 'short-answer' ? 4 : 8}
                      className="w-full p-3 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="flex gap-3">
              {currentQuestionIndex > 0 && (
                <Button
                  onClick={previousQuestion}
                  variant="outline"
                  className="flex-1"
                >
                  Previous
                </Button>
              )}
              <Button
                onClick={nextQuestion}
                disabled={currentAnswer === undefined || (typeof currentAnswer === 'string' && currentAnswer.trim() === '')}
                className="flex-1 medical-gradient text-primary-foreground"
              >
                {currentQuestionIndex === currentQuiz.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </div>
          </div>
        </div>

        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Practice Hub</h1>
            <p className="text-sm text-muted-foreground">
              {quizAttempts.length} quizzes completed
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setQuizState('progress')}
              variant="outline"
              size="sm"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Progress
            </Button>
            <Button
              onClick={startNewQuiz}
              className="medical-gradient text-primary-foreground"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Quiz
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-24">
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3">
            <Card>
              <CardContent className="p-4 text-center">
                <Target className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold">
                  {quizAttempts.reduce((sum, attempt) => sum + attempt.score, 0)}
                </p>
                <p className="text-xs text-muted-foreground">Correct</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Clock className="h-6 w-6 text-accent mx-auto mb-2" />
                <p className="text-2xl font-bold">
                  {quizAttempts.reduce((sum, attempt) => sum + attempt.timeSpent, 0)}m
                </p>
                <p className="text-xs text-muted-foreground">Studied</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Trophy className="h-6 w-6 text-success mx-auto mb-2" />
                <p className="text-2xl font-bold">{quizAttempts.length}</p>
                <p className="text-xs text-muted-foreground">Quizzes</p>
              </CardContent>
            </Card>
          </div>

          {/* Generate New Quiz */}
          <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Start New Practice
              </CardTitle>
              <CardDescription>
                Choose from MCQs, short answers, or long answers. Practice specific chapters and track your progress.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <Button
                  onClick={startNewQuiz}
                  className="medical-gradient text-primary-foreground"
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Quiz
                </Button>
                <Button
                  onClick={() => setQuizState('progress')}
                  variant="outline"
                  size="sm"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Progress
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Attempts */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Recent Attempts</h2>
            <div className="space-y-3">
              {quizAttempts.map((attempt) => (
                <Card key={attempt.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base flex items-center gap-2">
                          {attempt.title}
                          <Badge variant="outline" className="text-xs">
                            {attempt.type.replace('-', ' ')}
                          </Badge>
                        </CardTitle>
                        <CardDescription className="flex items-center gap-4 mt-1">
                          <span>{formatDate(attempt.completedAt)}</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {attempt.timeSpent}m
                          </span>
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <p className={cn(
                          "text-lg font-bold",
                          getScoreColor(attempt.score, attempt.totalQuestions)
                        )}>
                          {attempt.score}/{attempt.totalQuestions}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {Math.round((attempt.score / attempt.totalQuestions) * 100)}%
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}

              {quizAttempts.length === 0 && (
                <div className="text-center py-12">
                  <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No practice sessions yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start your first MCQ quiz to begin practicing
                  </p>
                  <Button
                    onClick={startNewQuiz}
                    className="medical-gradient text-primary-foreground"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Start First Quiz
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}