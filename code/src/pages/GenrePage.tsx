import React, { useMemo, useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import db from '../data/database';
import type { Media, Genre, MediaType, Nationality } from '../types/types';
import Carousel from '../components/Carousel';

const formatGenreFromUrl = (genreParam: string = ""): Genre => { // แปลง URL เป็น Genre เช่น 'sci-fi' เป็น 'Sci-fi', 'crime-thriller' เป็น 'Crime Thriller'
  if (genreParam === 'sci-fi') {
    return 'Sci-fi'; // case พิเศษ sci-fi ต้องเขียนแบบนี้
  }

  return genreParam
    .split('-') // แยกคำ เช่น crime-thriller เป็น ['crime', 'thriller']
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // ทำให้ตัวแรกเป็นตัวใหญ่
    .join(' ') as Genre; // เชื่อมด้วยช่องว่าง เป็น 'Crime Thriller'
};

const movieGenres = ['Action', 'Drama', 'Comedy', 'Horror', 'Sci-fi']; // แนวหนังที่มี
const seriesGenres = ['Comedy', 'Crime Thriller', 'Drama', 'Fantasy', 'Sci-fi']; // แนวซีรีส์ที่มี

export const GenrePage: React.FC = () => {
  const { genre: genreParam } = useParams<{ genre: string }>(); // ดึง genre จาก URL เช่น /movies/action จะได้ genreParam = "action"
  const location = useLocation();
  const navigate = useNavigate(); 

  const [allMedia, setAllMedia] = useState<Media[]>([]); // เก็บข้อมูลทั้งหมด

  useEffect(() => { // โหลดข้อมูลจาก database + localStorage
    const adminMovies = localStorage.getItem('admin-movies');
    const parsedAdminMovies = adminMovies ? JSON.parse(adminMovies) : [];
    setAllMedia([...db, ...parsedAdminMovies]);
  }, []);

  const mediaType: MediaType | null = location.pathname.startsWith('/movies') // ดูจาก URL ว่าเป็น movies หรือ series
    ? 'movie' 
    : location.pathname.startsWith('/series') ? 'series' : null;

  const targetGenre = genreParam ? formatGenreFromUrl(genreParam) : undefined; // แปลง URL parameter เป็น Genre
  
  const availableGenres = mediaType === 'movie' ? movieGenres : seriesGenres; // เลือก genre list ที่เหมาะสมกับประเภท

  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => { // เมื่อเลือก genre ใหม่จาก dropdown
    const newPath = e.target.value;
    navigate(newPath); // ไปหน้าใหม่
  };

  const basePath = mediaType === 'movie' ? '/movies' : '/series'; // path หลัก
  const currentSelectValue = targetGenre 
    ? `${basePath}/${genreParam}`
    : basePath; // value ปัจจุบันของ dropdown

  const carouselsData = useMemo(() => { // สร้างข้อมูล carousel แยกตามสัญชาติ
    const genreFilteredMedia = allMedia.filter(item => { // filter ตาม type และ genre ก่อน
      const typeMatch = !mediaType || item.type === mediaType;
      const genreMatch = !targetGenre || item.genres.includes(targetGenre);
      return typeMatch && genreMatch;
    });

    const allNationalities: Nationality[] = [...new Set(allMedia.map(item => item.nationality))]; // หา nationality ทั้งหมดที่มี (ไม่ซ้ำ)

    const groupedByNationality: { [key in Nationality]?: Media[] } = {}; // จัดกลุ่มตามสัญชาติ
    for (const item of genreFilteredMedia) {
      if (!groupedByNationality[item.nationality]) {
        groupedByNationality[item.nationality] = [];
      }
      groupedByNationality[item.nationality]!.push(item);
    }

    const result = allNationalities // สร้าง array ของ {nationality, items[]}
      .map(nat => ({
        nationality: nat,
        items: groupedByNationality[nat] || []
      }))
      .filter(group => group.items.length > 0); // เอาเฉพาะสัญชาติที่มีข้อมูล

    return result;
  }, [allMedia, mediaType, targetGenre]); // คำนวณใหม่เมื่อ allMedia, mediaType หรือ targetGenre เปลี่ยน

  const title = targetGenre // สร้างชื่อหน้า
    ? `${targetGenre} ${mediaType === 'movie' ? 'Movies' : 'Series'}`
    : `All ${mediaType === 'movie' ? 'Movies' : 'Series'}`;

  return (
    <main className="flex-grow min-h-screen py-8">
      <div className="flex items-center justify-between mb-10 px-4 md:px-8">
        <h1 className="text-4xl font-bold text-purple-700">{title}</h1>
        
        {mediaType && ( // ถ้ามี mediaType (movie/series) ให้แสดง dropdown
          <div className="flex space-x-4">
            <select 
              value={currentSelectValue}
              onChange={handleGenreChange}
              className="bg-purple-600 text-white p-2 rounded border border-purple-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value={basePath}>แนว (ทั้งหมด)</option> 
              
              {availableGenres.map(genre => { // สร้าง option สำหรับแต่ละ genre
                const genrePath = `${basePath}/${genre.toLowerCase().replace(' ', '-')}`; // แปลง genre เป็น URL format
                return (
                  <option 
                    key={genre} 
                    value={genrePath}
                  >
                    {genre}
                  </option>
                );
              })}
            </select>
          </div>
        )}
      </div>

      <div className="flex flex-col">
        {carouselsData.length > 0 ? ( // ถ้ามีข้อมูล แสดง carousel แต่ละสัญชาติ
          carouselsData.map(carousel => (
            <Carousel
              key={carousel.nationality}
              title={carousel.nationality}
              items={carousel.items}
            />
          ))
        ) : ( // ถ้าไม่มีข้อมูล แสดงข้อความ
          <div className="text-center py-20">
            <p className="text-gray-600 text-xl mb-2">ไม่พบรายการที่ตรงกัน</p>
            <p className="text-gray-500 text-sm">ลองเลือกหมวดหมู่อื่นดูนะ</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default GenrePage;