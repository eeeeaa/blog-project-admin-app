import { AppContext } from "../../../utils/contextProvider";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import styles from "../../../styles/routes/createPost.module.css";

import { createPost } from "../../../domain/posts/postUseCase";
import { Post } from "../../../model/postUiModel";

import ErrorPage from "../../common/error";
import LoadingPage from "../../common/loadingPage";

const tinyKey = import.meta.env.VITE_TINY_MCE_KEY;

export function CreatePostPage() {
  const navigate = useNavigate();
  const { cookies } = useContext(AppContext);
  const [title, setTitle] = useState(null);
  const [content, setContent] = useState(null);
  const [status, setStatus] = useState("Unpublished");

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (cookies.token === undefined) {
      navigate("/login");
    }
  }, [navigate, cookies.token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { post, error } = await createPost(
        new Post(null, title, content, null, null, status),
        cookies === undefined ? "" : cookies.token
      );

      setLoading(false);

      if (error != null) {
        setError(error);
      } else {
        navigate("/");
      }
    } catch (error) {
      setError(error);
    }
  };

  if (error) return <ErrorPage errorMsg={error.message} />;
  if (loading) return <LoadingPage />;

  return (
    <div className={styles["post-form-layout"]}>
      <form onSubmit={handleSubmit} className={styles["post-form-content"]}>
        <div className={styles["form-input"]}>
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
        <div className={styles["form-area"]}>
          <label htmlFor="content" className={styles["form-area-label"]}>
            <p>Content</p>
          </label>
          <Editor
            apiKey={`${tinyKey}`}
            id="content"
            name="content"
            onInit={(evt, editor) => {
              setContent(editor.getContent());
            }}
            onEditorChange={(newValue, editor) => {
              setContent(editor.getContent());
            }}
            required
            init={{
              height: 500,
              menubar: false,
              plugins: [
                "markdown",
                "advlist",
                "anchor",
                "autolink",
                "charmap",
                "code",
                "fullscreen",
                "help",
                "image",
                "insertdatetime",
                "link",
                "lists",
                "media",
                "preview",
                "searchreplace",
                "table",
                "visualblocks",
              ],
              toolbar:
                "undo redo | styles | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent",
              content_style:
                "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
              skin: "oxide-dark",
              content_css: "dark",
            }}
          />
        </div>
        <div className={styles["form-dropdown"]}>
          <label htmlFor="status">
            <p>Status</p>
          </label>
          <select
            name="status"
            id="status"
            defaultValue={"Unpublished"}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Unpublished">Unpublished</option>
            <option value="Published">Published</option>
          </select>
        </div>
        <button type="submit" name="submitbtn">
          Submit
        </button>
      </form>
    </div>
  );
}
