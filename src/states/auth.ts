import { atom } from "jotai";

export const tokenAtom = atom<string | null>(null);

export const setToken = atom(null, (_get, set, token: string) => {
  set(tokenAtom, token);
});

