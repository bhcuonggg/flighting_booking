import React from "react";
import InputField from "../components/InputField";
import SocialLogin from "../components/SocialLogin";
import "../index.css";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setMessage("❌ Mật khẩu nhập lại không khớp!");
      return;
    }
    try {
      const response = await axios.post("http://localhost:3001/user/register", {
        username,
        password,
      });
      console.log(response.data);
      if (response.data.success) {
        setTimeout(() => {
          alert("✅ Đăng ký thành công! Vui lòng đăng nhập");
          navigate("/login");
        }, 1000);
      } else {
        setMessage("❌ " + response.data.message);
      }
    } catch (error) {
        console.log(error);
    }
  };
  return (
    <div className="login-container">
      <h2 className="form-title">Đăng ký</h2>
      <SocialLogin />
      <div className="separator"><span>Hoặc</span></div>
      <div className="login-form">
        <InputField type="text" value={username} onChange = {(e)=>setUsername(e.target.value)} placeholder="Tên đăng nhập" icon="user" />
        <InputField type="password" value={password} onChange = {(e)=>setPassword(e.target.value)} placeholder="Mật khẩu" icon="lock" />
        <InputField type="password" value={confirmPassword} onChange = {(e)=>setConfirmPassword(e.target.value)}placeholder="Nhập lại mật khẩu" icon="lock" />
        {message && <p className="error-message">{message}</p>}
        <button className="login-button" onClick={handleRegister}>Đăng ký</button>
      </div>
      <p className="signup-text">
        Đã có tài khoản? <a href="/login">Đăng nhập</a>
      </p>
    </div>
  );
};

export default Register;
