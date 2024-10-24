import { useEffect, useState } from "react";
import { Container, PostForm } from "../components";
import appwriteService from "../appwrite/config";
import { useNavigate, useParams } from "react-router-dom";

function EditPost() {
  const [post, setPost] = useState(null);
  const { slug } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchPost = async () => {
      if (slug) {
        try {
          const fetchedPost = await appwriteService.getPost(slug);
          if (fetchedPost) {
            setPost(fetchedPost);
          } else {
            console.log(slug);
            console.log("Post not found");
            navigate("/");
          }
        } catch (error) {
          console.error("Error fetching the post: ", error);
          navigate("/");
        } finally {
          setLoading(false);
        }
      } else {
        navigate("/");
        console.log("No slug provided");
      }
    };
    fetchPost();
  }, [slug, navigate]);

  const handlePostSave = (updatedPost) => {
    if (updatedPost.slug !== slug) {
      navigate(`/edit-post/${updatedPost.slug}`); // Navigate to the new slug if it has changed
    }
    setPost(updatedPost); // Update the post state with the new post data
  };

  return loading ? (
    <div className="w-full p-10 flex justify-center items-center">
      <h1 className="text-3xl text-white">Please wait..</h1>
    </div>
  ) : post ? (
    <div className="py-8">
      <Container>
        <PostForm post={post} onSave={handlePostSave} />
      </Container>
    </div>
  ) : null;
}

export default EditPost;
