// Dependencies
import { Client, EmbedBuilder, Snowflake, User, SlashCommandBuilder, SlashCommandSubcommandBuilder, SlashCommandBooleanOption, SlashCommandUserOption, SlashCommandChannelOption, SlashCommandRoleOption, SlashCommandMentionableOption, SlashCommandStringOption, SlashCommandIntegerOption, SlashCommandNumberOption } from "discord.js"

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
    const Embed = new EmbedBuilder()
        .setTitle(Condition)
        .setColor(convert[Condition])

    // Custom Embed if user is provided
    if (User) {
        // lil circle of thing yes
        if (Embed.data.footer) {
            Embed.data.footer.icon_url = User.avatarURL() || User.defaultAvatarURL
        }
    }

    // Return
    return Embed
}