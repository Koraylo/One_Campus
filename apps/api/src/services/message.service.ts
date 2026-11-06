import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { MessageData } from '@koraylo/shared';

export interface GetMessagesOptions {
  limit?: number;
  before?: string;
}

async function assertChannelAccess(channelId: string, userId: string) {
  const [channel, user, membership] = await Promise.all([
    prisma.channel.findUnique({ where: { id: channelId } }),
    prisma.user.findUnique({ where: { id: userId }, select: { role: true } }),
    prisma.channelMember.findUnique({ where: { channelId_userId: { channelId, userId } } }),
  ]);

  if (!channel) throw new AppError('Channel not found', 404);
  const isAdmin = user?.role === 'admin';
  if (!membership && !isAdmin) {
    throw new AppError('Forbidden: you are not a member of this channel', 403);
  }

  return { channel, membership, isAdmin };
}

function toMessageData(message: any): MessageData {
  return {
    id: message.id,
    channelId: message.channelId,
    senderId: message.senderId,
    senderName: message.sender.name,
    content: message.content,
    createdAt: message.createdAt.toISOString(),
  };
}

export async function getChannelMessages(
  channelId: string,
  userId: string,
  options: GetMessagesOptions
): Promise<MessageData[]> {
  await assertChannelAccess(channelId, userId);
  const limit = Math.min(Math.max(Number(options.limit) || 50, 1), 100);
  const where: any = { channelId };
  if (options.before) where.createdAt = { lt: new Date(options.before) };

  const messages = await prisma.message.findMany({
    where,
    take: limit,
    orderBy: { createdAt: 'desc' },
    include: { sender: { select: { id: true, name: true } } },
  });

  return messages.reverse().map(toMessageData);
}

export async function sendMessage(channelId: string, senderId: string, content: string): Promise<MessageData> {
  const normalizedContent = typeof content === 'string' ? content.trim() : '';
  if (!normalizedContent) throw new AppError('Message content cannot be empty', 400);
  if (normalizedContent.length > 4000) throw new AppError('Messages cannot exceed 4000 characters', 400);

  const { channel, membership, isAdmin } = await assertChannelAccess(channelId, senderId);
  if (channel.readOnly && !isAdmin) {
    throw new AppError('This channel is read-only', 403);
  }
  if (membership && !membership.canPost && !isAdmin) {
    throw new AppError('Forbidden: you do not have permission to post in this channel', 403);
  }

  const message = await prisma.message.create({
    data: { channelId, senderId, content: normalizedContent },
    include: { sender: { select: { id: true, name: true } } },
  });
  return toMessageData(message);
}

export async function pollNewMessages(
  channelId: string,
  userId: string,
  afterTimestamp?: string
): Promise<MessageData[]> {
  await assertChannelAccess(channelId, userId);
  const afterDate = afterTimestamp ? new Date(afterTimestamp) : new Date(Date.now() - 60_000);
  if (Number.isNaN(afterDate.getTime())) throw new AppError('Invalid message cursor timestamp', 400);

  const messages = await prisma.message.findMany({
    where: { channelId, createdAt: { gt: afterDate } },
    orderBy: { createdAt: 'asc' },
    include: { sender: { select: { id: true, name: true } } },
  });
  return messages.map(toMessageData);
}
