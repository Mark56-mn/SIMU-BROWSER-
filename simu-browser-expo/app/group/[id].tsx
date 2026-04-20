import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { Ionicons } from '@expo/vector-icons';

export default function GroupChatScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [group, setGroup] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    loadData();
    
    // Subscribe to new messages
    const channel = supabase.channel('public:group_messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'group_messages', filter: `group_id=eq.${id}` }, payload => {
        setMessages(prev => [payload.new, ...prev]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  const loadData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      // Load group details
      const { data: gData } = await supabase.from('groups').select('*').eq('id', id).single();
      if (gData) setGroup(gData);

      // Load messages
      const { data: mData } = await supabase
        .from('group_messages')
        .select('*, profiles(username)')
        .eq('group_id', id)
        .order('created_at', { ascending: false })
        .limit(isRefresh ? 100 : 50); // Fetch more on refresh
      
      if (mData) {
        // Simple distinct merge if refreshing
        if (isRefresh && messages.length > 0) {
          const newMap = new Map(mData.map(m => [m.id, m]));
          messages.forEach(m => newMap.set(m.id, m));
          setMessages(Array.from(newMap.values()).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
        } else {
          setMessages(mData);
        }
      }
    } catch (error) {
      console.log('Error loading group chat:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleSend = async () => {
    if (!session) {
      return Alert.alert('Not Logged In', 'Please go to Settings and log in or connect your wallet to chat in groups.');
    }
    if (!inputText.trim()) return;

    const tempText = inputText;
    setInputText('');

    // Mention parsing logic
    const mentionRegex = /@(\w+)/g;
    const mentions = [...tempText.matchAll(mentionRegex)].map(m => m[1]);

    if (mentions.length > 0) {
      // MOCK NOTIFICATION SYSTEM
      console.log(`Sending simulated notifications to: ${mentions.join(', ')}`);
      // In a real app we would ping the notifications tables or use expo-notifications wrapper logic
    }

    const { error } = await supabase.from('group_messages').insert({
      group_id: id,
      author_id: session.user.id,
      content: tempText
    });

    if (error) {
      Alert.alert('Error', 'Could not send message. Ensure you have joined the group.');
      setInputText(tempText);
    }
  };

  const renderMessageContent = (text: string, isMe: boolean) => {
    const parts = text.split(/(@\w+)/g);
    return (
      <Text style={[styles.msgText, isMe ? styles.myMsgText : styles.theirMsgText]}>
        {parts.map((part, i) => {
          if (part.startsWith('@')) {
            return <Text key={i} style={styles.mentionText}>{part}</Text>;
          }
          return part;
        })}
      </Text>
    );
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#00FFA3" /></View>;

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={90}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#00FFA3" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{group?.name || 'Group Chat'}</Text>
      </View>

      <FlatList
        data={messages}
        inverted
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadData(true)} tintColor="#00FFA3" />}
        renderItem={({ item }) => {
          const isMe = session?.user?.id === item.author_id;
          return (
            <View style={[styles.messageBubble, isMe ? styles.myMessage : styles.theirMessage]}>
              {!isMe && <Text style={styles.msgAuthor}>{item.profiles?.username || 'Anonymous'}</Text>}
              {renderMessageContent(item.content, isMe)}
            </View>
          );
        }}
        ListEmptyComponent={<Text style={styles.empty}>No messages yet. Be the first to say hello!</Text>}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor="#888"
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={handleSend}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
          <Ionicons name="send" size={20} color="#000" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0A0A0A' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#333', backgroundColor: '#111' },
  backBtn: { marginRight: 16 },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  list: { padding: 16 },
  messageBubble: { maxWidth: '80%', padding: 12, borderRadius: 16, marginBottom: 12 },
  myMessage: { backgroundColor: '#00FFA3', alignSelf: 'flex-end', borderBottomRightRadius: 4 },
  theirMessage: { backgroundColor: '#222', alignSelf: 'flex-start', borderBottomLeftRadius: 4 },
  msgAuthor: { color: '#00FFA3', fontSize: 10, fontWeight: 'bold', marginBottom: 4 },
  msgText: { color: '#FFF', fontSize: 14 },
  myMsgText: { color: '#000' }, // Dark text for my explicit background
  theirMsgText: { color: '#FFF' },
  mentionText: { fontWeight: 'bold', color: '#FFD700', textDecorationLine: 'underline' },
  empty: { color: '#666', textAlign: 'center', marginTop: 50 },
  inputContainer: { flexDirection: 'row', padding: 12, borderTopWidth: 1, borderTopColor: '#333', alignItems: 'center', backgroundColor: '#111' },
  input: { flex: 1, backgroundColor: '#222', color: '#FFF', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, marginRight: 12 },
  sendBtn: { backgroundColor: '#00FFA3', width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' }
});
