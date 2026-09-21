/**
 * CedCoss TV Solution - Main Application Logic
 * High-performance interactive UI, dynamic plans, modal triggers, and form handlers
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Year
  const yearElements = document.querySelectorAll('.dynamic-year');
  const currentYear = new Date().getFullYear();
  yearElements.forEach(el => el.textContent = currentYear);

  // 2. Mobile Menu Toggle
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking outside or on a link
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target) && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // 3. Render Subscription Plans
  const plansContainer = document.getElementById('plansGrid');
  const activeConfig = (typeof CEDCOSS_CONFIG !== 'undefined') ? CEDCOSS_CONFIG : null;
  if (plansContainer && activeConfig) {
    renderPlansGrid(activeConfig.plans, plansContainer);
  }

  // 4. Modal Management & Lead Capture
  setupPlanModal();

  // 5. Setup FAQ Accordion
  setupFaqAccordion();

  // 6. Setup Assistance Contact Form
  setupSupportForm();
});

/**
 * Dynamically renders the subscription plans into the specified container
 */
function renderPlansGrid(plans, container) {
  if (!plans || plans.length === 0) {
    container.innerHTML = '<p class="text-center" style="grid-column: 1/-1;">No plans currently available. Please check back shortly.</p>';
    return;
  }

  container.innerHTML = '';
  const activeConfig = (typeof CEDCOSS_CONFIG !== 'undefined') ? CEDCOSS_CONFIG : {};
  const currency = activeConfig.currency || '$';

  plans.forEach(plan => {
    const card = document.createElement('div');
    card.className = `plan-card ${plan.popular ? 'popular' : ''}`;
    card.setAttribute('data-plan-id', plan.id);

    // Feature items list
    const featuresHtml = plan.features.map(f => `
      <li>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        ${escapeHtml(f)}
      </li>
    `).join('');

    // Flash deal timer tag if available
    const timerHtml = plan.dealEndsAt ? `
      <div class="plan-deal-timer" data-deal-ends="${plan.dealEndsAt}">
        <span>⏳ Flash Sale:</span>
        <span class="timer-countdown">Calculating...</span>
      </div>
    ` : '';

    // Original discount price if available
    const originalPriceHtml = (plan.originalPrice && plan.originalPrice > plan.price) ? `
      <span class="plan-original-price">${currency}${plan.originalPrice.toFixed(2)}</span>
    ` : '';

    card.innerHTML = `
      ${plan.popular ? '<span class="plan-badge-popular">Most Popular</span>' : ''}
      ${timerHtml}
      <div class="plan-header">
        <h3>${escapeHtml(plan.name)}</h3>
        <p class="plan-tagline">${escapeHtml(plan.tagline || '')}</p>
      </div>

      <div class="plan-price-wrap">
        <span class="plan-price">${currency}${plan.price.toFixed(2)}</span>
        ${originalPriceHtml}
      </div>
      <p class="plan-duration-note">One-time payment for ${escapeHtml(plan.durationLabel)}</p>

      <ul class="plan-features-list">
        ${featuresHtml}
      </ul>

      <a href="contact.html?plan=${encodeURIComponent(plan.name)}" class="btn ${plan.popular ? 'btn-primary' : 'btn-outline'} btn-block select-plan-btn" data-plan-id="${plan.id}">
        Select ${escapeHtml(plan.name)}
      </a>
    `;

    // Button event listener
    const selectBtn = card.querySelector('.select-plan-btn');
    if (selectBtn) {
      selectBtn.addEventListener('click', (e) => {
        e.preventDefault();
        redirectToContact(plan);
      });
    }

    container.appendChild(card);
  });

  // Start live timers for flash sales
  startDealTimers();
}

/**
 * Live countdown timer loop for limited-time plan deals
 */
function startDealTimers() {
  const timerElements = document.querySelectorAll('[data-deal-ends]');
  if (!timerElements.length) return;

  function updateTimers() {
    const now = Date.now();

    timerElements.forEach(el => {
      const endTime = new Date(el.getAttribute('data-deal-ends')).getTime();
      const diff = endTime - now;

      if (diff <= 0) {
        el.style.display = 'none';
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const formatted = `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
      const countdownSpan = el.querySelector('.timer-countdown');
      if (countdownSpan) {
        countdownSpan.textContent = formatted;
      }
    });
  }

  updateTimers();
  setInterval(updateTimers, 1000);
}

/**
 * Plan activation modal setup
 */
let currentSelectedPlan = null;

function setupPlanModal() {
  const modalOverlay = document.getElementById('planModalOverlay');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const closeSuccessBtn = document.getElementById('closeSuccessBtn');
  const planForm = document.getElementById('planSubscriptionForm');

  if (!modalOverlay) return;

  function closeModal() {
    modalOverlay.hidden = true;
    document.body.style.overflow = '';
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (closeSuccessBtn) closeSuccessBtn.addEventListener('click', closeModal);

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modalOverlay.hidden) closeModal();
  });

  // Handle plan submission
  if (planForm) {
    planForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handlePlanSubmission(planForm);
    });
  }
}

function openPlanModal(plan) {
  redirectToContact(plan);
}

function redirectToContact(plan) {
  const planName = (plan && plan.name) ? plan.name : (plan && plan.id) ? plan.id : (typeof plan === 'string' ? plan : '');
  window.location.href = 'contact.html' + (planName ? '?plan=' + encodeURIComponent(planName) : '');
}

/**
 * Processes plan activation request and simulates instant confirmation
 */
function handlePlanSubmission(form) {
  const errorAlert = document.getElementById('modalFormError');
  const submitBtn = document.getElementById('subSubmitBtn');
  const formView = document.getElementById('modalFormView');
  const successView = document.getElementById('modalSuccessView');
  const successDetails = document.getElementById('successDetails');

  const fullName = document.getElementById('subName') ? document.getElementById('subName').value.trim() : '';
  const email = document.getElementById('subEmail') ? document.getElementById('subEmail').value.trim() : '';
  const device = document.getElementById('subDevice') ? document.getElementById('subDevice').value : 'device';

  if (!fullName || !email) {
    if (errorAlert) {
      errorAlert.textContent = "Please fill in all required contact details.";
      errorAlert.hidden = false;
    }
    return;
  }

  // Visual loading state
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = "Connecting to Setup Concierge...";
  }

  setTimeout(() => {
    // Record in localStorage for client persistence
    const leadRecord = {
      id: "lead_" + Date.now(),
      planId: currentSelectedPlan ? currentSelectedPlan.id : "custom",
      planName: currentSelectedPlan ? currentSelectedPlan.name : "Custom",
      fullName,
      email,
      device,
      createdAt: new Date().toISOString()
    };

    try {
      const stored = JSON.parse(localStorage.getItem('cedcoss_leads') || '[]');
      stored.push(leadRecord);
      localStorage.setItem('cedcoss_leads', JSON.stringify(stored));
    } catch (e) {
      console.warn("Storage warning:", e);
    }

    // Show success view
    if (formView) formView.hidden = true;
    if (successView) successView.hidden = false;
    if (successDetails) {
      successDetails.textContent = `Thank you, ${fullName}! A setup guide and credentials for your ${device || 'device'} have been initiated for ${email}. Our customer assistance team is ready to help you.`;
    }

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = "Complete Activation";
    }
  }, 750);
}

/**
 * Accessible FAQ Accordion Setup
 */
function setupFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other open items
      faqItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('active');
          const otherBtn = other.querySelector('.faq-question');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current
      item.classList.toggle('active', !isActive);
      questionBtn.setAttribute('aria-expanded', !isActive);
    });
  });
}

/**
 * Assistance / Inquiries Form Handler
 */
function setupSupportForm() {
  const supportForm = document.getElementById('supportInquiryForm');
  const supportSuccess = document.getElementById('supportSuccessMsg');
  const supportSubmitBtn = document.getElementById('supportSubmitBtn');

  if (!supportForm) return;

  // Auto-fill form fields if user arrived via plan selection or activation pending
  const urlParams = new URLSearchParams(window.location.search);
  const planParam = urlParams.get('plan');
  const refParam = urlParams.get('ref');
  const codeParam = urlParams.get('code');
  const phoneParam = urlParams.get('phone');

  if (planParam) {
    const subjectField = document.getElementById('contactSubject');
    if (subjectField) {
      subjectField.value = `Subscription Request: ${planParam}`;
    }
    const messageField = document.getElementById('contactMessage');
    if (messageField && !messageField.value) {
      messageField.value = `Hello, I would like to subscribe to the ${planParam}. Please provide me with pass details and setup assistance.`;
    }
  } else if (refParam === 'activation-pending') {
    const subjectField = document.getElementById('contactSubject');
    if (subjectField) {
      subjectField.value = `Activation Verification Required${codeParam ? ' - Code: ' + codeParam : ''}`;
    }
    const messageField = document.getElementById('contactMessage');
    if (messageField && !messageField.value) {
      messageField.value = `Hello, my device activation is pending manual verification.${codeParam ? ' Activation Code: ' + codeParam + '.' : ''}${phoneParam ? ' Contact Number: ' + phoneParam + '.' : ''} Please assist me in completing my device activation.`;
    }
  }

  supportForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (supportSubmitBtn) {
      supportSubmitBtn.disabled = true;
      supportSubmitBtn.textContent = "Sending message...";
    }

    setTimeout(() => {
      if (supportSuccess) supportSuccess.hidden = false;
      supportForm.reset();

      if (supportSubmitBtn) {
        supportSubmitBtn.disabled = false;
        supportSubmitBtn.textContent = "Send Message";
      }
    }, 600);
  });
}

/**
 * Safe HTML escaping utility
 */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
