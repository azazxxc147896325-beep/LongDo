// บอก tsx ว่า เมื่อมีการอ้างถึง 'react-player' ให้เข้ามาดูใน { ... }
declare module 'react-player' {
  import { Component } from 'react';
  
  export interface ReactPlayerProps {
    url?: string; // ลิงก์ video
    playing?: boolean; // ปุ่มเล่น video
    loop?: boolean; // การวนซ้ำ
    controls?: boolean; // ปุ่ม control ทุกอย่างที่ user สามารถ control เองได้
    muted?: boolean; // ปิดเสียง
    width?: string | number; // ความกว้างของ video
    height?: string | number; // ความสูงของ video
    style?: React.CSSProperties;
    [key: string]: any; // สามารถใส่อะไรเพิ่มก็ได้ เช่น className
  }
  
  export default class ReactPlayer extends Component<ReactPlayerProps> {}
}