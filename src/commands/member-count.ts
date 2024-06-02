import type { Command } from '@/types/command.type';

export default {
    data: {
        name: 'member-count',
        description: 'Devuelve el número de miembros en el servidor 🌍',
    },
    execute: async (interaction) => {
        try {
            const guild = interaction.guild;
            if (!guild) throw new Error('Error al obtener el servidor')
            const guildMembers = await guild.members.fetch();
            const members = guildMembers.filter(member => !member.user.bot);
            const membersCount = members.size

            await interaction.reply(`Hay \`${membersCount}\` miembros en el servidor`);
        } catch (error) {
            console.error('[COMMANDS - MEMBER-COUNT]: ', error); 
            await interaction.reply('Ocurrió un error al obtener el número de miembros.');
        }
    },
} as Command;