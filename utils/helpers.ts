export const setEmptyToNull = <T extends object>(obj: T): T => {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      key,
      value === "" || value === undefined ? null : value,
    ])
  ) as T;
};
