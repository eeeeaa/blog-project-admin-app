import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import styles from "../styles/App.module.css";
import { AppContext } from "../utils/contextProvider";

import { Home } from "./routes/home";
import ErrorPage from "./routes/error";
import { useCookies } from "react-cookie";
import { useState } from "react";

function Content() {
  return (
    <div className={styles.content}>
      <div className={styles["home-layout"]}>
        <div className={styles["content-layout"]}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

function Root() {
  const [cookies, setCookie] = useCookies(["token"]);
  const [userProfile, setUserProfile] = useState({});
  return (
    <AppContext.Provider
      value={{
        cookies,
        setCookie,
        userProfile,
        setUserProfile,
      }}
    >
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
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
