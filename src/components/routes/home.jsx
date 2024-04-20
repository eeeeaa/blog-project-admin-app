import { useGetPosts } from "../../domain/posts/postUseCase";
import ErrorPage from "../common/error";
import LoadingPage from "../common/loadingPage";
import styles from "../../styles/routes/home.module.css";
import PropTypes from "prop-types";

import { CiEdit } from "react-icons/ci";
import { MdOutlineDeleteForever } from "react-icons/md";
import { Link } from "react-router-dom";

ContentItem.propTypes = {
  post: PropTypes.object,
};

function ContentItem({ post }) {
  return (
    <div className={styles["post-item"]}>
      <div className={styles["post-item-header"]}>
        <div className={styles["post-item-title"]}>title: {post.title}</div>
        <div className={styles["post-icon-list"]}>
          <Link className={styles["link"]} to={`/post/${post.postId}/edit`}>
            <CiEdit className={styles["post-icon"]} />
          </Link>
          <Link className={styles["link"]} to={`/post/${post.postId}/delete`}>
            <MdOutlineDeleteForever className={styles["post-icon"]} />
          </Link>
        </div>
      </div>
      <div className={styles["post-item-date"]}>
        updated: {post.prettifyUpdatedAt()}
      </div>
    </div>
  );
}

export function Home() {
  const { posts, error, loading } = useGetPosts("");

  if (error) return <ErrorPage errorMsg={error.message} />;

  if (loading) return <LoadingPage />;

  return (
    <div>
      {posts.length > 0 ? (
        <div className={styles["home-layout"]}>
          {posts
            .filter((post) => post.postStatus === "Published")
            .map((post) => {
              return <ContentItem key={post.postId} post={post} />;
            })}
        </div>
      ) : (
        <div>No Blogs</div>
      )}
    </div>
  );
}
