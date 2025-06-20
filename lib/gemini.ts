interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

function countJapaneseCharacters(text: string): number {
  // Count all characters including Japanese characters
  return text.length;
}

function truncateToJapaneseCharacters(text: string, maxChars: number): string {
  if (countJapaneseCharacters(text) <= maxChars) {
    return text;
  }
  
  // Truncate and add ellipsis
  return text.substring(0, maxChars - 1) + '…';
}

export async function summarize(text: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('Gemini API キーが設定されていません。');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`;
  
  const systemPrompt = 'あなたはウェブ記事要約の専門家です。以下の本文を200文字以内でわかりやすく要約してください。';
  
  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: `${systemPrompt}\n\n記事本文:\n${text}`
          }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.3,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1024,
    },
    safetySettings: [
      {
        category: "HARM_CATEGORY_HARASSMENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_HATE_SPEECH",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      }
    ]
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      throw new Error(`Gemini API エラー: ${response.status}`);
    }

    const data: GeminiResponse = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('要約を生成できませんでした。');
    }

    const summary = data.candidates[0]?.content?.parts?.[0]?.text;
    
    if (!summary) {
      throw new Error('要約を生成できませんでした。');
    }

    // Ensure the summary is within 200 Japanese characters
    const truncatedSummary = truncateToJapaneseCharacters(summary.trim(), 200);
    
    return truncatedSummary;
  } catch (error) {
    console.error('Gemini API call failed:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('要約の生成中にエラーが発生しました。');
  }
}