import { Container, PostCard } from "../components/index";
import PropTypes from "prop-types";
import appwriteService from "../appwrite/config";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

function AllPosts({ status }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      if (!userData || !userData.$id) {
        setError("User is not logged in.");
        setLoading(false);
        return;
      }

      const userId = userData.$id;
      try {
        let fetchedPosts;

        if (status === "active") {
          fetchedPosts = await appwriteService.getActivePosts(userId);
        } else if (status === "inactive") {
          fetchedPosts = await appwriteService.getInactivePosts(userId);
        }
        if (fetchedPosts) {
          setPosts(fetchedPosts.documents || fetchedPosts);
        }
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Failed to fetch posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [status, userData]);

  if (error) {
    return (
      <div className="w-full p-10 flex justify-center items-center">
        <h1 className="text-3xl text-red-500">{error}</h1>
      </div>
    );
  }

  return loading ? (
    <div className="w-full p-10 flex justify-center items-center">
      <h1 className="text-3xl text-white">Please wait...</h1>
    </div>
  ) : (
    <div className="w-full py-8 mt-4 text-center">
      <Container>
        {posts.length <= 0 ? (
          <div className="flex flex-wrap">
            <div className="p-2 w-full">
              <h1 className="text-2xl font-bold hover:text-gray-500">
                No posts available.
              </h1>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap -mx-2">
            {posts.map((post) => (
              <div
                key={post.$id}
                className="p-2 w-full sm:w-1/2 md:w-1/3 lg:w-1/4"
              >
                <PostCard {...post} />
              </div>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}

AllPosts.propTypes = {
  status: PropTypes.string.isRequired,
};

export default AllPosts;
