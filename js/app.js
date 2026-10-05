// =============================================================================
// app.js - Family Health 100 Portal & Zero-Noise Presentation Engine
// =============================================================================

let currentModuleFilter = 'ALL';
let currentSearchQuery = '';
let currentGlobalTrack = 'beginner'; // 'beginner' or 'advanced'
let currentSlideIndex = 0;
let isSpeakerNotesOpen = false;

// All slides data (Cover + Overview + 24 Lessons)
let ALL_SLIDES = [];

document.addEventListener('DOMContentLoaded', () => {
  initSlidesData();
  renderModuleTabs();
  renderLessonsGrid();
  lucide.createIcons();

  // Keyboard navigation for presentation
  window.addEventListener('keydown', (e) => {
    const modal = document.getElementById('presentationModal');
    if (!modal.classList.contains('hidden')) {
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        nextSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        prevSlide();
      } else if (e.key === 'Escape') {
        closePresentation();
      }
    }
  });
});

// -----------------------------------------------------------------------------
// Initialize Slides Deck Array
// -----------------------------------------------------------------------------
function initSlidesData() {
  ALL_SLIDES = [];

  // 1. Cover
  ALL_SLIDES.push({
    isCover: true,
    category: "ZERO-NOISE CONSULTING SYSTEM  |  McKinsey × BCG × Accenture",
    layout_label: "封面 ｜ 頂尖顧問架構",
    style: "mckinsey",
    title: "家庭健康管理 100 講：核心精華導讀簡報",
    subtitle: "形式對應邏輯：以頂尖生活方式醫學（Lifestyle Medicine）為基石，建立「入門 3 秒行動指南」與「進階生理決策模型」雙軌家庭防禦體系。",
    footer: "主講人：馮雪（阜外醫院生活方式醫學中心） ｜ 顧問分析：Zero-Noise Presentation Framework",
    image_url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
    speaker_notes: {
      conclusion: "本簡報提煉阜外醫院馮雪主任《家庭健康管理100講》核心前24講精華，貫穿生活方式醫學全維度。",
      explanation: "嚴格依據前BCG顧問森秀明無雜訊簡報規範，每一頁皆對應8種邏輯版型之一，並整合雙軌認知導航。",
      transition: "首先我們透過總體架構鳥瞰整個家庭健康管理體系的六大支柱。"
    }
  });

  // 2. Executive Overview (Parallel Bento)
  ALL_SLIDES.push({
    category: "體系總覽 ｜ 核心支柱",
    layout_label: "版型 2：並列論法 (Parallel)",
    style: "accenture",
    conclusion_title: "① 主張：家庭健康防禦體系由六大生活方式支柱平行支撐，形成全因慢病一級預防閉環",
    subtitle: "覆蓋底層認知、物理屏障、晝夜修復、營養代謝、運動抗座與自律神經調控",
    footer: "Source: 馮雪·家庭健康管理100講 知識萃取總體模型 ｜ Accenture Bento Grid Style",
    image_url: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80",
    cards: [
      {
        title: "支柱 1–2：認知與屏障",
        metric: "第一道鐵閘",
        points: [
          "• 逆向思維：健康是供需平衡，非體檢箭頭",
          "• 行為複利：微習慣日積月累激活內在自癒力",
          "• 物理阻斷：洗手、刷牙、防霧霾、保護皮膚屏障"
        ]
      },
      {
        title: "支柱 3–4：修復與代謝",
        metric: "第二道鐵閘",
        points: [
          "• 節律修復：曬太陽合維D，睡眠7–8h類淋巴排毒",
          "• 高效小憩：15–20分鐘微午睡清空大腦腺苷",
          "• 精準營養：四格餐盤、原型天然、16:8輕斷食"
        ]
      },
      {
        title: "支柱 5–6：運動與神經",
        metric: "第三道鐵閘",
        points: [
          "• 生命體徵：心肺耐力提升1 MET降低15%死亡率",
          "• 告別久坐：每90min站立重啟脂蛋白脂肪酶LPL",
          "• 副交感呼吸：每分6次深慢呼吸即時掛擋鎮靜"
        ]
      }
    ],
    speaker_notes: {
      conclusion: "六大支柱相輔相成，構成家庭健康抵禦80%非傳染性慢病的核心防護網。",
      explanation: "入門者掌握日常小行動，進階者建立生理學因果鏈路與決策邊界。",
      transition: "接下來我們逐講拆解具體的無雜訊分析與行動指南。"
    }
  });

  // 3-26: The 24 Lectures
  HEALTH_LESSONS.forEach((lesson, idx) => {
    const zs = lesson.zero_noise_slide;
    ALL_SLIDES.push({
      lesson_id: lesson.id,
      lesson_number: lesson.number,
      category: `${lesson.module_name} ｜ 第 ${lesson.number} 講`,
      layout_label: zs.layout_label || "無雜訊顧問簡報版型",
      style: zs.style || "mckinsey",
      type: zs.type,
      conclusion_title: zs.conclusion_title,
      subtitle: zs.subtitle || "",
      footer: zs.footer || `Source: 馮雪·家庭健康管理100講 第${lesson.number}講`,
      image_url: lesson.image_url,
      // Specific evidence payloads
      kpi_value: zs.kpi_value,
      kpi_label: zs.kpi_label,
      kpi_context: zs.kpi_context,
      bullets: zs.bullets,
      cards: zs.cards,
      top_conclusion: zs.top_conclusion,
      branch_a_title: zs.branch_a_title,
      branch_a_points: zs.branch_a_points,
      branch_b_title: zs.branch_b_title,
      branch_b_points: zs.branch_b_points,
      steps: zs.steps,
      col_headers: zs.col_headers,
      matrix_rows: zs.matrix_rows,
      side_a_title: zs.side_a_title,
      side_b_title: zs.side_b_title,
      dimensions: zs.dimensions,
      left_title: zs.left_title,
      left_points: zs.left_points,
      common_title: zs.common_title,
      common_points: zs.common_points,
      right_title: zs.right_title,
      right_points: zs.right_points,
      y_axis_label: zs.y_axis_label,
      x_axis_label: zs.x_axis_label,
      quadrants: zs.quadrants,
      speaker_notes: zs.speaker_notes
    });
  });

  document.getElementById('slideTotalCount').innerText = ALL_SLIDES.length;
}

// -----------------------------------------------------------------------------
// Render Module Navigation Tabs
// -----------------------------------------------------------------------------
function renderModuleTabs() {
  const container = document.getElementById('moduleFilterTabs');
  let html = `
    <button 
      onclick="setModuleFilter('ALL')" 
      class="px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition flex items-center gap-1.5 ${currentModuleFilter === 'ALL' ? 'bg-slate-900 text-white shadow-sm' : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'}"
    >
      <i data-lucide="layout-grid" class="w-3.5 h-3.5"></i>
      <span>全部模組 (${HEALTH_LESSONS.length})</span>
    </button>
  `;

  HEALTH_MODULES.forEach(mod => {
    const count = HEALTH_LESSONS.filter(l => l.module_id === mod.id).length;
    const isActive = currentModuleFilter === mod.id;
    html += `
      <button 
        onclick="setModuleFilter('${mod.id}')" 
        class="px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition flex items-center gap-1.5 ${isActive ? 'bg-blue-900 text-white shadow-sm' : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'}"
      >
        <span>${mod.name.split('：')[1] || mod.name}</span>
        <span class="px-1.5 py-0.2 rounded-full text-[10px] ${isActive ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-500'}">${count}</span>
      </button>
    `;
  });

  container.innerHTML = html;
  lucide.createIcons();
}

// -----------------------------------------------------------------------------
// Module & Search Filter Handler
// -----------------------------------------------------------------------------
function setModuleFilter(modId) {
  currentModuleFilter = modId;
  const modObj = HEALTH_MODULES.find(m => m.id === modId);
  document.getElementById('activeFilterLabel').innerText = modId === 'ALL' ? '（全部模組）' : `（${modObj.name}）`;
  renderModuleTabs();
  renderLessonsGrid();
}

function handleSearch(val) {
  currentSearchQuery = val.trim().toLowerCase();
  const clearBtn = document.getElementById('clearSearchBtn');
  if (currentSearchQuery) {
    clearBtn.classList.remove('hidden');
  } else {
    clearBtn.classList.add('hidden');
  }
  renderLessonsGrid();
}

function setSearchFilter(tag) {
  document.getElementById('globalSearchInput').value = tag;
  const mobileInput = document.getElementById('mobileSearchInput');
  if (mobileInput) mobileInput.value = tag;
  handleSearch(tag);
}

function clearSearch() {
  document.getElementById('globalSearchInput').value = '';
  const mobileInput = document.getElementById('mobileSearchInput');
  if (mobileInput) mobileInput.value = '';
  handleSearch('');
}

function resetFilter() {
  currentModuleFilter = 'ALL';
  currentSearchQuery = '';
  clearSearch();
  renderModuleTabs();
  renderLessonsGrid();
}

// -----------------------------------------------------------------------------
// Render Lesson Cards Grid
// -----------------------------------------------------------------------------
function renderLessonsGrid() {
  const container = document.getElementById('lessonsGrid');
  const emptyState = document.getElementById('emptyState');

  const filtered = HEALTH_LESSONS.filter(l => {
    // Module filter
    if (currentModuleFilter !== 'ALL' && l.module_id !== currentModuleFilter) {
      return false;
    }
    // Search query filter
    if (currentSearchQuery) {
      const q = currentSearchQuery;
      const matchTitle = l.title.toLowerCase().includes(q);
      const matchTags = l.tags.some(t => t.toLowerCase().includes(q));
      const matchBeginner = l.beginner.core_rule.toLowerCase().includes(q) || l.beginner.action_checklist.some(c => c.toLowerCase().includes(q));
      const matchAdvanced = l.advanced.mental_model.toLowerCase().includes(q) || l.advanced.clinical_evidence.toLowerCase().includes(q);
      if (!matchTitle && !matchTags && !matchBeginner && !matchAdvanced) {
        return false;
      }
    }
    return true;
  });

  document.getElementById('currentResultCount').innerText = filtered.length;

  if (filtered.length === 0) {
    container.innerHTML = '';
    emptyState.classList.remove('hidden');
    return;
  }
  emptyState.classList.add('hidden');

  let html = '';
  filtered.forEach(lesson => {
    const isBeginnerActive = (lesson._track || currentGlobalTrack) === 'beginner';

    html += `
      <div class="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group">
        
        <!-- Card Top Image & Badges -->
        <div class="relative h-44 overflow-hidden bg-slate-100">
          <img 
            src="${lesson.image_url}" 
            alt="${lesson.title}" 
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          >
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
          
          <!-- Top Left Module Tag -->
          <div class="absolute top-3 left-3">
            <span class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/90 backdrop-blur-md text-slate-800 shadow-sm">
              ${lesson.module_name.split('：')[0]}
            </span>
          </div>

          <!-- Top Right Lesson Code -->
          <div class="absolute top-3 right-3">
            <span class="px-2 py-0.5 rounded-lg text-xs font-extrabold bg-blue-900/90 backdrop-blur-md text-amber-300 border border-amber-400/30 font-mono shadow-sm">
              #${lesson.number}
            </span>
          </div>

          <!-- Title Overlay -->
          <div class="absolute bottom-3 left-4 right-4">
            <h3 class="text-white font-extrabold text-base leading-snug line-clamp-1 drop-shadow-sm">
              ${lesson.title}
            </h3>
          </div>
        </div>

        <!-- Card Body -->
        <div class="p-5 flex-1 flex flex-col justify-between">
          
          <!-- Tags -->
          <div class="flex items-center gap-1.5 flex-wrap mb-3.5">
            ${lesson.tags.map(t => `<span class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium">#${t}</span>`).join('')}
          </div>

          <!-- Track Segment Switcher (Beginner vs Advanced) -->
          <div class="p-1 bg-slate-100 rounded-xl flex items-center justify-between mb-3.5 text-xs font-semibold">
            <button 
              onclick="toggleCardTrack('${lesson.id}', 'beginner')" 
              class="flex-1 py-1.5 rounded-lg transition text-center flex items-center justify-center gap-1 ${isBeginnerActive ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-500 hover:text-slate-900'}"
            >
              <i data-lucide="leaf" class="w-3.5 h-3.5"></i>
              <span>🌱 入門行動</span>
            </button>
            <button 
              onclick="toggleCardTrack('${lesson.id}', 'advanced')" 
              class="flex-1 py-1.5 rounded-lg transition text-center flex items-center justify-center gap-1 ${!isBeginnerActive ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-500 hover:text-slate-900'}"
            >
              <i data-lucide="brain-circuit" class="w-3.5 h-3.5"></i>
              <span>🧠 進階架構</span>
            </button>
          </div>

          <!-- Dynamic Track Content -->
          <div class="flex-1 mb-4">
            ${isBeginnerActive ? `
              <!-- Beginner View -->
              <div class="bg-emerald-50/50 border border-emerald-100 rounded-xl p-3.5 space-y-2 text-xs">
                <div class="font-bold text-emerald-900 flex items-center gap-1">
                  <span>3 秒核心法則：</span>
                </div>
                <p class="text-slate-700 font-medium leading-relaxed">
                  ${lesson.beginner.core_rule}
                </p>
                <div class="pt-1.5 border-t border-emerald-100 text-[11px] text-slate-600 space-y-1">
                  <div class="font-bold text-emerald-800">✅ 每日落實：</div>
                  <div class="line-clamp-2">${lesson.beginner.action_checklist.slice(0, 2).map(c => `• ${c}`).join('<br>')}</div>
                </div>
              </div>
            ` : `
              <!-- Advanced View -->
              <div class="bg-indigo-50/50 border border-indigo-100 rounded-xl p-3.5 space-y-2 text-xs">
                <div class="font-bold text-indigo-900 flex items-center gap-1">
                  <span>系統思考架構：</span>
                </div>
                <p class="text-slate-800 font-bold leading-relaxed">
                  ${lesson.advanced.mental_model}
                </p>
                <div class="pt-1.5 border-t border-indigo-100 text-[11px] text-slate-600 line-clamp-2">
                  <span class="font-bold text-indigo-800">🔬 生理機制：</span>
                  ${lesson.advanced.clinical_evidence}
                </div>
              </div>
            `}
          </div>

          <!-- Bottom Action Buttons -->
          <div class="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
            <!-- Open Slide Presentation Button -->
            <button 
              onclick="openSlideForLesson('${lesson.number}')" 
              class="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 text-xs font-bold transition active:scale-95"
              title="全螢幕檢視此講無雜訊顧問簡報"
            >
              <i data-lucide="presentation" class="w-3.5 h-3.5 text-blue-700"></i>
              <span>顧問簡報</span>
            </button>

            <!-- Read Knowledge Detail Button -->
            <button 
              onclick="openLessonDetail('${lesson.id}')" 
              class="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition"
              title="閱讀完整萃取內容"
            >
              <i data-lucide="maximize-2" class="w-3.5 h-3.5"></i>
            </button>
          </div>

        </div>

      </div>
    `;
  });

  container.innerHTML = html;
  lucide.createIcons();
}

function toggleCardTrack(lessonId, track) {
  const lesson = HEALTH_LESSONS.find(l => l.id === lessonId);
  if (lesson) {
    lesson._track = track;
    renderLessonsGrid();
  }
}

function switchGlobalTrack(track) {
  currentGlobalTrack = track;
  HEALTH_LESSONS.forEach(l => l._track = track);
  
  const btnB = document.getElementById('btnAllBeginner');
  const btnA = document.getElementById('btnAllAdvanced');
  if (track === 'beginner') {
    btnB.className = "px-2.5 py-1 rounded-md bg-white text-slate-800 shadow-xs";
    btnA.className = "px-2.5 py-1 rounded-md text-slate-600 hover:text-slate-900";
  } else {
    btnA.className = "px-2.5 py-1 rounded-md bg-white text-slate-800 shadow-xs";
    btnB.className = "px-2.5 py-1 rounded-md text-slate-600 hover:text-slate-900";
  }
  renderLessonsGrid();
}

// -----------------------------------------------------------------------------
// Lesson Detail Modal (Drawer)
// -----------------------------------------------------------------------------
function openLessonDetail(lessonId) {
  const lesson = HEALTH_LESSONS.find(l => l.id === lessonId);
  if (!lesson) return;

  document.getElementById('detailLessonNumber').innerText = `#${lesson.number}`;
  document.getElementById('detailLessonTitle').innerText = lesson.title;
  document.getElementById('detailImage').src = lesson.image_url;
  document.getElementById('detailModuleBadge').innerText = lesson.module_name;

  // Beginner
  document.getElementById('detailBeginnerRule').innerText = lesson.beginner.core_rule;
  document.getElementById('detailBeginnerChecklist').innerHTML = lesson.beginner.action_checklist.map(c => `<li class="flex items-start gap-1.5"><i data-lucide="check" class="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5"></i><span>${c}</span></li>`).join('');
  document.getElementById('detailBeginnerPitfall').innerText = lesson.beginner.pitfall;

  // Advanced
  document.getElementById('detailAdvancedModel').innerText = lesson.advanced.mental_model;
  document.getElementById('detailAdvancedEvidence').innerText = lesson.advanced.clinical_evidence;
  document.getElementById('detailAdvancedMatrix').innerText = lesson.advanced.decision_matrix;

  // Slide button
  document.getElementById('btnDetailOpenSlide').setAttribute('onclick', `closeLessonDetail(); openSlideForLesson('${lesson.number}');`);

  document.getElementById('lessonDetailModal').classList.remove('hidden');
  lucide.createIcons();
}

function closeLessonDetail() {
  document.getElementById('lessonDetailModal').classList.add('hidden');
}

// -----------------------------------------------------------------------------
// Zero-Noise Presentation Engine
// -----------------------------------------------------------------------------
function openPresentation(index = 0) {
  currentSlideIndex = Math.max(0, Math.min(index, ALL_SLIDES.length - 1));
  document.getElementById('presentationModal').classList.remove('hidden');
  renderCurrentSlide();
}

function openSlideForLesson(lessonNumber) {
  const idx = ALL_SLIDES.findIndex(s => s.lesson_number === lessonNumber);
  if (idx !== -1) {
    openPresentation(idx);
  } else {
    openPresentation(0);
  }
}

function closePresentation() {
  document.getElementById('presentationModal').classList.add('hidden');
}

function nextSlide() {
  if (currentSlideIndex < ALL_SLIDES.length - 1) {
    currentSlideIndex++;
    renderCurrentSlide();
  }
}

function prevSlide() {
  if (currentSlideIndex > 0) {
    currentSlideIndex--;
    renderCurrentSlide();
  }
}

function toggleSpeakerNotes() {
  isSpeakerNotesOpen = !isSpeakerNotesOpen;
  const panel = document.getElementById('speakerNotesPanel');
  if (isSpeakerNotesOpen) {
    panel.classList.remove('hidden');
  } else {
    panel.classList.add('hidden');
  }
}

function renderCurrentSlide() {
  const slide = ALL_SLIDES[currentSlideIndex];
  if (!slide) return;

  // Update Top Bar Info
  document.getElementById('slideCategoryBadge').innerText = slide.category || "家庭健康精華導讀";
  document.getElementById('slideArchetypeLabel').innerText = slide.layout_label || "顧問簡報版型";
  document.getElementById('slideStyleBadge').innerText = `${slide.style.toUpperCase()} STYLE`;
  document.getElementById('slideCurrentIndex').innerText = currentSlideIndex + 1;

  // Progress Bar
  const pct = ((currentSlideIndex + 1) / ALL_SLIDES.length) * 100;
  document.getElementById('slideProgressBar').style.width = `${pct}%`;

  // Speaker notes
  const notes = slide.speaker_notes || {};
  document.getElementById('noteConclusion').innerText = notes.conclusion || slide.conclusion_title || "";
  document.getElementById('noteExplanation').innerText = notes.explanation || "";
  document.getElementById('noteTransition').innerText = notes.transition || "";

  // Render Canvas
  const canvas = document.getElementById('slideCanvas');
  
  if (slide.isCover) {
    // Render Cover
    canvas.innerHTML = `
      <div class="flex-1 flex flex-col justify-center max-w-4xl mx-auto py-8">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-900 border border-blue-200 text-xs font-bold w-fit mb-6">
          <i data-lucide="sparkles" class="w-3.5 h-3.5 text-amber-600"></i>
          ZERO-NOISE CONSULTING SYSTEM
        </div>
        <h1 class="text-3xl sm:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight mb-6">
          ${slide.title}
        </h1>
        <p class="text-base sm:text-lg text-slate-600 leading-relaxed mb-8 border-l-4 border-blue-900 pl-4 bg-slate-100/70 p-4 rounded-r-2xl">
          ${slide.subtitle}
        </p>
        <div class="flex items-center gap-3 text-xs text-slate-500 font-mono">
          <span class="px-3 py-1.5 rounded-lg bg-slate-200/80">${slide.footer}</span>
          <span>·</span>
          <span>按鍵盤 [ → ] 開始導讀</span>
        </div>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  // Render Standard Slide
  let evidenceHtml = '';
  const stype = slide.type;

  if (stype === 'one_to_one') {
    evidenceHtml = `
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center flex-1">
        <!-- Big Number Callout -->
        <div class="lg:col-span-4 p-8 rounded-3xl bg-blue-50 border border-blue-100 flex flex-col items-center justify-center text-center">
          <span class="text-5xl sm:text-6xl font-black text-blue-900 tracking-tight mb-2">${slide.kpi_value || '80%'}</span>
          <span class="text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">${slide.kpi_label || '核心指標'}</span>
          <p class="text-xs text-slate-500">${slide.kpi_context || ''}</p>
        </div>
        <!-- Bullets -->
        <div class="lg:col-span-8 space-y-3.5">
          ${(slide.bullets || []).map(b => `
            <div class="p-4 rounded-2xl bg-white border border-slate-200 text-sm font-medium text-slate-800 shadow-xs flex items-start gap-3">
              <i data-lucide="check-circle" class="w-5 h-5 text-blue-600 shrink-0 mt-0.5"></i>
              <span>${b}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } else if (stype === 'parallel' || stype === 'accenture') {
    evidenceHtml = `
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5 flex-1 items-stretch">
        ${(slide.cards || []).map((c, i) => `
          <div class="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between hover:border-blue-400 transition">
            <div>
              <div class="flex items-center justify-between mb-4">
                <span class="font-extrabold text-base text-slate-900">${c.title}</span>
                <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">${c.metric || `要素 ${i+1}`}</span>
              </div>
              <ul class="space-y-2.5 text-xs text-slate-600">
                ${(c.points || []).map(p => `<li class="flex items-start gap-2"><i data-lucide="arrow-right" class="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5"></i><span>${p}</span></li>`).join('')}
              </ul>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  } else if (stype === 'combined_tree' || stype === 'combined') {
    evidenceHtml = `
      <div class="flex-1 flex flex-col justify-center space-y-4">
        <!-- Top Conclusion Banner -->
        <div class="p-4 rounded-2xl bg-blue-900 text-white font-bold text-center text-sm shadow-md">
          ${slide.top_conclusion || '★ 最終結論'}
        </div>
        <div class="flex justify-center text-blue-400">
          <i data-lucide="chevron-up" class="w-6 h-6"></i>
        </div>
        <!-- 2 Pillars -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <h4 class="font-bold text-blue-900 text-sm mb-3 pb-2 border-b border-slate-100">${slide.branch_a_title || '主要素 A'}</h4>
            <ul class="space-y-2 text-xs text-slate-600">
              ${(slide.branch_a_points || []).map(pt => `<li class="flex items-start gap-1.5"><i data-lucide="check" class="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5"></i><span>${pt}</span></li>`).join('')}
            </ul>
          </div>
          <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <h4 class="font-bold text-indigo-900 text-sm mb-3 pb-2 border-b border-slate-100">${slide.branch_b_title || '主要素 B'}</h4>
            <ul class="space-y-2 text-xs text-slate-600">
              ${(slide.branch_b_points || []).map(pt => `<li class="flex items-start gap-1.5"><i data-lucide="check" class="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5"></i><span>${pt}</span></li>`).join('')}
            </ul>
          </div>
        </div>
      </div>
    `;
  } else if (stype === 'chain') {
    evidenceHtml = `
      <div class="flex-1 flex flex-col justify-center">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          ${(slide.steps || []).map((st, i) => `
            <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between relative group hover:border-purple-400 transition">
              <div>
                <span class="text-xs font-mono font-bold text-purple-600 block mb-2">PHASE 0${i+1}</span>
                <h4 class="font-extrabold text-slate-900 text-sm mb-2">${st.title}</h4>
                <p class="text-xs text-slate-600 whitespace-pre-line leading-relaxed">${st.desc}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } else if (stype === 'mckinsey_matrix' || stype === 'mckinsey_flow') {
    evidenceHtml = `
      <div class="flex-1 flex flex-col justify-center overflow-x-auto">
        <table class="w-full text-left text-xs bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs">
          <thead class="bg-blue-900 text-white font-bold">
            <tr>
              ${(slide.col_headers || ['評估維度', '日常標準', '臨床機制', '避險指南']).map(h => `<th class="p-3.5">${h}</th>`).join('')}
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            ${(slide.matrix_rows || []).map(r => `
              <tr class="hover:bg-slate-50 transition">
                <td class="p-3.5 font-bold text-blue-900 bg-blue-50/40">${r.stage}</td>
                <td class="p-3.5 font-semibold text-slate-800">${r.pain}</td>
                <td class="p-3.5 text-slate-600">${r.solution}</td>
                <td class="p-3.5 text-amber-700 bg-amber-50/30">${r.extra || '—'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  } else if (stype === 'opposition') {
    evidenceHtml = `
      <div class="flex-1 flex flex-col justify-center space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div class="p-3 rounded-xl bg-slate-200 text-slate-800 font-bold text-center text-xs">
            ${slide.side_a_title || '傳統錯誤觀念'}
          </div>
          <div class="p-3 rounded-xl bg-emerald-700 text-white font-bold text-center text-xs shadow-xs">
            ${slide.side_b_title || '科學循證做法 ★'}
          </div>
        </div>
        <div class="space-y-2.5">
          ${(slide.dimensions || []).map(d => `
            <div class="grid grid-cols-12 gap-3 items-center bg-white p-3.5 rounded-2xl border border-slate-200 text-xs shadow-2xs">
              <div class="col-span-2 font-bold text-slate-500 text-center">${d.name}</div>
              <div class="col-span-5 text-slate-600 border-l border-slate-200 pl-3">${d.side_a}</div>
              <div class="col-span-5 text-emerald-900 font-semibold border-l-2 border-emerald-500 pl-3 bg-emerald-50/40 p-2 rounded-lg">${d.side_b}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } else if (stype === 'comparison') {
    evidenceHtml = `
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5 flex-1 items-stretch">
        <div class="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h4 class="font-bold text-slate-800 text-sm mb-3 pb-2 border-b border-slate-100">${slide.left_title || '維度 A'}</h4>
            <ul class="space-y-2 text-xs text-slate-600">
              ${(slide.left_points || []).map(p => `<li>${p}</li>`).join('')}
            </ul>
          </div>
        </div>
        <div class="p-5 rounded-3xl bg-amber-50 border-2 border-amber-300 shadow-sm flex flex-col justify-between">
          <div>
            <h4 class="font-extrabold text-amber-900 text-sm mb-3 pb-2 border-b border-amber-200">${slide.common_title || '★ 核心共通點'}</h4>
            <ul class="space-y-2 text-xs text-amber-950 font-medium">
              ${(slide.common_points || []).map(p => `<li>${p}</li>`).join('')}
            </ul>
          </div>
        </div>
        <div class="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h4 class="font-bold text-blue-900 text-sm mb-3 pb-2 border-b border-slate-100">${slide.right_title || '維度 B'}</h4>
            <ul class="space-y-2 text-xs text-slate-600">
              ${(slide.right_points || []).map(p => `<li>${p}</li>`).join('')}
            </ul>
          </div>
        </div>
      </div>
    `;
  } else if (stype === 'bcg_matrix') {
    evidenceHtml = `
      <div class="flex-1 flex flex-col justify-center space-y-2">
        <div class="text-center text-xs text-slate-500 font-mono">${slide.x_axis_label || 'X 軸'}</div>
        <div class="grid grid-cols-2 gap-4">
          ${(slide.quadrants || []).map(q => `
            <div class="p-5 rounded-2xl border ${q.highlight ? 'bg-emerald-50 border-emerald-500 shadow-md ring-2 ring-emerald-500/20' : 'bg-white border-slate-200'}">
              <span class="font-bold text-xs ${q.highlight ? 'text-emerald-900' : 'text-slate-800'} block mb-1.5">${q.title}</span>
              <p class="text-xs text-slate-600 whitespace-pre-line leading-relaxed">${q.desc}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  canvas.innerHTML = `
    <!-- Top Action Title Zone -->
    <div class="mb-6">
      <h2 class="text-xl sm:text-2xl font-black text-slate-900 leading-snug tracking-tight mb-2">
        ${slide.conclusion_title || ''}
      </h2>
      ${slide.subtitle ? `<p class="text-xs sm:text-sm text-slate-500 font-medium">${slide.subtitle}</p>` : ''}
      <div class="h-0.5 bg-slate-200 mt-4 rounded-full"></div>
    </div>

    <!-- Middle Evidence Zone -->
    <div class="flex-1 flex flex-col justify-center my-auto">
      ${evidenceHtml}
    </div>

    <!-- Bottom Footer Source -->
    <div class="mt-6 pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
      <span>${slide.footer || ''}</span>
      <span>家庭健康管理 100 講 · 無雜訊簡報系統</span>
    </div>
  `;

  lucide.createIcons();
}
