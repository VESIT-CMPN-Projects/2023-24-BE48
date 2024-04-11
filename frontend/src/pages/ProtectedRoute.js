import { useNavigate } from "react-router-dom";
import { UserContext } from "../components/UserContext";
import { useContext, useEffect } from "react";

function ProtectedRoute({ element }) {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  return user ? element : null;
}

export default ProtectedRoute;
