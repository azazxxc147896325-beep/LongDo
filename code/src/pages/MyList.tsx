import React from 'react';
import { Link } from 'react-router-dom';
import { useMyList } from '../context/MyListContext';
import Poster from '../components/Poster';
import { useAuth } from '../context/AuthContext';

const MyList: React.FC = () => {
  let myList: any[] = [];
  let isAuthenticated = false;
  let error = null;

  // ป้องกัน error เมื่อ Context ไม่ได้ wrap ใน Provider
  try {
    const myListContext = useMyList();
    const authContext = useAuth();
    
    myList = myListContext?.myList || [];
    isAuthenticated = authContext?.isAuthenticated || false;

    console.log('=== MyList Debug ===');
    console.log('isAuthenticated:', isAuthenticated);
    console.log('myList:', myList);
    console.log('myList length:', myList.length);
  } catch (e: any) {    // ถ้า error แสดงข้อความบอก user
    error = e.message;
    console.error('Error in MyList:', e);
  }

  // แสดง error ถ้ามี
  if (error) {
    return (
      <main className="flex-grow bg-white min-h-screen py-8 px-4 md:px-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> {error}
          <p className="mt-2">ตรวจสอบว่า App.tsx มี AuthProvider และ MyListProvider หรือไม่</p>
        </div>
      </main>
    );
  }

  // กรณียังไม่ได้ login
  if (!isAuthenticated) {
    return (
      // แสดงข้อความ
      <main className="flex-grow bg-white min-h-screen py-8 px-4 md:px-8 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">รายการของฉัน</h1>
        <div className="text-center text-gray-600">
          <p className="text-xl mb-6">กรุณาเข้าสู่ระบบเพื่อดูรายการของคุณ</p>
          {/* ส่งปุ่ม login ไป */}
          <Link 
            to="/login" 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-md"
          >
            เข้าสู่ระบบ
          </Link>
        </div>
      </main>
    );
  }
  // กรณี login แล้ว
  return (
    // กรณีมีรายการแล้ว
    <main className="flex-grow bg-white min-h-screen py-8 px-4 md:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        รายการของฉัน ({myList.length})
      </h1>
      
      {/* กรณียังไม่มีรายการ */}
      {myList.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {myList.map((media) => (
            <div key={media.id} className="w-full h-full" style={{ minHeight: '250px' }}>
               <Poster media={media}/>
            </div>
          ))}
        </div>
      ) : (
        // แสดงข้อความ
        <div className="flex flex-col items-center justify-center h-64 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
          <p className="text-xl font-medium">ยังไม่มีรายการในลิสต์</p>
          <p className="text-sm mt-2 text-gray-400">กดปุ่ม + ที่หนังที่คุณชอบเพื่อเก็บไว้ที่นี่</p>
          {/* Link ไปยังหน้าแรก */}
          <Link to="/" className="mt-6 text-purple-600 hover:text-purple-800 hover:underline font-medium">
            ไปเลือกหนังที่หน้าหลัก
          </Link>
        </div>
      )}
    </main>
  );
};

export default MyList;