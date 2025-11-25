import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMode } from '../context/ModeContext';
import { posts, categories } from '../data/posts';
import { users } from '../data/users';
import Header from '../components/common/Header';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';

// 카테고리별 관련 스킬 매핑
const categorySkillMap = {
  '교육': ['React', '웹 개발', 'Node.js', '영어 회화', '비즈니스 영어', 'TOEIC', '일본어', 'JLPT', '마케팅', 'SNS 운영', '회계', '세무', '재무 관리', '그래픽 디자인', '포토샵', '일러스트', '사진 촬영', '영상 편집'],
  '돌봄': ['아이 돌봄', '육아', '교육', '건강관리', '운동', 'PT', '등산'],
  '생활지원': ['요리', '베이킹', '한식 요리', '김치 담그기', '전통 음식', '반찬 만들기', '밑반찬', '청소', '정리정돈', '수납', '옷 수선', '바느질', '가구 수리', '목공', 'DIY', '정원 가꾸기', '식물 관리', '농사'],
  'IT/기술': ['웹 개발', 'React', 'Node.js', '그래픽 디자인', '포토샵', '일러스트', '사진 촬영', '영상 편집', '드론', 'SNS 운영', '콘텐츠 기획', '마케팅'],
  '언어교환': ['영어 회화', '비즈니스 영어', 'TOEIC', '일본어', '일본 문화', 'JLPT'],
  '예술/문화': ['피아노', '음악 이론', '서예', '한문', '전통 문화', '그래픽 디자인', '사진 촬영', '영상 편집', '한복 만들기', '전통 의상', '뜨개질', '바느질']
};

const Matching = () => {
  const { id } = useParams();
  const { currentUser, isSeniorMode } = useMode();
  const navigate = useNavigate();
  const [step, setStep] = useState(id ? 'analyzing' : 'list'); // list, analyzing, success, dealing, completed
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchKeyword, setSearchKeyword] = useState('');

  const post = id ? posts.find(p => p.id === parseInt(id)) : null;
  const partner = post ? users.find(u => u.id === post.authorId) : null;
  const [selectedPartner, setSelectedPartner] = useState(partner);

  const [dealTime, setDealTime] = useState(post?.requiredTime || 2);
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');

  const isCrossGeneration = currentUser && selectedPartner && currentUser.generation !== selectedPartner.generation;
  const bonusTime = isCrossGeneration ? 0.5 : 0;

  // 필터링된 사용자 리스트
  const filteredUsers = users.filter(user => {
    // 본인 제외
    if (user.id === currentUser?.id) return false;

    // 카테고리 필터
    if (selectedCategory !== 'all') {
      const categorySkills = categorySkillMap[selectedCategory] || [];
      const hasMatchingSkill = user.skills.some(skill =>
        categorySkills.some(catSkill =>
          skill.toLowerCase().includes(catSkill.toLowerCase()) ||
          catSkill.toLowerCase().includes(skill.toLowerCase())
        )
      );
      if (!hasMatchingSkill) return false;
    }

    // 검색어 필터
    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase();
      const matchesName = user.name.toLowerCase().includes(keyword);
      const matchesSkills = user.skills.some(skill => skill.toLowerCase().includes(keyword));
      const matchesBio = user.bio.toLowerCase().includes(keyword);
      if (!matchesName && !matchesSkills && !matchesBio) return false;
    }

    return true;
  });

  // 분석 단계 시뮬레이션
  useEffect(() => {
    if (step === 'analyzing') {
      setTimeout(() => setStep('success'), 2000);
    }
  }, [step]);

  const startMatching = (user) => {
    setSelectedPartner(user);
    setStep('analyzing');
  };

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

  return (
    <div className={`min-h-screen pb-24 ${isSeniorMode ? 'senior-mode' : 'youth-mode'}`}>
      <Header title="매칭" showBack />

      <div className="max-w-md mx-auto px-4 py-6">
        {/* 사용자 리스트 */}
        {step === 'list' && (
          <>
            {/* 검색바 - 청년 모드만 */}
            {!isSeniorMode && (
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="이름이나 스킬로 검색하세요"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="w-full px-4 py-3 text-base border border-ui-border rounded-xl bg-ui-card focus:outline-none focus:border-primary-main transition-colors"
                />
              </div>
            )}

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

            {/* 사용자 카드 리스트 */}
            <div className="space-y-3">
              {filteredUsers.length === 0 ? (
                <Card className="text-center py-12">
                  <p className={`text-ui-textSecondary ${isSeniorMode ? 'text-xl' : 'text-base'}`}>
                    조건에 맞는 사용자가 없습니다
                  </p>
                </Card>
              ) : (
                filteredUsers.map(user => (
                  <Card
                    key={user.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => startMatching(user)}
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className={`${isSeniorMode ? 'w-20 h-20' : 'w-16 h-16'} rounded-full flex-shrink-0`}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className={`font-bold ${isSeniorMode ? 'text-xl' : 'text-lg'}`}>
                            {user.name}
                          </h3>
                          <Badge
                            variant={user.generation === 'youth' ? 'info' : 'primary'}
                            size={isSeniorMode ? 'md' : 'sm'}
                          >
                            {user.generation === 'youth' ? '청년' : '시니어'}
                          </Badge>
                          {currentUser.generation !== user.generation && (
                            <Badge variant="default" size={isSeniorMode ? 'md' : 'sm'}>
                              세대교류 +0.5h
                            </Badge>
                          )}
                        </div>
                        <p className={`text-ui-textSecondary mb-2 ${isSeniorMode ? 'text-base' : 'text-sm'}`}>
                          ⭐ {user.rating.toFixed(1)} · 거래 {user.completedDeals}회
                        </p>
                        <p className={`text-ui-text mb-2 line-clamp-2 ${isSeniorMode ? 'text-base' : 'text-sm'}`}>
                          {user.bio}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {user.skills.slice(0, isSeniorMode ? 2 : 3).map((skill, idx) => (
                            <span
                              key={idx}
                              className={`px-2 py-1 bg-primary-cream text-primary-main rounded ${
                                isSeniorMode ? 'text-sm' : 'text-xs'
                              }`}
                            >
                              {skill}
                            </span>
                          ))}
                          {user.skills.length > (isSeniorMode ? 2 : 3) && (
                            <span className={`px-2 py-1 bg-gray-100 text-gray-600 rounded ${isSeniorMode ? 'text-sm' : 'text-xs'}`}>
                              +{user.skills.length - (isSeniorMode ? 2 : 3)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </>
        )}

        {/* AI 분석 중 */}
        {step === 'analyzing' && selectedPartner && (
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
        {step === 'success' && selectedPartner && (
          <>
            <Card className={`bg-green-50 border-green-200 text-center ${isSeniorMode ? 'mb-6' : 'mb-4'}`}>
              <div className={`${isSeniorMode ? 'text-6xl' : 'text-5xl'} mb-4`}>🎉</div>
              <h2 className={`font-bold text-green-700 mb-2 ${isSeniorMode ? 'text-2xl' : 'text-xl'}`}>
                매칭 성공!
              </h2>
              <p className={`text-green-600 ${isSeniorMode ? 'text-lg' : 'text-base'}`}>
                {selectedPartner.name}님과 매칭되었습니다
              </p>
            </Card>

            {/* 상대방 정보 */}
            <Card className={isSeniorMode ? 'mb-6' : 'mb-4'}>
              <h3 className={`font-bold mb-3 ${isSeniorMode ? 'text-xl' : 'text-lg'}`}>
                매칭 상대
              </h3>
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={selectedPartner.avatar}
                  alt={selectedPartner.name}
                  className={`${isSeniorMode ? 'w-20 h-20' : 'w-16 h-16'} rounded-full`}
                />
                <div>
                  <p className={`font-bold mb-1 ${isSeniorMode ? 'text-xl' : 'text-lg'}`}>
                    {selectedPartner.name}
                  </p>
                  <p className={`text-ui-textSecondary ${isSeniorMode ? 'text-base' : 'text-sm'}`}>
                    ⭐ {selectedPartner.rating.toFixed(1)} · 거래 {selectedPartner.completedDeals}회
                  </p>
                </div>
              </div>
              <div className="bg-primary-cream p-3 rounded-lg">
                <p className={`text-ui-text mb-2 ${isSeniorMode ? 'text-base' : 'text-sm'}`}>
                  {selectedPartner.bio}
                </p>
                <div className="flex flex-wrap gap-1">
                  {selectedPartner.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className={`px-2 py-1 bg-white text-primary-main rounded ${
                        isSeniorMode ? 'text-sm' : 'text-xs'
                      }`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </Card>

            {/* 거래 정보 */}
            <Card className={isSeniorMode ? 'mb-6' : 'mb-4'}>
              <h3 className={`font-bold mb-3 ${isSeniorMode ? 'text-xl' : 'text-lg'}`}>
                거래 정보
              </h3>
              <div className="space-y-3">
                {post && (
                  <>
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
                  </>
                )}
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
                  <img src={selectedPartner.avatar} alt="" className="w-8 h-8 rounded-full" />
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
                  max={post?.requiredTime || 4}
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
