import type { Adapter } from "@auth/core/adapters";

/** OAuth providers send `image`; we persist accounts without storing avatar URLs on `User`. */
export function adapterWithoutUserImage(adapter: Adapter): Adapter {
  return {
    ...adapter,
    createUser: (data) => {
      const rest = { ...data };
      if ("image" in rest) {
        delete rest.image;
      }
      const createUser = adapter.createUser;
      if (!createUser) {
        throw new Error("Adapter does not implement createUser");
      }
      return createUser(rest);
    },
    updateUser: (data) => {
      const rest = { ...data };
      if ("image" in rest) {
        delete rest.image;
      }
      const updateUser = adapter.updateUser;
      if (!updateUser) {
        throw new Error("Adapter does not implement updateUser");
      }
      return updateUser(rest);
    },
  };
}
