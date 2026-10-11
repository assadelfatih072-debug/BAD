import * as pdfjsLib from 'pdfjs-dist';

// Configure worker safely
try {
  if (pdfjsLib && pdfjsLib.GlobalWorkerOptions) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '4.10.38'}/pdf.worker.min.mjs`;
  }
} catch (e) {
  console.warn('Could not set PDF worker URL', e);
}

export interface ExtractedPdfData {
  text: string;
  pageCount: number;
  detectedLanguage: 'en' | 'ar';
  detectedTopics: string[];
  samplePreview: string;
  base64: string;
}

// Convert a File or Blob into base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Strip off the data URL prefix (e.g. "data:application/pdf;base64,")
      const base64 = result.includes(',') ? result.split(',')[1] : result;
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

// Check if string contains Arabic characters
export const isArabicText = (text: string): boolean => {
  const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
  const arabicMatches = (text.match(arabicRegex) || []).length;
  // If more than 10% of characters or significant match
  const sample = text.slice(0, 500);
  let arabicCharCount = 0;
  for (let i = 0; i < sample.length; i++) {
    if (sample.charCodeAt(i) >= 0x0600 && sample.charCodeAt(i) <= 0x06ff) {
      arabicCharCount++;
    }
  }
  return arabicCharCount > 15;
};

// Extract text from PDF buffer
export const extractTextFromPdf = async (file: File): Promise<ExtractedPdfData> => {
  const base64 = await fileToBase64(file);
  const arrayBuffer = await file.arrayBuffer();

  let fullText = '';
  let pageCount = 0;

  try {
    const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
    const pdf = await loadingTask.promise;
    pageCount = pdf.numPages;

    const maxPagesToExtract = Math.min(pageCount, 40); // Read up to 40 pages for speed & safety

    for (let pageNum = 1; pageNum <= maxPagesToExtract; pageNum++) {
      try {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str || '')
          .join(' ');
        fullText += `\n--- Page ${pageNum} ---\n` + pageText;
      } catch (pageErr) {
        console.warn(`Failed to extract page ${pageNum}:`, pageErr);
      }
    }
  } catch (pdfErr) {
    console.warn('pdfjs-dist extraction notice:', pdfErr);
    // If PDF is scanned or pure images, fullText might be sparse,
    // but base64 is still intact for Gemini multimodal OCR!
  }

  // Detect language
  const detectedLanguage = isArabicText(fullText) ? 'ar' : 'en';

  // Extract detected topics / headings
  const detectedTopics: string[] = [];
  const lines = fullText
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 4 && l.length < 80);

  for (const line of lines) {
    if (
      /^[A-Z0-9\s:.-]{5,60}$/.test(line) ||
      /^Chapter\s+\d+/i.test(line) ||
      /^Section\s+\d+/i.test(line) ||
      /^[1-9]\.\s+[A-Z]/i.test(line) ||
      /^(الفيزيولوجيا|الأمراض|العلاج|التشخيص|الفصل|المبحث)/.test(line)
    ) {
      if (!detectedTopics.includes(line) && detectedTopics.length < 8) {
        detectedTopics.push(line);
      }
    }
  }

  if (detectedTopics.length === 0) {
    detectedTopics.push(
      detectedLanguage === 'ar' ? 'المفاهيم السريرية والطبية' : 'Core Clinical Concepts'
    );
  }

  return {
    text: fullText.trim(),
    pageCount: Math.max(pageCount, 1),
    detectedLanguage,
    detectedTopics,
    samplePreview: fullText.slice(0, 800) || '(No embedded text layer found; OCR processing will be applied via multimodal AI)',
    base64,
  };
};
