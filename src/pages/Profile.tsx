import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Settings, BookOpen, Trophy, Target, LogOut, ChevronRight } from "lucide-react";
import { studyIntents, dummyQuizAttempts, dummyPDFs } from "@/lib/data";
import { BottomNavigation } from "@/components/layout/BottomNavigation";

export default function Profile() {
  const [currentIntent, setCurrentIntent] = useState('quick-revision');
  
  const currentIntentData = studyIntents.find(intent => intent.id === currentIntent);
  const totalQuizzes = dummyQuizAttempts.length;
  const totalScore = dummyQuizAttempts.reduce((sum, attempt) => sum + attempt.score, 0);
  const totalQuestions = dummyQuizAttempts.reduce((sum, attempt) => sum + attempt.totalQuestions, 0);
  const averageScore = totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0;

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
              MS
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-xl font-semibold">Medical Student</h1>
            <p className="text-sm text-muted-foreground">MBBS Student</p>
            <div className="flex items-center gap-2 mt-2">
              {currentIntentData && (
                <Badge className="bg-primary/10 text-primary">
                  {currentIntentData.icon} {currentIntentData.title}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-24">
        <div className="space-y-6">
          {/* Study Stats */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Study Progress</h2>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <BookOpen className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold">{dummyPDFs.length}</p>
                  <p className="text-xs text-muted-foreground">PDFs Uploaded</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Trophy className="h-6 w-6 text-accent mx-auto mb-2" />
                  <p className="text-2xl font-bold">{totalQuizzes}</p>
                  <p className="text-xs text-muted-foreground">Quizzes Taken</p>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardContent className="p-4 text-center">
                <Target className="h-8 w-8 text-success mx-auto mb-2" />
                <p className="text-3xl font-bold text-success">{averageScore}%</p>
                <p className="text-sm text-muted-foreground">Average Quiz Score</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {totalScore} correct out of {totalQuestions} questions
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Study Intent */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Study Approach</h2>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <span className="text-lg">{currentIntentData?.icon}</span>
                    </div>
                    <div>
                      <CardTitle className="text-base">{currentIntentData?.title}</CardTitle>
                      <CardDescription className="text-sm">
                        {currentIntentData?.description}
                      </CardDescription>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardHeader>
            </Card>
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {dummyQuizAttempts.slice(0, 3).map((attempt) => (
                <Card key={attempt.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{attempt.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(attempt.completedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant={attempt.score / attempt.totalQuestions >= 0.8 ? "default" : "secondary"}>
                        {attempt.score}/{attempt.totalQuestions}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Settings */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Settings</h2>
            <div className="space-y-3">
              <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Settings className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-sm">Study Preferences</p>
                        <p className="text-xs text-muted-foreground">
                          Change your study approach and goals
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <LogOut className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-sm">Sign Out</p>
                        <p className="text-xs text-muted-foreground">
                          Sign out of your account
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* App Info */}
          <div className="text-center py-4">
            <p className="text-xs text-muted-foreground">
              MedStudy v1.0.0
            </p>
            <p className="text-xs text-muted-foreground">
              Built for MBBS students
            </p>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}