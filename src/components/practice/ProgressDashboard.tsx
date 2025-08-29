import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Target, Trophy, Brain, ChevronRight } from "lucide-react";
import { dummyProgressStats, type TopicPerformance } from "@/lib/data";
import { cn } from "@/lib/utils";

type ProgressDashboardProps = {
  onRetryWeakTopics: () => void;
  onBack: () => void;
};

export function ProgressDashboard({ onRetryWeakTopics, onBack }: ProgressDashboardProps) {
  const stats = dummyProgressStats;

  const getTrendIcon = (trend: TopicPerformance['trend']) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="h-4 w-4 text-success" />;
      case 'declining':
        return <TrendingDown className="h-4 w-4 text-destructive" />;
      default:
        return <Target className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-accent';
    return 'text-destructive';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Progress Dashboard</h2>
          <p className="text-sm text-muted-foreground">
            Track your learning journey and identify areas for improvement
          </p>
        </div>
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Trophy className="h-6 w-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold">{stats.totalQuizzes}</p>
            <p className="text-xs text-muted-foreground">Total Quizzes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="h-6 w-6 text-accent mx-auto mb-2" />
            <p className={cn("text-2xl font-bold", getScoreColor(stats.averageScore))}>
              {stats.averageScore}%
            </p>
            <p className="text-xs text-muted-foreground">Average Score</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Brain className="h-6 w-6 text-success mx-auto mb-2" />
            <p className="text-2xl font-bold">{stats.strongTopics.length}</p>
            <p className="text-xs text-muted-foreground">Strong Topics</p>
          </CardContent>
        </Card>
      </div>

      {/* Score Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.recentTrend.map((score, index) => (
              <div key={index} className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground w-16">
                  Quiz {index + 1}
                </span>
                <div className="flex-1">
                  <Progress value={score} className="h-2" />
                </div>
                <span className={cn("text-sm font-medium w-12", getScoreColor(score))}>
                  {score}%
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Strong Topics */}
      {stats.strongTopics.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Trophy className="h-4 w-4 text-success" />
              Strong Topics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.strongTopics.map((topic, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-success/5 rounded-lg border border-success/20">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm">{topic.chapter}</p>
                      <Badge variant="secondary" className="text-xs">
                        {topic.subject}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {topic.attempts} attempts • Avg: {topic.averageScore}%
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getTrendIcon(topic.trend)}
                    <span className="text-success font-medium text-sm">
                      {topic.averageScore}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Weak Topics */}
      {stats.weakTopics.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="h-4 w-4 text-destructive" />
                Areas for Improvement
              </CardTitle>
              <Button
                size="sm"
                variant="outline"
                onClick={onRetryWeakTopics}
                className="text-xs"
              >
                Practice Weak Topics
                <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.weakTopics.map((topic, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-destructive/5 rounded-lg border border-destructive/20">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm">{topic.chapter}</p>
                      <Badge variant="secondary" className="text-xs">
                        {topic.subject}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {topic.attempts} attempts • Avg: {topic.averageScore}%
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getTrendIcon(topic.trend)}
                    <span className="text-destructive font-medium text-sm">
                      {topic.averageScore}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}