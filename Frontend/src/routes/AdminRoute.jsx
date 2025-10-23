import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/user/UserContext";

export function AdminRoute({ component: Component }) {
  const { authState, currentUser, verifyUser } = useContext(UserContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => { 
      await verifyUser(); 
      setLoading(false); 
    })();
  }, []); // <-- importante: sin [authState]

  if (loading) return null;

  if (!authState) return <Navigate replace to="/login" />;

  const role = String(currentUser?.role || "").toLowerCase().trim();
  if (role !== "admin") {
    // si es superuser, lo sacamos a su panel; si es user, a /perfil
    return <Navigate replace to={role === "superuser" ? "/perfilsuperuser" : "/perfil"} />;
  }

  return Component ? <Component /> : null;
}