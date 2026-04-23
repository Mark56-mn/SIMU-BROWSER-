import React from 'react';
import { Shield, Sparkles } from 'lucide-react';
import { Tribe, TRIBES } from '../lib/warrior-data';

interface Props {
  onSelect: (tribe: Tribe) => void;
}

export function TribeSelector({ onSelect }: Props) {
  return (
    <div className="flex flex-col h-full bg-neutral-900 border border-neutral-800 rounded-2xl p-6 overflow-y-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Choose Your Heritage</h2>
        <p className="text-neutral-400 text-sm">Select a tribe to inherit their unique weapons and combat bonuses.</p>
      </div>

      <div className="space-y-4">
        {TRIBES.map(tribe => (
          <button
            key={tribe.id}
            onClick={() => onSelect(tribe)}
            className="w-full flex items-center p-4 bg-neutral-950 border border-neutral-800 rounded-xl hover:border-emerald-500/50 transition-all group text-left relative overflow-hidden"
          >
            <div 
              className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity" 
              style={{ backgroundColor: tribe.color }} 
            />
            
            <div className="w-12 h-12 rounded-full flex items-center justify-center mr-4 shrink-0 z-10" style={{ backgroundColor: `${tribe.color}20` }}>
               <Shield className="w-6 h-6" style={{ color: tribe.color }} />
            </div>
            
            <div className="flex-1 z-10">
              <h3 className="text-white font-bold text-lg mb-0.5">{tribe.name}</h3>
              <p className="text-neutral-500 text-xs">{tribe.desc}</p>
            </div>

            <div className="text-right z-10 shrink-0 ml-4">
               <div className="text-xs font-bold text-neutral-300 uppercase tracking-widest">{tribe.weapon}</div>
               <div className="text-xs mt-1 flex items-center justify-end gap-1" style={{ color: tribe.color }}>
                 <Sparkles className="w-3 h-3" />
                 {tribe.bonus}
               </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
