import React, { useEffect, useRef, useState } from 'react';
import { DramaScene } from './types';

// --- 콘텐츠 데이터 (AI 없이 하드코딩된 스토리) ---
const scenes: DramaScene[] = [
  {
    id: 'intro',
    title: '1,000원의 주인공',
    subtitle: '우리가 매일 만나는 할아버지',
    description: [
      "친구들, 혹시 천 원짜리 지폐를 자세히 본 적 있나요?",
      "지폐 앞면에 그려진 인자한 표정의 할아버지,",
      "이분이 바로 조선 시대 최고의 선생님,",
      "퇴계 이황 선생님이랍니다."
    ],
    emoji: '💶',
    backgroundColor: 'bg-indigo-50',
    textColor: 'text-indigo-900',
    alignment: 'center',
  },
  {
    id: 'childhood',
    title: '책벌레 꼬마 이황',
    subtitle: '밥 먹는 것도 잊을 만큼 책이 좋아',
    description: [
      "이황 선생님은 어릴 때부터 소문난 책벌레였어요.",
      "얼마나 책을 좋아했는지, 밥 먹는 것도 잊고",
      "밤새도록 책을 읽다가 몸이 아프기도 했대요.",
      "어머니가 '제발 나가서 좀 놀아라' 하고 걱정하실 정도였죠."
    ],
    emoji: '📚',
    backgroundColor: 'bg-yellow-50',
    textColor: 'text-amber-900',
    alignment: 'left',
  },
  {
    id: 'tuho',
    title: '마음을 집중하는 놀이',
    subtitle: '투호 던지기와 마음 공부',
    description: [
      "선생님은 공부하다 머리가 복잡해지면 '투호' 놀이를 했어요.",
      "항아리에 화살을 슝~ 던져 넣으려면",
      "마음을 차분하게 가라앉히고 집중해야 했거든요.",
      "놀이조차도 선생님에게는 마음 공부였답니다."
    ],
    emoji: '🎯',
    backgroundColor: 'bg-green-50',
    textColor: 'text-green-900',
    alignment: 'right',
  },
  {
    id: 'respect',
    title: '동방의 예의 바른 분',
    subtitle: '누구에게나 존댓말을 썼어요',
    description: [
      "이황 선생님은 예의가 무척 바르셨어요.",
      "제자들은 물론이고, 집안일을 도와주는 분들에게도",
      "항상 고운 말을 쓰고 존중해주셨답니다.",
      "자신을 낮추고 남을 높이는 겸손한 마음을 가지셨죠."
    ],
    emoji: '🙇',
    backgroundColor: 'bg-purple-50',
    textColor: 'text-purple-900',
    alignment: 'left',
  },
  {
    id: 'dosan',
    title: '도산서원의 가르침',
    subtitle: '자연 속에서 제자들을 가르치다',
    description: [
      "선생님은 고향으로 돌아와 '도산서원'을 지으셨어요.",
      "아름다운 산과 강이 있는 곳에서",
      "많은 제자들과 함께 공부하며 지혜를 나누셨죠.",
      "지금도 안동에 가면 그 멋진 곳을 볼 수 있어요!"
    ],
    emoji: '🏫',
    backgroundColor: 'bg-stone-100',
    textColor: 'text-stone-800',
    alignment: 'center',
  },
  {
    id: 'outro',
    title: '오늘의 교훈',
    subtitle: '퇴계 선생님이 우리에게 전하는 말',
    description: [
      "\"착한 마음을 가지고, 매일 조금씩 배우렴.\"",
      "1,000원짜리 지폐를 볼 때마다",
      "퇴계 선생님의 따뜻한 마음을 기억해 볼까요?"
    ],
    emoji: '🌟',
    backgroundColor: 'bg-slate-900',
    textColor: 'text-white',
    alignment: 'center',
  }
];

// --- 컴포넌트: 개별 씬 (Scene) ---
const Scene: React.FC<{ data: DramaScene }> = ({ data }) => {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => setVisible(entry.isIntersecting));
    }, { threshold: 0.3 }); // 30% 보이면 등장

    if (domRef.current) observer.observe(domRef.current);
    return () => observer.disconnect();
  }, []);

  const alignmentClass = 
    data.alignment === 'left' ? 'md:flex-row' : 
    data.alignment === 'right' ? 'md:flex-row-reverse' : 'flex-col text-center';

  return (
    <div 
      ref={domRef}
      className={`min-h-screen flex items-center justify-center p-6 md:p-20 relative overflow-hidden transition-colors duration-700 ${data.backgroundColor}`}
    >
      {/* 배경 장식 요소 (큰 이모지 흐릿하게) */}
      <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[20rem] opacity-5 pointer-events-none select-none transition-transform duration-[2s] ${isVisible ? 'scale-110 rotate-12' : 'scale-90 rotate-0'}`}>
        {data.emoji}
      </div>

      <div className={`relative z-10 w-full max-w-6xl flex gap-10 items-center justify-center ${alignmentClass} fade-in-section ${isVisible ? 'is-visible' : ''}`}>
        
        {/* 이미지/이모지 영역 */}
        <div className="flex-1 flex justify-center">
          <div className={`w-64 h-64 md:w-96 md:h-96 bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl border-4 border-white/50 transform transition-all duration-1000 ${isVisible ? 'scale-100 translate-y-0' : 'scale-75 translate-y-10'}`}>
            <span className="text-9xl md:text-[10rem] drop-shadow-lg filter">{data.emoji}</span>
          </div>
        </div>

        {/* 텍스트 영역 */}
        <div className="flex-1 space-y-6">
          <div className="inline-block px-4 py-1 rounded-full bg-black/5 text-black/60 font-bold text-sm tracking-widest uppercase mb-2">
            Story of Toegye
          </div>
          <h2 className={`text-3xl md:text-5xl font-bold font-serif-kr leading-tight ${data.textColor}`}>
            {data.title}
          </h2>
          <h3 className={`text-xl md:text-2xl font-hand opacity-80 ${data.textColor}`}>
            {data.subtitle}
          </h3>
          <div className={`space-y-4 text-lg md:text-xl leading-relaxed font-medium opacity-90 ${data.textColor}`}>
            {data.description.map((line, idx) => (
              <p key={idx} className="break-keep">{line}</p>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

// --- 메인 앱 컴포넌트 ---
const App: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleScroll = () => {
    const totalScroll = document.documentElement.scrollTop;
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scroll = `${totalScroll / windowHeight}`;
    setScrollProgress(Number(scroll));
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="w-full paper-texture">
      {/* 상단 진행 바 */}
      <div className="fixed top-0 left-0 w-full h-2 z-50 bg-gray-200">
        <div 
          className="h-full bg-indigo-500 transition-all duration-100 ease-out"
          style={{ width: `${scrollProgress * 100}%` }}
        ></div>
      </div>

      {/* 헤더 */}
      <header className="fixed top-0 left-0 w-full p-6 z-40 flex justify-between items-center pointer-events-none">
        <span className="font-serif-kr font-bold text-xl text-stone-800 bg-white/80 px-4 py-2 rounded-full backdrop-blur shadow-sm">
          퇴계 이황
        </span>
      </header>

      {/* 드라마 씬 렌더링 */}
      <main>
        {scenes.map((scene) => (
          <Scene key={scene.id} data={scene} />
        ))}
      </main>

      {/* 푸터 */}
      <footer className="bg-stone-900 text-stone-400 py-12 text-center">
        <p className="font-hand text-2xl mb-4">"배움에는 끝이 없단다."</p>
        <p className="text-sm opacity-50">Designed for Children • 퇴계 이황 이야기</p>
      </footer>
    </div>
  );
};

export default App;