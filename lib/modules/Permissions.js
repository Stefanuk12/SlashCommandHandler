export class Permissions {
    // Constructor
    constructor(Data) {
        Object.assign(this, Data);
    }
    // Check
    async check(Member) {
        const HasRoles = await this.role.check(Member);
        const HasPermissions = await this.permission.check(Member);
        return HasRoles && HasPermissions;
    }
}
//# sourceMappingURL=Permissions.js.map