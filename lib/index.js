import { Command } from "./modules/Command.js";
import { AddCommand, Commands, GetCommand, GetSlashCommands, InitialiseCommands } from "./modules/Commands.js";
import { PermissionHandler } from "./modules/PermissionHandler.js";
import { CreateBaseEmbed, UserToGuildMember } from "./modules/Utilities.js";
import { Permissions } from "./modules/Permissions.js";
import { RolePermissionHandler } from "./modules/RolePermissionHandler.js";
// Listener that handles all the important stuff
async function _CommandInteractionListener(interaction) {
    // Attempt to get the command
    let SubcommandGroup;
    try {
        SubcommandGroup = interaction.options.getSubcommandGroup();
    }
    catch (e) { }
    const Command = GetCommand(interaction.commandName, SubcommandGroup);
    if (!Command) {
        throw (new Error("Invalid command"));
    }
    // Permission Check
    if (Command.Permissions) {
        const HasPermission = await Command.Permissions.check(interaction.user);
        if (!HasPermission) {
            throw (new Error("Missing permissions"));
        }
    }
    //
    if (Command.Callback)
        await Command.Callback(interaction);
}
// Listener that has failsafes
async function CommandInteractionListener(interaction) {
    // Make sure it is a command
    if (!interaction.isCommand())
        return;
    // Defer the reply so we have time
    if (!interaction.deferred)
        await interaction.deferReply({
            ephemeral: true
        });
    // Attempt to handle
    try {
        await _CommandInteractionListener(interaction);
        return true;
    }
    catch (error) {
        // Create Embed
        const Embed = CreateBaseEmbed("Error", interaction.user)
            .setDescription(error.message);
        // Send
        await interaction.editReply({ embeds: [Embed] });
        // Return
        return false;
    }
}
export default CommandInteractionListener;
// Exports
export { Command };
export { Commands, InitialiseCommands, GetCommand, GetSlashCommands, AddCommand };
export { PermissionHandler };
export { Permissions };
export { RolePermissionHandler };
export { UserToGuildMember, CreateBaseEmbed };
//# sourceMappingURL=index.js.map