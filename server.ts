import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini AI Client lazily or safely
let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return aiClient;
}

// API Route for AI Weather Intelligence & Recommendations
app.post('/api/ai-weather-insights', async (req, res) => {
  try {
    const ai = getAiClient();
    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API Key is not configured on the server.',
        fallback: true
      });
    }

    const { city, country, current, dailySummary } = req.body || {};

    if (!city || !current) {
      return res.status(400).json({ error: 'Missing weather context payload' });
    }

    const prompt = `You are an expert Meteorological AI Intelligence Advisor.
Analyze the following weather data for ${city}, ${country || ''}:
- Current Temperature: ${current.temp}°C (Apparent: ${current.apparentTemp}°C)
- Weather Condition: ${current.conditionLabel}
- Relative Humidity: ${current.humidity}%
- Wind Speed: ${current.windSpeed} km/h (Gusts: ${current.windGusts || 0} km/h)
- UV Index: ${current.uvIndex}
- Precipitation Probability: ${current.precipProb || 0}%
- Next 7 Days Summary: ${JSON.stringify(dailySummary || [])}

Provide actionable weather intelligence and recommendations in structured JSON format. Ensure all recommendations are practical, concise, engaging, and directly tailored to the atmospheric data.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are WeatherIntel AI, an elite meteorologist and lifestyle weather assistant. Provide high-accuracy, practical clothing, outdoor activity, and health safety guidance based on raw meteorological data.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: 'A punchy 1-2 sentence atmospheric summary and headline for the city.'
            },
            executiveBrief: {
              type: Type.STRING,
              description: 'Detailed analysis of temperature trend, comfort index, and weather highlights over the next 24-48 hours.'
            },
            outfitRecommendation: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'List of recommended clothing layers, footwear, and accessories.'
            },
            activityAdvice: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Specific advice for outdoor sports, commuting, running, and weekend plans.'
            },
            healthAndSafety: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'UV protection tips, hydration guidance, air quality/pollen notes, or heat/cold alerts.'
            },
            travelWarning: {
              type: Type.STRING,
              description: 'Optional severe weather or commute caution (e.g. heavy rain, wind gusts, fog, zero visibility).'
            }
          },
          required: ['summary', 'executiveBrief', 'outfitRecommendation', 'activityAdvice', 'healthAndSafety']
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error('Empty response from Gemini AI');
    }

    const parsedData = JSON.parse(text);
    return res.json({
      ...parsedData,
      generatedAt: new Date().toISOString()
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to generate AI insights';
    console.error('Gemini AI Weather Insights Error:', errorMsg);
    return res.status(500).json({
      error: errorMsg,
      fallback: true
    });
  }
});

// Vite middleware or production static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Weather Intelligence Express Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
