// Dependencies
import { SlashCommandBuilder, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder } from "discord.js";
import { lstatSync, readdirSync } from "fs";
import { Command } from "./Command.js";
import { PermissionHandler } from "./PermissionHandler.js";
import { Permissions } from "./Permissions.js";
import { RolePermissionHandler } from "./RolePermissionHandler.js";
import * as path from "path"
import { ConvertSubToSlash } from "./Utilities.js";

// Vars
export const Commands: Command[] = []

/**
 * Finds a subcategory group within the `Commands`
 * @param Path The "command" path. Example: subdirectory/command. You cannot have a depth larger than 2.
 * @param CurrentCategory The command to start at
 */
export function FindSubcategory(Path: string[], CurrentCategory?: Command){
    // Vars
    CurrentCategory = CurrentCategory || Commands.find(command => command.Type == "Group" && command.SlashCommand.name == Path.shift())
    
    // Make sure we have a category in the first place
    if (!CurrentCategory){
        return
    }

    //
    const PathShift = Path.shift()
    if (!PathShift) return CurrentCategory
    
    //
    return CurrentCategory.Children.find(command => command.Type == "Group" && command.SlashCommand.name == PathShift)
}

/**
 * Finds a subcategory group within the `Commands`. However, if the group does not exist, it will be made
 * @param Path The "command" path. Example: subdirectory/command. You cannot have a depth larger than 2.
 * @param CurrentCategory The command to start at
 */
export function FindSubcategoryCreate(Path: string[], CurrentCategory?: Command){
    // Vars
    const RootPath = Path.shift()
    CurrentCategory = CurrentCategory || Commands.find(command => command.Type == "Group" && command.SlashCommand.name == RootPath)
    
    //
    if (!RootPath){
        throw(new Error("Invalid path"))
    }

    // Make sure we have a category in the first place
    if (!CurrentCategory){
        CurrentCategory = new Command({
            SlashCommand: new SlashCommandBuilder()
                .setName(RootPath)
                .setDescription(`All of the ${RootPath} commands`),
            Type: "Group",
            Children: []
        })
        Commands.push(CurrentCategory)
        return CurrentCategory
    }

    //
    const PathShift = Path.shift()
    if (!PathShift || !CurrentCategory) return CurrentCategory
    
    //
    let Found = CurrentCategory.Children.find(command => command.Type == "Group" && command.SlashCommand.name == PathShift)
    if (!Found){
        Found = new Command({
            SlashCommand: new SlashCommandBuilder()
                .setName(PathShift)
                .setDescription(`All of the ${PathShift} commands`),
            Type: "Group",
            Children: [],
            Parent: CurrentCategory
        })
        CurrentCategory.Children.push(Found)
    }

    //
    return Found
}

//
export interface IImportFormat {
    SlashCommand: SlashCommandSubcommandBuilder
    Permissions?: Permissions | PermissionHandler | RolePermissionHandler
    Callback?: Function
    Ignored?: boolean
}

/**
 * Adds a command to the commands
 * @param Path The "command" path. Example: subdirectory/command. You cannot have a depth larger than 2.
 * @param UseSubcommands Whether to use subcommand groups or not. If the group does not exist, it will be made.
 * @param ImportData This includes the main command data
 * @returns Success
 */
export function AddCommand(Path: string, UseSubcommands: boolean, ImportData: IImportFormat){
    // Ensure is not ignored
    if (ImportData.Ignored){
        return false
    }

    //
    let command = new Command({
        SlashCommand: ImportData.SlashCommand,
        Type: "Command",
        Permissions: ImportData.Permissions,
        Callback: ImportData.Callback,
        Children: []
    })

    //
    if (!UseSubcommands) {
        command.Type = "SlashCommand"
        Commands.push(command)
        return true
    }

    // Vars
    const SubcommandGroups = Path.split("/")

    //
    if (SubcommandGroups.length > 2){
        let error = new Error("Command depth too large (> 2)")
        throw(error)
    }

    //
    if (SubcommandGroups.length == 1) {
        command.Type = "SlashCommand"
        Commands.push(command)
        return true
    }
    SubcommandGroups.pop() // Disregard the actual file

    //
    let CurrentSubcommandGroup = FindSubcategoryCreate(SubcommandGroups)
    if (!CurrentSubcommandGroup){
        return false
    }

    //
    const SlashCommand = <SlashCommandBuilder | SlashCommandSubcommandGroupBuilder>CurrentSubcommandGroup.SlashCommand
    SlashCommand.addSubcommand(ImportData.SlashCommand) // does not work atm
    const commandcommand = new Command({
        SlashCommand: SlashCommand,
        Type: "Command",
        Permissions: ImportData.Permissions,
        Callback: ImportData.Callback,
        Children: [],
        Parent: CurrentSubcommandGroup
    })
    Commands.push(commandcommand)

    //
    return true
}

/**
 * Adds all commands in a directory to the commands
 * @param Directory The full directory to your commands folder
 * @param DirectoryStem The full directory to your commands folder (with a / at the end)
 * @param UseSubcommands Whether to use subcommand groups or not. If the group does not exist, it will be made.
 * @returns Success
 */
export async function InitialiseCommands(Directory: string = "./src/commands", DirectoryStem: string = "./src/commands/", UseSubcommands: boolean = true): Promise<boolean> {
    // Loop through the directory
    for (const Dir of readdirSync(Directory)) {
        // Check if is a directory
        const FullDir = `${Directory}/${Dir}`
        if (lstatSync(FullDir).isDirectory()) {
            await InitialiseCommands(`${Directory}/${Dir}`, DirectoryStem, UseSubcommands)
            continue
        }
        
        // Check file type
        if (path.extname(Dir) != ".js"){
            continue
        }

        // Import the file
        const ImportData: IImportFormat = await import(`file://${FullDir}`)

        // Vars
        const TrimmedDirectory = FullDir.substring(DirectoryStem.length + 1)

        // Add the command
        AddCommand(TrimmedDirectory, UseSubcommands, ImportData)
    }

    //
    return true
}

/**
 * Get a `Command` object based upon the command name and group name
 * @param CommandName The name of the command
 * @param SubcommandGroupName The name of the subcommand group name
 * @returns Command
 */
export function GetCommand(CommandName: string, SubcommandGroupName?: string | null) {
    if (SubcommandGroupName)
        return Commands.find((command) => command.SlashCommand.name == CommandName && (command.Type == "Command" || command.Type == "SlashCommand") && command.Parent?.SlashCommand.name === SubcommandGroupName)
    else
        return Commands.find((command) => command.SlashCommand.name == CommandName && (command.Type == "Command" || command.Type == "SlashCommand"))
}

/**
 * Get the main `SlashCommand` for each command.
 * @returns An array of `SlashCommandBuilder` objects
 */
export function GetSlashCommands(){
    // Vars
    let SlashCommands: SlashCommandBuilder[] = []

    // Push every SlashCommand to array
    for (const command of Commands){
        if (command.SlashCommand instanceof SlashCommandBuilder || command.Type == "SlashCommand")
            SlashCommands.push(<SlashCommandBuilder>command.SlashCommand)
    }

    // Return
    return SlashCommands
}