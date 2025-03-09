export interface Feedback {
    user: string;
    message: string;
    timestamp: number;
  }
  
  export interface FormattedFeedback {
    user: string;
    message: string;
    timestamp: string;
    shortAddress: string;
  }