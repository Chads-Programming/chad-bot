import {
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  REST,
  type RESTPostAPIChatInputApplicationCommandsJSONBody,
  Routes,
  SlashCommandBuilder,
} from 'discord.js';
import { interactionCreateEvent, memberAddEvent } from './events';
import type { Command } from './types/command.type';
import type { ExtendedClient } from './types/extended-client.type';

interface ClientConfig {
  token: string;
  clientId: string;
  guildId: string;
}

const discordClient = (config: ClientConfig) => {
  const client: ExtendedClient = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
  }) as ExtendedClient;

  client.once(Events.ClientReady, (readyClient) => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
  });

  client.login(config.token);

  client.commands = new Collection();

  const rest = new REST().setToken(config.token);
  const commands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];

  const deployCommands = async () => {
    try {
      console.log(
        `Started refreshing ${commands.length} application (/) commands.`,
      );

      const data = (await rest.put(
        Routes.applicationGuildCommands(config.clientId, config.guildId),
        { body: commands },
      )) as Array<unknown>;

      console.log(
        `Successfully reloaded ${data.length} application (/) commands.`,
      );
    } catch (error) {
      console.error(error);
    }
  };

  const registerSlashCommand = (command: Command) => {
    const { data, execute } = command;
    const slashComandData = new SlashCommandBuilder()
      .setName(data.name)
      .setDescription(data.description);

    const innerCommand = {
      data: slashComandData,
      execute,
    };

    client.commands.set(data.name, innerCommand);

    commands.push(innerCommand.data.toJSON());
  };

  const listenInteractions = () => {
    client.on(Events.InteractionCreate, interactionCreateEvent);
    client.on(Events.GuildMemberAdd, memberAddEvent);
  };

  return {
    listenInteractions,
    registerSlashCommand,
    deployCommands,
  };
};

export default discordClient;
