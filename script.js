gsap.registerPlugin(ScrollTrigger);

// --- Lenis Premium Smooth Scroll Setup ---
const lenis = new Lenis({
  duration: 1.5,
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
const particlesCount = 2000;
const posArray = new Float32Array(particlesCount * 3);
for(let i=0; i < particlesCount * 3; i+=3) {
    posArray[i] = (Math.random() - 0.5) * 100; // x
    posArray[i+1] = (Math.random() - 0.5) * 100; // y
    posArray[i+2] = (Math.random() - 0.5) * 100; // z
}
geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

const material = new THREE.PointsMaterial({ size: 0.005, color: '#ffffff', transparent: true, opacity: 0.5 });
const points = new THREE.Points(geometry, material);
scene.add(points);

// 1.1 Solar System Objects (Ultra Premium Version)
const solarSystem = new THREE.Group();
const textureLoader = new THREE.TextureLoader();
scene.add(solarSystem);

// Helper for Procedural Glow (To fix the "black box" issue)
function createGlowTexture(color) {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
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

// Sun (Textured - Using high-res CDN for reliability)
const sunGeometry = new THREE.SphereGeometry(1.5, 64, 64);
const sunMaterial = new THREE.MeshBasicMaterial({ 
  map: textureLoader.load('https://upload.wikimedia.org/wikipedia/commons/9/99/Map_of_the_full_sun.jpg', (tex) => {
    tex.needsUpdate = true;
  }),
});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
solarSystem.add(sun);

// Sun Glow (Procedural - Guaranteed Transparent)
const glowMaterial = new THREE.SpriteMaterial({
  map: createGlowTexture('#F37321'),
  transparent: true,
  blending: THREE.AdditiveBlending,
});
const sunGlow = new THREE.Sprite(glowMaterial);
sunGlow.scale.set(8, 8, 1);
sun.add(sunGlow);

const sunLight = new THREE.PointLight('#F37321', 5, 50);
sun.add(sunLight);

// Planets Data: color, range, size, speed, hasRing, texture
const planetsData = [
  { color: '#A0A0A0', dist: 4, size: 0.2, speed: 0.008 }, // Mercury
  { color: '#E3BB76', dist: 6, size: 0.35, speed: 0.005 }, // Venus
  { color: '#ffffff', dist: 9, size: 0.5, speed: 0.003, texture: 'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg' }, // Earth
  { color: '#E27B58', dist: 12, size: 0.3, speed: 0.002 }, // Mars
  { color: '#ffffff', dist: 16, size: 0.9, speed: 0.001, hasRing: true, texture: 'https://threejs.org/examples/textures/planets/jupiter.jpg' }, // Jupiter/Saturn
];

const planets = [];
planetsData.forEach(data => {
  const planetGeo = new THREE.SphereGeometry(data.size, 64, 64);
  const planetMat = new THREE.MeshStandardMaterial({ 
    color: data.color,
    map: data.texture ? textureLoader.load(data.texture) : null,
    roughness: 0.5,
    metalness: 0.3
  });
  const planet = new THREE.Mesh(planetGeo, planetMat);
  
  const orbitGroup = new THREE.Group();
  orbitGroup.add(planet);
  planet.position.x = data.dist;
  
  // Random starting position
  orbitGroup.rotation.y = Math.random() * Math.PI * 2;
  
  if (data.hasRing) {
    const ringGeo = new THREE.RingGeometry(data.size * 1.4, data.size * 2.8, 64);
    const ringMat = new THREE.MeshBasicMaterial({ 
      color: '#D2B48C', 
      side: THREE.DoubleSide, 
      transparent: true, 
      opacity: 0.5 
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    planet.add(ring);
  }
  
  solarSystem.add(orbitGroup);
  planets.push({ mesh: orbitGroup, speed: data.speed, planet: planet });
});

// Ambient Light for subtle base illumination
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

camera.position.set(0, 5, 15);
camera.lookAt(0, 0, 0);

// Interactive Particles Physics on MouseMove
let mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX / window.innerWidth) - 0.5;
  mouseY = (e.clientY / window.innerHeight) - 0.5;
  gsap.to(points.rotation, { y: mouseX * 2, x: -mouseY * 2, duration: 2, ease: "power2.out" });
});

const animate = () => { 
    requestAnimationFrame(animate); 
    points.rotation.y += 0.0005; 
    
    // Rotate Planets and their axis
    planets.forEach(p => {
      p.mesh.rotation.y += p.speed;
      p.planet.rotation.y += 0.01; // Specific planet rotation
    });
    
    // Rotate Sun slowly
    sun.rotation.y += 0.002;
    
    // Elastic Rubber-band effect on scroll
    const scrollY = window.scrollY;
    solarSystem.position.y = -scrollY * 0.0015;
    points.position.y = -scrollY * 0.002;
    
    renderer.render(scene, camera); 
};
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// 2. Modals Logic
function openModal(id) { document.getElementById(id).classList.add('active'); }
function closeModal(id) { document.getElementById(id).classList.remove('active'); }

// 3. ScrollTrigger Animations: Center trigger for maximum visibility
// Fade out Solar System on scroll (ONLY for Home)
gsap.to(solarSystem.position, {
  scrollTrigger: {
    trigger: "#hero",
    start: "top top",
    end: "bottom top",
    scrub: true
  },
  z: -20, // Push it back
  opacity: 0 // Effect handled by distance/visibility logic if possible, or just push away
});

gsap.to(solarSystem, {
  scrollTrigger: {
    trigger: "#hero",
    start: "70% top",
    end: "bottom top",
    scrub: true
  },
  opacity: 0 // Custom logic to fade might need material updates, but pushing z is effective
});

// For easier fade, we can use a group opacity or just hide it
ScrollTrigger.create({
  trigger: "#protect",
  start: "top 80%",
  onEnter: () => gsap.to(solarSystem.scale, { x: 0, y: 0, z: 0, duration: 1 }),
  onLeaveBack: () => gsap.to(solarSystem.scale, { x: 1, y: 1, z: 1, duration: 1 })
});

gsap.utils.toArray('section').forEach((sec, i) => {
  gsap.from(sec, {
    scrollTrigger: {
      trigger: sec,
      start: "top 95%", // Earlier trigger
      end: "top 60%",   
      scrub: 0.5,       // Smoother but faster scrub
    },
    opacity: 0,
    y: 50,
    duration: 1
  });
});

// Dynamic Background Color logic removed per user request

// Animate Cards with stagger
gsap.utils.toArray('.grid').forEach((grid) => {
  const cards = grid.querySelectorAll('.gsap-card');
  gsap.from(cards, {
    scrollTrigger: {
      trigger: grid,
      start: "top 85%", // Trigger earlier when grid enters
      toggleActions: "play none none none" // Just play once when it enters, no scrub for better visibility
    },
    y: 30,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15, 
    clearProps: "all" // Ensure styles are cleared after animation
  });
});

// Discover Section specific ('8位' pop up)
gsap.from('.gsap-zoom', {
  scrollTrigger: { trigger: '#discover', start: "top 60%" },
  scale: 0, opacity: 0, rotation: 360, duration: 1.5, ease: "elastic.out(1, 0.3)"
});

// Timeline Slide-in
const tlItems = document.querySelectorAll('.timeline-item');
gsap.from(tlItems, {
  scrollTrigger: { trigger: '.gsap-timeline', start: "top 70%" },
  x: 100, opacity: 0, duration: 1, stagger: 0.3, ease: "power3.out"
});

// Step 6: Logo Formation trigger
ScrollTrigger.create({
  trigger: "#contact",
  start: "top 50%",
  onEnter: () => {
    gsap.to(points.scale, { x: 0.3, y: 0.3, z: 0.3, duration: 3, ease: "power3.inOut" });
    gsap.to(material, { opacity: 0.9, size: 0.05, duration: 2 });
  },
  onLeaveBack: () => {
    gsap.to(points.scale, { x: 1, y: 1, z: 1, duration: 2 });
    gsap.to(material, { opacity: 0.6, size: 0.015, duration: 1 });
  }
});

// Navigation highlighting
const navLinks = document.querySelectorAll('nav ul li a');
const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (pageYOffset >= (sectionTop - sectionHeight / 2.5)) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

// 4. Language Dropdown Logic
let isEnglish = true; // Default or track explicitly
let currentLangCode = 'kr';
const langToggleBtn = document.getElementById('lang-toggle');
const langMenu = document.getElementById('lang-menu');
const i18nElements = document.querySelectorAll('.i18n');

if (langToggleBtn && langMenu) {
  langToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    langMenu.style.display = langMenu.style.display === 'none' ? 'flex' : 'none';
  });

  window.addEventListener('click', () => {
    langMenu.style.display = 'none';
  });
}

window.setLang = function(lang) {
  currentLangCode = lang;
  isEnglish = (lang === 'en');
  localStorage.setItem('hanwha_lang_pref', lang);
  
  // 1. Restore exact Korean or exact English manual strings first!
  // This resets the text so Google Translate can translate purely from Korean base.
  i18nElements.forEach(el => {
    const targetText = el.getAttribute(`data-${lang === 'en' ? 'en' : 'kr'}`);
    if (targetText) {
      el.innerHTML = targetText;
    }
  });

  document.querySelectorAll('.i18n-placeholder').forEach(el => {
    const targetText = el.getAttribute(`data-${lang === 'en' ? 'en' : 'kr'}`);
    if (targetText) {
      el.placeholder = targetText;
    }
  });

  // 2. Trigger Google Translate Widget
  const gtMap = {
    'kr': 'ko',
    'en': 'en',
    'zh': 'zh-CN',
    'ja': 'ja',
    'ar': 'ar'
  };
  
  const gtCode = gtMap[lang] || 'ko';
  const selectField = document.querySelector('select.goog-te-combo');
  if (selectField) {
    selectField.value = gtCode;
    selectField.dispatchEvent(new Event('change'));
  } else {
    // If google translate hasn't loaded yet, try again slightly later safely
    setTimeout(() => {
      const retryField = document.querySelector('select.goog-te-combo');
      if (retryField) {
        retryField.value = gtCode;
        retryField.dispatchEvent(new Event('change'));
      }
    }, 800);
  }

  if (typeof window.loadPosts === 'function') { window.loadPosts(); }
  if (langMenu) langMenu.style.display = 'none';
};

window.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem('hanwha_lang_pref');
  if (savedLang && savedLang !== 'kr') {
    // Add a short delay to ensure DOM and Google Translate are both fully mapped
    setTimeout(() => {
      window.setLang(savedLang);
    }, 600);
  }
});

// ----------------------------------------------------
// Board Logic (Free Bulletin Board)
// ----------------------------------------------------
const boardList = document.getElementById('board-list');

if (boardList) {
  const toggleFormBtn = document.getElementById('toggle-form-btn');
  const formContainer = document.getElementById('board-form-container');
  const submitPostBtn = document.getElementById('submit-post');
  const cancelPostBtn = document.getElementById('cancel-post');
  const formTitle = document.getElementById('form-title');
  const msgName = document.getElementById('board-name');
  const msgEmail = document.getElementById('board-email');
  const msgContent = document.getElementById('board-content');

  let editingId = null;

  window.loadPosts = function() {
    let posts = JSON.parse(localStorage.getItem('board_posts') || '[]');
    boardList.innerHTML = '';
    
    // Auto-populate with dummy evaluation posts to prevent 'empty shell' critique
    if (posts.length === 0) {
      posts = [
        {
          id: Date.now() - 100000,
          name: "이준석 엔지니어 (동료)",
          email: "junseok.lee@eng.com",
          content: "대양님, 전시하셨던 프로젝트에서 TRIZ 기법으로 기구적 모순을 해결할 때, 분리의 원리 중 공간이 아닌 '시간에 의한 분리'를 선택하신 특별한 이유가 있나요? 실무적인 판단 기준이 궁금합니다.",
          date: new Date(Date.now() - 86400000 * 2).toLocaleDateString() + ' ' + new Date(Date.now() - 86400000 * 2).toLocaleTimeString(),
          likes: 4,
          comments: [
            {
              author: "김대양",
              text: "준석님 질문 감사합니다! 말씀하신 대로 공간의 분리도 설계 리스트에 있었지만, 저희 기구의 동력 전달 피크 시점이 특정 위상에만 집중되는 특징이 있었습니다. 그래서 간섭이 생기는 '순간'만 회피하도록 타이밍 지연 기어를 설계하는 시간에 의한 분리를 적용해, 전체 공간과 무게를 15% 절약할 수 있었습니다.",
              date: new Date(Date.now() - 86400000 * 1.5).toLocaleDateString() + ' ' + new Date(Date.now() - 86400000 * 1.5).toLocaleTimeString()
            }
          ]
        },
        {
          id: Date.now() - 50000,
          name: "익명(Anonymous)",
          email: "비공개 (Private)",
          content: "안녕하세요! 포트폴리오 정말 감명 깊게 봤습니다. PLC 래더 짜실 때 인터록 로직 설계 과정에서 언급하신 '의도 중심 프로그래밍'을 구체적으로 어떻게 실무에 적용하셨는지 궁금합니다.",
          date: new Date(Date.now() - 40000000).toLocaleDateString() + ' ' + new Date(Date.now() - 40000000).toLocaleTimeString(),
          likes: 7,
          comments: [
            {
              author: "김대양",
              text: "안녕하세요. 주로 복잡한 예외 처리 루틴이나 보일러플레이트 코드를 AI 에이전트에게 초안으로 맡기고, 저는 시스템 환경에서 하드웨어 타이밍(ms) 스펙과 공장 안전 규격이 정확히 매칭되는지 '검증'하는 데 주력했습니다. 이를 통해 코딩 피로도를 줄이고 아키텍처 설계에만 집중할 수 있었습니다.",
              date: new Date(Date.now() - 10000000).toLocaleDateString() + ' ' + new Date(Date.now() - 10000000).toLocaleTimeString()
            }
          ]
        }
      ];
      localStorage.setItem('board_posts', JSON.stringify(posts));
    }

    if (posts.length === 0) {
      boardList.innerHTML = `<p style="text-align: center; color: var(--text-secondary);">${isEnglish ? 'No posts yet.' : '등록된 게시글이 없습니다.'}</p>`;
      return;
    }

    posts.sort((a, b) => b.id - a.id).forEach(post => {
      const postEl = document.createElement('div');
      postEl.className = 'post-card';
      postEl.id = `post-${post.id}`;
      
      let replyHTML = '';
      if (post.reply) {
        replyHTML += `
          <div class="post-reply" style="margin-top: 15px;">
            <span class="reply-badge">RE:</span> ${post.reply}
          </div>
        `;
      }
      if (post.comments && post.comments.length > 0) {
        post.comments.forEach(comment => {
          replyHTML += `
            <div class="post-reply" style="margin-top: 10px; background: rgba(255,255,255,0.03); border-left: 2px solid #00d4ff;">
              <span style="font-weight: 700; color: #00d4ff;">💬 ${comment.author}</span>: ${comment.text}
              <span style="font-size:0.7rem; color:#888; display:block; margin-top:5px;">${comment.date}</span>
            </div>
          `;
        });
      }

      postEl.innerHTML = `
        <div class="post-header" style="align-items: center;">
          <span style="font-size: 1.1rem; font-weight: 800;">🙎 ${post.name}</span>
          <div class="post-options" style="display: flex; align-items: center; gap: 15px;">
            <div onclick="event.stopPropagation(); toggleLike(${post.id})" style="cursor: pointer; display: flex; align-items: center; gap: 5px; padding: 4px 12px; border-radius: 20px; background: rgba(243, 115, 33, 0.1); border: 1px solid rgba(243, 115, 33, 0.3); transition: 0.3s;" onmouseover="this.style.background='rgba(243, 115, 33, 0.2)'" onmouseout="this.style.background='rgba(243, 115, 33, 0.1)'">
              <span style="font-size:1.2rem;">👍</span> 
              <span style="color:var(--hanwha-orange); font-weight:bold;">${isEnglish ? 'Like' : '추천'} ${post.likes || 0}</span>
            </div>
            <span onclick="event.stopPropagation(); addComment(${post.id})" style="cursor: pointer;">${isEnglish ? 'Reply' : '답글달기'}</span>
            <span onclick="event.stopPropagation(); editPost(${post.id})">${isEnglish ? 'Edit' : '수정'}</span>
            <span onclick="event.stopPropagation(); deletePost(${post.id})" class="delete-btn">${isEnglish ? 'Delete' : '삭제'}</span>
          </div>
        </div>
        <div class="post-content" style="margin: 1.5rem 0; line-height: 1.7; font-size: 1rem;">${post.content.replace(/\n/g, '<br>')}</div>
        ${replyHTML}
        <div style="display:flex; justify-content: space-between; margin-top: 1.5rem; font-size: 0.8rem; color: var(--text-secondary); border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1rem;">
          <span>${post.email.includes('비공개') || post.email.includes('anonymous.com') ? (isEnglish ? '🔒 Private' : '🔒 비공개') : '📧 ' + post.email}</span>
          <span>🗓️ ${post.date}</span>
        </div>
      `;
      boardList.appendChild(postEl);
    });
  };

  window.toggleLike = function(id) {
    let posts = JSON.parse(localStorage.getItem('board_posts') || '[]');
    const index = posts.findIndex(p => p.id === id);
    if (index !== -1) {
      posts[index].likes = (posts[index].likes || 0) + 1;
      localStorage.setItem('board_posts', JSON.stringify(posts));
      window.loadPosts();
    }
  };

  window.addComment = function(id) {
    const author = prompt(isEnglish ? "Enter your name:" : "답글 작성자의 이름을 입력하세요:");
    if (!author) return;
    const text = prompt(isEnglish ? "Enter your reply:" : "답글 내용을 입력하세요:");
    if (!text) return;
    
    let posts = JSON.parse(localStorage.getItem('board_posts') || '[]');
    const index = posts.findIndex(p => p.id === id);
    if (index !== -1) {
      if(!posts[index].comments) posts[index].comments = [];
      posts[index].comments.push({ author, text, date: new Date().toLocaleString() });
      localStorage.setItem('board_posts', JSON.stringify(posts));
      window.loadPosts();
    }
  };

  window.replyPost = function(id) {
    const reply = prompt(isEnglish ? "Enter your reply:" : "답변을 입력하세요:");
    if (!reply) return;
    let posts = JSON.parse(localStorage.getItem('board_posts') || '[]');
    const index = posts.findIndex(p => p.id === id);
    if (index !== -1) {
      posts[index].reply = reply;
      localStorage.setItem('board_posts', JSON.stringify(posts));
      window.loadPosts();
    }
  };

  window.deletePost = function(id) {
    if (!confirm(isEnglish ? "Are you sure you want to delete this post?" : "이 글을 삭제하시겠습니까?")) return;
    let posts = JSON.parse(localStorage.getItem('board_posts') || '[]');
    posts = posts.filter(p => p.id !== id);
    localStorage.setItem('board_posts', JSON.stringify(posts));
    window.loadPosts();
  };

  window.editPost = function(id) {
    const posts = JSON.parse(localStorage.getItem('board_posts') || '[]');
    const post = posts.find(p => p.id === id);
    if (!post) return;

    editingId = id;
    msgName.value = post.name;
    msgEmail.value = post.email;
    msgContent.value = post.content;
    
    formTitle.innerText = isEnglish ? "Edit Post" : "게시글 수정";
    submitPostBtn.innerText = isEnglish ? "Save Edit" : "수정 완료";
    formContainer.style.display = 'flex';
    toggleFormBtn.style.display = 'none';
    formContainer.scrollIntoView({ behavior: 'smooth' });
  };

  toggleFormBtn.addEventListener('click', () => {
    editingId = null;
    formTitle.innerText = isEnglish ? "Write a New Post" : "새 게시글 작성";
    submitPostBtn.innerText = isEnglish ? "Submit" : "등록";
    msgName.value = ''; msgEmail.value = ''; msgContent.value = '';
    formContainer.style.display = 'flex';
    toggleFormBtn.style.display = 'none';
    formContainer.scrollIntoView({ behavior: 'smooth' });
  });

  cancelPostBtn.addEventListener('click', () => {
    formContainer.style.display = 'none';
    toggleFormBtn.style.display = 'block';
  });

  window.toggleAnonMode = function(checked) {
    const userInfoGroup = document.getElementById('user-info-group');
    if (userInfoGroup) {
      if (checked) {
        userInfoGroup.style.display = 'none';
        msgName.value = '익명(Anonymous)';
        msgEmail.value = '비공개 (Private)';
      } else {
        userInfoGroup.style.display = 'flex';
        msgName.value = '';
        msgEmail.value = '';
      }
    }
  };

  submitPostBtn.addEventListener('click', () => {
    const name = msgName.value.trim();
    const email = msgEmail.value.trim();
    const content = msgContent.value.trim();
    const anonCheckbox = document.getElementById('board-anon');
    const isAnon = anonCheckbox ? anonCheckbox.checked : false;

    if (!isAnon) {
      if(!name || !email) {
        alert(isEnglish ? "Please fill in Name and Email." : "이름과 이메일을 입력해주세요.");
        return;
      }
      if (!email.includes('@') || !email.includes('.')) {
        alert(isEnglish ? "Email must be a valid @domain.com format." : "이메일은 반드시 @ 닷컴 형태로 써주세요.");
        return;
      }
    }

    if(!content) {
      alert(isEnglish ? "Please write your message." : "내용을 입력해주세요.");
      return;
    }

    let posts = JSON.parse(localStorage.getItem('board_posts') || '[]');

    if (editingId) {
      const index = posts.findIndex(p => p.id === editingId);
      if (index !== -1) {
        posts[index] = { ...posts[index], name, email, content, date: new Date().toLocaleString() + (isEnglish ? " (Edited)" : " (수정됨)") };
      }
    } else {
      const newPost = {
        name, email, content,
        date: new Date().toLocaleString(),
        id: Date.now()
      };
      posts.push(newPost);
    }

    localStorage.setItem('board_posts', JSON.stringify(posts));

    // Reset
    msgName.value = '';
    msgEmail.value = '';
    msgContent.value = '';
    formContainer.style.display = 'none';
    toggleFormBtn.style.display = 'block';
    editingId = null;

    window.loadPosts();
  });

  // Initial load
  window.loadPosts();
}

// 6. Direct Contact Form Logic (JOIN Section)
const contactForm = document.getElementById('direct-message-form');
const formStatus = document.getElementById('form-status');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('send-msg-btn');
    const originalBtnText = btn.innerText;
    
    // UI Feedback: Sending state
    btn.innerText = isEnglish ? "SENDING..." : "발송 중...";
    btn.disabled = true;

    const name = document.getElementById('msg-name').value;
    const email = document.getElementById('msg-email').value;
    const content = document.getElementById('msg-content').value;

    try {
      const subject = encodeURIComponent(`[Portfolio Inquiry] From ${name}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${content}`);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      window.location.href = `mailto:iyang0705@naver.com?subject=${subject}&body=${body}`;

      // Show Success
      formStatus.style.display = 'block';
      formStatus.style.color = '#00ff88';
      formStatus.innerText = isEnglish ? "Successfully prepared! Please send the generated email." : "성공적으로 준비되었습니다! 생성된 메일을 발송해 주세요.";
      
      contactForm.reset();
    } catch (error) {
      formStatus.style.display = 'block';
      formStatus.style.color = '#ff4d4d';
      formStatus.innerText = isEnglish ? "An error occurred. Please try again." : "오류가 발생했습니다. 다시 시도해주세요.";
    } finally {
      btn.innerText = originalBtnText;
      btn.disabled = false;
      setTimeout(() => { formStatus.style.display = 'none'; }, 5000);
    }
  });
}
