import { Client, Guild, GuildMember, PermissionString, Snowflake, User } from "discord.js";
export interface IPermissionHandler {
    client: Client;
    guildSnowflake: Snowflake;
    permissions: PermissionString[];
    guild: Guild;
    positionCheck: boolean;
}
export interface PermissionHandler extends IPermissionHandler {
}
export declare class PermissionHandler {
    ready: boolean;
    constructor(Data: IPermissionHandler);
    Initialise(): Promise<void>;
    check(Member: GuildMember | User): Promise<boolean>;
}
//# sourceMappingURL=PermissionHandler.d.ts.map