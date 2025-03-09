import { Button } from "@/components/ui/button";
import { Loader2, Wallet, LogOut } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface WalletConnectProps {
  connectWallet: () => Promise<void>;
  account: string;
  loading: boolean;
}

export default function WalletConnect({ 
  connectWallet, 
  account, 
  loading 
}: WalletConnectProps) {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex flex-col items-center justify-center gap-4 py-4">
        {!account ? (
          <Button 
            onClick={connectWallet} 
            disabled={loading}
            className="w-full md:w-auto px-8 py-6 text-lg relative overflow-hidden group"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Wallet className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                Connect Wallet
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary/10 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </>
            )}
          </Button>
        ) : (
          <div className="w-full">
            <div className="flex flex-col items-center gap-3 p-4 rounded-lg border border-primary/20 bg-card shadow-sm">
              <Badge variant="outline" className="px-3 py-1 text-sm font-medium bg-primary/10">
                Connected
              </Badge>
              
              <div className="font-mono text-sm bg-muted p-3 rounded-md w-full text-center truncate">
                {account}
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-muted-foreground"
                  onClick={() => window.open(`https://sepolia.etherscan.io/address/${account}`, '_blank')}
                >
                  View on Explorer
                </Button>
                
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => {
                    if (window.ethereum && window.ethereum.disconnect) {
                      window.ethereum.disconnect();
                    } else {
                      window.location.reload();
                    }
                  }}
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Disconnect
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}