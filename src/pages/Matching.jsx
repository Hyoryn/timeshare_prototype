import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMode } from '../context/ModeContext';
import { posts } from '../data/posts';
import { users } from '../data/users';
import Header from '../components/common/Header';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const Matching = () => {
  const { id } = useParams();
  const { currentUser, isSeniorMode } = useMode();
  const navigate = useNavigate();
  const [step, setStep] = useState('analyzing'); // analyzing, success, dealing, completed

  const post = id ? posts.find(p => p.id === parseInt(id)) : null;
  const partner = post ? users.find(u => u.id === post.authorId) : null;

  const [dealTime, setDealTime] = useState(post?.requiredTime || 2);
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');

  const isCrossGeneration = currentUser && partner && currentUser.generation !== partner.generation;
  const bonusTime = isCrossGeneration ? 0.5 : 0;

  // 분석 단계 시뮬레이션
  useState(() => {
    if (step === 'analyzing') {
      setTimeout(() => setStep('success'), 2000);
    }
  }, [step]);

  const startDeal = () => {
    if (currentUser.todayUsed + dealTime > currentUser.todayLimit) {
      alert(`오늘 사용 가능한 시간을 초과합니다. (남은 시간: ${currentUser.todayLimit - currentUser.todayUsed}시간)`);
      return;
    }
    setStep('dealing');
  };

  const completeDeal = () => {
    if (!review.trim()) {
      alert('후기를 작성해주세요.');
      return;
    }
    setStep('completed');
  };

  if (!post || !partner) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-ui-textSecondary">매칭 정보를 찾을 수 없습니다</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pb-24 ${isSeniorMode ? 'senior-mode' : 'youth-mode'}`}>
      <Header title="매칭" showBack />

      <div className="max-w-md mx-auto px-4 py-6">
        {/* AI 분석 중 */}
        {step === 'analyzing' && (
          <Card className="text-center py-12">
            <div className="animate-spin text-6xl mb-4">🔄</div>
            <h2 className={`font-bold mb-2 ${isSeniorMode ? 'text-2xl' : 'text-xl'}`}>
              AI가 매칭을 분석 중입니다...
            </h2>
            <p className={`text-ui-textSecondary ${isSeniorMode ? 'text-lg' : 'text-base'}`}>
              잠시만 기다려주세요
            </p>
          </Card>
        )}

        {/* 매칭 성공 */}
        {step === 'success' && (
          <>
            <Card className={`bg-green-50 border-green-200 text-center ${isSeniorMode ? 'mb-6' : 'mb-4'}`}>
              <div className={`${isSeniorMode ? 'text-6xl' : 'text-5xl'} mb-4`}>🎉</div>
              <h2 className={`font-bold text-green-700 mb-2 ${isSeniorMode ? 'text-2xl' : 'text-xl'}`}>
                매칭 성공!
              </h2>
              <p className={`text-green-600 ${isSeniorMode ? 'text-lg' : 'text-base'}`}>
                {partner.name}님과 매칭되었습니다
              </p>
            </Card>

            {/* 상대방 정보 */}
            <Card className={isSeniorMode ? 'mb-6' : 'mb-4'}>
              <h3 className={`font-bold mb-3 ${isSeniorMode ? 'text-xl' : 'text-lg'}`}>
                매칭 상대
              </h3>
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={partner.avatar}
                  alt={partner.name}
                  className={`${isSeniorMode ? 'w-20 h-20' : 'w-16 h-16'} rounded-full`}
                />
                <div>
                  <p className={`font-bold mb-1 ${isSeniorMode ? 'text-xl' : 'text-lg'}`}>
                    {partner.name}
                  </p>
                  <p className={`text-ui-textSecondary ${isSeniorMode ? 'text-base' : 'text-sm'}`}>
                    ⭐ {partner.rating.toFixed(1)} · 거래 {partner.completedDeals}회
                  </p>
                </div>
              </div>
            </Card>

            {/* 거래 정보 */}
            <Card className={isSeniorMode ? 'mb-6' : 'mb-4'}>
              <h3 className={`font-bold mb-3 ${isSeniorMode ? 'text-xl' : 'text-lg'}`}>
                거래 정보
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className={`text-ui-textSecondary ${isSeniorMode ? 'text-lg' : 'text-base'}`}>
                    게시글
                  </span>
                  <span className={`font-medium ${isSeniorMode ? 'text-lg' : 'text-base'}`}>
                    {post.title}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={`text-ui-textSecondary ${isSeniorMode ? 'text-lg' : 'text-base'}`}>
                    필요 타임
                  </span>
                  <span className={`font-bold text-primary-main ${isSeniorMode ? 'text-xl' : 'text-lg'}`}>
                    {post.requiredTime} 타임
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={`text-ui-textSecondary ${isSeniorMode ? 'text-lg' : 'text-base'}`}>
                    사용 시간 차감
                  </span>
                  <span className={`font-medium ${isSeniorMode ? 'text-lg' : 'text-base'}`}>
                    {dealTime}시간
                  </span>
                </div>
                {isCrossGeneration && (
                  <div className="flex justify-between text-green-600">
                    <span className={isSeniorMode ? 'text-lg' : 'text-base'}>
                      세대 교류 보너스
                    </span>
                    <span className={`font-bold ${isSeniorMode ? 'text-xl' : 'text-lg'}`}>
                      +{bonusTime}시간
                    </span>
                  </div>
                )}
              </div>
            </Card>

            {/* 채팅 영역 (시뮬레이션) */}
            <Card className={isSeniorMode ? 'mb-6' : 'mb-4'}>
              <h3 className={`font-bold mb-3 ${isSeniorMode ? 'text-xl' : 'text-lg'}`}>
                채팅
              </h3>
              <div className="space-y-3 mb-4">
                <div className="flex gap-2">
                  <img src={partner.avatar} alt="" className="w-8 h-8 rounded-full" />
                  <div className="flex-1 bg-gray-100 rounded-lg p-3">
                    <p className={isSeniorMode ? 'text-base' : 'text-sm'}>
                      안녕하세요! 잘 부탁드립니다 😊
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 flex-row-reverse">
                  <img src={currentUser.avatar} alt="" className="w-8 h-8 rounded-full" />
                  <div className="flex-1 bg-primary-cream rounded-lg p-3">
                    <p className={isSeniorMode ? 'text-base' : 'text-sm'}>
                      네, 잘 부탁드립니다!
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="메시지를 입력하세요..."
                  className={`flex-1 ${isSeniorMode ? 'px-4 py-3 text-lg' : 'px-3 py-2 text-base'} border border-ui-border rounded-lg`}
                />
                <Button>전송</Button>
              </div>
            </Card>

            <Button onClick={startDeal} fullWidth size="lg">
              거래 시작하기
            </Button>
          </>
        )}

        {/* 거래 진행 중 */}
        {step === 'dealing' && (
          <>
            <Card className={`bg-blue-50 border-blue-200 text-center ${isSeniorMode ? 'mb-6' : 'mb-4'}`}>
              <div className={`${isSeniorMode ? 'text-6xl' : 'text-5xl'} mb-4`}>⏰</div>
              <h2 className={`font-bold text-blue-700 mb-2 ${isSeniorMode ? 'text-2xl' : 'text-xl'}`}>
                거래 진행 중
              </h2>
              <p className={`text-blue-600 ${isSeniorMode ? 'text-lg' : 'text-base'}`}>
                타임이 예약되었습니다
              </p>
            </Card>

            <Card className={isSeniorMode ? 'mb-6' : 'mb-4'}>
              <h3 className={`font-bold mb-3 ${isSeniorMode ? 'text-xl' : 'text-lg'}`}>
                사용 시간 조정
              </h3>
              <div className="flex items-center gap-4 mb-4">
                <input
                  type="range"
                  min="1"
                  max={post.requiredTime}
                  value={dealTime}
                  onChange={(e) => setDealTime(parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className={`font-bold text-primary-main ${isSeniorMode ? 'text-2xl' : 'text-xl'} min-w-[100px] text-right`}>
                  {dealTime}시간
                </span>
              </div>
              <p className={`text-ui-textSecondary ${isSeniorMode ? 'text-base' : 'text-sm'}`}>
                실제 사용한 시간에 맞게 조정해주세요
              </p>
            </Card>

            <Card className={isSeniorMode ? 'mb-6' : 'mb-4'}>
              <h3 className={`font-bold mb-3 ${isSeniorMode ? 'text-xl' : 'text-lg'}`}>
                거래 완료 시 차감
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className={`text-ui-textSecondary ${isSeniorMode ? 'text-lg' : 'text-base'}`}>
                    1일 제한 차감
                  </span>
                  <span className={`font-medium ${isSeniorMode ? 'text-lg' : 'text-base'}`}>
                    {dealTime}시간
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={`text-ui-textSecondary ${isSeniorMode ? 'text-lg' : 'text-base'}`}>
                    남은 제한
                  </span>
                  <span className={`font-bold ${isSeniorMode ? 'text-xl' : 'text-lg'}`}>
                    {currentUser.todayLimit - currentUser.todayUsed - dealTime} / {currentUser.todayLimit}시간
                  </span>
                </div>
                {isCrossGeneration && (
                  <div className="flex justify-between text-green-600 pt-2 border-t">
                    <span className={isSeniorMode ? 'text-lg' : 'text-base'}>
                      세대 교류 보너스 자동 적용
                    </span>
                    <span className={`font-bold ${isSeniorMode ? 'text-xl' : 'text-lg'}`}>
                      +{bonusTime}시간
                    </span>
                  </div>
                )}
              </div>
            </Card>

            <Card className={isSeniorMode ? 'mb-6' : 'mb-4'}>
              <h3 className={`font-bold mb-3 ${isSeniorMode ? 'text-xl' : 'text-lg'}`}>
                상대방 평가
              </h3>
              <div className="flex justify-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`${isSeniorMode ? 'text-4xl' : 'text-3xl'} transition-all`}
                  >
                    {star <= rating ? '⭐' : '☆'}
                  </button>
                ))}
              </div>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="거래 후기를 작성해주세요"
                rows={isSeniorMode ? 5 : 4}
                className={`w-full ${isSeniorMode ? 'px-4 py-4 text-lg' : 'px-3 py-3 text-base'} border border-ui-border rounded-lg bg-ui-bg resize-none`}
              />
            </Card>

            <Button onClick={completeDeal} fullWidth size="lg">
              거래 완료하기
            </Button>
          </>
        )}

        {/* 거래 완료 */}
        {step === 'completed' && (
          <>
            <Card className={`bg-green-50 border-green-200 text-center ${isSeniorMode ? 'mb-6' : 'mb-4'}`}>
              <div className={`${isSeniorMode ? 'text-6xl' : 'text-5xl'} mb-4`}>✅</div>
              <h2 className={`font-bold text-green-700 mb-2 ${isSeniorMode ? 'text-2xl' : 'text-xl'}`}>
                거래가 완료되었습니다!
              </h2>
              <p className={`text-green-600 ${isSeniorMode ? 'text-lg' : 'text-base'}`}>
                평가해주셔서 감사합니다
              </p>
            </Card>

            <Card className={isSeniorMode ? 'mb-6' : 'mb-4'}>
              <h3 className={`font-bold mb-4 ${isSeniorMode ? 'text-xl' : 'text-lg'}`}>
                거래 결과
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className={`text-ui-textSecondary ${isSeniorMode ? 'text-lg' : 'text-base'}`}>
                    사용한 시간
                  </span>
                  <span className={`font-bold ${isSeniorMode ? 'text-xl' : 'text-lg'}`}>
                    {dealTime}시간
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={`text-ui-textSecondary ${isSeniorMode ? 'text-lg' : 'text-base'}`}>
                    남은 1일 제한
                  </span>
                  <span className={`font-bold ${isSeniorMode ? 'text-xl' : 'text-lg'}`}>
                    {currentUser.todayLimit - currentUser.todayUsed - dealTime}시간
                  </span>
                </div>
                {isCrossGeneration && (
                  <div className="flex justify-between text-green-600 pt-3 border-t">
                    <span className={`font-bold ${isSeniorMode ? 'text-lg' : 'text-base'}`}>
                      세대 교류 보너스
                    </span>
                    <span className={`font-bold ${isSeniorMode ? 'text-xl' : 'text-lg'}`}>
                      +{bonusTime}시간 적용 완료
                    </span>
                  </div>
                )}
              </div>
            </Card>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" onClick={() => navigate('/')} fullWidth>
                홈으로
              </Button>
              <Button onClick={() => navigate('/mypage')} fullWidth>
                마이페이지
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Matching;
