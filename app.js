// CPI Form System Application JavaScript

// Pre-defined Proposers List (15 names specified by user)
const PROPOSER_NAMES = [
  "รัชณี มาจานิตย์",
  "นฤมล จอนโคกกรวด",
  "ณัฐพร เสวิสิทธิ์",
  "สุพัตรา แก้วสุวรรณ์",
  "ไอยเรศ กิจจาชาญชัยกุล",
  "ศุภวัฒน์ เกตุมาน",
  "สุวภา เผือกพันธ์",
  "ทวีวัฒน์ ทุเครือ",
  "ธิติมา ภูช่างทอง",
  "ศลิษา แซ่ลิ่ม",
  "กานต์ธิดา หามนตรี",
  "พรรณพัชร พิศพรรณ์",
  "เจตสิก อิ่มทั่ว",
  "ปิ่นมณี ทัสสะคัง",
  "สุธาทิพย์ เอี่ยมมี"
];

const DEFAULT_APPROVER = "ชาลี เมฆสุวรรณ";
const DEFAULT_DEPT = "แผนกวิศวกรรมการแพทย์";

// Form State Factories
function makeSampleFormData() {
  const currentYearBE = new Date().getFullYear() + 543;
  return {
    // Page 1 Header & Part 1
    projectNo: `BME-${currentYearBE}-001`,
    docDate: new Date().toISOString().split('T')[0],
    department: DEFAULT_DEPT,
    projectName: "โครงการลดระยะเวลาการเข้าซ่อมแซมและบำรุงรักษาเครื่องมือแพทย์วิกฤต (Mean Time to Repair: MTTR)",
    
    projType_IA: false,
    projType_PIP: true,
    projType_BIP: false,
    
    devType_Clinical: false,
    devType_Service: true,
    devType_Research: false,
    
    src_Vision: false,
    src_Review: true,
    src_InternalAudit: false,
    src_InternalAuditDetail: "",
    src_KpiDrop: true,
    src_Survey: false,
    src_StaffSuggest: false,
    src_Complaint: false,
    src_ComplaintNo: "",
    src_Other: false,
    src_OtherDetail: "",

    // Part 2 Details
    problemStatement: "จากการเก็บข้อมูลสถิติการแจ้งซ่อมเครื่องมือแพทย์ในแผนกผู้ป่วยวิกฤต (ICU/CCU) พบว่าระยะเวลาตอบสนองและการเข้าซ่อมแซมเฉลี่ยอยู่ที่ 120 นาที ซึ่งเกินกว่าเกณฑ์มาตรฐานที่กำหนดไว้ไม่เกิน 60 นาที ส่งผลกระทบต่อความพร้อมในการใช้งานเครื่องมือแพทย์และการดูแลผู้ป่วย",
    goal: "ลดระยะเวลาตอบสนองและการเข้าซ่อมแซมเครื่องมือแพทย์วิกฤตลงมากกว่า 50% (เหลือไม่เกิน 45 นาที) ภายในไตรมาสที่ 3",
    kpiTarget: "อัตราเฉลี่ยเวลาตอบสนองการซ่อม (MTTR) <= 45 นาที และ อัตราความพึงพอใจของหอผู้ป่วยวิกฤต >= 92%",
    improvementSteps: "1. จัดทำระบบแจ้งซ่อมเครื่องมือแพทย์ผ่านไลน์ด่วน (BME Urgent Alert)\n2. จัดเตรียมชุดสำรองอะไหล่เครื่องมือแพทย์วิกฤต (Rapid Response Spare Parts Kit) ไว้ประจำจุดเสี่ยง\n3. จัดระบบเข้าเวรพนักงานวิศวกรรมการแพทย์ประจำจุดวิกฤตตลอด 24 ชั่วโมง",
    startDate: "2026-09-01",
    endDate: "2026-12-31",
    benefits: "1. เพิ่มความปลอดภัยและลดความเสี่ยงต่อการดูแลผู้ป่วยวิกฤต\n2. เครื่องมือแพทย์มีความพร้อมใช้งานสูงขึ้น (> 98% Availability)",
    budget: "25,000",
    
    proposerName: PROPOSER_NAMES[0],
    proposerDate: new Date().toISOString().split('T')[0],
    proposerSignature: null,

    approverOption: "approve", // approve / reject
    approverName: DEFAULT_APPROVER,
    approverDate: new Date().toISOString().split('T')[0],
    approverSignature: null,

    // Page 2 Part 3 (Report)
    kpiResults: "ผลการดำเนินงานหลังปรับปรุงระบบ MTTR เฉลี่ยลดลงเหลือ 38 นาที (ดีกว่าเป้าหมายที่ตั้งไว้ 45 นาที) และคะแนนความพึงพอใจของหอผู้ป่วยวิกฤตเพิ่มขึ้นเป็น 95.5%",
    otherResults: "ลดความสูญเสียเวลาของพยาบาลในการติดตามสถานะการซ่อมได้มากกว่า 150 ชั่วโมง/เดือน",

    // Benefits checkboxes
    b_sat_client: true,
    b_knowledge: true,
    b_complications: true,
    b_safety: true,
    b_income: false,
    b_income_amt: "",
    b_communication: true,
    b_resource: true,
    b_treatment: true,
    b_val_added: true,
    b_other: false,
    b_other_detail: "",
    b_err_reduction: true,
    b_staff_sat: true,
    b_speed: true,
    b_cost_reduction: true,
    b_cost_amt: "45,000",

    // Challenges & Solutions
    c_data_collect: "ความต่อเนื่องในการบันทึกเวลาของเจ้าหน้าที่พยาบาลขณะเกิดเหตุฉุกเฉิน",
    c_kpi_collect: "การสกัดข้อมูลเวลาจากระบบสารสนเทศในหอผู้ป่วย",
    c_solution: "ปรับปรุงปุ่มกดแจ้งซ่อมแบบ Quick Button บนเครื่องและแท็บเล็ตประจำหอผู้ป่วย",
    c_other: "-",

    // Recommendations
    recommendations: "ขยายผลการจัดทำชุดสำรองอะไหล่ด่วนไปยังแผนกห้องผ่าตัด (OR) และแผนกอุบัติเหตุฉุกเฉิน (ER)",

    // Part 3 Signatures
    p3_proposerName: PROPOSER_NAMES[0],
    p3_proposerDate: new Date().toISOString().split('T')[0],
    p3_proposerSignature: null,

    // Approver Close Project
    close_approve: true,
    close_target_met: true,
    close_data_reliable: true,
    close_more_study: false,
    close_study_detail: "",
    close_expand: true,
    close_other: false,
    close_other_detail: "",

    p3_approverName: DEFAULT_APPROVER,
    p3_approverDate: new Date().toISOString().split('T')[0],
    p3_approverSignature: null
  };
}

// Initial Form State
let formData = makeSampleFormData();

// Field Position Nudge Offsets { key: { dx: 0, dy: 0, lineGap: 0, fontSize: 12.5, scaleH: 1.0 } }
let fieldOffsets = {};
let selectedFieldKey = null;
let isResizing = false;
let resizeStartX = 0, resizeStartY = 0;
let resizeStartWidth = 0, resizeStartHeight = 0;

// Signature Pad Variables
let activeSigField = null;
let sigCanvas, sigCtx;
let isDrawing = false;

// ============================================================
// Draft Autosave — keep entered data & positions across reloads
// ============================================================
const DRAFT_KEY = 'cpi_draft_v1';
let draftSaveTimer = null;

window.scheduleDraftSave = function() {
  clearTimeout(draftSaveTimer);
  draftSaveTimer = setTimeout(saveDraftNow, 500);
};

function saveDraftNow() {
  const buildObj = (includePhotos) => ({
    id: window.getCurrentDocId ? window.getCurrentDocId() : null,
    formData: formData,
    fieldOffsets: fieldOffsets,
    kpi: window.getKpiState ? window.getKpiState() : { items: [] },
    photos: (includePhotos && window.getPhotoState) ? window.getPhotoState() : [],
    savedAt: Date.now()
  });

  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(buildObj(true)));
  } catch (e) {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(buildObj(false)));
    } catch (e2) {
      console.warn("LocalStorage quota full");
    }
  }
}

function restoreDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return;
    const d = JSON.parse(raw);
    if (d.formData) formData = Object.assign(makeBlankFormData(), d.formData);
    if (d.fieldOffsets) fieldOffsets = d.fieldOffsets;
    if (window.setKpiState && d.kpi) window.setKpiState(d.kpi);
    if (window.setPhotoState && d.photos) window.setPhotoState(d.photos);
    if (d.id && window.setCurrentDocId) window.setCurrentDocId(d.id);
  } catch (e) { /* corrupt draft — ignore */ }
}

// Highlight selection WITHOUT rebuilding the overlay
function updateSelectionHighlight() {
  document.querySelectorAll('.page-overlay .field-item, .page-overlay .check-item').forEach(el => {
    el.classList.toggle('selected', el.dataset.field === selectedFieldKey);
  });
}

// Detect press on the native CSS resize grip
function isResizeHandleHit(e, div) {
  const rect = div.getBoundingClientRect();
  const x = (e.touches && e.touches.length) ? e.touches[0].clientX : e.clientX;
  const y = (e.touches && e.touches.length) ? e.touches[0].clientY : e.clientY;
  return (rect.right - x) < 20 && (rect.bottom - y) < 20;
}

// Persist manually resized box dimensions
function watchElementResize(div, fieldKey, pageContainer) {
  if (typeof ResizeObserver === 'undefined') return;
  let lastW = null, lastH = null;
  const ro = new ResizeObserver(() => {
    const rect = div.getBoundingClientRect();
    if (lastW === null) { lastW = rect.width; lastH = rect.height; return; }
    if (Math.abs(rect.width - lastW) < 1.5 && Math.abs(rect.height - lastH) < 1.5) return;
    lastW = rect.width; lastH = rect.height;
    const pageRect = pageContainer.getBoundingClientRect();
    if (!pageRect.width) return;
    if (!fieldOffsets[fieldKey]) fieldOffsets[fieldKey] = { dx: 0, dy: 0 };
    fieldOffsets[fieldKey].w = (rect.width / pageRect.width) * 100;
    fieldOffsets[fieldKey].h = rect.height;
    window.scheduleDraftSave();
  });
  ro.observe(div);
}

// Global Modal Functions
window.openModal = function(id) {
  const m = document.getElementById(id);
  if (m) m.classList.add('active');
};

window.closeModal = function(id) {
  const m = document.getElementById(id);
  if (m) m.classList.remove('active');
};

// Toast Notification
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => {
    t.classList.remove('show');
  }, 3500);
}

// Position Nudge Functions
function makeBlankFormData() {
  const currentYearBE = new Date().getFullYear() + 543;
  return {
    projectNo: `BME-${currentYearBE}-${String(Math.floor(Math.random() * 900) + 100)}`,
    docDate: new Date().toISOString().split('T')[0],
    department: DEFAULT_DEPT,
    projectName: "",
    projType_IA: false,
    projType_PIP: false,
    projType_BIP: false,
    devType_Clinical: false,
    devType_Service: false,
    devType_Research: false,
    src_Vision: false,
    src_Review: false,
    src_InternalAudit: false,
    src_InternalAuditDetail: "",
    src_KpiDrop: false,
    src_Survey: false,
    src_StaffSuggest: false,
    src_Complaint: false,
    src_ComplaintNo: "",
    src_Other: false,
    src_OtherDetail: "",
    problemStatement: "",
    goal: "",
    kpiTarget: "",
    improvementSteps: "",
    startDate: "",
    endDate: "",
    benefits: "",
    budget: "",
    proposerName: PROPOSER_NAMES[0],
    proposerDate: new Date().toISOString().split('T')[0],
    proposerSignature: null,
    approverOption: "approve",
    approverName: DEFAULT_APPROVER,
    approverDate: new Date().toISOString().split('T')[0],
    approverSignature: null,
    kpiResults: "",
    otherResults: "",
    b_sat_client: false,
    b_knowledge: false,
    b_complications: false,
    b_safety: false,
    b_income: false,
    b_income_amt: "",
    b_communication: false,
    b_resource: false,
    b_treatment: false,
    b_val_added: false,
    b_other: false,
    b_other_detail: "",
    b_err_reduction: false,
    b_staff_sat: false,
    b_speed: false,
    b_cost_reduction: false,
    b_cost_amt: "",
    c_data_collect: "",
    c_kpi_collect: "",
    c_solution: "",
    c_other: "",
    recommendations: "",
    p3_proposerName: PROPOSER_NAMES[0],
    p3_proposerDate: new Date().toISOString().split('T')[0],
    p3_proposerSignature: null,
    close_approve: false,
    close_target_met: false,
    close_data_reliable: false,
    close_more_study: false,
    close_study_detail: "",
    close_expand: false,
    close_other: false,
    close_other_detail: "",
    p3_approverName: DEFAULT_APPROVER,
    p3_approverDate: new Date().toISOString().split('T')[0],
    p3_approverSignature: null
  };
}

window.resetForm = function() {
  if (confirm('⚠️ ต้องการเริ่มแบบฟอร์มใหม่ว่างเปล่าใช่ไหม? (ข้อมูลที่ยังไม่บันทึกจะหาย)')) {
    formData = makeBlankFormData();
    fieldOffsets = {};
    selectedFieldKey = null;
    applyFormDataToDOM(formData);
    renderOverlay();
    if (window.setKpiState) window.setKpiState({ items: [] });
    if (window.setPhotoState) window.setPhotoState([]);
    if (window.setCurrentDocId) window.setCurrentDocId(null);
    showToast('✅ ล้างข้อมูลเรียบร้อย');
  }
};

window.selectField = function(key, labelName) {
  selectedFieldKey = key;
  if (!fieldOffsets[key]) {
    fieldOffsets[key] = { dx: 0, dy: 0, lineGap: 0, fontSize: 12.5, scaleH: 1.0 };
  }
  const labelEl = document.getElementById('selectedFieldLabel');
  if (labelEl) labelEl.textContent = labelName || key;
  updateAdjusterUI();
  updateSelectionHighlight();
};

window.nudgeField = function(dx, dy) {
  if (!selectedFieldKey) {
    showToast('⚠️ กรุณาคลิกเลือกข้อความในเอกสารที่ต้องการขยับก่อน');
    return;
  }
  if (!fieldOffsets[selectedFieldKey]) fieldOffsets[selectedFieldKey] = { dx: 0, dy: 0, lineGap: 0 };
  fieldOffsets[selectedFieldKey].dx += dx;
  fieldOffsets[selectedFieldKey].dy += dy;
  renderOverlay();
};

window.nudgeLineHeight = function(dGap) {
  if (!selectedFieldKey) {
    showToast('⚠️ กรุณาคลิกเลือกข้อความในเอกสารก่อน');
    return;
  }
  if (!fieldOffsets[selectedFieldKey]) fieldOffsets[selectedFieldKey] = { dx: 0, dy: 0, lineGap: 0, fontSize: 12.5, scaleH: 1.0 };
  fieldOffsets[selectedFieldKey].lineGap += dGap;
  renderOverlay();
};

window.setFieldFontSize = function(size) {
  if (!selectedFieldKey) return;
  if (!fieldOffsets[selectedFieldKey]) fieldOffsets[selectedFieldKey] = { dx: 0, dy: 0, lineGap: 0, fontSize: 12.5, scaleH: 1.0 };
  fieldOffsets[selectedFieldKey].fontSize = parseFloat(size);
  const input = document.getElementById('fontSizeInput');
  if (input) input.value = size;
  renderOverlay();
};

window.setFieldScale = function(scale) {
  if (!selectedFieldKey) return;
  if (!fieldOffsets[selectedFieldKey]) fieldOffsets[selectedFieldKey] = { dx: 0, dy: 0, lineGap: 0, fontSize: 12.5, scaleH: 1.0 };
  fieldOffsets[selectedFieldKey].scaleH = parseFloat(scale);
  const input = document.getElementById('scaleHeightInput');
  if (input) input.value = scale;
  renderOverlay();
};

window.quickScale = function(preset) {
  if (!selectedFieldKey) {
    showToast('⚠️ กรุณาคลิกเลือกข้อความในเอกสารก่อน');
    return;
  }
  const scales = { S: 0.8, M: 1.0, L: 1.3, XL: 1.6 };
  setFieldScale(scales[preset] || 1.0);
};

function updateAdjusterUI() {
  if (!selectedFieldKey) return;
  const offset = fieldOffsets[selectedFieldKey] || { dx: 0, dy: 0, lineGap: 0, fontSize: 12.5, scaleH: 1.0 };
  const fsInput = document.getElementById('fontSizeInput');
  const scInput = document.getElementById('scaleHeightInput');
  if (fsInput) fsInput.value = offset.fontSize || 12.5;
  if (scInput) scInput.value = offset.scaleH || 1.0;
}

window.resetAllOffsets = function() {
  fieldOffsets = {};
  selectedFieldKey = null;
  const labelEl = document.getElementById('selectedFieldLabel');
  if (labelEl) labelEl.textContent = '(เลือกข้อความโดยคลิก/ลาก)';
  renderOverlay();
  showToast('↺ คืนค่าพิกัดเดิมทั้งหมดเรียบร้อย');
};

// Bind Visual Drag & Drop to any Overlay Element (Mouse & Touch)
function makeElementDraggable(div, fieldKey, pageContainer, labelName) {
  let isDragging = false;
  let startX, startY;
  let initDx = 0, initDy = 0;

  div.addEventListener('mousedown', (e) => {
    if (isResizeHandleHit(e, div)) { e.stopPropagation(); return; }
    e.stopPropagation();
    e.preventDefault();
    isDragging = true;
    div.style.cursor = 'grabbing';
    window.selectField(fieldKey, labelName || fieldKey);

    startX = e.clientX;
    startY = e.clientY;

    if (!fieldOffsets[fieldKey]) fieldOffsets[fieldKey] = { dx: 0, dy: 0, lineGap: 0 };
    initDx = fieldOffsets[fieldKey].dx;
    initDy = fieldOffsets[fieldKey].dy;

    const pageRect = pageContainer.getBoundingClientRect();

    function onMouseMove(me) {
      if (!isDragging) return;
      const dxPx = me.clientX - startX;
      const dyPx = me.clientY - startY;

      const dxPct = (dxPx / pageRect.width) * 100;
      const dyPct = (dyPx / pageRect.height) * 100;

      fieldOffsets[fieldKey].dx = initDx + dxPct;
      fieldOffsets[fieldKey].dy = initDy + dyPct;

      renderOverlay();
    }

    function onMouseUp() {
      if (isDragging) {
        isDragging = false;
        div.style.cursor = 'grab';
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      }
    }

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  });

  // Touch support for tablets & touchscreen devices
  div.addEventListener('touchstart', (e) => {
    if (isResizeHandleHit(e, div)) { e.stopPropagation(); return; }
    if (!e.touches || e.touches.length === 0) return;
    e.stopPropagation();
    isDragging = true;
    window.selectField(fieldKey, labelName || fieldKey);

    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;

    if (!fieldOffsets[fieldKey]) fieldOffsets[fieldKey] = { dx: 0, dy: 0, lineGap: 0 };
    initDx = fieldOffsets[fieldKey].dx;
    initDy = fieldOffsets[fieldKey].dy;

    const pageRect = pageContainer.getBoundingClientRect();

    function onTouchMove(te) {
      if (!isDragging || !te.touches) return;
      te.preventDefault();
      const dxPx = te.touches[0].clientX - startX;
      const dyPx = te.touches[0].clientY - startY;

      const dxPct = (dxPx / pageRect.width) * 100;
      const dyPct = (dyPx / pageRect.height) * 100;

      fieldOffsets[fieldKey].dx = initDx + dxPct;
      fieldOffsets[fieldKey].dy = initDy + dyPct;

      renderOverlay();
    }

    function onTouchEnd() {
      if (isDragging) {
        isDragging = false;
        window.removeEventListener('touchmove', onTouchMove);
        window.removeEventListener('touchend', onTouchEnd);
      }
    }

    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);
  });
}

// DOM Initialization
document.addEventListener('DOMContentLoaded', () => {
  restoreDraft();
  initDropdowns();
  bindFormEvents();
  initSignaturePad();
  initAIPrompts();
  initBackdropClicks();
  initKeyboardNudge();
  renderOverlay();
});

// Keyboard Nudge Shortcuts (Arrow Keys)
function initKeyboardNudge() {
  document.addEventListener('keydown', (e) => {
    if (!selectedFieldKey) return;
    const activeEl = document.activeElement;
    if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.tagName === 'SELECT')) {
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      window.nudgeField(0, -0.2);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      window.nudgeField(0, 0.2);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      window.nudgeField(-0.3, 0);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      window.nudgeField(0.3, 0);
    }
  });
}

// Close modals when clicking backdrop
function initBackdropClicks() {
  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        backdrop.classList.remove('active');
      }
    });
  });
}

// Initialize Dropdowns
function initDropdowns() {
  const proposerSelects = [
    document.getElementById('proposerName'),
    document.getElementById('p3_proposerName')
  ];

  proposerSelects.forEach(select => {
    if (!select) return;
    select.innerHTML = '';
    PROPOSER_NAMES.forEach(name => {
      const opt = document.createElement('option');
      opt.value = name;
      opt.textContent = name;
      select.appendChild(opt);
    });
  });

  if (document.getElementById('proposerName')) document.getElementById('proposerName').value = formData.proposerName;
  if (document.getElementById('p3_proposerName')) document.getElementById('p3_proposerName').value = formData.p3_proposerName;
  if (document.getElementById('approverName')) document.getElementById('approverName').value = formData.approverName;
  if (document.getElementById('p3_approverName')) document.getElementById('p3_approverName').value = formData.p3_approverName;
}

// Apply a formData object into all DOM inputs
function applyFormDataToDOM(fd) {
  if (!fd) return;
  Object.keys(fd).forEach(key => {
    const el = document.getElementById(key);
    if (!el) return;
    if (el.type === 'checkbox') {
      el.checked = !!fd[key];
    } else {
      el.value = fd[key] == null ? "" : fd[key];
    }
  });
  updateSignaturePreviews();
  renderOverlay();
}

// Collect the full current document payload for saving
window.collectDocPayload = function() {
  return {
    id: window.getCurrentDocId ? window.getCurrentDocId() : null,
    formData: formData,
    fieldOffsets: fieldOffsets,
    kpi: window.getKpiState ? window.getKpiState() : { items: [] },
    photos: window.getPhotoState ? window.getPhotoState() : []
  };
};

// Bind Form Inputs to State
function bindFormEvents() {
  Object.keys(formData).forEach(key => {
    const el = document.getElementById(key);
    if (!el) return;

    if (el.type === 'checkbox') {
      el.checked = formData[key];
      el.addEventListener('change', (e) => {
        formData[key] = e.target.checked;
        renderOverlay();
      });
    } else {
      el.value = formData[key];
      el.addEventListener('input', (e) => {
        formData[key] = e.target.value;
        if (key === 'proposerName') {
          formData.p3_proposerName = e.target.value;
          const p3El = document.getElementById('p3_proposerName');
          if (p3El) p3El.value = e.target.value;
        }
        renderOverlay();
      });
    }
  });

  // Tab Switching
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      
      btn.classList.add('active');
      const targetPane = document.getElementById(btn.dataset.tab);
      if (targetPane) targetPane.classList.add('active');
    });
  });
}

// Digital Signature Canvas Setup
function initSignaturePad() {
  sigCanvas = document.getElementById('signatureCanvas');
  if (!sigCanvas) return;
  sigCtx = sigCanvas.getContext('2d');

  function resizeCanvas() {
    const rect = sigCanvas.getBoundingClientRect();
    sigCanvas.width = rect.width;
    sigCanvas.height = rect.height;
    sigCtx.lineWidth = 2.5;
    sigCtx.lineCap = 'round';
    sigCtx.strokeStyle = '#000000';
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  function getPos(e) {
    const rect = sigCanvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }

  function startDraw(e) {
    isDrawing = true;
    const pos = getPos(e);
    sigCtx.beginPath();
    sigCtx.moveTo(pos.x, pos.y);
  }

  function draw(e) {
    if (!isDrawing) return;
    e.preventDefault();
    const pos = getPos(e);
    sigCtx.lineTo(pos.x, pos.y);
    sigCtx.stroke();
  }

  function stopDraw() {
    isDrawing = false;
  }

  sigCanvas.addEventListener('mousedown', startDraw);
  sigCanvas.addEventListener('mousemove', draw);
  sigCanvas.addEventListener('mouseup', stopDraw);
  sigCanvas.addEventListener('mouseleave', stopDraw);

  sigCanvas.addEventListener('touchstart', startDraw);
  sigCanvas.addEventListener('touchmove', draw);
  sigCanvas.addEventListener('touchend', stopDraw);

  // Clear Signature Button
  document.getElementById('btnClearSig').addEventListener('click', () => {
    sigCtx.clearRect(0, 0, sigCanvas.width, sigCanvas.height);
  });

  // Save Signature Button
  document.getElementById('btnSaveSig').addEventListener('click', () => {
    const dataUrl = sigCanvas.toDataURL('image/png');
    if (activeSigField) {
      formData[activeSigField] = dataUrl;
      
      if (activeSigField === 'proposerSignature') formData.p3_proposerSignature = dataUrl;
      if (activeSigField === 'approverSignature') formData.p3_approverSignature = dataUrl;
      
      updateSignaturePreviews();
      renderOverlay();
      showToast('✍️ บันทึกลายเซ็นดิจิทัลเรียบร้อยแล้ว');
    }
    closeModal('sigModal');
  });
}

// Open Signature Modal
window.openSignatureModal = function(fieldName) {
  activeSigField = fieldName;
  openModal('sigModal');
  
  setTimeout(() => {
    const rect = sigCanvas.getBoundingClientRect();
    sigCanvas.width = rect.width;
    sigCanvas.height = rect.height;
    sigCtx.lineWidth = 2.5;
    sigCtx.lineCap = 'round';
    sigCtx.strokeStyle = '#000000';
    sigCtx.clearRect(0, 0, sigCanvas.width, sigCanvas.height);
  }, 100);
};

function updateSignaturePreviews() {
  ['proposerSignature', 'approverSignature', 'p3_proposerSignature', 'p3_approverSignature'].forEach(key => {
    const imgEl = document.getElementById(key + '_img');
    if (imgEl) {
      if (formData[key]) {
        imgEl.src = formData[key];
        imgEl.style.display = 'block';
      } else {
        imgEl.style.display = 'none';
      }
    }
  });
}

// AI CPI Preset Project Generators
const AI_PRESETS = [
  {
    title: "ตรวจเช็คและเฝ้าระวังถังแก๊สทางการแพทย์",
    data: {
      projectName: "โครงการพัฒนาระบบตรวจเช็คและเฝ้าระวังความพร้อมใช้งานของถังแก๊สทางการแพทย์",
      problemStatement: "จากการสำรวจความพร้อมใช้งานของถังแก๊สทางการแพทย์สำรอง (Oxygen & Medical Air Cylinders) ตามหอผู้ป่วยและห้องผ่าตัด พบว่าปัญหาปริมาณแก๊สแรงดันต่ำโดยไม่ทราบล่วงหน้า และการบันทึกสถานะแรงดันประจำวันไม่สม่ำเสมอ เสี่ยงต่อความปลอดภัยขณะเคลื่อนย้ายผู้ป่วย",
      goal: "เพิ่มอัตราความพร้อมใช้งาน 100% ของถังแก๊สทางการแพทย์สำรอง และลดระยะเวลาเปลี่ยนถังแก๊สด่วนลงเหลือไม่เกิน 15 นาที",
      kpiTarget: "1. อัตราความพร้อมใช้งานถังแก๊สทางการแพทย์ = 100%\n2. อัตราการบันทึกสถานะแรงดันตรงเวลา >= 98%",
      improvementSteps: "1. ติดตั้งสติกเกอร์เกจวัดแรงดันพร้อมแถบสีแยกความเสี่ยง (Color-Coded Pressure Gauge)\n2. พัฒนาระบบสแกน QR Code ตรวจสอบและรายงานปริมาณแก๊สผ่านแท็บเล็ต BME Gas Tracker\n3. จัดระบบหมุนเวียนเวรเติมถังแก๊สทางการแพทย์ล่วงหน้าทุกเช้า",
      benefits: "1. มั่นใจได้ 100% ว่าถังแก๊สทางการแพทย์มีความพร้อมใช้งานปลอดภัยตลอดเวลา\n2. ลดความผิดพลาดและลดเวลาในการบันทึกและสรุปรายงานข้อมูลการตรวจเช็คถังแก๊ส",
      kpiResults: "ผลการทดลองใช้งานระบบ BME Gas Tracker ทำให้ความพร้อมใช้งานของถังแก๊สบรรลุ 100% ไม่พบเหตุการณ์แก๊สหมดขณะเคลื่อนย้ายผู้ป่วย",
      c_solution: "กำหนดพิกัดจุดวางถังแก๊สสำรอง (Gas Station) ชัดเจนในทุกหอผู้ป่วยพร้อมป้ายเตือนระดับแรงดัน",
      recommendations: "ขยายผลระบบ Smart Gas Monitoring ไปยังรถพยาบาลฉุกเฉิน (Ambulance) และแผนก ER"
    }
  },
  {
    title: "ลดระยะเวลาเข้าซ่อมเครื่องมือแพทย์วิกฤต (MTTR)",
    data: {
      projectName: "โครงการลดระยะเวลาการเข้าซ่อมแซมและบำรุงรักษาเครื่องมือแพทย์วิกฤต (Mean Time to Repair)",
      problemStatement: "จากการสถิติการแจ้งซ่อมเครื่องมือแพทย์ในหอผู้ป่วยวิกฤต (ICU/CCU/OR) พบว่าระยะเวลาตอบสนองการซ่อมแซมเฉลี่ยอยู่ที่ 95 นาที ซึ่งสูงกว่าเป้าหมายมาตรฐาน (ไม่เกิน 45 นาที) ส่งผลกระทบต่อความพร้อมในการดูแลรักษาผู้ป่วยวิกฤต",
      goal: "ลดระยะเวลาเฉลี่ยการเข้าซ่อมแซมเครื่องมือแพทย์วิกฤตลงเหลือไม่เกิน 40 นาที และเพิ่มความพึงพอใจของหอผู้ป่วยวิกฤตขึ้นเป็นมากกว่า 95%",
      kpiTarget: "1. MTTR เครื่องมือแพทย์วิกฤต <= 40 นาที\n2. อัตราความพึงพอใจผู้ใช้บริการ >= 95%",
      improvementSteps: "1. จัดทำระบบแจ้งซ่อมด่วนผ่านแอปพลิเคชัน BME Rapid Service\n2. จัดตั้ง Mobile Spare-Parts Cart สำหรับเครื่องมือแพทย์วิกฤตประจำหอผู้ป่วย\n3. จัดอบรมการแก้ไขปัญหาเบื้องต้น (First-Line Troubleshooting) ให้กับพยาบาลประจำหอผู้ป่วย",
      benefits: "1. เพิ่มความปลอดภัยและลดความเสี่ยงต่อการดูแลผู้ป่วยวิกฤต\n2. เครื่องมือแพทย์มีความพร้อมใช้งานสูงขึ้น (> 98% Availability)",
      kpiResults: "ผลการดำเนินงานหลังปรับปรุงระบบ MTTR เฉลี่ยลดลงเหลือ 35 นาที (จากเดิม 95 นาที) และคะแนนความพึงพอใจของหอผู้ป่วยวิกฤตเพิ่มขึ้นเป็น 97.2%",
      c_solution: "จัดทำคลิปวิดีโอแนะนำการใช้งานและการแก้ไขปัญหาเบื้องต้นความยาว 1 นาทีติด QR Code ไว้ที่ตัวเครื่อง",
      recommendations: "ขยายผลระบบ BME Rapid Service ไปยังหอผู้ป่วยสามัญและห้องตรวจฉุกเฉิน (ER)"
    }
  },
  {
    title: "เพิ่มประสิทธิภาพการสอบเทียบ (Calibration) เครื่องช่วยหายใจ",
    data: {
      projectName: "โครงการเพิ่มประสิทธิภาพและความแม่นยำในการสอบเทียบเครื่องช่วยหายใจ (Ventilator Calibration)",
      problemStatement: "กระบวนการตรวจสอบและสอบเทียบเครื่องช่วยหายใจเดิมใช้เวลานานและมีขั้นตอนซับซ้อน ทำให้เกิดคิวสะสมในคลังเครื่องมือแพทย์ และเสื่อมประสิทธิภาพตามรอบการใช้งาน",
      goal: "ลดเวลาในการสอบเทียบเครื่องช่วยหายใจต่อเครื่องลง 40% และรักษาอัตราการสอบเทียบตรงตามแผน (On-Time Calibration) ให้ได้ 100%",
      kpiTarget: "1. อัตราการสอบเทียบเครื่องช่วยหายใจได้ตามแผน = 100%\n2. ระยะเวลาสอบเทียบเฉลี่ยต่อเครื่อง <= 45 นาที",
      improvementSteps: "1. นำชุดทดสอบอัตโนมัติ Gas Flow Analyzer รุ่นใหม่มาใช้ในการวัดค่า\n2. จัดทำ Standard Operating Procedure (SOP) ดิจิทัลสำหรับวิศวกรการแพทย์\n3. สร้างระบบแจ้งเตือนการสอบเทียบล่วงหน้าอัตโนมัติผ่านโปรแกรมบริหารจัดการเครื่องมือแพทย์",
      benefits: "1. เครื่องช่วยหายใจมีความแม่นยำสูง ได้มาตรฐานความปลอดภัยทางการแพทย์ระดับสากล\n2. ลดระยะเวลาการสอบเทียบ ทำให้มีเครื่องพร้อมสำรองใช้งานเพิ่มขึ้น 25%",
      kpiResults: "อัตราการสอบเทียบตรงตามแผนบรรลุ 100% เต็ม ระยะเวลาสอบเทียบต่อเครื่องลดลงเหลือ 38 นาที",
      c_solution: "ประสานงานกำหนดวันและเวลาหมุนเวียนเครื่องกับหัวหน้าหอผู้ป่วยล่วงหน้าอย่างน้อย 3 วัน",
      recommendations: "นำมาตรฐานการสอบเทียบอัตโนมัติไปประยุกต์ใช้กับเครื่องให้ออกซิเจนอัตราไหลสูง (High Flow)"
    }
  },
  {
    title: "พัฒนาระบบเฝ้าระวังบำรุงรักษาเชิงป้องกัน (PM) เครื่องกระตุกหัวใจ",
    data: {
      projectName: "โครงการพัฒนาระบบบำรุงรักษาเชิงป้องกัน (Preventive Maintenance: PM) เครื่องกระตุกหัวใจ (Defibrillator)",
      problemStatement: "เครื่องกระตุกหัวใจเป็นอุปกรณ์ชุบชีวิตฉุกเฉิน ซึ่งพบปัญหาแบตเตอรี่เสื่อมสภาพโดยไม่ทราบล่วงหน้า และอัตราการทำ PM ตามรอบตรงเวลาอยู่ที่เพียง 82%",
      goal: "เพิ่มอัตราการบำรุงรักษาเชิงป้องกัน (PM) เครื่องกระตุกหัวใจเป็น 100% และลดความเสี่ยงแบตเตอรี่ขัดข้องขณะใช้งานเป็น 0%",
      kpiTarget: "1. อัตราความครอบคลุมการทำ PM เครื่องกระตุกหัวใจ = 100%\n2. อัตราเครื่องขัดข้องขณะใช้งานฉุกเฉิน = 0%",
      improvementSteps: "1. ติดตั้งสติกเกอร์ QR-Check สแกนบันทึกสถานะแบตเตอรี่ประจำวันโดยพยาบาล\n2. วิศวกรการแพทย์เข้าตรวจสอบเชิงลึกด้วยเครื่องทดสอบพลังงาน (Defibrillator Analyzer) ทุก 3 เดือน\n3. กำหนดรอบเปลี่ยนแบตเตอรี่เชิงรุก (Proactive Battery Replacement) ทุก 2 ปี",
      benefits: "1. มั่นใจได้ 100% ว่าเครื่องกระตุกหัวใจพร้อมปล่อยพลังงานชุบชีวิตผู้ป่วยได้ทันทีทุกครั้ง\n2. ยืดอายุการใช้งานเครื่องและลดค่าใช้จ่ายการซ่อมใหญ่ลง 30%",
      kpiResults: "ผลการทำ PM ครบถ้วน 100% ไม่พบเหตุการณ์แบตเตอรี่ขัดข้องขณะใช้งานตลอดช่วงติดตามผล 6 เดือน",
      c_solution: "จัดทำระบบคลังสำรองแบตเตอรี่พร้อมใช้ (Ready-to-Use Battery Pool) ในแผนกวิศวกรรมการแพทย์",
      recommendations: "เสนอผู้บริหารจัดทำระบบ Smart Battery Monitoring สำหรับเครื่องมือแพทย์ชีวิตทั้งหมด"
    }
  }
];

function initAIPrompts() {
  const chipContainer = document.getElementById('presetChips');
  if (chipContainer) {
    chipContainer.innerHTML = '';
    AI_PRESETS.forEach(preset => {
      const chip = document.createElement('div');
      chip.className = 'chip';
      chip.textContent = preset.title;
      chip.addEventListener('click', () => {
        document.getElementById('aiTopicInput').value = preset.title;
        applyAIPreset(preset.data);
      });
      chipContainer.appendChild(chip);
    });
  }

  const topicInput = document.getElementById('aiTopicInput');
  if (topicInput) {
    topicInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        runAIGenerator();
      }
    });
  }

  const btnRunAI = document.getElementById('btnRunAI');
  if (btnRunAI) {
    btnRunAI.addEventListener('click', runAIGenerator);
  }
}

function runAIGenerator() {
  const inputEl = document.getElementById('aiTopicInput');
  const topic = inputEl ? inputEl.value.trim() : "";
  
  if (!topic) {
    showToast('⚠️ กรุณากรอกหัวข้อหรือคีย์เวิร์ดโครงการที่ต้องการ');
    return;
  }

  if (topic.includes('แก๊ส') || topic.includes('ถัง') || topic.includes('gas') || topic.includes('ออกซิเจน')) {
    applyAIPreset(AI_PRESETS[0].data);
    return;
  }

  const matched = AI_PRESETS.find(p => topic.includes(p.title) || p.title.includes(topic));
  if (matched) {
    applyAIPreset(matched.data);
  } else {
    applyAIPreset({
      projectName: `โครงการพัฒนาและเพิ่มประสิทธิภาพ ${topic} แผนกวิศวกรรมการแพทย์`,
      problemStatement: `จากการวิเคราะห์กระบวนการทำงานด้าน ${topic} ในโรงพยาบาล พบว่ายังมีจุดที่สามารถปรับปรุงขั้นตอนการทำงานเพื่อลดระยะเวลา เพิ่มความแม่นยำ และสร้างมาตรฐานความปลอดภัยสูงสุดแก่ผู้รับบริการ`,
      goal: `พัฒนาขั้นตอนการดำเนินงาน ${topic} ให้มีประสิทธิภาพเพิ่มขึ้นอย่างน้อย 30% และบรรลุเป้าหมายมาตรฐานคุณภาพงานวิศวกรรมการแพทย์`,
      kpiTarget: `1. อัตราความสำเร็จในการดำเนินการ ${topic} >= 95%\n2. ระดับความพึงพอใจของผู้ใช้บริการ >= 90%`,
      improvementSteps: `1. ศึกษาสภาพปัญหาและจัดทำกระบวนการทำงานมาตรฐาน (Standard Workflow) สำหรับ ${topic}\n2. ประยุกต์ใช้นวัตกรรมและเทคโนโลยีดิจิทัลเข้ามาช่วยสนับสนุนการทำงาน\n3. จัดอบรมให้ความรู้แก่เจ้าหน้าที่และประเมินผลการทำงานอย่างต่อเนื่อง`,
      benefits: `1. ยกระดับคุณภาพการบริหารจัดการเครื่องมือแพทย์และงานวิศวกรรมการแพทย์\n2. ลดความเสี่ยงและเพิ่มความปลอดภัยในการบริการทางการแพทย์`,
      kpiResults: `ผลการทดลองปรับปรุงกระบวนการทำให้ดัชนีชี้วัดความสำเร็จของ ${topic} เพิ่มขึ้นบรรลุเป้าหมาย 96.5%`,
      c_solution: "สร้างช่องทางการสื่อสารประสานงานด่วนระหว่างทีมวิศวกรและพยาบาลประจำแผนก",
      recommendations: "สรุปผลการดำเนินงานและจัดทำเป็นคู่มือมาตรฐาน (Standard Operating Procedure) เผยแพร่ในหน่วยงาน"
    });
  }
}

function applyAIPreset(data) {
  Object.keys(data).forEach(key => {
    formData[key] = data[key];
    const el = document.getElementById(key);
    if (el) {
      if (el.type === 'checkbox') {
        el.checked = !!data[key];
      } else {
        el.value = data[key];
      }
    }
  });
  renderOverlay();
  closeModal('aiModal');
  showToast('✨ AI ได้ทำการวิเคราะห์และป้อนข้อมูลโครงการลงในแบบฟอร์มเรียบร้อยแล้ว!');
}

// Render Form Data as Overlay onto CPI Page 1 and Page 2
function renderOverlay() {
  const ov1 = document.getElementById('page1_overlay');
  const ov2 = document.getElementById('page2_overlay');
  if (!ov1 || !ov2) return;

  const page1Container = document.getElementById('page1_container');
  const page2Container = document.getElementById('page2_container');

  ov1.innerHTML = '';
  ov2.innerHTML = '';

  // Helper to add text field item
  function addText(overlay, pageContainer, fieldKey, text, baseLeftPct, baseTopPct, widthPct, fontSize = 12.5, baseLineHeight = 2.3) {
    if (!text) return;
    const offset = fieldOffsets[fieldKey] || { dx: 0, dy: 0, lineGap: 0, fontSize: 12.5, scaleH: 1.0 };
    const leftPct = baseLeftPct + offset.dx;
    const topPct = baseTopPct + offset.dy;
    const adjustedFontSize = offset.fontSize || fontSize;
    const adjustedLineHeight = baseLineHeight * (offset.scaleH || 1.0);
    const lineHeightVal = (adjustedLineHeight + offset.lineGap).toFixed(2) + "em";

    const div = document.createElement('div');
    div.className = 'field-item' + (selectedFieldKey === fieldKey ? ' selected' : '');
    div.dataset.field = fieldKey;
    div.style.left = leftPct + '%';
    div.style.top = topPct + '%';
    if (offset.w) div.style.width = offset.w + '%';
    else if (widthPct) div.style.width = widthPct + '%';
    if (offset.h) div.style.height = offset.h + 'px';
    div.style.fontSize = adjustedFontSize + 'px';
    div.style.lineHeight = lineHeightVal;
    div.textContent = text;

    makeElementDraggable(div, fieldKey, pageContainer, fieldKey);
    enableResizeElement(div, fieldKey);
    watchElementResize(div, fieldKey, pageContainer);
    overlay.appendChild(div);
  }

  function enableResizeElement(div, fieldKey) {
    div.style.resize = 'both';
    div.style.overflow = 'auto';
  }

  // Helper to add Checkbox mark (✓)
  function addCheck(overlay, pageContainer, fieldKey, isChecked, baseLeftPct, baseTopPct) {
    if (!isChecked) return;
    const offset = fieldOffsets[fieldKey] || { dx: 0, dy: 0 };
    const leftPct = baseLeftPct + offset.dx;
    const topPct = baseTopPct + offset.dy;

    const div = document.createElement('div');
    div.className = 'check-item' + (selectedFieldKey === fieldKey ? ' selected' : '');
    div.dataset.field = fieldKey;
    div.style.left = leftPct + '%';
    div.style.top = topPct + '%';
    if (offset.w) div.style.width = offset.w + '%';
    if (offset.h) div.style.height = offset.h + 'px';
    div.textContent = '✓';

    makeElementDraggable(div, fieldKey, pageContainer, '✓ ' + fieldKey);
    enableResizeElement(div, fieldKey);
    watchElementResize(div, fieldKey, pageContainer);
    overlay.appendChild(div);
  }

  // Helper to add Signature Image
  function addSig(overlay, pageContainer, fieldKey, sigUrl, baseLeftPct, baseTopPct) {
    if (!sigUrl) return;
    const offset = fieldOffsets[fieldKey] || { dx: 0, dy: 0 };
    const leftPct = baseLeftPct + offset.dx;
    const topPct = baseTopPct + offset.dy;

    const div = document.createElement('div');
    div.className = 'field-item sig-item' + (selectedFieldKey === fieldKey ? ' selected' : '');
    div.dataset.field = fieldKey;
    div.style.left = leftPct + '%';
    div.style.top = topPct + '%';
    if (offset.w) div.style.width = offset.w + '%';
    if (offset.h) div.style.height = offset.h + 'px';
    const img = document.createElement('img');
    img.src = sigUrl;
    div.appendChild(img);

    makeElementDraggable(div, fieldKey, pageContainer, 'ลายเซ็น ' + fieldKey);
    enableResizeElement(div, fieldKey);
    watchElementResize(div, fieldKey, pageContainer);
    overlay.appendChild(div);
  }

  // --- PAGE 1 RENDER ---
  addText(ov1, page1Container, 'projectNo', formData.projectNo, 14.5, 15.7, null, 12.5, 1);
  addText(ov1, page1Container, 'docDate', formatDate(formData.docDate), 40.5, 15.7, null, 12.5, 1);
  addText(ov1, page1Container, 'department', formData.department, 73.5, 15.7, null, 12.5, 1);
  addText(ov1, page1Container, 'projectName', formData.projectName, 14.5, 18.4, 80, 12.5, 1);

  // Project Types Checkboxes
  addCheck(ov1, page1Container, 'projType_IA', formData.projType_IA, 19.7, 20.4);
  addCheck(ov1, page1Container, 'projType_PIP', formData.projType_PIP, 40.2, 20.4);
  addCheck(ov1, page1Container, 'projType_BIP', formData.projType_BIP, 19.7, 22.4);

  // Dev Types Checkboxes
  addCheck(ov1, page1Container, 'devType_Clinical', formData.devType_Clinical, 19.7, 24.1);
  addCheck(ov1, page1Container, 'devType_Service', formData.devType_Service, 40.2, 24.1);
  addCheck(ov1, page1Container, 'devType_Research', formData.devType_Research, 70.1, 24.1);

  // Source Types Checkboxes
  addCheck(ov1, page1Container, 'src_Vision', formData.src_Vision, 15.2, 25.9);
  addCheck(ov1, page1Container, 'src_Review', formData.src_Review, 15.2, 27.8);
  addCheck(ov1, page1Container, 'src_InternalAudit', formData.src_InternalAudit, 15.2, 29.7);
  if (formData.src_InternalAuditDetail) addText(ov1, page1Container, 'src_InternalAuditDetail', formData.src_InternalAuditDetail, 38.0, 29.7, null, 12, 1);
  addCheck(ov1, page1Container, 'src_KpiDrop', formData.src_KpiDrop, 15.2, 31.6);

  addCheck(ov1, page1Container, 'src_Survey', formData.src_Survey, 50.6, 25.9);
  addCheck(ov1, page1Container, 'src_StaffSuggest', formData.src_StaffSuggest, 50.6, 27.8);
  addCheck(ov1, page1Container, 'src_Complaint', formData.src_Complaint, 50.6, 29.7);
  if (formData.src_ComplaintNo) addText(ov1, page1Container, 'src_ComplaintNo', formData.src_ComplaintNo, 73.0, 29.7, null, 12, 1);
  addCheck(ov1, page1Container, 'src_Other', formData.src_Other, 50.6, 31.6);
  if (formData.src_OtherDetail) addText(ov1, page1Container, 'src_OtherDetail', formData.src_OtherDetail, 58.0, 31.6, null, 12, 1);

  // Details Sections
  addText(ov1, page1Container, 'problemStatement', formData.problemStatement, 6.0, 39.8, 88, 12, 2.3);
  addText(ov1, page1Container, 'goal', formData.goal, 16.0, 46.8, 78, 12, 2.3);
  addText(ov1, page1Container, 'kpiTarget', formData.kpiTarget, 24.0, 54.0, 70, 12, 2.3);
  addText(ov1, page1Container, 'improvementSteps', formData.improvementSteps, 6.0, 61.8, 88, 12, 2.3);

  // Dates
  addText(ov1, page1Container, 'startDate', formatDate(formData.startDate), 22.5, 73.3, null, 12, 1);
  addText(ov1, page1Container, 'endDate', formatDate(formData.endDate), 62.0, 73.3, null, 12, 1);

  // Benefits
  addText(ov1, page1Container, 'benefits', formData.benefits, 22.0, 75.8, 72, 11.8, 2.3);

  // Budget
  addText(ov1, page1Container, 'budget', formData.budget, 22.5, 80.8, null, 12, 1);

  // Proposer Sign Page 1
  addSig(ov1, page1Container, 'proposerSignature', formData.proposerSignature, 18.0, 83.2);
  addText(ov1, page1Container, 'proposerName', formData.proposerName, 18.0, 87.3, null, 12, 1);
  addText(ov1, page1Container, 'proposerDate', formatDate(formData.proposerDate), 21.0, 89.5, null, 12, 1);

  // Approver Sign Page 1
  addCheck(ov1, page1Container, 'approverOption_approve', formData.approverOption === 'approve', 51.5, 84.9);
  addCheck(ov1, page1Container, 'approverOption_reject', formData.approverOption === 'reject', 67.5, 84.9);
  addSig(ov1, page1Container, 'approverSignature', formData.approverSignature, 56.0, 85.8);
  addText(ov1, page1Container, 'approverName', formData.approverName, 58.0, 89.5, null, 12, 1);

  // --- PAGE 2 RENDER ---
  addText(ov2, page2Container, 'p2_department', formData.department, 20.0, 17.4, null, 12.5, 1);
  addText(ov2, page2Container, 'p2_docDate', formatDate(formData.docDate), 58.0, 17.4, null, 12.5, 1);
  addText(ov2, page2Container, 'p2_projectNo', formData.projectNo, 83.5, 17.4, null, 12.5, 1);
  addText(ov2, page2Container, 'p2_projectName', formData.projectName, 15.0, 20.2, 80, 12.5, 1);

  // 1. KPI Results
  addText(ov2, page2Container, 'kpiResults', formData.kpiResults, 6.0, 25.8, 88, 12, 2.3);
  addText(ov2, page2Container, 'otherResults', formData.otherResults, 6.0, 34.3, 88, 12, 2.3);

  // 2. Benefits Checkboxes Page 2
  addCheck(ov2, page2Container, 'b_sat_client', formData.b_sat_client, 8.8, 41.7);
  addCheck(ov2, page2Container, 'b_knowledge', formData.b_knowledge, 8.8, 43.8);
  addCheck(ov2, page2Container, 'b_complications', formData.b_complications, 8.8, 46.0);
  addCheck(ov2, page2Container, 'b_safety', formData.b_safety, 8.8, 48.1);
  addCheck(ov2, page2Container, 'b_income', formData.b_income, 8.8, 50.2);
  if (formData.b_income_amt) addText(ov2, page2Container, 'b_income_amt', formData.b_income_amt, 24.0, 50.2, null, 12, 1);

  addCheck(ov2, page2Container, 'b_communication', formData.b_communication, 37.1, 41.7);
  addCheck(ov2, page2Container, 'b_resource', formData.b_resource, 37.1, 43.8);
  addCheck(ov2, page2Container, 'b_treatment', formData.b_treatment, 37.1, 46.0);
  addCheck(ov2, page2Container, 'b_val_added', formData.b_val_added, 37.1, 48.1);
  addCheck(ov2, page2Container, 'b_other', formData.b_other, 37.1, 50.2);
  if (formData.b_other_detail) addText(ov2, page2Container, 'b_other_detail', formData.b_other_detail, 43.0, 50.2, null, 12, 1);

  addCheck(ov2, page2Container, 'b_err_reduction', formData.b_err_reduction, 65.4, 41.7);
  addCheck(ov2, page2Container, 'b_staff_sat', formData.b_staff_sat, 65.4, 43.8);
  addCheck(ov2, page2Container, 'b_speed', formData.b_speed, 65.4, 46.0);
  addCheck(ov2, page2Container, 'b_cost_reduction', formData.b_cost_reduction, 65.4, 48.1);
  if (formData.b_cost_amt) addText(ov2, page2Container, 'b_cost_amt', formData.b_cost_amt, 81.5, 48.1, null, 12, 1);

  // 3. Challenges & Solutions Page 2
  addText(ov2, page2Container, 'c_data_collect', formData.c_data_collect, 32.5, 53.9, 62, 12, 1);
  addText(ov2, page2Container, 'c_kpi_collect', formData.c_kpi_collect, 27.5, 56.1, 67, 12, 1);
  addText(ov2, page2Container, 'c_solution', formData.c_solution, 30.5, 58.3, 64, 12, 1);
  addText(ov2, page2Container, 'c_other', formData.c_other, 14.5, 60.5, 80, 12, 1);

  // 4. Recommendations
  addText(ov2, page2Container, 'recommendations', formData.recommendations, 6.0, 65.2, 88, 12, 2.3);

  // Proposer Sign Page 2
  addSig(ov2, page2Container, 'p3_proposerSignature', formData.p3_proposerSignature || formData.proposerSignature, 42.0, 68.5);
  addText(ov2, page2Container, 'p3_proposerName', formData.p3_proposerName, 42.0, 72.0, null, 12, 1);
  addText(ov2, page2Container, 'p3_proposerDate', formatDate(formData.p3_proposerDate), 44.0, 74.1, null, 12, 1);

  // 5. Close Project Options & Approver
  addCheck(ov2, page2Container, 'close_approve', formData.close_approve, 7.2, 77.4);
  addCheck(ov2, page2Container, 'close_target_met', formData.close_target_met, 19.3, 77.4);
  addCheck(ov2, page2Container, 'close_data_reliable', formData.close_data_reliable, 42.5, 77.4);

  addCheck(ov2, page2Container, 'close_more_study', formData.close_more_study, 7.2, 79.5);
  if (formData.close_study_detail) addText(ov2, page2Container, 'close_study_detail', formData.close_study_detail, 32.0, 79.5, null, 12, 1);

  addCheck(ov2, page2Container, 'close_expand', formData.close_expand, 7.2, 81.6);
  addCheck(ov2, page2Container, 'close_other', formData.close_other, 7.2, 83.7);
  if (formData.close_other_detail) addText(ov2, page2Container, 'close_other_detail', formData.close_other_detail, 15.0, 83.7, null, 12, 1);

  // Approver Sign Page 2
  addSig(ov2, page2Container, 'p3_approverSignature', formData.p3_approverSignature || formData.approverSignature, 42.0, 85.5);
  addText(ov2, page2Container, 'p3_approverName', formData.p3_approverName, 42.0, 89.2, null, 12, 1);
  addText(ov2, page2Container, 'p3_approverDate', formatDate(formData.p3_approverDate), 44.0, 91.3, null, 12, 1);

  window.scheduleDraftSave();
}

// Utility: Format Date string (YYYY-MM-DD to DD/MM/YYYY Thai Buddhist Year)
function formatDate(dateStr) {
  if (!dateStr) return "";
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const day = parts[2];
  const month = parts[1];
  const year = parseInt(parts[0], 10) + 543;
  return `${day}/${month}/${year}`;
}

// Print event handlers
window.addEventListener('beforeprint', function() {
  const activeView = document.querySelector('.view.active');
  document.body.classList.toggle('printing-form', !!(activeView && activeView.id === 'view-form'));
  document.body.classList.toggle('printing-results', !!(activeView && activeView.id === 'view-results'));
  document.body.classList.toggle('printing-list', !!(activeView && activeView.id === 'view-list'));

  document.querySelectorAll('.field-item > div, .check-item > div').forEach(handle => {
    if (handle.style.cursor === 'nwse-resize' || handle.style.backgroundColor === '#0056b3') {
      handle.remove();
    }
  });
  selectedFieldKey = null;
  renderOverlay();
});

window.addEventListener('afterprint', function() {
  setTimeout(() => {
    renderOverlay();
  }, 100);
});
