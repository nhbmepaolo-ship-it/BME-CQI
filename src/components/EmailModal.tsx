import React, { useState } from 'react';
import { Mail, X, Send, Loader2, CheckCircle2 } from 'lucide-react';
import { CPIFormData } from '../types';

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  form: CPIFormData;
}

export const EmailModal: React.FC<EmailModalProps> = ({
  isOpen,
  onClose,
  form,
}) => {
  const [toEmail, setToEmail] = useState('');
  const [subject, setSubject] = useState(`[นำส่งเอกสาร CPI] ${form.docNo || 'โครงการพัฒนาคุณภาพ'} - ${form.projectTitle || 'โรงพยาบาลพญาไท'}`);
  const [message, setMessage] = useState(`เรียน คณะกรรมการคุณภาพ และผู้เกี่ยวข้อง\n\nขอนำส่งแบบบันทึกกิจกรรมพัฒนาผลสัมฤทธิ์ของงาน (CPI) เลขที่เอกสาร: ${form.docNo}\nเรื่อง: ${form.projectTitle || '-'}\nหน่วยงาน: ${form.department || '-'}\n\nเพื่อพิจารณาอนุมัติ/ติดตามผลการดำเนินงานตามแบบฟอร์ม PTP-FM-QMS-001\n\nขอบคุณครับ/ค่ะ`);
  const [isLoading, setIsLoading] = useState(false);
  const [resultMessage, setResultMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!toEmail.trim()) {
      setResultMessage({ type: 'error', text: 'กรุณากรอกอีเมลผู้รับ (To:)' });
      return;
    }

    setIsLoading(true);
    setResultMessage(null);

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toEmail,
          subject,
          message,
          docNo: form.docNo,
          projectTitle: form.projectTitle,
          department: form.department,
          proposerName: form.proposerName,
        }),
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        throw new Error(resData.error || 'ไม่สามารถส่งอีเมลได้');
      }

      setResultMessage({
        type: 'success',
        text: `ส่งอีเมลนำส่งเอกสาร CPI (${form.docNo}) ไปยัง ${toEmail} สำเร็จเรียบร้อยแล้ว`,
      });

      setTimeout(() => {
        setIsLoading(false);
      }, 800);
    } catch (err: any) {
      console.error('Send email error:', err);
      setResultMessage({ type: 'error', text: err.message || 'เกิดข้อผิดพลาดในการส่งอีเมล' });
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-teal-400" />
            <div>
              <h3 className="font-semibold text-lg">ส่งอีเมลนำส่งเอกสาร CPI (To)</h3>
              <p className="text-xs text-slate-300">
                นำส่งแบบฟอร์ม CPI พร้อมรายละเอียดไปยังหัวหน้างาน/ศูนย์คุณภาพ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSendEmail} className="p-6 space-y-4">
          {resultMessage && (
            <div
              className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
                resultMessage.type === 'success'
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border border-rose-200 text-rose-800'
              }`}
            >
              {resultMessage.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
              {resultMessage.text}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              ผู้รับ (To Email) <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              required
              value={toEmail}
              onChange={(e) => setToEmail(e.target.value)}
              placeholder="เช่น qms.phyathai@hospital.com หรือ manager@phyathai.com..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              หัวข้ออีเมล (Subject)
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              ข้อความนำส่ง (Message)
            </label>
            <textarea
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 text-sm font-sans"
            />
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 flex justify-between items-center">
            <span>เอกสารแนบ: <strong>{form.docNo || 'CPI Document'}</strong> (PDF & Excel)</span>
            <span className="text-teal-700 font-semibold">PTP-FM-QMS-001</span>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-sm font-medium transition-colors"
            >
              ยกเลิก
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-medium text-sm flex items-center gap-1.5 shadow-md shadow-teal-600/20 disabled:opacity-60 transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  กำลังส่งอีเมล...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  ส่งอีเมลนำส่งเอกสาร
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
