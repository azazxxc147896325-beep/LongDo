import React, { useState } from 'react';
import { Link, NavLink as RouterNavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BsPersonCircle, BsBoxArrowRight, BsChevronDown } from 'react-icons/bs';

const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false); // เก็บสถานะเมนูของมือถือ
  const location = useLocation(); // เก็บ path ปัจจุบัน
  const navigate = useNavigate(); // ใช้เปลี่ยนหน้า
  
  const { user, logout, isAdmin } = useAuth(); // ข้อมูล user

  const toggleMenu = () => setOpen(!open); // สลับสถานะเมนูมือถือ

  const handleLinkClick = () => {
    setOpen(false);
  };

  const handleLogout = () => {    // ฟังก์ชันเมื่อ Logout
    logout();
    navigate('/login');
    setOpen(false);
  };

  const NavLink: React.FC<{ to: string; children: React.ReactNode; mobile?: boolean; isDropdown?: boolean }> = 
    ({ to, children, mobile = false, isDropdown = false }) => {
    
    // ตรวจสอบว่า path นี้ active อยู่มั้ย
    const isActive = location.pathname === to ||
      (to === '/movies' && location.pathname.startsWith('/movies')) ||
      (to === '/series' && location.pathname.startsWith('/series')) ||
      (to === '/my-list' && location.pathname.startsWith('/my-list')) ||
      (to === '/admin' && location.pathname.startsWith('/admin'));

    // กำหนด style
    const activeClass = 'text-purple-700 font-semibold';
    const inactiveClass = 'text-gray-700 hover:text-purple-600';

    if (mobile) {
      return (
        <RouterNavLink
          to={to}
          onClick={handleLinkClick}
          className={`block w-full text-left py-2 px-4 rounded-md transition-colors duration-200 ${isActive ? 'bg-purple-200 text-purple-700' : 'text-gray-800 hover:bg-purple-50'}`}
        >
          {children}
        </RouterNavLink>
      );
    }
    
    return (
      <RouterNavLink
        to={to}
        className={`transition-colors duration-200 ${isActive ? activeClass : inactiveClass} ${isDropdown ? 'flex items-center space-x-1' : ''}`}
      >
        {children}
      </RouterNavLink>
    );
  };

  return (
    <nav className="bg-gradient-to-r from-purple-100 via-purple-50 to-yellow-100 p-4 shadow-lg sticky top-0 z-[100] backdrop-blur-sm bg-opacity-95">
      <div className="w-full flex items-center justify-between md:justify-start md:space-x-8 px-4">
        <Link to="/" onClick={handleLinkClick} className="flex items-center bg-transparent border-none cursor-pointer">
          <div className="h-16 aspect-[2.5/1] rounded-lg flex items-center justify-center overflow-hidden">
            <img src="/logo/logo.png" alt="Logo" className="h-full w-full object-cover scale-110" />
          </div>
        </Link>

        <div className="hidden md:flex space-x-6 flex-grow items-center">
          <NavLink to="/">หน้าหลัก</NavLink>
          <NavLink to="/movies">ภาพยนตร์</NavLink>
          <NavLink to="/series">ซีรี่ส์</NavLink>
          <NavLink to="/my-list">รายการของฉัน</NavLink>
          
          {/* 🔐 แสดงปุ่ม Admin เฉพาะ Admin เท่านั้น */}
          {isAdmin && (
            <NavLink to="/admin">
              <span className="flex items-center space-x-1">
                <span>🔐 Admin</span>
              </span>
            </NavLink>
          )}
        </div>

        <div className="hidden md:flex ml-auto items-center">
          {user ? (
            <div className="relative group">
              <button className="flex items-center space-x-2 text-gray-800 hover:text-purple-600 focus:outline-none py-2">
                <BsPersonCircle className="w-6 h-6" />
                <span className="text-sm font-medium">{user.email.split('@')[0]}</span>
                {isAdmin && <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-semibold">Admin</span>}
                <BsChevronDown className="w-3 h-3 transition-transform group-hover:rotate-180" />
              </button>

              {/* Dropdown Menu */}
              <div className="absolute right-0 top-full mt-0 w-48 bg-white border border-gray-200 rounded-md shadow-lg invisible opacity-0 scale-95 group-hover:visible group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 z-50">
                <div className="py-1">
                  <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-100">
                    สวัสดี, {user.email}
                  </div>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="w-full text-left px-4 py-2 text-sm text-purple-600 hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <span>🔐</span>
                      <span>Admin Dashboard</span>
                    </Link>
                  )}
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <BsBoxArrowRight />
                    <span>ออกจากระบบ</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <NavLink to="/login">เข้าสู่ระบบ</NavLink>
          )}
        </div>

        {/* ปุ่ม Hamburger (มือถือ) */}
        <div className="md:hidden">
          <button 
            onClick={toggleMenu} 
            className="text-gray-600 hover:text-gray-800 focus:outline-none p-2 rounded-md bg-transparent border-none"
            aria-label="Toggle menu"
          >
            {open ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* เมนูมือถือ */}
      <div className={`absolute right-4 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg w-64 overflow-hidden transition-all duration-300 ease-in-out origin-top-right md:hidden ${open ? 'scale-100 opacity-100 visible' : 'scale-95 opacity-0 invisible'}`}>
        <div className="flex flex-col py-1">
          <NavLink to="/" mobile>หน้าหลัก</NavLink>
          <NavLink to="/movies" mobile>ภาพยนตร์</NavLink>
          <NavLink to="/series" mobile>ซีรี่ส์</NavLink>
          <NavLink to="/my-list" mobile>รายการของฉัน</NavLink>
          
          {/* 🔐 แสดง Admin ในเมนูมือถือ */}
          {isAdmin && (
            <NavLink to="/admin" mobile>
              🔐 Admin
            </NavLink>
          )}
          
          <hr className="my-1 border-gray-100"/>
          
          {user ? (
            <>
              <div className="px-4 py-2 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <BsPersonCircle />
                  <span>{user.email}</span>
                  {isAdmin && <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">Admin</span>}
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="block w-full text-left py-2 px-4 text-red-600 hover:bg-gray-100 rounded-md transition-colors duration-200"
              >
                ออกจากระบบ
              </button>
            </>
          ) : (
            <NavLink to="/login" mobile>เข้าสู่ระบบ</NavLink>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;