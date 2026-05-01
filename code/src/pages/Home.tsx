import React, { useMemo, useState, useEffect } from 'react';
import db from '../data/database';
import type { Media, MediaType, Genre } from '../types/types';
import Carousel from '../components/Carousel';

const getMedia = ( // ฟังก์ชัน filter ข้อมูล media ตามเงื่อนไขต่างๆ
  allMedia: Media[],
  type?: MediaType,
  genre?: Genre,
  excludeId?: number
): Media[] => {
  let filtered = allMedia;
  
  if (type) { // ถ้าระบุ type (movie/series) มา ก็ filter ตาม type
    filtered = filtered.filter(item => item.type === type);
  }
  if (genre) { // ถ้าระบุ genre มา ก็ filter เฉพาะที่มี genre นั้น
    filtered = filtered.filter(item => item.genres.includes(genre));
  }
  if (excludeId) { // ถ้าระบุ id ที่ไม่เอามา ก็ filter id นั้นออก
    filtered = filtered.filter(item => item.id !== excludeId);
  }
  return filtered;
};

const shuffleArray = (array: Media[]): Media[] => { // ฟังก์ชันสลับตำแหน่งสมาชิกใน array แบบสุ่ม ใช้ Fisher-Yates algorithm
  const newArray = [...array]; // copy array เพื่อไม่ให้แก้ไข original
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // สุ่มตำแหน่ง j ระหว่าง 0 ถึง i
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]]; // สลับ i กับ j
  }
  return newArray;
};

const Home: React.FC = () => {
  const [allMedia, setAllMedia] = useState<Media[]>([]); // เก็บข้อมูลทั้งหมด

  useEffect(() => { // โหลดข้อมูลจาก database + localStorage (ที่ admin เพิ่มมา)
    const adminMovies = localStorage.getItem('admin-movies');
    const parsedAdminMovies = adminMovies ? JSON.parse(adminMovies) : [];
    setAllMedia([...db, ...parsedAdminMovies]); // รวมข้อมูลทั้งสองแหล่ง
  }, []);

  const recommendedItems = useMemo(() => { // สุ่มข้อมูลแล้วเอา 20 รายการแรก เป็นรายการแนะนำ
    return shuffleArray(allMedia).slice(0, 20);
  }, [allMedia]); // คำนวณใหม่เมื่อ allMedia เปลี่ยน

  // สร้างรายการสำหรับแต่ละหมวด ใช้ useMemo เพื่อไม่ให้คำนวณซ้ำทุกครั้งที่ render
  const actionMovies = useMemo(() => getMedia(allMedia, 'movie', 'Action'), [allMedia]); // หนัง action
  const comedyMovies = useMemo(() => getMedia(allMedia, 'movie', 'Comedy'), [allMedia]); // หนังตลก
  const dramaMovies = useMemo(() => getMedia(allMedia, 'movie', 'Drama'), [allMedia]); // หนังดราม่า
  const horrorMovies = useMemo(() => getMedia(allMedia, 'movie', 'Horror'), [allMedia]); // หนังสยองขวัญ
  const sciFiMovies = useMemo(() => getMedia(allMedia, 'movie', 'Sci-fi'), [allMedia]); // หนังไซไฟ
  
  const fantasySeries = useMemo(() => getMedia(allMedia, 'series', 'Fantasy'), [allMedia]); // ซีรีส์แฟนตาซี
  const sciFiSeries = useMemo(() => getMedia(allMedia, 'series', 'Sci-fi'), [allMedia]); // ซีรีส์ไซไฟ
  const comedySeries = useMemo(() => getMedia(allMedia, 'series', 'Comedy'), [allMedia]); // ซีรีส์ตลก
  const crimeThrillerSeries = useMemo(() => getMedia(allMedia, 'series', 'Crime Thriller'), [allMedia]); // ซีรีส์อาชญากรรม
  const dramaSeries = useMemo(() => getMedia(allMedia, 'series', 'Drama'), [allMedia]); // ซีรีส์ดราม่า

  return (
    <main className="flex-grow min-h-screen py-8">
      
      <section id="home">
         <Carousel 
          items={recommendedItems}
          title="รายการแนะนำ" // แสดงรายการที่สุ่มมา
        />
      </section>

      <section id="movies" className="pt-8"> 
        <Carousel 
          items={actionMovies} 
          title="ภาพยนตร์แอคชั่น"
        />
        <Carousel 
          items={comedyMovies} 
          title="ภาพยนตร์ตลก"
        />
        <Carousel 
          items={dramaMovies} 
          title="ภาพยนตร์ดราม่า"
        />
        <Carousel 
          items={horrorMovies} 
          title="ภาพยนตร์สยองขวัญ"
        />
        <Carousel 
          items={sciFiMovies} 
          title="ภาพยนตร์ไซไฟ"
        />
      </section>
      
      <section id="series" className="pt-8">
        <Carousel 
          items={fantasySeries} 
          title="ซีรีส์แฟนตาซี"
        />
        <Carousel 
          items={sciFiSeries} 
          title="ซีรีส์ Sci-Fi"
        />
        <Carousel 
          items={comedySeries} 
          title="ซีรีส์ตลก"
        />
        <Carousel 
          items={crimeThrillerSeries} 
          title="ซีรีส์อาชญากรรม-ระทึกขวัญ"
        />
        <Carousel 
          items={dramaSeries} 
          title="ซีรีส์ดราม่า"
        />
      </section>

    </main>
  );
};

export default Home;