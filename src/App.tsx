import React, { useState } from 'react';
import { Globe, Gamepad2, Users, LayoutGrid, WifiOff, ShieldCheck } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'games' | 'community' | 'browser'>('games');
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);

  const openDApp = (url: string) => {
    setCurrentUrl(url);
    setActiveTab('browser');
  };

  return (
    <div className="flex flex-col h-screen bg-neutral-950 text-neutral-100 font-sans">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-neutral-900 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <Globe className="w-6 h-6 text-emerald-400" />
          <h1 className="text-xl font-bold text-emerald-400 tracking-tight">SIMU Browser</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-neutral-800 text-xs font-medium text-emerald-400">
            <ShieldCheck className="w-3 h-3" />
            <span>Secure</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-medium">
            <WifiOff className="w-3 h-3" />
            <span>Offline Ready</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative">
        {activeTab === 'games' && (
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-emerald-400" />
              Games Hub
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {[
                { id: '1', name: 'SIMU Runner', url: 'https://games.simu.network/runner', size: '1.2 MB' },
                { id: '2', name: 'Crypto Puzzle', url: 'https://games.simu.network/puzzle', size: '0.8 MB' },
                { id: '3', name: 'Ang Nodes Tycoon', url: 'https://games.simu.network/tycoon', size: '2.4 MB' },
                { id: '4', name: 'SIMU Chess', url: 'https://games.simu.network/chess', size: '0.5 MB' },
              ].map((game) => (
                <button
                  key={game.id}
                  onClick={() => openDApp(game.url)}
                  className="flex flex-col items-center p-4 bg-neutral-900 rounded-xl border border-neutral-800 hover:border-emerald-500/50 transition-colors text-left"
                >
                  <div className="w-16 h-16 bg-neutral-800 rounded-2xl mb-3 flex items-center justify-center">
                    <Gamepad2 className="w-8 h-8 text-neutral-500" />
                  </div>
                  <span className="font-medium text-sm text-center w-full truncate">{game.name}</span>
                  <span className="text-xs text-neutral-500 mt-1">{game.size}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'community' && (
          <div className="p-4 max-w-2xl mx-auto">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-400" />
              Community Feed
            </h2>
            <div className="space-y-4">
              {[
                { id: '1', title: 'SIMU Node setup guide for 2G networks', author: 'ang_dev', upvotes: 142, time: '2h ago' },
                { id: '2', title: 'New lightweight game released! Only 0.8MB', author: 'simu_games', upvotes: 89, time: '5h ago' },
                { id: '3', title: 'How to optimize offline caching for dApps', author: 'web3_africa', upvotes: 56, time: '1d ago' },
              ].map((post) => (
                <div key={post.id} className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                  <h3 className="font-medium text-neutral-100 mb-2">{post.title}</h3>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500">by <span className="text-emerald-400">{post.author}</span> • {post.time}</span>
                    <button className="flex items-center gap-1 px-2 py-1 bg-neutral-800 rounded text-emerald-400 hover:bg-neutral-700 transition-colors">
                      ▲ {post.upvotes}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'browser' && currentUrl && (
          <div className="absolute inset-0 flex flex-col bg-black">
            <div className="flex items-center gap-3 p-2 bg-neutral-900 border-b border-neutral-800">
              <button 
                onClick={() => setActiveTab('games')}
                className="px-3 py-1 text-sm font-medium text-red-400 hover:bg-red-400/10 rounded transition-colors"
              >
                Close
              </button>
              <div className="flex-1 px-3 py-1.5 bg-neutral-950 rounded-md text-sm text-neutral-400 truncate border border-neutral-800">
                {currentUrl}
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center text-neutral-500 flex-col gap-4">
              <Globe className="w-12 h-12 opacity-20" />
              <p>WebView Simulation</p>
              <p className="text-xs max-w-xs text-center">In the actual React Native app, this renders the ChromeCustomTabs or react-native-webview.</p>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="flex bg-neutral-900 border-t border-neutral-800 pb-safe">
        <button
          onClick={() => setActiveTab('games')}
          className={`flex-1 flex flex-col items-center justify-center py-3 gap-1 ${activeTab === 'games' ? 'text-emerald-400' : 'text-neutral-500 hover:text-neutral-300'}`}
        >
          <Gamepad2 className="w-5 h-5" />
          <span className="text-[10px] font-medium uppercase tracking-wider">Games</span>
        </button>
        <button
          onClick={() => setActiveTab('community')}
          className={`flex-1 flex flex-col items-center justify-center py-3 gap-1 ${activeTab === 'community' ? 'text-emerald-400' : 'text-neutral-500 hover:text-neutral-300'}`}
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px] font-medium uppercase tracking-wider">Community</span>
        </button>
        <button
          onClick={() => setActiveTab('browser')}
          className={`flex-1 flex flex-col items-center justify-center py-3 gap-1 ${activeTab === 'browser' ? 'text-emerald-400' : 'text-neutral-500 hover:text-neutral-300'}`}
        >
          <LayoutGrid className="w-5 h-5" />
          <span className="text-[10px] font-medium uppercase tracking-wider">dApps</span>
        </button>
      </nav>
    </div>
  );
}
