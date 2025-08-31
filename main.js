/* Global JS: nav toggle, active link, scroll reveal, year, BMI, EmailJS, Flatpickr */
(function () {
  // ===== Assignment demo toggle =====
  // Set to true if you want the forms to show "sent" without configuring EmailJS (for demo/assignment screenshots).
  // Set to false (recommended) after adding your real EmailJS keys to actually send emails.
  const ASSIGNMENT_DEMO = false;

  // ===== Nav toggle =====
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('primary-nav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('open');
    });
  }

  // Active nav link
  const page = document.body.getAttribute('data-page');
  if (page) {
    const active = document.querySelector(`a[data-nav="${page}"]`);
    if (active) active.classList.add('active');
  }

  // Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Reveal on scroll
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add('reveal-visible');
    });
  }, { threshold: 0.1 });
  revealEls.forEach((el) => io.observe(el));

  // ===== BMI =====
  const bmiForm = document.getElementById('bmi-form');
  if (bmiForm) {
    bmiForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const weight = parseFloat(document.getElementById('weight').value);
      const heightVal = parseFloat(document.getElementById('height').value);
      const unit = document.getElementById('heightUnit').value;
      const wErr = document.getElementById('weightErr');
      const hErr = document.getElementById('heightErr');
      wErr.textContent = '';
      hErr.textContent = '';

      if (!weight || weight <= 0) { wErr.textContent = 'Please enter valid weight.'; return; }
      if (!heightVal || heightVal <= 0) { hErr.textContent = 'Please enter valid height.'; return; }

      const heightM = unit === 'cm' ? heightVal / 100 : heightVal;
      const bmi = weight / (heightM * heightM);
      const bmif = Math.round(bmi * 10) / 10;
      let cat = '', pill = 'normal';
      if (bmif < 18.5) { cat = 'Underweight'; pill = 'under'; }
      else if (bmif < 25) { cat = 'Normal'; pill = 'normal'; }
      else if (bmif < 30) { cat = 'Overweight'; pill = 'over'; }
      else { cat = 'Obese'; pill = 'obese'; }

      const out = document.getElementById('bmi-result');
      out.innerHTML = `Your BMI is <strong>${bmif}</strong> — <span class="pill ${pill}">${cat}</span>`;
    });
  }

  // ===== Calendar (Flatpickr) =====
  const dateInput = document.getElementById('date');
  if (dateInput && window.flatpickr) {
    flatpickr('#date', {
      minDate: 'today',
      dateFormat: 'd/m/Y',
      disableMobile: true
    });
  }

  // ===== EmailJS (Contact + Appointment) =====
  // Replace placeholders for real sending:
  const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY";
  const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID";
  const EMAILJS_TEMPLATE_ID_APPT = "YOUR_TEMPLATE_ID_APPOINTMENT";
  const EMAILJS_TEMPLATE_ID_CONTACT = "YOUR_TEMPLATE_ID_CONTACT";

  if (!ASSIGNMENT_DEMO && window.emailjs && EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY") {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  }

  // Appointment form
  const apptForm = document.getElementById('appointment-form');
  if (apptForm) {
    apptForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('name');
      const email = document.getElementById('email');
      const phone = document.getElementById('phone');
      const date = document.getElementById('date');
      const message = document.getElementById('message');

      let valid = true;
      const setErr = (id, msg) => { const el = document.getElementById(id); if (el) el.textContent = msg; };
      ['nameErr','emailErr','phoneErr','dateErr'].forEach(id => setErr(id,''));

      if (!name.value.trim()) { setErr('nameErr','Required'); valid = false; }
      if (!email.value.includes('@')) { setErr('emailErr','Valid email required'); valid = false; }
      if (!phone.value.trim()) { setErr('phoneErr','Required'); valid = false; }
      if (!date.value.trim()) { setErr('dateErr','Select a date'); valid = false; }
      if (!valid) return;

      const status = document.getElementById('appt-status');

      // DEMO path (no keys required)
      if (ASSIGNMENT_DEMO || !window.emailjs || EMAILJS_PUBLIC_KEY === "YOUR_PUBLIC_KEY") {
        status.textContent = 'Request sent!';
        apptForm.reset();
        return;
      }

      // Real sending
      try {
        status.textContent = 'Sending...';
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID_APPT, {
          name: name.value,
          email: email.value,
          phone: phone.value,
          preferred_date: date.value,
          message: message.value
        });
        status.textContent = 'Request sent! We will contact you soon.';
        apptForm.reset();
      } catch (err) {
        status.textContent = 'Failed to send. Please try again later.';
        console.error(err);
      }
    });
  }

  // Contact form
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const cname = document.getElementById('cname');
      const cemail = document.getElementById('cemail');
      const cmessage = document.getElementById('cmessage');

      let valid = true;
      const setErr = (id, msg) => { const el = document.getElementById(id); if (el) el.textContent = msg; };
      ['cnameErr','cemailErr','cmessageErr'].forEach(id => setErr(id,''));

      if (!cname.value.trim()) { setErr('cnameErr','Required'); valid = false; }
      if (!cemail.value.includes('@')) { setErr('cemailErr','Valid email required'); valid = false; }
      if (!cmessage.value.trim()) { setErr('cmessageErr','Message can’t be empty'); valid = false; }
      if (!valid) return;

      const status = document.getElementById('contact-status');

      // DEMO path
      if (ASSIGNMENT_DEMO || !window.emailjs || EMAILJS_PUBLIC_KEY === "YOUR_PUBLIC_KEY") {
        status.textContent = 'Thank you!';
        contactForm.reset();
        return;
      }

      // Real sending
      try {
        status.textContent = 'Sending...';
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID_CONTACT, {
          name: cname.value,
          email: cemail.value,
          message: cmessage.value
        });
        status.textContent = 'Thank you! We’ll get back to you shortly.';
        contactForm.reset();
      } catch (err) {
        status.textContent = 'Failed to send. Please try again later.';
        console.error(err);
      }
    });
  }
})();
