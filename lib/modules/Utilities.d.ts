import { Client, MessageEmbed, Snowflake, User } from "discord.js";
import { SlashCommandBuilder, SlashCommandSubcommandBuilder } from "@discordjs/builders";
export declare function UserToGuildMember(Client: Client, UserId: Snowflake, GuildId: Snowflake): Promise<import("discord.js").GuildMember>;
export declare type EmbedCondition = "Success" | "Error" | "Neutral";
export declare function CreateBaseEmbed(Condition: EmbedCondition, User?: User): MessageEmbed;
export declare function ConvertSubToSlash(Command: SlashCommandSubcommandBuilder): SlashCommandBuilder;
//# sourceMappingURL=Utilities.d.ts.map