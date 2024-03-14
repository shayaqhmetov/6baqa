import { fetcher } from "@/lib/utils";

export const getPosts = async () => {
  return await fetcher("/posts");
};

export const getPostDetails = async (id: string) => {
  return await fetcher(`/posts/${id}`);
}
