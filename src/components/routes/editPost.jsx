import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../../utils/contextProvider";
import { useContext, useEffect } from "react";

export function EditPostConfirmPage() {
  const navigate = useNavigate();
  const { postId } = useParams();
  const { cookies, userProfile } = useContext(AppContext);

  useEffect(() => {
    if (cookies.token === undefined || userProfile.username === undefined) {
      navigate("/login");
    }
  }, [navigate, cookies.token, userProfile]);

  return (
    <div>
      <div>edit post {postId}</div>
      <div>
        <button type="button">Submit</button>
        <button
          type="button"
          onClick={() => {
            navigate("/");
          }}
        >
          Go Back
        </button>
      </div>
    </div>
  );
}
