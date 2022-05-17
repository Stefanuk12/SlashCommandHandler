// Dependencies
import { MessageEmbed } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
// Convert a user to a guild member
export async function UserToGuildMember(Client, UserId, GuildId) {
    // Grab the guild
    const Guild = await Client.guilds.fetch(GuildId);
    // Grab the user
    const GuildMember = await Guild.members.fetch(UserId);
    //
    return GuildMember;
}
export function CreateBaseEmbed(Condition, User) {
    // Vars
    const convert = {
        "Success": 0x90ee90,
        "Error": 0xff9696,
        "Neutral": 0x808080
    };
    // Create Embed
    const Embed = new MessageEmbed()
        .setTitle(Condition)
        .setColor(convert[Condition]);
    // Custom Embed if user is provided
    if (User) {
        // lil circle of thing yes
        if (Embed.footer) {
            Embed.footer.iconURL = User.avatarURL() || User.defaultAvatarURL;
        }
    }
    // Return
    return Embed;
}
// Convert
export function ConvertSubToSlash(Command) {
    const SlashCommand = new SlashCommandBuilder()
        .setName(Command.name)
        .setDescription(Command.description);
    for (const option of Command.options) {
        if (option.type == 3)
            SlashCommand.addStringOption(option);
        if (option.type == 4)
            SlashCommand.addIntegerOption(option);
        if (option.type == 5)
            SlashCommand.addBooleanOption(option);
        if (option.type == 6)
            SlashCommand.addUserOption(option);
        if (option.type == 7)
            SlashCommand.addChannelOption(option);
        if (option.type == 8)
            SlashCommand.addRoleOption(option);
        if (option.type == 9)
            SlashCommand.addMentionableOption(option);
        if (option.type == 10)
            SlashCommand.addNumberOption(option);
    }
    return SlashCommand;
}
//# sourceMappingURL=Utilities.js.map