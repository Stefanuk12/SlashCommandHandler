import { SlashCommandBuilder, SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { Command } from "./Command.js";
import { PermissionHandler } from "./PermissionHandler.js";
import { Permissions } from "./Permissions.js";
import { RolePermissionHandler } from "./RolePermissionHandler.js";
export declare const Commands: Command[];
/**
 * Finds a subcategory group within the `Commands`
 * @param Path The "command" path. Example: subdirectory/command. You cannot have a depth larger than 2.
 * @param CurrentCategory The command to start at
 */
export declare function FindSubcategory(Path: string[], CurrentCategory?: Command): Command | undefined;
/**
 * Finds a subcategory group within the `Commands`. However, if the group does not exist, it will be made
 * @param Path The "command" path. Example: subdirectory/command. You cannot have a depth larger than 2.
 * @param CurrentCategory The command to start at
 */
export declare function FindSubcategoryCreate(Path: string[], CurrentCategory?: Command): Command;
export interface IImportFormat {
    SlashCommand: SlashCommandSubcommandBuilder;
    Permissions?: Permissions | PermissionHandler | RolePermissionHandler;
    Callback?: Function;
    Ignored?: boolean;
}
/**
 * Adds a command to the commands
 * @param Path The "command" path. Example: subdirectory/command. You cannot have a depth larger than 2.
 * @param UseSubcommands Whether to use subcommand groups or not. If the group does not exist, it will be made.
 * @param ImportData This includes the main command data
 * @returns Success
 */
export declare function AddCommand(Path: string, UseSubcommands: boolean, ImportData: IImportFormat): boolean;
/**
 * Adds all commands in a directory to the commands
 * @param Directory The full directory to your commands folder
 * @param DirectoryStem The full directory to your commands folder (with a / at the end)
 * @param UseSubcommands Whether to use subcommand groups or not. If the group does not exist, it will be made.
 * @returns Success
 */
export declare function InitialiseCommands(Directory?: string, DirectoryStem?: string, UseSubcommands?: boolean): Promise<boolean>;
/**
 * Get a `Command` object based upon the command name and group name
 * @param CommandName The name of the command
 * @param SubcommandGroupName The name of the subcommand group name
 * @returns Command
 */
export declare function GetCommand(CommandName: string, SubcommandGroupName?: string): Command | undefined;
/**
 * Get the main `SlashCommand` for each command.
 * @returns An array of `SlashCommandBuilder` objects
 */
export declare function GetSlashCommands(): SlashCommandBuilder[];
//# sourceMappingURL=Commands.d.ts.map