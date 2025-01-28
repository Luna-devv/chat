import { Config } from "~/constants/config";

export function getUserAvatarUrl(id: number) {
    return `${Config.cdn_url}/avatars/${id}.webp`;
}