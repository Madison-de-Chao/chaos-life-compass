import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { TypewriterText } from "@/components/TypewriterText";

interface Message {
  role: "user" | "assistant";
  content: string;
  isTyping?: boolean; // Track if this message is currently typing
}

interface QuickAction {
  label: string;
  path: string;
}

const quickActions: QuickAction[] = [
  { label: "虹靈御所", path: "/home" },
  { label: "超烜創意", path: "/chaoxuan" },
  { label: "命理報告", path: "/reports" },
  { label: "認識默默超", path: "/momo" },
];

// Quick questions for common FAQ
const quickQuestions = [
  "報告多少錢？",
  "需要多久？",
  "標準版和旗艦版差在哪？",
  "報告包含什麼？",
];

export function MomoChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showGreeting, setShowGreeting] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setShowGreeting(false);
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("momo-chat", {
        body: { 
          message: userMessage,
          conversationHistory: messages.map(m => ({ role: m.role, content: m.content }))
        }
      });

      if (error) throw error;

      const reply = data?.reply || "我聽見了…";
      // Add message with isTyping flag for typewriter effect
      setMessages(prev => [...prev, { role: "assistant", content: reply, isTyping: true }]);

      // Handle navigation if detected
      if (data?.navigation?.path) {
        setTimeout(() => {
          navigate(data.navigation.path);
          setIsOpen(false);
        }, 1500);
      }

    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "或許，此刻需要靜一靜…" 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const handleQuickQuestion = (question: string) => {
    setInput(question);
    // Trigger send after a brief delay
    setTimeout(() => {
      setShowGreeting(false);
      setMessages(prev => [...prev, { role: "user", content: question }]);
      setIsLoading(true);
      
      supabase.functions.invoke("momo-chat", {
        body: { 
          message: question,
          conversationHistory: messages.map(m => ({ role: m.role, content: m.content }))
        }
      }).then(({ data, error }) => {
        if (error) throw error;
        const reply = data?.reply || "我聽見了…";
        setMessages(prev => [...prev, { role: "assistant", content: reply, isTyping: true }]);
        
        if (data?.navigation?.path) {
          setTimeout(() => {
            navigate(data.navigation.path);
            setIsOpen(false);
          }, 1500);
        }
      }).catch((error) => {
        console.error("Chat error:", error);
        setMessages(prev => [...prev, { 
          role: "assistant", 
          content: "或許，此刻需要靜一靜…" 
        }]);
      }).finally(() => {
        setIsLoading(false);
      });
      
      setInput("");
    }, 50);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 shadow-lg ${
          isOpen 
            ? "bg-white/10 backdrop-blur-sm border border-white/20" 
            : "bg-gradient-to-br from-[#c9a962] to-[#a88b4a] hover:scale-110"
        }`}
        style={{
          boxShadow: isOpen ? "none" : "0 0 30px rgba(201, 169, 98, 0.4)",
        }}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white/70" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Chat window */}
      <div
        className={`fixed bottom-24 right-6 z-50 w-[340px] md:w-[380px] transition-all duration-500 ${
          isOpen 
            ? "opacity-100 translate-y-0 pointer-events-auto" 
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <div className="bg-[#0a0a0a]/95 backdrop-blur-xl border border-[#c9a962]/20 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="px-5 py-4 border-b border-white/5 bg-gradient-to-r from-[#c9a962]/10 to-transparent">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#c9a962]/30 to-[#c9a962]/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#c9a962]" />
              </div>
              <div>
                <h3 className="text-white font-medium text-sm">默默超</h3>
                <p className="text-white/40 text-xs">在這裡，照見自己</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="h-[320px] overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
            {showGreeting && messages.length === 0 && (
              <div className="space-y-4 animate-fade-in">
                <div className="bg-white/5 rounded-2xl rounded-tl-sm p-4">
                  <p className="text-white/80 text-sm leading-relaxed font-light">
                    你來了…
                  </p>
                  <p className="text-white/60 text-sm leading-relaxed font-light mt-2">
                    要去哪裡看看，還是想聊聊…
                  </p>
                </div>
                
                {/* Quick navigation */}
                <p className="text-white/40 text-xs mb-2">快速前往</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {quickActions.map((action) => (
                    <button
                      key={action.path}
                      onClick={() => handleQuickAction(action.path)}
                      className="px-3 py-1.5 text-xs text-[#c9a962]/80 border border-[#c9a962]/20 rounded-full hover:bg-[#c9a962]/10 hover:border-[#c9a962]/40 transition-all duration-300"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
                
                {/* Quick questions */}
                <p className="text-white/40 text-xs mb-2">常見問題</p>
                <div className="flex flex-wrap gap-2">
                  {quickQuestions.map((question, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuickQuestion(question)}
                      className="px-3 py-1.5 text-xs text-white/60 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:text-white/80 transition-all duration-300"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, idx) => {
              const isLastAssistant = msg.role === "assistant" && idx === messages.length - 1;
              const shouldTypewrite = msg.role === "assistant" && msg.isTyping && isLastAssistant;
              
              return (
                <div
                  key={idx}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 ${
                      msg.role === "user"
                        ? "bg-[#c9a962]/20 rounded-br-sm text-white/90"
                        : "bg-white/5 rounded-tl-sm text-white/80"
                    }`}
                  >
                    <p className="text-sm leading-relaxed font-light whitespace-pre-wrap">
                      {shouldTypewrite ? (
                        <TypewriterText 
                          text={msg.content} 
                          speed={40}
                          delay={100}
                          onComplete={() => {
                            // Mark typing as complete
                            setMessages(prev => prev.map((m, i) => 
                              i === idx ? { ...m, isTyping: false } : m
                            ));
                          }}
                        />
                      ) : (
                        msg.content
                      )}
                    </p>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-white/5 rounded-2xl rounded-tl-sm p-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-[#c9a962]/50 rounded-full animate-pulse" />
                    <span className="w-2 h-2 bg-[#c9a962]/50 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }} />
                    <span className="w-2 h-2 bg-[#c9a962]/50 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-white/5">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="想說什麼…"
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#c9a962]/30 transition-colors"
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                size="icon"
                className="w-10 h-10 rounded-xl bg-[#c9a962]/20 hover:bg-[#c9a962]/30 border border-[#c9a962]/30 text-[#c9a962] disabled:opacity-30"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
