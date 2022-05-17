// Dependencies
import { Client, MessageEmbed, Snowflake, User } from "discord.js"
import { SlashCommandBuilder, SlashCommandSubcommandBuilder, SlashCommandBooleanOption, SlashCommandUserOption, SlashCommandChannelOption, SlashCommandRoleOption, SlashCommandMentionableOption, SlashCommandStringOption, SlashCommandIntegerOption, SlashCommandNumberOption } from "@discordjs/builders";

// Convert a user to a guild member
export async function UserToGuildMember(Client: Client, UserId: Snowflake, GuildId: Snowflake){
    // Grab the guild
    const Guild = await Client.guilds.fetch(GuildId)

    // Grab the user
    const GuildMember = await Guild.members.fetch(UserId)

    //
    return GuildMember
}

// Create a base embed
export type EmbedCondition = "Success" | "Error" | "Neutral"
export function CreateBaseEmbed(Condition: EmbedCondition, User?: User){
    // Vars
    const convert = {
        "Success": 0x90ee90,
        "Error": 0xff9696,
        "Neutral": 0x808080
    }

    // Create Embed
    const Embed = new MessageEmbed()
        .setTitle(Condition)
        .setColor(convert[Condition])

    // Custom Embed if user is provided
    if (User) {
        // lil circle of thing yes
        if (Embed.footer) {
            Embed.footer.iconURL = User.avatarURL() || User.defaultAvatarURL
        }
    }

    // Return
    return Embed
}

// Convert
export function ConvertSubToSlash(Command: SlashCommandSubcommandBuilder){
    const SlashCommand = new SlashCommandBuilder()
        .setName(Command.name)
        .setDescription(Command.description);

    for (const option of Command.options){
        if (option.type == 3)
            SlashCommand.addStringOption(<SlashCommandStringOption>option)
        if (option.type == 4)
            SlashCommand.addIntegerOption(<SlashCommandIntegerOption>option)
        if (option.type == 5)
            SlashCommand.addBooleanOption(<SlashCommandBooleanOption>option)
        if (option.type == 6)
            SlashCommand.addUserOption(<SlashCommandUserOption>option)
        if (option.type == 7)
            SlashCommand.addChannelOption(<SlashCommandChannelOption>option)
        if (option.type == 8)
            SlashCommand.addRoleOption(<SlashCommandRoleOption>option)
        if (option.type == 9)
            SlashCommand.addMentionableOption(<SlashCommandMentionableOption>option)
        if (option.type == 10)
            SlashCommand.addNumberOption(<SlashCommandNumberOption>option)
    }

    return SlashCommand
}