'use client';

import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  Search,
  Hash,
  Sparkles,
  Users,
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

export default function FacultyChatsPage() {
  const [channels] = useState([
    {
      id: 'cs301-a',
      name: 'CS301 - Section A',
      type: 'course',
      unread: 1,
    },
    {
      id: 'cs301-b',
      name: 'CS301 - Section B',
      type: 'course',
      unread: 0,
    },
    {
      id: 'faculty-dept',
      name: 'CSE Faculty Council',
      type: 'department',
      unread: 3,
    },
    {
      id: 'hackathon-leads',
      name: 'Hackathon 2026 Faculty Advisory',
      type: 'event',
      unread: 0,
    },
  ]);

  const [activeChannelId, setActiveChannelId] = useState('cs301-a');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'Dr. Anita Sharma',
      avatar: 'AS',
      text: 'Good morning class. Mid-semester evaluation results for Section A will be published by 4:00 PM today.',
      time: '08:45 AM',
      isSelf: true,
    },
    {
      id: '2',
      sender: 'Aarav Sharma (22CS001)',
      avatar: 'AS',
      text: 'Thank you Professor! Will we get individual feedback on the dynamic programming problem?',
      time: '09:02 AM',
      isSelf: false,
    },
    {
      id: '3',
      sender: 'Dr. Anita Sharma',
      avatar: 'AS',
      text: 'Yes, detailed remarks are attached against each criterion in Google Classroom.',
      time: '09:12 AM',
      isSelf: true,
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');

  usePolling(() => {}, { interval: 5000 });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'Dr. Anita Sharma',
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
            <h2 className="font-bold text-base text-gray-900">Faculty Channels</h2>
            <Badge variant="campus" className="text-[10px]">
              {channels.length} Assigned
            </Badge>
          </div>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Search faculty channels..."
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
                Official instructional communication channel with class members
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
            placeholder={`Post an announcement or reply to ${activeChannel?.name}...`}
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
