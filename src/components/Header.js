import React,{useState,useEffect} from 'react';
import { PlaneIcon } from '../components/Icons';
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { AiOutlineDown } from "react-icons/ai";

const Header = () => {
  const [username, setUsername] = useState(null);
  const [userId,setUserId] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const storedUser = sessionStorage.getItem("username");
    const storedUserId = sessionStorage.getItem("userId");
    if (storedUser) {
      setUsername(storedUser);
      setUserId(storedUserId);
    }
  }, []);
  const handleLogout = () => {
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("userId");
    setUsername(null);
    setUserId(null)
    navigate("/"); 
  };
  return (
    <header className="flight-header">
      <div className="header-container">
        <div className="logo">
          <PlaneIcon />
          <span>SkyTravel</span>
        </div>
        <nav>
          <ul>
            <li><a href="#">Trang Chủ</a></li>
            <li><a href="#">Chuyến Bay</a></li>
            <li><a href="#">Đặt Chỗ</a></li>
            <li><a href="#">Liên Hệ</a></li>
            {username ? (
              <li className="user-menu">
                <div
                  className="dropdown"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <FaUserCircle className="user-icon" />
                  <span className="username">{username}</span>
                  <AiOutlineDown className="dropdown-arrow" /> 
                  {showDropdown && (
                    <div className="dropdown-menu">
                      <button className='button_logout' onClick={handleLogout}>Đăng xuất</button>
                    </div>
                  )}
                </div>
              </li>
            ) : (
              <li><a href="/login">Đăng nhập</a></li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
