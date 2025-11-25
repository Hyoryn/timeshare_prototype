import { useNavigate } from 'react-router-dom';
import { useMode } from '../context/ModeContext';
import Header from '../components/common/Header';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';

const MyPage = () => {
  const { currentUser, isSeniorMode } = useMode();
  const navigate = useNavigate();

  if (!currentUser) return null;

  const conversionRate = 8333.33; // 1타임 = 8,333.33원 (15타임 = 125,000원)
  const convertibleTime = Math.floor(currentUser.ownedTime / 15) * 15; // 15타임 단위로만 전환 가능
  const convertibleMoney = Math.floor(convertibleTime * conversionRate);

  return (
    <div className={`min-h-screen pb-24 ${isSeniorMode ? 'senior-mode' : 'youth-mode'}`}>
      <Header title="마이페이지" showBack={false} />

      <div className="max-w-md mx-auto px-4 py-6">
        {/* 프로필 영역 */}
        <Card className={isSeniorMode ? 'mb-6' : 'mb-4'}>
          <div className="flex items-center gap-4 mb-4">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className={`${isSeniorMode ? 'w-24 h-24' : 'w-20 h-20'} rounded-full`}
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h2 className={`font-bold ${isSeniorMode ? 'text-2xl' : 'text-xl'}`}>
                  {currentUser.name}
                </h2>
                {currentUser.isIdentityVerified && (
                  <span className="text-blue-500 text-lg" title="신원인증">✓</span>
                )}
                {currentUser.isTalentVerified && (
                  <span className="text-yellow-600 text-lg" title="재능인증">✓</span>
                )}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="primary">
                  {currentUser.generation === 'youth' ? '청년' : '시니어'}
                </Badge>
                <span className={`text-ui-textSecondary ${isSeniorMode ? 'text-base' : 'text-sm'}`}>
                  ⭐ {currentUser.rating.toFixed(1)}
                </span>
                <span className={`text-ui-textSecondary ${isSeniorMode ? 'text-base' : 'text-sm'}`}>
                  거래 {currentUser.completedDeals}회
                </span>
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            fullWidth
            onClick={() => navigate('/profile/edit')}
          >
            프로필 수정
          </Button>
        </Card>

        {/* 타임 정보 */}
        <Card className={isSeniorMode ? 'mb-6' : 'mb-4'}>
          <h2 className={`font-bold mb-4 ${isSeniorMode ? 'text-xl' : 'text-lg'}`}>
            내 타임
          </h2>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-4 bg-primary-cream rounded-lg">
              <p className={`text-ui-textSecondary mb-1 ${isSeniorMode ? 'text-base' : 'text-sm'}`}>
                보유 타임
              </p>
              <p className={`font-bold text-primary-main ${isSeniorMode ? 'text-3xl' : 'text-2xl'}`}>
                {currentUser.ownedTime}
              </p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className={`text-ui-textSecondary mb-1 ${isSeniorMode ? 'text-base' : 'text-sm'}`}>
                오늘 사용 가능
              </p>
              <p className={`font-bold text-blue-600 ${isSeniorMode ? 'text-3xl' : 'text-2xl'}`}>
                {currentUser.todayLimit - currentUser.todayUsed}/{currentUser.todayLimit}h
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            fullWidth
            onClick={() => navigate('/time/history')}
          >
            타임 사용 내역 보기
          </Button>
        </Card>

        {/* 지역화폐 전환 */}
        <Card className={`bg-gradient-to-br from-primary-cream to-primary-light ${isSeniorMode ? 'mb-6' : 'mb-4'}`}>
          <div className="flex items-center gap-3 mb-3">
            <span className={isSeniorMode ? 'text-3xl' : 'text-2xl'}>💰</span>
            <h2 className={`font-bold ${isSeniorMode ? 'text-xl' : 'text-lg'}`}>
              지역화폐 전환
            </h2>
          </div>

          <p className={`text-ui-textSecondary mb-4 ${isSeniorMode ? 'text-base' : 'text-sm'}`}>
            15타임 이상부터 지역화폐로 전환할 수 있습니다
          </p>

          <div className="bg-white rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className={`text-ui-textSecondary ${isSeniorMode ? 'text-base' : 'text-sm'}`}>
                전환 가능
              </span>
              <span className={`font-bold ${isSeniorMode ? 'text-xl' : 'text-lg'}`}>
                {convertibleTime} 타임
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-ui-textSecondary ${isSeniorMode ? 'text-base' : 'text-sm'}`}>
                받을 금액
              </span>
              <span className={`font-bold text-primary-main ${isSeniorMode ? 'text-2xl' : 'text-xl'}`}>
                {convertibleMoney.toLocaleString()}원
              </span>
            </div>
          </div>

          <Button
            fullWidth
            disabled={convertibleTime < 15}
            onClick={() => {
              if (confirm(`${convertibleTime}타임을 ${convertibleMoney.toLocaleString()}원으로 전환하시겠습니까?`)) {
                alert('전환이 완료되었습니다!');
              }
            }}
          >
            {convertibleTime >= 15 ? '전환하기' : '15타임 이상부터 가능'}
          </Button>
        </Card>

        {/* 친구 초대 */}
        <Card className={`bg-gradient-to-br from-blue-50 to-blue-100 ${isSeniorMode ? 'mb-6' : 'mb-4'}`}>
          <div className="flex items-center gap-3 mb-3">
            <span className={isSeniorMode ? 'text-3xl' : 'text-2xl'}>🎁</span>
            <h2 className={`font-bold ${isSeniorMode ? 'text-xl' : 'text-lg'}`}>
              친구 초대
            </h2>
          </div>

          <p className={`text-ui-textSecondary mb-4 ${isSeniorMode ? 'text-lg' : 'text-base'}`}>
            친구 추천 시 나와 친구 모두 <span className="font-bold text-blue-600">+1시간 보너스!</span>
          </p>

          <div className="bg-white rounded-lg p-4 mb-4">
            <p className={`text-ui-textSecondary mb-2 ${isSeniorMode ? 'text-base' : 'text-sm'}`}>
              내 추천 코드
            </p>
            <p className={`font-mono font-bold text-center ${isSeniorMode ? 'text-2xl' : 'text-xl'} text-primary-main`}>
              TIMESHARE{currentUser.id.toString().padStart(4, '0')}
            </p>
          </div>

          <Button
            fullWidth
            variant="secondary"
            onClick={() => {
              navigator.clipboard.writeText(`TIMESHARE${currentUser.id.toString().padStart(4, '0')}`);
              alert('추천 코드가 복사되었습니다!');
            }}
          >
            코드 복사하기
          </Button>
        </Card>

        {/* 인증 센터 */}
        <Card className={isSeniorMode ? 'mb-6' : 'mb-4'}>
          <h2 className={`font-bold mb-4 ${isSeniorMode ? 'text-xl' : 'text-lg'}`}>
            인증 센터
          </h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-ui-bg rounded-lg">
              <div className="flex items-center gap-3">
                <span className={isSeniorMode ? 'text-2xl' : 'text-xl'}>
                  {currentUser.isIdentityVerified ? '✅' : '⬜'}
                </span>
                <div>
                  <p className={`font-medium ${isSeniorMode ? 'text-lg' : 'text-base'}`}>
                    신원 인증
                  </p>
                  <p className={`text-ui-textSecondary ${isSeniorMode ? 'text-base' : 'text-sm'}`}>
                    {currentUser.isIdentityVerified ? '인증 완료' : '미인증'}
                  </p>
                </div>
              </div>
              {!currentUser.isIdentityVerified && (
                <Button
                  size="sm"
                  onClick={() => navigate('/verify/identity')}
                >
                  인증하기
                </Button>
              )}
            </div>

            <div className="flex items-center justify-between p-3 bg-ui-bg rounded-lg">
              <div className="flex items-center gap-3">
                <span className={isSeniorMode ? 'text-2xl' : 'text-xl'}>
                  {currentUser.isTalentVerified ? '✅' : '⬜'}
                </span>
                <div>
                  <p className={`font-medium ${isSeniorMode ? 'text-lg' : 'text-base'}`}>
                    재능 인증
                  </p>
                  <p className={`text-ui-textSecondary ${isSeniorMode ? 'text-base' : 'text-sm'}`}>
                    {currentUser.isTalentVerified ? '인증 완료' : '미인증'}
                  </p>
                </div>
              </div>
              {!currentUser.isTalentVerified ? (
                <Button
                  size="sm"
                  onClick={() => navigate('/verify/talent')}
                >
                  인증하기
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(`/resume/${currentUser.id}`)}
                >
                  이력서 보기
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* 메뉴 */}
        <Card className={isSeniorMode ? 'mb-6' : 'mb-4'}>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/deals')}
              className={`w-full flex items-center justify-between p-3 hover:bg-ui-bg rounded-lg transition-colors ${isSeniorMode ? 'text-lg' : 'text-base'}`}
            >
              <span>거래 내역</span>
              <span>→</span>
            </button>
            <button
              onClick={() => navigate('/reviews')}
              className={`w-full flex items-center justify-between p-3 hover:bg-ui-bg rounded-lg transition-colors ${isSeniorMode ? 'text-lg' : 'text-base'}`}
            >
              <span>받은 평가</span>
              <span>→</span>
            </button>
            <button
              onClick={() => navigate('/settings')}
              className={`w-full flex items-center justify-between p-3 hover:bg-ui-bg rounded-lg transition-colors ${isSeniorMode ? 'text-lg' : 'text-base'}`}
            >
              <span>설정</span>
              <span>→</span>
            </button>
          </div>
        </Card>

        {/* 프리미엄 배지 */}
        <Card className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white">
          <div className="flex items-center gap-3 mb-3">
            <span className={isSeniorMode ? 'text-3xl' : 'text-2xl'}>👑</span>
            <h2 className={`font-bold ${isSeniorMode ? 'text-xl' : 'text-lg'}`}>
              프리미엄 멤버십
            </h2>
          </div>

          <p className={`mb-4 opacity-90 ${isSeniorMode ? 'text-base' : 'text-sm'}`}>
            월 4,900원으로 무제한 거래와 우선 매칭을 받으세요
          </p>

          <Button
            variant="secondary"
            fullWidth
            onClick={() => navigate('/premium')}
          >
            프리미엄 가입하기
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default MyPage;
