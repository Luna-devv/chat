export class BitfieldManager {
    constructor(public flags: number) {}

    add(flag: number) {
        if (this.has(flag)) return;
        this.flags |= flag;
    }

    remove(flag: number) {
        if (!this.has(flag)) return;
        this.flags &= ~flag;
    }

    has(flag: number) {
        return (this.flags & flag) === flag;
    }
}