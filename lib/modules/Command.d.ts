import { SlashCommandBuilder, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder } from "@discordjs/builders";
import { PermissionHandler } from "./PermissionHandler.js";
import { Permissions } from "./Permissions.js";
import { RolePermissionHandler } from "./RolePermissionHandler.js";
export interface ICommand {
    SlashCommand: SlashCommandBuilder | SlashCommandSubcommandGroupBuilder | SlashCommandSubcommandBuilder;
    Type: "Command" | "Group" | "SlashCommand";
    Permissions?: Permissions | PermissionHandler | RolePermissionHandler;
    Callback?: Function;
    Parent?: Command;
    Children: Command[];
}
export interface Command extends ICommand {
}
export declare class Command {
    constructor(Data: ICommand);
}
//# sourceMappingURL=Command.d.ts.map