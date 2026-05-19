import { createAvatar } from "@dicebear/core";
import { pixelArt } from "@dicebear/collection";

export const getAvatar = (name: string) => {
  return createAvatar(pixelArt, {
    seed: name,
    radius: 50,
  }).toDataUri();
};
