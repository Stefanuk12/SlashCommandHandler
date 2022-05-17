import { GuildMember, User } from "discord.js";
import { PermissionHandler } from "./PermissionHandler.js";
import { RolePermissionHandler } from "./RolePermissionHandler.js";
export interface IPermissions {
    role: RolePermissionHandler;
    permission: PermissionHandler;
}
export interface Permissions extends IPermissions {
}
export declare class Permissions {
    constructor(Data: IPermissions);
    check(Member: User | GuildMember): Promise<boolean>;
}
//# sourceMappingURL=Permissions.d.ts.map