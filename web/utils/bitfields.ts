export class BitfieldManager {
    constructor(public flags: number) {}

    add(flag: number) {
        if (this.has(flag)) return this;
        this.flags |= flag;

        return this;
    }

    remove(flag: number) {
        if (!this.has(flag)) return this;
        this.flags &= ~flag;

        return this;
    }

    has(flag: number) {
        return (this.flags & flag) === flag;
    }
}