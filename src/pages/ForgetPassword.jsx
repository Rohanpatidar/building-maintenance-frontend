import { useState } from "react";
import api from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [step, setStep] = useState(1); // 1: Email, 2: OTP & Reset
    const [loading, setLoading] = useState(false);

    // 1. Forgot Username
    const handleForgotUsername = async () => {
        if (!email) return alert("Please enter email first");
        setLoading(true);
        try {
            await api.post(`api/users/forgot-username?email=${email}`);
            alert("Username has been sent to your email! ✅");
        } catch (err) { alert("Email not found in our records."); }
        finally { setLoading(false); }
    };

    // 2. Request OTP for Password
    const handleRequestOtp = async () => {
        if (!email) return alert("Please enter email first");
        setLoading(true);
        try {
            await api.post(`api/users/forgot-password/request?email=${email}`);
            alert("OTP sent to your email! Check Inbox/Spam. 🔑");
            setStep(2);
        } catch (err) { alert("Error sending OTP. Verify your email."); }
        finally { setLoading(false); }
    };

    // 3. Verify OTP & Reset
    const handleResetPassword = async () => {
        setLoading(true);
        try {
            await api.post(`api/users/forgot-password/reset?email=${email}&otp=${otp}&newPassword=${newPassword}`);
            alert("Password Reset Successful! You can now Login. 🚀");
            navigate("/login");
        } catch (err) { alert("Invalid OTP or OTP Expired."); }
        finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
            <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md border border-indigo-50">
                <h2 className="text-3xl font-black text-gray-800 mb-2">Account Recovery</h2>
                <p className="text-gray-500 mb-8 text-sm">Follow the steps to recover your account.</p>

                {step === 1 ? (
                    <div className="space-y-4">
                        <input
                            type="email" placeholder="Enter your registered email"
                            className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500 outline-none"
                            value={email} onChange={(e) => setEmail(e.target.value)}
                        />
                        <button onClick={handleRequestOtp} disabled={loading} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-indigo-700 transition">
                            {loading ? "Sending..." : "Reset Password (Get OTP)"}
                        </button>
                        <button onClick={handleForgotUsername} className="w-full text-indigo-600 font-bold py-2 hover:underline">
                            Forgot Username?
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <p className="text-xs text-green-600 font-bold">OTP sent to: {email}</p>
                        <input
                            type="text" placeholder="Enter 6-Digit OTP"
                            className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-green-500 outline-none"
                            value={otp} onChange={(e) => setOtp(e.target.value)}
                        />
                        <input
                            type="password" placeholder="Enter New Password"
                            className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-green-500 outline-none"
                            value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <button onClick={handleResetPassword} disabled={loading} className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-green-700 transition">
                            {loading ? "Verifying..." : "Update Password"}
                        </button>
                        <button onClick={() => setStep(1)} className="w-full text-gray-400 text-sm">Back to Email</button>
                    </div>
                )}
                <button onClick={() => navigate("/login")} className="w-full mt-6 text-gray-500 font-medium">Cancel</button>
            </div>
        </div>
    );
};

export default ForgotPassword;