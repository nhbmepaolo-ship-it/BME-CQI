import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy initialization or shared instance for Gemini
const getGeminiAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not configured.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Auto-fill CPI content endpoint using Gemini AI
app.post('/api/gemini/autofill', async (req, res) => {
  try {
    const { topic, department, section = 'all', currentValues } = req.body;

    if (!topic && !department) {
      return res.status(400).json({ error: 'Please provide a topic or department name.' });
    }

    const ai = getGeminiAI();

    const systemInstruction = `คุณเป็นผู้เชี่ยวชาญด้านระบบพัฒนาคุณภาพงานโรงพยาบาล (HA / JCI / CPI - Continuous Performance Improvement) ของโรงพยาบาลพญาไท
มีหน้าที่ช่วยร่างและเรียบเรียงข้อมูลลงใน "แบบบันทึกกิจกรรมพัฒนาผลสัมฤทธิ์ของงาน (CPI)" (รหัสเอกสาร PTP-FM-QMS-001) ภาษาไทยที่เป็นทางการ ครบถ้วน กระชับ และได้มาตรฐานทางการแพทย์

จงสร้างข้อมูลสำหรับแบบฟอร์ม CPI โดยอ้างอิงหัวข้อ: "${topic || 'ปรับปรุงคุณภาพงาน'}" ฝ่าย/แผนก: "${department || 'แผนกผู้ป่วยนอก'}"

ให้ส่งคืนเป็น JSON object ตรงตามโครงสร้างที่กำหนดเท่านั้น:
- projectTitle: ชื่อโครงการ CPI ที่สอดคล้อง
- projectType: อาร์เรย์ของประเภทโครงการ เช่น ["PIP"] หรือ ["IA", "PIP"] (เลือกจาก "IA", "PIP", "BIP")
- developmentType: อาร์เรย์ของประเภทการพัฒนา เช่น ["service_process"] หรือ ["clinical"] (เลือกจาก "clinical", "service_process", "mini_research")
- problemStatement: สถานการณ์ปัญหา/โอกาสพัฒนา (ระบุปัญหา ผลกระทบต่อการดูแลผู้ป่วย/งาน และสาเหตุสำคัญ)
- goal: เป้าหมายที่วัดผลได้ชัดเจน
- kpiAndTarget: ตัวชี้วัด (KPI) และ Target (เป็นข้อๆ)
- improvementSteps: ขั้นตอนการปรับปรุง/เปลี่ยนแปลงกระบวนการ (เขียนเป็นข้อๆ Bullet • ชัดเจน)
- expectedBenefits: ประโยชน์ที่คาดว่าจะได้รับ (1. 2. 3.)
- budget: งบประมาณ (ถ้ามี เช่น "ไม่มี (0 บาท)" หรือ "12,000 บาท")
- resultsKPI: 1.1 ผลลัพธ์ KPI (การวัดผลว่าบรรลุตามเป้าหมายอย่างไร)
- resultsOther: 1.2 ผลลัพธ์อื่นๆ
- obstaclesDataCollection: ปัญหาอุปสรรคการเก็บรวบรวมข้อมูล
- obstaclesKPICollection: ปัญหาอุปสรรคการเก็บตัวชี้วัด
- obstaclesFindingSolutions: ปัญหาอุปสรรคการหาแนวทางแก้ไข
- recommendationsExpansion: ข้อเสนอแนะ / การขยายผลโครงการ`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: `กรุณาสร้างข้อมูล CPI สำหรับหัวข้อ: ${topic} ฝ่าย/แผนก: ${department}`,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            projectTitle: { type: Type.STRING },
            projectType: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            developmentType: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            problemStatement: { type: Type.STRING },
            goal: { type: Type.STRING },
            kpiAndTarget: { type: Type.STRING },
            improvementSteps: { type: Type.STRING },
            expectedBenefits: { type: Type.STRING },
            budget: { type: Type.STRING },
            resultsKPI: { type: Type.STRING },
            resultsOther: { type: Type.STRING },
            obstaclesDataCollection: { type: Type.STRING },
            obstaclesKPICollection: { type: Type.STRING },
            obstaclesFindingSolutions: { type: Type.STRING },
            recommendationsExpansion: { type: Type.STRING },
          },
          required: [
            'projectTitle',
            'problemStatement',
            'goal',
            'kpiAndTarget',
            'improvementSteps',
            'expectedBenefits',
          ],
        },
      },
    });

    const generatedText = response.text;
    if (!generatedText) {
      throw new Error('Gemini did not return text response.');
    }

    const data = JSON.parse(generatedText);
    return res.json({ success: true, data });
  } catch (err: any) {
    console.error('Gemini Autofill Error:', err);
    return res.status(500).json({
      error: 'เกิดข้อผิดพลาดในการสร้างข้อมูลด้วย AI',
      details: err.message || 'Unknown error',
    });
  }
});

// Endpoint for sending CPI Form by Email
app.post('/api/send-email', async (req, res) => {
  try {
    const { toEmail, subject, message, docNo, projectTitle, department, proposerName } = req.body;

    if (!toEmail) {
      return res.status(400).json({ error: 'กรุณาระบุอีเมลผู้รับ (To Email)' });
    }

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT || 587);
    const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER;
    const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_PASS;

    if (smtpHost && smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const mailOptions = {
        from: `Phyathai CPI System <${smtpUser}>`,
        to: toEmail,
        subject: subject || `[นำส่งเอกสาร CPI] ${docNo || ''} - ${projectTitle || ''}`,
        text: message || `นำส่งแบบฟอร์ม CPI ${docNo}`,
        html: `
          <div style="font-family: sans-serif; line-height: 1.6; color: #1e293b; padding: 16px;">
            <h2 style="color: #0f172a;">โรงพยาบาลพญาไท - แบบบันทึกกิจกรรมพัฒนาผลสัมฤทธิ์ของงาน (CPI)</h2>
            <p><strong>เลขที่เอกสาร:</strong> ${docNo || '-'}</p>
            <p><strong>ชื่อโครงการ:</strong> ${projectTitle || '-'}</p>
            <p><strong>ฝ่าย/แผนก:</strong> ${department || '-'}</p>
            <p><strong>ผู้เสนอโครงการ:</strong> ${proposerName || '-'}</p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
            <p style="white-space: pre-wrap;">${(message || '').replace(/\n/g, '<br/>')}</p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
            <p style="font-size: 12px; color: #64748b;">เอกสารนี้ส่งจากระบบ Phyathai CPI Online Form (PTP-FM-QMS-001)</p>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log(`[SMTP Email Sent] Successfully sent email to ${toEmail}`);

      return res.json({
        success: true,
        smtpUsed: true,
        message: `ส่งอีเมลเอกสาร CPI เลขที่ ${docNo} ไปยัง ${toEmail} เรียบร้อยแล้ว`,
      });
    }

    console.log(`[Email Request] CPI Form ${docNo} requested for ${toEmail}`);

    return res.json({
      success: true,
      smtpUsed: false,
      message: `บันทึกคำขอนำส่งเอกสารไปยัง ${toEmail} เรียบร้อยแล้ว (สำหรับส่งทางอีเมลจริงไปยังกล่องจดหมายผู้รับ กรุณากดปุ่ม "เปิดใน Gmail / Outlook" ด้านล่าง เพื่อนำส่งจากโปรแกรมอีเมลของคุณได้ทันที)`,
    });
  } catch (err: any) {
    console.error('Send Email Error:', err);
    return res.status(500).json({ error: 'ไม่สามารถส่งอีเมลได้', details: err.message });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
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
    console.log(`Phyathai CPI Application running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
