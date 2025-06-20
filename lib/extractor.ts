import { extract } from '@extractus/article-extractor';

export async function getReadableText(url: string): Promise<string> {
  try {
    // Validate URL format
    const urlObj = new URL(url);
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      throw new Error('無効なURL形式です。HTTPまたはHTTPS URLを入力してください。');
    }

    // Extract article content
    const article = await extract(url, {
      timeout: 10000,
    });

    if (!article) {
      throw new Error('記事の内容を取得できませんでした。');
    }

    // Combine title and content
    const title = article.title || '';
    const content = article.content || '';
    const description = article.description || '';

    // Create readable text from available content
    let readableText = '';
    if (title) readableText += title + '\n\n';
    if (description && description !== title) readableText += description + '\n\n';
    if (content) readableText += content;

    if (!readableText.trim()) {
      throw new Error('記事の本文を抽出できませんでした。');
    }

    // Limit to first 10KB for API efficiency
    const maxLength = 10000;
    if (readableText.length > maxLength) {
      readableText = readableText.substring(0, maxLength) + '...';
    }

    return readableText.trim();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('URLの処理中にエラーが発生しました。');
  }
}