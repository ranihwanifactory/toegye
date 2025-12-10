import React, { useState, useEffect } from 'react';
import { Chapter } from '../types';
import { generateStoryContent } from '../services/geminiService';

interface StoryModeProps {
  onBack: () => void;
}

const chapters: Chapter[] = [
  { 
    id: 'intro', 
    title: '천 원짜리 지폐의 비밀', 
    emoji: '💸', 
    prompt: '천 원짜리 지폐에 그려진 퇴계 이황 선생님의 모습과 그 배경에 있는 건물(성균관/계상정)에 대한 이야기를 아주 재미있게.', 
    color: 'bg-green-100' 
  },
  { 
    id: 'childhood', 
    title: '책벌레 꼬마 이황', 
    emoji: '📚', 
    prompt: '어릴 때부터 책 읽기를 너무 좋아해서 몸이 아플 정도였던 꼬마 이황의 노력과 열정 이야기.', 
    color: 'bg-yellow-100' 
  },
  { 
    id: 'jar', 
    title: '투호 놀이와 마음 공부', 
    emoji: '🎯', 
    prompt: '항아리에 화살을 던지는 투호 놀이를 통해 마음을 집중하는 법을 가르쳤던 일화.', 
    color: 'bg-blue-100' 
  },
  { 
    id: 'politeness', 
    title: '동방의 예의 바른 할아버지', 
    emoji: '🙇', 
    prompt: '자신보다 나이가 훨씬 어린 사람이나 제자들에게도 항상 존댓말을 쓰고 예의를 지켰던 겸손한 모습.', 
    color: 'bg-purple-100' 
  },
];

const StoryMode: React.FC<StoryModeProps> = ({ onBack }) => {
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (selectedChapter) {
      setLoading(true);
      setContent('');
      generateStoryContent(selectedChapter.prompt)
        .then((text) => {
          setContent(text);
        })
        .finally(() => setLoading(false));
    }
  }, [selectedChapter]);

  const handleClose = () => {
    setSelectedChapter(null);
    setContent('');
  };

  return (
    <div className="w-full h-full flex flex-col items-center">
      <div className="w-full flex items-center justify-between p-4 mb-4">
        <button 
          onClick={onBack}
          className="text-stone-500 hover:text-stone-800 font-bold flex items-center gap-2 transition-colors"
        >
          ← 뒤로 가기
        </button>
        <h2 className="text-2xl font-bold text-stone-800 font-hand">이야기 보따리</h2>
        <div className="w-20"></div> {/* Spacer */}
      </div>

      {!selectedChapter ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl px-4 animate-fade-in-up">
          {chapters.map((chapter) => (
            <button
              key={chapter.id}
              onClick={() => setSelectedChapter(chapter)}
              className={`${chapter.color} hover:opacity-90 transition-transform transform hover:-translate-y-1 p-8 rounded-3xl shadow-lg border-2 border-stone-200 flex flex-col items-center text-center gap-4`}
            >
              <span className="text-6xl filter drop-shadow-md">{chapter.emoji}</span>
              <h3 className="text-2xl font-bold text-stone-800 break-keep">{chapter.title}</h3>
              <p className="text-stone-600">눌러서 이야기 듣기</p>
            </button>
          ))}
        </div>
      ) : (
        <div className="w-full max-w-2xl px-4 flex-1 flex flex-col pb-6 relative">
          <div className="bg-white rounded-3xl shadow-xl border-4 border-stone-100 overflow-hidden flex flex-col h-[70vh] md:h-[600px] relative">
            {/* Book Header */}
            <div className={`p-4 ${selectedChapter.color} flex justify-between items-center`}>
              <h3 className="text-xl font-bold text-stone-800 flex items-center gap-2">
                {selectedChapter.emoji} {selectedChapter.title}
              </h3>
              <button 
                onClick={handleClose}
                className="bg-white/50 hover:bg-white p-2 rounded-full transition-colors"
              >
                ✖
              </button>
            </div>

            {/* Book Content */}
            <div className="flex-1 p-6 md:p-10 overflow-y-auto story-scroll bg-stone-50">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-stone-400">
                  <div className="w-12 h-12 border-4 border-stone-300 border-t-stone-600 rounded-full animate-spin"></div>
                  <p className="animate-pulse">이야기를 짓고 있어요...</p>
                </div>
              ) : (
                <div className="prose prose-lg max-w-none">
                  {content.split('\n').map((line, idx) => (
                    line.trim() === '' ? <br key={idx} /> : 
                    <p key={idx} className="mb-4 text-stone-700 leading-relaxed font-medium">
                      {line}
                    </p>
                  ))}
                </div>
              )}
            </div>
            
            {/* Book Footer Decoration */}
            <div className="h-4 bg-stone-200 w-full"></div>
          </div>
          
          <div className="mt-6 text-center text-stone-500 text-sm">
            AI가 들려주는 이야기입니다. 실제 역사와 조금 다를 수 있어요.
          </div>
        </div>
      )}
    </div>
  );
};

export default StoryMode;