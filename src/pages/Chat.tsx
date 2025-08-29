import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Send, BookOpen, Menu, Lightbulb, Stethoscope } from "lucide-react";
import { dummyChatMessages, type ChatMessage } from "@/lib/data";
import { BottomNavigation } from "@/components/layout/BottomNavigation";

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>(dummyChatMessages);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [enhanceMode, setEnhanceMode] = useState<'none' | 'simplify' | 'clinical'>('none');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (customContent?: string, mode?: 'simplify' | 'clinical') => {
    const messageContent = customContent || inputValue;
    if (!messageContent.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: messageContent,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    setEnhanceMode('none');

    // Simulate AI response with enhancement
    setTimeout(() => {
      let content = "I understand you're asking about medical concepts. Let me help you with that based on your uploaded PDFs.";
      
      if (mode === 'simplify') {
        content = "**Simplified Explanation:** " + content + " I'll break this down into simpler terms and use everyday language to help you understand the complex medical concepts more easily.";
      } else if (mode === 'clinical') {
        content = "**Clinical Use-Case:** " + content + " Here's how this applies in real clinical scenarios with practical examples you might encounter in practice.";
      }

      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content,
        timestamp: new Date().toISOString(),
        citations: [
          {
            document: "Harrison's Principles of Internal Medicine",
            chapter: "General Medical Concepts",
            page: 42,
            snippet: "This is where the relevant information would be cited from your PDF..."
          }
        ]
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 2000);
  };

  const handleEnhanceMessage = (mode: 'simplify' | 'clinical') => {
    if (!inputValue.trim()) return;
    handleSendMessage(inputValue, mode);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm">
            <Menu className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="font-semibold">MedStudy Chat</h1>
            <p className="text-xs text-muted-foreground">Ask questions about your PDFs</p>
          </div>
        </div>
        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
          <span className="text-sm">🩺</span>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-24">
        <div className="max-w-2xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] ${
                  message.type === 'user'
                    ? 'bg-primary text-primary-foreground rounded-2xl rounded-tr-sm'
                    : 'bg-card border border-border rounded-2xl rounded-tl-sm'
                } px-4 py-3`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
                
                {message.citations && message.citations.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs text-muted-foreground font-medium">Sources:</p>
                    {message.citations.map((citation, index) => (
                      <Card key={index} className="bg-muted/50">
                        <CardContent className="p-3">
                          <div className="flex items-start gap-2">
                            <BookOpen className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="text-xs font-medium truncate">
                                  {citation.document}
                                </p>
                                <Badge variant="secondary" className="text-xs">
                                  p. {citation.page}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground mb-1">
                                {citation.chapter}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                "{citation.snippet}"
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-100"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-200"></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="fixed bottom-16 left-0 right-0 bg-background border-t border-border px-4 py-3">
        <div className="max-w-2xl mx-auto space-y-3">
          {/* Enhancement Options */}
          {inputValue.trim() && (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleEnhanceMessage('simplify')}
                disabled={isLoading}
                className="text-xs"
              >
                <Lightbulb className="h-3 w-3 mr-1" />
                Simplify
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleEnhanceMessage('clinical')}
                disabled={isLoading}
                className="text-xs"
              >
                <Stethoscope className="h-3 w-3 mr-1" />
                Clinical Example
              </Button>
            </div>
          )}
          
          {/* Message Input */}
          <div className="flex items-center gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about your medical textbooks..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isLoading}
              size="sm"
              className="medical-gradient text-primary-foreground"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}