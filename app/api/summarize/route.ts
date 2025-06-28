import { NextRequest, NextResponse } from 'next/server';
import { getReadableText } from '@/lib/extractor';
import { summarize } from '@/lib/gemini';

interface SummarizeRequest {
  url: string;
}

interface SummarizeResponse {
  summary?: string;
  error?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<SummarizeResponse>> {
  try {
    const body: SummarizeRequest = await request.json();
    
    if (!body.url) {
      return NextResponse.json(
        { error: 'URLが入力されていません。' },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      const urlObj = new URL(body.url);
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        return NextResponse.json(
          { error: '無効なURL形式です。HTTPまたはHTTPS URLを入力してください。' },
          { status: 400 }
        );
      }
    } catch {
      return NextResponse.json(
        { error: '無効なURL形式です。HTTPまたはHTTPS URLを入力してください。' },
        { status: 400 }
      );
    }

    // Extract readable text from URL
    let readableText: string;
    try {
      readableText = await getReadableText(body.url);
    } catch (error) {
      console.error('Text extraction error:', error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'ページの内容を取得できませんでした。' },
        { status: 500 }
      );
    }

    // Generate summary using Gemini
    let summary: string;
    try {
      const clientId = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
      summary = await summarize(readableText, clientId);
    } catch (error) {
      console.error('Summarization error:', error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : '要約の生成に失敗しました。' },
        { status: 500 }
      );
    }

    if (!summary.trim()) {
      return NextResponse.json(
        { error: '要約を生成できませんでした。記事の内容が不十分である可能性があります。' },
        { status: 500 }
      );
    }

    return NextResponse.json({ summary });

  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました。しばらく時間をおいて再度お試しください。' },
      { status: 500 }
    );
  }
}