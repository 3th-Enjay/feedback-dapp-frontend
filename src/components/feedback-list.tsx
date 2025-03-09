import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, MessageSquare } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { FormattedFeedback } from "@/types/feedback";

interface FeedbackListProps {
  feedbacks: FormattedFeedback[];
  loading: boolean;
  currentAccount: string;
}

export default function FeedbackList({ 
  feedbacks, 
  loading,
  currentAccount
}: FeedbackListProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <Card className="border-primary/20 shadow-md">
        <CardHeader className="bg-muted/30 pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-xl flex items-center">
            <MessageSquare className="h-5 w-5 mr-2 text-primary" />
            Community Feedback
          </CardTitle>
          <Badge variant="outline" className="bg-primary/10">
            {feedbacks.length} {feedbacks.length === 1 ? 'Entry' : 'Entries'}
          </Badge>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="flex flex-col items-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="mt-4 text-muted-foreground">Loading feedback from blockchain...</p>
              </div>
            </div>
          ) : feedbacks.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="mb-4">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground/50" />
              </div>
              <h3 className="text-lg font-medium mb-2">No feedback yet</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Be the first to share your thoughts on the blockchain. Your feedback will be permanently stored and visible to everyone.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {feedbacks.map((feedback, index) => (
                <motion.div 
                  key={index} 
                  className={`p-4 ${feedback.user.toLowerCase() === currentAccount.toLowerCase() ? 'bg-primary/5' : ''}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary/80 to-primary/30 flex items-center justify-center text-white font-bold text-xs mr-2">
                        {feedback.shortAddress.substring(0, 2)}
                      </div>
                      <div>
                        <div className="font-medium text-sm">
                          {feedback.shortAddress}
                          {feedback.user.toLowerCase() === currentAccount.toLowerCase() && (
                            <Badge variant="outline" className="ml-2 text-xs bg-primary/10 text-primary">
                              You
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {feedback.timestamp}
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6"
                      onClick={() => window.open(`https://sepolia.etherscan.io/address/${feedback.user}`, '_blank')}
                    >
                      <span className="sr-only">View on Etherscan</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </Button>
                  </div>
                  <div className="mt-2 text-sm bg-muted/50 p-3 rounded-md">
                    {feedback.message}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}