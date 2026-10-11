import { StudyModule } from '../types/exam';

export const SAMPLE_STUDY_MODULES: StudyModule[] = [
  {
    id: 'cardiology-hemodynamics',
    title: 'Cardiovascular Hemodynamics & Ischemic Heart Disease',
    titleAr: 'ديناميكا الدم القلبية والاعتلال الإقفاري',
    category: 'Cardiovascular',
    description:
      'Pressure-volume relationships, coronary artery perfusion, acute coronary syndromes, valvular mechanics, and inotropic pharmacology.',
    descriptionAr:
      'علاقات الضغط والحجم، تروية الشرايين التاجية، متلازمات الشريان التاجي الحادة، اعتلال الصمامات، وعلم الأدوية القلبية.',
    sampleText: `Cardiovascular Pathophysiology & Hemodynamics:
Coronary blood flow to the left ventricle occurs predominantly during diastole because during systole, intramuscular compressive forces collapse intramyocardial vessels. Coronary perfusion pressure (CPP) is calculated as aortic diastolic pressure minus left ventricular end-diastolic pressure (CPP = DBP - LVEDP).
In aortic stenosis, the classic triad comprises exertional dyspnea, angina, and syncope. The murmur is a crescendo-decrescendo systolic ejection murmur radiating to the carotids, with delayed and diminished carotid pulses (pulsus parvus et tardus). LVEDP rises significantly due to concentric left ventricular hypertrophy.
In acute myocardial infarction, transmural ischemia causes ST-segment elevation. Revascularization within 90 minutes reduces mortality. Nitroglycerin reduces myocardial oxygen demand predominantly by systemic venodilation, which lowers preload and decreases ventricular wall tension according to Laplace's Law (Wall Stress = P * r / (2 * h)). Beta-blockers reduce myocardial oxygen consumption by decreasing heart rate and contractility.`,
    verifiedQuestions: [
      {
        id: 'cv-q1',
        question:
          'A 68-year-old male presents with exertional lightheadedness and chest discomfort over the past 4 months. Physical examination reveals a harsh, late-peaking systolic murmur at the right second intercostal space that radiates to the carotid arteries. His carotid upstrokes are weak and delayed. Which of the following hemodynamic parameters is most characteristically elevated in this patient?',
        options: [
          { id: 'A', text: 'Left ventricular end-diastolic pressure' },
          { id: 'B', text: 'Aortic pulse pressure' },
          { id: 'C', text: 'Pulmonary capillary wedge pressure during diastole only' },
          { id: 'D', text: 'Systemic vascular compliance' },
        ],
        correctOptionId: 'A',
        explanation: {
          correctRationale:
            'This patient presents with classic severe aortic stenosis (exertional syncope/angina, crescendo-decrescendo systolic murmur, pulsus parvus et tardus). In response to chronic pressure overload, the left ventricle develops concentric hypertrophy, which decreases ventricular compliance and substantially raises left ventricular end-diastolic pressure (LVEDP).',
          distractorRationales: {
            B: 'Aortic pulse pressure is narrowed (diminished), not widened, due to delayed and reduced stroke volume through the stenotic orifice.',
            C: 'While PCWP may elevate secondary to diastolic dysfunction, it is not elevated solely during diastole.',
            D: 'Systemic vascular compliance is not increased; chronic arterial stiffness may actually be normal or decreased.',
          },
          keyMechanism:
            'Concentric left ventricular hypertrophy secondary to fixed systolic outflow tract obstruction reduces diastolic compliance.',
          sourceReference: 'Cardiovascular Hemodynamics & Valvular Mechanics, Section 3.2',
        },
        difficulty: 'Medium',
        style: 'Clinical Vignette',
        category: 'Cardiovascular',
        topic: 'Aortic Stenosis & Hemodynamics',
      },
      {
        id: 'cv-q2',
        question:
          'Sublingual nitroglycerin is administered to a patient experiencing acute stable angina. Which hemodynamic mechanism is primarily responsible for the rapid symptomatic relief of myocardial ischemia?',
        options: [
          { id: 'A', text: 'Selective dilatation of coronary arterioles causing microvascular hyperemia' },
          { id: 'B', text: 'Systemic venodilation resulting in decreased left ventricular preload and wall stress' },
          { id: 'C', text: 'Direct inhibition of cardiac beta-1 adrenergic receptors' },
          { id: 'D', text: 'Reflex bradycardia mediated by aortic arch baroreceptors' },
        ],
        correctOptionId: 'B',
        explanation: {
          correctRationale:
            'Organic nitrates undergo bioactivation to nitric oxide (NO) in vascular smooth muscle. At therapeutic sublingual doses, nitroglycerin preferentially dilates large capacitance veins. This reduces venous return to the heart, decreasing left ventricular end-diastolic volume and pressure (preload), which according to the Law of Laplace decreases myocardial wall stress and oxygen demand.',
          distractorRationales: {
            A: 'Selective arteriolar dilation can induce coronary steal phenomenon; nitrates act primarily on venous capacitance vessels and epicardial conduits.',
            C: 'Nitroglycerin does not block adrenergic receptors.',
            D: 'Arterial vasodilation may trigger mild reflex tachycardia, not bradycardia.',
          },
          keyMechanism:
            'Venous capacitance pooling decreases end-diastolic wall tension (Laplace: Stress = P × r / 2h).',
          sourceReference: 'Coronary Pharmacology & Anti-anginal Therapeutics, Section 4.1',
        },
        difficulty: 'Medium',
        style: 'Mechanism/Pathophysiology',
        category: 'Pharmacology',
        topic: 'Anti-anginal Hemodynamics',
      },
      {
        id: 'cv-q3',
        question:
          'Under normal physiological resting conditions, coronary perfusion to the subendocardium of the left ventricle occurs predominantly during which phase of the cardiac cycle?',
        options: [
          { id: 'A', text: 'Isovolumetric ventricular contraction' },
          { id: 'B', text: 'Rapid ventricular ejection' },
          { id: 'C', text: 'Ventricular diastole' },
          { id: 'D', text: 'Reduced ventricular ejection' },
        ],
        correctOptionId: 'C',
        explanation: {
          correctRationale:
            'During ventricular systole, myocardial contraction compresses the intramyocardial vessels of the thick left ventricle, elevating intramyocardial tissue pressure above coronary luminal pressure and arresting forward flow. During diastole, cardiac relaxation relieves this mechanical compression, allowing high driving pressure (aortic diastolic pressure minus LVEDP) to perfuse the myocardium.',
          distractorRationales: {
            A: 'Intramyocardial pressure is highest during isovolumetric contraction and early systole, minimizing flow.',
            B: 'Coronary vessels are compressed by peak ventricular systolic tension.',
            D: 'Systolic compression persists throughout ejection phases.',
          },
          keyMechanism:
            'Intramyocardial tissue pressure exceeds intracoronary pressure during systole, restricting flow to diastole.',
          sourceReference: 'Coronary Microcirculation & Perfusion Dynamics, Section 1.4',
        },
        difficulty: 'Easy',
        style: 'Mechanism/Pathophysiology',
        category: 'Cardiovascular',
        topic: 'Coronary Perfusion Dynamics',
      },
      {
        id: 'cv-q4',
        question:
          'A 55-year-old male with acute anterior myocardial infarction develops sudden pulmonary edema and a new holosystolic murmur at the cardiac apex radiating to the axilla on hospital day 4. What mechanical complication is most likely?',
        options: [
          { id: 'A', text: 'Ventricular free wall rupture' },
          { id: 'B', text: 'Papillary muscle rupture with acute mitral regurgitation' },
          { id: 'C', text: 'Ventricular pseudoaneurysm formation' },
          { id: 'D', text: 'Post-infarction fibrinous pericarditis' },
        ],
        correctOptionId: 'B',
        explanation: {
          correctRationale:
            'Rupture of the posteromedial papillary muscle occurs 3 to 5 days post-MI due to single blood supply (usually posterior descending artery). This leads to acute severe mitral regurgitation, torrential backward flow into the non-compliant left atrium, sudden pulmonary congestion, and a prominent apical holosystolic murmur.',
          distractorRationales: {
            A: 'Free wall rupture causes hemopericardium, cardiac tamponade, electromechanical dissociation, and muffled heart sounds without an apical regurgitant murmur.',
            C: 'Pseudoaneurysms occur late and present as pulsatile lesions or rupture.',
            D: 'Pericarditis typically presents on days 1-3 with pleuritic chest pain and a pericardial friction rub, not flash pulmonary edema or holosystolic regurgitant murmurs.',
          },
          keyMechanism:
            'Ischemic necrosis of single-source papillary muscle causing acute chordal detachment and mitral incompetence.',
          sourceReference: 'Complications of Acute Myocardial Infarction, Section 5.3',
        },
        difficulty: 'Hard',
        style: 'Clinical Vignette',
        category: 'Pathology & Immunology',
        topic: 'Post-Infarction Mechanical Complications',
      },
    ],
  },
  {
    id: 'renal-acid-base',
    title: 'Renal Physiology, Electrolytes & Acid-Base Balance',
    titleAr: 'فسيولوجيا الكلى والتوازن الحمضي القاعدي',
    category: 'Renal & Acid-Base',
    description:
      'Glomerular filtration dynamics, tubuloglomerular feedback, loop vs thiazide diuretics, Henderson-Hasselbalch acid-base disturbances, and acute kidney injury.',
    descriptionAr:
      'آليات الترشيح الكبيبي، التغذية الراجعة الأنبوبية، مدرات البول، اضطرابات التوازن الحمضي القاعدي والقصور الكلوي الحاد.',
    sampleText: `Renal Physiology and Acid-Base Homeostasis:
Glomerular filtration rate (GFR) is governed by Starling forces: GFR = Kf * [(Pgc - Pbs) - (πgc - πbs)]. Angiotensin II preferentially constricts the efferent arteriole, increasing intraglomerular hydrostatic pressure (Pgc) and maintaining GFR when renal perfusion drops. Prostaglandins preferentially dilate the afferent arteriole.
Loop diuretics (furosemide) inhibit the apical Na-K-2Cl cotransporter (NKCC2) in the thick ascending limb of the loop of Henle, abolishing the hypertonic medullary gradient and causing profound diuresis with calcium wasting. In contrast, thiazide diuretics inhibit Na-Cl cotransporter (NCCT) in the distal convoluted tubule and enhance calcium reabsorption.
Acid-base disorders: Normal anion gap = Na - (Cl + HCO3) = 10-12 mEq/L. High anion gap metabolic acidosis (HAGMA) causes include ketoacidosis, lactic acidosis, uremia, and toxic ingestions (methanol, ethylene glycol, salicylates). In metabolic acidosis, respiratory compensation follows Winter's formula: expected PaCO2 = 1.5 * [HCO3-] + 8 ± 2.`,
    verifiedQuestions: [
      {
        id: 'rn-q1',
        question:
          'A 24-year-old woman with type 1 diabetes presents with lethargy, vomiting, and deep, rapid respirations. Serum laboratory values show: Na+ 136 mEq/L, K+ 5.2 mEq/L, Cl- 98 mEq/L, HCO3- 10 mEq/L, arterial blood pH 7.22, and PaCO2 23 mmHg. Which of the following is the most accurate assessment of her acid-base status?',
        options: [
          { id: 'A', text: 'High anion gap metabolic acidosis with appropriate respiratory compensation' },
          { id: 'B', text: 'Normal anion gap metabolic acidosis with concomitant respiratory alkalosis' },
          { id: 'C', text: 'High anion gap metabolic acidosis with superimposed respiratory acidosis' },
          { id: 'D', text: 'Pure primary respiratory acidosis with secondary metabolic compensation' },
        ],
        correctOptionId: 'A',
        explanation: {
          correctRationale:
            'Her serum anion gap is 136 - (98 + 10) = 28 mEq/L (normal is 10-12), confirming high anion gap metabolic acidosis (diabetic ketoacidosis). Applying Winter\'s formula: Expected PaCO2 = 1.5 × [HCO3-] + 8 ± 2 = 1.5(10) + 8 ± 2 = 23 ± 2 mmHg (range 21–25 mmHg). Since the measured PaCO2 is 23 mmHg, this represents appropriate respiratory compensation.',
          distractorRationales: {
            B: 'The anion gap is 28 mEq/L, which is markedly elevated, not normal.',
            C: 'PaCO2 is 23 mmHg, precisely within the expected compensation range (21-25 mmHg); respiratory acidosis would be present if PaCO2 were > 25 mmHg.',
            D: 'The primary disorder is metabolic acidosis with low bicarbonate (10 mEq/L) and low pH (7.22).',
          },
          keyMechanism:
            'Accumulation of unmeasured ketoacids (beta-hydroxybutyrate, acetoacetate) consumed bicarbonate; Winter formula predicts hyperventilatory respiratory compensation.',
          sourceReference: 'Acid-Base Disturbances & Diagnostic Algorithm, Section 2.1',
        },
        difficulty: 'Medium',
        style: 'Clinical Vignette',
        category: 'Renal & Acid-Base',
        topic: 'Metabolic Acidosis & Compensation',
      },
      {
        id: 'rn-q2',
        question:
          'A patient with congestive heart failure is initiated on high-dose furosemide. By what molecular mechanism does this agent reduce urinary concentrating ability?',
        options: [
          { id: 'A', text: 'Inhibition of the Na+/Cl- cotransporter in the early distal convoluted tubule' },
          { id: 'B', text: 'Inhibition of the Na+/K+/2Cl- cotransporter in the thick ascending limb of Henle' },
          { id: 'C', text: 'Blockade of basolateral V2 vasopressin receptors in collecting duct principal cells' },
          { id: 'D', text: 'Antagonism of apical epithelial sodium channels (ENaC) in the cortical collecting tubule' },
        ],
        correctOptionId: 'B',
        explanation: {
          correctRationale:
            'Furosemide reversibly binds and inhibits the luminal Na+/K+/2Cl- cotransporter (NKCC2) in the thick ascending limb of the loop of Henle. Because the thick ascending limb is the engine of the countercurrent multiplier, inhibiting solute reabsorption disrupts the hypertonic medullary interstitium necessary for water reabsorption in the collecting ducts.',
          distractorRationales: {
            A: 'Inhibition of the Na+/Cl- cotransporter in the distal convoluted tubule is the mechanism of thiazide diuretics.',
            C: 'V2 receptor antagonism is the mechanism of vaptans (tolvaptan/conivaptan).',
            D: 'ENaC blockade in collecting tubule principal cells is the mechanism of potassium-sparing diuretics (amiloride/triamterene).',
          },
          keyMechanism:
            'Disruption of the medullary hyperosmolar gradient generated by active NaCl transport in the thick ascending limb.',
          sourceReference: 'Diuretic Pharmacology & Tubular Transport, Section 3.4',
        },
        difficulty: 'Easy',
        style: 'Mechanism/Pathophysiology',
        category: 'Pharmacology',
        topic: 'Tubular Diuretic Mechanisms',
      },
      {
        id: 'rn-q3',
        question:
          'In a state of acute bilateral renal hypoperfusion (e.g., severe hypovolemia), how do intrarenal vasoactive mediators adjust vascular resistance to preserve glomerular filtration rate?',
        options: [
          { id: 'A', text: 'Endothelin-1 constricts the afferent arteriole; nitric oxide dilates the efferent arteriole' },
          { id: 'B', text: 'Prostaglandins dilate the afferent arteriole; angiotensin II constricts the efferent arteriole' },
          { id: 'C', text: 'Adenosine dilates the afferent arteriole; norepinephrine constricts the efferent arteriole' },
          { id: 'D', text: 'Dopamine constricts both afferent and efferent arterioles equally' },
        ],
        correctOptionId: 'B',
        explanation: {
          correctRationale:
            'During hypoperfusion, renal prostaglandins (PGE2, PGI2) preferentially dilate the afferent arteriole to minimize resistance to inflow. Concurrently, systemic renin-angiotensin activation produces Angiotensin II, which preferentially constricts the efferent arteriole, increasing intraglomerular hydrostatic pressure (Pgc) and preserving filtration fraction.',
          distractorRationales: {
            A: 'Endothelin-1 constriction of afferent arteriole would sharply drop glomerular capillary pressure and precipitate acute renal shutdown.',
            C: 'Adenosine constricts the afferent arteriole via tubuloglomerular feedback.',
            D: 'Low-dose dopamine causes renal vasodilatation, not equal bilateral constriction.',
          },
          keyMechanism:
            'Afferent vasodilatation paired with efferent vasoconstriction maintains intraglomerular capillary hydrostatic pressure.',
          sourceReference: 'Autoregulation of Glomerular Filtration, Section 1.2',
        },
        difficulty: 'Medium',
        style: 'Comparison',
        category: 'Renal & Acid-Base',
        topic: 'Renal Autoregulation',
      },
    ],
  },
  {
    id: 'pharmacology-antimicrobials',
    title: 'Clinical Pharmacology: Antimicrobial Mechanisms & Resistance',
    titleAr: 'علم الأدوية السريري: آليات المضادات الحيوية والمقاومة',
    category: 'Pharmacology',
    description:
      'Bacterial cell wall synthesis inhibition, ribosomal subunits 30S vs 50S, DNA gyrase inhibition, folic acid pathway antagonists, and resistance genetics.',
    descriptionAr:
      'تثبيط جدار الخلية البكتيرية، ريبوسومات 30S و50S، تثبيط إنزيم DNA gyrase، ومسارات مقاومة البكتيريا.',
    sampleText: `Clinical Antimicrobial Pharmacology:
Beta-lactam antibiotics (penicillins, cephalosporins, carbapenems) bind transpeptidase enzymes (penicillin-binding proteins, PBPs) and block cross-linking of peptidoglycan cell walls. Bacterial resistance arises through beta-lactamase production, altered PBPs (MRSA), or reduced porin permeability (Pseudomonas).
Protein synthesis inhibitors targeting the 30S ribosomal subunit include aminoglycosides (gentamicin, amikacin) and tetracyclines (doxycycline). Aminoglycosides bind irreversibly to the 30S subunit, causing mRNA misreading; they require oxygen-dependent transport (ineffective against obligate anaerobes). Adverse effects: ototoxicity and acute tubular necrosis (ATN).
Fluoroquinolones (ciprofloxacin, levofloxacin) inhibit bacterial DNA topoisomerase II (DNA gyrase) and topoisomerase IV, preventing DNA unwinding and leading to double-stranded DNA breaks. Adverse effects include QT interval prolongation and tendinopathy/tendon rupture.`,
    verifiedQuestions: [
      {
        id: 'ph-q1',
        question:
          'Methicillin-resistant Staphylococcus aureus (MRSA) demonstrates clinical resistance to all traditional beta-lactam antibiotics (except fifth-generation cephalosporins). Which molecular alteration confers this resistance phenotype?',
        options: [
          { id: 'A', text: 'Plasmid-mediated overexpression of Class A TEM-1 beta-lactamase' },
          { id: 'B', text: 'Acquisition of the mecA gene encoding penicillin-binding protein 2a (PBP2a) with low drug affinity' },
          { id: 'C', text: 'Chromosomal point mutations in topoisomerase IV and DNA gyrase' },
          { id: 'D', text: 'Loss of outer membrane OprD porin channels preventing drug influx' },
        ],
        correctOptionId: 'B',
        explanation: {
          correctRationale:
            'MRSA resistance is mediated by the mobile genetic element SCCmec carrying the mecA gene, which encodes an altered transpeptidase designated penicillin-binding protein 2a (PBP2a). PBP2a maintains transpeptidation activity while exhibiting extremely low binding affinity for virtually all standard beta-lactam antibiotics.',
          distractorRationales: {
            A: 'TEM-1 is a plasmid-mediated beta-lactamase common in Gram-negative bacteria such as E. coli and H. influenzae, not the primary mechanism of MRSA.',
            C: 'Gyrase mutations mediate fluoroquinolone resistance, not beta-lactam resistance.',
            D: 'OprD porin loss is a mechanism of carbapenem resistance in Pseudomonas aeruginosa.',
          },
          keyMechanism:
            'Expression of modified target enzyme (PBP2a) prevents beta-lactam acylation while sustaining peptidoglycan peptidoglycan synthesis.',
          sourceReference: 'Antimicrobial Resistance Mechanisms & Genetics, Section 2.3',
        },
        difficulty: 'Hard',
        style: 'Mechanism/Pathophysiology',
        category: 'Pharmacology',
        topic: 'Bacterial Resistance Mechanisms',
      },
      {
        id: 'ph-q2',
        question:
          'A 42-year-old male with severe pyelonephritis is treated with intravenous gentamicin. Six days into therapy, his serum creatinine rises from 0.9 mg/dL to 2.8 mg/dL. Microscopic urinalysis reveals brownish "muddy brown" granular casts. Which cellular event underlies this nephrotoxicity?',
        options: [
          { id: 'A', text: 'Direct proximal tubular epithelial cell accumulation and lysosomal phospholipidosis causing acute tubular necrosis' },
          { id: 'B', text: 'Type I hypersensitivity reaction with mast cell degranulation in the renal interstitium' },
          { id: 'C', text: 'Intratubular crystallization in the distal collecting duct causing mechanical obstruction' },
          { id: 'D', text: 'Selective immune complex deposition along the glomerular basement membrane' },
        ],
        correctOptionId: 'A',
        explanation: {
          correctRationale:
            'Aminoglycosides are filtered by glomeruli and concentrated in proximal tubule epithelial cells via megalin/cubilin receptor endocytosis. Once inside lysosomes, aminoglycosides inhibit lysosomal hydrolases and induce phospholipidosis, membrane rupture, reactive oxygen species generation, and cell apoptosis/necrosis, producing classic acute tubular necrosis (ATN) with muddy brown casts.',
          distractorRationales: {
            B: 'Hypersensitivity interstitial nephritis presents with fever, rash, eosinophilia, and white cell casts (typically with penicillins/NSAIDs).',
            C: 'Intratubular crystal deposition is classic for high-dose methotrexate, acyclovir, or indinavir.',
            D: 'Immune complex glomerulonephritis presents with nephritic/nephrotic features and dysmorphic red cells.',
          },
          keyMechanism:
            'Proximal tubule endocytic accumulation leading to lysosomal rupture, cellular necrosis, and sloughing of debris (granular casts).',
          sourceReference: 'Aminoglycoside Toxicity & Nephrotoxicity, Section 4.2',
        },
        difficulty: 'Medium',
        style: 'Clinical Vignette',
        category: 'Pharmacology',
        topic: 'Drug-Induced Nephrotoxicity',
      },
    ],
  },
  {
    id: 'arabic-internal-medicine',
    title: 'أمراض الباطنية والغدد الصماء وعلم وظائف الأعضاء',
    titleAr: 'أمراض الباطنية والغدد الصماء وعلم وظائف الأعضاء',
    category: 'Endocrinology',
    description:
      'الفيزيولوجيا المرضية للغدد الصماء، داء السكري واعتلالاته الحادة، قصور وفرط نشاط الغدة الدرقية، واضطرابات هرمونات قشرة الكظر.',
    descriptionAr:
      'الفيزيولوجيا المرضية للغدد الصماء، داء السكري واعتلالاته الحادة، قصور وفرط نشاط الغدة الدرقية، واضطرابات هرمونات قشرة الكظر.',
    sampleText: `الفيزيولوجيا المرضية للغدد الصماء والطب الباطني:
في داء السكري من النوع الأول، يحدث تخرب مناعي ذاتي بوساطة الخلايا التائية لخلايا بيتا في جزر لانغرهانس البنكرياسية، مما يؤدي إلى عوز مطلق في الإنسولين. يؤدي غياب الإنسولين مع زيادة الغلوكاغون إلى تحلل شحمي متسارع وزيادة تكوين الكيتونات في الكبد، مسبباً الحماض الكيتوني السكري (DKA).
في داء غريفز (Graves Disease)، ترتبط أضداد مستقبلات TSH (TRAb) من نوع IgG بالمستقبل وتحفز إفراز هرمونات الدرق (T3 وT4) بشكل غير منضبط، مما يؤدي إلى تثبيط رجعي حاد لـ TSH النخامي. يظهر المرضى رعاشاً، نقص وزن رغم زيادة الشهية، جحوظ عينين (اعتلال العين الدرقي)، وتسرع ضربات القلب.
في متلازمة كوشينغ (Cushing Syndrome)، يؤدي الارتفاع المزمن في الغلوكوكورتيكويدات إلى ترسب الدهون المركزية، ضمور العضلات القريبة، خطوط أرجوانية عريضة، وارتفاع ضغط الدم نتيجة زيادة حساسية الأوعية للكاتيكولامينات.`,
    verifiedQuestions: [
      {
        id: 'ar-q1',
        question:
          'شابة تبلغ من العمر 28 عاماً تراجع العيادة شاكية من خفقان، عدم تحمل الحرارة، وفقدان 6 كغ من وزنها خلال الشهرين الماضيين بالرغم من زيادة الشهية. أظهر الفحص السريري جحوظاً في العينين، تضخماً متجانساً غير مؤلم في الغدة الدرقية، ورعاشاً دقيقاً في اليدين. ما هي الآلية الإمراضية الأكثر دقة لحالتها؟',
        options: [
          { id: 'A', text: 'تحفيز مستقبلات TSH بواسطة أضداد ذاتية محفزة من نوع IgG' },
          { id: 'B', text: 'تخرب مناعي ذاتي لخلايا الجريبات الدرقية مسبباً تسرباً حاداً للهرمونات المخزنة' },
          { id: 'C', text: 'ورم غدي نخامي مفرز لـ TSH غير خاضع للتثبيط الرجعي' },
          { id: 'D', text: 'طفرة منشطة دائمة في مستقبل TSH دون وجود أضداد' },
        ],
        correctOptionId: 'A',
        explanation: {
          correctRationale:
            'تشير الأعراض بوضوح إلى داء غريفز (جحوظ العينين وتضخم الدرق المنتشر مع فرط النشاط). الآلية الإمراضية المركزية هي إنتاج أضداد ذاتية من صنف IgG موجهة لمستقبلات الهرمون المنبه للدرق (TSH receptor antibodies) تحاكي عمل TSH وتحفز تخليق وإفراز T4 وT3 باستمرار.',
          distractorRationales: {
            B: 'التخرب المناعي الحاد مع تسرب الهرمونات يميز مرحلة فرط النشاط العابرة في التهاب الدرق لهاشيموتو أو تحت الحاد، ولا يرافقه جحوظ العينين التسللي المميز لغريفز.',
            C: 'أورام النخامى المفرزة لـ TSH نادرة وتظهر بارتفاع TSH مرافق لارتفاع T3/T4 دون جحوظ عيني نوعي.',
            D: 'الطفرات المنشطة لمستقبل TSH تسبب دراقاً عديد العقيدات السام أو عقيدة مفردة سامة، وليست سبباً لداء غريفز.',
          },
          keyMechanism:
            'ارتباط الأجسام المضادة الذاتية بمستقبل TSH يحفز إنزيم الأدينيلات سيكلاز داخل الخلايا الجريبية مسبباً فرط إفراز وتضخماً.',
          sourceReference: 'أمراض الغدة الدرقية واعتلالات المناعة الذاتية، الفصل 4.1',
        },
        difficulty: 'Medium',
        style: 'Clinical Vignette',
        category: 'Endocrinology',
        topic: 'فرط نشاط الغدة الدرقية والمناعة الذاتية',
      },
      {
        id: 'ar-q2',
        question:
          'لماذا يحدث الحماض الكيتوني السكري (DKA) بشكل شبه حصري في مرضى داء السكري من النوع الأول مقارنة بمرضى النوع الثاني؟',
        options: [
          { id: 'A', text: 'بسبب الانعدام المطلق للإنسولين، مما يرفع نشاط إنزيم Lipase الحساس للهرمون ويطلق كميات هائلة من الأحماض الدهنية للكبد' },
          { id: 'B', text: 'لأن مرضى النوع الثاني لديهم مناعة طبيعية ضد تكوين الأجسام الكيتونية' },
          { id: 'C', text: 'لأن تركيز الغلوكوز في دم مرضى النوع الأول يكون أعلى بعشرة أضعاف' },
          { id: 'D', text: 'بسبب انخفاض إفراز هرمون الغلوكاغون التام في مرضى النوع الأول' },
        ],
        correctOptionId: 'A',
        explanation: {
          correctRationale:
            'في داء السكري من النوع الثاني، توجد كميات ضئيلة من الإنسولين الداخلي كافية لتثبيط إنزيم (Hormone-Sensitive Lipase) في النسيج الشحمي ومنع التحلل الشحمي الجامح. أما في النوع الأول، فالغياب التام للإنسولين مع زيادة الغلوكاغون يطلق العنان للتحلل الشحمي، وتتحول الأحماض الدهنية الحرة في الكبد إلى كيتونات عبر مسار بيتا-أكسدة بواسطة CPT-1.',
          distractorRationales: {
            B: 'مرضى النوع الثاني يمكن نظرياً أن يدخلوا في كيتونيات تحت ضغوط خمجية شديدة ولكن ليس لديهم "مناعة طبيعية".',
            C: 'مرضى النوع الثاني غالباً ما يصلون لمستويات غلوكوز أعلى بكثير (متلازمة فرط الأسمولية قد تتجاوز 1000 مغ/دل).',
            D: 'الغلوكاغون يكون مرتفعاً في مرضى النوع الأول وليس منخفضاً.',
          },
          keyMechanism:
            'العوز المطلق للإنسولين يزيل التثبيط عن تحلل الدهون، مما يغمر الميتوكوندريا الكبدية بأسيتيل كو-أ لإنتاج الكيتونات.',
          sourceReference: 'الاستقلاب البنكرياسي والحماض الكيتوني، الفصل 2.3',
        },
        difficulty: 'Medium',
        style: 'Mechanism/Pathophysiology',
        category: 'Endocrinology',
        topic: 'الفيزيولوجيا المرضية للسكري والحماض الكيتوني',
      },
      {
        id: 'ar-q3',
        question:
          'أي الفحوصات المخبرية التالية هو الأكثر حساسية ودقة كخطوة أولى في تشخيص قصور قشرة الكظر الأولي (داء أديسون)؟',
        options: [
          { id: 'A', text: 'اختبار تحفيز الكورتيزول بـ كوزينتروبين (ACTH الاصطناعي)' },
          { id: 'B', text: 'قياس الكورتيزول اللعابي عند منتصف الليل' },
          { id: 'C', text: 'اختبار كبت الديكساميثازون بجرعة 1 مغ' },
          { id: 'D', text: 'قياس هرمون الألدوستيرون فقط دون رينين' },
        ],
        correctOptionId: 'A',
        explanation: {
          correctRationale:
            'اختبار التحفيز بـ ACTH (Cosyntropin stimulation test) هو المعيار الذهبي لتأكيد قصور قشرة الكظر. إذا فشل الكورتيزول في الارتفاع فوق المعدل الطبيعي (عادة > 18-20 ميكروغرام/دل) بعد إعطاء ACTH، فهذا يؤكد عدم قدرة قشرة الكظر المتضررة على الاستجابة.',
          distractorRationales: {
            B: 'كورتيزول اللعاب الليلي يُستخدم لتشخيص فرط الكورتيزول (متلازمة كوشينغ)، وليس القصور.',
            C: 'اختبار كبت الديكساميثازون مخصص لتشخيص متلازمة كوشينغ ونفي الاستجابة الطبيعية للتثبيط.',
            D: 'قياس الألدوستيرون بمفرده غير كافٍ ومضلل بدون الكورتيزول ونشاط الرينين في البلازما.',
          },
          keyMechanism:
            'فشل خلايا قشرة الكظر التالفة في إفراز الكورتيزول عند إمدادها بالمحفز الفيزيولوجي الفسيولوجي المباشر.',
          sourceReference: 'الغدد الكظرية والهرمونات الستيرويدية، الفصل 5.2',
        },
        difficulty: 'Hard',
        style: 'Conceptual',
        category: 'Endocrinology',
        topic: 'قصور الكظر واختبارات الغدد الصماء',
      },
    ],
  },
];
