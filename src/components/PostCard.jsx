import { useNavigate } from 'react-router-dom';
import { useMode } from '../context/ModeContext';
import { users } from '../data/users';
import Card from './common/Card';
import Badge from './common/Badge';

const PostCard = ({ post }) => {
  const { isSeniorMode } = useMode();
  const navigate = useNavigate();
  const author = users.find(u => u.id === post.authorId);

  if (!author) return null;

  const handleClick = () => {
    navigate(`/post/${post.id}`);
  };

  return (
    <Card hover onClick={handleClick} className={isSeniorMode ? 'mb-5' : 'mb-3'}>
      {/* 작성자 정보 */}
      <div className="flex items-center gap-3 mb-3">
        <img
          src={author.avatar}
          alt={author.name}
          className={`${isSeniorMode ? 'w-14 h-14' : 'w-12 h-12'} rounded-full`}
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className={`font-semibold ${isSeniorMode ? 'text-lg' : 'text-base'}`}>
              {author.name}
            </span>
            {author.isIdentityVerified && (
              <span className={`${isSeniorMode ? 'text-base' : 'text-sm'} text-blue-500`} title="신원인증">
                ✓
              </span>
            )}
            {author.isTalentVerified && (
              <span className={`${isSeniorMode ? 'text-base' : 'text-sm'} text-yellow-600`} title="재능인증">
                ✓
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-ui-textSecondary ${isSeniorMode ? 'text-base' : 'text-sm'}`}>
              ⭐ {author.rating.toFixed(1)}
            </span>
            <span className={`text-ui-textSecondary ${isSeniorMode ? 'text-base' : 'text-sm'}`}>
              · 거래 {author.completedDeals}회
            </span>
          </div>
        </div>
        <Badge variant={post.type === 'provide' ? 'primary' : 'info'}>
          {post.type === 'provide' ? '제공' : '요청'}
        </Badge>
      </div>

      {/* 제목 및 설명 */}
      <h3 className={`font-bold mb-2 ${isSeniorMode ? 'text-xl' : 'text-lg'}`}>
        {post.title}
      </h3>
      <p className={`text-ui-textSecondary mb-3 line-clamp-2 ${isSeniorMode ? 'text-lg leading-relaxed' : 'text-sm'}`}>
        {post.description}
      </p>

      {/* 하단 정보 */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="default">{post.category}</Badge>
          <Badge variant="default">📍 {post.region}</Badge>
          {post.crossGeneration && (
            <Badge variant="success">세대교류 +0.5h</Badge>
          )}
        </div>
        <div className={`font-bold text-primary-main ${isSeniorMode ? 'text-xl' : 'text-lg'}`}>
          {post.requiredTime} 타임
        </div>
      </div>

      {/* 시간대 */}
      <div className={`mt-3 flex gap-2 flex-wrap ${isSeniorMode ? 'text-base' : 'text-sm'}`}>
        {post.availableTimes.map((time, index) => (
          <span key={index} className="text-ui-textSecondary">
            🕐 {time}
          </span>
        ))}
      </div>
    </Card>
  );
};

export default PostCard;
