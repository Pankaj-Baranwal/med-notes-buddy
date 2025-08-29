import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has completed onboarding
    const onboardingCompleted = localStorage.getItem('onboarding_completed');
    
    if (onboardingCompleted === 'true') {
      // User has completed onboarding, redirect to chat
      navigate('/chat');
    } else {
      // User hasn't completed onboarding, redirect to onboarding
      navigate('/onboarding');
    }
  }, [navigate]);

  // Show loading state while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">🩺</span>
        </div>
        <h1 className="text-xl font-semibold mb-2">MedStudy</h1>
        <p className="text-muted-foreground">Loading your study assistant...</p>
      </div>
    </div>
  );
};

export default Index;
