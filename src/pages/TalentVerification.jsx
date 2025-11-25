import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMode } from '../context/ModeContext';
import Header from '../components/common/Header';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const TalentVerification = () => {
  const { isSeniorMode } = useMode();
  const navigate = useNavigate();

  const [selectedType, setSelectedType] = useState('student');
  const [files, setFiles] = useState([]);

  const verificationTypes = [
    { id: 'student', name: '학생', doc: '재학증명서', icon: '🎓' },
    { id: 'employee', name: '직장인', doc: '재직증명서', icon: '💼' },
    { id: 'professional', name: '전문가', doc: '자격증', icon: '📜' },
    { id: 'experienced', name: '경력자', doc: '이력서', icon: '📋' },
  ];

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (files.length === 0) {
      alert('인증 서류를 업로드해주세요.');
      return;
    }

    // 인증 신청
    alert('재능 인증 신청이 완료되었습니다. 검토 후 승인됩니다.');
    navigate('/mypage');
  };

  return (
    <div className={`min-h-screen pb-24 ${isSeniorMode ? 'senior-mode' : 'youth-mode'}`}>
      <Header title="재능 인증" showBack />

      <div className="max-w-screen-xl mx-auto px-4 py-6">
        {/* 안내 */}
        <Card className={`bg-blue-50 border-blue-200 ${isSeniorMode ? 'mb-6' : 'mb-4'}`}>
          <div className="flex items-start gap-3">
            <span className={isSeniorMode ? 'text-3xl' : 'text-2xl'}>ℹ️</span>
            <div>
              <p className={`font-bold mb-2 ${isSeniorMode ? 'text-xl' : 'text-lg'}`}>
                재능 인증이란?
              </p>
              <p className={`text-ui-textSecondary leading-relaxed ${isSeniorMode ? 'text-base' : 'text-sm'}`}>
                본인의 전문성과 재능을 증명하는 서류를 제출하여 인증받는 절차입니다.
                재능 인증을 받으면 게시글 작성이 가능하며, 이력서를 공개할 수 있습니다.
              </p>
            </div>
          </div>
        </Card>

        <form onSubmit={handleSubmit}>
          {/* 인증 유형 선택 */}
          <Card className={isSeniorMode ? 'mb-6' : 'mb-4'}>
            <h2 className={`font-bold mb-4 ${isSeniorMode ? 'text-xl' : 'text-lg'}`}>
              인증 유형 선택
            </h2>

            <div className="grid grid-cols-2 gap-3">
              {verificationTypes.map(type => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setSelectedType(type.id)}
                  className={`${isSeniorMode ? 'p-5' : 'p-4'} rounded-xl border-2 transition-all ${
                    selectedType === type.id
                      ? 'border-primary-main bg-primary-cream'
                      : 'border-ui-border bg-ui-card'
                  }`}
                >
                  <div className={`${isSeniorMode ? 'text-4xl' : 'text-3xl'} mb-2`}>
                    {type.icon}
                  </div>
                  <p className={`font-bold mb-1 ${isSeniorMode ? 'text-lg' : 'text-base'}`}>
                    {type.name}
                  </p>
                  <p className={`text-ui-textSecondary ${isSeniorMode ? 'text-base' : 'text-sm'}`}>
                    {type.doc}
                  </p>
                </button>
              ))}
            </div>
          </Card>

          {/* 파일 업로드 */}
          <Card className={isSeniorMode ? 'mb-6' : 'mb-4'}>
            <h2 className={`font-bold mb-3 ${isSeniorMode ? 'text-xl' : 'text-lg'}`}>
              서류 업로드
            </h2>

            <p className={`text-ui-textSecondary mb-4 ${isSeniorMode ? 'text-base' : 'text-sm'}`}>
              {verificationTypes.find(t => t.id === selectedType)?.doc}을 업로드해주세요
              (JPG, PNG, PDF 형식, 최대 10MB)
            </p>

            <label
              className={`block w-full ${isSeniorMode ? 'p-8' : 'p-6'} border-2 border-dashed border-ui-border rounded-xl text-center cursor-pointer hover:border-primary-main hover:bg-primary-cream transition-all`}
            >
              <input
                type="file"
                multiple
                accept="image/*,application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className={`${isSeniorMode ? 'text-5xl' : 'text-4xl'} mb-3`}>📁</div>
              <p className={`font-medium mb-1 ${isSeniorMode ? 'text-lg' : 'text-base'}`}>
                파일을 선택하거나 여기에 드래그하세요
              </p>
              <p className={`text-ui-textSecondary ${isSeniorMode ? 'text-base' : 'text-sm'}`}>
                {files.length > 0 ? `${files.length}개 파일 선택됨` : '파일을 선택해주세요'}
              </p>
            </label>

            {/* 선택된 파일 목록 */}
            {files.length > 0 && (
              <div className="mt-4 space-y-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-ui-bg rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className={isSeniorMode ? 'text-2xl' : 'text-xl'}>📄</span>
                      <div>
                        <p className={`font-medium ${isSeniorMode ? 'text-base' : 'text-sm'}`}>
                          {file.name}
                        </p>
                        <p className={`text-ui-textSecondary ${isSeniorMode ? 'text-sm' : 'text-xs'}`}>
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFiles(files.filter((_, i) => i !== index))}
                      className="text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* 주의사항 */}
          <Card className={`bg-yellow-50 border-yellow-200 ${isSeniorMode ? 'mb-6' : 'mb-4'}`}>
            <div className="flex items-start gap-3">
              <span className={isSeniorMode ? 'text-2xl' : 'text-xl'}>⚠️</span>
              <div>
                <p className={`font-bold mb-2 ${isSeniorMode ? 'text-lg' : 'text-base'}`}>
                  주의사항
                </p>
                <ul className={`space-y-1 text-ui-textSecondary ${isSeniorMode ? 'text-base' : 'text-sm'}`}>
                  <li>• 제출하신 서류는 본인 확인 용도로만 사용됩니다</li>
                  <li>• 검토는 영업일 기준 1-2일 소요됩니다</li>
                  <li>• 서류가 명확하지 않은 경우 재제출을 요청할 수 있습니다</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* 제출 버튼 */}
          <Button
            type="submit"
            fullWidth
            size="lg"
            disabled={files.length === 0}
          >
            인증 신청하기
          </Button>
        </form>
      </div>
    </div>
  );
};

export default TalentVerification;
