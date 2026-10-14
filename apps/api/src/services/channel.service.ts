import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { ChannelType, ChannelData } from '@koraylo/shared';

export async function getUserChannels(userId: string): Promise<Array<ChannelData & { canPost: boolean }>> {
  const memberships = await prisma.channelMember.findMany({
    where: { userId },
    include: {
      channel: {
        include: {
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            include: {
              sender: { select: { name: true } },
            },
          },
        },
      },
    },
    orderBy: { channel: { createdAt: 'desc' } },
  });

  return memberships.map((membership) => {
    const ch = membership.channel;
    const lastMsg = ch.messages[0];

    return {
      id: ch.id,
      name: ch.name,
      type: ch.type as ChannelType,
      referenceId: ch.referenceId || undefined,
      readOnly: ch.readOnly,
      canPost: membership.canPost,
      lastMessage: lastMsg ? `${lastMsg.sender.name}: ${lastMsg.content}` : undefined,
      lastMessageAt: lastMsg ? lastMsg.createdAt.toISOString() : undefined,
    };
  });
}

export async function getChannelById(channelId: string, userId: string) {
  const membership = await prisma.channelMember.findUnique({
    where: {
      channelId_userId: {
        channelId,
        userId,
      },
    },
  });

  const channel = await prisma.channel.findUnique({
    where: { id: channelId },
    include: {
      _count: {
        select: { members: true },
      },
    },
  });

  if (!channel) {
    throw new AppError('Channel not found', 404);
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!membership && user?.role !== 'admin') {
    throw new AppError('Forbidden: you are not a member of this channel', 403);
  }

  return {
    id: channel.id,
    name: channel.name,
    type: channel.type as ChannelType,
    referenceId: channel.referenceId || undefined,
    readOnly: channel.readOnly,
    canPost: membership ? membership.canPost : true,
    memberCount: channel._count.members,
    createdAt: channel.createdAt.toISOString(),
  };
}
