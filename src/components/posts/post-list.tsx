import Post from "@/components/posts/post";
import { iPost } from "@/types/common";

export default function PostList({ posts }: { posts: iPost[] }) {
  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10">
      {posts ? posts.map((post) => (
        <Post slug={post.slug} key={post._id} id={post._id} title={post.title} description={post.description} imageUrl="https://a.cdn-hotels.com/gdcs/production146/d585/aa60115c-bdfc-479f-88ba-5cb0f15a5af8.jpg?impolicy=fcrop&w=800&h=533&q=medium"></Post>
      )) : null}
    </div>
  );
}