import React, { useState, useEffect } from 'react';
import { Globe, Gamepad2, Users, LayoutGrid, WifiOff, ShieldCheck, ChevronRight, PlaySquare, Settings, Wallet, Mail, LogOut, Trash2, MessageSquare, ArrowLeft, Send, Target } from 'lucide-react';
import { WarriorFight } from './components/WarriorFight';
import { supabase } from './lib/supabase';
import { encryptMessage, decryptMessage } from './lib/encryption';
import { EarnHub } from './components/EarnHub';
import { WalletDash } from './components/WalletDash';

export default function App() {
  const [activeTab, setActiveTab] = useState<'games' | 'community' | 'earn' | 'wallet' | 'browser'>('games');
  const [communitySubTab, setCommunitySubTab] = useState<'feed' | 'groups'>('feed');
  const [isSimulatedLogin, setIsSimulatedLogin] = useState(false);
  const [authMethod, setAuthMethod] = useState<'wallet' | 'browser'>('wallet');
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const [activeGroupChat, setActiveGroupChat] = useState<any | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [groupMessages, setGroupMessages] = useState<any[]>([]);

  useEffect(() => {
    if (activeGroupChat) {
      fetchMessages(activeGroupChat.id);
      
      // Real-time subscription placeholder
      const channel = supabase
        .channel('public:group_messages')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'group_messages', filter: `group_id=eq.${activeGroupChat.id}` }, payload => {
            const raw = payload.new;
            const decryptedContent = decryptMessage(raw.content_encrypted, raw.iv);
            setGroupMessages(prev => [...prev, {
              id: raw.id,
              text: decryptedContent,
              author: raw.author_name,
              isMe: raw.author_id === 'local-user-id'
            }]);
        })
        .subscribe();
        
      return () => { supabase.removeChannel(channel); };
    }
  }, [activeGroupChat]);

  const fetchMessages = async (groupId: string) => {
    try {
      const { data, error } = await supabase
        .from('group_messages')
        .select('*')
        .eq('group_id', groupId)
        .order('created_at', { ascending: true })
        .limit(50);
        
      if (error) throw error;
      
      const parsed = data.map(raw => ({
        id: raw.id,
        text: decryptMessage(raw.content_encrypted, raw.iv),
        author: raw.author_name,
        isMe: raw.author_id === 'local-user-id' // Using a placeholder static local ID
      }));
      setGroupMessages(parsed);
    } catch (err) {
      // Fallback for demo when DB is just a placeholder
      setGroupMessages([
        { id: 1, text: "Has anyone set up their Ang node yet? (E2E Encrypted)", author: "simu1...88a", isMe: false },
        { id: 2, text: "Yes, running smoothly on a low-end VPS!", author: "crypto_fan", isMe: false },
      ]);
    }
  };

  const handleSendChat = async () => {
    if(!isSimulatedLogin) return alert("Log in via Settings to chat!");
    if(!chatInput.trim() || !activeGroupChat) return;
    
    // Add to UI optimistically
    const newMsg = { id: Date.now(), text: chatInput, author: "You", isMe: true };
    setGroupMessages(prev => [...prev, newMsg]);
    const textToSend = chatInput;
    setChatInput('');
    
    // Encrypt and send
    try {
      const { content, iv } = encryptMessage(textToSend);
      await supabase.from('group_messages').insert([{
        group_id: activeGroupChat.id,
        author_id: 'local-user-id',
        author_name: 'You',
        content_encrypted: content,
        iv: iv
      }]);
    } catch(err) {
      console.warn("Failed to send encrypted message to db (demo mode active)");
    }
  };

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
                { id: '0', name: 'African Warrior', url: 'https://games.simu.network/warrior', size: '200 KB', category: 'Action', cached: true },
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
                    <div 
                      key={group.id} 
                      onClick={() => isSimulatedLogin ? setActiveGroupChat(group) : alert('Please log in via Settings')}
                      className="p-5 bg-neutral-900 rounded-2xl border border-neutral-800 hover:border-emerald-500/50 cursor-pointer transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          {group.icon && <group.icon className="w-5 h-5 text-emerald-400" />}
                          <h3 className="font-bold text-white text-lg group-hover:text-emerald-400 transition-colors">{group.name}</h3>
                        </div>
                        <span className="px-2 py-1 bg-neutral-800 rounded text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                          {group.type}
                        </span>
                      </div>
                      <p className="text-neutral-400 text-sm mb-4">{group.desc}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-neutral-500 font-medium">{group.members} members</span>
                        <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-sm rounded-full transition-colors">
                          Open Chat
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        )}

        {activeTab === 'earn' && <EarnHub />}

        {activeTab === 'wallet' && <WalletDash />}

        {/* Group Chat Overlay View */}
        {activeGroupChat && (
          <div className="absolute inset-0 flex flex-col bg-neutral-950 z-30">
            <div className="flex items-center gap-3 p-4 bg-neutral-900 border-b border-neutral-800 shadow-md">
              <button 
                onClick={() => setActiveGroupChat(null)}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h3 className="font-bold text-white leading-tight">{activeGroupChat.name}</h3>
                <span className="text-xs text-emerald-400 font-bold">{activeGroupChat.members} members</span>
              </div>
            </div>
            
            <div className="flex-1 p-5 overflow-y-auto space-y-4">
               {groupMessages.map(msg => (
                 <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                   <div className={`max-w-[80%] p-3 rounded-2xl ${msg.isMe ? 'bg-emerald-500 text-neutral-950 rounded-br-sm' : 'bg-neutral-800 text-white rounded-bl-sm'}`}>
                     {!msg.isMe && <div className="text-[10px] font-bold text-emerald-400 mb-1">{msg.author}</div>}
                     <div className="text-sm shadow-sm">{msg.text}</div>
                   </div>
                 </div>
               ))}
            </div>

            <div className="p-4 bg-neutral-900 border-t border-neutral-800 flex items-center gap-3">
              <input 
                type="text" 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                placeholder={isSimulatedLogin ? "Say something..." : "Please log in to chat..."}
                disabled={!isSimulatedLogin}
                className="flex-1 bg-neutral-950 border border-neutral-800 disabled:opacity-50 disabled:bg-neutral-900 rounded-full px-5 py-3 text-white text-sm focus:outline-none focus:border-emerald-500/50" 
              />
              <button 
                onClick={handleSendChat}
                disabled={!isSimulatedLogin}
                className="w-12 h-12 flex items-center justify-center bg-emerald-500 disabled:opacity-50 disabled:bg-neutral-800 text-neutral-950 disabled:text-neutral-500 rounded-full transition-colors shrink-0"
              >
                <Send className="w-5 h-5 ml-1" />
              </button>
            </div>
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
            
            {currentUrl === 'https://games.simu.network/warrior' ? (
              <div className="flex-1 overflow-hidden p-2 sm:p-5">
                <WarriorFight onComplete={() => { alert('Victory! You earned 10 Stars.'); setActiveTab('games'); }} />
              </div>
            ) : (
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
            )}
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
          onClick={() => setActiveTab('earn')}
          className={`flex-1 flex flex-col items-center justify-center py-3.5 gap-1.5 transition-colors ${activeTab === 'earn' ? 'text-emerald-400' : 'text-neutral-500 hover:text-neutral-300'}`}
        >
          <Target className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Earn</span>
        </button>
        <button
          onClick={() => setActiveTab('wallet')}
          className={`flex-1 flex flex-col items-center justify-center py-3.5 gap-1.5 transition-colors ${activeTab === 'wallet' ? 'text-emerald-400' : 'text-neutral-500 hover:text-neutral-300'}`}
        >
          <Wallet className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Wallet</span>
        </button>
      </nav>
    </div>
  );
}

