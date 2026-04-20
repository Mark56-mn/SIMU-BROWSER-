import React, { useState } from 'react';
import { Globe, Gamepad2, Users, LayoutGrid, WifiOff, ShieldCheck, ChevronRight, PlaySquare, Settings, Wallet, Mail, LogOut, Trash2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'games' | 'community' | 'dapps' | 'settings' | 'browser'>('games');
  const [communitySubTab, setCommunitySubTab] = useState<'feed' | 'groups'>('feed');
  const [isSimulatedLogin, setIsSimulatedLogin] = useState(false);
  const [authMethod, setAuthMethod] = useState<'wallet' | 'browser'>('wallet');
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);

  const openDApp = (url: string) => {
    setCurrentUrl(url);
    setActiveTab('browser');
  };

  return (
    <div className="flex flex-col h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-emerald-500/30">
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-4 bg-neutral-900 border-b border-neutral-800 shadow-sm z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
            <Globe className="w-5 h-5 text-emerald-400" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">SIMU Browser</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-800 border border-neutral-700 text-xs font-medium text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Secure</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
            <WifiOff className="w-3.5 h-3.5" />
            <span>Offline Ready</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative bg-[#0A0A0A]">
        {activeTab === 'games' && (
          <div className="p-5 max-w-5xl mx-auto w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Gamepad2 className="w-6 h-6 text-emerald-400" />
                Games Hub
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {[
                { id: '1', name: 'SIMU Runner', url: 'https://games.simu.network/runner', size: '1.2 MB', category: 'Action', cached: true },
                { id: '2', name: 'Crypto Puzzle', url: 'https://games.simu.network/puzzle', size: '0.8 MB', category: 'Logic', cached: false },
                { id: '3', name: 'Ang Nodes Tycoon', url: 'https://games.simu.network/tycoon', size: '2.4 MB', category: 'Strategy', cached: true },
                { id: '4', name: 'SIMU Chess', url: 'https://games.simu.network/chess', size: '0.5 MB', category: 'Board', cached: true },
                { id: '5', name: 'Token Dash', url: 'https://games.simu.network/dash', size: '1.8 MB', category: 'Arcade', cached: false },
              ].map((game) => (
                <button
                  key={game.id}
                  onClick={() => openDApp(game.url)}
                  className="group flex flex-col items-center p-5 bg-neutral-900 rounded-2xl border border-neutral-800 hover:border-emerald-500/50 hover:bg-neutral-800/50 transition-all text-left relative overflow-hidden"
                >
                  {game.cached && (
                    <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 text-[9px] font-bold uppercase rounded-md tracking-wider">
                      Ready
                    </div>
                  )}
                  <div className="w-16 h-16 bg-neutral-800 rounded-2xl mb-4 flex items-center justify-center group-hover:scale-105 transition-transform shadow-inner">
                    <Gamepad2 className="w-8 h-8 text-neutral-500 group-hover:text-emerald-400 transition-colors" />
                  </div>
                  <span className="font-bold text-sm text-center w-full truncate text-neutral-100">{game.name}</span>
                  <span className="text-xs text-neutral-500 mt-1">{game.size} • {game.category}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'community' && (
          <div className="max-w-2xl mx-auto w-full">
            <div className="flex border-b border-neutral-800 bg-neutral-900 sticky top-0 z-10">
              <button 
                onClick={() => setCommunitySubTab('feed')}
                className={`flex-1 py-4 text-sm font-bold tracking-wide transition-colors ${communitySubTab === 'feed' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-neutral-500 hover:text-neutral-300'}`}
              >
                FEED
              </button>
              <button 
                onClick={() => setCommunitySubTab('groups')}
                className={`flex-1 py-4 text-sm font-bold tracking-wide transition-colors ${communitySubTab === 'groups' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-neutral-500 hover:text-neutral-300'}`}
              >
                GROUPS & REELS
              </button>
            </div>

            <div className="p-5 space-y-4">
              {communitySubTab === 'feed' ? (
                <>
                  {[
                    { id: '1', title: 'SIMU Node setup guide for 2G networks', author: 'ang_dev', upvotes: 142, time: '2h ago' },
                    { id: '2', title: 'New lightweight game released! Only 0.8MB', author: 'simu_games', upvotes: 89, time: '5h ago' },
                    { id: '3', title: 'How to optimize offline caching for dApps', author: 'web3_africa', upvotes: 56, time: '1d ago' },
                    { id: '4', title: 'Validator rewards distribution update', author: 'simu_core', upvotes: 234, time: '2d ago' },
                  ].map((post) => (
                    <div key={post.id} className="p-5 bg-neutral-900 rounded-2xl border border-neutral-800 border-l-4 border-l-emerald-500 hover:bg-neutral-800/50 transition-colors">
                      <h3 className="font-bold text-neutral-100 mb-3 text-lg leading-snug">{post.title}</h3>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-neutral-500">by <span className="text-emerald-400 font-medium">{post.author}</span> • {post.time}</span>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 rounded-full text-emerald-400 hover:bg-neutral-700 transition-colors font-bold">
                          ▲ {post.upvotes}
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  {[
                    { id: '1', name: 'SIMU Validators', members: '1,240', type: 'Public', desc: 'Official group for Ang Node operators and validators.' },
                    { id: '2', name: 'Web3 Africa Reels', members: '850', type: 'Reels', desc: 'Short video updates and tutorials from the ecosystem.', icon: PlaySquare },
                    { id: '3', name: 'Trading & DeFi', members: '3,200', type: 'Public', desc: 'Discuss SIMU tokenomics, DEX strategies, and liquidity.' },
                    { id: '4', name: 'Game Devs Hub', members: '420', type: 'Private', desc: 'Build lightweight games for the SIMU Browser.' },
                  ].map((group) => (
                    <div key={group.id} className="p-5 bg-neutral-900 rounded-2xl border border-neutral-800 hover:border-neutral-700 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          {group.icon && <group.icon className="w-5 h-5 text-emerald-400" />}
                          <h3 className="font-bold text-white text-lg">{group.name}</h3>
                        </div>
                        <span className="px-2 py-1 bg-neutral-800 rounded text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                          {group.type}
                        </span>
                      </div>
                      <p className="text-neutral-400 text-sm mb-4">{group.desc}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-neutral-500 font-medium">{group.members} members</span>
                        <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-sm rounded-full transition-colors">
                          Join Group
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        )}

        {activeTab === 'dapps' && (
          <div className="p-5 max-w-3xl mx-auto w-full">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <LayoutGrid className="w-6 h-6 text-emerald-400" />
              Approved dApps
            </h2>
            <div className="space-y-3">
              {[
                { id: '1', name: 'SIMU DEX', category: 'DeFi', url: 'https://dex.simu.network', verified: true },
                { id: '2', name: 'NFT Marketplace', category: 'Collectibles', url: 'https://nft.simu.network', verified: true },
                { id: '3', name: 'Community Faucet', category: 'Utility', url: 'https://faucet.simu.network', verified: false },
                { id: '4', name: 'Block Explorer', category: 'Infrastructure', url: 'https://explorer.simu.network', verified: true },
              ].map((dapp) => (
                <div key={dapp.id} className="flex items-center p-4 bg-neutral-900 rounded-2xl border border-neutral-800 hover:border-neutral-700 transition-colors">
                  <div className="w-12 h-12 bg-neutral-800 rounded-xl mr-4 flex items-center justify-center">
                    <LayoutGrid className="w-6 h-6 text-neutral-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-white text-base flex items-center gap-2">
                      {dapp.name}
                      {dapp.verified && <ShieldCheck className="w-4 h-4 text-emerald-400" />}
                    </h3>
                    <p className="text-xs text-neutral-500 mt-1">{dapp.category}</p>
                  </div>
                  <button 
                    onClick={() => openDApp(dapp.url)}
                    className="flex items-center gap-1 px-4 py-2 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 font-bold text-sm rounded-full transition-colors"
                  >
                    Launch <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="p-5 max-w-3xl mx-auto w-full">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Settings className="w-6 h-6 text-emerald-400" />
              Settings & Account
            </h2>

            {isSimulatedLogin ? (
              <div className="space-y-6">
                 <div className="p-5 bg-neutral-900 rounded-2xl border border-emerald-500/30 shadow-lg">
                   <h3 className="font-bold text-white text-lg mb-1">Account Active</h3>
                   <p className="text-emerald-400 text-sm mb-4">simu1...x9f (Wallet Connected)</p>
                   <button onClick={() => setIsSimulatedLogin(false)} className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 font-bold text-sm rounded-xl hover:bg-red-500/20 transition-colors">
                     <LogOut className="w-4 h-4" /> Sign Out
                   </button>
                 </div>
                 <div className="p-5 bg-neutral-900 rounded-2xl border border-neutral-800">
                   <h3 className="font-bold text-white mb-4">Browser Preferences</h3>
                   <div className="flex items-center justify-between py-3 border-b border-neutral-800">
                     <span className="text-neutral-300 text-sm">Offline Cache Size</span>
                     <span className="text-emerald-400 text-sm font-bold">42.5 MB</span>
                   </div>
                   <button className="flex items-center gap-2 px-4 py-2 mt-4 bg-neutral-800 text-neutral-300 font-bold text-sm rounded-xl hover:bg-neutral-700 transition-colors">
                     <Trash2 className="w-4 h-4" /> Clear Cache
                   </button>
                 </div>
              </div>
            ) : (
              <div className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden shadow-xl">
                <div className="flex border-b border-neutral-800">
                  <button onClick={() => setAuthMethod('wallet')} className={`flex-1 py-4 text-sm font-bold tracking-wide transition-colors ${authMethod === 'wallet' ? 'text-emerald-400 border-b-2 border-emerald-400 bg-neutral-800/20' : 'text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800/10'}`}>
                    SIMU WALLET
                  </button>
                  <button onClick={() => setAuthMethod('browser')} className={`flex-1 py-4 text-sm font-bold tracking-wide transition-colors ${authMethod === 'browser' ? 'text-emerald-400 border-b-2 border-emerald-400 bg-neutral-800/20' : 'text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800/10'}`}>
                    BROWSER ACCOUNT
                  </button>
                </div>
                <div className="p-6">
                  {authMethod === 'wallet' ? (
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mb-4">
                        <Wallet className="w-8 h-8 text-emerald-400" />
                      </div>
                      <h3 className="font-bold text-white text-lg mb-2">Connect Your Wallet</h3>
                      <p className="text-neutral-400 text-sm mb-6 max-w-sm">Use the exact same details as your SIMU Wallet, or connect seamlessly via the Testnet App using secure deep linking.</p>
                      <button onClick={() => setIsSimulatedLogin(true)} className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded-xl transition-colors mb-4">
                        Connect via SIMU App
                      </button>
                      <div className="relative w-full text-center my-4">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-neutral-800"></div></div>
                        <span className="relative px-3 bg-neutral-900 text-xs text-neutral-500 font-bold tracking-widest">OR ENTER SEED</span>
                      </div>
                      <input type="password" placeholder="12-word seed phrase" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm mb-4 focus:outline-none focus:border-emerald-500/50" />
                      <button onClick={() => setIsSimulatedLogin(true)} className="w-full py-3 bg-neutral-800 hover:bg-neutral-700 text-white font-bold rounded-xl transition-colors">
                        Import Wallet Payload
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      <div className="flex items-center gap-3 mb-6 flex-col">
                        <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center">
                          <Mail className="w-8 h-8 text-emerald-400" />
                        </div>
                        <div className="text-center">
                           <h3 className="font-bold text-white text-lg">Browser Account</h3>
                           <p className="text-neutral-400 text-xs mt-1">Create an isolated account just for community features.</p>
                        </div>
                      </div>
                      <input type="email" placeholder="Email address" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm mb-3 focus:outline-none focus:border-emerald-500/50" />
                      <input type="password" placeholder="Password" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm mb-6 focus:outline-none focus:border-emerald-500/50" />
                      <button onClick={() => setIsSimulatedLogin(true)} className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded-xl transition-colors mb-3 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                        Sign In / Create Account
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'browser' && currentUrl && (
          <div className="absolute inset-0 flex flex-col bg-black z-20">
            <div className="flex items-center gap-3 p-3 bg-neutral-900 border-b border-neutral-800">
              <button 
                onClick={() => setActiveTab('games')}
                className="px-4 py-1.5 text-sm font-bold text-neutral-900 bg-emerald-400 hover:bg-emerald-300 rounded-full transition-colors"
              >
                Done
              </button>
              <div className="flex-1 px-4 py-2 bg-neutral-950 rounded-full text-sm text-neutral-400 truncate border border-neutral-800 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                {currentUrl}
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center text-neutral-500 flex-col gap-5 bg-[#050505]">
              <div className="w-20 h-20 rounded-2xl bg-neutral-900 flex items-center justify-center border border-neutral-800 shadow-2xl">
                <Globe className="w-10 h-10 text-emerald-400/50" />
              </div>
              <div className="text-center space-y-2">
                <p className="font-bold text-white text-lg">Secure WebView</p>
                <p className="text-sm max-w-sm text-neutral-400 leading-relaxed">
                  Sandbox active. Navigation restricted to <span className="text-emerald-400 font-mono text-xs">*.simu.network</span>.
                  <br/>Wallet object injected successfully.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="flex bg-neutral-900 border-t border-neutral-800 pb-safe z-10">
        <button
          onClick={() => setActiveTab('games')}
          className={`flex-1 flex flex-col items-center justify-center py-3.5 gap-1.5 transition-colors ${activeTab === 'games' ? 'text-emerald-400' : 'text-neutral-500 hover:text-neutral-300'}`}
        >
          <Gamepad2 className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Games</span>
        </button>
        <button
          onClick={() => setActiveTab('community')}
          className={`flex-1 flex flex-col items-center justify-center py-3.5 gap-1.5 transition-colors ${activeTab === 'community' ? 'text-emerald-400' : 'text-neutral-500 hover:text-neutral-300'}`}
        >
          <Users className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Community</span>
        </button>
        <button
          onClick={() => setActiveTab('dapps')}
          className={`flex-1 flex flex-col items-center justify-center py-3.5 gap-1.5 transition-colors ${activeTab === 'dapps' ? 'text-emerald-400' : 'text-neutral-500 hover:text-neutral-300'}`}
        >
          <LayoutGrid className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-widest">dApps</span>
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 flex flex-col items-center justify-center py-3.5 gap-1.5 transition-colors ${activeTab === 'settings' ? 'text-emerald-400' : 'text-neutral-500 hover:text-neutral-300'}`}
        >
          <Settings className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Settings</span>
        </button>
      </nav>
    </div>
  );
}

