import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FlightBooking.css';
import { MapPinIcon, CalendarIcon, SearchIcon, UsersIcon,PlaneIcon,  GlobeIcon } from '../components/Icons';
import Header from '../components/Header';

const FlightSearch = () => {
  const [tripType, setTripType] = useState('round-trip');
  const [passengers, setPassengers] = useState({
    adults: 1,
    children: 0,
    infants: 0
  });
  const [khuVucList, setKhuVucList] = useState([]);
  const [sanBayList, setSanBayList] = useState([]);
  const [selectedKhuVuc, setSelectedKhuVuc] = useState(null);
  const [showKhuVucDropdown, setShowKhuVucDropdown] = useState(false);
  const [searchParams, setSearchParams] = useState({
    origin: '',
    destination: '',
    date: '',
    page: 1,
    limit: 10
  });
  const [flights, setFlights] = useState([]);
  const [passengerDropdown, setPassengerDropdown] = useState(false);
  const [showSanBayDropdown, setShowSanBayDropdown] = useState({
    origin: false,
    destination: false
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [flightsPerPage] = useState(5);

  // Load danh sách khu vực
  useEffect(() => {
    const fetchKhuVuc = async () => {
      try {
        const response = await axios.get('http://localhost:3001/khuvuc');
        setKhuVucList(response.data);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách khu vực:', error);
      }
    };
    fetchKhuVuc();
  }, []);

  // Load danh sách sân bay khi khu vực thay đổi
  useEffect(() => {
    const fetchSanBay = async () => {
      if (selectedKhuVuc) {
        try {
          const response = await axios.get(`http://localhost:3001/sanbay/${selectedKhuVuc.MaKhuVuc}`);
          setSanBayList(response.data);
          // Reset origin and destination when area changes
          setSearchParams(prev => ({
            ...prev,
            origin: '',
            destination: ''
          }));
        } catch (error) {
          console.error('Lỗi khi lấy danh sách sân bay:', error);
        }
      }
    };
    fetchSanBay();
  }, [selectedKhuVuc]);

  const handlePassengerChange = (type, change) => {
    setPassengers(prev => ({
      ...prev,
      [type]: Math.max(0, prev[type] + change)
    }));
  };

  const handleSearch = async () => {
    // Reset previous error message and pagination
    setErrorMessage('');
    setCurrentPage(1);

    // Validate search parameters
    const { origin, destination, date } = searchParams;
    const today = new Date().toISOString().split('T')[0];

    // Check if origin and destination are selected
    if (!origin) {
      setErrorMessage('Vui lòng chọn điểm đi');
      return;
    }

    if (!destination) {
      setErrorMessage('Vui lòng chọn điểm đến');
      return;
    }

    // Check if origin and destination are different
    if (origin === destination) {
      setErrorMessage('Điểm đi và điểm đến phải khác nhau');
      return;
    }

    // Check if date is selected and is today or in the future
    if (!date) {
      setErrorMessage('Vui lòng chọn ngày bay');
      return;
    }

    if (date < today) {
      setErrorMessage('Ngày bay phải là hôm nay hoặc trong tương lai');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:3001/flights?origin=${origin}&destination=${destination}&date=${date}`);

      // Map Amadeus API response to our flight display format
      const mappedFlights = response.data.data.map(flight => {
        const segment = flight.itineraries[0].segments[0];
        return {
          origin: segment.departure.iataCode,
          destination: segment.arrival.iataCode,
          departureTime: new Date(segment.departure.at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
          arrivalTime: new Date(segment.arrival.at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
          airline: segment.carrierCode,
          flightNumber: segment.number,
          price: Math.round(parseFloat(flight.price.total) * 25000), // Convert EUR to VND
          duration: flight.itineraries[0].duration.replace('PT', '').replace('H', ' giờ ').replace('M', ' phút')
        };
      });

      setFlights(mappedFlights);
    } catch (error) {
      console.error('Lỗi khi tìm kiếm chuyến bay:', error);
      setErrorMessage('Có lỗi xảy ra khi tìm kiếm chuyến bay');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const selectKhuVuc = (khuVuc) => {
    setSelectedKhuVuc(khuVuc);
    setShowKhuVucDropdown(false);
    // Reset sân bay khi chọn khu vực mới
    setSanBayList([]);
    setSearchParams(prev => ({
      ...prev,
      origin: '',
      destination: ''
    }));
  };

  const toggleDropdown = (type) => {
    // Kiểm tra xem đã chọn khu vực chưa
    if (!selectedKhuVuc) {
      setErrorMessage('Vui lòng chọn khu vực trước');
      return;
    }

    // Reset error message nếu đã chọn khu vực
    setErrorMessage('');

    setShowSanBayDropdown(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const selectSanBay = (type, sanBay) => {
    setSearchParams(prev => ({
      ...prev,
      [type]: sanBay.MaSanBay
    }));
    setShowSanBayDropdown(prev => ({
      ...prev,
      [type]: false
    }));
  };

  // Pagination logic
  const indexOfLastFlight = currentPage * flightsPerPage;
  const indexOfFirstFlight = indexOfLastFlight - flightsPerPage;
  const currentFlights = flights.slice(indexOfFirstFlight, indexOfLastFlight);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="flight-search-container">
      <div className="search-inputs">
        {/* Khu vực dropdown */}
        <div className="input-group" style={{ position: 'relative' }}>
          <GlobeIcon />
          <div 
            className="dropdown-selected"
            onClick={() => setShowKhuVucDropdown(!showKhuVucDropdown)}
            style={{
              padding: '10px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%'
            }}
          >
            {selectedKhuVuc ? selectedKhuVuc.TenKhuVuc : 'Chọn khu vực'}
            <span style={{ marginLeft: '10px' }}>▼</span>
          </div>
          {showKhuVucDropdown && (
            <div 
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                backgroundColor: 'white',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                maxHeight: '200px',
                overflowY: 'auto',
                zIndex: 1000,
                marginTop: '5px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}
            >
              {khuVucList.map(khuVuc => (
                <div 
                  key={khuVuc.MaKhuVuc}
                  style={{
                    padding: '10px',
                    cursor: 'pointer',
                    borderBottom: '1px solid #eee',
                    ':hover': {
                      backgroundColor: '#f5f5f5'
                    }
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    selectKhuVuc(khuVuc);
                  }}
                >
                  {khuVuc.TenKhuVuc}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Điểm đi dropdown */}
        <div className="input-group">
          <MapPinIcon />
          <div className={`dropdown-container ${showSanBayDropdown.origin ? 'open' : ''}`}>
            <div 
              className="dropdown-selected"
              onClick={() => toggleDropdown('origin')}
            >
              {searchParams.origin ? 
                sanBayList.find(sb => sb.MaSanBay === searchParams.origin)?.TenSanBay || searchParams.origin 
                : 'Điểm đi'}
              <span className="dropdown-arrow">▼</span>
            </div>
            {showSanBayDropdown.origin && (
              <div className="dropdown-options">
                {errorMessage ? (
                  <div className="error-message" style={{ color: 'red', padding: '10px' }}>
                    {errorMessage}
                  </div>
                ) : (
                  sanBayList.map(sanBay => (
                    <div 
                      key={sanBay.MaSanBay} 
                      className="dropdown-option"
                      onClick={(e) => {
                        e.stopPropagation();
                        selectSanBay('origin', sanBay);
                      }}
                    >
                      {sanBay.TenSanBay}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Điểm đến dropdown */}
        <div className="input-group">
          <MapPinIcon />
          <div className={`dropdown-container ${showSanBayDropdown.destination ? 'open' : ''}`}>
            <div 
              className="dropdown-selected"
              onClick={() => toggleDropdown('destination')}
            >
              {searchParams.destination ? 
                sanBayList.find(sb => sb.MaSanBay === searchParams.destination)?.TenSanBay || searchParams.destination 
                : 'Điểm đến'}
              <span className="dropdown-arrow">▼</span>
            </div>
            {showSanBayDropdown.destination && (
              <div className="dropdown-options">
                {errorMessage ? (
                  <div className="error-message" style={{ color: 'red', padding: '10px' }}>
                    {errorMessage}
                  </div>
                ) : (
                  sanBayList.map(sanBay => (
                    <div 
                      key={sanBay.MaSanBay} 
                      className="dropdown-option"
                      onClick={(e) => {
                        e.stopPropagation();
                        selectSanBay('destination', sanBay);
                      }}
                    >
                      {sanBay.TenSanBay}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Ngày đi */}
        <div className="input-group">
          <CalendarIcon />
          <input 
            type="date" 
            name="date"
            value={searchParams.date}
            onChange={handleInputChange}
          />
        </div>

        {/* Hành khách */}
        <div className="input-group passengers-selector">
          <UsersIcon />
          <div 
            className="passengers-display"
            onClick={() => setPassengerDropdown(!passengerDropdown)}
          >
            {passengers.adults + passengers.children + passengers.infants} Hành Khách
            <span className="dropdown-arrow">▼</span>
          </div>
          {passengerDropdown && (
            <div className="passenger-dropdown">
              {Object.keys(passengers).map(type => (
                <div key={type} className="passenger-row">
                  <span>{type === 'adults' ? 'Người Lớn' : 
                          type === 'children' ? 'Trẻ Em' : 
                          'Em Bé'}</span>
                  <div className="passenger-controls">
                    <button onClick={(e) => {
                      e.stopPropagation();
                      handlePassengerChange(type, -1);
                    }}>-</button>
                    <span>{passengers[type]}</span>
                    <button onClick={(e) => {
                      e.stopPropagation();
                      handlePassengerChange(type, 1);
                    }}>+</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <button className="search-flight-btn" onClick={handleSearch}>
        <SearchIcon />
        Tìm Chuyến Bay
      </button>

      {/* Thêm div hiển thị thông báo lỗi */}
      {errorMessage && (
        <div 
          style={{
            color: 'red', 
            marginTop: '10px', 
            padding: '10px', 
            backgroundColor: '#ffeeee', 
            borderRadius: '8px',
            textAlign: 'center'
          }}
        >
          {errorMessage}
        </div>
      )}

      {flights.length > 0 && (
        <div className="flight-results">
          <h3>Kết quả tìm kiếm ({flights.length} chuyến bay)</h3>
          <div className="flight-list">
            {currentFlights.map((flight, index) => (
              <div key={index} className="flight-item" style={{
                display: 'flex', 
                justifyContent: 'space-between', 
                padding: '10px', 
                border: '1px solid #e0e0e0', 
                marginBottom: '10px',
                borderRadius: '8px'
              }}>
                <div className="flight-info">
                  <div>
                    <strong>{flight.origin} → {flight.destination}</strong>
                  </div>
                  <div>
                    <span>{flight.departureTime} - {flight.arrivalTime}</span>
                  </div>
                  <div>
                    <small>Hãng: {flight.airline} | Chuyến bay: {flight.flightNumber}</small>
                  </div>
                </div>
                <div className="flight-details" style={{textAlign: 'right'}}>
                  <div className="flight-price" style={{fontWeight: 'bold', color: '#007bff'}}>
                    {flight.price.toLocaleString()} VND
                  </div>
                  <div>
                    <small>Thời gian bay: {flight.duration}</small>
                  </div>
                  <div>
                     {/* Thêm nút Đặt hàng */}
                      <button 
                    // onClick={() => handleBooking(flight)} 
                    style={{
                      backgroundColor: '#28a745', 
                      color: 'white', 
                      padding: '8px 16px', 
                      border: 'none', 
                      borderRadius: '5px', 
                      cursor: 'pointer'
                    }}
                  >
                    Đặt vé
                  </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="pagination" style={{
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            marginTop: '20px'
          }}>
            {Array.from({ 
              length: Math.ceil(flights.length / flightsPerPage) 
            }).map((_, index) => (
              <button 
                key={index} 
                onClick={() => paginate(index + 1)}
                style={{
                  margin: '0 5px',
                  padding: '5px 10px',
                  backgroundColor: currentPage === index + 1 ? '#007bff' : '#f8f9fa',
                  color: currentPage === index + 1 ? 'white' : 'black',
                  border: '1px solid #dee2e6',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const FeaturedDestinations = () => {
  const destinations = [
    { name: 'Hà Nội', image: '/hanoi.png' },
    { name: 'Đà Nẵng', image: '/danang.png' },
    { name: 'Hồ Chí Minh', image: '/tphcm.png' },
    { name: 'Phú Quốc', image: '/image.png' }
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