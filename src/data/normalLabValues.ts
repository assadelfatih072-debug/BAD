export interface LabReferenceCategory {
  category: string;
  categoryAr: string;
  items: Array<{
    name: string;
    nameAr: string;
    conventionalRange: string;
    siUnits: string;
  }>;
}

export const NORMAL_LAB_VALUES: LabReferenceCategory[] = [
  {
    category: 'Serum Electrolytes & Renal',
    categoryAr: 'كهارل المصل ووظائف الكلى',
    items: [
      { name: 'Sodium (Na+)', nameAr: 'الصوديوم', conventionalRange: '136–145 mEq/L', siUnits: '136–145 mmol/L' },
      { name: 'Potassium (K+)', nameAr: 'البوتاسيوم', conventionalRange: '3.5–5.0 mEq/L', siUnits: '3.5–5.0 mmol/L' },
      { name: 'Chloride (Cl-)', nameAr: 'الكلوريد', conventionalRange: '95–105 mEq/L', siUnits: '95–105 mmol/L' },
      { name: 'Bicarbonate (HCO3-)', nameAr: 'البيكربونات', conventionalRange: '22–28 mEq/L', siUnits: '22–28 mmol/L' },
      { name: 'Blood Urea Nitrogen (BUN)', nameAr: 'نيتروجين يوريا الدم', conventionalRange: '7–18 mg/dL', siUnits: '2.5–6.4 mmol/L' },
      { name: 'Serum Creatinine', nameAr: 'الكرياتينين', conventionalRange: '0.6–1.2 mg/dL', siUnits: '53–106 µmol/L' },
      { name: 'Serum Calcium', nameAr: 'الكالسيوم', conventionalRange: '8.4–10.2 mg/dL', siUnits: '2.1–2.6 mmol/L' },
      { name: 'Serum Phosphate', nameAr: 'الفوسفات', conventionalRange: '3.0–4.5 mg/dL', siUnits: '0.97–1.45 mmol/L' },
      { name: 'Serum Magnesium', nameAr: 'المغنيسيوم', conventionalRange: '1.5–2.0 mEq/L', siUnits: '0.75–1.0 mmol/L' },
      { name: 'Serum Uric Acid', nameAr: 'حمض اليوريك', conventionalRange: '3.0–8.2 mg/dL', siUnits: '0.18–0.48 mmol/L' },
    ],
  },
  {
    category: 'Arterial Blood Gas (ABG)',
    categoryAr: 'غازات الدم الشرياني',
    items: [
      { name: 'pH', nameAr: 'الرقم الهيدروجيني pH', conventionalRange: '7.35–7.45', siUnits: '[H+] 36–44 nmol/L' },
      { name: 'PaCO2', nameAr: 'الضغط الجزئي لثاني أكسيد الكربون', conventionalRange: '35–45 mmHg', siUnits: '4.7–6.0 kPa' },
      { name: 'PaO2', nameAr: 'الضغط الجزئي للأكسجين', conventionalRange: '80–100 mmHg', siUnits: '10.6–13.3 kPa' },
      { name: 'SaO2', nameAr: 'تشبع الأكسجين الشرياني', conventionalRange: '≥ 95%', siUnits: '≥ 0.95' },
    ],
  },
  {
    category: 'Complete Blood Count (CBC)',
    categoryAr: 'تعداد الدم الكامل',
    items: [
      { name: 'Hemoglobin (Male)', nameAr: 'الهيموغلوبين (ذكور)', conventionalRange: '13.5–17.5 g/dL', siUnits: '135–175 g/L' },
      { name: 'Hemoglobin (Female)', nameAr: 'الهيموغلوبين (إناث)', conventionalRange: '12.0–16.0 g/dL', siUnits: '120–160 g/L' },
      { name: 'Hematocrit (Male)', nameAr: 'الهيماتوكريت (ذكور)', conventionalRange: '41%–53%', siUnits: '0.41–0.53' },
      { name: 'Hematocrit (Female)', nameAr: 'الهيماتوكريت (إناث)', conventionalRange: '36%–46%', siUnits: '0.36–0.46' },
      { name: 'White Blood Cell (WBC)', nameAr: 'كريات الدم البيضاء', conventionalRange: '4,500–11,000 /mm³', siUnits: '4.5–11.0 × 10⁹/L' },
      { name: 'Platelet Count', nameAr: 'الصفائح الدموية', conventionalRange: '150,000–400,000 /mm³', siUnits: '150–400 × 10⁹/L' },
      { name: 'Mean Corpuscular Volume (MCV)', nameAr: 'الحجم الكريوي الوسطي', conventionalRange: '80–100 µm³', siUnits: '80–100 fL' },
    ],
  },
  {
    category: 'Hepatic & Metabolic Profile',
    categoryAr: 'وظائف الكبد والاستقلاب',
    items: [
      { name: 'Total Bilirubin', nameAr: 'البيليروبين الكلي', conventionalRange: '0.1–1.0 mg/dL', siUnits: '2–17 µmol/L' },
      { name: 'Direct Bilirubin', nameAr: 'البيليروبين المباشر', conventionalRange: '0.0–0.3 mg/dL', siUnits: '0–5 µmol/L' },
      { name: 'Alanine Aminotransferase (ALT)', nameAr: 'إنزيم ALT', conventionalRange: '8–20 U/L', siUnits: '8–20 U/L' },
      { name: 'Aspartate Aminotransferase (AST)', nameAr: 'إنزيم AST', conventionalRange: '8–20 U/L', siUnits: '8–20 U/L' },
      { name: 'Alkaline Phosphatase (ALP)', nameAr: 'الفوسفاتاز القلوية ALP', conventionalRange: '20–70 U/L', siUnits: '20–70 U/L' },
      { name: 'Fasting Plasma Glucose', nameAr: 'سكر الدم الصيامي', conventionalRange: '70–100 mg/dL', siUnits: '3.9–5.6 mmol/L' },
      { name: 'Hemoglobin A1c', nameAr: 'السكر التراكمي HbA1c', conventionalRange: '< 5.7%', siUnits: '< 39 mmol/mol' },
    ],
  },
];
