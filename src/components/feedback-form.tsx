"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Send, RefreshCw } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface FeedbackFormProps {
  submitFeedback: (message: string) => Promise<boolean | void>;
  isSubmitting: boolean;
}

export default function FeedbackForm({ 
  submitFeedback, 
  isSubmitting 
}: FeedbackFormProps) {
  const [message, setMessage] = useState("");
  const [charCount, setCharCount] = useState(0);
  const maxChars = 500;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxChars) {
      setMessage(value);
      setCharCount(value.length);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isSubmitting) return;
    
    const success = await submitFeedback(message);
    if (success) {
      setMessage("");
      setCharCount(0);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-primary/20 shadow-md overflow-hidden">
        <CardHeader className="bg-muted/30 pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl flex items-center">
              <Send className="h-5 w-5 mr-2 text-primary" />
              Submit Your Feedback
            </CardTitle>
            <Badge variant="outline" className="bg-primary/10">
              On-Chain
            </Badge>
          </div>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <Textarea
                placeholder="Share your thoughts on the blockchain..."
                value={message}
                onChange={handleChange}
                rows={4}
                className="resize-none focus-visible:ring-primary"
                disabled={isSubmitting}
              />
              <div className="flex justify-end text-xs text-muted-foreground">
                {charCount}/{maxChars} characters
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-muted/30 border-t border-border/50 flex justify-between">
            <Button 
              type="button" 
              variant="ghost"
              onClick={() => {
                setMessage("");
                setCharCount(0);
              }}
              disabled={isSubmitting || message.length === 0}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Clear
            </Button>
            
            <Button 
              type="submit" 
              disabled={isSubmitting || !message.trim()}
              className="relative overflow-hidden group"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Confirming Transaction...
                </>
              ) : (
                <>
                  Submit Feedback
                  <Send className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary/10 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
}