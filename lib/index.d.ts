import { Interaction } from "discord.js";
import { Command, ICommand } from "./modules/Command.js";
import { AddCommand, Commands, GetCommand, GetSlashCommands, IImportFormat, InitialiseCommands } from "./modules/Commands.js";
import { IPermissionHandler, PermissionHandler } from "./modules/PermissionHandler.js";
import { CreateBaseEmbed, UserToGuildMember } from "./modules/Utilities.js";
import { IPermissions, Permissions } from "./modules/Permissions.js";
import { IRolePermissionHandler, RolePermissionHandler } from "./modules/RolePermissionHandler.js";
declare function CommandInteractionListener(interaction: Interaction): Promise<boolean | undefined>;
export default CommandInteractionListener;
export { Command, ICommand };
export { Commands, InitialiseCommands, GetCommand, IImportFormat, GetSlashCommands, AddCommand };
export { PermissionHandler, IPermissionHandler };
export { Permissions, IPermissions };
export { RolePermissionHandler, IRolePermissionHandler };
export { UserToGuildMember, CreateBaseEmbed };
//# sourceMappingURL=index.d.ts.map