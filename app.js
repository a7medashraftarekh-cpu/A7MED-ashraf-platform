const API_URL = 'http://localhost:5000/api';
let token = localStorage.getItem('token');

const loginScreen = document.getElementById('login-screen');
const dashboard = document.getElementById('dashboard');
const loginForm = document.getElementById('login-form');
const toast = document.getElementById('toast');

function initNav() {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      if (item.id === 'logout') {
        e.preventDefault();
        logout();
        return;
      }
      e.preventDefault();
      const tab = item.dataset.tab;
      if (tab) {
        showTab(tab);
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        item.classList.add('active');
      }
    });
  });
}

function showTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.add('hidden'));
  const target = document.getElementById('tab-' + tabId);
  if (target) target.classList.remove('hidden');
  if (tabId === 'courses') loadCourses();
  if (tabId === 'exams') loadExams();
  if (tabId === 'overview') loadRecentCourses();
}

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;

  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();

    if (data.success) {
      token = data.token;
      localStorage.setItem('token', token);
      loginScreen.classList.add('hidden');
      dashboard.classList.remove('hidden');
      showToast('✅ مرحباً A7MED! تم تسجيل الدخول بنجاح');
      loadStats();
      loadRecentCourses();
      initNav();
    } else {
      showToast('❌ ' + (data.message || 'بيانات الدخول غير صحيحة'));
    }
  } catch (err) {
    showToast('❌ خطأ في الاتصال بالسيرفر. تأكد من تشغيل السيرفر أولاً.');
  }
});

function logout() {
  localStorage.removeItem('token');
  token = null;
  dashboard.classList.add('hidden');
  loginScreen.classList.remove('hidden');
  showToast('👋 تم تسجيل الخروج');
}

async function loadStats() {
  try {
    const [coursesRes, examsRes] = await Promise.all([
      fetch(`${API_URL}/courses`),
      fetch(`${API_URL}/exams`)
    ]);
    const courses = await coursesRes.json();
    const exams = await examsRes.json();
    document.getElementById('stat-videos').textContent = courses.length;
    document.getElementById('stat-exams').textContent = exams.length;
  } catch (err) {
    console.error('Error loading stats:', err);
  }
}

async function loadRecentCourses() {
  try {
    const res = await fetch(`${API_URL}/courses`);
    const courses = await res.json();
    const container = document.getElementById('recent-courses');
    const recent = courses.slice(0, 3);

    container.innerHTML = recent.map(c => `
      <div class="course-card">
        <div class="course-thumb"><div class="play-btn">▶</div></div>
        <div class="course-info">
          <span class="badge badge-blue">${c.category}</span>
          <h4 style="margin-top:8px;">${c.title}</h4>
          <div class="course-meta">
            <span>⏱ ${c.duration || 'جديد'}</span>
            <span>👁 ${c.views || 0} مشاهدة</span>
          </div>
        </div>
      </div>
    `).join('');
  } catch (err) {
    console.error('Error loading recent courses:', err);
  }
}

async function loadCourses() {
  try {
    const res = await fetch(`${API_URL}/courses`);
    const courses = await res.json();
    const grid = document.getElementById('courses-grid');

    if (courses.length === 0) {
      grid.innerHTML = '<p style="color:var(--text-secondary);grid-column:1/-1;text-align:center;padding:40px;">لا توجد دورات بعد. ابدأ برفع فيديو جديد!</p>';
      return;
    }

    grid.innerHTML = courses.map(c => `
      <div class="course-card">
        <div class="course-thumb"><div class="play-btn">▶</div></div>
        <div class="course-info">
          <span class="badge badge-blue">${c.category}</span>
          <h4 style="margin-top:8px;">${c.title}</h4>
          <p style="color:var(--text-secondary);font-size:13px;margin-top:6px;">${c.description || ''}</p>
          <div class="course-meta">
            <span>⏱ ${c.duration || 'جديد'}</span>
            <span>👁 ${c.views || 0} مشاهدة</span>
          </div>
        </div>
      </div>
    `).join('');
  } catch (err) {
    showToast('❌ خطأ في جلب الدورات');
  }
}

async function loadExams() {
  try {
    const res = await fetch(`${API_URL}/exams`);
    const exams = await res.json();
    const grid = document.getElementById('exams-grid');

    if (exams.length === 0) {
      grid.innerHTML = '<p style="color:var(--text-secondary);grid-column:1/-1;text-align:center;padding:40px;">لا توجد امتحانات بعد. أنشئ امتحان جديد!</p>';
      return;
    }

    grid.innerHTML = exams.map(e => `
      <div class="course-card">
        <div class="course-info">
          <span class="badge badge-orange">امتحان</span>
          <h4 style="margin-top:8px;">${e.title}</h4>
          <div class="course-meta">
            <span>⏱ ${e.duration} دقيقة</span>
            <span>❓ ${e.questions?.length || 0} سؤال</span>
          </div>
        </div>
      </div>
    `).join('');
  } catch (err) {
    showToast('❌ خطأ في جلب الامتحانات');
  }
}

const videoForm = document.getElementById('upload-video-form');
if (videoForm) {
  videoForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      const res = await fetch(`${API_URL}/courses`, {
        method: 'POST',
        body: formData,
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();

      if (data.success) {
        showToast('✅ تم رفع الفيديو بنجاح!');
        e.target.reset();
        loadStats();
      } else {
        showToast('❌ فشل رفع الفيديو');
      }
    } catch (err) {
      showToast('❌ خطأ في رفع الفيديو');
    }
  });
}

const examForm = document.getElementById('create-exam-form');
if (examForm) {
  examForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const questions = [];

    document.querySelectorAll('.question-block').forEach(block => {
      const text = block.querySelector('.q-text').value;
      const options = Array.from(block.querySelectorAll('.opt')).map(o => o.value).filter(v => v);
      const correct = parseInt(block.querySelector('.q-correct').value) || 0;
      questions.push({ text, options, correctAnswer: correct });
    });

    const examData = {
      title: e.target.title.value,
      duration: parseInt(e.target.duration.value),
      questions
    };

    try {
      const res = await fetch(`${API_URL}/exams`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(examData)
      });
      const data = await res.json();

      if (data.success) {
        showToast('✅ تم إنشاء الامتحان بنجاح!');
        e.target.reset();
        document.getElementById('questions-container').innerHTML = createQuestionBlock(1);
        loadStats();
      } else {
        showToast('❌ فشل إنشاء الامتحان');
      }
    } catch (err) {
      showToast('❌ خطأ في إنشاء الامتحان');
    }
  });
}

function createQuestionBlock(num) {
  return `
    <div class="question-block">
      <h5>السؤال ${num}</h5>
      <div class="form-group">
        <input type="text" class="q-text" placeholder="نص السؤال" required>
      </div>
      <div class="option-row">
        <input type="radio" name="q${num}" checked>
        <input type="text" class="opt" placeholder="الإجابة الأولى" style="flex:1;" required>
      </div>
      <div class="option-row">
        <input type="radio" name="q${num}">
        <input type="text" class="opt" placeholder="الإجابة الثانية" style="flex:1;" required>
      </div>
      <div class="option-row">
        <input type="radio" name="q${num}">
        <input type="text" class="opt" placeholder="الإجابة الثالثة" style="flex:1;">
      </div>
      <div class="option-row">
        <input type="radio" name="q${num}">
        <input type="text" class="opt" placeholder="الإجابة الرابعة" style="flex:1;">
      </div>
      <div class="form-group" style="margin-top:12px;">
        <label style="font-size:12px;">رقم الإجابة الصحيحة (0-3):</label>
        <input type="number" class="q-correct" value="0" min="0" max="3" style="width:80px;">
      </div>
    </div>
  `;
}

function addQuestion() {
  const container = document.getElementById('questions-container');
  const num = container.children.length + 1;
  const div = document.createElement('div');
  div.innerHTML = createQuestionBlock(num);
  container.appendChild(div.firstElementChild);
}

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

if (token) {
  loginScreen.classList.add('hidden');
  dashboard.classList.remove('hidden');
  loadStats();
  loadRecentCourses();
  initNav();
} else {
  initNav();
}
