import type { PublicUser, User } from "~/types/users";
import { UserFlags } from "~/types/users";

import { BitfieldManager } from "../bitfields";

// not sure if there is a better way...
export function makePublicUser(user: User): PublicUser {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password_hash, flags, ...publicUser } = user;

    const bitfield = new BitfieldManager(flags);
    bitfield.remove(UserFlags.VerifiedEmail);
    bitfield.remove(UserFlags.Disabled);

    return {
        ...publicUser,
        flags: bitfield.flags
    };
}