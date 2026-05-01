import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

interface Movie { // interface เอาไว้กำหนดรูปแบบข้อมูลของ Movie
  id: number;
  title: string;
  imageUrl: string;
  rating: string;
  genres: string[];
  type: 'movie' | 'series';
  episodes: string;
  trailerUrl?: string;
  nationality: string;
  description: string;
}

const AdminDashboard: React.FC = () => {
  const { isAdmin, isAuthenticated } = useAuth();
  const [movies, setMovies] = useState<Movie[]>(() => { // state เอาไว้เก็บรายการหนังที่โหลดมาจาก localStorage
    const saved = localStorage.getItem('admin-movies');
    return saved ? JSON.parse(saved) : [];
  });

  const [formData, setFormData] = useState({ // state เอาไว้เก็บข้อมูลในฟอร์มเวลาจะเพิ่มหนังใหม่
    title: '',
    imageUrl: '',
    rating: '13+',
    genres: [] as string[],
    type: 'movie' as 'movie' | 'series',
    episodes: '',
    trailerUrl: '',
    nationality: 'USA' as string,
    description: ''
  });

  // รายการ Genre ตาม types.ts
  const availableGenres = ['Action', 'Drama', 'Comedy', 'Horror', 'Sci-fi', 'Crime Thriller', 'Fantasy'];
  const availableNationalities = ['Korean', 'Thai', 'British', 'Japanese', 'USA', 'Sweden', 'UK', 'Germany', 'Canada', 'Spain'];

  // ถ้าไม่ได้ login หรือไม่ใช่ admin ให้ redirect
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!isAdmin) {
    return (
      <main className="flex-grow bg-white min-h-screen py-8 px-4 md:px-8 flex flex-col items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
          <h2 className="text-2xl font-bold mb-2">🚫 ไม่มีสิทธิ์เข้าถึง</h2>
          <p>คุณไม่ใช่ Admin ไม่สามารถเข้าถึงหน้านี้ได้</p>
        </div>
      </main>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate ว่าเลือก genre อย่างน้อย 1 อัน
    if (formData.genres.length === 0) {
      alert('กรุณาเลือกหมวดหมู่อย่างน้อย 1 หมวด');
      return;
    }

    // Validate episodes
    if (!formData.episodes.trim()) {
      alert(formData.type === 'movie' ? 'กรุณาระบุระยะเวลาของหนัง' : 'กรุณาระบุจำนวนตอนหรือซีซั่น');
      return;
    }
    
    const newMovie: Movie = {
      id: Date.now(),
      title: formData.title,
      imageUrl: formData.imageUrl,
      rating: formData.rating,
      genres: formData.genres,
      type: formData.type,
      episodes: formData.episodes,
      trailerUrl: formData.trailerUrl || undefined,
      nationality: formData.nationality,
      description: formData.description
    };

    const updatedMovies = [...movies, newMovie];
    setMovies(updatedMovies);
    localStorage.setItem('admin-movies', JSON.stringify(updatedMovies));

    // ส่ง event เพื่อบอกหน้าอื่นว่ามีการอัพเดทข้อมูล
    window.dispatchEvent(new Event('storage'));

    // Reset form
    setFormData({
      title: '',
      imageUrl: '',
      rating: '13+',
      genres: [],
      type: 'movie',
      episodes: '',
      trailerUrl: '',
      nationality: 'USA',
      description: ''
    });

    alert('เพิ่มภาพยนตร์สำเร็จ! ✅\n\nภาพยนตร์จะแสดงบนหน้าหลักทันที');
  };

  const handleDelete = (id: number) => {
    if (confirm('คุณแน่ใจหรือไม่ที่จะลบรายการนี้?')) {
      const updatedMovies = movies.filter(m => m.id !== id);
      setMovies(updatedMovies);
      localStorage.setItem('admin-movies', JSON.stringify(updatedMovies));
      
      // ส่ง event เพื่อบอกหน้าอื่นว่ามีการอัพเดทข้อมูล
      window.dispatchEvent(new Event('storage'));
    }
  };

  return (
    <main className="flex-grow min-h-screen py-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-purple-600 text-white p-6 rounded-lg mb-8 shadow-lg">
          <h1 className="text-3xl font-bold mb-2">🎬 Admin Dashboard</h1>
          <p className="text-purple-100">จัดการภาพยนตร์และซีรีส์</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Form เพิ่มภาพยนตร์ */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">เพิ่มภาพยนตร์ใหม่</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ชื่อเรื่อง *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL รูปภาพ *
                </label>
                <input
                  type="url"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  เรทผู้ชม *
                </label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={formData.rating}
                  onChange={(e) => setFormData({...formData, rating: e.target.value})}
                >
                  <option value="ทุกเพศทุกวัย">ทุกเพศทุกวัย</option>
                  <option value="7+">7+</option>
                  <option value="13+">13+</option>
                  <option value="16+">16+</option>
                  <option value="18+">18+</option>
                  <option value="20+">20+</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ประเภท *
                </label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value as 'movie' | 'series', episodes: ''})}
                >
                  <option value="movie">ภาพยนตร์</option>
                  <option value="series">ซีรีส์</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  สัญชาติ *
                </label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={formData.nationality}
                  onChange={(e) => setFormData({...formData, nationality: e.target.value})} // อัพเดต nationality

                >
                  {availableNationalities.map((nat) => (
                    <option key={nat} value={nat}>{nat}</option>
                  ))}
                </select>
              </div>
                {/* กรอกระยะเวลา / จำนวนตอน */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {formData.type === 'movie' ? 'ระยะเวลา *' : 'จำนวนตอน/ซีซั่น *'}
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder={formData.type === 'movie' ? 'เช่น 124 min, 2 ชม. 15 นาที' : 'เช่น 4 Seasons, 16 ตอน'}
                  value={formData.episodes}
                  onChange={(e) => setFormData({...formData, episodes: e.target.value})} // อัพเดต episodes
                /> 
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  หมวดหมู่ * (เลือกได้มากกว่า 1)
                </label>
                <div className="grid grid-cols-2 gap-2 p-3 border border-gray-300 rounded-lg bg-gray-50">
                  {availableGenres.map((genre) => (
                    <label key={genre} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded">
                      <input
                        type="checkbox"
                        checked={formData.genres.includes(genre)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({...formData, genres: [...formData.genres, genre]});
                          } else {
                            setFormData({...formData, genres: formData.genres.filter(g => g !== genre)});
                          }
                        }}
                        className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-700">{genre}</span>
                    </label>
                  ))}
                </div>
                {formData.genres.length > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    เลือกแล้ว: {formData.genres.join(', ')}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL Trailer (ถ้ามี)
                </label>
                <input
                  type="url"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="https://youtube.com/..."
                  value={formData.trailerUrl}
                  onChange={(e) => setFormData({...formData, trailerUrl: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  เรื่องย่อ *
                </label>
                <textarea
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  placeholder="เขียนเรื่องย่อของภาพยนตร์หรือซีรีส์..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
                {/* ปุ่มเพิ่มหนัง */}
              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-all font-semibold shadow-md"
              >
                ✨ เพิ่มภาพยนตร์
              </button>
            </form>
          </div>

          {/* รายการภาพยนตร์ */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              รายการทั้งหมด ({movies.length})
            </h2>
            
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {/* เช็คว่ามีรายการมั้ย */}
              {movies.length === 0 ? (
                <p className="text-gray-500 text-center py-8">ยังไม่มีภาพยนตร์</p>
              ) : (
                movies.map((movie) => (
                  <div key={movie.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <img 
                      src={movie.imageUrl} 
                      alt={movie.title}
                      className="w-16 h-24 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{movie.title}</h3>
                      <p className="text-sm text-gray-600">
                        {movie.type === 'series' ? 'ซีรีส์' : 'ภาพยนตร์'} • 
                        🔞 {movie.rating} • 
                        🌍 {movie.nationality}
                      </p>
                      <p className="text-xs text-gray-500">{movie.genres.join(', ')}</p>
                      <p className="text-xs text-gray-500">
                        {movie.type === 'movie' ? '⏱️' : '📺'} {movie.episodes}
                      </p>
                    </div>
                    {/* ปุ่มลบหนัง */}
                    <button
                      onClick={() => handleDelete(movie.id)}
                      className="text-red-600 hover:text-red-800 px-3"
                    >
                      🗑️
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AdminDashboard;