import {
    Client,
    type Collection
} from 'discord.js';
import { Command } from './command.type';

export interface ExtendedClient extends Client {
    commands: Collection<string, Command>;
}