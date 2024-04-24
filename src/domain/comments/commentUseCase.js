import { useState } from "react";
import { useEffect } from "react";
import { Comment } from "../../model/commentUiModel";
import { Post } from "../../model/postUiModel";
import { commentToJsonObjMapper } from "../common/mapper";

const postUri = `${import.meta.env.VITE_BLOG_API_URL}/posts`;

export const useGetComments = (postId, token = "") => {
  const [post, setPost] = useState({});
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };
    fetch(`${postUri}/${postId}/comments`, {
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
      .then((response) => {
        setComments(
          response.comments.map((val) => {
            return new Comment(val._id, val.comment, val.created_at, val.post);
          })
        );
        setPost(
          new Post(
            response.post._id,
            response.post.post_title,
            response.post.post_content,
            response.post.created_at,
            response.post.updated_at,
            response.post.post_status
          )
        );
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, [postId, token]);

  return { post, comments, error, loading };
};

export const createComment = async (postId, commentModel, token = "") => {
  const jsonObj = commentToJsonObjMapper(commentModel);
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  let comment = null;
  let post = null;
  let error = null;
  await fetch(`${postUri}/${postId}/comments`, {
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
    .then((response) => {
      comment = new Comment(
        response.comment._id,
        response.comment.comment,
        response.comment.created_at,
        response.comment.post
      );
      post = new Post(
        response.post._id,
        response.post.post_title,
        response.post.post_content,
        response.post.created_at,
        response.post.updated_at,
        response.post.post_status
      );
    })
    .catch((err) => {
      error = err;
    });

  return { post, comment, error };
};

export const updateComment = async (
  postId,
  commentId,
  commentModel,
  token = ""
) => {
  const jsonObj = commentToJsonObjMapper(commentModel);
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  let comment = null;
  let error = null;

  await fetch(`${postUri}/${postId}/comments/${commentId}`, {
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
    .then((response) => {
      comment = new Comment(
        response.updatedComment._id,
        response.updatedComment.comment,
        response.updatedComment.created_at,
        response.updatedComment.post
      );
    })
    .catch((err) => {
      error = err;
    });

  return { comment, error };
};

export const deleteComment = async (postId, commentId, token = "") => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  let comment = null;
  let error = null;

  await fetch(`${postUri}/${postId}/comments/${commentId}`, {
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
    .then((response) => {
      comment = new Comment(
        response.deletedComment._id,
        response.deletedComment.comment,
        response.deletedComment.created_at,
        response.deletedComment.post
      );
    })
    .catch((err) => {
      error = err;
    });

  return { comment, error };
};
