// Dependencies
import { SlashCommandBuilder, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder } from "discord.js";
import { PermissionHandler } from "./PermissionHandler.js";
import { Permissions } from "./Permissions.js";
import { RolePermissionHandler } from "./RolePermissionHandler.js";

//
export interface ICommand {
    SlashCommand: SlashCommandBuilder | SlashCommandSubcommandGroupBuilder | SlashCommandSubcommandBuilder
    Permissions?: Permissions | PermissionHandler | RolePermissionHandler
    Callback?: Function

    Parent?: SlashCommandBuilder | SlashCommandSubcommandGroupBuilder
}
export interface Command extends ICommand {}
export class Command {
    // Constructor
    constructor(Data: ICommand){
        // Set the initial data
        Object.assign(this, Data)
    }
}