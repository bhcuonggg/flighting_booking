import React, { useState } from "react";
import {
  AiOutlineMail,
  AiOutlineLock,
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineUser,
} from "react-icons/ai";

const InputField = ({ type, placeholder, icon, value, onChange }) => {
  const [isPasswordShown, setIsPasswordShown] = useState(false);

  // Chọn icon phù hợp
  const getIcon = () => {
    switch (icon) {
      case "mail":
        return <AiOutlineMail className="input-icon" />;
      case "lock":
        return <AiOutlineLock className="input-icon" />;
      case "user":
        return <AiOutlineUser className="input-icon" />;
      default:
        return null;
    }
  };

  return (
    <div className="input-wrapper">
      {/* Hiển thị icon bên trái */}
      {getIcon()}

      {/* Input field */}
      <input
        type={type === "password" && isPasswordShown ? "text" : type}
        placeholder={placeholder}
        className="input-field"
        value={value} // Gán giá trị từ props
        onChange={onChange} // Cập nhật giá trị nhập vào
        required
      />

      {/* Hiển thị icon mắt cho mật khẩu */}
      {type === "password" && (
        <span
          onClick={() => setIsPasswordShown((prev) => !prev)}
          className="eye-icon"
        >
          {isPasswordShown ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
        </span>
      )}
    </div>
  );
};

export default InputField;
