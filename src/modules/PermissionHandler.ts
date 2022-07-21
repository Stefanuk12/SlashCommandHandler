// Dependencies
import { Client, Guild, GuildMember, PermissionsString, Snowflake, User } from "discord.js"
import { UserToGuildMember } from "./Utilities.js"

//
export interface IPermissionHandler {
    client: Client

    guildSnowflake: Snowflake

    permissions: PermissionsString[]
    guild: Guild

    positionCheck: boolean
}
export interface PermissionHandler extends IPermissionHandler {}
export class PermissionHandler {
    // Vars
    ready = false

    // Constructor
    constructor(Data: IPermissionHandler){
        // Assign the data
        Object.assign(this, Data)

        // Initialise
        this.Initialise()
    }

    // Initialise
    async Initialise(){
        // Resolve guild
        if (this.guildSnowflake){
            this.guild = await this.client.guilds.fetch(this.guildSnowflake)
        } else {
            this.guildSnowflake = this.guild.id
        }

        //
        this.ready = true
    }

    // Check
    async check(Member: GuildMember | User){
        // Make sure is ready
        if (!this.ready){
            throw(new Error("RolePermissionHandler is not ready"))
        }

        // Convert User to Member
        if (Member instanceof User){
            Member = await UserToGuildMember(this.client, Member.id, this.guildSnowflake)
        }

        // Check has each role
        for (const Permission of this.permissions){
            if (!Member.permissions.has(Permission)){
                return false
            }
        }

        //
        return true
    }
}