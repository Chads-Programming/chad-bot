import type { Client, Collection } from 'discord.js';
import type { Command } from './command.type';

export interface ExtendedClient extends Client {
  commands: Collection<string, Command>;
}
