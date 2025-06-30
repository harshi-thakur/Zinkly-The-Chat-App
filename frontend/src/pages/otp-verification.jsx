import { useState, useRef, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"


export default function OTPVerification() {
    const appName= import.meta.env.VITE_APP_NAME;
    const [otp, setOtp] = useState(new Array(6).fill(""))
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [resendTimer, setResendTimer] = useState(30)
    const [canResend, setCanResend] = useState(false)
    const inputRefs = useRef([])
    const navigate = useNavigate()
    const location = useLocation()

  const { email, name } = location.state || {}
  // Timer for resend functionality
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [resendTimer])

    useEffect(()=>{
        if(!email)
        navigate("/");
    },[email,navigate])
  const handleChange = (element, index) => {
    const value = element.value

    // Only allow numbers
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value.slice(-1) // Only take the last character
    setOtp(newOtp)
    setError("")

    // Move to next input if current field is filled
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-submit when all fields are filled
    if (newOtp.every((digit) => digit !== "") && index === 5) {
      handleSubmit(newOtp.join(""))
    }
  }

  const handleKeyDown = (e) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }

    // Move to next input on arrow right
    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Move to previous input on arrow left
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }

    // Submit on Enter if all fields are filled
    if (e.key === "Enter" && otp.every((digit) => digit !== "")) {
      handleSubmit(otp.join(""))
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)

    if (pastedData.length === 6) {
      const newOtp = pastedData.split("")
      setOtp(newOtp)
      setError("")

      // Focus the last input
      inputRefs.current[5]?.focus()

      // Auto-submit
      handleSubmit(pastedData)
    }
  }

  const handleSubmit = async (otpValue) => {
    const otpToVerify = otpValue || otp.join("")

    if (otpToVerify.length !== 6) {
      setError("Please enter all 6 digits")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate verification logic
      if (otpToVerify === "123456") {
        // Success - redirect to dashboard or home
        navigate("/")
      } else {
        setError("Invalid OTP. Please try again.")
        // Clear OTP on error
        setOtp(new Array(6).fill(""))
        inputRefs.current[0]?.focus()
      }
    } catch (err) {
      setError("Verification failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    if (!canResend) return

    setCanResend(false)
    setResendTimer(30)
    setError("")

    try {
      // Simulate resend API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      // Show success message or handle resend logic
    } catch (err) {
      setError("Failed to resend OTP. Please try again.")
    }
  }

  const clearOtp = () => {
    setOtp(new Array(6).fill(""))
    setError("")
    inputRefs.current[0]?.focus()
  }
  return (
    <div className="min-h-screen bg-[#D8EDC2] flex items-center justify-center p-4">
      <div className="w-full max-w-md transform hover:scale-105 transition-transform duration-300">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden p-8">
          {/* Header */}
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

          {/* OTP Input */}
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
                  onChange={(e) => handleChange(e.target, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={index === 0 ? handlePaste : undefined}
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

            {/* Error Message */}
            {error && <div className="text-center text-red-500 text-sm mb-4 animate-pulse">{error}</div>}

            {/* Loading State */}
            {isLoading && (
              <div className="text-center text-gray-600 text-sm mb-4">
                <div className="inline-flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
                  Verifying...
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
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

          {/* Resend Section */}
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

          {/* Back Link */}
          <div className="mt-6 text-center">
            <Link to="/signup" className="text-gray-600 hover:text-black transition-colors text-sm">
              ← Back to Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
