import React, { useState } from 'react';
import { Wallet, ArrowRightLeft, Activity, Server, Zap, ShieldCheck, Database } from 'lucide-react';

export function WalletDash() {
  const [stars, setStars] = useState(1250);
  const [simu, setSimu] = useState(42.5);
  const [isConverting, setIsConverting] = useState(false);

  // Simulated API call for converting Stars to SIMU (Economic Layer)
  const handleConversion = () => {
    if (stars < 1000) {
      alert("Minimum conversion is 1000 Stars.");
      return;
    }
    
    setIsConverting(true);
    // Simulate backend RPC call delay
    setTimeout(() => {
      setStars(prev => prev - 1000);
      setSimu(prev => +(prev + 5.0).toFixed(2)); // 1000 Stars = 5 SIMU in this mock economy
      setIsConverting(false);
      alert("Success! The network has validated your conversion.");
    }, 1500);
  };

  return (
    <div className="p-5 max-w-4xl mx-auto w-full space-y-6">
      
      {/* Ecosystem Real-time Metrics Banner */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-lg">
        <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4" /> Global Ecosystem Metrics
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800">
            <div className="text-emerald-400 font-mono font-bold text-xl mb-1">1,420</div>
            <div className="text-xs text-neutral-500 font-medium">Active Validators</div>
          </div>
          <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800">
            <div className="text-blue-400 font-mono font-bold text-xl mb-1">45.2k</div>
            <div className="text-xs text-neutral-500 font-medium">Network TPS</div>
          </div>
          <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800">
            <div className="text-amber-400 font-mono font-bold text-xl mb-1">2M+</div>
            <div className="text-xs text-neutral-500 font-medium">Stars in Pool</div>
          </div>
          <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800">
            <div className="text-purple-400 font-mono font-bold text-xl mb-1">$0.12</div>
            <div className="text-xs text-neutral-500 font-medium">SIMU Price (Est)</div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Balances */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center">
              <Wallet className="w-5 h-5 text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold text-white">Your Assets</h2>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 flex justify-between items-center">
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                   <ShieldCheck className="w-4 h-4 text-neutral-900" />
                 </div>
                 <div>
                   <div className="text-white font-bold">SIMU Token</div>
                   <div className="text-xs text-neutral-500">Native Validator Asset</div>
                 </div>
               </div>
               <div className="text-right">
                 <div className="text-lg font-bold text-emerald-400">{simu.toFixed(2)}</div>
               </div>
            </div>

            <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 flex justify-between items-center">
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center shrink-0 flex-col">
                   <Zap className="w-4 h-4 text-neutral-900" />
                 </div>
                 <div>
                   <div className="text-white font-bold">Ecosystem Stars</div>
                   <div className="text-xs text-neutral-500">In-App Reward Points</div>
                 </div>
               </div>
               <div className="text-right">
                 <div className="text-lg font-bold text-amber-500">{stars}</div>
               </div>
            </div>
          </div>
        </div>

        {/* Conversion Action */}
        <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 border border-neutral-700 rounded-2xl p-6 flex flex-col justify-center relative overflow-hidden">
          <Database className="w-48 h-48 text-neutral-800/10 absolute -right-10 -bottom-10" />
          
          <div className="relative z-10 text-center">
            <h3 className="text-xl font-bold text-white mb-2">Convert Stars to SIMU</h3>
            <p className="text-neutral-400 text-sm mb-8">Exchange your hard-earned ecosystem points for native tokens via the decentralized relay.</p>
            
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="bg-neutral-950 px-4 py-3 rounded-xl border border-neutral-800">
                <span className="text-amber-500 font-bold block text-lg">1000 ★</span>
              </div>
              <ArrowRightLeft className="w-6 h-6 text-neutral-500" />
              <div className="bg-neutral-950 px-4 py-3 rounded-xl border border-neutral-800 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                <span className="text-emerald-400 font-bold block text-lg">5.0 SIMU</span>
              </div>
            </div>

            <button 
              onClick={handleConversion}
              disabled={isConverting || stars < 1000}
              className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:bg-neutral-800 disabled:text-neutral-500 text-neutral-950 font-bold text-lg rounded-xl transition-all shadow-[0_4px_20px_rgba(16,185,129,0.3)] active:scale-95 flex justify-center items-center gap-2"
            >
              {isConverting ? (
                <>
                  <Server className="w-5 h-5 animate-pulse" /> Processing via API...
                </>
              ) : (
                'Execute Conversion'
              )}
            </button>
            {stars < 1000 && (
              <p className="text-red-400 text-xs mt-3 font-medium">Insufficient Stars for minimum conversion.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
