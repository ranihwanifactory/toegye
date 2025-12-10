import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to generate story content
export const generateStoryContent = async (topicPrompt: string): Promise<string> => {
  if (!apiKey) return "API Key가 설정되지 않았습니다. 데모 모드입니다.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `퇴계 이황 선생님에 대한 다음 주제로 7세~10세 어린이에게 들려주는 동화책 스타일의 이야기를 작성해줘: "${topicPrompt}".
      
      조건:
      1. 아이들이 이해하기 쉬운 단어를 사용해요.
      2. "~했어요", "~했답니다" 같은 친근한 말투를 사용해요.
      3. 교육적인 교훈을 부드럽게 포함해요.
      4. 문단은 3-4개로 나누고, 이모지를 적절히 섞어서 재미있게 만들어주세요.
      5. markdown 형식은 쓰지 말고 일반 텍스트로 줄바꿈을 잘 해서 주세요.`,
    });
    
    return response.text || "이야기를 불러오는 데 실패했어요.";
  } catch (error) {
    console.error("Error generating story:", error);
    return "죄송해요, 이야기를 잠시 불러올 수 없어요. 잠시 후 다시 시도해주세요.";
  }
};

// Helper for chat interaction
export const sendChatMessage = async (history: { role: string; parts: { text: string }[] }[], newMessage: string): Promise<string> => {
  if (!apiKey) return "API Key가 없습니다.";

  try {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: `당신은 조선 시대 최고의 유학자 '퇴계 이황'입니다. 
        하지만 지금은 21세기의 어린이들과 대화하기 위해 왔습니다.
        
        성격:
        1. 매우 점잖지만 아이들을 사랑하고 친절합니다.
        2. 어려운 한자어보다는 쉬운 말로 풀어서 설명합니다.
        3. 공부의 중요성보다는 '착한 마음'과 '배려'를 더 강조합니다.
        4. 가끔 "허허허" 하고 웃으며 여유로운 모습을 보여주세요.
        5. 자신을 '할아버지' 또는 '이황 선생님'이라고 칭하세요.
        
        지식:
        1. 1000원짜리 지폐에 자신이 그려져 있다는 것을 알고 있습니다.
        2. 도산서원, 매화, 예의범절에 대해 잘 압니다.`,
      },
      history: history,
    });

    const response = await chat.sendMessage({ message: newMessage });
    return response.text || "허허, 무슨 말인지 잘 못 들었구나.";
  } catch (error) {
    console.error("Chat error:", error);
    return "지금은 대답하기가 조금 힘들구나. 잠시 쉬었다 오렴.";
  }
};