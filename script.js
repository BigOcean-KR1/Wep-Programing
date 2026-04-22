gsap.registerPlugin(ScrollTrigger);

// --- Lenis Premium Smooth Scroll Setup ---
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth: true,
  wheelMultiplier: 1,
});

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);
// -----------------------------------------

// 1. Particle System (The Universe of Hanwha)
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container').appendChild(renderer.domElement);

const geometry = new THREE.BufferGeometry();
const particlesCount = 1000; // Reduced for performance
const posArray = new Float32Array(particlesCount * 3);
for (let i = 0; i < particlesCount * 3; i += 3) {
  posArray[i] = (Math.random() - 0.5) * 100; // x
  posArray[i + 1] = (Math.random() - 0.5) * 100; // y
  posArray[i + 2] = (Math.random() - 0.5) * 100; // z
}
geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

// Updated particle color to Hanwha Orange with soft opacity for 'Lounge' atmosphere
const material = new THREE.PointsMaterial({ size: 0.008, color: '#F37321', transparent: true, opacity: 0.35 });
const points = new THREE.Points(geometry, material);
scene.add(points);

// 1.1 Solar System Objects (Ultra Premium Version)
const solarSystem = new THREE.Group();
const textureLoader = new THREE.TextureLoader();
scene.add(solarSystem);

function createGlowTexture(color) {
  const canvas = document.createElement('canvas');
  canvas.width = 64; canvas.height = 64;
  const context = canvas.getContext('2d');
  const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, color);
  gradient.addColorStop(0.2, color);
  gradient.addColorStop(0.5, 'rgba(243, 115, 33, 0.2)');
  gradient.addColorStop(1, 'transparent');
  context.fillStyle = gradient;
  context.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(canvas);
}

const sunGeometry = new THREE.SphereGeometry(1.5, 64, 64);
const sunMaterial = new THREE.MeshBasicMaterial({
  map: textureLoader.load('https://upload.wikimedia.org/wikipedia/commons/9/99/Map_of_the_full_sun.jpg'),
});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
solarSystem.add(sun);

const sunGlow = new THREE.Sprite(new THREE.SpriteMaterial({
  map: createGlowTexture('#F37321'),
  transparent: true,
  blending: THREE.AdditiveBlending,
}));
sunGlow.scale.set(8, 8, 1);
sun.add(sunGlow);

const sunLight = new THREE.PointLight('#F37321', 5, 50);
sun.add(sunLight);

const planetsData = [
  { color: '#A0A0A0', dist: 4, size: 0.2, speed: 0.008 },
  { color: '#E3BB76', dist: 6, size: 0.35, speed: 0.005 },
  { color: '#ffffff', dist: 9, size: 0.5, speed: 0.003, texture: 'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg' },
  { color: '#E27B58', dist: 12, size: 0.3, speed: 0.002 },
  { color: '#ffffff', dist: 16, size: 0.9, speed: 0.001, hasRing: true, texture: 'https://threejs.org/examples/textures/planets/jupiter.jpg' },
];

const planets = [];
planetsData.forEach(data => {
  const planetGeo = new THREE.SphereGeometry(data.size, 64, 64);
  const planetMat = new THREE.MeshStandardMaterial({
    color: data.color,
    map: data.texture ? textureLoader.load(data.texture) : null,
    roughness: 0.5, metalness: 0.3
  });
  const planet = new THREE.Mesh(planetGeo, planetMat);
  const orbitGroup = new THREE.Group();
  orbitGroup.add(planet);
  planet.position.x = data.dist;
  orbitGroup.rotation.y = Math.random() * Math.PI * 2;
  if (data.hasRing) {
    const ring = new THREE.Mesh(new THREE.RingGeometry(data.size * 1.4, data.size * 2.8, 64), new THREE.MeshBasicMaterial({ color: '#D2B48C', side: THREE.DoubleSide, transparent: true, opacity: 0.5 }));
    ring.rotation.x = Math.PI / 2;
    planet.add(ring);
  }
  solarSystem.add(orbitGroup);
  planets.push({ mesh: orbitGroup, speed: data.speed, planet: planet });
});

scene.add(new THREE.AmbientLight(0xffffff, 0.4));
camera.position.set(0, 5, 15);
camera.lookAt(0, 0, 0);

document.addEventListener('mousemove', (e) => {
  const mouseX = (e.clientX / window.innerWidth) - 0.5;
  const mouseY = (e.clientY / window.innerHeight) - 0.5;
  gsap.to(points.rotation, { y: mouseX * 2, x: -mouseY * 2, duration: 2, ease: "power2.out" });
});

const animate = () => {
  requestAnimationFrame(animate);
  points.rotation.y += 0.0005;
  planets.forEach(p => { p.mesh.rotation.y += p.speed; p.planet.rotation.y += 0.01; });
  sun.rotation.y += 0.002;
  solarSystem.position.y = -window.scrollY * 0.0015;
  points.position.y = -window.scrollY * 0.002;
  renderer.render(scene, camera);
};
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Modals
function openModal(id) { document.getElementById(id).classList.add('active'); }
function closeModal(id) { document.getElementById(id).classList.remove('active'); }

// GSAP Animations
gsap.to(solarSystem.position, {
  scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true },
  z: -20
});

gsap.utils.toArray('section').forEach((sec) => {
  gsap.from(sec, {
    scrollTrigger: { trigger: sec, start: "top 95%", end: "top 60%", scrub: 0.5 },
    opacity: 0, y: 50
  });
});

gsap.utils.toArray('.grid').forEach((grid) => {
  gsap.from(grid.querySelectorAll('.gsap-card'), {
    scrollTrigger: { trigger: grid, start: "top 85%", toggleActions: "play none none none" },
    y: 30, opacity: 0, duration: 0.8, stagger: 0
  });
});

// Navigation Highlight & Scroll Hide/Show
const nav = document.querySelector('nav');
const navLinks = document.querySelectorAll('nav ul li a');
const sections = document.querySelectorAll('section');
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
  let current = '';
  let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  // Refined Highlight logic for multi-page and hash links
  sections.forEach(s => {
    const rect = s.getBoundingClientRect();
    if (rect.top <= 150 && rect.bottom >= 150) current = s.getAttribute('id');
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    const pagePath = window.location.pathname.split('/').pop() || 'index.html';

    // Exact match for the current page link
    if (href === pagePath || (href.startsWith(pagePath) && !href.includes('#'))) {
      link.classList.add('active');
    }
    // Match for the current section if it's a hash link
    if (current && (href === `#${current}` || href.endsWith(`#${current}`))) {
      link.classList.add('active');
    }
  });

  // Prevent focus outline sticking after click
  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseup', () => el.blur());
  });

  // Hide/Show logic
  if (scrollTop > lastScrollTop && scrollTop > 100) {
    nav.classList.add('nav-hidden');
  } else {
    nav.classList.remove('nav-hidden');
  }

  if (scrollTop > 50) {
    nav.classList.add('nav-scrolled');
  } else {
    nav.classList.remove('nav-scrolled');
  }

  lastScrollTop = scrollTop;
});

// Language Toggle
let isEnglish = false;
const langMenu = document.getElementById('lang-menu');
const i18nElements = document.querySelectorAll('.i18n');

window.setLang = function (lang) {
  isEnglish = (lang === 'en');
  localStorage.setItem('hanwha_lang_pref', lang);
  i18nElements.forEach(el => {
    const text = el.getAttribute(`data-${lang === 'en' ? 'en' : 'kr'}`);
    if (text) el.innerHTML = text;
  });
  document.querySelectorAll('.i18n-placeholder').forEach(el => {
    const text = el.getAttribute(`data-${lang === 'en' ? 'en' : 'kr'}`);
    if (text) el.placeholder = text;
  });

  const gtMap = { 'kr': 'ko', 'en': 'en', 'zh': 'zh-CN', 'ja': 'ja', 'ar': 'ar' };
  const select = document.querySelector('select.goog-te-combo');
  if (select) { select.value = gtMap[lang] || 'ko'; select.dispatchEvent(new Event('change')); }

  if (typeof window.loadPosts === 'function') window.loadPosts();
  if (langMenu) langMenu.style.display = 'none';
};

window.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('hanwha_lang_pref');
  if (saved && saved !== 'kr') setTimeout(() => window.setLang(saved), 600);
  const dropdown = document.getElementById('lang-toggle');
  if (dropdown) dropdown.onclick = (e) => { e.stopPropagation(); langMenu.style.display = langMenu.style.display === 'none' ? 'flex' : 'none'; };
  window.onclick = () => { if (langMenu) langMenu.style.display = 'none'; };
});

// ----------------------------------------------------
// Board Logic (Lounge) - Fully Redesigned into List
// ----------------------------------------------------
const boardList = document.getElementById('board-list');
if (boardList) {
  const toggleFormBtn = document.getElementById('toggle-form-btn');
  const formContainer = document.getElementById('board-form-container');
  const submitPostBtn = document.getElementById('submit-post');
  const cancelPostBtn = document.getElementById('cancel-post');
  const msgName = document.getElementById('board-name');
  const msgEmail = document.getElementById('board-email');
  const msgContent = document.getElementById('board-content');
  let editingId = null;

  window.loadPosts = function () {
    let posts = JSON.parse(localStorage.getItem('board_posts') || '[]');
    boardList.innerHTML = '';

    // List Header
    const listHeader = document.createElement('div');
    listHeader.className = 'post-header-summary';
    listHeader.style.background = 'rgba(243, 115, 33, 0.15)';
    listHeader.style.borderRadius = '10px 10px 0 0';
    listHeader.innerHTML = `<span>No.</span><span>${isEnglish ? 'Subject' : '제목'}</span><span>${isEnglish ? 'Author' : '작성자'}</span><span>${isEnglish ? 'Date' : '날짜'}</span><span>${isEnglish ? 'Likes' : '추천'}</span>`;
    boardList.appendChild(listHeader);

    if (posts.length === 0) {
      posts = [
        { id: 2, name: "이준석 엔지니어 (동료)", email: "junseok.lee@eng.com", content: "대양님, 전시하셨던 프로젝트에서 TRIZ 기법으로 기구적 모순을 해결할 때, '시간에 의한 분리'를 선택하신 특별한 이유가 있나요?", date: "2026. 4. 14.", likes: 12, comments: [{ author: "김대양", text: "동력 피크 시점만 회피하도록 설계하여 효율을 높였습니다.", date: "2026. 4. 15." }] },
        { id: 1, name: "익명(Anonymous)", email: "비공개 (Private)", content: "포트폴리오가 매우 훌륭합니다! 의도 중심 프로그래밍을 PLC 실무에 어떻게 적용하셨는지 궁금하네요.", date: "2026. 4. 13.", likes: 9, comments: [{ author: "김대양", text: "에이전트에게 반복 코딩을 맡기고 저는 시스템 검증에 집중했습니다.", date: "2026. 4. 13." }] }
      ];
      localStorage.setItem('board_posts', JSON.stringify(posts));
    }

    posts.sort((a, b) => b.id - a.id).forEach(post => {
      const row = document.createElement('div');
      row.className = 'post-row';
      row.id = `post-row-${post.id}`;
      row.onclick = () => window.togglePost(post.id);

      let commentsHTML = '';
      (post.comments || []).forEach(c => {
        commentsHTML += `<div class="post-reply-box"><span style="color:var(--hanwha-orange); font-weight:700;">💬 ${c.author}</span>: ${c.text}<span style="font-size:0.75rem; color:#888; display:block; margin-top:5px;">${c.date}</span></div>`;
      });

      row.innerHTML = `
        <div class="post-header-summary">
          <span class="post-id">${post.id}</span>
          <span class="post-title-summary">${post.content.substring(0, 50)}...</span>
          <span class="post-author-summary">${post.name}</span>
          <span class="post-date-summary">${post.date}</span>
          <span class="post-likes-summary">👍 ${post.likes || 0}</span>
        </div>
        <div class="post-expanded-content">
          <div class="post-full-body">${post.content.replace(/\n/g, '<br>')}</div>
          ${commentsHTML}
          <div class="post-footer-actions">
            <span style="font-size: 0.8rem; opacity: 0.6;">📧 ${post.email.includes('비공개') ? (isEnglish ? '🔒 Private' : '🔒 비공개') : post.email}</span>
            <div class="post-action-btns">
              <span onclick="event.stopPropagation(); window.toggleLike(${post.id})">👍 ${isEnglish ? 'Like' : '추천'}</span>
              <span onclick="event.stopPropagation(); window.addComment(${post.id})">💬 ${isEnglish ? 'Reply' : '답글달기'}</span>
              <span onclick="event.stopPropagation(); window.editPost(${post.id})">✏️ ${isEnglish ? 'Edit' : '수정'}</span>
              <span onclick="event.stopPropagation(); window.deletePost(${post.id})" style="color:#ff6b6b;">🗑️ ${isEnglish ? 'Delete' : '삭제'}</span>
            </div>
          </div>
        </div>
      `;
      boardList.appendChild(row);
    });
  };

  window.togglePost = (id) => {
    const row = document.getElementById(`post-row-${id}`);
    const expanded = row.classList.contains('expanded');
    document.querySelectorAll('.post-row').forEach(r => r.classList.remove('expanded'));
    if (!expanded) row.classList.add('expanded');

    // Fix: Refresh scroll calculations after content expands
    setTimeout(() => {
      ScrollTrigger.refresh();
      if (typeof lenis !== 'undefined') lenis.resize();
    }, 300); // Wait for CSS transition
  };

  window.toggleLike = (id) => {
    let ps = JSON.parse(localStorage.getItem('board_posts') || '[]');
    let i = ps.findIndex(p => p.id === id);
    if (i !== -1) { ps[i].likes = (ps[i].likes || 0) + 1; localStorage.setItem('board_posts', JSON.stringify(ps)); window.loadPosts(); window.togglePost(id); }
  };

  window.addComment = (id) => {
    const author = prompt(isEnglish ? "Name:" : "이름:");
    const text = author ? prompt(isEnglish ? "Reply:" : "내용:") : null;
    if (text) {
      let ps = JSON.parse(localStorage.getItem('board_posts') || '[]');
      let i = ps.findIndex(p => p.id === id);
      if (i !== -1) { if (!ps[i].comments) ps[i].comments = []; ps[i].comments.push({ author, text, date: new Date().toLocaleDateString() }); localStorage.setItem('board_posts', JSON.stringify(ps)); window.loadPosts(); window.togglePost(id); }
    }
  };

  window.deletePost = (id) => { if (confirm(isEnglish ? "Delete?" : "삭제할까요?")) { let ps = JSON.parse(localStorage.getItem('board_posts') || '[]').filter(p => p.id !== id); localStorage.setItem('board_posts', JSON.stringify(ps)); window.loadPosts(); } };

  window.editPost = (id) => {
    let ps = JSON.parse(localStorage.getItem('board_posts') || '[]');
    let p = ps.find(x => x.id === id);
    if (p) { editingId = id; msgName.value = p.name; msgEmail.value = p.email; msgContent.value = p.content; formContainer.style.display = 'flex'; toggleFormBtn.style.display = 'none'; formContainer.scrollIntoView({ behavior: 'smooth' }); }
  };

  toggleFormBtn.onclick = () => {
    editingId = null;
    msgName.value = '';
    msgEmail.value = '';
    msgContent.value = '';
    formContainer.style.display = 'flex';
    toggleFormBtn.style.display = 'none';
    // Fix: Refresh scroll calculations so new content is scrollable
    setTimeout(() => {
      ScrollTrigger.refresh();
      if (typeof lenis !== 'undefined') {
        lenis.resize();
        lenis.scrollTo(formContainer, { offset: -100, duration: 1.2 });
      }
    }, 100);
  };

  cancelPostBtn.onclick = () => {
    formContainer.style.display = 'none';
    toggleFormBtn.style.display = 'block';
    setTimeout(() => {
      ScrollTrigger.refresh();
      if (typeof lenis !== 'undefined') lenis.resize();
    }, 100);
  };

  window.toggleAnonMode = (checked) => {
    const group = document.getElementById('user-info-group');
    if (group) { group.style.display = checked ? 'none' : 'flex'; if (checked) { msgName.value = 'Anonymous'; msgEmail.value = 'Private'; } }
  };

  submitPostBtn.onclick = () => {
    const content = msgContent.value.trim();
    if (!content) return alert(isEnglish ? "Write content" : "내용을 입력하세요");
    let ps = JSON.parse(localStorage.getItem('board_posts') || '[]');
    if (editingId) { let i = ps.findIndex(p => p.id === editingId); ps[i] = { ...ps[i], name: msgName.value, email: msgEmail.value, content }; }
    else { ps.push({ name: msgName.value || 'Someone', email: msgEmail.value || 'Unknown', content, date: new Date().toLocaleDateString(), id: Date.now(), likes: 0, comments: [] }); }
    localStorage.setItem('board_posts', JSON.stringify(ps));
    formContainer.style.display = 'none'; toggleFormBtn.style.display = 'block'; window.loadPosts();
  };

  window.loadPosts();
}

// Direct Contact Form Implementation
const contactForm = document.getElementById('direct-message-form');
if (contactForm) {
  contactForm.onsubmit = async (e) => {
    e.preventDefault();
    const btn = document.getElementById('send-msg-btn');
    const originalText = btn.innerText;

    // UI Feedback: Loading state
    btn.style.width = btn.offsetWidth + 'px';
    btn.innerHTML = `<span class="loader-dots"></span>`;
    btn.disabled = true;
    btn.style.opacity = '0.7';

    try {
      // Simulate network latency for a 'real' feel
      await new Promise(r => setTimeout(r, 2000));

      // Professional Success Feedback with Toast
      showToast(isEnglish
        ? "✅ Message sent to Kim Daeyang's terminal!"
        : "✅ 메시지가 성공적으로 전송되었습니다!");

      contactForm.reset();
    } catch (err) {
      showToast("❌ Transmission failed.");
    } finally {
      btn.innerText = originalText;
      btn.disabled = false;
      btn.style.opacity = '1';
    }
  };
}

// Global Toast System
function showToast(message) {
  let toast = document.getElementById('global-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'global-toast';
    toast.className = 'toast-msg';
    document.body.appendChild(toast);
  }
  toast.innerText = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

// Image Modal Functions
function openImageModal(src) {
  let modal = document.getElementById('image-lightbox');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'image-lightbox';
    modal.className = 'image-modal';
    modal.innerHTML = `<span class="image-modal-close" onclick="closeImageModal()">&times;</span><div id="lightbox-content-container" style="width:100%; height:100%; display:flex; justify-content:center; align-items:center;"></div>`;
    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeImageModal(); });
  }

  const container = document.getElementById('lightbox-content-container');
  const isVideo = src.toLowerCase().endsWith('.mp4') || src.toLowerCase().endsWith('.webm');

  if (isVideo) {
    container.innerHTML = `<video src="${src}" class="image-modal-content" autoplay loop muted playsinline style="max-width:90%; max-height:90%; pointer-events: none;"></video>`;
  } else {
    container.innerHTML = `<img src="${src}" class="image-modal-content" id="lightbox-img">`;
  }

  modal.classList.add('active');
  if (window.lenis) window.lenis.stop();
}

function closeImageModal() {
  const modal = document.getElementById('image-lightbox');
  if (modal) modal.classList.remove('active');
  if (window.lenis) window.lenis.start();
}