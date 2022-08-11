// Dependencies
import { ApplicationCommandType, ContextMenuCommandBuilder, UserContextMenuCommandInteraction } from "discord.js";

// Command
export const SlashCommand = new ContextMenuCommandBuilder()
    .setName("ping")
    .setType(ApplicationCommandType.User);

//
export async function Callback(interaction: UserContextMenuCommandInteraction) {
    console.log("Ping!")
}