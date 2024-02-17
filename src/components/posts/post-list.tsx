import Post from "@/components/posts/post";

const posts = [
  {
    id: 1,
    title: "New Journey",
    slug: "new-journey",
    description: "This is a new journey",
    imageUrl: "https://wanderon.in/_next/image?url=https%3A%2F%2Fstatic.wanderon.in%2Fwp-content%2Fuploads%2F2023%2F10%2Ftop-min-2.jpg&w=3840&q=75"
  },
  {
    id: 2,
    title: "New Journey",
    slug: "new-journey-2",
    description: "This is a new journey",
    imageUrl: "https://wanderon.in/_next/image?url=https%3A%2F%2Fstatic.wanderon.in%2Fwp-content%2Fuploads%2F2023%2F10%2Ftop-min-2.jpg&w=3840&q=75"
  },
  {
    id: 3,
    title: "New Journey",
    slug: "new-journey-3",
    description: "This is a new journey",
    imageUrl: "https://wanderon.in/_next/image?url=https%3A%2F%2Fstatic.wanderon.in%2Fwp-content%2Fuploads%2F2023%2F10%2Ftop-min-2.jpg&w=3840&q=75"
  },
  {
    id: 4,
    title: "New Journey",
    slug: "new-journey-4",
    description: "This is a new journey",
    imageUrl: "https://wanderon.in/_next/image?url=https%3A%2F%2Fstatic.wanderon.in%2Fwp-content%2Fuploads%2F2023%2F10%2Ftop-min-2.jpg&w=3840&q=75"
  },
  {
    id: 5,
    title: "New Journey",
    slug: "new-journey-5",
    description: "This is a new journey",
    imageUrl: "https://wanderon.in/_next/image?url=https%3A%2F%2Fstatic.wanderon.in%2Fwp-content%2Fuploads%2F2023%2F10%2Ftop-min-2.jpg&w=3840&q=75"
  }
];

export default function PostList() {
    return (
        <div className="grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10">
            {posts.map((post) => (
                <Post slug={post.slug} key={post.id} title={post.title} description={post.description} imageUrl={post.imageUrl}></Post>
            ))}
        </div>
    );
}