export type MediaType = 'movie' | 'series';// ประเภทของสื่อว่ามีแบบไหนบ้าง (หนัง หรือ ซีรีส์)

export type Genre = // หมวดหมู่ของหนัง/ซีรีส์ ใช้แบบ union type เพื่อให้เลือกได้เฉพาะที่กำหนดไว้
  | 'Action'        // แอ็คชั่น
  | 'Drama'         // ดราม่า
  | 'Comedy'        // ตลก
  | 'Horror'        // สยองขวัญ
  | 'Sci-fi'        // ไซไฟ
  | 'Crime Thriller' // อาชญากรรม/ลุ้นระทึก
  | 'Fantasy';      // แฟนตาซี

// สัญชาติของสื่อ เช่น เกาหลี ญี่ปุ่น อเมริกา
export type Nationality = 
  | 'Korean' 
  | 'Japanese' 
  | 'USA' 
  | 'Sweden' 
  | 'UK' 
  | 'Germany' 
  | 'Canada' 
  | 'Spain';

// โครงสร้างข้อมูลหลักของสื่อแต่ละเรื่อง
export interface Media {
  id: number;            // id ของเรื่อง ใช้เป็น primary key
  imageUrl: string;      // ลิงก์รูปโปสเตอร์หรือภาพปก
  title: string;         // ชื่อเรื่อง
  rating: string;        // เรตติ้ง เช่น 13+,18+,G
  episodes: string;      // จำนวนตอน (เก็บเป็น string เผื่อมีแบบ "12 ตอน + SP")
  type: MediaType;       // ประเภท (movie / series)
  genres: Genre[];       // ประเภทหนังแบบหลายค่า เช่น ['Action', 'Sci-fi']
  nationality: Nationality; // ประเทศที่ผลิต
  trailerUrl?: string;   // ลิงก์ตัวอย่างหนัง (optional)
  description: string;   // คำอธิบายหรือเรื่องย่อ
};
