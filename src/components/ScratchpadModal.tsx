import React from 'react';
import { X, Edit3, Trash2 } from 'lucide-react';
import { Locale } from '../utils/i18n';

interface ScratchpadModalProps {
  isOpen: boolean;
  onClose: () => void;
  notes: string;
  onChangeNotes: (notes: string) => void;
  locale: Locale;
}

export const ScratchpadModal: React.FC<ScratchpadModalProps> = ({
  isOpen,
  onClose,
  notes,
  onChangeNotes,
  locale,
}) => {
  if (!isOpen) return null;
  const isAr = locale === 'ar';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative flex flex-col w-full max-w-xl max-h-[80vh] rounded-2xl bg-white shadow-2xl border border-slate-200 dark:bg-slate-900 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">
              <Edit3 className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-slate-900 dark:text-white">
                {isAr ? 'المسودة والملاحظات السريرية' : 'Examination Scratchpad & Clinical Notes'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isAr ? 'تدوين الحسابات والملاحظات السريعة (تبقى محفوظة طوال مدة الاختبار)' : 'Private workspace for rough calculations, formulas, and clinical notes.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Textarea */}
        <div className="p-4 flex-1 flex flex-col">
          <textarea
            value={notes}
            onChange={(e) => onChangeNotes(e.target.value)}
            placeholder={
              isAr
                ? 'اكتب حساباتك هنا (مثل: Anion Gap = Na - (Cl + HCO3) أو صيغة Winter أو ملاحظات تفريقية)...'
                : 'Jot down clinical calculations, differential considerations, or notes here (e.g. AG = 140 - (100 + 15) = 25)...'
            }
            className="w-full h-64 p-3.5 text-sm font-mono rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white resize-none"
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <button
            type="button"
            onClick={() => onChangeNotes('')}
            className="flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>{isAr ? 'مسح المسودة' : 'Clear Scratchpad'}</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-xs font-semibold bg-teal-600 text-white hover:bg-teal-700 transition-colors"
          >
            {isAr ? 'تم وحفظ' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
};
