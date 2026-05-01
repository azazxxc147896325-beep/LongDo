import React, { useRef, useState, useEffect } from 'react';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import Poster from './Poster';
import type { Media } from '../types/types';

interface CarouselProps {
  items: Media[]; 
  title?: string;
}

const Carousel: React.FC<CarouselProps> = ({ items, title }) => { // เก็บ reference ของ container ที่ใช้เลื่อนแนวนอน
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);// ไว้เช็คว่าปุ่มซ้าย/ขวาควรขึ้นไหม
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => { // ฟังก์ชันเช็คสถานะการเลื่อนของ container
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0); // ถ้า scrollLeft > 0 แปลว่าเลื่อนมาจากซ้ายแล้ว → ให้ปุ่มซ้ายโผล่
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5); // ถ้ายังเลื่อนไปไม่สุด → ให้ปุ่มขวาโผล่
    }
  };

  useEffect(() => { // เช็คตอนเริ่ม + ตอนหน้าจอ resize
    checkScroll();
    const handleResize = () => checkScroll();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [items]);

  const scroll = (direction: 'left' | 'right') => { // ฟังก์ชันเลื่อนซ้าย/ขวา แบบ smooth
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.7;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(checkScroll, 300); // หน่วงนิดนึงก่อนเช็คใหม่ ให้ scroll เสร็จก่อน
    }
  };

  return (
    <div className="mb-8 relative group">
      {title && (
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-purple-700 mb-2 px-4 md:px-8">
          {title}
        </h2>
      )}
      
      <div className="relative">
        {/* ปุ่มเลื่อนซ้าย */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className={`
              absolute left-0 top-0 bottom-0 z-50
              bg-gradient-to-r from-purple-500/80 to-purple-600/80 hover:from-purple-600/90 hover:to-purple-700/90 text-white 
              px-2 md:px-4 transition-all duration-300 
              flex items-center justify-center
              opacity-0 group-hover:opacity-100
              h-full
            `}
            aria-label="Scroll left"
          >
            <BsChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
          </button>
        )}
        
        <div
          ref={scrollRef} // กล่องเลื่อนแนวนอน
          onScroll={checkScroll}
          className="flex gap-4 overflow-x-auto overflow-y-visible scrollbar-hide px-4 md:px-8 scroll-smooth py-16"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map((item) => (
            <div
              key={item.id}
              className="flex-shrink-0 w-[45%] sm:w-[30%] md:w-[23%] lg:w-[18%] xl:w-[15%]"
              style={{ minHeight: '350px' }} 
            >
              {/* ส่ง item เข้า Poster */}
              <Poster media={item}/>  
            </div>
          ))}
        </div>

        {/* ปุ่มเลื่อนขวา */}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className={`
              absolute right-0 top-0 bottom-0 z-50
              bg-gradient-to-l from-yellow-400/80 to-yellow-500/80 hover:from-yellow-500/90 hover:to-yellow-600/90 text-white 
              px-2 md:px-4 transition-all duration-300 
              flex items-center justify-center
              opacity-0 group-hover:opacity-100
              h-full
            `}
            aria-label="Scroll right"
          >
            <BsChevronRight className="w-6 h-6 md:w-8 md:h-8" />
          </button>
        )}
      </div>
      
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default Carousel;