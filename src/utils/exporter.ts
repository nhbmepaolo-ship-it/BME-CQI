import * as XLSX from 'xlsx';
import { CPIFormData } from '../types';

export const exportToExcel = (form: CPIFormData) => {
  const wb = XLSX.utils.book_new();

  // Prepare Page 1 data
  const page1Data = [
    ['โรงพยาบาลพญาไท - แบบบันทึกกิจกรรมพัฒนาผลสัมฤทธิ์ของงาน (CPI)'],
    ['รหัสเอกสาร: PTP-FM-QMS-001 | Revision: 06 | Date: 16/04/2567'],
    [''],
    ['--- ส่วนที่ 1 รายละเอียดการขอดำเนินการ ---'],
    ['เลขที่โครงการ', form.docNo],
    ['วัน/เดือน/ปี ขอดำเนินการ', form.docDate],
    ['ฝ่าย/แผนก/หน่วยงาน', form.department],
    ['ชื่อโครงการ', form.projectTitle],
    ['ประเภทโครงการ', form.projectType.join(', ')],
    ['ประเภทการพัฒนา', form.developmentType.join(', ')],
    [''],
    ['ที่มาโครงการ:'],
    ['1. วิสัยทัศน์ เป้าหมายและนโยบายองค์กร', form.sourceTypes.visionPolicy ? 'ใช่ [X]' : 'ไม่ใช่ [ ]'],
    ['2. ผลสำรวจความต้องการ/ความพึงพอใจ', form.sourceTypes.satisfactionSurvey ? 'ใช่ [X]' : 'ไม่ใช่ [ ]'],
    ['3. ทบทวนระบบงาน/ความเสี่ยง', form.sourceTypes.riskReview ? 'ใช่ [X]' : 'ไม่ใช่ [ ]'],
    ['4. ข้อเสนอแนะจากเจ้าหน้าที่', form.sourceTypes.staffSuggestion ? 'ใช่ [X]' : 'ไม่ใช่ [ ]'],
    ['5. การประเมินคุณภาพภายใน', form.sourceTypes.internalAudit ? `ใช่ [X] ครั้งที่ ${form.sourceTypes.internalAuditNo}` : 'ไม่ใช่ [ ]'],
    ['6. ข้อร้องเรียนของผู้รับบริการ', form.sourceTypes.complaint ? `ใช่ [X] เลขที่ ${form.sourceTypes.complaintNo}` : 'ไม่ใช่ [ ]'],
    ['7. KPI ตกเกณฑ์', form.sourceTypes.kpiUnmet ? 'ใช่ [X]' : 'ไม่ใช่ [ ]'],
    ['8. อื่นๆ', form.sourceTypes.other ? `ใช่ [X] ${form.sourceTypes.otherDetail}` : 'ไม่ใช่ [ ]'],
    [''],
    ['--- ส่วนที่ 2 รายละเอียดโครงการ ---'],
    ['1. สถานการณ์ปัญหา/โอกาสพัฒนา', form.problemStatement],
    ['2. เป้าหมาย', form.goal],
    ['3. ตัวชี้วัด (KPI) และ Target', form.kpiAndTarget],
    ['4. ขั้นตอนการปรับปรุงกระบวนการ', form.improvementSteps],
    ['5. ระยะเวลาดำเนินการ', `เริ่มต้น: ${form.startDate} ถึง สิ้นสุด: ${form.endDate}`],
    ['6. ประโยชน์ที่คาดว่าจะได้รับ', form.expectedBenefits],
    ['7. งบประมาณ', form.budget],
    [''],
    ['ผู้เสนอโครงการ', form.proposerName, 'วันที่:', form.proposerDate],
    ['ความเห็นหัวหน้างาน', form.deptHeadOpinion === 'approve' ? 'เห็นสมควรเปิดโครงการ' : form.deptHeadOpinion === 'disapprove' ? 'ไม่เห็นด้วยกับการเปิดโครงการ' : '-'],
    ['หัวหน้างาน/ผู้จัดการแผนก', form.deptHeadName, 'ตำแหน่ง:', form.deptHeadPosition, 'วันที่:', form.deptHeadDate],
  ];

  // Prepare Page 2 data
  const page2Data = [
    ['--- ส่วนที่ 3 รายงานผลการพัฒนาผลสัมฤทธิ์ของงาน (หน้า 2) ---'],
    ['เลขที่โครงการ', form.docNo],
    ['ชื่อโครงการ', form.projectTitle],
    ['1.1 ผลลัพธ์ KPI', form.resultsKPI],
    ['1.2 ผลลัพธ์อื่นๆ', form.resultsOther],
    [''],
    ['2. ประโยชน์ที่ได้รับ:'],
    ['เพิ่มความพึงพอใจของผู้รับบริการ', form.benefitsReceived.increaseSatisfaction ? '[X]' : '[ ]'],
    ['เพิ่มประสิทธิภาพการสื่อสารภายใน', form.benefitsReceived.internalCommEfficiency ? '[X]' : '[ ]'],
    ['ลดความผิดพลาดในการให้บริการ', form.benefitsReceived.reduceErrors ? '[X]' : '[ ]'],
    ['เพิ่มความรู้ ความชำนาญของเจ้าหน้าที่', form.benefitsReceived.staffSkill ? '[X]' : '[ ]'],
    ['มีการใช้ทรัพยากร อย่างคุ้มค่า', form.benefitsReceived.efficientResource ? '[X]' : '[ ]'],
    ['เพิ่มความพึงพอใจของเจ้าหน้าที่', form.benefitsReceived.staffSatisfaction ? '[X]' : '[ ]'],
    ['ลดภาวะแทรกซ้อนของผู้ป่วย', form.benefitsReceived.reduceComplications ? '[X]' : '[ ]'],
    ['ผลลัพธ์การรักษาดีขึ้น', form.benefitsReceived.treatmentOutcome ? '[X]' : '[ ]'],
    ['เพิ่มความรวดเร็วในการให้บริการ', form.benefitsReceived.increaseSpeed ? '[X]' : '[ ]'],
    ['เพิ่มความปลอดภัย', form.benefitsReceived.increaseSafety ? '[X]' : '[ ]'],
    ['เพิ่มคุณค่าการบริการ', form.benefitsReceived.increaseValue ? '[X]' : '[ ]'],
    ['ลดต้นทุน/ค่าใช้จ่าย', form.benefitsReceived.costReduction ? `[X] จำนวน ${form.benefitsReceived.costReductionAmount} บาท` : '[ ]'],
    ['เพิ่มรายได้', form.benefitsReceived.revenueIncrease ? `[X] จำนวน ${form.benefitsReceived.revenueIncreaseAmount} บาท` : '[ ]'],
    [''],
    ['3. ปัญหาอุปสรรคการดำเนินโครงการ:'],
    ['3.1 การเก็บรวบรวมข้อมูล', form.obstacles.dataCollection],
    ['3.2 การเก็บตัวชี้วัด', form.obstacles.kpiCollection],
    ['3.3 การหาแนวทางแก้ไข', form.obstacles.findingSolutions],
    ['3.4 อื่นๆ', form.obstacles.other],
    [''],
    ['4. ข้อเสนอแนะ / การขยายผลโครงการ', form.recommendationsExpansion],
    ['ผู้เสนอโครงการ (หน้า 2)', form.projectOwnerNamePage2, 'วันที่:', form.projectOwnerDatePage2],
    [''],
    ['5. ความเห็นการอนุมัติปิดโครงการ:'],
    ['ปิดโครงการได้ : ผลลัพธ์ (KPI) ได้ตามเป้าหมาย', form.closureOpinion.closeApproved ? '[X]' : '[ ]'],
    ['ข้อมูลเพียงพอและเชื่อถือได้', form.closureOpinion.reliableData ? '[X]' : '[ ]'],
    ['ศึกษาข้อมูลเพิ่มเติมในประเด็น', form.closureOpinion.studyMore ? `[X] ${form.closureOpinion.studyMoreDetail}` : '[ ]'],
    ['ขยายผลในกระบวนการอื่น', form.closureOpinion.expandProcess ? '[X]' : '[ ]'],
    ['ผู้อนุมัติปิดโครงการ', form.approverName, 'วันที่:', form.approverDate],
  ];

  const ws1 = XLSX.utils.aoa_to_sheet(page1Data);
  const ws2 = XLSX.utils.aoa_to_sheet(page2Data);

  // Auto-fit column widths
  ws1['!cols'] = [{ wch: 35 }, { wch: 50 }, { wch: 15 }, { wch: 25 }];
  ws2['!cols'] = [{ wch: 35 }, { wch: 50 }, { wch: 15 }, { wch: 25 }];

  XLSX.utils.book_append_sheet(wb, ws1, 'CPI_ส่วนที่1และ2');
  XLSX.utils.book_append_sheet(wb, ws2, 'CPI_ส่วนที่3');

  const fileName = `CPI_Phyathai_${form.docNo || 'Draft'}.xlsx`;
  XLSX.writeFile(wb, fileName);
};

export const printOrSavePDF = () => {
  window.print();
};
