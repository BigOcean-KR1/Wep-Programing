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

// 4. Language Toggle Logic (Modified to English Priority UI)
let isEnglish = true; // Default to English as requested
const langToggleBtn = document.getElementById('lang-toggle');
const i18nElements = document.querySelectorAll('.i18n');

langToggleBtn.addEventListener('click', () => {
  isEnglish = !isEnglish;
  langToggleBtn.innerText = isEnglish ? "🇰🇷 KR" : "🇺🇸 EN";
  
  i18nElements.forEach(el => {
    const krText = el.getAttribute('data-kr');
    const enText = el.getAttribute('data-en');
    if (krText && enText) {
      el.innerHTML = isEnglish ? enText : krText;
    }
  });

  // Switch Placeholders
  document.querySelectorAll('.i18n-placeholder').forEach(el => {
    el.placeholder = isEnglish ? el.getAttribute('data-en') : el.getAttribute('data-kr');
  });
  
  if (typeof window.loadPosts === 'function') { window.loadPosts(); }
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
    const posts = JSON.parse(localStorage.getItem('board_posts') || '[]');
    boardList.innerHTML = '';
    
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
        replyHTML = `
          <div class="post-reply">
            <span class="reply-badge">RE:</span> ${post.reply}
          </div>
        `;
      }

      postEl.innerHTML = `
        <div class="post-header">
          <span>${post.name}</span>
          <div class="post-options">
            <span onclick="event.stopPropagation(); replyPost(${post.id})">${isEnglish ? 'Reply' : '답변'}</span>
            <span onclick="event.stopPropagation(); editPost(${post.id})">${isEnglish ? 'Edit' : '수정'}</span>
            <span onclick="event.stopPropagation(); deletePost(${post.id})" class="delete-btn">${isEnglish ? 'Delete' : '삭제'}</span>
          </div>
        </div>
        <div class="post-content">${post.content}</div>
        ${replyHTML}
        <div style="display:flex; justify-content: space-between; margin-top: 1rem; font-size: 0.8rem; color: var(--text-secondary);">
          <span>${post.email}</span>
          <span>${post.date}</span>
        </div>
      `;
      boardList.appendChild(postEl);
    });
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

  submitPostBtn.addEventListener('click', () => {
    const name = msgName.value;
    const email = msgEmail.value;
    const content = msgContent.value;

    if(!name || !email || !content) {
      alert(isEnglish ? "Please fill in all fields." : "모든 항목을 입력해주세요.");
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
