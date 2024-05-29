import client from './client';
import userCommand from './commands/user';
import { envs } from './config/env';

function bootstrap() {
  const discordClient = client({
    clientId: envs.CLIENT_ID,
    guildId: envs.GUILD_ID,
    token: envs.DISCORD_TOKEN,
  });

  discordClient.registerSlashCommand(userCommand);

  discordClient.listenInteractions();
  discordClient.deployCommands();
}

bootstrap();
