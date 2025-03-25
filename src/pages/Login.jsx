import React from "react";
import InputField from "../components/InputField";
import SocialLogin from "../components/SocialLogin";
import "../index.css";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const navigate = useNavigate(); 
  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:3001/user/login", {
        username,
        password,
      });
      if (response.data.success) {
        setTimeout(() => {
          sessionStorage.setItem("username", username); // Lưu username vào session
          sessionStorage.setItem("userId", response.data.data.id);// Lưu userId
          navigate("/");
        }, 1000);
      } else {
        setMessage("Tên đăng nhập hoặc mật khẩu không đúng!");
        setMessageType("error");
      }
    } catch (error) {
      setMessage("Lỗi kết nối đến server!");
      setMessageType("error");
    }
  };
  return (
    <div className="login-container">
      <h2 className="form-title">Đăng nhập</h2>
      <SocialLogin />
      <div className="separator">
        <span>Hoặc</span>
      </div>
      <div className="login-form">
        <InputField type="text" value={username} onChange = {(e)=>setUsername(e.target.value)} placeholder="Tên đăng nhập" icon="user" />
        <InputField type="password" value={password} onChange = {(e)=>setPassword(e.target.value)} placeholder="Mật khẩu" icon="lock" />
        <button className="login-button" onClick={handleLogin}>Đăng nhập</button>
      </div>
      <p className="signup-text">
        Chưa có tài khoản? <a href="/register">Đăng ký</a>
      </p>
      {message && (
        <div
          style={{
            ...styles.message,
            backgroundColor: messageType === "success" ? "#d4edda" : "#f8d7da",
            color: messageType === "success" ? "#155724" : "#721c24",
            borderColor: messageType === "success" ? "#c3e6cb" : "#f5c6cb",
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
};
const styles = {
  container: {
      width: "300px",
      margin: "50px auto",
      textAlign: "center",
      fontFamily: "Arial, sans-serif",
  },
  input: {
      width: "100%",
      padding: "10px",
      margin: "5px 0",
      border: "1px solid #ccc",
      borderRadius: "5px",
  },
  button: {
      width: "100%",
      padding: "10px",
      backgroundColor: "#28a745",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
  },
  message: {
      marginTop: "10px",
      padding: "10px",
      borderRadius: "5px",
      border: "1px solid",
  },
};
export default Login;
