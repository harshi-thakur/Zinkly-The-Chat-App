export const handleSubmit = (e, formData, navigate) => {
  e.preventDefault();

  // Optional: Add validation logic here

  console.log("Signup:", formData);

  navigate("/verify-otp", {
    state: {
      email: formData.email,
      name: formData.fullName,
    },
  });
};
