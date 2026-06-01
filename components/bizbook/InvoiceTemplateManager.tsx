import React, { useState } from 'react';
import { FileText, Copy, Download, MoreVertical, Check } from 'lucide-react';

export interface InvoiceTemplate {
  id: string;
  name: string;
  description: string;
  isPremium?: boolean;
  preview?: string;
}

const invoiceTemplates: InvoiceTemplate[] = [
  {
    id: 'minimal',
    name: 'Minimal Clean',
    description: 'Simple and professional invoice template',
    isPremium: false,
    preview: 'Clean layout with company info, items table, and totals.',
  },
  {
    id: 'detailed',
    name: 'Detailed Invoice',
    description: 'Full-featured template with itemized details and notes',
    isPremium: false,
    preview: 'Includes company letterhead, detailed item breakdown, payment terms.',
  },
  {
    id: 'modern',
    name: 'Modern Professional',
    description: 'Contemporary design with colored sections',
    isPremium: true,
    preview: 'Modern gradient header, organized sections, professional branding.',
  },
  {
    id: 'minimal_gst',
    name: 'GST Optimized',
    description: 'GST-compliant template with tax breakup',
    isPremium: false,
    preview: 'Detailed GST columns, IGST/CGST/SGST breakup, compliance ready.',
  },
];

interface InvoiceTemplateManagerProps {
  onSelect: (templateId: string) => void;
  selectedTemplate?: string;
  darkMode?: boolean;
}

export const InvoiceTemplateManager: React.FC<InvoiceTemplateManagerProps> = ({
  onSelect,
  selectedTemplate = 'minimal',
  darkMode = false,
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const bgClass = darkMode
    ? 'bg-slate-800 border-slate-700'
    : 'bg-white border-slate-200';

  const cardClass = darkMode
    ? 'bg-slate-700/50 border-slate-700 hover:bg-slate-700'
    : 'bg-slate-50 border-slate-200 hover:bg-slate-100';

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-bold mb-1">Invoice Templates</h3>
        <p className="text-sm text-slate-500">Choose a template style for your invoices</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {invoiceTemplates.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelect(template.id)}
            onMouseEnter={() => setHoveredId(template.id)}
            onMouseLeave={() => setHoveredId(null)}
            className={`relative rounded-lg border ${cardClass} p-4 text-left transition group`}
          >
            {/* Selected indicator */}
            {selectedTemplate === template.id && (
              <div className="absolute top-2 right-2 rounded-full bg-indigo-600 p-1 text-white">
                <Check className="w-3 h-3" />
              </div>
            )}

            {/* Premium badge */}
            {template.isPremium && (
              <div className="absolute top-2 left-2 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-white">
                PREMIUM
              </div>
            )}

            <div className="flex items-start gap-2 mb-2">
              <FileText className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm">{template.name}</div>
                <div className="text-xs text-slate-500 mt-0.5">{template.description}</div>
              </div>
            </div>

            <div className="text-xs text-slate-600 mt-3 line-clamp-2">
              {template.preview}
            </div>

            {/* Hover actions */}
            {hoveredId === template.id && (
              <div className="mt-3 flex gap-2 pt-2 border-t border-slate-300/20">
                <button className="flex-1 rounded px-2 py-1 text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700">
                  Use
                </button>
                <button className="rounded px-2 py-1 text-slate-600 hover:text-slate-900">
                  <Download className="w-3 h-3" />
                </button>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Custom Template Info */}
      <div className={`rounded-lg border ${bgClass} p-4 bg-gradient-to-r from-indigo-600/10 to-violet-600/10`}>
        <div className="flex gap-3">
          <div className="text-xl">🎨</div>
          <div>
            <div className="font-semibold text-sm">Create Custom Template</div>
            <p className="text-xs text-slate-600 mt-1">
              Need a custom design? Export your current template and customize it, or contact support for custom designs.
            </p>
            <div className="flex gap-2 mt-2">
              <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">Export current</button>
              <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">Contact support</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTemplateManager;
