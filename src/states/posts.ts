import { atom, useAtom } from 'jotai';
import { getPosts } from '@/api/post';

// Define an atom for storing the posts state
export const postsAtom = atom([]);

// Custom hook to access and modify the posts state
export const usePosts = () => {
    const [posts, setPosts] = useAtom(postsAtom);
  
    const fetchAndSetPosts = async () => {
      try {
        const posts = await getPosts();
        console.log('Posts:', posts);
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