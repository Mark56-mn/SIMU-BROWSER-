import React from 'react';
import { Target, Users, Zap } from 'lucide-react';

interface Props {
  stars: number;
}

export function ChallengeBanner({ stars }: Props) {
  return (
    <div className="bg-neutral-950 border-b border-neutral-800 p-3 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full">
           <Zap className="w-4 h-4 text-amber-500" />
           <span className="text-amber-500 font-bold text-sm">{stars} Stars</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-neutral-400 bg-neutral-900 px-3 py-1.5 rounded-full border border-neutral-800">
           <Target className="w-3.5 h-3.5 text-emerald-400" />
           <span>Daily: Complete 3 Levels</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-neutral-400 bg-neutral-900 px-3 py-1.5 rounded-full border border-neutral-800">
           <Users className="w-3.5 h-3.5 text-blue-400" />
           <span>Online Ranks Active</span>
        </div>
      </div>
    </div>
  );
}
