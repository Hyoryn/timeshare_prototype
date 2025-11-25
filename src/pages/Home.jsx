import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMode } from '../context/ModeContext';
import { posts, categories } from '../data/posts';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import PostCard from '../components/PostCard';

const Home = () => {
  const { currentUser, isSeniorMode, switchMode, mode } = useMode();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('전체');
  const [searchKeyword, setSearchKeyword] = useState('');

  const regions = ['전체', '서울 강남구', '서울 마포구', '서울 송파구', '서울 종로구'];

  // 필터링된 게시글
  const filteredPosts = posts.filter(post => {
    const matchCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchRegion = selectedRegion === '전체' || post.region === selectedRegion;
    const matchSearch = searchKeyword === '' ||
      post.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      post.description.toLowerCase().includes(searchKeyword.toLowerCase());
    return matchCategory && matchRegion && matchSearch;
  });

  if (!currentUser) return null;

  const timeProgress = (currentUser.ownedTime / 50) * 100;

  return (
    <div className={`min-h-screen pb-24 ${isSeniorMode ? 'youth-mode' : 'senior-mode'}`}>
      {/* 헤더 */}
      <header className="bg-ui-card border-b border-ui-border sticky top-0 z-50">
        <div className={`max-w-screen-xl mx-auto px-4 ${isSeniorMode ? 'py-5' : 'py-4'}`}>
          <div className="flex items-center justify-between mb-3">
            <h1 className={`font-bold text-primary-main ${isSeniorMode ? 'text-3xl' : 'text-2xl'}`}>
              TimeShare
            </h1>
            <div className="flex items-center gap-3">
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className={`${isSeniorMode ? 'px-4 py-3 text-lg' : 'px-3 py-2 text-sm'} border border-ui-border rounded-lg bg-ui-card`}
              >
                {regions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
              <button
                onClick={() => navigate('/notifications')}
                className={`relative ${isSeniorMode ? 'p-3 text-2xl' : 'p-2 text-xl'}`}
              >
                🔔
                <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <button
                onClick={() => switchMode(mode === 'youth' ? 'senior' : 'youth')}
                className={`${isSeniorMode ? 'px-4 py-3 text-base' : 'px-3 py-2 text-sm'} bg-primary-cream text-primary-main rounded-lg hover:bg-primary-light transition-colors font-medium`}
              >
                {mode === 'youth' ? '시니어' : '청년'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-screen-xl mx-auto px-4 py-6">
        {/* 사용자 타임 정보 카드 */}
        <Card className={isSeniorMode ? 'mb-6' : 'mb-4'}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className={`font-bold mb-1 ${isSeniorMode ? 'text-2xl' : 'text-xl'}`}>
                내 타임
              </h2>
              <p className={`text-primary-main font-bold ${isSeniorMode ? 'text-3xl' : 'text-2xl'}`}>
                {currentUser.ownedTime} 타임
              </p>
            </div>
            <div className="text-right">
              <p className={`text-ui-textSecondary ${isSeniorMode ? 'text-lg' : 'text-sm'} mb-1`}>
                오늘 사용 가능
              </p>
              <p className={`font-bold ${isSeniorMode ? 'text-2xl' : 'text-xl'}`}>
                {currentUser.todayLimit - currentUser.todayUsed} / {currentUser.todayLimit} 시간
              </p>
            </div>
          </div>

          {/* 프로그레스 바 */}
          <div className="mb-3">
            <div className="flex justify-between mb-2">
              <span className={`${isSeniorMode ? 'text-base' : 'text-sm'} text-ui-textSecondary`}>
                타임 획득 진행률
              </span>
              <span className={`${isSeniorMode ? 'text-base' : 'text-sm'} text-ui-textSecondary`}>
                {timeProgress.toFixed(0)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-primary-main to-primary-accent h-full rounded-full transition-all duration-500"
                style={{ width: `${timeProgress}%` }}
              ></div>
            </div>
          </div>
        </Card>

        {/* 검색바 */}
        <div className={isSeniorMode ? 'mb-6' : 'mb-4'}>
          <input
            type="text"
            placeholder="무엇을 찾으시나요?"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className={`w-full ${isSeniorMode ? 'px-5 py-4 text-lg' : 'px-4 py-3 text-base'} border border-ui-border rounded-xl bg-ui-card focus:outline-none focus:border-primary-main transition-colors`}
          />
        </div>

        {/* 카테고리 탭 */}
        <div className={`flex gap-2 overflow-x-auto pb-3 ${isSeniorMode ? 'mb-6' : 'mb-4'}`}>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`${isSeniorMode ? 'px-5 py-3 text-base' : 'px-4 py-2 text-sm'} rounded-lg font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-primary-main text-white'
                  : 'bg-ui-card border border-ui-border text-ui-text hover:bg-primary-cream'
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        {/* 게시글 리스트 */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`font-bold ${isSeniorMode ? 'text-2xl' : 'text-xl'}`}>
              {selectedCategory === 'all' ? '전체 게시글' : categories.find(c => c.id === selectedCategory)?.name}
            </h2>
            <span className={`text-ui-textSecondary ${isSeniorMode ? 'text-lg' : 'text-sm'}`}>
              {filteredPosts.length}개
            </span>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="text-center py-20">
              <p className={`text-ui-textSecondary ${isSeniorMode ? 'text-xl' : 'text-base'}`}>
                게시글이 없습니다
              </p>
            </div>
          ) : (
            <div>
              {filteredPosts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 하단 네비게이션 */}
      <nav className="fixed bottom-0 left-0 right-0 bg-ui-card border-t border-ui-border z-50">
        <div className="max-w-screen-xl mx-auto px-4 py-3">
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => navigate('/')}
              className={`flex flex-col items-center justify-center ${isSeniorMode ? 'py-3' : 'py-2'} text-primary-main`}
            >
              <span className={isSeniorMode ? 'text-2xl mb-1' : 'text-xl mb-1'}>🏠</span>
              <span className={`${isSeniorMode ? 'text-base' : 'text-xs'} font-medium`}>홈</span>
            </button>
            <button
              onClick={() => navigate('/create')}
              className={`flex flex-col items-center justify-center ${isSeniorMode ? 'py-3' : 'py-2'} text-ui-textSecondary hover:text-primary-main`}
            >
              <span className={isSeniorMode ? 'text-2xl mb-1' : 'text-xl mb-1'}>✏️</span>
              <span className={`${isSeniorMode ? 'text-base' : 'text-xs'} font-medium`}>작성</span>
            </button>
            <button
              onClick={() => navigate('/matching')}
              className={`flex flex-col items-center justify-center ${isSeniorMode ? 'py-3' : 'py-2'} text-ui-textSecondary hover:text-primary-main`}
            >
              <span className={isSeniorMode ? 'text-2xl mb-1' : 'text-xl mb-1'}>💬</span>
              <span className={`${isSeniorMode ? 'text-base' : 'text-xs'} font-medium`}>매칭</span>
            </button>
            <button
              onClick={() => navigate('/mypage')}
              className={`flex flex-col items-center justify-center ${isSeniorMode ? 'py-3' : 'py-2'} text-ui-textSecondary hover:text-primary-main`}
            >
              <span className={isSeniorMode ? 'text-2xl mb-1' : 'text-xl mb-1'}>👤</span>
              <span className={`${isSeniorMode ? 'text-base' : 'text-xs'} font-medium`}>MY</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Home;
