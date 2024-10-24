import { useState, useEffect } from "react";
import appwriteService from "../appwrite/config";
import { Container, PostCard } from "../components/index";

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true); // Set loading to true before fetching
      try {
        const response = await appwriteService.getPosts();
        if (response?.documents) {
          setPosts(response.documents);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  return loading ? (
    <div className="w-full p-10 flex justify-center items-center">
      <h1 className="text-3xl text-white">Please wait...</h1>
    </div>
  ) : (
    <div className="w-full py-8">
      <Container>
        {posts.length > 0 ? ( // Check if there are posts to display
          <div className="flex flex-wrap">
            {posts.map((post) => (
              <div key={post.$id} className="p-2 w-1/4">
                <PostCard {...post} />
              </div>
            ))}
          </div>
        ) : (
          <h2 className="text-center text-xl font-semibold">
            No posts available
          </h2>
        )}
      </Container>
    </div>
  );
}

export default Home;
