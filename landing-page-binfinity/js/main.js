/**
 * Pilahki Landing Page JavaScript
 * Handles interactive components: Mobile Menu, Navbar scroll, FAQ accordions, and PilahAI Chat Demo
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // ================= 1. MOBILE MENU TOGGLE =================
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const isExpanded = mobileMenu.classList.contains('hidden');
      if (isExpanded) {
        mobileMenu.classList.remove('hidden');
      } else {
        mobileMenu.classList.add('hidden');
      }
    });

    // Close menu when clicking a navigation link
    mobileNavLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }

  // ================= 2. NAVBAR SCROLL EFFECT =================
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('shadow-md', 'bg-white/95');
      navbar.classList.remove('glass-nav');
    } else {
      navbar.classList.remove('shadow-md', 'bg-white/95');
      navbar.classList.add('glass-nav');
    }
  });

  // ================= 3. FAQ ACCORDION =================
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    item.addEventListener('click', () => {
      const answer = item.querySelector('.faq-answer');
      const icon = item.querySelector('.faq-icon');
      const isOpen = !answer.classList.contains('hidden');

      // Close all other FAQs
      faqItems.forEach((otherItem) => {
        otherItem.querySelector('.faq-answer').classList.add('hidden');
        const otherIcon = otherItem.querySelector('.faq-icon');
        if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
      });

      // Toggle current
      if (!isOpen) {
        answer.classList.remove('hidden');
        if (icon) icon.style.transform = 'rotate(180deg)';
      }
    });
  });
});
