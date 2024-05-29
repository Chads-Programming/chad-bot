import {
  Client,
  Collection,
  CommandInteraction,
  Events,
  GatewayIntentBits,
  REST,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  Routes,
  SlashCommandBuilder,
} from 'discord.js';

interface ClientConfig {
  token: string;
  clientId: string;
  guildId: string;
}


export interface Command {
  data: {
    name: string;
    description: string;
  };
  execute: (interaction: CommandInteraction) => Promise<void>;
}

interface ExtendedClient extends Client {
  commands: Collection<string, Command>;
}

const discordClient = (config: ClientConfig) => {
  const client: ExtendedClient = new Client({
    intents: [GatewayIntentBits.Guilds],
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
      console.log(`Started refreshing ${commands.length} application (/) commands.`);
  
      const data = await rest.put(
        Routes.applicationGuildCommands(config.clientId, config.guildId),
        { body: commands },
      ) as Array<unknown>;
  
      console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
      console.error(error);
    }
  }


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
    client.on(Events.InteractionCreate, async (interaction) => {
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
    });
  };

  return {
    listenInteractions,
    registerSlashCommand,
    deployCommands
  };
};


export default discordClient
