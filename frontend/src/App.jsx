import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import LandingLayout from "./layout/landingLayout"
import Home from "./pages/home"
import Contact from "./pages/contact"
import Login from "./pages/login"
import SignUp from "./pages/signup"
import OTPVerification from "./pages/otp-verification"
// import Partners from "./pages/partners"
// import Careers from "./pages/careers"
import "./index.css"
import "./App.css"
function App() {
  return (
   
    <Routes>
     
      <Route element={<LandingLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />}/>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="verify-otp" element={<OTPVerification />} />
      </Route>

      {/* <Route path="/chat/:roomId" element={<Chat />} /> */}
    </Routes>
    
  )
}

export default App
