export const handleChangeOtp = (index, otp, setOtp, setError, inputRefs, handleSubmit) => (element) => {
  const value = element.value;
  if (!/^\d*$/.test(value)) return;
  const newOtp = [...otp];
  newOtp[index] = value.slice(-1);
  setOtp(newOtp);
  setError("");
  if (value && index < 5) {
    inputRefs.current[index + 1]?.focus();
  }
  if (newOtp.every((digit) => digit !== "") && index === 5) {
    handleSubmit(newOtp.join(""));
  }
};

export const handleKeyDownOtp = (e, index, otp, inputRefs, handleSubmit) => {
  if (e.key === "Backspace" && !otp[index] && index > 0) {
    inputRefs.current[index - 1]?.focus();
  }
  if (e.key === "ArrowRight" && index < 5) {
    inputRefs.current[index + 1]?.focus();
  }
  if (e.key === "ArrowLeft" && index > 0) {
    inputRefs.current[index - 1]?.focus();
  }
  if (e.key === "Enter" && otp.every((digit) => digit !== "")) {
    handleSubmit(otp.join(""));
  }
};

export const handlePasteOtp = (e, setOtp, setError, inputRefs, handleSubmit) => {
  e.preventDefault();
  const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
  if (pastedData.length === 6) {
    const newOtp = pastedData.split("");
    setOtp(newOtp);
    setError("");
    inputRefs.current[5]?.focus();
    handleSubmit(pastedData);
  }
};

export const handleOtpSubmit = async ({
  otp,
  setError,
  setIsLoading,
  navigate,
  resetOtp,
}) => {
  const otpValue = otp.join("");

  if (otpValue.length !== 6) {
    setError("Please enter all 6 digits");
    return;
  }

  setIsLoading(true);
  setError("");

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    if (otpValue === "123456") {
      navigate("/");
    } else {
      setError("Invalid OTP. Please try again.");
      resetOtp();
    }
  } catch (err) {
    setError("Verification failed. Please try again.");
  } finally {
    setIsLoading(false);
  }
};
