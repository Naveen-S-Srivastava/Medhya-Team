// src/pages/ForgotPassword.jsx
import { ResetPassword } from "@clerk/clerk-react";

export default function ForgotPassword() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h4 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Reset Password
        </h4>
        <p className="text-center text-gray-500 mb-6">
          Enter your email to reset password
        </p>
        <ResetPassword />
      </div>
    </div>
  );
}
