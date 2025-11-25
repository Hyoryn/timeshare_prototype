import { useParams } from 'react-router-dom';
import { useMode } from '../context/ModeContext';
import { users } from '../data/users';
import Header from '../components/common/Header';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';

const Resume = () => {
  const { id } = useParams();
  const { isSeniorMode } = useMode();
  const user = users.find(u => u.id === parseInt(id));

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-ui-textSecondary">사용자를 찾을 수 없습니다</p>
      </div>
    );
  }

  if (!user.isTalentVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md text-center">
          <p className="text-xl text-ui-textSecondary mb-4">
            재능 인증이 완료되지 않은 사용자입니다
          </p>
        </Card>
      </div>
    );
  }

  // 더미 이력서 데이터
  const resumeData = {
    career: [
      { period: '2020 - 현재', title: '현재 직무', description: user.bio },
    ],
    certificates: user.skills.map(skill => ({ name: skill })),
    completedDeals: user.completedDeals,
    reviews: [
      { rating: 5, comment: '매우 친절하고 전문적이었습니다!', date: '2025-11-20' },
      { rating: 5, comment: '설명이 쉽고 이해하기 좋았어요', date: '2025-11-15' },
      { rating: 4, comment: '시간 약속을 잘 지키십니다', date: '2025-11-10' },
    ],
  };

  const handleDownload = () => {
    alert('이력서 다운로드 기능은 개발 중입니다.');
  };

  const handleShare = () => {
    alert('이력서 공유 기능은 개발 중입니다.');
  };

  return (
    <div className={`min-h-screen pb-24 ${isSeniorMode ? 'senior-mode' : 'youth-mode'}`}>
      <Header
        title="이력서"
        showBack
        actions={
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handleShare}>
              공유
            </Button>
            <Button size="sm" onClick={handleDownload}>
              다운로드
            </Button>
          </div>
        }
      />

      <div className="max-w-screen-xl mx-auto px-4 py-6">
        {/* 기본 정보 */}
        <Card className={isSeniorMode ? 'mb-6' : 'mb-4'}>
          <div className="flex items-center gap-4 mb-4">
            <img
              src={user.avatar}
              alt={user.name}
              className={`${isSeniorMode ? 'w-24 h-24' : 'w-20 h-20'} rounded-full`}
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h1 className={`font-bold ${isSeniorMode ? 'text-3xl' : 'text-2xl'}`}>
                  {user.name}
                </h1>
                {user.isIdentityVerified && (
                  <span className="text-blue-500 text-lg" title="신원인증">✓</span>
                )}
                {user.isTalentVerified && (
                  <span className="text-yellow-600 text-lg" title="재능인증">✓</span>
                )}
              </div>
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <Badge variant="primary">
                  {user.generation === 'youth' ? '청년' : '시니어'}
                </Badge>
                <Badge variant="default">{user.age}세</Badge>
                <Badge variant="default">📍 {user.region}</Badge>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-ui-textSecondary ${isSeniorMode ? 'text-base' : 'text-sm'}`}>
                  ⭐ {user.rating.toFixed(1)}
                </span>
                <span className={`text-ui-textSecondary ${isSeniorMode ? 'text-base' : 'text-sm'}`}>
                  거래 {user.completedDeals}회
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* 보유 기술/재능 */}
        <Card className={isSeniorMode ? 'mb-6' : 'mb-4'}>
          <h2 className={`font-bold mb-4 ${isSeniorMode ? 'text-xl' : 'text-lg'}`}>
            보유 기술 및 재능
          </h2>
          <div className="flex flex-wrap gap-2">
            {user.skills.map((skill, index) => (
              <Badge key={index} variant="primary" size="md">
                {skill}
              </Badge>
            ))}
          </div>
        </Card>

        {/* 소개 */}
        <Card className={isSeniorMode ? 'mb-6' : 'mb-4'}>
          <h2 className={`font-bold mb-3 ${isSeniorMode ? 'text-xl' : 'text-lg'}`}>
            소개
          </h2>
          <p className={`text-ui-textSecondary leading-relaxed ${isSeniorMode ? 'text-lg' : 'text-base'}`}>
            {user.bio}
          </p>
        </Card>

        {/* 경력 사항 */}
        <Card className={isSeniorMode ? 'mb-6' : 'mb-4'}>
          <h2 className={`font-bold mb-4 ${isSeniorMode ? 'text-xl' : 'text-lg'}`}>
            경력 사항
          </h2>
          <div className="space-y-4">
            {resumeData.career.map((item, index) => (
              <div key={index} className="border-l-2 border-primary-main pl-4">
                <p className={`font-bold mb-1 ${isSeniorMode ? 'text-lg' : 'text-base'}`}>
                  {item.title}
                </p>
                <p className={`text-ui-textSecondary mb-2 ${isSeniorMode ? 'text-base' : 'text-sm'}`}>
                  {item.period}
                </p>
                <p className={`text-ui-textSecondary ${isSeniorMode ? 'text-base' : 'text-sm'}`}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* 완료한 거래 이력 */}
        <Card className={isSeniorMode ? 'mb-6' : 'mb-4'}>
          <h2 className={`font-bold mb-4 ${isSeniorMode ? 'text-xl' : 'text-lg'}`}>
            거래 이력
          </h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-primary-cream rounded-lg">
              <p className={`font-bold text-primary-main mb-1 ${isSeniorMode ? 'text-3xl' : 'text-2xl'}`}>
                {user.completedDeals}
              </p>
              <p className={`text-ui-textSecondary ${isSeniorMode ? 'text-base' : 'text-sm'}`}>
                완료 거래
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className={`font-bold text-blue-600 mb-1 ${isSeniorMode ? 'text-3xl' : 'text-2xl'}`}>
                {user.rating.toFixed(1)}
              </p>
              <p className={`text-ui-textSecondary ${isSeniorMode ? 'text-base' : 'text-sm'}`}>
                평균 평점
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className={`font-bold text-green-600 mb-1 ${isSeniorMode ? 'text-3xl' : 'text-2xl'}`}>
                100%
              </p>
              <p className={`text-ui-textSecondary ${isSeniorMode ? 'text-base' : 'text-sm'}`}>
                응답률
              </p>
            </div>
          </div>
        </Card>

        {/* 받은 평가 */}
        <Card className={isSeniorMode ? 'mb-6' : 'mb-4'}>
          <h2 className={`font-bold mb-4 ${isSeniorMode ? 'text-xl' : 'text-lg'}`}>
            받은 평가
          </h2>
          <div className="space-y-3">
            {resumeData.reviews.map((review, index) => (
              <div key={index} className="p-4 bg-ui-bg rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={isSeniorMode ? 'text-lg' : 'text-base'}>
                        {i < review.rating ? '⭐' : '☆'}
                      </span>
                    ))}
                  </div>
                  <span className={`text-ui-textSecondary ${isSeniorMode ? 'text-base' : 'text-sm'}`}>
                    {review.date}
                  </span>
                </div>
                <p className={`text-ui-textSecondary ${isSeniorMode ? 'text-base' : 'text-sm'}`}>
                  {review.comment}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Resume;
