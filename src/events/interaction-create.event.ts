import { ExtendedClient } from "@/types/extended-client.type";
import type { CacheType, Interaction } from "discord.js";

export async function interactionCreateEvent(interaction: Interaction<CacheType>) {  
    if (!interaction.isChatInputCommand()) return;

    const interactionClient = interaction.client as ExtendedClient;

    const command = interactionClient.commands.get(interaction.commandName);

    if (!command) {
        console.error(
            `No command matching ${interaction.commandName} was found.`,
        );
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
                content: 'There was an error while executing this command!',
                ephemeral: true,
            });
        } else {
            await interaction.reply({
                content: 'There was an error while executing this command!',
                ephemeral: true,
            });
        }
    }
}