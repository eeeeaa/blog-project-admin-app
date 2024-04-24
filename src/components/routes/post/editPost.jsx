import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../../../utils/contextProvider";
import { useContext, useEffect, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import styles from "../../../styles/routes/editPost.module.css";
import { decode } from "html-entities";

import { CiEdit } from "react-icons/ci";
import { MdOutlineDeleteForever } from "react-icons/md";
import { Link } from "react-router-dom";

import { Post } from "../../../model/postUiModel";

import { useGetComments } from "../../../domain/comments/commentUseCase";
import { updatePost } from "../../../domain/posts/postUseCase";

import ErrorPage from "../../common/error";
import LoadingPage from "../../common/loadingPage";
import LinesEllipsis from "react-lines-ellipsis";
import PropTypes from "prop-types";

CommentItem.propTypes = {
  comment: PropTypes.object,
};

CommentList.propTypes = {
  comments: PropTypes.arrayOf(PropTypes.object),
};

const tinyKey = import.meta.env.VITE_TINY_MCE_KEY;

function CommentItem({ comment }) {
  return (
    <div className={styles["comment-item"]}>
      <div className={styles["comment-item-header"]}>
        <div>
          <LinesEllipsis
            className={styles["comment-item-content"]}
            text={comment.comment}
            maxLine="1"
            ellipsis="..."
            trimRight
            basedOn="letters"
          />
        </div>
        <div className={styles["comment-icon-list"]}>
          <Link
            className={styles["link"]}
            to={`/post/${comment.postId}/comments/${comment.commentId}/edit`}
          >
            <CiEdit className={styles["comment-icon"]} />
          </Link>
          <Link
            className={styles["link"]}
            to={`/post/${comment.postId}/comments/${comment.commentId}/delete`}
          >
            <MdOutlineDeleteForever className={styles["comment-icon"]} />
          </Link>
        </div>
      </div>
      <div className={styles["comment-date"]}>{comment.createdAt}</div>
    </div>
  );
}

function CommentList({ comments }) {
  return (
    <div className={styles["comment-list"]}>
      {comments.length > 0 ? (
        comments.map((comment) => {
          return <CommentItem key={comment.commentId} comment={comment} />;
        })
      ) : (
        <div className={styles["no-comment-msg"]}>No comments</div>
      )}
    </div>
  );
}

export function EditPostConfirmPage() {
  const navigate = useNavigate();
  const { postId } = useParams();
  const { cookies } = useContext(AppContext);

  const { post, comments, error, loading } = useGetComments(
    postId,
    cookies === undefined ? "" : cookies.token
  );
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("Unpublished");

  useEffect(() => {
    if (cookies.token === undefined) {
      navigate("/login");
    }
    setTitle(post.title);
    setContent(post.content);
    setStatus(post.postStatus);
  }, [navigate, cookies.token, post.title, post.content, post.postStatus]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updatePost(
        postId,
        new Post(null, title, content, null, null, status),
        cookies === undefined ? "" : cookies.token
      );
      navigate("/");
    } catch (error) {
      navigate("/error");
    }
  };

  if (error) return <ErrorPage errorMsg={error.message} />;

  if (loading) return <LoadingPage />;

  return (
    <div className={styles["edit-post-layout"]}>
      <div className={styles["edit-post-date-list"]}>
        <div className={styles["edit-post-date"]}>
          Created At: {post.prettifyCreatedAt()}
        </div>
        <div className={styles["edit-post-date"]}>
          Updated At: {post.prettifyUpdatedAt()}
        </div>
      </div>
      <form onSubmit={handleSubmit} className={styles["edit-post-content"]}>
        <div className={styles["edit-post-input"]}>
          <label htmlFor="title">
            <p>Title</p>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={title}
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
            value={decode(content, { level: "html5" })}
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
        <div className={styles["edit-post-dropdown"]}>
          <label htmlFor="status">
            <p>Status</p>
          </label>
          <select
            name="status"
            value={status}
            id="status"
            defaultValue={"Unpublished"}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Unpublished">Unpublished</option>
            <option value="Published">Published</option>
          </select>
        </div>
        <button type="submit">Submit</button>
      </form>
      <CommentList comments={comments} />
    </div>
  );
}
