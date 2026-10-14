export enum ChannelType {
  SECTION = 'section',
  COURSE = 'course',
  CLUB = 'club',
  EVENT = 'event',
}

export interface ChannelData {
  id: string;
  name: string;
  type: ChannelType;
  referenceId?: string;
  readOnly: boolean;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount?: number;
}

export interface MessageData {
  id: string;
  channelId: string;
  senderId: string;
  senderName?: string;
  content: string;
  createdAt: string;
}

export interface AnnouncementData {
  id: string;
  title: string;
  content: string;
  scope: string;
  scopeId?: string;
  authorId: string;
  authorName?: string;
  createdAt: string;
}
