import client from './client';
import foxCommand from './commands/fox';
import userCommand from './commands/user';
import memberCountCommand from './commands/member-count';

import { envs } from './config/env';

function bootstrap() {
  const discordClient = client({
    clientId: envs.CLIENT_ID,
    guildId: envs.GUILD_ID,
    token: envs.DISCORD_TOKEN,
  });

  discordClient.registerSlashCommand(userCommand);
  discordClient.registerSlashCommand(foxCommand);
  discordClient.registerSlashCommand(memberCountCommand);

  discordClient.listenInteractions();
  discordClient.deployCommands();
}

bootstrap();
