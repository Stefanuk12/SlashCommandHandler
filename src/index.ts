// Dependencies
import { ChatInputCommandInteraction, ContextMenuCommandInteraction, Interaction } from "discord.js";
import { Command, ICommand } from "./modules/Command.js";
import { AddCommand, Commands, GetCommand, GetContextCommand, GetContextCommands, GetSlashCommands, IImportFormat, InitialiseCommands } from "./modules/Commands.js";
import { IPermissionHandler, PermissionHandler } from "./modules/PermissionHandler.js";
import { CreateBaseEmbed, UserToGuildMember } from "./modules/Utilities.js";
import { IPermissions, Permissions } from "./modules/Permissions.js";
import { IRolePermissionHandler, RolePermissionHandler } from "./modules/RolePermissionHandler.js";

// Listener that handles all the important stuff
async function _CommandInteractionListener(interaction: ChatInputCommandInteraction){
    // Attempt to get the command
    let SubcommandGroup = interaction.options.getSubcommandGroup()
    let SubcommandCommand = interaction.options.getSubcommand()
    const Command = GetCommand([interaction.commandName, SubcommandGroup, SubcommandCommand])

    if (!Command){
        throw(new Error("Invalid command"))
    }

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
async function CommandInteractionListener(interaction: Interaction){
    // Make sure it is a command
    if (!interaction.isChatInputCommand()) return

    // Defer the reply so we have time
    if (!interaction.deferred)
        await interaction.deferReply({
            ephemeral: true
        })

    // Attempt to handle
    try {
        await _CommandInteractionListener(interaction)
        return true
    } catch (error: any) {
        // Create Embed
        const Embed = CreateBaseEmbed("Error", interaction.user)
            .setDescription(error.message);

        // Send
        await interaction.editReply({ embeds: [Embed] })

        // Return
        return false
    }
}
export default CommandInteractionListener

//
async function _ContextInteractionListener(interaction: ContextMenuCommandInteraction) {
    // Attempt to get the command
    const Command = GetContextCommand([interaction.commandName])

    if (!Command){
        throw(new Error("Invalid command"))
    }

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

// Listener for context commands
export async function ContextInteractionListener(interaction: ContextMenuCommandInteraction) {
    // Attempt to handle
    try {
        await _ContextInteractionListener(interaction)
        return true
    } catch (error: any) {
        // Create Embed
        const Embed = CreateBaseEmbed("Error", interaction.user)
            .setDescription(error.message);

        // Send
        await interaction.editReply({ embeds: [Embed] })

        // Return
        return false
    }
}

// Exports
export { Command, ICommand }
export { Commands, InitialiseCommands, GetCommand, GetContextCommands, IImportFormat, GetSlashCommands, AddCommand, GetContextCommand }
export { PermissionHandler, IPermissionHandler }
export { Permissions, IPermissions }
export { RolePermissionHandler, IRolePermissionHandler }
export { UserToGuildMember, CreateBaseEmbed }