import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useContext } from "react";
import { AppContext } from "../../utils/contextProvider";

export function DeletePostPage() {
  const navigate = useNavigate();
  const { postId } = useParams();
  const { cookies } = useContext(AppContext);

  useEffect(() => {
    if (cookies.token === undefined) {
      navigate("/login");
    }
  }, [navigate, cookies.token]);

  return <div>delete post {postId}</div>;
}
