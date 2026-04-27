import React, { useState } from 'react';
import { Target, Trophy, Clock, CheckCircle, ShieldCheck } from 'lucide-react';

export function EarnHub() {
  const [activeTab, setActiveTab] = useState<'challenges' | 'bounties'>('challenges');

  return (
    <div className="p-5 max-w-4xl mx-auto w-full">
      <div className="flex border-b border-neutral-800 bg-[#0A0A0A] sticky top-0 z-10 mb-6">
        <button 
          onClick={() => setActiveTab('challenges')}
          className={`flex-1 py-4 text-sm font-bold tracking-wide transition-colors ${activeTab === 'challenges' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-neutral-500 hover:text-neutral-300'}`}
        >
          CHALLENGES
        </button>
        <button 
          onClick={() => setActiveTab('bounties')}
          className={`flex-1 py-4 text-sm font-bold tracking-wide transition-colors ${activeTab === 'bounties' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-neutral-500 hover:text-neutral-300'}`}
        >
          BOUNTIES
        </button>
      </div>

      {activeTab === 'challenges' ? (
        <div className="space-y-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
               <Trophy className="w-24 h-24 text-amber-500" />
             </div>
             <h3 className="text-xl font-bold text-white mb-2 relative z-10">Daily Reward Pool</h3>
             <p className="text-neutral-400 mb-6 relative z-10">Complete ecosystem tasks to earn Stars. Rewards are distributed automatically via the backend API.</p>
             
             <div className="space-y-3 relative z-10">
               {[
                 { id: 1, title: 'Play 3 Native Games', reward: '50 Stars', status: 'pending' },
                 { id: 2, title: 'Join a Verified Community Group', reward: '25 Stars', status: 'completed' },
                 { id: 3, title: 'Sync Node State (Testnet)', reward: '100 Stars', status: 'pending' }
               ].map(task => (
                 <div key={task.id} className="flex items-center justify-between p-4 bg-neutral-950 rounded-xl border border-neutral-800">
                   <div className="flex items-center gap-3">
                     {task.status === 'completed' ? (
                       <CheckCircle className="w-5 h-5 text-emerald-400" />
                     ) : (
                       <Target className="w-5 h-5 text-neutral-500" />
                     )}
                     <span className={`font-medium ${task.status === 'completed' ? 'text-neutral-500 line-through' : 'text-white'}`}>
                       {task.title}
                     </span>
                   </div>
                   <div className="flex items-center gap-2">
                     <span className="text-amber-500 font-bold text-sm bg-amber-500/10 px-2 py-1 rounded-md">+{task.reward}</span>
                   </div>
                 </div>
               ))}
             </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 text-center mb-6">
             <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
             <h3 className="text-lg font-bold text-emerald-400 mb-1">Escrow Secured Bounties</h3>
             <p className="text-neutral-400 text-sm max-w-md mx-auto">SIMU rewards are held in smart contract escrow until the problem is solved and verified by the community.</p>
          </div>

          {[
            { id: 1, title: 'Build a lightweight offline-first chess engine', payout: '5,000 SIMU', urgency: 'High', tags: ['React', 'Game Dev'] },
            { id: 2, title: 'Translate SIMU Documentation to Hausa', payout: '1,500 SIMU', urgency: 'Medium', tags: ['Translation', 'Community'] },
            { id: 3, title: 'Optimize P2P state sync for 2G networks', payout: '10,000 SIMU', urgency: 'Critical', tags: ['Networking', 'Rust'] },
          ].map(bounty => (
            <div key={bounty.id} className="p-5 bg-neutral-900 rounded-2xl border border-neutral-800 hover:border-emerald-500/30 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <h4 className="text-lg font-bold text-white max-w-[70%]">{bounty.title}</h4>
                <div className="text-right">
                  <span className="block text-emerald-400 font-bold text-lg">{bounty.payout}</span>
                  <span className="text-xs text-neutral-500 uppercase tracking-widest flex items-center gap-1 justify-end mt-1">
                    <Clock className="w-3 h-3" /> ESCROWED
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${
                  bounty.urgency === 'Critical' ? 'bg-red-500/20 text-red-400' :
                  bounty.urgency === 'High' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  {bounty.urgency}
                </span>
                {bounty.tags.map(tag => (
                  <span key={tag} className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-neutral-800 text-neutral-400">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
