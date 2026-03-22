import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const PrivateRoute = ({ children, roleRequired }) => {
    const token = localStorage.getItem("token");

    // 1. If not logged in, go to Login
    if (!token) {
        return <Navigate to="/login" />;
    }

    // 2. If logged in, check Role
    if (roleRequired) {
        try {
            const decoded = jwtDecode(token);
            const userRole = decoded.role; // Get the role from the token

            // --- ADMIN CHECK ---
            if (roleRequired === "ADMIN") {
                // We check for BOTH 'ROLE_ADMIN' and 'ADMIN' to be safe
                if (userRole !== "ROLE_ADMIN" && userRole !== "ADMIN") {
                    // If they are not an Admin, send them to the User Dashboard
                    return <Navigate to="/user-dashboard" />;
                }
            }

            // --- USER CHECK ---
            // (Optional) usually we allow Admins to see User pages too, 
            // so we don't strictly block access here unless you want to.

        } catch (error) {
            // If token is invalid or expired
            localStorage.removeItem("token");
            return <Navigate to="/login" />;
        }
    }

    return children;
};

export default PrivateRoute;