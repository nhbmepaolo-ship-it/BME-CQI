// ============================================================
// results.js - แนบผลลัพธ์: KPI monthly input table + Chart.js graphs
// ============================================================

const THAI_MONTHS_SHORT = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];

const CHART_PALETTE = ['#0056b3', '#28a745', '#dc3545', '#6f42c1', '#fd7e14', '#17a2b8', '#e83e8c', '#20c997', '#ffc107', '#6610f2'];

let kpiState = { items: [] };
const chartInstances = {};
const chartTimers = {};

window.getKpiState = function() { return kpiState; };

// ---------- Normalization ----------
function normalizeKpiItem(raw) {
  raw = raw || {};
  const monthly = {};
  for (let m = 1; m <= 12; m++) {
    const v = raw.monthly ? raw.monthly[String(m)] : undefined;
    const num = (v === "" || v == null) ? null : Number(v);
    monthly[String(m)] = (num === null || isNaN(num)) ? null : num;
  }
  return {
    id: raw.id || ('k' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6)),
    name: raw.name || '',
    target: (raw.target === undefined || raw.target === null) ? '' : String(raw.target),
    unit: raw.unit || '',
    direction: raw.direction === 'lower' ? 'lower' : 'higher',
    monthly: monthly
  };
}

window.setKpiState = function(kpi) {
  kpiState = {
    items: (kpi && Array.isArray(kpi.items)) ? kpi.items.map(normalizeKpiItem) : []
  };
  if (document.getElementById('kpiTableBody')) renderKpiTable();
  if (window.scheduleDraftSave) window.scheduleDraftSave();
};

function findKpi(id) { return kpiState.items.find(k => k.id === id); }

function parseTargetNum(k) {
  const n = parseFloat(String(k.target).replace(/,/g, '.'));
  return isNaN(n) ? null : n;
}

// ---------- Stats ----------
function kpiAverage(k) {
  const vals = Object.values(k.monthly).filter(v => v !== null && !isNaN(v));
  if (!vals.length) return null;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

function kpiPercentOfTarget(k) {
  const avg = kpiAverage(k);
  const target = parseTargetNum(k);
  if (avg === null || target === null || target === 0) return null;
  const pct = k.direction === 'lower' ? (target / avg) * 100 : (avg / target) * 100;
  return pct;
}

// ---------- Table Rendering ----------
function renderKpiTable() {
  const thead = document.getElementById('kpiTableHead');
  const tbody = document.getElementById('kpiTableBody');
  const emptyEl = document.getElementById('kpiEmptyState');
  if (!thead || !tbody) return;

  // Header
  let headHtml = '<tr><th style="min-width:180px;">ตัวชี้วัด (KPI)</th><th style="width:80px;">เป้าหมาย</th><th style="width:70px;">หน่วย</th><th style="width:110px;">ทิศทาง</th>';
  THAI_MONTHS_SHORT.forEach(m => { headHtml += '<th style="width:62px;">' + m + '</th>'; });
  headHtml += '<th style="width:64px;">เฉลี่ย</th><th style="width:74px;">% เทียบเป้า</th><th class="no-print" style="width:44px;">ลบ</th></tr>';
  thead.innerHTML = headHtml;

  // Body
  tbody.innerHTML = '';
  kpiState.items.forEach((k, idx) => {
    const tr = document.createElement('tr');

    let html = '<td><input type="text" class="kpi-input kpi-name" value="' + escapeAttr(k.name || ('ตัวชี้วัดที่ ' + (idx + 1))) + '" oninput="updateKpiField(\'' + k.id + '\',\'name\',this.value)" placeholder="ชื่อตัวชี้วัด..."></td>';
    html += '<td><input type="number" step="any" class="kpi-input num" value="' + escapeAttr(k.target) + '" oninput="updateKpiField(\'' + k.id + '\',\'target\',this.value)"></td>';
    html += '<td><input type="text" class="kpi-input" value="' + escapeAttr(k.unit) + '" oninput="updateKpiField(\'' + k.id + '\',\'unit\',this.value)"></td>';
    html += '<td><select class="kpi-select" onchange="updateKpiField(\'' + k.id + '\',\'direction\',this.value)">' +
      '<option value="higher"' + (k.direction === 'higher' ? ' selected' : '') + '>≥ ยิ่งมากดี</option>' +
      '<option value="lower"' + (k.direction === 'lower' ? ' selected' : '') + '>≤ ยิ่งน้อยดี</option>' +
      '</select></td>';

    for (let m = 1; m <= 12; m++) {
      const val = k.monthly[String(m)];
      html += '<td><input type="number" step="any" class="kpi-input num month-cell" value="' + (val === null ? '' : val) + '" data-kid="' + k.id + '" data-month="' + m + '" placeholder="-" oninput="updateKpiMonth(\'' + k.id + '\',' + m + ',this.value)"></td>';
    }

    const avg = kpiAverage(k);
    const pct = kpiPercentOfTarget(k);
    html += '<td class="stat-cell" id="avg_' + k.id + '">' + (avg === null ? '-' : round2(avg)) + '</td>';
    let pctClass = '';
    if (pct !== null) pctClass = pct >= 100 ? ' pass' : ' fail';
    html += '<td class="stat-cell' + pctClass + '" id="pct_' + k.id + '">' + (pct === null ? '-' : round2(pct) + '%') + '</td>';
    html += '<td class="no-print"><button class="btn btn-outline btn-danger btn-sm del-row" onclick="removeKpiRow(\'' + k.id + '\')">✕</button></td>';

    tr.innerHTML = html;
    tbody.appendChild(tr);
  });

  if (emptyEl) emptyEl.hidden = kpiState.items.length > 0;
}

function escapeAttr(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/"/g, '&quot;')
    .replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

// ---------- Row Actions ----------
window.addKpiRow = function() {
  const item = normalizeKpiItem({ name: '' });
  kpiState.items.push(item);
  renderKpiTable();
  renderSingleChart(item.id);
  if (window.scheduleDraftSave) window.scheduleDraftSave();
  // focus new name input
  const inputs = document.querySelectorAll('#kpiTableBody .kpi-name');
  if (inputs.length) inputs[inputs.length - 1].focus();
};

window.removeKpiRow = function(id) {
  kpiState.items = kpiState.items.filter(k => k.id !== id);
  destroyChart(id);
  removeChartCard(id);
  renderKpiTable();
  if (window.scheduleDraftSave) window.scheduleDraftSave();
};

window.updateKpiField = function(id, field, value) {
  const k = findKpi(id);
  if (!k) return;
  if (field === 'direction') {
    k.direction = (value === 'lower') ? 'lower' : 'higher';
  } else {
    k[field] = value;
  }
  refreshStatsCell(id);
  scheduleChartUpdate(id);
  if (window.scheduleDraftSave) window.scheduleDraftSave();
};

window.updateKpiMonth = function(id, month, value) {
  const k = findKpi(id);
  if (!k) return;
  const trimmed = String(value).trim();
  k.monthly[String(month)] = trimmed === '' ? null : (isNaN(Number(trimmed)) ? null : Number(trimmed));
  refreshStatsCell(id);
  scheduleChartUpdate(id);
  if (window.scheduleDraftSave) window.scheduleDraftSave();
};

function refreshStatsCell(id) {
  const k = findKpi(id);
  if (!k) return;
  const avgEl = document.getElementById('avg_' + id);
  const pctEl = document.getElementById('pct_' + id);
  const avg = kpiAverage(k);
  const pct = kpiPercentOfTarget(k);
  if (avgEl) avgEl.textContent = avg === null ? '-' : round2(avg);
  if (pctEl) {
    pctEl.textContent = pct === null ? '-' : round2(pct) + '%';
    pctEl.classList.toggle('pass', pct !== null && pct >= 100);
    pctEl.classList.toggle('fail', pct !== null && pct < 100);
  }
}

// ---------- Parse KPI from form's kpiTarget field ----------
window.syncKpiFromTarget = function() {
  const ta = document.getElementById('kpiTarget');
  const text = ta ? ta.value : '';
  if (!text.trim()) {
    showToast('⚠️ ยังไม่มีข้อความในช่อง "3. ตัวชี้วัด (KPI) และ target"');
    return;
  }
  const parsed = parseKpiText(text);
  if (!parsed.length) {
    showToast('⚠️ ไม่พบรูปแบบ KPI ที่แยกได้ — ลองเพิ่มตัวชี้วัดเอง');
    return;
  }
  parsed.forEach(p => kpiState.items.push(normalizeKpiItem(p)));
  renderKpiTable();
  renderAllCharts();
  if (window.scheduleDraftSave) window.scheduleDraftSave();
  showToast('🧲 ดึงข้อมูล ' + parsed.length + ' ตัวชี้วัดจากช่อง KPI Target สำเร็จ');
};

function parseKpiText(text) {
  return text.split(/\n+/)
    .map(l => l.trim())
    .filter(Boolean)
    .map(line => {
      const clean = line.replace(/^\s*(?:[-•*]|\d+\s*[.)．]|ข้อ\s*\d+)\s*/, '');
      const m = clean.match(/([<>≤≥]=?|=)\s*(\d+(?:[.,]\d+)?)/);
      let op = null, num = null;
      if (m) { op = m[1]; num = parseFloat(m[2].replace(',', '.')); }

      let name = clean;
      let target = '';
      let direction = 'higher';

      if (m) {
        const idx = clean.indexOf(m[0]);
        name = ((clean.slice(0, idx) + ' ' + clean.slice(idx + m[0].length)) || '')
          .replace(/\s+/g, ' ')
          .replace(/^[\s:：\-–]+|[\s:：]+$/g, '')
          .trim();
        target = String(num);
        direction = (op.charAt(0) === '<' || op === '≤') ? 'lower' : 'higher';
      }

      return {
        name: name || 'ตัวชี้วัด',
        target: target,
        direction: direction
      };
    });
}

// ---------- Charts ----------
function ensureChartCard(k) {
  const container = document.getElementById('chartsContainer');
  if (!container) return null;
  let card = document.getElementById('chartcard_' + k.id);
  if (!card) {
    card = document.createElement('div');
    card.className = 'chart-card';
    card.id = 'chartcard_' + k.id;
    card.innerHTML =
      '<div class="chart-card-title">' + escapeAttr(k.name || 'ตัวชี้วัด') + (k.unit ? ' (' + escapeAttr(k.unit) + ')' : '') + '</div>' +
      '<div class="chart-canvas-wrap"><canvas id="chartcanvas_' + k.id + '"></canvas></div>';
    container.appendChild(card);
  } else {
    const titleEl = card.querySelector('.chart-card-title');
    if (titleEl) titleEl.textContent = (k.name || 'ตัวชี้วัด') + (k.unit ? ' (' + k.unit + ')' : '');
  }
  return card;
}

function removeChartCard(id) {
  const card = document.getElementById('chartcard_' + id);
  if (card) card.remove();
}

function destroyChart(id) {
  if (chartInstances[id]) {
    chartInstances[id].destroy();
    delete chartInstances[id];
  }
}

function scheduleChartUpdate(id) {
  clearTimeout(chartTimers[id]);
  chartTimers[id] = setTimeout(() => renderSingleChart(id), 350);
}

window.renderAllCharts = function() {
  const container = document.getElementById('chartsContainer');
  if (!container) return;

  // remove cards for deleted KPIs
  Object.keys(chartInstances).forEach(id => {
    if (!findKpi(id)) {
      destroyChart(id);
      removeChartCard(id);
    }
  });

  kpiState.items.forEach((k, i) => renderSingleChart(k.id, i));
};

function renderSingleChart(id, colorIndex) {
  const k = findKpi(id);
  if (!k) return;

  if (colorIndex === undefined) {
    colorIndex = kpiState.items.findIndex(item => item.id === id);
  }
  const color = CHART_PALETTE[colorIndex % CHART_PALETTE.length];

  if (typeof Chart === 'undefined') {
    const card = ensureChartCard(k);
    if (card) {
      card.querySelector('.chart-canvas-wrap').innerHTML = '<div class="chart-fallback">⚠️ โหลดไลบรารี Chart.js ไม่สำเร็จ</div>';
    }
    return;
  }

  ensureChartCard(k);
  const canvas = document.getElementById('chartcanvas_' + id);
  if (!canvas) return;

  const actualData = [];
  for (let m = 1; m <= 12; m++) actualData.push(k.monthly[String(m)]);

  const targetNum = parseTargetNum(k);
  const targetData = targetNum === null ? null : THAI_MONTHS_SHORT.map(() => targetNum);

  destroyChart(id);

  const datasets = [{
    label: 'ผลจริง',
    data: actualData,
    borderColor: color,
    backgroundColor: color + '33',
    borderWidth: 2.5,
    pointRadius: 4,
    pointHoverRadius: 6,
    tension: 0.25,
    spanGaps: true
  }];

  if (targetData) {
    datasets.push({
      label: 'เป้าหมาย (' + targetNum + ')',
      data: targetData,
      borderColor: '#dc3545',
      borderDash: [7, 5],
      borderWidth: 1.8,
      pointRadius: 0,
      fill: false,
      tension: 0
    });
  }

  chartInstances[id] = new Chart(canvas.getContext('2d'), {
    type: 'line',
    data: {
      labels: THAI_MONTHS_SHORT,
      datasets: datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom', labels: { boxWidth: 14, font: { family: 'Sarabun' } } },
        tooltip: {
          titleFont: { family: 'Sarabun' },
          bodyFont: { family: 'Sarabun' }
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          grid: { color: '#eef1f5' },
          ticks: { font: { family: 'Sarabun' } }
        },
        x: {
          grid: { display: false },
          ticks: { font: { family: 'Sarabun' }, maxRotation: 0 }
        }
      }
    }
  });
}

// ---------- Results header ----------
window.renderResultsHeader = function() {
  const titleEl = document.getElementById('resultsProjectTitle');
  const metaEl = document.getElementById('resultsProjectMeta');
  if (!titleEl || !metaEl) return;

  titleEl.textContent = '📊 ' + (formData.projectName || 'แนบผลลัพธ์ & กราฟ KPI');

  const parts = [];
  if (formData.projectNo) parts.push('เลขที่: ' + formData.projectNo);
  if (formData.department) parts.push(formData.department);
  if (formData.startDate && formData.endDate) parts.push('ระยะเวลา: ' + formatDate(formData.startDate) + ' - ' + formatDate(formData.endDate));
  metaEl.textContent = parts.join('  |  ');

  renderPhotoSheets();
};

// ============================================================
// Photo Attachment Pages (4 photos on 2 A4 sheets)
// ============================================================
let photoState = normalizePhotos([]);
let pendingPhotoSlot = null;
let pendingPhotoOnlyPrint = false;

function normalizePhotos(arr) {
  const out = [];
  for (let i = 0; i < 4; i++) {
    const p = (arr && arr[i]) || {};
    out.push({
      dataUrl: (typeof p.dataUrl === 'string' && p.dataUrl) ? p.dataUrl : null,
      caption: p.caption ? String(p.caption) : ''
    });
  }
  return out;
}

window.getPhotoState = function() { return photoState; };

window.setPhotoState = function(list) {
  photoState = normalizePhotos(list);
  if (document.getElementById('photoPagesWrap')) renderPhotoSheets();
};

function updatePhotoSheetHeaders() {
  document.querySelectorAll('.photo-sheet-title').forEach(el => {
    el.textContent = formData.projectName || '(ชื่อโครงการ)';
  });
  const subParts = [];
  if (formData.projectNo) subParts.push('เลขที่โครงการ: ' + formData.projectNo);
  if (formData.department) subParts.push(formData.department);
  document.querySelectorAll('.photo-sheet-sub').forEach(el => {
    el.textContent = subParts.join('  |  ');
  });
}

window.renderPhotoSheets = function() {
  updatePhotoSheetHeaders();
  document.querySelectorAll('.photo-slot').forEach(slot => {
    const idx = parseInt(slot.dataset.slot, 10);
    const p = photoState[idx];
    if (!p) return;

    const frame = slot.querySelector('.photo-frame');
    if (frame) {
      frame.innerHTML = '';
      if (p.dataUrl) {
        const img = document.createElement('img');
        img.src = p.dataUrl;
        img.alt = 'รูปที่ ' + (idx + 1);
        frame.appendChild(img);
        const rm = document.createElement('button');
        rm.type = 'button';
        rm.className = 'photo-remove no-print';
        rm.textContent = '✕';
        rm.title = 'ลบรูปนี้';
        rm.addEventListener('click', (ev) => { ev.stopPropagation(); removePhoto(idx); });
        frame.appendChild(rm);
      } else {
        const ph = document.createElement('div');
        ph.className = 'photo-empty';
        ph.innerHTML = '📷<br>คลิกเพื่อแนบรูป';
        frame.appendChild(ph);
      }
    }

    const cap = slot.querySelector('.photo-caption');
    if (cap && cap.value !== (p.caption || '')) cap.value = p.caption || '';
  });
};

window.pickPhoto = function(idx) {
  pendingPhotoSlot = idx;
  const inp = document.getElementById('photoFileInput');
  if (!inp) return;
  inp.value = '';
  inp.click();
};

window.removePhoto = function(idx) {
  photoState[idx] = { dataUrl: null, caption: '' };
  renderPhotoSheets();
  if (window.scheduleDraftSave) window.scheduleDraftSave();
};

window.updatePhotoCaption = function(idx, value) {
  if (!photoState[idx]) return;
  photoState[idx].caption = value;
  if (window.scheduleDraftSave) window.scheduleDraftSave();
};

function fileToScaledDataUrl(file, maxSide, quality) {
  maxSide = maxSide || 1400;
  quality = quality || 0.82;
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      try {
        let w = img.naturalWidth, h = img.naturalHeight;
        const scale = Math.min(1, maxSide / Math.max(w, h));
        w = Math.round(w * scale); h = Math.round(h * scale);
        const c = document.createElement('canvas');
        c.width = w; c.height = h;
        c.getContext('2d').drawImage(img, 0, 0, w, h);
        URL.revokeObjectURL(url);
        resolve(c.toDataURL('image/jpeg', quality));
      } catch (e) { reject(e); }
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('invalid image')); };
    img.src = url;
  });
}

async function handlePhotoFile(file) {
  if (pendingPhotoSlot === null || !file) return;
  try {
    const dataUrl = await fileToScaledDataUrl(file);
    photoState[pendingPhotoSlot] = { dataUrl: dataUrl, caption: photoState[pendingPhotoSlot].caption || '' };
    renderPhotoSheets();
    if (window.scheduleDraftSave) window.scheduleDraftSave();
    showToast('🖼️ แนบรูปสำเร็จ (รูปที่ ' + (pendingPhotoSlot + 1) + ')');
  } catch (e) {
    showToast('❌ อ่านไฟล์รูปไม่สำเร็จ');
  }
  pendingPhotoSlot = null;
}

// ---------- Page selection: Print / Export PDF ----------
function getSelectedPhotoPages() {
  const sel = [];
  const c1 = document.getElementById('photoPage1Chk');
  const c2 = document.getElementById('photoPage2Chk');
  if (c1 && c1.checked) sel.push(1);
  if (c2 && c2.checked) sel.push(2);
  return sel;
}

window.printPhotoPages = function() {
  if (!getSelectedPhotoPages().length) {
    showToast('⚠️ กรุณาเลือกอย่างน้อย 1 หน้าก่อนพิมพ์');
    return;
  }
  pendingPhotoOnlyPrint = true;
  window.print();
};

window.exportPhotoPdf = async function() {
  const selected = getSelectedPhotoPages();
  if (!selected.length) {
    showToast('⚠️ กรุณาเลือกอย่างน้อย 1 หน้าก่อน Export');
    return;
  }
  if (typeof window.jspdf === 'undefined' || typeof html2canvas === 'undefined') {
    showToast('❌ ไม่พบไลบรารี jsPDF/html2canvas (assets/vendor)');
    return;
  }
  showToast('⏳ กำลังสร้างไฟล์ PDF... กรุณารอสักครู่');
  try {
    const jsPDF = window.jspdf.jsPDF;
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    for (let i = 0; i < selected.length; i++) {
      const el = document.getElementById(selected[i] === 1 ? 'photoPage1' : 'photoPage2');
      if (!el) continue;
      const canvas = await html2canvas(el, { scale: 2, backgroundColor: '#ffffff', useCORS: true, logging: false });
      const imgData = canvas.toDataURL('image/jpeg', 0.92);
      if (i > 0) pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
    }
    const baseName = (formData.projectNo || formData.projectName || 'cpi_photos').replace(/[\\/:*?"<>|]/g, '_').slice(0, 60);
    pdf.save(baseName + '_แนบรูป.pdf');
    showToast('✅ สร้างไฟล์ PDF (' + selected.length + ' หน้า) เรียบร้อย');
  } catch (e) {
    showToast('❌ สร้าง PDF ไม่สำเร็จ: ' + e.message);
  }
};

// Print hooks: respect page-selection checkboxes
window.addEventListener('beforeprint', () => {
  const activeView = document.querySelector('.view.active');
  if (!activeView || activeView.id !== 'view-results') return;

  const sel = getSelectedPhotoPages();
  const p1 = document.getElementById('photoPage1');
  const p2 = document.getElementById('photoPage2');
  if (p1) p1.classList.toggle('print-skip', !sel.includes(1));
  if (p2) p2.classList.toggle('print-skip', !sel.includes(2));

  if (pendingPhotoOnlyPrint) document.body.classList.add('printing-photos');
});

window.addEventListener('afterprint', () => {
  pendingPhotoOnlyPrint = false;
  document.body.classList.remove('printing-photos');
  document.querySelectorAll('.photo-sheet.print-skip').forEach(el => el.classList.remove('print-skip'));
});

// Init photo file input
document.addEventListener('DOMContentLoaded', () => {
  const inp = document.getElementById('photoFileInput');
  if (inp) {
    inp.addEventListener('change', (e) => {
      if (e.target.files && e.target.files.length > 0) handlePhotoFile(e.target.files[0]);
    });
  }
});
