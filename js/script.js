function closeAlert() {
  const customAlert = document.getElementById('custom-alert');
  if (customAlert) {
    customAlert.classList.remove('active');
    document.body.classList.remove('modal-open');
    document.body.style.overflow = 'auto';
  }
}
function handleLangChange(e) {
  e.preventDefault();
  e.stopPropagation();
  const targetLang = e.currentTarget.innerText.trim().toUpperCase();
  const fullPath = window.location.pathname;
  let pathName = fullPath.substring(fullPath.lastIndexOf('/') + 1).replace(".html", "");
  if (!pathName || pathName === "") pathName = "index";
  let newPage = "";
  if (targetLang === 'EN') {
    if (!pathName.includes('_en')) {
      newPage = pathName + "_en";
    }
  } else if (targetLang === 'KR') {
    if (pathName.includes('_en')) {
      newPage = pathName.replace("_en", "");
    }
  }
  if (newPage && newPage !== pathName) {
    const basePath = fullPath.substring(0, fullPath.lastIndexOf('/') + 1);
    window.location.href = basePath + newPage + ".html";
  }
}
document.addEventListener('DOMContentLoaded', () => {
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
  const container = document.getElementById('canvas-container');
  if (container) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshNormalMaterial({ wireframe: true });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    camera.position.z = 5;
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth) - 0.5;
      mouseY = (e.clientY / window.innerHeight) - 0.5;
      if (!isTouchDevice) {
        gsap.to('#cursor-follower', {
          x: e.clientX - 20,
          y: e.clientY - 20,
          duration: 0.6,
          opacity: 1
        });
      }
    });
    if (isTouchDevice) {
      const follower = document.getElementById('cursor-follower');
      if (follower) follower.style.display = 'none';
    }
    function animate() {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.0008;
      cube.rotation.y += 0.0008;
      cube.position.x += (mouseX * 3 - cube.position.x) * 0.02;
      cube.position.y += (-mouseY * 3 - cube.position.y) * 0.02;
      renderer.render(scene, camera);
    }
    animate();
    gsap.to(cube.scale, {
      x: 8, y: 8, z: 8,
      scrollTrigger: { trigger: "body", start: "top top", end: "bottom bottom", scrub: 1.5 }
    });
  }
  window.addEventListener('load', () => {
    const loader = document.getElementById("loader");
    if (loader) {
      const tl = gsap.timeline();
      tl.to(loader, { y: "-100%", opacity: 0, duration: 1.4, ease: "expo.inOut" })
        .to(".mask-item", { y: 0, rotate: 0, duration: 1.2, stagger: 0.1, ease: "power4.out" }, "-=0.8");
      tl.set(loader, { display: "none" });
    }
  });
  const hWrap = document.querySelector(".horizontal-wrap");
  if (hWrap) {
    ScrollTrigger.matchMedia({
      "(min-width: 901px)": function () {
        const horizontalSections = gsap.utils.toArray(".horizontal-panel");
        gsap.to(horizontalSections, {
          xPercent: -100 * (horizontalSections.length - 1),
          ease: "none",
          scrollTrigger: {
            trigger: hWrap,
            pin: true,
            scrub: 1,
            end: () => "+=" + hWrap.offsetWidth,
            invalidateOnRefresh: true
          }
        });
      }
    });
  }
  const currentPath = window.location.pathname.toLowerCase().replace(/\/$/, "").replace(".html", "");
  const menuLinks = document.querySelectorAll('.nav-links a:not(.lang-btn)');
  menuLinks.forEach(link => {
    let linkPath = new URL(link.href).pathname.toLowerCase().replace(/\/$/, "").replace(".html", "");
    const isCurrentRoot = (currentPath === "" || currentPath === "/index" || currentPath === "/index_en");
    const isLinkRoot = (linkPath === "/index" || linkPath === "/index_en");
    const isMatch = (currentPath === linkPath) || (isCurrentRoot && isLinkRoot);
    if (isMatch) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
  const sections = document.querySelectorAll('section');
  sections.forEach((section) => {
    const masks = section.querySelectorAll('.mask-item');
    const boxes = section.querySelectorAll('.info-box');
    if (masks.length > 0) {
      gsap.to(masks, {
        scrollTrigger: { trigger: section, start: "top 85%" },
        y: 0, rotate: 0, duration: 1.2, stagger: 0.1, ease: "power4.out"
      });
    }
    if (boxes.length > 0) {
      gsap.from(boxes, {
        scrollTrigger: { trigger: section, start: "top 80%" },
        opacity: 0, y: 40, duration: 1, stagger: 0.1, ease: "power3.out", clearProps: "all"
      });
    }
  });
  const topBtn = document.getElementById('top-button');
  if (topBtn) {
    window.addEventListener('scroll', () => {
      const isOpen = navMenu.classList.contains('active');
      if (window.scrollY > 150 && !isOpen) {
        topBtn.classList.add('show');
      } else {
        topBtn.classList.remove('show');
      }
    });
    topBtn.addEventListener('click', (e) => {
      e.preventDefault();
      gsap.to(window, { duration: 1, scrollTo: 0, ease: "power4.inOut" });
    });
    topBtn.addEventListener('click', (e) => {
      e.preventDefault();
      gsap.to(window, { duration: 1, scrollTo: 0, ease: "power4.inOut" });
    });
  }
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', (e) => {
      e.preventDefault();
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
      const isOpen = navMenu.classList.contains('active');
      if (topBtn) {
        if (isOpen) {
          topBtn.classList.remove('show');
          topBtn.style.pointerEvents = 'none';
          topBtn.style.opacity = '0';
        } else {
          if (window.scrollY > 150) topBtn.classList.add('show');
          topBtn.style.pointerEvents = 'auto';
          topBtn.style.opacity = '';
        }
      }
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
  }
  const allLangBtns = document.querySelectorAll('.lang-btn');
  allLangBtns.forEach(btn => {
    btn.addEventListener('click', handleLangChange);
  });
  const admissionForm = document.getElementById('admission-form');
  const customAlert = document.getElementById('custom-alert');
  if (admissionForm) {
    admissionForm.addEventListener('submit', function (e) {
      e.preventDefault();
      customAlert.classList.add('active');
      document.body.classList.add('modal-open');
      document.body.style.overflow = 'hidden';
      admissionForm.reset();
    });
  }
});