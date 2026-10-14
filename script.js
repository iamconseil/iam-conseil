/* ============================================
   IAM CONSEIL – JavaScript principal
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ---- Navbar scroll shadow ---- */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', function () {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  /* ---- Mobile nav toggle ---- */
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');

  navToggle.addEventListener('click', function () {
    navLinks.classList.toggle('open');
  });

  // Fermer le menu mobile en cliquant sur un lien
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
    });
  });

  /* ---- Smooth scroll pour les ancres ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80; // hauteur de la nav
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ---- Animation d'apparition au scroll ---- */
  const animatedElements = document.querySelectorAll(
    '.offre-card, .valeur-item, .approche-card, .hero-stats .stat-item'
  );

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity    = '1';
          entry.target.style.transform  = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  animatedElements.forEach(function (el) {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  /* ---- Formulaire de contact (validation côté client) ---- */
  const contactForm = document.getElementById('contactForm');
  const formMsg     = document.getElementById('formMsg');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const prenom  = document.getElementById('prenom').value.trim();
      const nom     = document.getElementById('nom').value.trim();
      const email   = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      // Validation basique
      if (!prenom || !nom || !email || !message) {
        showFormMsg('Veuillez remplir tous les champs obligatoires.', 'error');
        return;
      }
      if (!isValidEmail(email)) {
        showFormMsg('Veuillez saisir une adresse email valide.', 'error');
        return;
      }

      /*
       * CONNEXION À UN SERVICE D'ENVOI DE MAIL
       * ----------------------------------------
       * Option A – Formspree (gratuit, sans backend) :
       *   1. Créez un compte sur https://formspree.io
       *   2. Créez un formulaire et copiez votre ID
       *   3. Remplacez la ligne ci-dessous par :
       *      const formData = new FormData(contactForm);
       *      fetch('https://formspree.io/f/VOTRE_ID', {
       *        method: 'POST', body: formData,
       *        headers: { 'Accept': 'application/json' }
       *      }).then(() => showFormMsg('Message envoyé !', 'success'));
       *
       * Option B – EmailJS (sans serveur) :
       *   Voir guide d'hébergement pour les instructions complètes.
       */

      const formData = new FormData(contactForm);
fetch('<https://formspree.io/f/mgaopenv>', {
  method: 'POST',
  body: formData,
  headers: { 'Accept': 'application/json' }
})
.then(res => res.json())
.then(() => {
  showFormMsg('Merci ! Votre message a bien été envoyé.', 'success');
  contactForm.reset();
})
.catch(() => showFormMsg('Erreur lors de l\'envoi. Réessayez.', 'error'));

      const btn = contactForm.querySelector('.form-submit');
      btn.textContent = 'Envoi en cours…';
      btn.disabled    = true;

      setTimeout(function () {
        showFormMsg('Merci ! Votre message a bien été envoyé. Nous vous répondrons sous 48h.', 'success');
        contactForm.reset();
        btn.textContent = 'Envoyer ma demande →';
        btn.disabled    = false;
      }, 1200);
    });
  }

  function showFormMsg(text, type) {
    formMsg.textContent  = text;
    formMsg.className    = 'form-msg ' + type;
    formMsg.style.display = 'block';
    setTimeout(function () { formMsg.style.display = 'none'; }, 6000);
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

});
