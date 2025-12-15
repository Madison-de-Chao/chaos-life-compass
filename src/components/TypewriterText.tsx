import { useState, useEffect } from "react";

interface TypewriterTextProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  onComplete?: () => void;
}

export function TypewriterText({ 
  text, 
  speed = 80, 
  delay = 300, 
  className = "",
  onComplete 
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    // Reset when text changes
    setDisplayedText("");
    setIsComplete(false);
    setHasStarted(false);
    
    // Start after delay
    const startTimer = setTimeout(() => {
      setHasStarted(true);
    }, delay);
    
    return () => clearTimeout(startTimer);
  }, [text, delay]);

  useEffect(() => {
    if (!hasStarted) return;
    
    if (displayedText.length < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1));
      }, speed);
      return () => clearTimeout(timer);
    } else {
      setIsComplete(true);
      onComplete?.();
    }
  }, [displayedText, text, speed, hasStarted, onComplete]);

  return (
    <span className={className}>
      {displayedText}
      {!isComplete && hasStarted && (
        <span className="inline-block w-[3px] h-[1em] bg-primary/70 ml-1 animate-pulse align-middle" />
      )}
    </span>
  );
}
