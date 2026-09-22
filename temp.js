
    (function(){
      var t = localStorage.getItem('icep_modern_theme');
      if(t === 'dark') document.documentElement.setAttribute('data-theme','dark');
    })();
  


    // â”€â”€â”€ DATA â”€â”€â”€
    // Hardcoded fallback (Marketing 400L)
    const _classListFallback = [
      { id: 1, name: "Emmanuel Chukwuemeka", matric: "2026/MKT/0472", avatar: "images/student_01.jpg", track: "Digital Marketing", cgpa: "4.82", attendance: "100%", dues: "PAID", advisor: "Prof. O. K. Balogun" },
      { id: 2, name: "Adaora Okonkwo", matric: "2026/MKT/0473", avatar: "images/student_02.jpg", track: "Brand Strategy", cgpa: "4.65", attendance: "95%", dues: "UNPAID", advisor: "Dr. Mrs. A. N. Eze" },
      { id: 3, name: "Chidi Nwachukwu", matric: "2026/MKT/0474", avatar: "images/student_03.jpg", track: "Market Analytics", cgpa: "4.40", attendance: "88%", dues: "UNPAID", advisor: "Dr. S. I. Ahmed" },
      { id: 4, name: "Blessing Adebayo", matric: "2026/MKT/0475", avatar: "images/student_04.jpg", track: "International Trade", cgpa: "4.75", attendance: "92%", dues: "PAID", advisor: "Prof. C. E. Chukwu" },
      { id: 5, name: "Olumide Fashola", matric: "2026/MKT/0476", avatar: "images/student_01.jpg", track: "Advertising Strategy", cgpa: "4.55", attendance: "96%", dues: "PAID", advisor: "Prof. O. K. Balogun" },
      { id: 6, name: "Chioma Ezenwa", matric: "2026/MKT/0477", avatar: "images/student_02.jpg", track: "Consumer Psychology", cgpa: "4.90", attendance: "98%", dues: "PAID", advisor: "Dr. Mrs. A. N. Eze" },
      { id: 7, name: "Babatunde Danjuma", matric: "2026/MKT/0478", avatar: "images/student_03.jpg", track: "Supply Chain", cgpa: "4.30", attendance: "85%", dues: "PAID", advisor: "Dr. S. I. Ahmed" },
      { id: 8, name: "Ngozi Umeh", matric: "2026/MKT/0479", avatar: "images/student_04.jpg", track: "Corporate PR", cgpa: "4.60", attendance: "94%", dues: "PAID", advisor: "Prof. C. E. Chukwu" },
      { id: 9, name: "Farouk Bello", matric: "2026/MKT/0480", avatar: "images/student_01.jpg", track: "Sales Management", cgpa: "4.45", attendance: "90%", dues: "PAID", advisor: "Prof. O. K. Balogun" },
      { id: 10, name: "Ifeoma Anene", matric: "2026/MKT/0481", avatar: "images/student_02.jpg", track: "Retail Marketing", cgpa: "4.88", attendance: "100%", dues: "PAID", advisor: "Dr. Mrs. A. N. Eze" },
      { id: 11, name: "Tunde Bakare", matric: "2026/MKT/0482", avatar: "images/student_03.jpg", track: "Product Dev", cgpa: "4.35", attendance: "87%", dues: "PAID", advisor: "Dr. S. I. Ahmed" },
      { id: 12, name: "Amaka Nnamdi", matric: "2026/MKT/0483", avatar: "images/student_04.jpg", track: "Services Marketing", cgpa: "4.50", attendance: "93%", dues: "PAID", advisor: "Prof. C. E. Chukwu" },
      { id: 13, name: "Kehinde Ogundipe", matric: "2026/MKT/0484", avatar: "images/student_01.jpg", track: "E-Commerce", cgpa: "4.52", attendance: "91%", dues: "PAID", advisor: "Prof. O. K. Balogun" },
      { id: 14, name: "Zainab Aliyu", matric: "2026/MKT/0485", avatar: "images/student_02.jpg", track: "Digital Comms", cgpa: "4.80", attendance: "99%", dues: "PAID", advisor: "Dr. Mrs. A. N. Eze" },
      { id: 15, name: "Chukwudi Opara", matric: "2026/MKT/0486", avatar: "images/student_03.jpg", track: "Media Relations", cgpa: "4.38", attendance: "89%", dues: "PAID", advisor: "Dr. S. I. Ahmed" },
      { id: 16, name: "Yetunde Sowore", matric: "2026/MKT/0487", avatar: "images/student_04.jpg", track: "Strategic Mkt", cgpa: "4.70", attendance: "97%", dues: "PAID", advisor: "Prof. C. E. Chukwu" }
    ];
    let classListStudents = typeof ICEP_STUDENTS !== 'undefined'
      ? ICEP_STUDENTS.filter(s => s.department === 'Marketing' && s.level === 400)
      : _classListFallback;
    if (!classListStudents || classListStudents.length === 0) classListStudents = _classListFallback;
    const DEFAULT_BROADSHEET_SCORES = [96, 89, 78, 92, 85, 74, 68, 91, 82, 95, 63, 88, 79, 97, 71, 90];

    // â”€â”€â”€ UI CONTROLS â”€â”€â”€
    function toggleAcc(id){
      const el = document.getElementById(id);
      el.classList.toggle('acc-open');
    }
    function openModal(id){
      document.getElementById(id).classList.add('modal-open');
      if(id === 'rosterModal') {
        const container = document.getElementById('rosterGridContainer');
        if (!container || container.innerHTML.trim() === '') renderRosterGrid();
      }
    }
    function closeModal(id){ document.getElementById(id).classList.remove('modal-open'); }
    function closeOnOutside(e, id){
      if(e.target.id === id) closeModal(id);
    }

    function toggleMenu(id){
      const el = document.getElementById(id);
      el.classList.toggle(id.includes('portal') ? 'portal-open' : 'notif-open');
    }
    document.addEventListener('click', (e)=>{
      if(!e.target.closest('.portal-switcher')) document.getElementById('portalMenu').classList.remove('portal-open');
      if(!e.target.closest('.nav-bell') && !e.target.closest('.notif-panel')) document.getElementById('notifPanel').classList.remove('notif-open');
    });

    function toggleMobileMenu(){
      document.getElementById('mobileMenu').classList.add('open');
      document.getElementById('mobileBackdrop').classList.add('open');
    }
    function closeMobileMenu(){
      document.getElementById('mobileMenu').classList.remove('open');
      document.getElementById('mobileBackdrop').classList.remove('open');
    }

    function switchViewMode(module, mode){
      const tabs = document.querySelectorAll(`#${module}Modal .modal-tab`);
      tabs.forEach(t => t.classList.remove('active-tab'));
      if(event && event.target) event.target.classList.add('active-tab');
      
      if(module === 'roster') {
        if(mode === 'grid') {
          document.getElementById('rosterGridView').style.display = 'block';
          document.getElementById('rosterListView').style.display = 'none';
          renderRosterGrid();
        } else {
          document.getElementById('rosterListView').style.display = 'block';
          document.getElementById('rosterGridView').style.display = 'none';
          renderRosterList();
        }
      } else {
        document.querySelectorAll(`#${module}Modal .modal-tab-panel`).forEach(p => p.classList.remove('active-panel'));
        let p = document.getElementById(`${module}-${mode}`);
        if(p) p.classList.add('active-panel');
      }
    }

    function showToast(msg, isError=false){
      const t = document.getElementById('toast');
      t.querySelector('span').innerText = msg;
      t.className = isError ? 'error show' : 'show';
      setTimeout(()=>t.classList.remove('show'), 3000);
    }

    // â”€â”€â”€ DARK MODE â”€â”€â”€
    function toggleDarkMode(){
      const html = document.documentElement;
      if(html.getAttribute('data-theme') === 'dark'){
        html.removeAttribute('data-theme');
        localStorage.setItem('icep_modern_theme','light');
        document.getElementById('themeIcon').className = 'fas fa-moon';
      } else {
        html.setAttribute('data-theme','dark');
        localStorage.setItem('icep_modern_theme','dark');
        document.getElementById('themeIcon').className = 'fas fa-sun';
      }
    }

    // â”€â”€â”€ SEMESTER-AWARE COURSE SELECTOR â”€â”€â”€
    // Courses for MKT 400L by semester (pulled from dataset if available, else fallback)
    const MKT400_COURSES = {
      1: [
        { code:'MKT 401', title:'Advanced Marketing Research', units:3, lecturer:'Prof. O. K. Balogun' },
        { code:'MKT 403', title:'Consumer Behavior', units:3, lecturer:'Dr. Mrs. A. N. Eze' },
        { code:'MKT 405', title:'Brand Management', units:2, lecturer:'Dr. S. I. Ahmed' },
        { code:'MKT 407', title:'International Marketing', units:3, lecturer:'Prof. C. E. Chukwu' },
        { code:'MKT 409', title:'Strategic Marketing', units:3, lecturer:'Dr. K. T. Ogundipe' },
        { code:'GST 401', title:'Entrepreneurship Studies', units:2, lecturer:'Dr. O. Ayo' }
      ],
      2: [
        { code:'MKT 402', title:'Marketing of Services', units:3, lecturer:'Prof. O. K. Balogun' },
        { code:'MKT 404', title:'Distribution Management', units:3, lecturer:'Dr. Mrs. A. N. Eze' },
        { code:'MKT 406', title:'Advertising Management', units:2, lecturer:'Dr. S. I. Ahmed' },
        { code:'MKT 408', title:'Marketing Research Methods', units:3, lecturer:'Prof. C. E. Chukwu' },
        { code:'MKT 410', title:'Sales Management', units:3, lecturer:'Dr. K. T. Ogundipe' },
        { code:'GST 402', title:'Peace Studies & Conflict Resolution', units:2, lecturer:'Dr. F. Lawal' }
      ]
    };

    function updateCoursesBySelectedSem() {
      const sem = parseInt(document.getElementById('bSem').value) || 1;
      const codeSel = document.getElementById('bCode');
      if (!codeSel) return;

      // Try to get courses from the live dataset first
      let courses = null;
      if (typeof ICEP_DEPARTMENTS !== 'undefined') {
        const dept = ICEP_DEPARTMENTS.find(d => d.name === 'Marketing');
        if (dept && dept.courses) {
          courses = dept.courses.filter(c => c.semester === sem && c.level === 400);
        }
      }
      // Fallback to hardcoded
      if (!courses || courses.length === 0) courses = MKT400_COURSES[sem] || MKT400_COURSES[1];

      codeSel.innerHTML = courses.map(c => `<option value="${c.code}" data-title="${c.title}" data-lec="${c.lecturer || ''}">${
        c.code} â€” ${c.title} (${c.units || '?'}u)</option>`).join('');

      // Auto-sync title and lecturer
      syncCourseTitleFromCode();
    }

    function syncCourseTitleFromCode() {
      const codeSel = document.getElementById('bCode');
      if (!codeSel) return;
      const sel = codeSel.options[codeSel.selectedIndex];
      if (!sel) return;
      const titleInp = document.getElementById('bTitle');
      const lecInp = document.getElementById('bLec');
      if (titleInp && sel.dataset.title) titleInp.value = sel.dataset.title;
      if (lecInp && sel.dataset.lec) lecInp.value = sel.dataset.lec;
    }

    window.onload = function(){
      if(localStorage.getItem('icep_modern_theme') === 'dark'){
        document.getElementById('themeIcon').className = 'fas fa-sun';
      }
      renderNotifs();
      // Init semester-based course selector
      updateCoursesBySelectedSem();
      // Sync student count chip
      if (classListStudents) {
        document.querySelectorAll('[data-stat="students"]').forEach(el => {
          el.textContent = classListStudents.length;
        });
      }
    }

    // â”€â”€â”€ NOTIFICATIONS â”€â”€â”€
    const NOW_CR = Date.now();
    const NOTIFS_CR = [
      { id:1, icon:'ðŸ“‹', text:'MKT 401 broadsheet has been submitted and synced.', time:'5 min ago', read:false, target:'resultModal', addedAt: NOW_CR - 5*60*1000 },
      { id:2, icon:'ðŸ“…', text:'Monday lecture reminder: MKT 401 at 8:00 AM in Hall B.', time:'1 hr ago', read:false, target:'timetableModal', addedAt: NOW_CR - 60*60*1000 },
      { id:3, icon:'ðŸ’°', text:'2 students have not yet paid MKT 201 Textbook Dues.', time:'2 hrs ago', read:false, target:'feeModal', addedAt: NOW_CR - 2*60*60*1000 },
      { id:4, icon:'ðŸ‘¥', text:'Class list updated: 16 students now enrolled.', time:'Yesterday', read:false, target:'rosterModal', addedAt: NOW_CR - 26*60*60*1000 },
    ];
    function isNew(addedAt) { return (Date.now() - addedAt) < 86400000; }
    function routeToTarget(target) {
      document.querySelectorAll('.notif-panel-open, #notifPanel').forEach(p => p.classList.remove('notif-open', 'notif-panel-open'));
      if (!target) return;
      const el = document.getElementById(target);
      if (el && el.classList.contains('modal-overlay')) openModal(target);
    }
    function handleNotifClick(e, id) {
      if (e.target.closest('.notif-dismiss')) return;
      const n = NOTIFS_CR.find(x => x.id === id);
      if (!n) return;
      n.read = true; renderNotifs();
      if (n.target) routeToTarget(n.target);
    }
    function dismissNotif(id){
      let n = NOTIFS_CR.find(x=>x.id===id);
      if(n) n.read = true;
      renderNotifs();
    }
    function renderNotifs(){
      const list = document.getElementById('notifList');
      const count = document.getElementById('notifCount');
      list.innerHTML = '';
      let unread = 0;
      NOTIFS_CR.forEach(n => {
        if(!n.read) unread++;
        let newHtml = (isNew(n.addedAt) && !n.read) ? '<span class="new-badge">NEW</span>' : '';
        list.innerHTML += `
          <div class="notif-item ${n.read?'notif-read':''}" onclick="handleNotifClick(event, ${n.id})">
            <div style="font-size:18px;">${n.icon}</div>
            <div class="notif-text">
              <p>${n.text} ${newHtml}</p>
              <span>${n.time}</span>
            </div>
            <button class="notif-dismiss" onclick="dismissNotif(${n.id})" style="border:none;background:none;color:var(--muted);cursor:pointer;padding:4px;"><i class="fas fa-times"></i></button>
          </div>
        `;
      });
      if(unread > 0){
        count.style.display = 'flex';
        count.innerText = unread > 9 ? '9+' : unread;
      } else {
        count.style.display = 'none';
        list.innerHTML = '<div style="padding:20px;text-align:center;color:var(--muted)">No new notifications</div>';
      }
    }
    function markAllRead(){
      NOTIFS_CR.forEach(n=>n.read=true);
      renderNotifs();
    }

    // â”€â”€â”€ BROADSHEET LOGIC â”€â”€â”€

    function saveBroadsheetToHistory(code, level, semester, scores) {
      const history = JSON.parse(localStorage.getItem('icep_broadsheet_history') || '[]');
      const carryovers = scores.filter(s => s.score !== null && s.score < 45);
      const validScores = scores.filter(s=>s.score!==null);
      let avg = 0;
      if (validScores.length > 0) avg = Math.round(validScores.reduce((a,b)=>a+b.score,0) / validScores.length);
      history.unshift({
        code, level, semester,
        date: new Date().toLocaleDateString(),
        scores,
        carryovers: carryovers.length,
        avg: avg
      });
      localStorage.setItem('icep_broadsheet_history', JSON.stringify(history.slice(0,50)));
    }
    function renderBroadsheetHistory() {
      const history = JSON.parse(localStorage.getItem('icep_broadsheet_history') || '[]');
      const container = document.getElementById('bsHistoryContainer');
      if (!container) return;
      if (history.length === 0) { container.innerHTML = '<p style="text-align:center;color:var(--muted);padding:30px">No broadsheets submitted yet.</p>'; return; }
      
      let sortVal = 'date';
      let selectEl = document.getElementById('bsSortSelect');
      if(selectEl) sortVal = selectEl.value;
      
      let sorted = [...history];
      if(sortVal === 'code') sorted.sort((a,b) => a.code.localeCompare(b.code));
      if(sortVal === 'avg') sorted.sort((a,b) => b.avg - a.avg);

      container.innerHTML = `
        <div style="display:flex;gap:10px;margin-bottom:16px;flex-wrap:wrap">
          <select id="bsSortSelect" onchange="renderBroadsheetHistory()" style="padding:8px 14px;border-radius:14px;border:1.5px solid var(--border);background:var(--card);color:var(--text);font-size:13px;font-weight:600">
            <option value="date" ${sortVal==='date'?'selected':''}>Sort by Date</option>
            <option value="code" ${sortVal==='code'?'selected':''}>Sort by Code</option>
            <option value="avg" ${sortVal==='avg'?'selected':''}>Sort by Avg Score</option>
          </select>
          <button onclick="exportBsHistoryTXT()" style="padding:8px 16px;border-radius:14px;border:1.5px solid var(--border);background:var(--card);color:var(--text);font-size:12.5px;font-weight:700;cursor:pointer"><i class="fas fa-file-lines"></i> Export TXT</button>
        </div>
        <table class="result-table" style="width:100%">
          <thead><tr><th>#</th><th>Course</th><th>Level</th><th>Semester</th><th>Date</th><th>Avg</th><th>Carryovers</th></tr></thead>
          <tbody>${sorted.map((h,i) => `
            <tr>
              <td>${i+1}</td>
              <td style="font-weight:700">${h.code}</td>
              <td>${h.level}</td><td>${h.semester}</td><td>${h.date}</td>
              <td style="color:#10b981;font-weight:800">${h.avg}%</td>
              <td><span style="padding:4px 10px;border-radius:10px;font-size:12px;font-weight:800;background:${h.carryovers>0?'rgba(217,83,79,0.15)':'rgba(16,185,129,0.15)'};color:${h.carryovers>0?'#D9534F':'#10b981'}">${h.carryovers} ${h.carryovers===1?'carryover':'carryovers'}</span></td>
            </tr>`).join('')}
          </tbody>
        </table>`;
    }
    function exportBsHistoryTXT() {
      const history = JSON.parse(localStorage.getItem('icep_broadsheet_history') || '[]');
      const lines = ['ICEP BROADSHEET SUBMISSION HISTORY','='.repeat(60),''];
      history.forEach((h,i) => { lines.push(`${i+1}. ${h.code} | ${h.level} | ${h.semester} | ${h.date} | Avg: ${h.avg}% | Carryovers: ${h.carryovers}`); });
      const blob = new Blob([lines.join('\n')],{type:'text/plain'});
      const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='ICEP_BroadsheetHistory.txt';a.click();
    }

    function generateMasterBroadsheet(){
      const skip = document.getElementById('bSkip').checked;
      const file = document.getElementById('bFile').value;
      if(!skip && !file){
        showToast('Please upload an image proof or check "Skip".', true);
        return;
      }
      document.getElementById('broadsheetTableWrap').style.display = 'block';
      const body = document.getElementById('broadsheetBody');
      body.innerHTML = '';
      classListStudents.forEach((s, i) => {
        body.innerHTML += `
          <tr>
            <td>${i+1}</td>
            <td><strong>${s.name}</strong></td>
            <td>${s.matric}</td>
            <td><input type="number" class="score-input" id="score_${s.id}" min="0" max="100" onchange="updateAutoGrade(${s.id}, this.value)"></td>
            <td><span class="badge" id="grade_${s.id}">-</span></td>
          </tr>
        `;
      });
    }
    function updateAutoGrade(id, val){
      const badge = document.getElementById(`grade_${id}`);
      if(!val || val===''){ badge.innerText = '-'; badge.className = 'badge'; return; }
      let v = parseInt(val);
      if(v>=70){ badge.innerText = 'A'; badge.className = 'badge badge-paid'; }
      else if(v>=60){ badge.innerText = 'B'; badge.className = 'badge'; badge.style.background='rgba(99,102,241,0.1)'; badge.style.color='#6366f1'; }
      else if(v>=50){ badge.innerText = 'C'; badge.className = 'badge'; badge.style.background='var(--warn-bg)'; badge.style.color='var(--warn)'; }
      else if(v>=45){ badge.innerText = 'D'; badge.className = 'badge'; badge.style.background='rgba(245,158,11,0.1)'; badge.style.color='#f59e0b'; }
      else { badge.innerText = 'F'; badge.className = 'badge badge-unpaid'; }
    }
    function quickFillScores(type){
      classListStudents.forEach((s, i) => {
        const inp = document.getElementById(`score_${s.id}`);
        if(!inp) return;
        if(type==='high') inp.value = Math.floor(Math.random()*(100-70+1))+70;
        else if(type==='varied') inp.value = DEFAULT_BROADSHEET_SCORES[i];
        else inp.value = '';
        updateAutoGrade(s.id, inp.value);
      });
    }
    function submitMasterBroadsheet(){
      let scores = [];
      let carryovers = 0;
      classListStudents.forEach((s) => {
        let inp = document.getElementById(`score_${s.id}`);
        let val = inp && inp.value !== '' ? parseInt(inp.value) : null;
        scores.push({id: s.id, score: val});
        if(val !== null && val < 45) carryovers++;
      });
      let code = document.getElementById('bCode').value || 'Unknown';
      let level = document.getElementById('bLevel').value || 'Unknown';
      let sem = document.getElementById('bSem').value || 'Unknown';
      saveBroadsheetToHistory(code, level, sem, scores);
      showToast(`Broadsheet submitted! ${carryovers} carryovers flagged.`);
      setTimeout(()=>closeModal('resultModal'), 1000);
    }

    // â”€â”€â”€ FEE MANAGER â”€â”€â”€

    function saveFeeToHistory(title, amount) {
      const history = JSON.parse(localStorage.getItem('icep_fee_history') || '[]');
      history.unshift({ title, amount, date: new Date().toLocaleDateString(), paid: classListStudents.filter(s=>s.dues==='PAID').length, total: classListStudents.length });
      localStorage.setItem('icep_fee_history', JSON.stringify(history.slice(0,50)));
    }
    function renderFeeHistory() {
      const history = JSON.parse(localStorage.getItem('icep_fee_history') || '[]');
      const tbody = document.getElementById('feeHistoryTbody');
      if (!tbody) return;
      if (history.length === 0) { tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--muted);padding:30px">No fee drives created yet.</td></tr>'; return; }
      tbody.innerHTML = history.map((f,i) => `
        <tr>
          <td>${i+1}</td><td style="font-weight:700">${f.title}</td>
          <td>â‚¦${parseInt(f.amount).toLocaleString()}</td>
          <td>${f.date}</td>
          <td><span style="background:rgba(16,185,129,0.15);color:#10b981;padding:4px 10px;border-radius:10px;font-size:12px;font-weight:800">${f.paid}/${f.total} Paid</span></td>
        </tr>`).join('');
    }

    function generateFeeDrive(){
      document.getElementById('feeTableWrap').style.display = 'block'; saveFeeToHistory(document.getElementById('feeTitle').value, document.getElementById('feeAmt').value); switchViewMode('fee','active');
      const body = document.getElementById('feeBody');
      body.innerHTML = '';
      classListStudents.forEach(s => {
        let isPaid = s.dues === 'PAID';
        body.innerHTML += `
          <tr>
            <td><input type="checkbox" class="fee-chk" value="${s.id}" ${isPaid?'disabled':''}></td>
            <td><strong>${s.name}</strong></td>
            <td>${s.matric}</td>
            <td id="feeStatus_${s.id}">
              <span class="badge ${isPaid?'badge-paid':'badge-unpaid'}">${s.dues}</span>
            </td>
            <td>
              ${!isPaid ? `<button class="btn-primary" style="padding:4px 10px;font-size:11px;" onclick="promptPaymentModal(${s.id})">Mark Paid</button>` : `<span style="color:var(--success);font-size:12px;"><i class="fas fa-check"></i> Cleared</span>`}
            </td>
          </tr>
        `;
      });
    }
    function toggleAllFeeChecks(){
      const master = document.getElementById('feeCheckAll').checked;
      document.querySelectorAll('.fee-chk:not([disabled])').forEach(c => c.checked = master);
    }
    function markSelectedAsPaid(){
      const checks = document.querySelectorAll('.fee-chk:checked:not([disabled])');
      if(checks.length === 0){ showToast('No pending students selected.', true); return; }
      if(confirm(`Mark ${checks.length} students as PAID?`)){
        checks.forEach(c => approvePayment(parseInt(c.value)));
        showToast('Payments updated!');
      }
    }
    function promptPaymentModal(id){
      if(confirm('Confirm payment received for this student?')){
        approvePayment(id);
        showToast('Payment verified.');
      }
    }
    function approvePayment(id){
      let s = classListStudents.find(x=>x.id===id);
      if(s) s.dues = 'PAID';
      generateFeeDrive();
    }
    function exportPaymentPDF(){ showToast('Generating PDF Report...'); }
    function exportPaymentTXT(){ showToast('Downloading TXT file...'); }

    // â”€â”€â”€ CLASS ROSTER â”€â”€â”€

    let rosterFilter = '';
    function filterRoster() {
      rosterFilter = document.getElementById('rosterSearchInput').value.toLowerCase();
      const currentView = document.getElementById('rosterGridView').style.display !== 'none' ? 'grid' : 'list';
      if (currentView === 'grid') renderRosterGrid();
      else renderRosterList();
    }
    function renderRosterGrid() {
      const container = document.getElementById('rosterGridContainer');
      const noMsg = document.getElementById('rosterNoResults');
      if(!container) return;
      const filtered = classListStudents.filter(s => s.name.toLowerCase().includes(rosterFilter) || s.matric.toLowerCase().includes(rosterFilter));
      if (filtered.length === 0) { container.innerHTML = ''; noMsg.style.display = 'block'; return; }
      noMsg.style.display = 'none';
      container.innerHTML = filtered.map(s => `
        <div class="neu-student-card" onclick="showStudentDetail('${s.name}','${s.matric}','${s.avatar}','${s.track}','${s.attendance}','${s.dues}')">
          <img src="${s.avatar}" class="neu-card-img" alt="${s.name}" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(s.name)}&background=10b981&color=fff&bold=true&size=200'">
          <span class="neu-card-dues ${s.dues==='PAID'?'dues-paid':'dues-unpaid'}">${s.dues}</span>
          <div class="neu-card-body">
            <div class="neu-card-name">${s.name}</div>
            <div class="neu-card-matric">${s.matric}</div>
            <span class="neu-card-track">${s.track}</span>
          </div>
        </div>
      `).join('');
    }
    function renderRosterList() {
      const table = document.getElementById('rosterListTable');
      const noMsg = document.getElementById('rosterNoResults');
      if(!table) return;
      const filtered = classListStudents.filter(s => s.name.toLowerCase().includes(rosterFilter) || s.matric.toLowerCase().includes(rosterFilter));
      if (filtered.length === 0) { table.innerHTML = ''; noMsg.style.display = 'block'; return; }
      noMsg.style.display = 'none';
      table.innerHTML = `
        <thead><tr><th>#</th><th>Name</th><th>Matric</th><th>Track</th><th>Attendance</th><th>Dues</th><th>Detail</th></tr></thead>
        <tbody>${filtered.map((s,i) => `
          <tr>
            <td>${i+1}</td>
            <td style="font-weight:700">${s.name}</td>
            <td style="color:#10b981;font-weight:700">${s.matric}</td>
            <td>${s.track}</td>
            <td>${s.attendance}</td>
            <td><span style="padding:4px 10px;border-radius:10px;font-size:12px;font-weight:800;background:${s.dues==='PAID'?'rgba(16,185,129,0.15)':'rgba(239,68,68,0.15)'};color:${s.dues==='PAID'?'#10b981':'#ef4444'}">${s.dues}</span></td>
            <td><button onclick="showStudentDetail('${s.name}','${s.matric}','${s.avatar}','${s.track}','${s.attendance}','${s.dues}')" style="background:rgba(16,185,129,0.15);border:none;color:#10b981;padding:6px 14px;border-radius:10px;font-weight:700;cursor:pointer">View</button></td>
          </tr>`).join('')}
        </tbody>`;
    }
    function exportRosterPDF() {
      const pw = window.open('','_blank','width=850,height=1100');
      if(!pw){showToast('Please allow popups to export PDF',true);return;}
      const rows = classListStudents.map((s,i) => `<tr><td>${i+1}</td><td>${s.name}</td><td>${s.matric}</td><td>${s.track}</td><td>${s.attendance}</td><td>${s.dues}</td></tr>`).join('');
      pw.document.write(`<!DOCTYPE html><html><head><title>Class Roster - MKT 400L</title><style>body{font-family:Arial,sans-serif;padding:40px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ddd;padding:8px;text-align:left}th{background:#10b981;color:#fff}h1{color:#10b981}</style></head><body><h1>ICEP â€” Class Roster</h1><p>Department of Marketing | 400 Level | 2025/2026</p><table><thead><tr><th>#</th><th>Name</th><th>Matric</th><th>Track</th><th>Attendance</th><th>Dues</th></tr></thead><tbody>${rows}</tbody></table></body></html>`);
      pw.document.close();pw.print();
    }
    function exportRosterTXT() {
      const lines = ['ICEP CLASS ROSTER â€” Marketing 400L 2025/2026','='.repeat(60),''];
      classListStudents.forEach((s,i) => lines.push(`${String(i+1).padStart(2,'0')}. ${s.name.padEnd(30)} ${s.matric.padEnd(18)} ${s.track.padEnd(22)} ${s.attendance.padEnd(6)} ${s.dues}`));
      const blob = new Blob([lines.join('\n')],{type:'text/plain'});
      const a = document.createElement('a');
      a.href=URL.createObjectURL(blob);a.download='ICEP_ClassRoster_MKT400L.txt';a.click();
    }

    function showStudentDetail(name, matric, avatar, track, att, dues, fallback){
      document.getElementById('sdName').innerText = name;
      document.getElementById('sdMatric').innerText = matric;
      let img = document.getElementById('sdAvatar');
      img.src = avatar;
      img.onerror = () => { img.src = fallback; };
      document.getElementById('sdTrack').innerText = track;
      document.getElementById('sdAtt').innerText = att;
      let d = document.getElementById('sdDues');
      d.innerText = dues;
      d.className = dues==='PAID'?'badge badge-paid':'badge badge-unpaid';
      document.getElementById('studentDetailModal').classList.add('modal-open');
    }
    function closeStudentDetailModal(){
      document.getElementById('studentDetailModal').classList.remove('modal-open');
    }
  
