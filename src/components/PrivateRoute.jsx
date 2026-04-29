import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const PrivateRoute = ({ children, roleRequired }) => {
    const token = localStorage.getItem("token");

    // 1. Agar token hi nahi hai, toh seedha Login pe bhej do (Sabse zaroori step)
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    try {
        const decoded = jwtDecode(token);
        const userRole = decoded.role; // Token se role nikala

        // 2. Agar koi specific role chahiye (e.g., ADMIN)
        if (roleRequired) {
            // Agar multiple roles allow karne hain (Array check)
            if (Array.isArray(roleRequired)) {
                const hasAccess = roleRequired.some(role =>
                    userRole === role || userRole === `ROLE_${role}`
                );
                if (!hasAccess) return <Navigate to="/user-dashboard" replace />;
            }
            // Agar single role check karna hai (ADMIN string)
            else if (roleRequired === "ADMIN") {
                if (userRole !== "ROLE_ADMIN" && userRole !== "ADMIN") {
                    return <Navigate to="/user-dashboard" replace />;
                }
            }
        }
    } catch (error) {
        // Token kharab hai ya expire ho gaya
        console.error("Invalid Token", error);
        localStorage.removeItem("token");
        return <Navigate to="/login" replace />;
    }

    // Sab sahi hai toh page dikhao
    return children;
};

export default PrivateRoute;