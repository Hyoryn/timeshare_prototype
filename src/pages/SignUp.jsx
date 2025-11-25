import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMode } from '../context/ModeContext';
import { users } from '../data/users';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const SignUp = () => {
  const { mode, updateUser } = useMode();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: 기본정보, 2: 신원인증, 3: 완료

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    ageGroup: '20-35',
    region: '서울 강남구',
  });

  const [verificationCode, setVerificationCode] = useState('');
  const [sentCode, setSentCode] = useState('');

  const regions = ['서울 강남구', '서울 마포구', '서울 송파구', '서울 종로구'];

  const handleBasicInfo = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('이름을 입력해주세요.');
      return;
    }

    if (!formData.phone.trim() || formData.phone.length < 10) {
      alert('올바른 휴대폰 번호를 입력해주세요.');
      return;
    }

    setStep(2);
  };

  const sendVerificationCode = () => {
    // 더미 인증 코드 생성
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setSentCode(code);
    alert(`인증번호가 발송되었습니다: ${code}\n(프로토타입이므로 화면에 표시됩니다)`);
  };

  const handleVerification = (e) => {
    e.preventDefault();

    if (verificationCode !== sentCode) {
      alert('인증번호가 일치하지 않습니다.');
      return;
    }

    setStep(3);
  };

  const handleComplete = () => {
    // 더미 사용자 데이터 생성 (기존 사용자 중 선택)
    const dummyUser = mode === 'youth'
      ? users.find(u => u.generation === 'youth')
      : users.find(u => u.generation === 'senior');

    // 사용자 정보 업데이트
    const newUser = {
      ...dummyUser,
      name: formData.name,
      region: formData.region,
      isIdentityVerified: true, // 신원 인증 완료
    };

    updateUser(newUser);
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-cream via-ui-bg to-primary-light flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* 로고 */}
        <div className="text-center mb-8">
          <div className="inline-block bg-primary-main text-white px-6 py-3 rounded-xl mb-3">
            <h1 className="text-3xl font-bold">TimeShare</h1>
          </div>
          <p className="text-lg text-ui-text font-medium">
            {mode === 'youth' ? '청년' : '시니어'} 회원가입
          </p>
        </div>

        {/* 진행 상태 */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-primary-main text-white' : 'bg-gray-200 text-gray-400'}`}>
            1
          </div>
          <div className={`w-16 h-1 ${step >= 2 ? 'bg-primary-main' : 'bg-gray-200'}`}></div>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-primary-main text-white' : 'bg-gray-200 text-gray-400'}`}>
            2
          </div>
          <div className={`w-16 h-1 ${step >= 3 ? 'bg-primary-main' : 'bg-gray-200'}`}></div>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 3 ? 'bg-primary-main text-white' : 'bg-gray-200 text-gray-400'}`}>
            3
          </div>
        </div>

        {/* Step 1: 기본 정보 */}
        {step === 1 && (
          <Card>
            <h2 className="text-2xl font-bold mb-6">기본 정보 입력</h2>
            <form onSubmit={handleBasicInfo} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">이름</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="이름을 입력하세요"
                  className="w-full px-4 py-3 border border-ui-border rounded-lg focus:outline-none focus:border-primary-main"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">휴대폰 번호</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value.replace(/[^0-9]/g, '') }))}
                  placeholder="01012345678"
                  maxLength="11"
                  className="w-full px-4 py-3 border border-ui-border rounded-lg focus:outline-none focus:border-primary-main"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">연령대</label>
                <select
                  value={formData.ageGroup}
                  onChange={(e) => setFormData(prev => ({ ...prev, ageGroup: e.target.value }))}
                  className="w-full px-4 py-3 border border-ui-border rounded-lg focus:outline-none focus:border-primary-main"
                >
                  <option value="20-35">20-35세 (청년)</option>
                  <option value="60-75">60-75세 (시니어)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">지역</label>
                <select
                  value={formData.region}
                  onChange={(e) => setFormData(prev => ({ ...prev, region: e.target.value }))}
                  className="w-full px-4 py-3 border border-ui-border rounded-lg focus:outline-none focus:border-primary-main"
                >
                  {regions.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>

              <Button type="submit" fullWidth size="lg">
                다음
              </Button>
            </form>
          </Card>
        )}

        {/* Step 2: 신원 인증 */}
        {step === 2 && (
          <Card>
            <h2 className="text-2xl font-bold mb-2">신원 인증</h2>
            <p className="text-ui-textSecondary mb-6">
              안전한 거래를 위해 휴대폰 본인 인증이 필요합니다
            </p>

            <form onSubmit={handleVerification} className="space-y-4">
              <div className="bg-primary-cream p-4 rounded-lg mb-4">
                <p className="font-medium mb-1">{formData.name}님</p>
                <p className="text-sm text-ui-textSecondary">{formData.phone}</p>
              </div>

              {!sentCode ? (
                <Button type="button" onClick={sendVerificationCode} fullWidth size="lg">
                  인증번호 발송
                </Button>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">인증번호</label>
                    <input
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="인증번호 6자리"
                      maxLength="6"
                      className="w-full px-4 py-3 border border-ui-border rounded-lg focus:outline-none focus:border-primary-main text-center text-2xl font-bold tracking-widest"
                    />
                  </div>

                  <div className="text-center text-sm text-ui-textSecondary">
                    <p>프로토타입이므로 인증번호를 화면에 표시했습니다</p>
                    <p className="font-bold text-primary-main mt-1">{sentCode}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button type="button" variant="outline" onClick={() => { setSentCode(''); setVerificationCode(''); }}>
                      재발송
                    </Button>
                    <Button type="submit">
                      확인
                    </Button>
                  </div>
                </>
              )}
            </form>
          </Card>
        )}

        {/* Step 3: 완료 */}
        {step === 3 && (
          <Card className="text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold mb-2">회원가입 완료!</h2>
            <p className="text-ui-textSecondary mb-6">
              신원 인증이 완료되었습니다.<br />
              TimeShare를 시작해보세요!
            </p>

            <div className="bg-green-50 p-4 rounded-lg mb-6">
              <p className="font-medium text-green-700 mb-2">🎁 가입 축하 선물</p>
              <p className="text-sm text-green-600">
                • 웰컴 보너스: 5타임<br />
                • 신원 인증 완료: ✓
              </p>
            </div>

            <Button onClick={handleComplete} fullWidth size="lg">
              TimeShare 시작하기
            </Button>
          </Card>
        )}

        {/* 하단 링크 */}
        {step === 1 && (
          <div className="text-center mt-6">
            <button
              onClick={() => navigate('/select-mode')}
              className="text-ui-textSecondary hover:text-primary-main transition-colors"
            >
              ← 모드 선택으로 돌아가기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUp;
