import React, { useState } from 'react';
import './FlightBooking.css';

// Icons 
const MapPinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y6="6"></line>
    <line x1="8" y1="2" x2="8" y6="6"></line>
    <line x1="3" y1="10" x2="21" y10="10"></line>
  </svg>
);

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="8.5" cy="7" r="4"></circle>
    <path d="M20 8v6"></path>
    <path d="M23 11h-6"></path>
  </svg>
);

const PlaneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16.8 8.8L5.5 16l-1.4-1.5a1 1 0 0 1 .2-1.7l12.1-5.2a1 1 0 0 1 1.3 1.3l-2.9 11.9a1 1 0 0 1-1.7.2L9 16.8l-4.3 4.3a1 1 0 0 1-1.4 0l-1.4-1.4a1 1 0 0 1 0-1.4l4.3-4.3L3 11.2a1 1 0 0 1 .2-1.7l12.1-5.2a1 1 0 0 1 1.3 1.3l-5.2 12.1a1 1 0 0 1-1.7.2L8 16.8l8.8-3.2z"></path>
  </svg>
);

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

const FlightSearch = () => {
  const [tripType, setTripType] = useState('round-trip');
  const [passengers, setPassengers] = useState({
    adults: 1,
    children: 0,
    infants: 0
  });

  const handlePassengerChange = (type, change) => {
    setPassengers(prev => ({
      ...prev,
      [type]: Math.max(0, prev[type] + change)
    }));
  };

  const [passengerDropdown, setPassengerDropdown] = useState(false);

  return (
    <div className="flight-search-container">
      <div className="trip-type-selector">
        {['round-trip', 'one-way', 'multi-city'].map(type => (
          <button 
            key={type}
            className={tripType === type ? 'active' : ''}
            onClick={() => setTripType(type)}
          >
            {type === 'round-trip' ? 'Khứ Hồi' : 
             type === 'one-way' ? 'Một Chiều' : 
             'Nhiều Thành Phố'}
          </button>
        ))}
      </div>

      <div className="search-inputs">
        <div className="input-group">
          <MapPinIcon />
          <input type="text" placeholder="Điểm Đi" />
        </div>
        <div className="input-group">
          <MapPinIcon />
          <input type="text" placeholder="Điểm Đến" />
        </div>
        <div className="input-group">
          <CalendarIcon />
          <input type="date" />
        </div>
        <div className="input-group passengers-selector">
          <UsersIcon />
          <div 
            className="passengers-display"
            onClick={() => setPassengerDropdown(!passengerDropdown)}
          >
            {passengers.adults + passengers.children + passengers.infants} Hành Khách
          </div>
          {passengerDropdown && (
            <div className="passenger-dropdown">
              {Object.keys(passengers).map(type => (
                <div key={type} className="passenger-row">
                  <span>{type === 'adults' ? 'Người Lớn' : 
                          type === 'children' ? 'Trẻ Em' : 
                          'Em Bé'}</span>
                  <div className="passenger-controls">
                    <button onClick={() => handlePassengerChange(type, -1)}>-</button>
                    <span>{passengers[type]}</span>
                    <button onClick={() => handlePassengerChange(type, 1)}>+</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <button className="search-flight-btn">
        <SearchIcon />
        Tìm Chuyến Bay
      </button>
    </div>
  );
};

const FeaturedDestinations = () => {
  const destinations = [
    { name: 'Hà Nội', image: '/hanoi.png' },
    { name: 'Đà Nẵng', image: '/danang.png' },
    { name: 'Hồ Chí Minh', image: '/tphcm.png' },
    { name: 'Phú Quốc', image: 'image.png' }
  ];

  return (
    <section className="featured-destinations">
      <h2>Điểm Đến Nổi Bật</h2>
      <div className="destinations-grid">
        {destinations.map((dest, index) => (
          <div key={index} className="destination-card">
            <img src={dest.image} alt={dest.name} />
            <div className="destination-name">{dest.name}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

const FlightBookingApp = () => {
  return (
    <div className="flight-booking-app">
      <Header />
      <div className="hero-section">
        <div className="hero-content">
          <h1>Khám Phá Thế Giới Cùng SkyTravel</h1>
          <p>Đặt vé máy bay dễ dàng, trải nghiệm bay thoải mái</p>
        </div>
      </div>
      <FlightSearch />
      <FeaturedDestinations />
    </div>
  );
};

export default FlightBookingApp;