import { envs } from '@/config/env';
import type { GuildMember } from 'discord.js';

export async function memberAddEvent(member: GuildMember) {
  try {
    if (member.user.bot) return;
    const defaultRole = envs.DEFAULT_ROLE_ID;
    if (!defaultRole) return;
    await member.roles.add(defaultRole);
  } catch (error) {
    console.error('[EVENTS - MEMBER-ADD] Error adding default role: ', error);
  }
}
