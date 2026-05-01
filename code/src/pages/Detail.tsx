import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import db from '../data/database';
import type { Media } from '../types/types';
import { BsFillPlayFill, BsPlusLg, BsCheckLg } from 'react-icons/bs';
import ReactPlayer from 'react-player';
import { useMyList } from '../context/MyListContext';
import { useAuth } from '../context/AuthContext';

export const Detail: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // ดึง id จาก URL เช่น /details/movie/5 จะได้ id = "5"
  const navigate = useNavigate();
  
  const [allMedia, setAllMedia] = useState<Media[]>([]); // เก็บข้อมูลเรื่องทั้งหมด

  useEffect(() => { // โหลดข้อมูลจาก database + localStorage (ที่ admin เพิ่มมา)
    const adminMovies = localStorage.getItem('admin-movies');
    const parsedAdminMovies = adminMovies ? JSON.parse(adminMovies) : [];
    setAllMedia([...db, ...parsedAdminMovies]); // รวมข้อมูลทั้งสองแหล่ง
  }, []);

  const media = allMedia.find(item => item.id === Number(id)); // หาเรื่องที่ตรงกับ id
  
  const { addToMyList, removeFromMyList, isInMyList } = useMyList();
  const { isAuthenticated } = useAuth();

  const [scrolled, setScrolled] = useState(false); // เก็บสถานะว่า scroll หน้าจอแล้วยัง

  useEffect(() => { // ฟังก์ชันตรวจจับว่า scroll เกิน 50px ยัง เพื่อเปลี่ยน overlay ให้เข้มขึ้น
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll); // ตอนออกจากหน้านี้ ลบ listener ทิ้ง
  }, []);

  if (!media) { // ถ้าหาไม่เจอ แสดงข้อความ error
    return (
      <main className="flex-grow min-h-screen py-8 px-4 md:px-8">
        <h1 className="text-3xl font-bold text-gray-900">ไม่พบข้อมูล</h1>
      </main>
    );
  }

  const inList = isInMyList(media.id); // เช็คว่าเรื่องนี้อยู่ในรายการโปรดมั้ย

  const toggleMyList = () => { // ฟังก์ชันเพิ่ม/ลบจากรายการโปรด
    if (!isAuthenticated) { // ถ้ายังไม่ login
      const wantsToLogin = window.confirm(
        "คุณยังไม่ได้เข้าสู่ระบบ\nกรุณาเข้าสู่ระบบเพื่อเก็บรายการของฉัน\n\nกด 'ตกลง' เพื่อไปหน้าเข้าสู่ระบบ"
      );
      if (wantsToLogin) {
        navigate('/login');
      }
      return;
    }

    if (inList) { // ถ้ามีแล้วก็ลบ
      removeFromMyList(media.id);
    } else { // ถ้ายังไม่มีก็เพิ่ม
      addToMyList(media);
    }
  };

  return (
    <main className="flex-grow min-h-screen">
      
      <div className="relative w-full h-[56.25vw] max-h-[70vh] bg-black"> 
        {media.trailerUrl ? ( // ถ้ามี trailer URL ให้เล่น video
          <ReactPlayer
            url={media.trailerUrl}
            playing={true} // เล่นอัตโนมัติ
            muted={true} // ปิดเสียง
            loop={true} // วนซ้ำเรื่อยๆ
            width="100%"
            height="100%"
            className="absolute top-0 left-0"
          />
        ) : ( // ถ้าไม่มี trailer ให้แสดงรูปแทน
          <img 
            src={media.imageUrl} 
            alt={media.title} 
            className="w-full h-full object-cover" 
          />
        )}
        
        <div 
          className={`absolute inset-0 bg-gradient-to-t transition-opacity duration-500 ${
            scrolled 
              ? 'from-gray-900 via-gray-900/70 to-transparent opacity-100' // ตอน scroll แล้ว ให้ overlay เข้มขึ้น
              : 'from-gray-900/60 via-transparent to-transparent opacity-100' // ตอนยังไม่ scroll ให้โปร่งกว่า
          }`}
        ></div>
      </div>

      <div className="container mx-auto px-4 md:px-8 mt-8 relative z-10"> 
        
        <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg mb-4">
          {media.title}
        </h1>
        
        <div className="max-w-3xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex space-x-3">
              <button 
                className="bg-purple-600 text-white p-3 rounded-full hover:bg-purple-700 transition-colors shadow-md" 
                aria-label="Play"
              >
                <BsFillPlayFill className="w-6 h-6" />
              </button>
              
              <button 
                onClick={toggleMyList}
                className={`border-2 p-3 rounded-full transition-colors shadow-md ${
                  inList 
                    ? 'bg-yellow-400 border-yellow-500 text-white' // ถ้าอยู่ในรายการแล้ว ปุ่มเป็นสีเหลือง
                    : 'border-gray-400 text-gray-800 hover:bg-gray-50 hover:border-purple-500' // ถ้ายังไม่มี ปุ่มเป็นสีเทา
                }`}
                aria-label="Toggle My List"
              >
                {inList ? (
                   <BsCheckLg className="w-6 h-6" />
                ) : (
                   <BsPlusLg className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          <div className="text-lg text-white drop-shadow-md space-y-2 mb-4"> 
            <p className="font-medium">
              {media.rating} | {media.episodes}
            </p>
            <p className="text-base">{media.genres.join(', ')}</p> 
            <p className="text-base">สัญชาติ: {media.nationality}</p>
          </div>

          <div className="text-white bg-black/40 backdrop-blur-md p-6 rounded-xl border border-white/10 shadow-xl"> 
            <h2 className="text-lg leading-relaxed font-semibold mb-3">เรื่องย่อ</h2>
            <p className="text-gray-100 leading-relaxed">{media.description}</p>
          </div>
        </div>
      </div>

      <div className="h-20"></div> 
    </main>
  );
};

export default Detail;