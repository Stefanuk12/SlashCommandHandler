import { UserToGuildMember } from "./Utilities.js";
export class RolePermissionHandler {
    // Constructor
    constructor(Data) {
        this.ready = false;
        // Assign the data
        Object.assign(this, Data);
        // Set
        this.roles = Data.roles || [];
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
            // Make sure guild exiss
            if (!this.guild)
                throw (new Error("guild not supplied"));
            this.guildSnowflake = this.guild.id;
        }
        // Resolve each role
        for (const role of this.roleSnowflakes) {
            const Role = await this.guild.roles.fetch(role);
            if (Role) {
                this.roles.push(Role);
            }
            else
                throw (new Error(`Unable to get Role: ${Role} from Guild: ${this.guildSnowflake}`));
        }
        // Sort roles by position
        this.roles.sort((a, b) => {
            if (a.rawPosition > b.rawPosition) {
                return 1;
            }
            if (a.rawPosition < b.rawPosition) {
                return -1;
            }
            return 0;
        }).reverse();
        // Set role snowflakes to corrospond with roles
        this.roleSnowflakes = [];
        for (const role of this.roles) {
            this.roleSnowflakes.push(role.id);
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
        if (Member.constructor.name == "User") {
            Member = await UserToGuildMember(this.client, Member.id, this.guildSnowflake);
        }
        Member = Member;
        // Check the highest role
        if (this.positionCheck) {
            return Member.roles.highest.position >= this.roles[0].position;
        }
        // Make sure has each role
        for (const role of this.roles) {
            // Find the role in cache
            if (!Member.roles.cache.find((_role => _role.id == role.id))) {
                return false;
            }
        }
        //
        return true;
    }
}
//# sourceMappingURL=RolePermissionHandler.js.map