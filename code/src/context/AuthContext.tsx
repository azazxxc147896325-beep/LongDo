import React, { createContext, useState, useContext } from 'react';
import type { ReactNode } from 'react';

interface User {    // เก็บข้อมูล user ที่ login แล้ว
  email: string;
  isAdmin: boolean;
}

interface AuthContextType {       // กำหนดโครงสร้างข้อมูลที่จะ share ให้ทั้ง web
  user: User | null;              // ข้อมูล user (login แล้ว) null (ยังไม่ได้ login)
  login: (email: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAILS = [        // email Admin ของระบบ
  'admin@longdo.com',
  'nd.natthawutbenz@gmail.com',
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('longdo-user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (email: string) => {
    const isAdmin = ADMIN_EMAILS.includes(email.toLowerCase());   // กันไว้ไม่ให้เกิด sensitive-case
    
    const newUser = {    // เช็คว่า email นี้อยู่ใน ADMIN_EMAILS มั้ย
      email,
      isAdmin
    };
    
    setUser(newUser);   // เก็บ newUser ลงใน State
    localStorage.setItem('longdo-user', JSON.stringify(newUser));   // เก็บ newUser ลงใน localStorage
    
    if (isAdmin) {
      console.log('🔐 Admin logged in:', email);
    }
  };

  const logout = () => {     // เมื่อ logout จะ reset ทุกอย่างเป็น null
    setUser(null);
    localStorage.removeItem('longdo-user');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAuthenticated: !!user,        // แปลง user เป็น boolean
      isAdmin: user?.isAdmin || false
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};