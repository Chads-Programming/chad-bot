import { Command } from '@/client';

export default {
  data: {
    name: 'fox',
    description: 'Dar contexto sobre fox',
  },
  execute: async (interaction) => {
    await interaction.reply(
      `${interaction.user.username} por favor manten a tu novia lejos de fox`,
    );
  },
} as Command;
