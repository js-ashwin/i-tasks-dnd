import { createAvatar } from "@dicebear/core";
import { funEmoji } from "@dicebear/collection";

export const getAvatar = (name: string) => {
  return createAvatar(funEmoji, {
    seed: name,
    radius: 50,
  }).toDataUri();
};
