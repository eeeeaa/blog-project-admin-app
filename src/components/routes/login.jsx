import { loginUseCase } from "../../domain/auth/authUseCase";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../../utils/contextProvider";
import styles from "../../styles/routes/login.module.css";

export function Login() {
  const navigate = useNavigate();
  const { setCookie, setUserProfile } = useContext(AppContext);
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUseCase(username, password);
      setCookie("token", data.token, {
        secure: true,
        httpOnly: true,
        sameSite: true,
        maxAge: 86400,
      });
      setUserProfile({ username: data.username });
      navigate("/");
    } catch (error) {
      navigate("/error");
    }
  };
  return (
    <div className={styles["login-layout"]}>
      <h4 className={styles["login-notice"]}>
        Please login to perform admin operations
      </h4>
      <form method="post" onSubmit={handleSubmit}>
        <div className={styles["login-form"]}>
          <div className={styles["login-form-input"]}>
            <label htmlFor="username">
              <p>Username</p>
            </label>
            <input
              id="username"
              name="username"
              type="text"
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>
          <div className={styles["login-form-input"]}>
            <label htmlFor="password">
              <p>Password</p>
            </label>
            <input
              id="password"
              name="password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className={styles["login-form-button"]}>
            Login
          </button>
        </div>
      </form>
    </div>
  );
}
