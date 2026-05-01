import React, { useState } from "react";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});  // เก็บ error แยกตามฟิลด์
  const [showPassword, setShowPassword] = useState(false);  // ควบคุมการซ่อน, แสดงรหัสผ่าน

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (event: React.MouseEvent) => {
  event.preventDefault();

  const newErrors: { email?: string; password?: string } = {};
  if (!email) newErrors.email = 'กรุณากรอกอีเมล';
  if (!password) newErrors.password = 'กรุณากรอกรหัสผ่าน';
  setErrors(newErrors);

  if (Object.keys(newErrors).length === 0) {
    // ดึง users ทั้งหมดออกมาเช็ค
    const existingUsers = JSON.parse(localStorage.getItem('longdo-users') || '[]');

    const matchedUser = existingUsers.find(
      (u: { email: string; password: string }) =>
        u.email === email && u.password === password
    );

    if (!matchedUser) {
      setErrors({ password: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
      return;
    }

    login(email);  // บันทึก session ลง localStorage ผ่าน AuthContext
    alert('เข้าสู่ระบบสำเร็จ!');
    navigate('/');
  }
};

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-gradient-to-br from-purple-100 via-yellow-50 to-purple-50 px-4">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-md border-2 border-purple-200">
        <h2 className="text-3xl font-bold text-left mb-2 bg-gradient-to-r from-purple-600 to-yellow-500 bg-clip-text text-transparent">
          เข้าสู่ระบบ
        </h2>
        <p className="text-gray-600 text-sm mb-6">ยินดีต้อนรับกลับมา!</p>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              อีเมล
            </label>
            <input
              className={`w-full transition-all duration-200 hover:shadow-md bg-purple-50 border rounded-lg px-4 py-3 placeholder-gray-400 text-black focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.email
                  ? "border-red-500 ring-1 ring-red-500"
                  : "border-purple-300"
              }`}
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);     // อัพเดทค่า
                if (errors.email)
                  setErrors((prev) => ({ ...prev, email: undefined }));
              }}
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              รหัสผ่าน
            </label>
            <div className="relative">
              <input
                className={`w-full pr-10 transition-all duration-200 hover:shadow-md bg-purple-50 border rounded-lg px-4 py-3 placeholder-gray-400 text-black focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.password
                    ? "border-red-500 ring-1 ring-red-500"
                    : "border-purple-300"
                }`}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);      // อัพเดทค่า
                  if (errors.password)
                    setErrors((prev) => ({ ...prev, password: undefined }));
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-purple-500 hover:text-purple-700 focus:outline-none bg-transparent border-none"
              >
                {showPassword ? (
                  <BsEyeSlash size={20} />
                ) : (
                  <BsEye size={20} />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">{errors.password}</p>
            )}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="mt-6 w-full bg-gradient-to-r from-purple-500 to-yellow-400 text-white py-3 rounded-lg hover:from-purple-600 hover:to-yellow-500 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
        >
          เข้าสู่ระบบ
        </button>

        {/* Link ไปที่ register */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            ยังไม่มีบัญชี?{" "}
            <Link
              to="/register"
              className="text-purple-600 hover:text-purple-700 font-semibold bg-transparent border-none cursor-pointer underline"
            >
              สมัครสมาชิก
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;