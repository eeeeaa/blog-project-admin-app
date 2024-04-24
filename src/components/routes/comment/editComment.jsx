import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useContext, useState } from "react";
import { AppContext } from "../../../utils/contextProvider";
import {
  updateComment,
  useGetOneComment,
} from "../../../domain/comments/commentUseCase";
import styles from "../../../styles/routes/editComment.module.css";
import { Comment } from "../../../model/commentUiModel";

import ErrorPage from "../../common/error";
import LoadingPage from "../../common/loadingPage";

export function EditCommentPage() {
  const navigate = useNavigate();
  const { postId, commentId } = useParams();
  const { cookies } = useContext(AppContext);

  const { post, comment, error, loading } = useGetOneComment(
    postId,
    commentId,
    cookies.token === undefined ? "" : cookies.token
  );

  const [commentVal, setCommentVal] = useState("");

  useEffect(() => {
    if (cookies.token === undefined) {
      navigate("/login");
    }
    setCommentVal(comment.comment);
  }, [navigate, cookies.token, comment]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateComment(
        postId,
        commentId,
        new Comment(null, commentVal, null, null),
        cookies.token === undefined ? "" : cookies.token
      );
      navigate("/");
    } catch (error) {
      navigate("/error");
    }
  };

  if (error) return <ErrorPage errorMsg={error.message} />;
  if (loading) return <LoadingPage />;

  return (
    <div className={styles["edit-layout"]}>
      <div className={styles["edit-info"]}>
        <div>Post Id:</div> <div>{postId}</div>
        <div>Comment Id:</div> <div>{commentId}</div>
        <div>Created At:</div> <div>{comment.prettifyCreatedAt()}</div>
      </div>

      <form onSubmit={handleSubmit} className={styles["edit-content"]}>
        <label htmlFor="comment" className={styles["form-area-label"]}>
          Content
        </label>
        <textarea
          name="comment"
          id="comment"
          value={commentVal}
          cols={50}
          rows={20}
          onChange={(e) => setCommentVal(e.target.value)}
          required
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
