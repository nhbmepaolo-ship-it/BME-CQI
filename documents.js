// ============================================================
// documents.js - Document list, server API client, save/load
// ============================================================

// ---------- API Client ----------
const Api = {
  async listDocuments() {
    const r = await fetch('/api/documents');
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const data = await r.json();
    return Array.isArray(data) ? data : [];
  },
  async getDocument(id) {
    const r = await fetch('/api/documents?id=' + encodeURIComponent(id));
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return await r.json();
  },
  async upsertDocument(doc) {
    const r = await fetch('/api/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(doc)
    });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return await r.json();
  },
  async deleteDocument(id) {
    const r = await fetch('/api/documents?id=' + encodeURIComponent(id), { method: 'DELETE' });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return await r.json();
  }
};

// ---------- State ----------
let currentDocId = null;
let isViewOnlyMode = false;

window.getCurrentDocId = function() { return currentDocId; };

window.setCurrentDocId = function(id) {
  currentDocId = id;
  updateSaveBadge();
  if (window.scheduleDraftSave) window.scheduleDraftSave();
};

function updateSaveBadge() {
  const badge = document.getElementById('saveStateBadge');
  if (!badge) return;
  if (currentDocId) {
    badge.className = 'save-badge saved';
    badge.textContent = '🟢 เชื่อมกับเซิร์ฟเวอร์แล้ว';
  } else {
    badge.className = 'save-badge unsaved';
    badge.textContent = '⚪ ยังไม่บันทึก';
  }
}

// ---------- View Switching ----------
window.showView = function(name) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  const target = document.getElementById('view-' + name);
  if (target) target.classList.add('active');

  document.querySelectorAll('.nav-link').forEach(b => {
    b.classList.toggle('active', b.dataset.view === name);
  });

  if (name === 'list') refreshDocumentList();
  if (name === 'results') {
    renderResultsHeader();
    renderKpiTable();
    renderAllCharts();
  }
  window.scrollTo(0, 0);
};

// ---------- Document List ----------
async function refreshDocumentList() {
  const tbody = document.getElementById('docTableBody');
  const emptyEl = document.getElementById('emptyState');
  const errEl = document.getElementById('serverErrorState');
  if (!tbody) return;

  tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:#888; padding:24px;">⏳ กำลังโหลดข้อมูล...</td></tr>';
  emptyEl.hidden = true;
  errEl.hidden = true;

  try {
    const docs = await Api.listDocuments();
    tbody.innerHTML = '';
    if (!docs.length) {
      emptyEl.hidden = false;
      return;
    }
    docs.forEach(doc => {
      const fd = doc.formData || {};
      const status = fd.close_approve ? '<span class="status-pill closed">✅ ปิดโครงการ</span>' : '<span class="status-pill ongoing">🟢 ดำเนินการ</span>';
      const tr = document.createElement('tr');
      tr.innerHTML =
        '<td>' + escapeHtml(fd.projectNo || '-') + '</td>' +
        '<td class="doc-name-cell">' + escapeHtml(fd.projectName || '(ไม่มีชื่อโครงการ)') + '</td>' +
        '<td>' + escapeHtml(fd.proposerName || '-') + '</td>' +
        '<td>' + status + '</td>' +
        '<td>' + formatDateTime(doc.updatedAt) + '</td>' +
        '<td class="no-print actions-cell">' +
          '<button class="btn btn-outline btn-sm" title="ดูเอกสาร" onclick="viewDocument(\'' + doc.id + '\')">👁️ ดู</button>' +
          '<button class="btn btn-primary btn-sm" title="แก้ไขเอกสาร" onclick="editDocument(\'' + doc.id + '\')">✏️ แก้ไข</button>' +
          '<button class="btn btn-success btn-sm" title="ผลลัพธ์ KPI / กราฟ" onclick="openResultsFor(\'' + doc.id + '\')">📊 ผลลัพธ์</button>' +
          '<button class="btn btn-outline btn-sm" title="Export เป็นไฟล์ JSON" onclick="exportDocument(\'' + doc.id + '\')">⬇️</button>' +
          '<button class="btn btn-outline btn-danger btn-sm" title="ลบเอกสาร" onclick="deleteDocument(\'' + doc.id + '\')">🗑️</button>' +
        '</td>';
      tbody.appendChild(tr);
    });
  } catch (err) {
    tbody.innerHTML = '';
    errEl.hidden = false;
  }
}

function escapeHtml(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function formatDateTime(iso) {
  if (!iso) return '-';
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '-';
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yy = d.getFullYear() + 543;
    const hh = String(d.getHours()).padStart(2, '0');
    const mi = String(d.getMinutes()).padStart(2, '0');
    return dd + '/' + mm + '/' + yy + ' ' + hh + ':' + mi;
  } catch (e) { return '-'; }
}

// ---------- Open / Edit / New ----------
async function loadDocIntoEditor(id) {
  const doc = await Api.getDocument(id);
  setCurrentDocId(doc.id);
  formData = Object.assign(makeBlankFormData(), doc.formData || {});
  fieldOffsets = doc.fieldOffsets || {};
  applyFormDataToDOM(formData);
  if (window.setKpiState) window.setKpiState(doc.kpi || { items: [] });
  if (window.setPhotoState) window.setPhotoState(doc.photos || []);
}

window.viewDocument = async function(id) {
  try {
    await loadDocIntoEditor(id);
    setEditMode(false);
    showView('form');
  } catch (e) {
    showToast('❌ โหลดเอกสารไม่สำเร็จ: ' + e.message);
  }
};

window.editDocument = async function(id) {
  try {
    await loadDocIntoEditor(id);
    setEditMode(true);
    showView('form');
  } catch (e) {
    showToast('❌ โหลดเอกสารไม่สำเร็จ: ' + e.message);
  }
};

window.openResultsFor = async function(id) {
  try {
    await loadDocIntoEditor(id);
    showView('results');
  } catch (e) {
    showToast('❌ โหลดเอกสารไม่สำเร็จ: ' + e.message);
  }
};

window.createNewDocument = function() {
  setCurrentDocId(null);
  formData = makeBlankFormData();
  fieldOffsets = {};
  applyFormDataToDOM(formData);
  if (window.setKpiState) window.setKpiState({ items: [] });
  if (window.setPhotoState) window.setPhotoState([]);
  setEditMode(true);
  showView('form');
};

function setEditMode(edit) {
  isViewOnlyMode = !edit;
  const panel = document.querySelector('.form-panel');
  const banner = document.getElementById('readonlyBanner');
  if (panel) panel.classList.toggle('readonly', isViewOnlyMode);
  if (banner) banner.hidden = edit;
}

// ---------- Save ----------
window.saveCurrentDocument = async function() {
  try {
    if (!formData.projectName || !formData.projectName.trim()) {
      showToast('⚠️ กรุณากรอก "ชื่อโครงการ" ก่อนบันทึก');
      return;
    }
    const payload = window.collectDocPayload();
    const res = await Api.upsertDocument(payload);
    setCurrentDocId(res.id);
    const badge = document.getElementById('saveStateBadge');
    if (badge) {
      const now = new Date();
      badge.textContent = '🟢 บันทึกแล้ว ' + String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
    }
    showToast('💾 บันทึกลงเซิร์ฟเวอร์เรียบร้อย (ID: ' + res.id + ')');
  } catch (e) {
    showToast('❌ บันทึกไม่สำเร็จ — ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ (รัน start_server.ps1)');
  }
};

// ---------- Delete ----------
window.deleteDocument = async function(id) {
  if (!confirm('⚠️ ต้องการลบเอกสารนี้ถาวรหรือไม่?')) return;
  try {
    await Api.deleteDocument(id);
    showToast('🗑️ ลบเอกสารเรียบร้อย');
    refreshDocumentList();
  } catch (e) {
    showToast('❌ ลบไม่สำเร็จ: ' + e.message);
  }
};

// ---------- Export / Import ----------
window.exportDocument = async function(id) {
  try {
    const doc = await Api.getDocument(id);
    const fd = doc.formData || {};
    const filename = ((fd.projectNo || doc.id) + '.json').replace(/[\\/:*?"<>|]/g, '_');
    const blob = new Blob([JSON.stringify(doc, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (e) {
    showToast('❌ Export ไม่สำเร็จ: ' + e.message);
  }
};

window.importDocumentClick = function() {
  const input = document.getElementById('importFileInput');
  if (input) input.click();
};

async function handleImportFile(file) {
  try {
    const text = await file.text();
    const doc = JSON.parse(text);
    delete doc.id;
    delete doc.createdAt;
    delete doc.updatedAt;
    const res = await Api.upsertDocument(doc);
    showToast('📥 นำเข้าเอกสารสำเร็จ (ID: ' + res.id + ')');
    refreshDocumentList();
  } catch (e) {
    showToast('❌ ไฟล์ไม่ถูกต้องหรือนำเข้าไม่สำเร็จ: ' + e.message);
  }
}

// ---------- Init ----------
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.nav-link').forEach(btn => {
    btn.addEventListener('click', () => showView(btn.dataset.view));
  });

  const importInput = document.getElementById('importFileInput');
  if (importInput) {
    importInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files.length > 0) {
        handleImportFile(e.target.files[0]);
        e.target.value = '';
      }
    });
  }

  updateSaveBadge();
  refreshDocumentList();
});
