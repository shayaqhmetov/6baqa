import Post from "@/components/posts/post";
import { iPost } from "@/types/common";

export default function PostList({ posts }: { posts: iPost[] }) {
  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10">
      {posts ? posts.map((post) => (
        <Post slug={post.attributes.slug} key={post.id} title={post.attributes.title} description={post.attributes.description} imageUrl={post.attributes.imageUrl}></Post>
      )) : null}
    </div>
  );
}