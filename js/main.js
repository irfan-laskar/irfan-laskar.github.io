/**
 * Portfolio Interactive Logic & Enhancements
 * Vanilla JavaScript (ES6+)
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initNavbar();
  initTypewriter();
  initProjectFiltering();
  initProjectModal();
  initResumeModal();
  initSkillsObserver();
  initContactForm();
  initClipboardCopy();
  initBackToTop();
});

/* ==========================================================================
   1. Theme Management (Dark / Light Mode)
   ========================================================================== */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (!themeToggleBtn) return;

  const currentTheme = localStorage.getItem('portfolio-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);

  themeToggleBtn.addEventListener('click', () => {
    const activeTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('portfolio-theme', newTheme);
    updateThemeIcon(newTheme);
    showToast(`Switched to ${newTheme} mode`);
  });
}

function updateThemeIcon(theme) {
  const themeIcon = document.querySelector('#theme-toggle i');
  if (!themeIcon) return;
  if (theme === 'light') {
    themeIcon.className = 'fas fa-sun';
  } else {
    themeIcon.className = 'fas fa-moon';
  }
}

/* ==========================================================================
   2. Navbar Scroll Effects, Mobile Menu & ScrollSpy
   ========================================================================== */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const hamburger = document.getElementById('hamburger-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Scroll glass effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // ScrollSpy active link detection
    let scrollPosition = window.scrollY + 180;
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });

  // Mobile menu toggle
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      hamburger.innerHTML = isOpen ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });

    // Close menu when clicking link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        hamburger.innerHTML = '<i class="fas fa-bars"></i>';
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !hamburger.contains(e.target) && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        hamburger.innerHTML = '<i class="fas fa-bars"></i>';
      }
    });
  }
}

/* ==========================================================================
   3. Typewriter Hero Animation
   ========================================================================== */
function initTypewriter() {
  const typewriterElement = document.getElementById('typewriter-text');
  if (!typewriterElement) return;

  const roles = [
    'Full Stack Engineer',
    'UI/UX Architecture Specialist',
    'Cloud & DevOps Engineer',
    'AI Solutions Developer'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 110;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      isDeleting = true;
      typingSpeed = 1800; // Pause at completion
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 400; // Pause before typing new word
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ==========================================================================
   4. Project Category Filtering
   ========================================================================== */
function initProjectFiltering() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category.includes(filterValue)) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   5. Interactive Project Case Study Modal
   ========================================================================== */
const projectData = {
  '1': {
    title: 'Synapse AI — Predictive Analytics & GenAI Platform',
    category: 'Full Stack & AI',
    image: 'assets/images/project-1.jpg',
    description: 'An enterprise analytics command center powered by BigQuery and generative AI intelligence. Features sub-second telemetry visualizer, automated anomaly detection, and natural language query generation.',
    challenge: 'Enterprise users needed to query multi-terabyte datasets without writing complex SQL or waiting for batch BI jobs.',
    solution: 'Engineered an asynchronous streaming pipeline with WebSocket push alerts, edge caching, and automated LLM prompt synthesis for intuitive data exploration.',
    techStack: ['React', 'TypeScript', 'Node.js', 'Google BigQuery', 'Python', 'TailwindCSS'],
    liveDemo: '#',
    github: 'https://github.com/irfan-laskar'
  },
  '2': {
    title: 'CloudOps — Multi-Cluster Kubernetes Topology Monitor',
    category: 'Cloud & DevOps',
    image: 'assets/images/project-2.jpg',
    description: 'An interactive infrastructure visualizer and health monitoring system designed for mission-critical microservice architectures across multi-region clusters.',
    challenge: 'Diagnosing transient pod failures and networking bottlenecks required tedious manual log aggregation across disparate services.',
    solution: 'Designed an interactive node graph with real-time health diagnostics, latency threshold triggers, and automated auto-scaler triggers.',
    techStack: ['JavaScript ES6+', 'Go', 'Docker', 'Kubernetes', 'Prometheus', 'WebSockets'],
    liveDemo: '#',
    github: 'https://github.com/irfan-laskar'
  },
  '3': {
    title: 'Nexus Fintech — Global Multi-Currency Digital Banking',
    category: 'Full Stack & Mobile',
    image: 'assets/images/project-3.jpg',
    description: 'Next-generation financial operations portal featuring instant peer-to-peer asset transfers, crypto wallet tracking, and automated spend categorization.',
    challenge: 'Combining high security standards (2FA, AES-256) with sub-100ms UI responsiveness across both desktop and mobile viewports.',
    solution: 'Implemented client-side optimistic UI updates, biometric authentication workflows, and a responsive glassmorphic design system.',
    techStack: ['Vue.js', 'TailwindCSS', 'Express.js', 'PostgreSQL', 'Stripe API'],
    liveDemo: '#',
    github: 'https://github.com/irfan-laskar'
  }
};

function initProjectModal() {
  const modalBackdrop = document.getElementById('project-modal');
  const closeBtn = document.getElementById('close-project-modal');
  const triggerBtns = document.querySelectorAll('.open-project-modal');

  if (!modalBackdrop || !closeBtn) return;

  function openModal(projectId) {
    const data = projectData[projectId];
    if (!data) return;

    document.getElementById('modal-project-title').textContent = data.title;
    document.getElementById('modal-project-category').textContent = data.category;
    document.getElementById('modal-project-img').src = data.image;
    document.getElementById('modal-project-img').alt = data.title;
    document.getElementById('modal-project-desc').textContent = data.description;
    document.getElementById('modal-project-challenge').textContent = data.challenge;
    document.getElementById('modal-project-solution').textContent = data.solution;

    const stackContainer = document.getElementById('modal-project-stack');
    stackContainer.innerHTML = '';
    data.techStack.forEach(tech => {
      const span = document.createElement('span');
      span.className = 'tech-pill';
      span.textContent = tech;
      stackContainer.appendChild(span);
    });

    document.getElementById('modal-live-link').href = data.liveDemo;
    document.getElementById('modal-github-link').href = data.github;

    modalBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  triggerBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.getAttribute('data-project-id');
      openModal(id);
    });
  });

  closeBtn.addEventListener('click', closeModal);

  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   6. Resume Preview Modal
   ========================================================================== */
function initResumeModal() {
  const resumeModal = document.getElementById('resume-modal');
  const openResumeBtn = document.getElementById('open-resume-btn');
  const closeResumeBtn = document.getElementById('close-resume-modal');
  const printResumeBtn = document.getElementById('print-resume-btn');

  if (!resumeModal || !openResumeBtn) return;

  openResumeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    resumeModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  closeResumeBtn.addEventListener('click', () => {
    resumeModal.classList.remove('active');
    document.body.style.overflow = '';
  });

  resumeModal.addEventListener('click', (e) => {
    if (e.target === resumeModal) {
      resumeModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  if (printResumeBtn) {
    printResumeBtn.addEventListener('click', () => {
      window.print();
    });
  }
}

/* ==========================================================================
   7. Animated Skill Bars on Scroll
   ========================================================================== */
function initSkillsObserver() {
  const skillBars = document.querySelectorAll('.skill-progress');
  if (!skillBars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const targetPercent = bar.getAttribute('data-percent');
        bar.style.width = `${targetPercent}%`;
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.25 });

  skillBars.forEach(bar => observer.observe(bar));
}

/* ==========================================================================
   9. Contact Form Validation & Toast Notification
   ========================================================================== */
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const subjectInput = document.getElementById('contact-subject');
    const messageInput = document.getElementById('contact-message');
    const submitBtn = document.getElementById('contact-submit-btn');

    let isValid = true;

    // Name validation
    if (!nameInput.value.trim()) {
      showError(nameInput, 'Please provide your name');
      isValid = false;
    } else {
      clearError(nameInput);
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
      showError(emailInput, 'Please enter a valid email address');
      isValid = false;
    } else {
      clearError(emailInput);
    }

    // Subject validation
    if (!subjectInput.value.trim()) {
      showError(subjectInput, 'Please enter a subject');
      isValid = false;
    } else {
      clearError(subjectInput);
    }

    // Message validation
    if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
      showError(messageInput, 'Message should be at least 10 characters long');
      isValid = false;
    } else {
      clearError(messageInput);
    }

    if (!isValid) return;

    // Direct mailto dispatch to prine3516@gmail.com
    const recipient = 'prine3516@gmail.com';
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const subject = encodeURIComponent(`Portfolio Inquiry: ${subjectInput.value.trim()} (from ${name})`);
    const body = encodeURIComponent(
      `Hi Prince,\n\n${messageInput.value.trim()}\n\n---\nSender Details:\nName: ${name}\nEmail: ${email}`
    );
    const mailtoUrl = `mailto:${recipient}?subject=${subject}&body=${body}`;

    const originalBtnContent = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Launching Email App...';

    setTimeout(() => {
      window.location.href = mailtoUrl;
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-check"></i> Email Prepared!';
      showToast('Opening your email app to send to prine3516@gmail.com!');
      contactForm.reset();

      setTimeout(() => {
        submitBtn.innerHTML = originalBtnContent;
      }, 3500);
    }, 500);
  });
}

function showError(input, message) {
  const group = input.parentElement;
  let feedback = group.querySelector('.form-feedback');
  if (!feedback) {
    feedback = document.createElement('div');
    feedback.className = 'form-feedback error';
    group.appendChild(feedback);
  }
  feedback.textContent = message;
  feedback.className = 'form-feedback error';
  input.style.borderColor = '#ef4444';
}

function clearError(input) {
  const group = input.parentElement;
  const feedback = group.querySelector('.form-feedback');
  if (feedback) {
    feedback.className = 'form-feedback';
    feedback.textContent = '';
  }
  input.style.borderColor = '';
}

/* ==========================================================================
   10. Interactive Clipboard Copy
   ========================================================================== */
function initClipboardCopy() {
  const copyItems = document.querySelectorAll('[data-copy]');
  copyItems.forEach(item => {
    item.addEventListener('click', () => {
      const textToCopy = item.getAttribute('data-copy');
      if (!textToCopy) return;

      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast(`Copied "${textToCopy}" to clipboard!`);
      }).catch(() => {
        showToast(`Selected: ${textToCopy}`);
      });
    });
  });
}

/* ==========================================================================
   11. Toast Notifications Utility
   ========================================================================== */
function showToast(message) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <i class="fas fa-check-circle toast-icon"></i>
    <span class="toast-msg">${message}</span>
  `;
  container.appendChild(toast);

  // Trigger animation
  setTimeout(() => {
    toast.classList.add('show');
  }, 20);

  // Auto remove
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 400);
  }, 3200);
}

/* ==========================================================================
   12. Back To Top Button
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 450) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
