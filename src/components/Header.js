import React from 'react';
import { PlaneIcon } from '../components/Icons';


const Header = () => {
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
            <li><a href="/login">Đăng nhập</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
