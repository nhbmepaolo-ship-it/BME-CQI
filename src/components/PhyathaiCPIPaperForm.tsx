import React from 'react';
import { CPIFormData } from '../types';
import { PhyathaiLogo } from './PhyathaiLogo';

interface PhyathaiCPIPaperFormProps {
  form: CPIFormData;
  onOpenSignatureModal?: (role: 'proposer' | 'deptHead' | 'approver' | 'proposerPage2') => void;
}

export const PhyathaiCPIPaperForm: React.FC<PhyathaiCPIPaperFormProps> = ({
  form,
  onOpenSignatureModal,
}) => {
  // Helper to render checkbox square
  const renderCheckbox = (isChecked: boolean) => (
    <span className="w-3.5 h-3.5 border border-slate-900 bg-white inline-flex items-center justify-center font-bold text-[10px] text-slate-950 shrink-0 leading-none mr-1.5">
      {isChecked ? '✓' : ''}
    </span>
  );

  // Helper for rendering single line dotted fields
  const renderLine = (value?: string, minWidthClass: string = 'min-w-[120px]') => {
    if (value && value.trim()) {
      return (
        <span className={`border-b border-dotted border-slate-800 px-1.5 font-medium text-slate-950 ${minWidthClass} inline-block`}>
          {value}
        </span>
      );
    }
    return (
      <span className={`border-b border-dotted border-slate-500 ${minWidthClass} inline-block h-[16px]`}>
        &nbsp;
      </span>
    );
  };

  // Helper for rendering multi-line dotted text areas
  const renderMultiLine = (value?: string, minLines: number = 3) => {
    if (value && value.trim()) {
      return (
        <div className="text-slate-950 whitespace-pre-wrap leading-relaxed border-b border-dotted border-slate-400 pb-1 min-h-[40px]">
          {value}
        </div>
      );
    }
    return (
      <div className="flex flex-col gap-2 py-1">
        {Array.from({ length: minLines }).map((_, i) => (
          <div key={i} className="border-b border-dotted border-slate-400 h-[14px]" />
        ))}
      </div>
    );
  };

  return (
    <div className="printable-paper flex flex-col items-center gap-8 print:gap-0 print:p-0 font-['Sarabun','TH_Sarabun_New',sans-serif] text-slate-950 leading-relaxed select-none">
      {/* ================= PAGE 1 ================= */}
      <div className="a4-page bg-white w-[210mm] min-h-[297mm] p-[8mm] shadow-2xl rounded-none border border-slate-900 print:shadow-none print:border-none print:m-0 print:p-[6mm] print:w-[210mm] print:h-[295mm] relative flex flex-col justify-between box-border">
        {/* Document Header Page 1 */}
        <div className="flex items-center gap-3 mb-2.5">
          {/* Logo Left Page 1 */}
          <div className="w-[200px] shrink-0 flex items-center justify-start p-1 h-[76px]">
            <PhyathaiLogo className="h-[76px] w-auto max-w-full object-contain" />
          </div>

          {/* Title Box Right */}
          <div className="flex-1 border border-slate-900 p-2.5 flex flex-col items-center justify-center text-center h-[76px]">
            <h1 className="text-base font-bold text-slate-950 leading-tight">
              แบบบันทึกกิจกรรมพัฒนาผลสัมฤทธิ์ของงาน
            </h1>
            <h2 className="text-xs font-bold text-slate-900 mt-0.5">
              (Continuous Performance Improvement Project : CPI)
            </h2>
          </div>
        </div>

        {/* Page 1 Outer Form Frame */}
        <div className="border border-slate-900 flex flex-col">
          {/* SECTION 1 */}
          <div>
            {/* Section 1 Header Banner */}
            <div className="bg-slate-200 text-slate-950 font-bold text-xs px-2.5 py-1 border-b border-slate-900">
              ส่วนที่ 1 รายละเอียดการขอดำเนินการ
            </div>

            {/* Section 1 Content Grid */}
            <div className="text-xs divide-y divide-slate-900">
              {/* Row 1: Doc Meta 3 Columns */}
              <div className="p-1.5 flex items-baseline justify-between gap-1 flex-wrap">
                <div className="flex items-baseline">
                  <span className="font-bold whitespace-nowrap mr-1">เลขที่โครงการ :</span>
                  {renderLine(form.docNo, 'min-w-[100px]')}
                  <span className="font-bold ml-1 mr-2">;</span>
                </div>
                <div className="flex items-baseline">
                  <span className="font-bold whitespace-nowrap mr-1">วัน/เดือน/ปี ขอดำเนินการ :</span>
                  {renderLine(form.docDate, 'min-w-[120px]')}
                </div>
                <div className="flex items-baseline flex-1 min-w-[200px]">
                  <span className="font-bold whitespace-nowrap mr-1">ฝ่าย/แผนก/หน่วยงาน :</span>
                  {renderLine(form.department, 'flex-1 min-w-[120px]')}
                </div>
              </div>

              {/* Row 2: Project Title */}
              <div className="p-1.5 flex items-baseline">
                <span className="font-bold whitespace-nowrap mr-2">ชื่อโครงการ :</span>
                {renderLine(form.projectTitle, 'flex-1 min-w-[300px]')}
              </div>

              {/* Row 3: Project Types */}
              <div className="p-1.5 flex items-start gap-3">
                <span className="font-bold whitespace-nowrap">ประเภทโครงการ :</span>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-6 flex-wrap">
                    <label className="flex items-center cursor-pointer">
                      {renderCheckbox(form.projectType.includes('IA'))}
                      <span>IA (Improvement Action)</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      {renderCheckbox(form.projectType.includes('PIP'))}
                      <span>PIP ( Productivity /Performance Improvement Project )</span>
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center cursor-pointer">
                      {renderCheckbox(form.projectType.includes('BIP'))}
                      <span>BIP ( Business Improvement Project )</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Row 4: Development Types */}
              <div className="p-1.5 flex items-center gap-4">
                <span className="font-bold whitespace-nowrap">ประเภทการพัฒนา :</span>
                <div className="flex items-center gap-5 flex-wrap">
                  <label className="flex items-center cursor-pointer">
                    {renderCheckbox(form.developmentType.includes('clinical'))}
                    <span>พัฒนาคุณภาพทางคลินิก</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    {renderCheckbox(form.developmentType.includes('service_process'))}
                    <span>พัฒนาคุณภาพการบริการ/ กระบวนการทำงาน</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    {renderCheckbox(form.developmentType.includes('mini_research'))}
                    <span>Mini Research</span>
                  </label>
                </div>
              </div>

              {/* Row 5: Source Types */}
              <div className="p-1.5">
                <span className="font-bold block mb-1">ที่มาโครงการ :</span>
                <div className="grid grid-cols-2 gap-y-1 gap-x-4 pl-3">
                  <label className="flex items-center cursor-pointer">
                    {renderCheckbox(form.sourceTypes.visionPolicy)}
                    <span>วิสัยทัศน์ เป้าหมายและนโยบายองค์กร</span>
                  </label>

                  <label className="flex items-center cursor-pointer">
                    {renderCheckbox(form.sourceTypes.satisfactionSurvey)}
                    <span>ผลสำรวจความต้องการ/ความพึงพอใจของผู้รับบริการ</span>
                  </label>

                  <label className="flex items-center cursor-pointer">
                    {renderCheckbox(form.sourceTypes.riskReview)}
                    <span>ทบทวนระบบงาน/ความเสี่ยงในกระบวนการทำงาน</span>
                  </label>

                  <label className="flex items-center cursor-pointer">
                    {renderCheckbox(form.sourceTypes.staffSuggestion)}
                    <span>ข้อเสนอแนะจากเจ้าหน้าที่</span>
                  </label>

                  <label className="flex items-center cursor-pointer">
                    {renderCheckbox(form.sourceTypes.internalAudit)}
                    <span>
                      การประเมินคุณภาพภายในครั้งที่ :{' '}
                      {renderLine(form.sourceTypes.internalAuditNo, 'min-w-[60px]')}
                    </span>
                  </label>

                  <label className="flex items-center cursor-pointer">
                    {renderCheckbox(form.sourceTypes.complaint)}
                    <span>
                      ข้อร้องเรียนของผู้รับบริการ เลขที่ :{' '}
                      {renderLine(form.sourceTypes.complaintNo, 'min-w-[60px]')}
                    </span>
                  </label>

                  <label className="flex items-center cursor-pointer">
                    {renderCheckbox(form.sourceTypes.kpiUnmet)}
                    <span>เครื่องชี้วัดผลสัมฤทธิ์ของงาน (KPI) ตกเกณฑ์</span>
                  </label>

                  <label className="flex items-center cursor-pointer">
                    {renderCheckbox(form.sourceTypes.other)}
                    <span>
                      อื่นๆ :{' '}
                      {renderLine(form.sourceTypes.otherDetail, 'min-w-[100px]')}
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2 */}
          <div className="border-t border-slate-900">
            {/* Section 2 Header Banner */}
            <div className="bg-slate-200 text-slate-950 font-bold text-xs px-2.5 py-1 border-b border-slate-900">
              ส่วนที่ 2 รายละเอียดของโครงการ
            </div>

            {/* Section 2 Grid Content */}
            <div className="text-xs divide-y divide-slate-900">
              {/* Problem Statement */}
              <div className="p-1.5">
                <p className="font-bold">
                  1. สถานการณ์ปัญหา/โอกาสพัฒนา :{' '}
                  <span className="font-normal text-slate-700">
                    (ระบุปัญหา/โอกาสพัฒนาที่ต้องการแก้ไข มีผลกระทบต่องานหรือการดูแลผู้ป่วยอย่างไร มีสาเหตุสำคัญมาจากอะไร)
                  </span>
                </p>
                <div className="mt-1">{renderMultiLine(form.problemStatement, 3)}</div>
              </div>

              {/* Goal */}
              <div className="p-1.5 flex items-baseline">
                <span className="font-bold whitespace-nowrap mr-1">2. เป้าหมาย</span>
                {renderLine(form.goal, 'flex-1 min-w-[300px]')}
              </div>

              {/* KPI & Target */}
              <div className="p-1.5">
                <p className="font-bold">3. ตัวชี้วัด (KPI) และ target :</p>
                <div className="mt-1">{renderMultiLine(form.kpiAndTarget, 2)}</div>
              </div>

              {/* Action Plan Bullet */}
              <div className="p-1.5">
                <p className="font-bold">
                  4. ขั้นตอนการปรับปรุง/เปลี่ยนแปลงกระบวนการ :{' '}
                  <span className="font-normal text-slate-700">
                    (ระบุการปรับปรุงแก้ไขเป็นขั้นตอนในลักษณะของ bullet ให้ชัดเจนเพื่อให้ผู้อ่านเข้าใจว่าได้ทำอะไรไปบ้าง)
                  </span>
                </p>
                <div className="mt-1">{renderMultiLine(form.improvementSteps, 3)}</div>
              </div>

              {/* Duration */}
              <div className="p-1.5 flex items-baseline gap-4">
                <span className="font-bold whitespace-nowrap">5. ระยะเวลาดำเนินการ :</span>
                <div className="flex items-baseline gap-6 flex-1">
                  <span>
                    วันที่เริ่มต้น : {renderLine(form.startDate, 'min-w-[100px]')}
                  </span>
                  <span>
                    วันที่สิ้นสุดโครงการ : {renderLine(form.endDate, 'min-w-[100px]')}
                  </span>
                </div>
              </div>

              {/* Expected Benefits */}
              <div className="p-1.5">
                <p className="font-bold">6. ประโยชน์ที่คาดว่าจะได้รับ</p>
                <div className="mt-1">{renderMultiLine(form.expectedBenefits, 2)}</div>
              </div>

              {/* Budget */}
              <div className="p-1.5 flex items-baseline">
                <span className="font-bold whitespace-nowrap mr-2">7. งบประมาณ (ถ้ามี) :</span>
                {renderLine(form.budget, 'flex-1 min-w-[200px]')}
              </div>
            </div>
          </div>

          {/* SIGNATURES PAGE 1 GRID */}
          <div className="grid grid-cols-2 text-xs bg-white">
            {/* Proposer Box Left */}
            <div className="p-2 flex flex-col justify-between h-32 text-center items-center">
              <span className="font-bold">ผู้เสนอโครงการ</span>

              <div
                onClick={() => onOpenSignatureModal?.('proposer')}
                className="my-auto flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors py-0.5"
                title="คลิกเพื่อเซ็นชื่อออนไลน์"
              >
                {form.proposerSignature ? (
                  <img src={form.proposerSignature} alt="ลายเซ็นผู้เสนอโครงการ" className="h-10 object-contain" />
                ) : (
                  <div className="text-slate-800 text-[11px]">
                    ลงชื่อ..........................................................
                  </div>
                )}
              </div>

              <div className="text-center w-full">
                <p className="font-medium text-center">
                  ( <span className="inline-block text-center">{form.proposerName || '..........................................................'}</span> )
                </p>
                <p className="text-[11px] mt-0.5 text-center">
                  วันที่ <span className="inline-block min-w-[90px] text-center">{form.proposerDate || '......./......./.......'}</span>
                </p>
              </div>
            </div>

            {/* Department Head Approval Box Right */}
            <div className="p-2 flex flex-col justify-between h-32 text-center items-center">
              <div>
                <span className="font-bold block text-center">
                  ความเห็นของหัวหน้างาน ( กรณีไม่ได้เป็นผู้เสนอโครงการ )
                </span>
                <div className="flex items-center justify-center gap-4 mt-1 pl-1">
                  <label className="flex items-center cursor-pointer">
                    {renderCheckbox(form.deptHeadOpinion === 'approve')}
                    <span>เห็นสมควรเปิดโครงการ</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    {renderCheckbox(form.deptHeadOpinion === 'disapprove')}
                    <span>ไม่เห็นด้วยกับการเปิดโครงการ</span>
                  </label>
                </div>
              </div>

              <div
                onClick={() => onOpenSignatureModal?.('deptHead')}
                className="my-auto flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors py-0.5"
                title="คลิกเพื่อเซ็นชื่อหัวหน้างาน"
              >
                {form.deptHeadSignature ? (
                  <img src={form.deptHeadSignature} alt="ลายเซ็นหัวหน้างาน" className="h-9 object-contain" />
                ) : (
                  <div className="text-slate-800 text-[11px]">
                    ลงชื่อ..........................................................
                  </div>
                )}
              </div>

              <div className="text-center flex flex-col items-center w-full">
                <p className="font-medium text-center">
                  ( <span className="inline-block text-center">{form.deptHeadName || 'ชาลี เมฆสุวรรณ'}</span> )
                </p>
                <p className="text-[10px] mt-0.5 font-bold text-slate-800 text-center">
                  {form.deptHeadPosition || 'ผู้จัดการแผนกวิศวกรรมการแพทย์'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Page 1 Bottom Footer */}
        <div className="pt-2 text-[9px] text-slate-800 flex flex-col gap-0.5">
          <p className="italic">Please mark "N/A" under the item that is not applicable.</p>
          <div className="flex justify-between items-center text-[8.5px] font-mono">
            <span>PTP-FM-QMS-001 ; Revision : 06 ; Issued Date : 16/04/2567 ; Page : 1/2</span>
          </div>
          <p className="text-[8px] text-slate-600">
            เอกสารฉบับนี้เป็นเอกสารภายในของโรงพยาบาลพญาไท พหลโยธินเท่านั้น ห้ามทำสำเนาหรือพิมพ์เผยแพร่ก่อนได้รับอนุมัติ และห้ามบันทึก / แก้ไขข้อความใดๆ บนเอกสารควบคุม
          </p>
        </div>
      </div>

      {/* ================= PAGE 2 ================= */}
      <div className="a4-page bg-white w-[210mm] min-h-[297mm] p-[8mm] shadow-2xl rounded-none border border-slate-900 print:shadow-none print:border-none print:m-0 print:p-[6mm] print:w-[210mm] print:h-[295mm] relative flex flex-col justify-between box-border">
        {/* Document Header Page 2 */}
        <div className="flex items-center gap-3 mb-2.5">
          {/* Logo Left Page 2 */}
          <div className="w-[200px] shrink-0 flex items-center justify-start p-1 h-[76px]">
            <PhyathaiLogo className="h-[76px] w-auto max-w-full object-contain" />
          </div>

          {/* Title Box Right */}
          <div className="flex-1 border border-slate-900 p-2.5 flex flex-col items-center justify-center text-center h-[76px]">
            <h1 className="text-base font-bold text-slate-950 leading-tight">
              แบบบันทึกกิจกรรมพัฒนาผลสัมฤทธิ์ของงาน
            </h1>
            <h2 className="text-xs font-bold text-slate-900 mt-0.5">
              (Continuous Performance Improvement Project : CPI)
            </h2>
          </div>
        </div>

        {/* Page 2 Outer Form Frame */}
        <div className="border border-slate-900 flex flex-col">
          {/* SECTION 3 */}
          <div>
            {/* Section 3 Header Banner */}
            <div className="bg-slate-200 text-slate-950 font-bold text-xs px-2.5 py-1 border-b border-slate-900">
              ส่วนที่ 3 รายงานผลการพัฒนาผลสัมฤทธิ์ของงาน
            </div>

            {/* Section 3 Grid Content */}
            <div className="text-xs divide-y divide-slate-900">
              {/* Row 1: Meta fields */}
              <div className="p-1.5 flex items-baseline justify-between gap-2 flex-wrap">
                <div className="flex items-baseline flex-1 min-w-[200px]">
                  <span className="font-bold whitespace-nowrap mr-1">ฝ่าย/แผนก/หน่วยงาน :</span>
                  {renderLine(form.department, 'flex-1 min-w-[120px]')}
                </div>
                <div className="flex items-baseline">
                  <span className="font-bold whitespace-nowrap mr-1">วัน/เดือน/ปี ขอดำเนินการ :</span>
                  {renderLine(form.docDate, 'min-w-[100px]')}
                </div>
                <div className="flex items-baseline">
                  <span className="font-bold whitespace-nowrap mr-1">เลขที่โครงการ :</span>
                  {renderLine(form.docNo, 'min-w-[90px]')}
                </div>
              </div>

              {/* Row 2: Project Title */}
              <div className="p-1.5 flex items-baseline">
                <span className="font-bold whitespace-nowrap mr-2">ชื่อโครงการ :</span>
                {renderLine(form.projectTitle, 'flex-1 min-w-[300px]')}
              </div>

              {/* Item 1: Results and Changes */}
              <div className="p-1.5 space-y-1.5">
                <p className="font-bold">
                  1. การวัดผลและผลการเปลี่ยนแปลง{' '}
                  <span className="font-normal text-slate-700">
                    ( ผลการเปลี่ยนแปลงเป็นอย่างไร อาจแสดงในรูปแบบ กราฟ รูปภาพก่อน-หลัง (ถ้ามี) อธิบายให้ชัดเจน)
                  </span>
                </p>
                <div className="pl-3 space-y-1.5">
                  <div>
                    <span className="font-bold block">1.1 ผลลัพธ์ KPI (โปรดแนบเอกสารซึ่งแสดงผลการพัฒนา)</span>
                    <div className="mt-0.5">{renderMultiLine(form.resultsKPI, 2)}</div>
                  </div>
                  <div>
                    <span className="font-bold block">1.2 ผลลัพธ์อื่นๆ (ถ้ามี)</span>
                    <div className="mt-0.5">{renderMultiLine(form.resultsOther, 2)}</div>
                  </div>
                </div>
              </div>

              {/* Item 2: Benefits Received Grid */}
              <div className="p-1.5">
                <p className="font-bold mb-1">
                  2. ประโยชน์ที่ได้รับ <span className="font-normal text-slate-700">(เลือกได้มากกว่า 1 ข้อ)</span>
                </p>
                <div className="grid grid-cols-3 gap-y-1 gap-x-2 pl-3 text-[11px]">
                  {/* Column 1 */}
                  <div className="flex flex-col gap-1">
                    <label className="flex items-center cursor-pointer">
                      {renderCheckbox(form.benefitsReceived.increaseSatisfaction)}
                      <span>เพิ่มความพึงพอใจของผู้รับบริการ</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      {renderCheckbox(form.benefitsReceived.staffSkill)}
                      <span>เพิ่มความรู้ ความชำนาญของเจ้าหน้าที่</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      {renderCheckbox(form.benefitsReceived.reduceComplications)}
                      <span>ลดภาวะแทรกซ้อนของผู้ป่วย</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      {renderCheckbox(form.benefitsReceived.increaseSafety)}
                      <span>เพิ่มความปลอดภัย</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      {renderCheckbox(form.benefitsReceived.revenueIncrease)}
                      <span>
                        เพิ่มรายได้ จำนวน{' '}
                        {renderLine(form.benefitsReceived.revenueIncreaseAmount, 'min-w-[50px]')}
                        {' '}บาท
                      </span>
                    </label>
                  </div>

                  {/* Column 2 */}
                  <div className="flex flex-col gap-1">
                    <label className="flex items-center cursor-pointer">
                      {renderCheckbox(form.benefitsReceived.internalCommEfficiency)}
                      <span>เพิ่มประสิทธิภาพการสื่อสารภายใน</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      {renderCheckbox(form.benefitsReceived.efficientResource)}
                      <span>มีการใช้ทรัพยากร อย่างคุ้มค่า</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      {renderCheckbox(form.benefitsReceived.treatmentOutcome)}
                      <span>ผลลัพธ์การรักษาดีขึ้น</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      {renderCheckbox(form.benefitsReceived.increaseValue)}
                      <span>เพิ่มคุณค่าการบริการ</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      {renderCheckbox(form.benefitsReceived.otherBenefit)}
                      <span>
                        อื่น{' '}
                        {renderLine(form.benefitsReceived.otherBenefitDetail, 'min-w-[60px]')}
                      </span>
                    </label>
                  </div>

                  {/* Column 3 */}
                  <div className="flex flex-col gap-1">
                    <label className="flex items-center cursor-pointer">
                      {renderCheckbox(form.benefitsReceived.reduceErrors)}
                      <span>ลดความผิดพลาดในการให้บริการ</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      {renderCheckbox(form.benefitsReceived.staffSatisfaction)}
                      <span>เพิ่มความพึงพอใจของเจ้าหน้าที่</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      {renderCheckbox(form.benefitsReceived.increaseSpeed)}
                      <span>เพิ่มความรวดเร็วในการให้บริการ</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      {renderCheckbox(form.benefitsReceived.costReduction)}
                      <span>
                        ลดต้นทุน/ค่าใช้จ่าย จำนวน{' '}
                        {renderLine(form.benefitsReceived.costReductionAmount, 'min-w-[50px]')}
                        {' '}บาท
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Item 3: Obstacles and Solutions */}
              <div className="p-1.5 space-y-1">
                <p className="font-bold">
                  3. ปัญหาอุปสรรคการดำเนินโครงการ และแนวทางการแก้ไข{' '}
                  <span className="font-normal text-slate-700">(สามารถส่งเป็นเอกสารแนบได้)</span>
                </p>
                <div className="pl-3 space-y-1 text-xs">
                  <div className="flex items-baseline">
                    <span className="font-semibold whitespace-nowrap mr-1">3.1 ขั้นตอนในการเก็บรวบรวมข้อมูล</span>
                    {renderLine(form.obstacles.dataCollection, 'flex-1 min-w-[200px]')}
                  </div>
                  <div className="flex items-baseline">
                    <span className="font-semibold whitespace-nowrap mr-1">3.2 ขั้นตอนในการเก็บตัวชี้วัด</span>
                    {renderLine(form.obstacles.kpiCollection, 'flex-1 min-w-[200px]')}
                  </div>
                  <div className="flex items-baseline">
                    <span className="font-semibold whitespace-nowrap mr-1">3.3 ขั้นตอนในการหาแนวทางแก้ไข</span>
                    {renderLine(form.obstacles.findingSolutions, 'flex-1 min-w-[200px]')}
                  </div>
                  <div className="flex items-baseline">
                    <span className="font-semibold whitespace-nowrap mr-1">3.4 อื่น ๆ</span>
                    {renderLine(form.obstacles.other, 'flex-1 min-w-[200px]')}
                  </div>
                </div>
              </div>

              {/* Item 4: Recommendations & Expansion */}
              <div className="p-1.5">
                <p className="font-bold">4. ข้อเสนอแนะ / การขยายผลโครงการ</p>
                <div className="mt-1">{renderMultiLine(form.recommendationsExpansion, 2)}</div>
              </div>
            </div>

            {/* Proposer Signature Line Centered */}
            <div className="p-2 flex justify-center text-center">
              <div className="flex items-start justify-center gap-2 text-xs">
                <span className="whitespace-nowrap font-bold text-[11px] pt-1.5">ลงชื่อ</span>

                <div className="flex flex-col items-center min-w-[220px]">
                  {/* Signature Dotted Line / Image */}
                  <div
                    onClick={() => onOpenSignatureModal?.('proposerPage2')}
                    className="w-full border-b border-dotted border-slate-700 min-h-[26px] flex items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors py-0.5"
                    title="คลิกเพื่อเซ็นชื่อผู้เสนอโครงการ"
                  >
                    {form.proposerSignature || form.projectOwnerSignaturePage2 ? (
                      <img src={form.proposerSignature || form.projectOwnerSignaturePage2} alt="ลายเซ็น" className="h-8 object-contain" />
                    ) : null}
                  </div>

                  {/* Name line centered directly under signature line */}
                  <div className="text-xs font-medium mt-1 text-center whitespace-nowrap">
                    ( <span className="inline-block text-center">{form.proposerName || form.projectOwnerNamePage2 || '..........................................................'}</span> )
                  </div>

                  {/* Date line centered directly under signature line */}
                  <div className="text-[11px] text-slate-800 mt-1 text-center whitespace-nowrap">
                    วันที่ <span className="inline-block min-w-[90px] text-center">{form.projectOwnerDatePage2 || form.proposerDate || '......./......./.......'}</span>
                  </div>
                </div>

                <span className="whitespace-nowrap font-bold text-[11px] pt-1.5 text-slate-900">
                  ผู้เสนอโครงการ / หัวหน้าโครงการ
                </span>
              </div>
            </div>

            {/* Item 5: Department Manager Approval Box */}
            <div className="border-t border-slate-900 text-xs divide-y divide-slate-900">
              <div className="p-1.5">
                <p className="font-bold">
                  5. ความเห็นของหัวหน้าหน่วยงาน / ผู้จัดการแผนก / ผู้จัดการส่วน / ผู้อำนวยการฝ่าย
                </p>
                <div className="mt-1 pl-3 space-y-1">
                  <div className="flex items-center gap-4 flex-wrap">
                    <label className="flex items-center cursor-pointer">
                      {renderCheckbox(form.closureOpinion.closeApproved)}
                      <span className="font-bold">ปิดโครงการได้ :</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      {renderCheckbox(form.closureOpinion.closeApproved)}
                      <span>ผลลัพธ์ (KPI) ได้ตามเป้าหมาย</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      {renderCheckbox(form.closureOpinion.reliableData)}
                      <span>ข้อมูลเพียงพอและเชื่อถือได้</span>
                    </label>
                  </div>

                  <div className="flex items-baseline">
                    <label className="flex items-center whitespace-nowrap cursor-pointer mr-1">
                      {renderCheckbox(form.closureOpinion.studyMore)}
                      <span>ให้ศึกษาข้อมูลเพิ่มเติมในประเด็น</span>
                    </label>
                    {renderLine(form.closureOpinion.studyMoreDetail, 'flex-1 min-w-[200px]')}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <label className="flex items-center cursor-pointer">
                      {renderCheckbox(form.closureOpinion.expandProcess)}
                      <span>ให้ดำเนินโครงการขยายผลเพิ่มเติมในกระบวนการอื่นๆ ที่มีลักษณะหรือมีปัญหาคล้ายคลึงกัน</span>
                    </label>
                  </div>

                  <div className="flex items-baseline">
                    <label className="flex items-center whitespace-nowrap cursor-pointer mr-1">
                      {renderCheckbox(form.closureOpinion.other)}
                      <span>อื่นๆ</span>
                    </label>
                    {renderLine(form.closureOpinion.otherDetail, 'flex-1 min-w-[200px]')}
                  </div>
                </div>
              </div>

              {/* Approver Signature Line Centered */}
              <div className="p-2 flex justify-center text-center">
                <div className="flex items-start justify-center gap-2 text-xs">
                  <span className="whitespace-nowrap font-bold text-[11px] pt-1.5">ลงชื่อ</span>

                  <div className="flex flex-col items-center min-w-[220px]">
                    {/* Signature line / image */}
                    <div
                      onClick={() => onOpenSignatureModal?.('approver')}
                      className="w-full border-b border-dotted border-slate-700 min-h-[26px] flex items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors py-0.5"
                      title="คลิกเพื่อเซ็นชื่อผู้อนุมัติปิดโครงการ"
                    >
                      {form.approverSignature ? (
                        <img src={form.approverSignature} alt="ลายเซ็น" className="h-8 object-contain" />
                      ) : null}
                    </div>

                    {/* Name line centered directly under signature line */}
                    <div className="text-xs font-medium mt-1 text-center whitespace-nowrap">
                      ( <span className="inline-block text-center">{form.approverName || 'ชาลี เมฆสุวรรณ'}</span> )
                    </div>

                    {/* Date line centered directly under signature line */}
                    <div className="text-[11px] text-slate-800 mt-1 text-center whitespace-nowrap">
                      วันที่ <span className="inline-block min-w-[90px] text-center">{form.approverDate || '......./......./.......'}</span>
                    </div>
                  </div>

                  <span className="whitespace-nowrap font-bold text-[11px] pt-1.5 text-slate-900">
                    ผู้อนุมัติปิดโครงการ
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page 2 Bottom Footer */}
        <div className="pt-2 text-[9px] text-slate-800 flex flex-col gap-0.5">
          <p className="italic">Please mark "N/A" under the item that is not applicable.</p>
          <div className="flex justify-between items-center text-[8.5px] font-mono">
            <span>PTP-FM-QMS-001 ; Revision : 06 ; Issued Date : 16/04/2567 ; Page : 2/2</span>
          </div>
          <p className="text-[8px] text-slate-600">
            เอกสารฉบับนี้เป็นเอกสารภายในของโรงพยาบาลพญาไท พหลโยธินเท่านั้น ห้ามทำสำเนาหรือพิมพ์เผยแพร่ก่อนได้รับอนุมัติ และห้ามบันทึก / แก้ไขข้อความใดๆ บนเอกสารควบคุม
          </p>
        </div>
      </div>
    </div>
  );
};
