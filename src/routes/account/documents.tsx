import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { AccountLayout } from '@/components/account/AccountLayout';
import {
  FileText,
  UploadCloud,
  FileCheck,
  Download,
  Share2,
  Trash2,
  Lock,
  Calendar,
  Clock,
} from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/account/documents')({
  head: () => ({
    meta: [
      { title: 'Prescriptions & Medical Vault — Two Brothers Healthcare' },
      { name: 'description', content: 'Secure private vault for doctor prescriptions, clinical summaries, and medical invoices.' },
    ],
  }),
  component: DocumentsVaultPage,
});

interface VaultDoc {
  id: string;
  title: string;
  category: 'Prescription' | 'Lab Result' | 'Doctor Summary' | 'Invoice';
  doctorOrIssuer: string;
  uploadDate: string;
  fileSize: string;
  format: 'PDF' | 'JPG' | 'PNG';
}

function DocumentsVaultPage() {
  const [documents, setDocuments] = useState<VaultDoc[]>([
    {
      id: 'doc-v1',
      title: 'Physician Prescription — Antihypertensive & Sugar Regimen',
      category: 'Prescription',
      doctorOrIssuer: 'Dr. Suresh Shrestha (NMC #4829)',
      uploadDate: '2026-11-15',
      fileSize: '1.4 MB',
      format: 'PDF',
    },
    {
      id: 'doc-v2',
      title: 'Comprehensive Lipid & Fasting Glucose Report',
      category: 'Lab Result',
      doctorOrIssuer: 'Two Brothers Diagnostic Lab (Sanagau)',
      uploadDate: '2026-10-10',
      fileSize: '840 KB',
      format: 'PDF',
    },
    {
      id: 'doc-v3',
      title: 'Chest X-Ray & ECG Screening Summary',
      category: 'Doctor Summary',
      doctorOrIssuer: 'Dr. Bikram Thapa (Cardiology)',
      uploadDate: '2026-08-20',
      fileSize: '3.2 MB',
      format: 'JPG',
    },
  ]);

  const [filterCat, setFilterCat] = useState<string>('all');
  const [showUpload, setShowUpload] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCategory, setUploadCategory] = useState<VaultDoc['category']>('Prescription');

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim()) return;

    const newDoc: VaultDoc = {
      id: 'doc-' + Date.now(),
      title: uploadTitle,
      category: uploadCategory,
      doctorOrIssuer: 'Uploaded by Patient (Kushal Sharma)',
      uploadDate: new Date().toISOString().split('T')[0],
      fileSize: '1.8 MB',
      format: 'PDF',
    };

    setDocuments((prev) => [newDoc, ...prev]);
    toast.success('Document encrypted and stored in your vault!');
    setUploadTitle('');
    setShowUpload(false);
  };

  const handleShare = (title: string) => {
    const dummyLink = `https://twobrothershealthcare.com/v/share?token=${Math.random().toString(36).substring(2, 10)}`;
    navigator.clipboard?.writeText(dummyLink);
    toast.success(`Time-limited secure link (expires in 24 hours) copied to clipboard!`);
  };

  const filteredDocs = documents.filter(
    (d) => filterCat === 'all' || d.category === filterCat
  );

  return (
    <AccountLayout>
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-on-dark/15">
          <div>
            <h1 className="font-display text-2xl font-bold text-white">Prescriptions & Medical Vault</h1>
            <p className="text-xs text-on-dark-muted">
              Encrypted storage for medical prescriptions, past hospital summaries, and lab records.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowUpload(!showUpload)}
            className="px-5 py-2.5 rounded-full bg-cyan text-navy-deep font-bold text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-all inline-flex items-center gap-2"
          >
            <UploadCloud className="h-4 w-4" />
            <span>Upload Document</span>
          </button>
        </div>

        {/* Upload Modal / Drawer */}
        {showUpload && (
          <form
            onSubmit={handleUploadSubmit}
            className="p-6 rounded-3xl bg-midnight/80 border border-teal/40 space-y-4 text-xs animate-in fade-in shadow-2xl"
          >
            <h2 className="font-bold text-white text-base">Upload Document to Private Vault</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-white font-semibold block mb-1">Document Title *</label>
                <input
                  type="text"
                  required
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="e.g. Dr. Karki Prescription - Nov 2026"
                  className="w-full px-4 py-2.5 rounded-2xl bg-navy-deep border border-on-dark/20 text-white"
                />
              </div>
              <div>
                <label className="text-white font-semibold block mb-1">Document Category</label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-navy-deep border border-on-dark/20 text-white"
                >
                  <option value="Prescription">Prescription Slip</option>
                  <option value="Lab Result">External Diagnostic Report</option>
                  <option value="Doctor Summary">Discharge / Clinical Summary</option>
                  <option value="Invoice">Medical Receipt / Invoice</option>
                </select>
              </div>
            </div>

            <div className="border-2 border-dashed border-teal/40 p-4 rounded-2xl text-center cursor-pointer bg-navy-deep/60">
              <UploadCloud className="h-6 w-6 text-cyan mx-auto mb-1" />
              <span className="text-white font-semibold block">Select PDF or Image from device</span>
              <span className="text-[11px] text-on-dark-muted">Max file size 10MB</span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowUpload(false)}
                className="px-4 py-2 rounded-full text-on-dark-muted hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-full bg-cyan text-navy-deep font-bold"
              >
                Encrypt & Upload
              </button>
            </div>
          </form>
        )}

        {/* Categories Bar */}
        <div className="flex items-center gap-2 border-b border-on-dark/10 pb-3 text-xs overflow-x-auto">
          {['all', 'Prescription', 'Lab Result', 'Doctor Summary', 'Invoice'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilterCat(cat)}
              className={`px-3.5 py-1.5 rounded-full font-semibold transition-all ${
                filterCat === cat
                  ? 'bg-cyan text-navy-deep font-bold'
                  : 'bg-midnight/60 text-on-dark-muted hover:text-white'
              }`}
            >
              {cat === 'all' ? 'All Documents' : cat}
            </button>
          ))}
        </div>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="p-5 rounded-3xl bg-midnight/50 border border-on-dark/15 flex flex-col justify-between hover:border-cyan/40 transition-colors space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-teal/20 text-teal uppercase">
                    {doc.category}
                  </span>
                  <span className="text-[11px] text-on-dark-muted font-mono">{doc.format} · {doc.fileSize}</span>
                </div>

                <h3 className="font-display text-base font-bold text-white">{doc.title}</h3>

                <div className="text-xs text-on-dark-muted">
                  <strong>Issued by:</strong> {doc.doctorOrIssuer}
                </div>
                <div className="text-[11px] text-on-dark-muted">
                  Uploaded: {doc.uploadDate}
                </div>
              </div>

              <div className="pt-3 border-t border-on-dark/10 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => handleShare(doc.title)}
                  className="text-cyan hover:underline flex items-center gap-1 font-semibold"
                >
                  <Share2 className="h-3.5 w-3.5" /> Share 24h Link
                </button>

                <button
                  type="button"
                  onClick={() => toast.info(`Downloading ${doc.title}...`)}
                  className="px-4 py-1.5 rounded-xl bg-on-dark/10 hover:bg-white/10 text-white font-semibold flex items-center gap-1.5"
                >
                  <Download className="h-3.5 w-3.5" /> Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AccountLayout>
  );
}
