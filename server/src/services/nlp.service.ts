import { config } from '../config/env';

interface NlpResponse {
  sentiment: string;
  compound_score: number;
  pos: number;
  neg: number;
  neu: number;
}

export async function analyzeSentiment(text: string): Promise<NlpResponse> {
  const response = await fetch(`${config.nlpServiceUrl}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    throw new Error(`NLP service error: ${response.status}`);
  }

  return response.json();
}
