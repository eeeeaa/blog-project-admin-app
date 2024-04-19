import { useNavigate } from "react-router-dom";
import { AppContext } from "../../utils/contextProvider";
import { useContext, useEffect } from "react";

export function EditPostPage() {
  const navigate = useNavigate();
  const { cookies } = useContext(AppContext);
  useEffect(() => {
    if (cookies.token === undefined) {
      navigate("/login");
    }
  }, [navigate, cookies.token]);
  return <div>edit post</div>;
}
