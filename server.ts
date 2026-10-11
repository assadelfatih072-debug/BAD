import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '60mb' }));
app.use(express.urlencoded({ extended: true, limit: '60mb' }));

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Health / Config endpoint
app.get('/api/config', (_req, res) => {
  res.json({
    hasGeminiKey: Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim() !== ''),
    model: 'gemini-3.8-flash',
  });
});

// MCQ Generation Endpoint
app.post('/api/generate-mcqs', async (req, res) => {
  try {
    const {
      studyMaterialText,
      pdfBase64,
      fileName,
      count = 10,
      difficulty = 'Mixed',
      style = 'mixed',
      language = 'en',
      topic = 'General Medical',
      medicalCategory = 'General Medical',
    } = req.body;

    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || !ai) {
      return res.status(503).json({
        error: 'API_KEY_UNAVAILABLE',
        message:
          'GEMINI_API_KEY is not configured on the server. Please attach an API key in the AI Studio Secrets panel or use the built-in verified medical question banks.',
      });
    }

    if (!studyMaterialText && !pdfBase64) {
      return res.status(400).json({
        error: 'MISSING_SOURCE_CONTENT',
        message: 'Please provide extracted text or uploaded PDF data.',
      });
    }

    const questionCount = Math.min(Math.max(parseInt(count, 10) || 10, 1), 50);

    const languageInstruction =
      language === 'ar'
        ? 'Generate all questions, options, rationales, and explanations in fluent academic Arabic (العربية الطبية). Include standard medical terms where appropriate.'
        : 'Generate all questions, options, rationales, and explanations in fluent professional English suitable for medical/health sciences university students.';

    const systemPrompt = `You are a Senior Medical Education Assessment Specialist and Board Examination Writer (USMLE / NBME / Royal College standard).
Your mission is to generate ${questionCount} multiple-choice questions (MCQs) strictly grounded in the provided study material.

Guidelines for Medical MCQ Quality:
1. Grounding: All questions must be strictly verifiable from the provided source material. Do not introduce unsupported external assertions.
2. Clinical vignettes & reasoning: Whenever the material describes pathophysiology, diagnosis, symptoms, or therapy, write clinical vignette style stems (patient age, sex, presenting symptoms, physical findings, laboratory data) requiring students to synthesize and apply knowledge rather than rote recall.
3. Plausible distractors: Provide exactly 4 options (A, B, C, D) with exactly one single best answer. Distractors must represent common clinical or mechanistic misconceptions.
4. Explanations:
   - Provide a comprehensive explanation detailing WHY the correct answer is right.
   - Explain physiological mechanisms, biochemical pathways, or anatomical relations.
   - Explicitly detail why each incorrect option (distractor) is wrong.
   - State the key underlying concept or mechanism.
   - Cite the relevant section, topic, or page topic if discernible from the text.
5. Language: ${languageInstruction}
6. Difficulty target: ${difficulty}.
7. Question style target: ${style} (e.g. clinical vignettes, mechanisms, factual recall, conceptual understanding, or comparisons).
8. Target medical category: ${medicalCategory}. Target topic: ${topic}.`;

    const promptText = `Please generate exactly ${questionCount} high-quality MCQs based on the following study material from "${fileName || 'Uploaded Material'}".

Format Requirements:
Return a JSON array of question objects adhering strictly to the schema.`;

    const parts: any[] = [];

    if (pdfBase64) {
      // If raw PDF base64 is provided, feed inline data to Gemini for native OCR & multimodal reasoning
      parts.push({
        inlineData: {
          mimeType: 'application/pdf',
          data: pdfBase64,
        },
      });
    }

    if (studyMaterialText) {
      parts.push({
        text: `Source Material Content:\n\n${studyMaterialText.slice(0, 150000)}`,
      });
    }

    parts.push({
      text: promptText,
    });

    const responseSchema = {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          question: {
            type: Type.STRING,
            description: 'The question stem or clinical vignette.',
          },
          options: {
            type: Type.ARRAY,
            description: 'Four mutually exclusive options labeled A, B, C, D.',
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING, description: 'A, B, C, or D' },
                text: { type: Type.STRING, description: 'Option text' },
              },
              required: ['id', 'text'],
            },
          },
          correctOptionId: {
            type: Type.STRING,
            description: 'The correct option ID, e.g. A, B, C, or D.',
          },
          explanation: {
            type: Type.OBJECT,
            properties: {
              correctRationale: {
                type: Type.STRING,
                description: 'Detailed explanation of why the correct option is the best answer.',
              },
              distractorRationales: {
                type: Type.OBJECT,
                properties: {
                  A: { type: Type.STRING },
                  B: { type: Type.STRING },
                  C: { type: Type.STRING },
                  D: { type: Type.STRING },
                },
                description: 'Brief rationale explaining why each other option is incorrect.',
              },
              keyMechanism: {
                type: Type.STRING,
                description: 'The primary physiological, biochemical, or clinical mechanism being tested.',
              },
              sourceReference: {
                type: Type.STRING,
                description: 'Specific topic heading, chapter, or concept referenced from the source.',
              },
            },
            required: ['correctRationale', 'keyMechanism'],
          },
          difficulty: {
            type: Type.STRING,
            description: 'Easy, Medium, or Hard',
          },
          style: {
            type: Type.STRING,
            description: 'Clinical Vignette, Mechanism, Conceptual, or Factual',
          },
          category: {
            type: Type.STRING,
            description: 'Medical discipline, e.g. Pathology, Pharmacology, Physiology, Internal Medicine',
          },
          topic: {
            type: Type.STRING,
            description: 'Specific topic within the discipline.',
          },
        },
        required: [
          'id',
          'question',
          'options',
          'correctOptionId',
          'explanation',
          'difficulty',
          'style',
        ],
      },
    };

    const result = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: { parts },
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema,
        temperature: 0.3, // Lower temperature for grounded factual accuracy
      },
    });

    const responseText = result.text;
    if (!responseText) {
      throw new Error('Gemini returned an empty response.');
    }

    const generatedQuestions = JSON.parse(responseText);

    // Validate questions and ensure options are clean
    const sanitized = (generatedQuestions || []).map((q: any, index: number) => {
      const qId = q.id || `q-${index + 1}`;
      const options = Array.isArray(q.options) && q.options.length >= 4
        ? q.options.slice(0, 4)
        : [
            { id: 'A', text: q.options?.[0]?.text || 'Option A' },
            { id: 'B', text: q.options?.[1]?.text || 'Option B' },
            { id: 'C', text: q.options?.[2]?.text || 'Option C' },
            { id: 'D', text: q.options?.[3]?.text || 'Option D' },
          ];

      // Standardize option IDs to A, B, C, D
      const standardOptions = options.map((opt: any, optIdx: number) => ({
        id: ['A', 'B', 'C', 'D'][optIdx],
        text: opt.text || `Option ${['A', 'B', 'C', 'D'][optIdx]}`,
      }));

      const validCorrect = ['A', 'B', 'C', 'D'].includes(q.correctOptionId)
        ? q.correctOptionId
        : 'A';

      return {
        id: qId,
        question: q.question,
        options: standardOptions,
        correctOptionId: validCorrect,
        explanation: {
          correctRationale:
            q.explanation?.correctRationale || 'No rationale provided.',
          distractorRationales: q.explanation?.distractorRationales || {},
          keyMechanism: q.explanation?.keyMechanism || 'Core medical concept',
          sourceReference:
            q.explanation?.sourceReference || fileName || 'Uploaded document',
        },
        difficulty: q.difficulty || difficulty || 'Medium',
        style: q.style || style || 'Conceptual',
        category: q.category || medicalCategory || 'Medical Sciences',
        topic: q.topic || topic || 'Core Curriculum',
      };
    });

    return res.json({
      success: true,
      questions: sanitized,
      count: sanitized.length,
    });
  } catch (error: any) {
    console.error('MCQ Generation Error:', error);
    return res.status(500).json({
      error: 'GENERATION_FAILED',
      message: error?.message || 'Failed to generate MCQs from provided material.',
    });
  }
});

// Vite dev server mounting or static file serving
const startServer = async () => {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`MedQExam server running at http://0.0.0.0:${port}`);
  });
};

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
