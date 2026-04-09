import { createAvatar } from "@dicebear/core";
import { avataaars } from "@dicebear/collection";

export const getAvatar = (name: string) => {
  return createAvatar(avataaars, {
    seed: name,
    radius: 50,
  }).toDataUri();
};
