import { AppContext } from "../../utils/contextProvider";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { createPost } from "../../domain/posts/postUseCase";
import { Post } from "../../model/postUiModel";

export function CreatePostPage() {
  const navigate = useNavigate();
  const { cookies } = useContext(AppContext);
  const [title, setTitle] = useState(null);
  const [content, setContent] = useState(null);
  const [status, setStatus] = useState("Unpublished");

  useEffect(() => {
    if (cookies.token === undefined) {
      navigate("/login");
    }
  }, [navigate, cookies.token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPost(
        new Post(null, title, content, null, null, status),
        cookies === undefined ? "" : cookies.token
      );
      //TODO refresh component without reloading?
      navigate("/");
    } catch (error) {
      navigate("/error");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">
            <p>Title</p>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="content">
            <p>Content</p>
          </label>
          <textarea
            id="content"
            name="content"
            type="text"
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="status">
            <p>Status</p>
          </label>
          <select
            name="status"
            id="status"
            onChange={(e) => setStatus(e.target.value)}
          >
            <option selected value="Unpublished">
              Unpublished
            </option>
            <option value="Published">Published</option>
          </select>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
