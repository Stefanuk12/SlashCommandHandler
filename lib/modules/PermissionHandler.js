// Dependencies
import { User } from "discord.js";
import { UserToGuildMember } from "./Utilities.js";
export class PermissionHandler {
    // Constructor
    constructor(Data) {
        // Vars
        this.ready = false;
        // Assign the data
        Object.assign(this, Data);
        // Initialise
        this.Initialise();
    }
    // Initialise
    async Initialise() {
        // Resolve guild
        if (this.guildSnowflake) {
            this.guild = await this.client.guilds.fetch(this.guildSnowflake);
        }
        else {
            this.guildSnowflake = this.guild.id;
        }
        //
        this.ready = true;
    }
    // Check
    async check(Member) {
        // Make sure is ready
        if (!this.ready) {
            throw (new Error("RolePermissionHandler is not ready"));
        }
        // Convert User to Member
        if (Member instanceof User) {
            Member = await UserToGuildMember(this.client, Member.id, this.guildSnowflake);
        }
        // Check has each role
        for (const Permission of this.permissions) {
            if (!Member.permissions.has(Permission)) {
                return false;
            }
        }
        //
        return true;
    }
}
//# sourceMappingURL=PermissionHandler.js.map