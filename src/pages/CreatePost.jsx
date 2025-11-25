import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMode } from '../context/ModeContext';
import Header from '../components/common/Header';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { categories } from '../data/posts';

const CreatePost = () => {
  const { currentUser, isSeniorMode } = useMode();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    type: 'provide',
    category: '교육',
    title: '',
    description: '',
    requiredTime: 2,
    availableTimes: [],
    region: currentUser?.region || '서울 강남구',
    tags: [],
  });

  const timeSlots = ['오전', '오후', '저녁', '주말'];
  const regions = ['서울 강남구', '서울 마포구', '서울 송파구', '서울 종로구'];

  const handleSubmit = (e) => {
    e.preventDefault();

    // 재능 인증 확인
    if (!currentUser.isTalentVerified) {
      alert('게시글 작성을 위해서는 재능 인증이 필요합니다. 마이페이지에서 인증을 완료해주세요.');
      navigate('/mypage');
      return;
    }

    if (formData.title.length < 5) {
      alert('제목을 5자 이상 입력해주세요.');
      return;
    }

    if (formData.description.length < 10) {
      alert('상세 설명을 10자 이상 입력해주세요.');
      return;
    }

    if (formData.availableTimes.length === 0) {
      alert('가능한 시간대를 최소 1개 이상 선택해주세요.');
      return;
    }

    // 게시글 생성 성공
    alert('게시글이 작성되었습니다!');
    navigate('/');
  };

  const handleTimeToggle = (time) => {
    setFormData(prev => ({
      ...prev,
      availableTimes: prev.availableTimes.includes(time)
        ? prev.availableTimes.filter(t => t !== time)
        : [...prev.availableTimes, time]
    }));
  };

  return (
    <div className={`min-h-screen pb-24 ${isSeniorMode ? 'senior-mode' : 'youth-mode'}`}>
      <Header title="게시글 작성" showBack />

      <div className="max-w-screen-xl mx-auto px-4 py-6">
        <form onSubmit={handleSubmit}>
          {/* 제공/요청 선택 */}
          <Card className={isSeniorMode ? 'mb-6' : 'mb-4'}>
            <h2 className={`font-bold mb-3 ${isSeniorMode ? 'text-xl' : 'text-lg'}`}>
              타입 선택
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, type: 'provide' }))}
                className={`${isSeniorMode ? 'py-4 text-lg' : 'py-3 text-base'} rounded-lg border-2 font-medium transition-all ${
                  formData.type === 'provide'
                    ? 'border-primary-main bg-primary-cream text-primary-main'
                    : 'border-ui-border bg-ui-card text-ui-text'
                }`}
              >
                제공하기
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, type: 'request' }))}
                className={`${isSeniorMode ? 'py-4 text-lg' : 'py-3 text-base'} rounded-lg border-2 font-medium transition-all ${
                  formData.type === 'request'
                    ? 'border-primary-main bg-primary-cream text-primary-main'
                    : 'border-ui-border bg-ui-card text-ui-text'
                }`}
              >
                요청하기
              </button>
            </div>
          </Card>

          {/* 카테고리 선택 */}
          <Card className={isSeniorMode ? 'mb-6' : 'mb-4'}>
            <h2 className={`font-bold mb-3 ${isSeniorMode ? 'text-xl' : 'text-lg'}`}>
              카테고리
            </h2>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className={`w-full ${isSeniorMode ? 'px-4 py-4 text-lg' : 'px-3 py-3 text-base'} border border-ui-border rounded-lg bg-ui-card`}
            >
              {categories.filter(c => c.id !== 'all').map(cat => (
                <option key={cat.id} value={cat.name}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </Card>

          {/* 제목 */}
          <Card className={isSeniorMode ? 'mb-6' : 'mb-4'}>
            <h2 className={`font-bold mb-3 ${isSeniorMode ? 'text-xl' : 'text-lg'}`}>
              제목
            </h2>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="제목을 입력하세요 (최소 5자)"
              className={`w-full ${isSeniorMode ? 'px-4 py-4 text-lg' : 'px-3 py-3 text-base'} border border-ui-border rounded-lg bg-ui-bg focus:outline-none focus:border-primary-main`}
            />
          </Card>

          {/* 상세 설명 */}
          <Card className={isSeniorMode ? 'mb-6' : 'mb-4'}>
            <h2 className={`font-bold mb-3 ${isSeniorMode ? 'text-xl' : 'text-lg'}`}>
              상세 설명
            </h2>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="상세한 내용을 입력하세요 (최소 10자)"
              rows={isSeniorMode ? 6 : 5}
              className={`w-full ${isSeniorMode ? 'px-4 py-4 text-lg' : 'px-3 py-3 text-base'} border border-ui-border rounded-lg bg-ui-bg focus:outline-none focus:border-primary-main resize-none`}
            />
          </Card>

          {/* 필요 타임 */}
          <Card className={isSeniorMode ? 'mb-6' : 'mb-4'}>
            <h2 className={`font-bold mb-3 ${isSeniorMode ? 'text-xl' : 'text-lg'}`}>
              필요 타임 (1-15)
            </h2>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1"
                max="15"
                value={formData.requiredTime}
                onChange={(e) => setFormData(prev => ({ ...prev, requiredTime: parseInt(e.target.value) }))}
                className="flex-1"
              />
              <span className={`font-bold text-primary-main ${isSeniorMode ? 'text-2xl' : 'text-xl'} min-w-[80px] text-right`}>
                {formData.requiredTime} 타임
              </span>
            </div>
          </Card>

          {/* 가능한 시간대 */}
          <Card className={isSeniorMode ? 'mb-6' : 'mb-4'}>
            <h2 className={`font-bold mb-3 ${isSeniorMode ? 'text-xl' : 'text-lg'}`}>
              가능한 시간대
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {timeSlots.map(time => (
                <button
                  key={time}
                  type="button"
                  onClick={() => handleTimeToggle(time)}
                  className={`${isSeniorMode ? 'py-4 text-lg' : 'py-3 text-base'} rounded-lg border-2 font-medium transition-all ${
                    formData.availableTimes.includes(time)
                      ? 'border-primary-main bg-primary-cream text-primary-main'
                      : 'border-ui-border bg-ui-card text-ui-text'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </Card>

          {/* 지역 */}
          <Card className={isSeniorMode ? 'mb-6' : 'mb-4'}>
            <h2 className={`font-bold mb-3 ${isSeniorMode ? 'text-xl' : 'text-lg'}`}>
              지역
            </h2>
            <select
              value={formData.region}
              onChange={(e) => setFormData(prev => ({ ...prev, region: e.target.value }))}
              className={`w-full ${isSeniorMode ? 'px-4 py-4 text-lg' : 'px-3 py-3 text-base'} border border-ui-border rounded-lg bg-ui-card`}
            >
              {regions.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </Card>

          {/* 안내 메시지 */}
          <Card className={`bg-yellow-50 border-yellow-200 ${isSeniorMode ? 'mb-6' : 'mb-4'}`}>
            <div className="flex items-start gap-3">
              <span className={isSeniorMode ? 'text-2xl' : 'text-xl'}>⚠️</span>
              <div>
                <p className={`font-bold mb-1 ${isSeniorMode ? 'text-lg' : 'text-base'}`}>
                  1일 최대 4시간 제한
                </p>
                <p className={`text-ui-textSecondary ${isSeniorMode ? 'text-base' : 'text-sm'}`}>
                  하루에 최대 4시간까지만 거래를 시작할 수 있습니다.
                  다른 세대와 거래 시 +0.5시간 보너스가 추가됩니다.
                </p>
              </div>
            </div>
          </Card>

          {/* 제출 버튼 */}
          <Button type="submit" fullWidth size="lg">
            게시글 작성하기
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
