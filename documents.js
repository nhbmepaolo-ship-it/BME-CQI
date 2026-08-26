// ============================================================
// documents.js - Document list, Firebase Firestore client, save/load
// ============================================================

// ---------- Firebase Database Client ----------
const Api = {
  async listDocuments() {
    if (!window.db) throw new Error('Firebase Database ยังไม่ได้ถูกเริ่มต้น');
    const snapshot = await window.db.collection('cpi_documents').get();
    const docs = [];
    snapshot.forEach(docSnap => {
      docs.push({ id: docSnap.id, ...docSnap.data() });
    });
    // เรียงลำดับจากอัปเดตล่าสุดไปเก่าสุด
    docs.sort((a, b) => {
      const timeA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const timeB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return timeB - timeA;
    });
    return docs;
  },

  async getDocument(id) {
    if (!window.db) throw new Error('Firebase Database ยังไม่ได้ถูกเริ่มต้น');
    const docSnap = await window.db.collection('cpi_documents').doc(id).get();
    if (!docSnap.exists) throw new Error('ไม่พบเอกสารนี้ในระบบ');
    return { id: docSnap.id, ...docSnap.data() };
  },

  async upsertDocument(doc) {
    if (!window.db) throw new Error('Firebase Database ยังไม่ได้ถูกเริ่มต้น');
    const nowIso = new Date().toISOString();
    const payload = { ...doc, updatedAt: nowIso };
    
    // ตรวจสอบ docId ที่มีอยู่เดิม
    let docId = doc.id || currentDocId;

    if (docId) {
      delete payload.id;
      await window.db.collection('cpi_documents').doc(docId).set(payload, { merge: true });
      return { id: docId, ...payload };
    } else {
      payload.createdAt = nowIso;
      delete payload.id;
      const ref = await window.db.collection('cpi_documents').add(payload);
      return { id: ref.id, ...payload };
    }
  },

  async deleteDocument(id) {
    if (!window.db) throw new Error('Firebase Database ยังไม่ได้ถูกเริ่มต้น');
    await window.db.collection('cpi_documents').doc(id).delete();
    return { success: true };
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
    badge.textContent = '🟢 บันทึกบนคลาวด์แล้ว';
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

  tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:#888; padding:24px;">⏳ กำลังโหลดข้อมูลจากคลาวด์...</td></tr>';
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
    console.error("Firebase Error:", err);
    tbody.innerHTML = '';
    errEl.hidden = false;
    errEl.innerHTML = '<div style="font-size: 2.4rem;">📡</div><p>ไม่สามารถเชื่อมต่อฐานข้อมูล Firebase ได้ (' + escapeHtml(err.message) + ')<br>กรุณาตรวจสอบสิทธิ์ในหน้า Firestore Rules</p>';
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
    showToast('💾 บันทึกขึ้นระบบคลาวด์เรียบร้อย (ID: ' + res.id + ')');
  } catch (e) {
    console.error(e);
    showToast('❌ บันทึกไม่สำเร็จ: ' + e.message);
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
