// app/api/analyze/route.js
import { NextResponse } from 'next/server';
import Sentiment from 'sentiment';

const sentiment = new Sentiment();

export async function POST(request) {
  const { text } = await request.json();
  const sentences = text.match(/[^\.!\?]+[\.!\?]+/g) || [];

  const sentimentData = sentences.map((sentence, index) => {
    const analysis = sentiment.analyze(sentence);
    return {
      index,
      text: sentence.trim(),
      sentiment: analysis.score, 
    };
  });

  const chunkData = getPercentageValues(text, 20);  // Always use 20 chunks

  return NextResponse.json({ sentimentData, chunkData });
}

function getPercentageValues(text, numChunks) {
  const sentences = text.match(/[^\.!\?]+[\.!\?]+/g) || [];
  const chunkSize = Math.ceil(sentences.length / numChunks);

  return Array.from({ length: numChunks }, (_, i) => {
    const chunk = sentences.slice(i * chunkSize, (i + 1) * chunkSize);
    const chunkText = chunk.join(' ');
    const analysis = sentiment.analyze(chunkText);
    return {
      chunk: i + 1,
      sentiment: analysis.score / chunk.length, // Normalize by chunk size
      text: chunkText.length > 200 ? chunkText.slice(0, 200) + '...' : chunkText, // Truncate long chunks
    };
  });
}