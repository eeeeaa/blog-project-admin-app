import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import styles from "../styles/App.module.css";
import { AppContext } from "../utils/contextProvider";

import { Home } from "./routes/home";
import Navbar from "./common/navbar";
import { Login } from "./routes/login";
import { EditPostPage } from "./routes/editPost";
import { DeletePostPage } from "./routes/deletePost";
import { CreatePostPage } from "./routes/createPost";
import ErrorPage from "./common/error";

import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
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
  const [cookies, setCookie] = useCookies(["token"]);
  const [userProfile, setUserProfile] = useState({});

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
        userProfile,
        setUserProfile,
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
          element: <EditPostPage />,
        },
        {
          path: "/post/:postId/delete",
          element: <DeletePostPage />,
        },
        {
          path: "/post/create",
          element: <CreatePostPage />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
