// Dependencies
import { ChatInputCommandInteraction, CommandInteraction, ContextMenuCommandInteraction } from "discord.js";
import { Command, ICommand } from "./modules/Command.js";
import { AddCommand, Commands, GetCommand, GetContextCommand, GetContextCommands, GetSlashCommands, IImportFormat, InitialiseCommands } from "./modules/Commands.js";
import { IPermissionHandler, PermissionHandler } from "./modules/PermissionHandler.js";
import { CreateBaseEmbed, UserToGuildMember } from "./modules/Utilities.js";
import { IPermissions, Permissions } from "./modules/Permissions.js";
import { IRolePermissionHandler, RolePermissionHandler } from "./modules/RolePermissionHandler.js";

// Listener that handles all the important stuff
async function HandleInteraction(interaction: CommandInteraction, Command: Command) {
    // Permission Check
    if (Command.Permissions){
        const HasPermission = await Command.Permissions.check(interaction.user)
        if (!HasPermission){
            throw(new Error("Missing permissions"))
        }
    }

    //
    if (Command.Callback)
        await Command.Callback(interaction)
}

// Listener that has failsafes
async function CommandInteractionListener(interaction: ChatInputCommandInteraction | ContextMenuCommandInteraction, MessageOnError = true, IgnoredErrors = ["Invalid command", "No subcommand specified for interaction."]){
    try {
        // Make sure the command exists first
        let SubcommandGroup = null
        let SubcommandCommand = null
        if (interaction instanceof ChatInputCommandInteraction) {
            SubcommandGroup = interaction.options.getSubcommandGroup()
            SubcommandCommand = interaction.options.getSubcommand()
        }
        const Command = GetCommand([interaction.commandName, SubcommandGroup, SubcommandCommand])

        if (!Command){
            throw(new Error("Invalid command"))
        }

        // Defer the reply so we have time
        if (!interaction.deferred)
            await interaction.deferReply({
                ephemeral: true
            })

        await HandleInteraction(interaction, Command)
        return true
    } catch (error: any) {
        // Ignore the invalid command
        if (IgnoredErrors.includes(error.message) || !MessageOnError)
            return false

        // Create Embed
        const Embed = CreateBaseEmbed("Error", interaction.user)
            .setDescription(error.message);

        // Send
        if (interaction.replied)
            await interaction.editReply({ embeds: [Embed] })
        else
            await interaction.reply({ embeds: [Embed] })

        // Return
        return false
    }
}
export default CommandInteractionListener

// Listener for context commands (kept so stuff doesn't break)
export const ContextInteractionListener = CommandInteractionListener 

// Exports
export { Command, ICommand }
export { Commands, InitialiseCommands, GetCommand, GetContextCommands, IImportFormat, GetSlashCommands, AddCommand, GetContextCommand }
export { PermissionHandler, IPermissionHandler }
export { Permissions, IPermissions }
export { RolePermissionHandler, IRolePermissionHandler }
export { UserToGuildMember, CreateBaseEmbed }