'use client';

import React, { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Hash, Loader2, MessageSquare, Search, Send, Users } from 'lucide-react';
import { Role } from '@koraylo/shared';
import type { ChannelData, MessageData } from '@koraylo/shared';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { usePolling } from '@/hooks/usePolling';
import api, { ApiError } from '@/lib/api';

type ChannelWithPermissions = ChannelData & { canPost?: boolean };
type ApiEnvelope<T> = { success?: boolean; data?: T; error?: string };

interface ChatWorkspaceProps {
  heading: string;
  description: string;
}

function initials(name?: string) {
  return (name || '?')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

function formatMessageTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function mergeMessages(current: MessageData[], incoming: MessageData[]) {
  const byId = new Map(current.map((message) => [message.id, message]));
  incoming.forEach((message) => byId.set(message.id, message));
  return Array.from(byId.values()).sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
}

export function ChatWorkspace({ heading, description }: ChatWorkspaceProps) {
  const { user } = useAuth();
  const [channels, setChannels] = useState<ChannelWithPermissions[]>([]);
  const [activeChannelId, setActiveChannelId] = useState('');
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingChannels, setLoadingChannels] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [pollingReady, setPollingReady] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [channelError, setChannelError] = useState('');
  const cursorRef = useRef<string>(new Date(Date.now() - 60_000).toISOString());
  const messageListRef = useRef<HTMLDivElement | null>(null);

  const activeChannel = useMemo(
    () => channels.find((channel) => channel.id === activeChannelId),
    [channels, activeChannelId]
  );
  const filteredChannels = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return channels;
    return channels.filter((channel) => channel.name.toLowerCase().includes(query));
  }, [channels, searchTerm]);
  const isAdmin = user?.role === Role.ADMIN;
  const canSend = Boolean(activeChannel && (isAdmin || (!activeChannel.readOnly && activeChannel.canPost !== false)));

  // Load only channels the signed-in user belongs to. No demo/fallback channels.
  useEffect(() => {
    if (!user?.id) return;
    const controller = new AbortController();
    setLoadingChannels(true);
    setChannelError('');

    api.get<ApiEnvelope<ChannelWithPermissions[]>>('/api/channels/my', { signal: controller.signal })
      .then((response) => {
        if (controller.signal.aborted) return;
        const nextChannels = Array.isArray(response?.data) ? response.data : [];
        setChannels(nextChannels);
        setActiveChannelId((current) =>
          current && nextChannels.some((channel) => channel.id === current)
            ? current
            : nextChannels[0]?.id || ''
        );
      })
      .catch((requestError) => {
        if (controller.signal.aborted) return;
        setChannels([]);
        setChannelError(requestError instanceof Error ? requestError.message : 'Unable to load channels.');
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoadingChannels(false);
      });

    return () => controller.abort();
  }, [user?.id]);

  // Load the newest page whenever the selected channel changes.
  useEffect(() => {
    if (!activeChannelId) {
      setMessages([]);
      setPollingReady(false);
      return;
    }

    const controller = new AbortController();
    setLoadingMessages(true);
    setPollingReady(false);
    setMessages([]);
    setError('');

    api.get<ApiEnvelope<MessageData[]>>(`/api/messages/${encodeURIComponent(activeChannelId)}?limit=50`, {
      signal: controller.signal,
    })
      .then((response) => {
        if (controller.signal.aborted) return;
        const initialMessages = Array.isArray(response?.data) ? response.data : [];
        setMessages(initialMessages);
        const latest = initialMessages[initialMessages.length - 1];
        cursorRef.current = latest?.createdAt || new Date(Date.now() - 60_000).toISOString();
        setPollingReady(true);
      })
      .catch((requestError) => {
        if (controller.signal.aborted) return;
        setError(requestError instanceof Error ? requestError.message : 'Unable to load messages.');
        setPollingReady(true); // Allow the poller to recover automatically when the API returns.
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoadingMessages(false);
      });

    return () => controller.abort();
  }, [activeChannelId]);

  const pollMessages = useCallback(async () => {
    if (!activeChannelId || !pollingReady) return;
    // Use the last persisted message timestamp as the cursor. The API returns
    // messages in ascending order; IDs are de-duplicated before updating state.
    const cursorTime = new Date(cursorRef.current).getTime();
    try {
      const response = await api.get<ApiEnvelope<MessageData[]>>(
        `/api/messages/${encodeURIComponent(activeChannelId)}/new?after=${encodeURIComponent(cursorRef.current)}`
      );
      const incoming = Array.isArray(response?.data) ? response.data : [];
      if (incoming.length === 0) return;

      setMessages((current) => mergeMessages(current, incoming));
      const latest = incoming.reduce((newest, message) =>
        new Date(message.createdAt).getTime() > new Date(newest.createdAt).getTime() ? message : newest
      );
      if (new Date(latest.createdAt).getTime() > cursorTime) cursorRef.current = latest.createdAt;
      setError('');
    } catch (pollError) {
      setError(pollError instanceof Error ? pollError.message : 'Unable to refresh messages.');
      throw pollError;
    }
  }, [activeChannelId, pollingReady]);

  usePolling(pollMessages, { interval: 5000, enabled: Boolean(activeChannelId && pollingReady && !loadingMessages) });

  useEffect(() => {
    const element = messageListRef.current;
    if (element) element.scrollTop = element.scrollHeight;
  }, [messages.length, activeChannelId]);

  const handleSend = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const content = inputMessage.trim();
    if (!content || !activeChannelId || !canSend || sending) return;

    setSending(true);
    setError('');
    try {
      const response = await api.post<ApiEnvelope<MessageData>>(
        `/api/messages/${encodeURIComponent(activeChannelId)}`,
        { content }
      );
      if (!response?.data?.id) throw new Error('The API did not return the saved message.');
      setMessages((current) => mergeMessages(current, [response.data!]));
      cursorRef.current = response.data.createdAt;
      setInputMessage('');
    } catch (sendError) {
      setError(sendError instanceof ApiError ? sendError.message : sendError instanceof Error ? sendError.message : 'Message could not be sent.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="h-[calc(100vh-8.5rem)] min-h-[520px] flex flex-col md:flex-row gap-4">
      <Card className="w-full md:w-80 border-gray-200 shadow-sm flex flex-col shrink-0 overflow-hidden bg-white">
        <div className="p-4 border-b border-gray-100 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="font-bold text-base text-gray-900">{heading}</h2>
              <p className="text-[11px] text-gray-500">Your assigned channels</p>
            </div>
            <Badge variant="outline" className="text-[10px]">{channels.length} Channels</Badge>
          </div>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search channels..."
              className="h-9 pl-8 text-xs bg-gray-50 border-gray-200"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {loadingChannels && (
            <div className="flex items-center gap-2 p-3 text-xs text-gray-500"><Loader2 className="h-4 w-4 animate-spin" /> Loading channels...</div>
          )}
          {!loadingChannels && channelError && <p className="p-3 text-xs text-red-600">{channelError}</p>}
          {!loadingChannels && !channelError && filteredChannels.length === 0 && (
            <div className="p-4 text-center text-xs text-gray-500">
              <MessageSquare className="h-6 w-6 mx-auto mb-2 text-gray-300" />
              {channels.length === 0 ? 'No channels are assigned to your account yet.' : 'No channels match your search.'}
            </div>
          )}
          {filteredChannels.map((channel) => {
            const isActive = channel.id === activeChannelId;
            return (
              <button
                key={channel.id}
                type="button"
                onClick={() => setActiveChannelId(channel.id)}
                className={`w-full flex items-center justify-between gap-2 p-2.5 rounded-lg text-left transition-colors text-xs ${
                  isActive ? 'bg-emerald-50 text-emerald-950 font-semibold border border-emerald-200' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Hash className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-700' : 'text-gray-400'}`} />
                  <span className="truncate">{channel.name}</span>
                </div>
                {channel.readOnly && <Badge variant="outline" className="text-[9px] shrink-0">Read only</Badge>}
              </button>
            );
          })}
        </div>
      </Card>

      <Card className="flex-1 border-gray-200 shadow-sm flex flex-col overflow-hidden bg-white">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-3 bg-gray-50/50">
          <div className="flex items-center gap-2 min-w-0">
            <Hash className="w-5 h-5 text-emerald-700 shrink-0" />
            <div className="min-w-0">
              <h3 className="font-bold text-sm text-gray-900 truncate">{activeChannel?.name || 'Select a channel'}</h3>
              <p className="text-[11px] text-gray-500 truncate">{activeChannel ? description : 'Messages from your campus channels appear here.'}</p>
            </div>
          </div>
          {activeChannel && <Badge variant="outline" className="text-[10px] uppercase shrink-0">{activeChannel.type}</Badge>}
        </div>

        <div ref={messageListRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {loadingMessages && <div className="flex items-center justify-center gap-2 py-8 text-xs text-gray-500"><Loader2 className="h-4 w-4 animate-spin" /> Loading messages...</div>}
          {!loadingMessages && activeChannel && messages.length === 0 && (
            <div className="h-full min-h-40 flex flex-col items-center justify-center text-center text-xs text-gray-500">
              <MessageSquare className="h-8 w-8 mb-2 text-gray-300" />
              No messages yet. Start the conversation.
            </div>
          )}
          {!activeChannel && !loadingMessages && (
            <div className="h-full flex flex-col items-center justify-center text-center text-xs text-gray-500">
              <Users className="h-8 w-8 mb-2 text-gray-300" />
              Select one of your channels to view its messages.
            </div>
          )}
          {messages.map((message) => {
            const isSelf = message.senderId === user?.id;
            const sender = message.senderName || 'Campus member';
            return (
              <div key={message.id} className={`flex items-start gap-3 ${isSelf ? 'flex-row-reverse' : ''}`}>
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback className={`text-[11px] font-bold ${isSelf ? 'bg-emerald-900 text-white' : 'bg-gray-200 text-gray-800'}`}>
                    {initials(sender)}
                  </AvatarFallback>
                </Avatar>
                <div className={`max-w-[75%] rounded-2xl p-3.5 text-xs shadow-sm ${isSelf ? 'bg-emerald-950 text-white rounded-tr-none' : 'bg-gray-100 text-gray-800 rounded-tl-none border border-gray-200/60'}`}>
                  {!isSelf && <p className="font-bold text-[11px] text-emerald-800 mb-1">{sender}</p>}
                  <p className="leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
                  <p className={`text-[9px] mt-1.5 text-right font-medium ${isSelf ? 'text-emerald-200' : 'text-gray-400'}`}>
                    {formatMessageTime(message.createdAt)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {error && <div role="alert" className="mx-3 mb-2 rounded-md bg-red-50 px-3 py-2 text-xs text-red-700">{error}</div>}
        <form onSubmit={handleSend} className="p-3 border-t border-gray-200 flex items-center gap-2 bg-white">
          <Input
            placeholder={!activeChannel ? 'Select a channel first' : canSend ? `Message ${activeChannel.name}...` : 'Posting is disabled in this channel'}
            value={inputMessage}
            onChange={(event) => setInputMessage(event.target.value)}
            maxLength={4000}
            disabled={!activeChannel || !canSend || sending}
            className="flex-1 h-10 text-xs bg-gray-50 focus-visible:bg-white border-gray-200"
          />
          <Button type="submit" disabled={!activeChannel || !canSend || !inputMessage.trim() || sending} className="h-10 bg-emerald-950 hover:bg-emerald-800 text-white shrink-0 px-4">
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </form>
      </Card>
    </div>
  );
}
