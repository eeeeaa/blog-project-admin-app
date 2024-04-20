import { postToJsonObjMapper } from "../common/mapper";
import { useEffect, useState } from "react";
import { Post } from "../../model/postUiModel";

const postUri = `${import.meta.env.VITE_BLOG_API_URL}/posts`;

export const useGetPosts = (token = "", limit = 20) => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };
    fetch(`${postUri}?limit=${limit}`, {
      method: "GET",
      mode: "cors",
      headers: headers,
    })
      .then((response) => {
        if (response.status >= 400) {
          throw new Error("server error");
        }
        return response.json();
      })
      .then((response) =>
        setPosts(
          response.posts.map((val) => {
            return new Post(
              val._id,
              val.post_title,
              val.post_content,
              val.created_at,
              val.updated_at,
              val.post_status
            );
          })
        )
      )
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, [token, limit]);

  return { posts, error, loading };
};

export const useGetOnePost = (postId, token = "") => {
  const [post, setPost] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };
    fetch(`${postUri}/${postId}`, {
      method: "GET",
      mode: "cors",
      headers: headers,
    })
      .then((response) => {
        if (response.status >= 400) {
          throw new Error("server error");
        }
        return response.json();
      })
      .then((response) =>
        setPost(
          new Post(
            response.post._id,
            response.post.post_title,
            response.post.post_content,
            response.post.created_at,
            response.post.updated_at,
            response.post.post_status
          )
        )
      )
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, [postId, token]);

  return { post, error, loading };
};

export const createPost = async (postModel, token = "") => {
  const jsonObj = postToJsonObjMapper(postModel);
  let post = null;
  let error = null;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  await fetch(postUri, {
    method: "POST",
    mode: "cors",
    headers: headers,
    body: JSON.stringify(jsonObj),
  })
    .then((response) => {
      if (response.status >= 400) {
        throw new Error("server error");
      }
      return response.json();
    })
    .then(
      (response) =>
        (post = new Post(
          response.post._id,
          response.post.post_title,
          response.post.post_content,
          response.post.created_at,
          response.post.updated_at,
          response.post.post_status
        ))
    )
    .catch((err) => (error = err));

  return { post, error };
};

export const useUpdatePost = (postId, postModel, token = "") => {
  const jsonObj = postToJsonObjMapper(postModel);
  const [post, setPost] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    fetch(`${postUri}/${postId}`, {
      method: "PUT",
      mode: "cors",
      headers: headers,
      body: JSON.stringify(jsonObj),
    })
      .then((response) => {
        if (response.status >= 400) {
          throw new Error("server error");
        }
        return response.json();
      })
      .then((response) =>
        setPost(
          new Post(
            response.updatedPost._id,
            response.updatedPost.post_title,
            response.updatedPost.post_content,
            response.updatedPost.created_at,
            response.updatedPost.updated_at,
            response.updatedPost.post_status
          )
        )
      )
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, [jsonObj, postId, token]);

  return { post, error, loading };
};

export const deletePost = async (postId, token = "") => {
  let post = {};
  let error = null;

  const headers = { Authorization: `Bearer ${token}` };

  await fetch(`${postUri}/${postId}`, {
    method: "DELETE",
    mode: "cors",
    headers: headers,
  })
    .then((response) => {
      if (response.status >= 400) {
        throw new Error("server error");
      }
      return response.json();
    })
    .then(
      (response) =>
        (post = new Post(
          response.deletedPost._id,
          response.deletedPost.post_title,
          response.deletedPost.post_content,
          response.deletedPost.created_at,
          response.deletedPost.updated_at,
          response.deletedPost.post_status
        ))
    )
    .catch((err) => (error = err));

  return { post, error };
};
