import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const NotFoundRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log("Redirecting unknown path:", location.pathname);
    navigate("/", { replace: true });
  }, [navigate, location]);

  return null; // or a spinner while redirecting
};

export default NotFoundRedirect;
