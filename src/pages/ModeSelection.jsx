import { useNavigate } from 'react-router-dom';
import { useMode } from '../context/ModeContext';
import { users } from '../data/users';

const ModeSelection = () => {
  const { switchMode, updateUser } = useMode();
  const navigate = useNavigate();

  const handleModeSelect = (selectedMode) => {
    switchMode(selectedMode);
    // 더미 사용자 설정 (청년 모드면 첫 번째 청년, 시니어 모드면 첫 번째 시니어)
    const dummyUser = selectedMode === 'youth'
      ? users.find(u => u.generation === 'youth')
      : users.find(u => u.generation === 'senior');
    updateUser(dummyUser);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-cream via-ui-bg to-primary-light flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* 로고 */}
        <div className="text-center mb-12">
          <div className="inline-block bg-primary-main text-white px-8 py-4 rounded-2xl mb-4">
            <h1 className="text-4xl md:text-5xl font-bold">TimeShare</h1>
          </div>
          <p className="text-xl md:text-2xl text-ui-text font-medium">
            세대를 잇는 시간은행 플랫폼
          </p>
        </div>

        {/* 모드 선택 카드 */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* 청년 모드 */}
          <button
            onClick={() => handleModeSelect('youth')}
            className="group bg-ui-card rounded-2xl p-8 border-2 border-ui-border hover:border-primary-main hover:shadow-xl transition-all duration-300 text-left"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="text-5xl">👨‍💼</div>
              <h2 className="text-2xl font-bold text-ui-text group-hover:text-primary-main transition-colors">
                청년 모드
              </h2>
            </div>
            <p className="text-ui-textSecondary mb-4 leading-relaxed">
              효율적이고 세련된 인터페이스로<br />
              빠르게 시간을 거래하세요
            </p>
            <ul className="space-y-2 text-sm text-ui-textSecondary">
              <li className="flex items-center gap-2">
                <span className="text-primary-main">✓</span>
                일반 폰트 크기 (14-16px)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary-main">✓</span>
                밀도 높은 정보 배치
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary-main">✓</span>
                아이콘 중심 네비게이션
              </li>
            </ul>
            <div className="mt-6 text-primary-main font-semibold group-hover:translate-x-2 transition-transform">
              시작하기 →
            </div>
          </button>

          {/* 시니어 모드 */}
          <button
            onClick={() => handleModeSelect('senior')}
            className="group bg-ui-card rounded-2xl p-8 border-2 border-ui-border hover:border-primary-main hover:shadow-xl transition-all duration-300 text-left"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="text-5xl">👴</div>
              <h2 className="text-2xl font-bold text-ui-text group-hover:text-primary-main transition-colors">
                시니어 모드
              </h2>
            </div>
            <p className="text-ui-textSecondary mb-4 leading-relaxed">
              크고 명확한 글자로<br />
              편안하게 이용하세요
            </p>
            <ul className="space-y-2 text-sm text-ui-textSecondary">
              <li className="flex items-center gap-2">
                <span className="text-primary-main">✓</span>
                큰 폰트 크기 (18-22px)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary-main">✓</span>
                여유로운 간격과 큰 터치 영역
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary-main">✓</span>
                텍스트 레이블 중심
              </li>
            </ul>
            <div className="mt-6 text-primary-main font-semibold group-hover:translate-x-2 transition-transform">
              시작하기 →
            </div>
          </button>
        </div>

        {/* 안내 메시지 */}
        <div className="text-center text-ui-textSecondary text-sm">
          <p>설정에서 언제든지 모드를 변경할 수 있습니다</p>
        </div>
      </div>
    </div>
  );
};

export default ModeSelection;
