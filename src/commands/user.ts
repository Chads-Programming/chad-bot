import { Command } from '@/client';

export default {
  data: {
    name: 'user',
    description: 'Show user info',
  },
  execute: async (interaction) => {
    await interaction.reply(
      `This command was run by ${interaction.user.username}`,
    );
  },
} as Command;
