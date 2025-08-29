// pages/EmailVerificationPage.jsx
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/userStore";
import RoleSelectionDialog from "./RoleSelectionDialog";

const EmailVerificationPage = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef([]);
  const navigate = useNavigate();
  const { updateUser, user } = useAuth();



  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 3) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const verifyHandler = async () => {
    const fullOtp = otp.join("");
    if (fullOtp.length !== 4) return toast.error("Please enter 4-digit OTP");

    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/users/verify`,
        { otp: fullOtp },
        { withCredentials: true }
      );
      toast.success("Verified successfully!");
      updateUser({ isVerified: true });
      const redirectPath =
        localStorage.getItem("redirectAfterVerify") || "/events";
      localStorage.removeItem("redirectAfterVerify");
      navigate("/role-selection");
      // navigate(redirectPath);
    } catch (err) {
      toast.error(
        "Verification failed: " + (err.response?.data?.message || "")
      );
    } finally {
      setLoading(false);
    }
  };

  const resendHandler = async () => {
    try {
      toast.info("OTP sent again to your email!");
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/users/resend-otp`,
        { email: user.email },
        { withCredentials: true }
      );

    } catch (err) {
      toast.error("This accound is already verified");
    }
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
        <motion.div
          className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-3xl p-8 space-y-6 border border-white/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-black rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-black bg-clip-text text-transparent">
              Verify your Email
            </h2>
            <p className="text-gray-600 text-sm">
              Enter the 4-digit code sent to your email
            </p>
          </div>

          {/* OTP Input */}
          <div className="space-y-4">
            <div className="flex justify-center gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={digit}
                  ref={(el) => (inputsRef.current[index] = el)}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-14 h-16 text-center text-2xl font-bold border-2 border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm text-black focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 hover:border-blue-300"
                />
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-4">
            <button
              onClick={verifyHandler}
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-black text-white rounded-xl hover:from-blue-700 hover:to-gray-800 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-medium shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Verifying...</span>
                </div>
              ) : (
                "Verify"
              )}
            </button>

            <button
              onClick={resendHandler}
              className="w-full py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 text-sm"
            >
              Resend OTP
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default EmailVerificationPage;
