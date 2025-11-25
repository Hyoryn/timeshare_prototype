import { useParams, useNavigate } from 'react-router-dom';
import { useMode } from '../context/ModeContext';
import { posts } from '../data/posts';
import { users } from '../data/users';
import Header from '../components/common/Header';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';

const PostDetail = () => {
  const { id } = useParams();
  const { currentUser, isSeniorMode } = useMode();
  const navigate = useNavigate();

  const post = posts.find(p => p.id === parseInt(id));
  const author = post ? users.find(u => u.id === post.authorId) : null;

  if (!post || !author) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-ui-textSecondary">게시글을 찾을 수 없습니다</p>
      </div>
    );
  }

  const isCrossGeneration = currentUser && currentUser.generation !== author.generation;

  const handleMatch = () => {
    if (currentUser.todayUsed >= currentUser.todayLimit) {
      alert('오늘은 더 이상 거래를 시작할 수 없습니다. 내일 다시 시도해주세요.');
      return;
    }

    if (currentUser.ownedTime < post.requiredTime) {
      alert('보유한 타임이 부족합니다.');
      return;
    }

    // 매칭 신청
    navigate(`/matching/${post.id}`);
  };

  const viewResume = () => {
    navigate(`/resume/${author.id}`);
  };

  // 유사 게시글 (같은 카테고리의 다른 게시글)
  const similarPosts = posts
    .filter(p => p.id !== post.id && p.category === post.category)
    .slice(0, 3);

  return (
    <div className={`min-h-screen pb-24 ${isSeniorMode ? 'senior-mode' : 'youth-mode'}`}>
      <Header title="게시글 상세" showBack />

      <div className="max-w-screen-xl mx-auto px-4 py-6">
        {/* 게시글 정보 */}
        <Card className={isSeniorMode ? 'mb-6' : 'mb-4'}>
          <div className="flex items-center justify-between mb-4">
            <Badge variant={post.type === 'provide' ? 'primary' : 'info'} size="md">
              {post.type === 'provide' ? '제공' : '요청'}
            </Badge>
            <Badge variant="default" size="md">{post.category}</Badge>
          </div>

          <h1 className={`font-bold mb-3 ${isSeniorMode ? 'text-3xl' : 'text-2xl'}`}>
            {post.title}
          </h1>

          <p className={`text-ui-textSecondary mb-4 leading-relaxed ${isSeniorMode ? 'text-lg' : 'text-base'}`}>
            {post.description}
          </p>

          <div className="flex items-center gap-3 flex-wrap mb-4">
            <Badge variant="default">📍 {post.region}</Badge>
            {post.availableTimes.map((time, index) => (
              <Badge key={index} variant="default">🕐 {time}</Badge>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-ui-border">
            <span className={`text-ui-textSecondary ${isSeniorMode ? 'text-lg' : 'text-base'}`}>
              필요 타임
            </span>
            <span className={`font-bold text-primary-main ${isSeniorMode ? 'text-3xl' : 'text-2xl'}`}>
              {post.requiredTime} 타임
            </span>
          </div>
        </Card>

        {/* 작성자 프로필 */}
        <Card className={isSeniorMode ? 'mb-6' : 'mb-4'}>
          <h2 className={`font-bold mb-4 ${isSeniorMode ? 'text-xl' : 'text-lg'}`}>
            작성자 정보
          </h2>

          <div className="flex items-center gap-4 mb-4">
            <img
              src={author.avatar}
              alt={author.name}
              className={`${isSeniorMode ? 'w-20 h-20' : 'w-16 h-16'} rounded-full`}
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className={`font-bold ${isSeniorMode ? 'text-xl' : 'text-lg'}`}>
                  {author.name}
                </span>
                {author.isIdentityVerified && (
                  <span className="text-blue-500" title="신원인증">✓</span>
                )}
                {author.isTalentVerified && (
                  <span className="text-yellow-600" title="재능인증">✓</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="default" size="sm">
                  {author.generation === 'youth' ? '청년' : '시니어'}
                </Badge>
                <span className={`text-ui-textSecondary ${isSeniorMode ? 'text-base' : 'text-sm'}`}>
                  ⭐ {author.rating.toFixed(1)}
                </span>
                <span className={`text-ui-textSecondary ${isSeniorMode ? 'text-base' : 'text-sm'}`}>
                  · 거래 {author.completedDeals}회
                </span>
              </div>
            </div>
          </div>

          {author.isTalentVerified && (
            <Button
              variant="outline"
              fullWidth
              onClick={viewResume}
              className="mb-3"
            >
              이력서 보기
            </Button>
          )}

          <div className={`text-ui-textSecondary ${isSeniorMode ? 'text-base' : 'text-sm'} leading-relaxed`}>
            {author.bio}
          </div>
        </Card>

        {/* 세대 교류 보너스 */}
        {isCrossGeneration && (
          <Card className={`bg-green-50 border-green-200 ${isSeniorMode ? 'mb-6' : 'mb-4'}`}>
            <div className="flex items-center gap-3">
              <span className={isSeniorMode ? 'text-3xl' : 'text-2xl'}>🎁</span>
              <div>
                <p className={`font-bold text-green-700 mb-1 ${isSeniorMode ? 'text-xl' : 'text-lg'}`}>
                  세대 교류 보너스!
                </p>
                <p className={`text-green-600 ${isSeniorMode ? 'text-base' : 'text-sm'}`}>
                  다른 세대와 거래 시 +0.5시간 보너스가 추가됩니다
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* 매칭 신청 버튼 */}
        {currentUser && currentUser.id !== author.id && (
          <Button
            onClick={handleMatch}
            fullWidth
            size="lg"
            className="mb-6"
          >
            매칭 신청하기
          </Button>
        )}

        {/* 유사 게시글 */}
        {similarPosts.length > 0 && (
          <div>
            <h2 className={`font-bold mb-4 ${isSeniorMode ? 'text-xl' : 'text-lg'}`}>
              비슷한 게시글
            </h2>
            <div className="space-y-3">
              {similarPosts.map(p => {
                const similarAuthor = users.find(u => u.id === p.authorId);
                return (
                  <Card
                    key={p.id}
                    hover
                    onClick={() => navigate(`/post/${p.id}`)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className={`font-bold ${isSeniorMode ? 'text-lg' : 'text-base'}`}>
                        {p.title}
                      </h3>
                      <Badge variant="primary" size="sm">{p.requiredTime}T</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <img
                        src={similarAuthor.avatar}
                        alt={similarAuthor.name}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className={`text-ui-textSecondary ${isSeniorMode ? 'text-base' : 'text-sm'}`}>
                        {similarAuthor.name}
                      </span>
                      <span className={`text-ui-textSecondary ${isSeniorMode ? 'text-base' : 'text-sm'}`}>
                        · ⭐ {similarAuthor.rating.toFixed(1)}
                      </span>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostDetail;
