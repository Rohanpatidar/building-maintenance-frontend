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
import PaymentTrackerPage from "./pages/PaymentTrackerPage"
import EditProfile from "./pages/EditProfile";
import ForgotPassword from "./pages/ForgetPassword";
import UserManagement from "./pages/UserManagement";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- Public Routes --- */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/directory" element={<SocietyDirectory />} />
        <Route path="/notices" element={<NoticeBoardPage />} />
        <Route path="/complaints" element={<ComplaintsPage />} />
        <Route path="/payment-tracker" element={<PaymentTrackerPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin/users" element={<UserManagement />} />
        {/* --- Shared Routes (Both Admin & User can see) --- */}
        <Route path="/balance-sheet" element={<BalanceSheet />} />
        {/* This allows any logged-in person to edit their profile */}
        <Route
          path="/edit-profile"
          element={
            <PrivateRoute roleRequired={["ADMIN", "USER"]}>
              <EditProfile />
            </PrivateRoute>
          }
        />

        {/* --- Admin Only Routes --- */}
        <Route path="/admin-dashboard" element={
          <PrivateRoute roleRequired="ADMIN">
            <AdminDashboard />
          </PrivateRoute>
        } />
        <Route path="/manage-flats" element={
          <PrivateRoute roleRequired="ADMIN">
            <ManageFlats />
          </PrivateRoute>
        } />
        <Route path="/manage-bills" element={
          <PrivateRoute roleRequired="ADMIN">
            <ManageBills />
          </PrivateRoute>
        } />
        <Route path="/manage-expenses" element={
          <PrivateRoute roleRequired="ADMIN">
            <ManageExpenses />
          </PrivateRoute>
        } />

        {/* --- User Only Routes --- */}
        <Route path="/user-dashboard" element={
          <PrivateRoute roleRequired="USER">
            <UserDashboard />
          </PrivateRoute>
        } />

        {/* --- Default Redirect --- */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;