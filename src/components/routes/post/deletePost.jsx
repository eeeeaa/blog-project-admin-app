import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useContext, useState } from "react";
import { deletePost } from "../../../domain/posts/postUseCase";
import { AppContext } from "../../../utils/contextProvider";
import styles from "../../../styles/routes/deletePost.module.css";

import ErrorPage from "../../common/error";
import LoadingPage from "../../common/loadingPage";

export function DeletePostConfirmPage() {
  const navigate = useNavigate();
  const { postId } = useParams();
  const { cookies } = useContext(AppContext);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (cookies.token === undefined) {
      navigate("/login");
    }
  }, [navigate, cookies.token]);

  const handleDelete = async () => {
    try {
      setLoading(true);
      const { post, error } = await deletePost(
        postId,
        cookies.token === undefined ? "" : cookies.token
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
    <div className={styles["delete-layout"]}>
      <div className={styles["delete-message"]}>delete post {postId} ?</div>
      <div className={styles["delete-button-list"]}>
        <button type="button" onClick={handleDelete}>
          Delete
        </button>
        <button
          type="button"
          onClick={() => {
            navigate(-1);
          }}
        >
          Go Back
        </button>
      </div>
    </div>
  );
}
