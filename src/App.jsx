import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import PrivateRoute from "./components/PrivateRoute";
import ManageFlats from "./pages/ManageFlats";
import ManageBills from "./pages/ManageBills";
import Register from "./pages/Register";
import ManageExpenses from "./pages/ManageExpenses";
import BalanceSheet from "./pages/BalanceSheet";
import SocietyDirectory from "./pages/SocietyDirectory";
import NoticeBoardPage from "./pages/NoticeBoardPage";
import ComplaintsPage from "./pages/ComplaintsPage";
import PaymentTrackerPage from "./pages/PaymentTrackerPage";
import EditProfile from "./pages/EditProfile";
import ForgotPassword from "./pages/ForgetPassword";
import UserManagement from "./pages/UserManagement";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- Public Routes (No Login Required) --- */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* --- Admin Only Routes (Strictly Protected) --- */}
        <Route path="/admin-dashboard" element={
          <PrivateRoute roleRequired="ADMIN"><AdminDashboard /></PrivateRoute>
        } />
        <Route path="/manage-flats" element={
          <PrivateRoute roleRequired="ADMIN"><ManageFlats /></PrivateRoute>
        } />
        <Route path="/manage-bills" element={
          <PrivateRoute roleRequired="ADMIN"><ManageBills /></PrivateRoute>
        } />
        <Route path="/manage-expenses" element={
          <PrivateRoute roleRequired="ADMIN"><ManageExpenses /></PrivateRoute>
        } />
        <Route path="/admin/users" element={
          <PrivateRoute roleRequired="ADMIN"><UserManagement /></PrivateRoute>
        } />

        {/* --- User Only Routes --- */}
        <Route path="/user-dashboard" element={
          <PrivateRoute roleRequired="USER"><UserDashboard /></PrivateRoute>
        } />

        {/* --- Shared Routes (Login Required for Both) --- */}
        <Route path="/directory" element={
          <PrivateRoute roleRequired={["ADMIN", "USER"]}><SocietyDirectory /></PrivateRoute>
        } />
        <Route path="/notices" element={
          <PrivateRoute roleRequired={["ADMIN", "USER"]}><NoticeBoardPage /></PrivateRoute>
        } />
        <Route path="/complaints" element={
          <PrivateRoute roleRequired={["ADMIN", "USER"]}><ComplaintsPage /></PrivateRoute>
        } />
        <Route path="/payment-tracker" element={
          <PrivateRoute roleRequired={["ADMIN", "USER"]}><PaymentTrackerPage /></PrivateRoute>
        } />
        <Route path="/balance-sheet" element={
          <PrivateRoute roleRequired={["ADMIN", "USER"]}><BalanceSheet /></PrivateRoute>
        } />
        <Route path="/edit-profile" element={
          <PrivateRoute roleRequired={["ADMIN", "USER"]}><EditProfile /></PrivateRoute>
        } />

        {/* --- Fallback Redirects --- */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;