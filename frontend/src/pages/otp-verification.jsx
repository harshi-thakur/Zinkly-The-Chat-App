import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  handleChangeOtp,
  handleKeyDownOtp,
  handlePasteOtp,
  handleOtpSubmit
} from "../handlers/otpHandlers";
import useOtpTimer from "../hooks/useOtpTimer";


export default function OTPVerification() {
  const appName = import.meta.env.VITE_APP_NAME;
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { email, name } = location.state || {};

  const { resendTimer, canResend, resetTimer } = useOtpTimer(30);

  useEffect(() => {
    if (!email) navigate("/");
  }, [email, navigate]);


const resetOtp = () => {
  setOtp(new Array(6).fill(""));
  setError("");
  inputRefs.current[0]?.focus();
};

const handleSubmit = () => {
  handleOtpSubmit({
    otp,
    setError,
    setIsLoading,
    navigate,
    resetOtp,
  });
};

  const handleResend = async () => {
    if (!canResend) return;
    resetTimer();
    setError("");
    try {
      await new Promise((res) => setTimeout(res, 1000));
    } catch {
      setError("Failed to resend OTP. Please try again.");
    }
  };

  const clearOtp = () => {
    setOtp(new Array(6).fill(""));
    setError("");
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="min-h-screen bg-[#D8EDC2] flex items-center justify-center p-4">
      <div className="w-full max-w-md transform hover:scale-105 transition-transform duration-300">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden p-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                <span className="text-white text-lg font-bold">{appName[0]}</span>
              </div>
              <span className="text-2xl font-bold text-black">{appName}</span>
            </div>
            <h1 className="text-3xl font-bold text-black mb-2">Welcome {name}</h1>
            <h1 className="text-3xl font-bold text-black mb-2">Verify Your Account</h1>
            <p className="text-gray-600">
              We've sent a 6-digit verification code to
              <br />
              <span className="font-semibold text-black">your {email}</span>
            </p>
          </div>

          <div className="mb-6">
            <div className="flex justify-center gap-3 mb-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChangeOtp(index, otp, setOtp, setError, inputRefs, handleSubmit)(e.target)}
                  onKeyDown={(e) => handleKeyDownOtp(e, index, otp, inputRefs, handleSubmit)}
                  onPaste={index === 0 ? (e) => handlePasteOtp(e, setOtp, setError, inputRefs, handleSubmit) : undefined}
                  className={`w-12 h-12 text-center text-xl font-bold border-2 rounded-lg transition-all duration-200 ${
                    error
                      ? "border-red-500 bg-red-50"
                      : digit
                        ? "border-black bg-gray-50"
                        : "border-gray-300 hover:border-gray-400 focus:border-black"
                  } focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-20`}
                  disabled={isLoading}
                />
              ))}
            </div>
            {error && <div className="text-center text-red-500 text-sm mb-4 animate-pulse">{error}</div>}
            {isLoading && (
              <div className="text-center text-gray-600 text-sm mb-4">
                <div className="inline-flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
                  Verifying...
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <button
              onClick={() => handleSubmit()}
              disabled={isLoading || otp.some((digit) => digit === "")}
              className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Verifying..." : "Verify OTP"}
            </button>
            <button
              onClick={clearOtp}
              disabled={isLoading}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Clear
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm mb-2">Didn't receive the code?</p>
            {canResend ? (
              <button onClick={handleResend} className="text-black font-medium hover:underline transition-colors">
                Resend OTP
              </button>
            ) : (
              <span className="text-gray-500 text-sm">Resend in {resendTimer}s</span>
            )}
          </div>

          <div className="mt-6 text-center">
            <Link to="/signup" className="text-gray-600 hover:text-black transition-colors text-sm">
              ← Back to Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
