import { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { Button, Input, Select, RTE } from "../index";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import appwriteService from "../../appwrite/config";

function PostForm({ post }) {
  const { register, handleSubmit, watch, setValue, control, getValues, reset } =
    useForm();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth?.userData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (post) {
      reset({
        title: post.title,
        slug: post.slug || post.$id,
        content: post.content,
        status: post.status || "active",
        image: undefined,
      });
    }
    setLoading(false);
  }, [post, reset]);

  const submit = async (data) => {
    setLoading(true);
    try {
      let fileId;
      if (data.image && data.image[0]) {
        const file = await appwriteService.uploadFile(data.image[0]);
        if (file) {
          fileId = file.$id;
          if (fileId && post?.featuredImage) {
            appwriteService.deleteFile(post.featuredImage);
          }
        }
      }
      const postData = {
        ...data,
        featuredImage: fileId || post?.featuredImage,
        userId: userData.$id,
      };

      if (post) {
        await appwriteService.updatePost(post.$id, postData);
        navigate(`/post/${post.$id}`);
      } else {
        const dbPost = await appwriteService.createPost(postData);
        navigate(`/post/${dbPost.$id}`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const slugTransform = useCallback((value) => {
    if (value && typeof value === "string") {
      return value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
    }
    return "";
  }, []);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title), { shouldValidate: true });
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [watch, slugTransform, setValue]);

  return loading ? (
    <div className="w-full p-10 flex justify-center items-center">
      <h1 className="text-3xl text-white">Please wait..</h1>
    </div>
  ) : (
    <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
      <div className="w-2/3 px-2">
        <Input
          label="Title*"
          placeholder="Title"
          className="mb-4"
          {...register("title", { required: true })}
        />
        <Input
          label="Slug*"
          placeholder="Slug"
          className="mb-4"
          {...register("slug", { required: true })}
          onInput={(e) => {
            setValue("slug", slugTransform(e.currentTarget.value), {
              shouldValidate: true,
            });
          }}
        />
        <RTE
          label="Content*"
          name="content"
          control={control}
          defaultValue={getValues("content")}
        />
      </div>
      <div className="w-1/3 px-2">
        <Input
          label={post ? "Featured Image" : "Featured Image*"}
          type="file"
          className="mb-4"
          accept="image/png, image/jpg, image/jpeg, image/gif"
          {...(post
            ? register("image")
            : register("image", { required: true }))}
        />
        {post && (
          <div className="w-full mb-4">
            <img
              src={appwriteService.getFilePreview(post.featuredImage)}
              alt={post.title}
              className="rounded-lg"
            />
          </div>
        )}
        <Select
          options={["active", "inactive"]}
          label="Status*"
          className="mb-4"
          {...register("status", { required: true })}
        />
        <Button
          type="submit"
          bgColor={post ? "bg-green-500" : undefined}
          className="w-full"
        >
          {post ? "Update" : "Submit"}
        </Button>
      </div>
    </form>
  );
}

PostForm.propTypes = {
  post: PropTypes.shape({
    title: PropTypes.string,
    slug: PropTypes.string,
    content: PropTypes.string,
    status: PropTypes.string,
    featuredImage: PropTypes.string,
    $id: PropTypes.string,
  }),
};

export default PostForm;
