import { fetcher } from "@/lib/utils";

export const getPosts = async () => {
  const { data } = await fetcher("/posts");
  return data;
};
