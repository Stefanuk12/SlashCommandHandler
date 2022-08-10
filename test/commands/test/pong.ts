// Dependencies
import { SlashCommandSubcommandBuilder } from "discord.js";

// Slash Command
export const SlashCommand = new SlashCommandSubcommandBuilder()
    .setName("pong")
    .setDescription("Test command");

//
export async function Callback(interaction) {
    console.log("Ping!")
}