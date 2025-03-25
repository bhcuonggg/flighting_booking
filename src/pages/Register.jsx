import React from "react";
import InputField from "../components/InputField";
import SocialLogin from "../components/SocialLogin";
import "../index.css";

const Register = () => {
  return (
    <div className="login-container">
      <h2 className="form-title">Đăng ký</h2>
      <SocialLogin />
      <div className="separator"><span>Hoặc</span></div>
      <form className="login-form">
        <InputField type="text" placeholder="Họ và Tên" icon="user" />
        <InputField type="email" placeholder="Email" icon="mail" />
        <InputField type="password" placeholder="Mật khẩu" icon="lock" />
        <button className="login-button">Đăng ký</button>
      </form>
      <p className="signup-text">
        Đã có tài khoản? <a href="/login">Đăng nhập</a>
      </p>
    </div>
  );
};

export default Register;
