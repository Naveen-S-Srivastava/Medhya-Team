import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { API_URL } from '../config/environment.js';

const VerifyOTPAndReset = () => {
  const { state } = useLocation();
  const email = state?.email || "";
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    otp: "",
    password: "",
    passwordConfirm: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleReset = async (e) => {
    e.preventDefault();
    const { otp, password, passwordConfirm } = formData;

    if (password !== passwordConfirm) {
      return alert("Passwords do not match");
    }

    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/users/reset-password`, {
        email,
        otp,
        password,
        passwordConfirm,
      });

      const redirectPath =
        localStorage.getItem("redirectAfterVerify") || "/events";
      localStorage.removeItem("redirectAfterVerify");
      navigate("/auth");
    } catch (err) {
      alert("Invalid OTP or server error");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="absolute top-0 left-0 w-full h-full">
          {/* Floating circles */}
          <div className="absolute top-20 left-20 w-32 h-32 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-purple-200 rounded-full opacity-30 animate-bounce"></div>
          <div className="absolute bottom-32 left-32 w-20 h-20 bg-indigo-200 rounded-full opacity-25 animate-ping"></div>
          <div className="absolute bottom-20 right-20 w-28 h-28 bg-pink-200 rounded-full opacity-20 animate-pulse"></div>
          
          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-3xl p-8 space-y-6 border border-white/20">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-black rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-black bg-clip-text text-transparent">
              Reset Password
            </h2>
            <p className="text-gray-600 text-sm">
              Enter OTP and your new password
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleReset} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 ml-1">
                OTP Code
              </label>
              <div className="relative group">
                <input
                  type="text"
                  name="otp"
                  maxLength={6}
                  required
                  placeholder="Enter 6-digit OTP"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm group-hover:border-blue-300"
                  value={formData.otp}
                  onChange={handleChange}
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 to-black/0 group-hover:from-blue-500/5 group-hover:to-black/5 transition-all duration-300 pointer-events-none"></div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 ml-1">
                New Password
              </label>
              <div className="relative group">
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="Enter new password"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm group-hover:border-blue-300"
                  value={formData.password}
                  onChange={handleChange}
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 to-black/0 group-hover:from-blue-500/5 group-hover:to-black/5 transition-all duration-300 pointer-events-none"></div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 ml-1">
                Confirm Password
              </label>
              <div className="relative group">
                <input
                  type="password"
                  name="passwordConfirm"
                  required
                  placeholder="Confirm new password"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm group-hover:border-blue-300"
                  value={formData.passwordConfirm}
                  onChange={handleChange}
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 to-black/0 group-hover:from-blue-500/5 group-hover:to-black/5 transition-all duration-300 pointer-events-none"></div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-black text-white rounded-xl hover:from-blue-700 hover:to-gray-800 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-medium shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Resetting...</span>
                </div>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Remember your password?{" "}
              <button 
                onClick={() => navigate("/auth")}
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTPAndReset;
