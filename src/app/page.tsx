"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ethers } from "ethers";
import { toast } from "sonner";
import FeedbackForm from "@/components/feedback-form";
import FeedbackList from "@/components/feedback-list";
import WalletConnect from "@/components/wallet-connect";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from 'lucide-react';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/config/contract";
import { Feedback, FormattedFeedback } from "@/types/feedback";

// Type guard for Ethereum accounts array
const isStringArray = (accounts: unknown): accounts is string[] => {
  return Array.isArray(accounts) && accounts.every(item => typeof item === 'string');
};

export default function Home() {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [account, setAccount] = useState<string>("");
  const [feedbacks, setFeedbacks] = useState<FormattedFeedback[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [networkName, setNetworkName] = useState<string>("");
  
  // Ref for connect function to avoid circular dependencies
  const connectWithAccountRef = useRef<((selectedAccount: string) => Promise<void>) | null>(null);

  // Load feedbacks from blockchain
  const loadFeedbacks = async (contractInstance: ethers.Contract) => {
    try {
      setLoading(true);
      const allFeedbacks = await contractInstance.getAllFeedback() as Feedback[];
      
      const formattedFeedbacks: FormattedFeedback[] = allFeedbacks.map((feedback: Feedback) => ({
        user: feedback.user,
        message: feedback.message,
        timestamp: new Date(Number(feedback.timestamp) * 1000).toLocaleString(),
        shortAddress: `${feedback.user.substring(0, 6)}...${feedback.user.substring(feedback.user.length - 4)}`
      }));
      
      setFeedbacks(formattedFeedbacks);
      setLoading(false);
    } catch (err) {
      console.error("Error loading feedbacks:", err);
      toast.error("Loading Error", {
        description: "Failed to load feedbacks from the contract"
      });
      setLoading(false);
    }
  };

  // Wallet connection handler
  const connectWithAccount = async (selectedAccount: string) => {
    if (!provider) return;
    
    try {
      const signer = await provider.getSigner();
      setSigner(signer);
      
      const feedbackContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );
      
      setContract(feedbackContract);
      await loadFeedbacks(feedbackContract);
      
      toast.success("Wallet Connected", {
        description: `Connected to ${selectedAccount.substring(0, 6)}...${selectedAccount.substring(selectedAccount.length - 4)}`
      });
    } catch (err) {
      console.error("Error connecting with account:", err);
      toast.error("Connection Error", {
        description: "Failed to connect with selected account"
      });
    }
  };
  
  // Assign function to ref
  connectWithAccountRef.current = connectWithAccount;

  // Account change handler
  const handleAccountsChanged = useCallback((accounts: string[]) => {
    if (accounts.length === 0) {
      setAccount("");
      setSigner(null);
      setContract(null);
      toast.info("Wallet Disconnected");
    } else if (accounts[0] !== account) {
      setAccount(accounts[0]);
      connectWithAccountRef.current?.(accounts[0]);
    }
  }, [account]);

  // Ethereum provider initialization
  useEffect(() => {
    const accountsChangedHandler = (accounts: unknown) => {
      if (isStringArray(accounts)) {
        handleAccountsChanged(accounts);
      } else {
        console.error("Invalid accounts format:", accounts);
        toast.error("Connection Error", {
          description: "Received invalid account format"
        });
      }
    };

    const chainChangedHandler = () => window.location.reload();

    const initProvider = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          setProvider(provider);
          
          const network = await provider.getNetwork();
          setNetworkName(network.name);
          
          window.ethereum.on("accountsChanged", accountsChangedHandler);
          window.ethereum.on("chainChanged", chainChangedHandler);
        } catch (err) {
          console.error("Error initializing provider:", err);
          toast.error("Connection Error", {
            description: "Failed to connect to Ethereum network"
          });
        }
      }
    };

    initProvider();

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", accountsChangedHandler);
        window.ethereum.removeListener("chainChanged", chainChangedHandler);
      }
    };
  }, [handleAccountsChanged]);

  // Wallet connection trigger
  const connectWallet = async () => {
    if (!provider) {
      toast.error("No Provider", {
        description: "Please install MetaMask"
      });
      return;
    }
    
    try {
      setLoading(true);
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);
      await connectWithAccount(accounts[0]);
      setLoading(false);
    } catch (err) {
      console.error("Error connecting wallet:", err);
      toast.error("Connection Failed");
      setLoading(false);
    }
  };

  // Feedback submission handler
  const submitFeedback = async (message: string) => {
    if (!contract || !signer) {
      toast.error("Not Connected");
      return false;
    }
    
    try {
      setIsSubmitting(true);
      
      const promise = contract.submitFeedback(message).then(async (tx: ethers.ContractTransactionResponse) => {
        await tx.wait();
        await loadFeedbacks(contract);
        return "Feedback recorded on blockchain";
      });
      
      toast.promise(promise, {
        loading: "Processing transaction...",
        success: (data) => data,
        error: "Submission failed"
      });
      
      await promise;
      setIsSubmitting(false);
      return true;
    } catch (err) {
      console.error("Error submitting feedback:", err);
      setIsSubmitting(false);
      return false;
    }
  };

  // UI components
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50">
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="mb-8 border-primary/20 shadow-md">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              Decentralized Feedback
            </CardTitle>
            <CardDescription className="text-lg">
              Share your thoughts on the blockchain
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              {networkName && (
                <div className="mb-4 text-sm px-3 py-1 rounded-full bg-primary/10 text-primary">
                  Network: {networkName}
                </div>
              )}
              <WalletConnect 
                connectWallet={connectWallet} 
                account={account} 
                loading={loading} 
              />
            </div>
          </CardContent>
        </Card>

        {loading && !account && (
          <div className="flex justify-center py-12">
            <div className="flex flex-col items-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="mt-4 text-muted-foreground">Connecting to blockchain...</p>
            </div>
          </div>
        )}

        {account && (
          <div className="space-y-8 animate-in fade-in-50 duration-500">
            <FeedbackForm 
              submitFeedback={submitFeedback} 
              isSubmitting={isSubmitting} 
            />
            <FeedbackList 
              feedbacks={feedbacks} 
              loading={loading} 
              currentAccount={account}
            />
          </div>
        )}
      </main>
    </div>
  );
}