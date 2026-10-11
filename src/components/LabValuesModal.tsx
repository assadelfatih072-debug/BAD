import React, { useState } from 'react';
import { X, Search, FileText } from 'lucide-react';
import { NORMAL_LAB_VALUES } from '../data/normalLabValues';
import { Locale } from '../utils/i18n';

interface LabValuesModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale: Locale;
}

export const LabValuesModal: React.FC<LabValuesModalProps> = ({
  isOpen,
  onClose,
  locale,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const isAr = locale === 'ar';

  const filteredCategories = NORMAL_LAB_VALUES.map((category) => {
    const matchingItems = category.items.filter((item) => {
      const q = searchTerm.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.nameAr.includes(q) ||
        item.conventionalRange.toLowerCase().includes(q) ||
        category.category.toLowerCase().includes(q) ||
        category.categoryAr.includes(q)
      );
    });
    return { ...category, items: matchingItems };
  }).filter((category) => category.items.length > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative flex flex-col w-full max-w-3xl max-h-[85vh] rounded-2xl bg-white shadow-2xl border border-slate-200 dark:bg-slate-900 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-slate-900 dark:text-white">
                {isAr ? 'القيم المخبرية المرجعية (USMLE / NBME)' : 'Standard Normal Laboratory Values'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isAr ? 'مرجع سريع للوحدات التقليدية والدولية' : 'Quick reference for blood gases, electrolytes, CBC, and metabolic panel'}
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

        {/* Search */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder={isAr ? 'ابحث في القيم المخبرية (صوديوم، غازات الدم، هيموغلوبين...)' : 'Search lab values (e.g., sodium, PaCO2, hemoglobin)...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800/80 dark:text-white"
            />
          </div>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {filteredCategories.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-500">
              {isAr ? 'لا توجد نتائج مطابقة لبحثك.' : 'No matching laboratory values found.'}
            </div>
          ) : (
            filteredCategories.map((category) => (
              <div key={category.category} className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                  {isAr ? category.categoryAr : category.category}
                </h4>
                <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 dark:bg-slate-800/60 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="py-2.5 px-3 font-semibold">{isAr ? 'الفحص' : 'Analyte'}</th>
                        <th className="py-2.5 px-3 font-semibold">{isAr ? 'المجال المعتاد' : 'Conventional Units'}</th>
                        <th className="py-2.5 px-3 font-semibold">{isAr ? 'الوحدات الدولية' : 'SI Units'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                      {category.items.map((item) => (
                        <tr key={item.name} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                          <td className="py-2 px-3 font-medium text-slate-900 dark:text-white">
                            {isAr ? item.nameAr : item.name}
                          </td>
                          <td className="py-2 px-3 font-mono text-slate-600 dark:text-slate-400">
                            {item.conventionalRange}
                          </td>
                          <td className="py-2 px-3 font-mono text-slate-500 dark:text-slate-500">
                            {item.siUnits}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-xs font-semibold bg-slate-200 text-slate-800 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            {isAr ? 'إغلاق' : 'Close Reference'}
          </button>
        </div>
      </div>
    </div>
  );
};
