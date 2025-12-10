export interface DramaScene {
  id: string;
  title: string;
  subtitle: string;
  description: string[];
  emoji: string;
  backgroundColor: string;
  textColor: string;
  alignment: 'left' | 'right' | 'center';
  imageHint?: string; // 심미적 요소를 위한 힌트 (배경 패턴 등)
}

export type ViewState = 'home' | 'drama'; // 단순화

export interface Chapter {
  id: string;
  title: string;
  emoji: string;
  prompt: string;
  color: string;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}