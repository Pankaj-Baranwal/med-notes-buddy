import { MessageCircle, FileText, Brain, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navigation = [
  { name: 'Chat', href: '/chat', icon: MessageCircle },
  { name: 'PDFs', href: '/pdfs', icon: FileText },
  { name: 'Practice', href: '/practice', icon: Brain },
  { name: 'Profile', href: '/profile', icon: User },
];

export function BottomNavigation() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex items-center justify-around px-4 py-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href || 
            (item.href === '/chat' && location.pathname === '/');
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex flex-col items-center py-2 px-3 rounded-lg transition-colors min-w-0 flex-1",
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium truncate">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}