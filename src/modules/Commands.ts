// Dependencies
import { ContextMenuCommandBuilder, SlashCommandBuilder, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder } from "discord.js";
import { lstatSync, readdirSync } from "fs";
import { Command } from "./Command.js";
import { PermissionHandler } from "./PermissionHandler.js";
import { Permissions } from "./Permissions.js";
import { RolePermissionHandler } from "./RolePermissionHandler.js";
import * as path from "path"

// Vars
export const Commands: Command[] = []

/**
 * Finds a subcategory group within the `Commands`
 * @param Path The "command" path. Example: command/subgroup. You cannot have a depth larger than 2.
 * @param Create Whether to create missing commands/subgroups
 */
export function FindSubcategory(Path: string[], Create: boolean = false){
    // Vars
    const TopmostParentName = Path[0]
    let TopmostParent = Commands.find(command => command.SlashCommand instanceof SlashCommandBuilder && command.SlashCommand.name == TopmostParentName)
    const ParentName = Path[1]
    let Parent
    
    // Creating topmost parent if it does not exist
    let MadeTop = false
    if (!TopmostParent) { 
        // Return if not creating
        if (!Create)
            return

        // Make the slash command
        const TopmostParentSlash = new SlashCommandBuilder()
            .setName(TopmostParentName)
            .setDescription(`All of the ${TopmostParentName} commands`);

        // Make the command
        TopmostParent = new Command({
            SlashCommand: TopmostParentSlash
        })

        // Add it
        Commands.push(TopmostParent)
        MadeTop = true
    }
    
    //
    if (Path.length == 2) {
        // Get the parent
        Parent = Commands.find(command => command.SlashCommand instanceof SlashCommandSubcommandGroupBuilder && command.Parent?.name == TopmostParentName && command.SlashCommand.name == ParentName)

        // Make sure it exists
        if (!Parent) {
            // Return if not creating
            if (!Create)
                return

            // Create the subcommand
            const ParentName = Path[1]
            Parent = new Command({
                SlashCommand: new SlashCommandSubcommandGroupBuilder()
                    .setName(ParentName)
                    .setDescription(`All of the ${ParentName} commands`),
                Parent: <SlashCommandBuilder>TopmostParent.SlashCommand
            })

            // Add it
            Commands.push(Parent)
        }

        // Add if made top
        if (MadeTop)
            (<SlashCommandBuilder>TopmostParent.SlashCommand).addSubcommandGroup(<SlashCommandSubcommandGroupBuilder>Parent.SlashCommand)

        // Return
        return [TopmostParent, Parent]
    } else {
        return [TopmostParent]
    }
}

//
export interface IImportFormat {
    SlashCommand: SlashCommandSubcommandBuilder | SlashCommandBuilder | ContextMenuCommandBuilder
    Permissions?: Permissions | PermissionHandler | RolePermissionHandler
    Callback?: Function
    Ignored?: boolean
    NoDefer?: boolean
}

/**
 * Adds a command to the commands
 * @param Path The "command" path. Example: command/subgroup/subcommand. You cannot have a depth larger than 3.
 * @param UseSubcommands Whether to use subcommand groups or not. If the group does not exist, it will be made.
 * @param ImportData This includes the main command data
 * @returns Success
 */
export function AddCommand(Path: string, UseSubcommands: boolean, ImportData: IImportFormat){
    // Context Command
    if (ImportData.SlashCommand instanceof ContextMenuCommandBuilder) {
        // Create the command
        const command = new Command({
            SlashCommand: ImportData.SlashCommand,
            Permissions: ImportData.Permissions,
            Callback: ImportData.Callback,
            NoDefer: ImportData.NoDefer
        })

        // Add it
        return Commands.push(command)
    }

    // Not using sub commands
    if (!UseSubcommands) {
        // Create the command
        const command = new Command({
            SlashCommand: <SlashCommandBuilder>ImportData.SlashCommand,
            Permissions: ImportData.Permissions,
            Callback: ImportData.Callback
        })

        // Add it
        return Commands.push(command)
    }

    // Vars
    const Hierarchy = Path.split("/")
    let [TopmostParent, Parent]: Command[] = []

    // See if there are parents, make them if they don't exist
    if (Hierarchy.length >= 2) {
        // Attempt to get the subcommand parent
        const ParentHierarchy = Hierarchy.slice()
        ParentHierarchy.pop()
        const Subcategories = FindSubcategory(ParentHierarchy, true)

        // Return if undefined
        if (!Subcategories)
            return

        // Set
        TopmostParent = Subcategories[0]
        Parent = Subcategories[1]
    }

    let DesignatedParent: SlashCommandSubcommandGroupBuilder | SlashCommandBuilder | undefined
    if (Hierarchy.length == 2) {
        // Ensure topmost parent exists
        if (!TopmostParent)
            return

        // Set
        DesignatedParent = <SlashCommandBuilder>TopmostParent.SlashCommand
    } else if (Hierarchy.length == 3) {
        // Ensure parent exists
        if (!Parent)
            return

        // Set
        DesignatedParent = <SlashCommandSubcommandGroupBuilder>Parent.SlashCommand
    }

    // Get the slash command
    let SlashCommand = ImportData.SlashCommand

    // Add
    if (DesignatedParent)
        DesignatedParent.addSubcommand(<SlashCommandSubcommandBuilder>SlashCommand) // errors for me for some reason - except when using the test ver...

    // Create the command
    const command = new Command({
        SlashCommand: SlashCommand,
        Permissions: ImportData.Permissions,
        Callback: ImportData.Callback,
        Parent: UseSubcommands ? DesignatedParent : undefined,
        NoDefer: ImportData.NoDefer
    })

    // Add it
    Commands.push(command)
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
 * Get a `Command` object based upon the "comamand path"
 * @param Path The path to the command. For example: ["command", "subgroup", "subcommand"]
 * @returns Command
 */
export function GetCommand(Path: (string | null)[]) {
    // Filter null stuff out
    const GoodPath = Path.filter(item => item)

    if (GoodPath.length == 1)
        return Commands.find(command => (command.SlashCommand instanceof SlashCommandBuilder || command.SlashCommand instanceof ContextMenuCommandBuilder) && command.SlashCommand.name === GoodPath[0])
    
    const CommandName = GoodPath.pop()
    const Parent = GoodPath[GoodPath.length - 1]
    return Commands.find(command => (command.SlashCommand instanceof SlashCommandSubcommandBuilder) && command.SlashCommand.name == CommandName && command.Parent?.name == Parent)
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
        if (command.SlashCommand instanceof SlashCommandBuilder)
            SlashCommands.push(command.SlashCommand)
    }

    // Return
    return SlashCommands
}

/**
 * Get the main `ContextCommand` for each command.
 * @returns An array of `ContextMenuCommandBuilder` objects
 */
 export function GetContextCommands(){
    // Vars
    let ContextCommands: ContextMenuCommandBuilder[] = []

    // Push every SlashCommand to array
    for (const command of Commands){
        if (command.SlashCommand instanceof ContextMenuCommandBuilder)
            ContextCommands.push(command.SlashCommand)
    }

    // Return
    return ContextCommands
}