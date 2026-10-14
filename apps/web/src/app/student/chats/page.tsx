'use client';

import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  Search,
  Users,
  Hash,
  Sparkles,
  Paperclip,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { usePolling } from '@/hooks/usePolling';

interface ChatMessage {
  id: string;
  sender: string;
  avatar: string;
  text: string;
  time: string;
  isSelf: boolean;
}

export default function StudentChatsPage() {
  const [channels] = useState([
    {
      id: 'cs301',
      name: 'CS301 - Data Structures',
      type: 'course',
      unread: 2,
    },
    {
      id: 'batch2024',
      name: 'CSE Batch 2024 (Section A)',
      type: 'section',
      unread: 0,
    },
    {
      id: 'cse-club',
      name: 'CSE Technical Club',
      type: 'club',
      unread: 5,
    },
    {
      id: 'hackathon',
      name: 'Hackathon 2026 Discussion',
      type: 'event',
      unread: 0,
    },
  ]);

  const [activeChannelId, setActiveChannelId] = useState('cs301');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'Prof. R. Ramanujan',
      avatar: 'RR',
      text: 'Good morning everyone! Please make sure to review Lecture 12 before tomorrow’s lab.',
      time: '09:15 AM',
      isSelf: false,
    },
    {
      id: '2',
      sender: 'Neha Roy',
      avatar: 'NR',
      text: 'Professor, will the Red-Black Tree deletion algorithm be included in the test?',
      time: '09:22 AM',
      isSelf: false,
    },
    {
      id: '3',
      sender: 'Prof. R. Ramanujan',
      avatar: 'RR',
      text: 'Only insertion in Red-Black Trees will be tested. Deletion will be covered for conceptual reference.',
      time: '09:30 AM',
      isSelf: false,
    },
    {
      id: '4',
      sender: 'Aarav Sharma',
      avatar: 'AS',
      text: 'Thank you Professor! Will submit the lab assignment today.',
      time: '09:45 AM',
      isSelf: true,
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');

  // Use polling hook
  usePolling(() => {
    // In production, sync channel messages from API
  }, { interval: 5000 });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'Aarav Sharma',
      avatar: 'AS',
      text: inputMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSelf: true,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputMessage('');
  };

  const activeChannel = channels.find((c) => c.id === activeChannelId);

  return (
    <div className="h-[calc(100vh-8.5rem)] flex flex-col md:flex-row gap-4">
      {/* Channels Sidebar List */}
      <Card className="w-full md:w-80 border-gray-200 shadow-sm flex flex-col shrink-0 overflow-hidden bg-white">
        <div className="p-4 border-b border-gray-100 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-base text-gray-900">Campus Channels</h2>
            <Badge variant="campus" className="text-[10px]">
              {channels.length} Active
            </Badge>
          </div>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Search channels..."
              className="h-8 pl-8 text-xs bg-gray-50 border-gray-200"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {channels.map((ch) => {
            const isActive = ch.id === activeChannelId;
            return (
              <button
                key={ch.id}
                onClick={() => setActiveChannelId(ch.id)}
                className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left transition-colors text-xs ${
                  isActive
                    ? 'bg-campus-green-50/80 text-campus-green-950 font-semibold border border-campus-green-200'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <Hash
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-campus-green-600' : 'text-gray-400'
                    }`}
                  />
                  <span className="truncate">{ch.name}</span>
                </div>
                {ch.unread > 0 && (
                  <span className="shrink-0 text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-600 text-white font-bold">
                    {ch.unread}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Chat Messages and Input area */}
      <Card className="flex-1 border-gray-200 shadow-sm flex flex-col overflow-hidden bg-white">
        {/* Active Channel Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-2">
            <Hash className="w-5 h-5 text-campus-green-700" />
            <div>
              <h3 className="font-bold text-sm text-gray-900">
                {activeChannel?.name}
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Official discussion channel for academic updates & queries
              </p>
            </div>
          </div>
          <Badge variant="outline" className="text-[10px] uppercase font-semibold">
            {activeChannel?.type}
          </Badge>
        </div>

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.isSelf ? 'flex-row-reverse' : ''
              }`}
            >
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback
                  className={`text-[11px] font-bold ${
                    msg.isSelf
                      ? 'bg-campus-green-950 text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {msg.avatar}
                </AvatarFallback>
              </Avatar>

              <div
                className={`max-w-[75%] rounded-2xl p-3.5 text-xs shadow-xs ${
                  msg.isSelf
                    ? 'bg-campus-green-950 text-white rounded-tr-none'
                    : 'bg-gray-100 text-gray-800 rounded-tl-none border border-gray-200/60'
                }`}
              >
                {!msg.isSelf && (
                  <p className="font-bold text-[11px] text-campus-green-800 mb-1">
                    {msg.sender}
                  </p>
                )}
                <p className="leading-relaxed">{msg.text}</p>
                <p
                  className={`text-[9px] mt-1.5 text-right font-medium ${
                    msg.isSelf ? 'text-emerald-200' : 'text-gray-400'
                  }`}
                >
                  {msg.time}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <form
          onSubmit={handleSend}
          className="p-3 border-t border-gray-200 flex items-center gap-2 bg-white"
        >
          <Input
            placeholder={`Message ${activeChannel?.name || 'channel'}...`}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-1 h-10 text-xs bg-gray-50 focus-visible:bg-white border-gray-200"
          />
          <Button
            type="submit"
            className="h-10 bg-campus-green-950 hover:bg-campus-green-800 text-white shrink-0 px-4"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </Card>
    </div>
  );
}
