import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import styles from "../styles/App.module.css";
import { AppContext } from "../utils/contextProvider";

import { Home } from "./routes/home";
import Navbar from "./common/navbar";
import { Login } from "./routes/login";
import { EditPostConfirmPage } from "./routes/post/editPost";
import { DeletePostConfirmPage } from "./routes/post/deletePost";
import { EditCommentPage } from "./routes/comment/editComment";
import { DeleteCommentPage } from "./routes/comment/deleteComment";
import { CreatePostPage } from "./routes/post/createPost";
import ErrorPage from "./common/error";

import { useCookies } from "react-cookie";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Content() {
  return (
    <div className={styles.content}>
      <div className={styles["content-layout"]}>
        <Outlet />
      </div>
    </div>
  );
}

function Root() {
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);

  useEffect(() => {
    if (cookies.token === undefined) {
      navigate("/login");
    }
  }, [cookies.token, navigate]);

  return (
    <AppContext.Provider
      value={{
        cookies,
        setCookie,
        removeCookie,
      }}
    >
      <Navbar />
      <Content />
    </AppContext.Provider>
  );
}

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/post/:postId/edit",
          element: <EditPostConfirmPage />,
        },
        {
          path: "/post/:postId/delete",
          element: <DeletePostConfirmPage />,
        },
        {
          path: "/post/create",
          element: <CreatePostPage />,
        },
        {
          path: "/post/:postId/comments/:commentId/edit",
          element: <EditCommentPage />,
        },
        {
          path: "/post/:postId/comments/:commentId/delete",
          element: <DeleteCommentPage />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
