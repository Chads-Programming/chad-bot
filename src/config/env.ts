import 'dotenv/config';
import { get } from 'env-var';

export const envs = {
	DISCORD_TOKEN: get('DISCORD_TOKEN').required().asString(),
	CLIENT_ID: get('CLIENT_ID').required().asString(),
	GUILD_ID: get('GUILD_ID').required().asString(),
	DEFAULT_ROLE_ID: get("DEFAULT_ROLE_ID").asString(),
} as const;