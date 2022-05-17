import { Client, Guild, GuildMember, Role, Snowflake, User } from "discord.js";
export interface IRolePermissionHandler {
    client: Client;
    roleSnowflakes: Snowflake[];
    guildSnowflake: Snowflake;
    roles?: Role[];
    guild?: Guild;
    positionCheck: boolean;
}
export interface RolePermissionHandler extends IRolePermissionHandler {
}
export declare class RolePermissionHandler {
    roles: Role[];
    guild?: Guild;
    ready: boolean;
    constructor(Data: IRolePermissionHandler);
    Initialise(): Promise<void>;
    check(Member: GuildMember | User): Promise<boolean>;
}
//# sourceMappingURL=RolePermissionHandler.d.ts.map