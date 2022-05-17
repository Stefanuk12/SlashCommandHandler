//
import { GuildMember, User } from "discord.js";
import { PermissionHandler } from "./PermissionHandler.js";
import { RolePermissionHandler } from "./RolePermissionHandler.js";

//
export interface IPermissions {
    role: RolePermissionHandler
    permission: PermissionHandler
}
export interface Permissions extends IPermissions {}
export class Permissions {
    // Constructor
    constructor(Data: IPermissions){
        Object.assign(this, Data)
    }

    // Check
    async check(Member: User | GuildMember){
        const HasRoles = await this.role.check(Member)
        const HasPermissions = await this.permission.check(Member)
        return HasRoles && HasPermissions
    }
}