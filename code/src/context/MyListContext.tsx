import React, { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Media } from '../types/types';
import { useAuth } from './AuthContext';    // เอาไว้ดึงข้อมูล user เพื่อรายการตาม user

interface MyListContextType {
  myList: Media[];
  addToMyList: (media: Media) => void;    // เพิ่มรายการ
  removeFromMyList: (id: number) => void; //เอารายการออก
  isInMyList: (id: number) => boolean;
}

const MyListContext = createContext<MyListContextType | undefined>(undefined);

export const MyListProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth(); // ดึง user มาใช้
  
  // ฟังก์ชันสำหรับ generate key ตาม user
  const getStorageKey = () => {
    if (!user) return 'my-list-guest';    // ถ้าไม่ login ใช้ key 'my-list-guest'
    return `my-list-${user.email}`;       // login แล้ว ใช้ key 'my-list-[email]'
  };

  // โหลดรายการจาก localStorage ตาม key
  const [myList, setMyList] = useState<Media[]>(() => {
    const storageKey = getStorageKey();
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [];    // ถ้าไม่มีเป็น array เปล่า
  });

  // เมื่อ user เปลี่ยน ให้โหลดข้อมูลของ user นั้นๆ
  useEffect(() => {
    const storageKey = getStorageKey();
    const saved = localStorage.getItem(storageKey);
    setMyList(saved ? JSON.parse(saved) : []);
  }, [user?.email]);

  // บันทึกลง localStorage เมื่อ myList เปลี่ยน
  useEffect(() => {
    const storageKey = getStorageKey();
    localStorage.setItem(storageKey, JSON.stringify(myList));
  }, [myList, user?.email]);

  // เพิ่มเข้ารายการ
  const addToMyList = (media: Media) => {
    setMyList((prev) => {
      if (prev.find((item) => item.id === media.id)) return prev; // ถ้ามีอยู่แล้ว → ไม่ทำอะไร
      return [...prev, media];                                    // ถ้าไม่มี → เพิ่มเข้าไป
    });
  };

  const removeFromMyList = (id: number) => {
    setMyList((prev) => prev.filter((item) => item.id !== id));
  };

  // เช็กว่าอยู่ในรายการมั้ย
  const isInMyList = (id: number) => {
    return myList.some((item) => item.id === id);
  };

  return (
    <MyListContext.Provider value={{ myList, addToMyList, removeFromMyList, isInMyList }}>
      {children}
    </MyListContext.Provider>
  );
};

export const useMyList = () => {
  const context = useContext(MyListContext);
  if (!context) throw new Error('useMyList must be used within a MyListProvider');
  return context;
};