import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useConnection } from "../../context/connected_context";
import { useCallback, useEffect } from "react";


const ProtectedRoute = () => {
  const { connected, connectedWallet, setUser } = useConnection();

  if (!connected) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
