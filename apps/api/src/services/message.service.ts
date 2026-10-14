import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { MessageData } from '@koraylo/shared';

export interface GetMessagesOptions {
  limit?: number;
  before?: string;
}

export async function getChannelMessages(
  channelId: string,
  userId: string,
  options: GetMessagesOptions
): Promise<MessageData[]> {
  const membership = await prisma.channelMember.findUnique({
    where: {
      channelId_userId: {
        channelId,
        userId,
      },
    },
  });

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!membership && user?.role !== 'admin') {
    throw new AppError('Forbidden: you are not a member of this channel', 403);
  }

  const limit = Math.min(Math.max(Number(options.limit) || 50, 1), 100);
  const where: any = { channelId };

  if (options.before) {
    where.createdAt = {
      lt: new Date(options.before),
    };
  }

  const messages = await prisma.message.findMany({
    where,
    take: limit,
    orderBy: { createdAt: 'desc' },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          role: true,
        },
      },
    },
  });

  // Return in chronological order
  return messages.reverse().map((msg) => ({
    id: msg.id,
    channelId: msg.channelId,
    senderId: msg.senderId,
    senderName: msg.sender.name,
    content: msg.content,
    createdAt: msg.createdAt.toISOString(),
  }));
}

export async function sendMessage(
  channelId: string,
  senderId: string,
  content: string
): Promise<MessageData> {
  if (!content || !content.trim()) {
    throw new AppError('Message content cannot be empty', 400);
  }

  const channel = await prisma.channel.findUnique({
    where: { id: channelId },
  });

  if (!channel) {
    throw new AppError('Channel not found', 404);
  }

  const membership = await prisma.channelMember.findUnique({
    where: {
      channelId_userId: {
        channelId,
        userId: senderId,
      },
    },
  });

  const user = await prisma.user.findUnique({ where: { id: senderId } });
  const isAdmin = user?.role === 'admin';

  if (!membership && !isAdmin) {
    throw new AppError('Forbidden: you are not a member of this channel', 403);
  }

  if (membership && !membership.canPost && !isAdmin) {
    throw new AppError('Forbidden: you do not have permission to post in this channel', 403);
  }

  const message = await prisma.message.create({
    data: {
      channelId,
      senderId,
      content: content.trim(),
    },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return {
    id: message.id,
    channelId: message.channelId,
    senderId: message.senderId,
    senderName: message.sender.name,
    content: message.content,
    createdAt: message.createdAt.toISOString(),
  };
}

export async function pollNewMessages(
  channelId: string,
  userId: string,
  afterTimestamp: string
): Promise<MessageData[]> {
  const membership = await prisma.channelMember.findUnique({
    where: {
      channelId_userId: {
        channelId,
        userId,
      },
    },
  });

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!membership && user?.role !== 'admin') {
    throw new AppError('Forbidden: you are not a member of this channel', 403);
  }

  const afterDate = afterTimestamp ? new Date(afterTimestamp) : new Date(Date.now() - 60000);

  const messages = await prisma.message.findMany({
    where: {
      channelId,
      createdAt: {
        gt: afterDate,
      },
    },
    orderBy: { createdAt: 'asc' },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return messages.map((msg) => ({
    id: msg.id,
    channelId: msg.channelId,
    senderId: msg.senderId,
    senderName: msg.sender.name,
    content: msg.content,
    createdAt: msg.createdAt.toISOString(),
  }));
}
