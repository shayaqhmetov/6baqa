import { atom, useAtom } from 'jotai';
import { getPosts, getPostDetails } from '@/api/post';
import { iPost } from '@/types/common';

// Define an atom for storing the posts state
export const postsAtom = atom<iPost[]>([]);
export const postDetailsAtom = atom<iPost | null>(null);

// Custom hook to access and modify the posts state
export const usePosts = () => {
  const [posts, setPosts] = useAtom(postsAtom);

  const fetchAndSetPosts = async () => {
    try {
      const posts = await getPosts();
      setPosts(posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  return {
    posts,
    fetchAndSetPosts,
  };
};

export const usePostDetails = () => {
  const [post, setPost] = useAtom(postDetailsAtom);

  const fetchAndSetPostDetails = async (id: string) => {
    try {
      const postDetails = await getPostDetails(id);
      setPost(postDetails);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  return {
    post,
    fetchAndSetPostDetails,
  };
};