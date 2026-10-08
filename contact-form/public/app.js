/*
  The small amount of JavaScript on this site. The page and the form work
  without it; this file only makes them nicer.

  1. The spam check (Turnstile)
  2. The contact form: checks each box when you leave it, shows a summary of
     problems, sends without leaving the page, and shows a warm "thank you"
  3. Topic links that fill in the form
  4. The "Open now" badge, worked out from the hours table
  5. The one-breath exercise
  6. The header line and the gentle fade-in of sections

  You should not need to change anything here. The words people see are
  in MESSAGES, just below, if you want to change them.
*/

const MESSAGES = {
  name: 'Enter your name',
  email: 'Enter your email address',
  emailFormat: 'Enter an email address like name@example.com',
  phone: 'Enter a phone number, or leave this box empty',
  message: 'Write a short message',
  spam: 'Please tick the spam check, then send again',
  server: {
    missing: 'Fill in your name, email address and message.',
    email: 'Enter an email address like name@example.com.',
    spam: 'The spam check did not finish. Please try it again.',
    invalid: 'Something went wrong on our side. Please try again, or call instead.',
  },
};

document.documentElement.classList.add('js');

// ---------------------------------------------------------------------------
// 1. Turnstile. The site key comes from the Worker, so you never edit it here.
// ---------------------------------------------------------------------------
let turnstileId = null;
window.onTurnstileLoad = async () => {
  const box = document.getElementById('turnstile');
  if (!box) return;
  try {
    const { siteKey } = await fetch('/api/config').then((r) => r.json());
    turnstileId = window.turnstile.render(box, {
      sitekey: siteKey,
      theme: 'auto',
      // The normal widget is 300px wide. Use the small one on narrow phones.
      size: box.clientWidth < 300 ? 'compact' : 'flexible',
      'response-field-name': 'cf-turnstile-response',
      callback: () => window.clearError?.('turnstile'),
    });
  } catch {
    box.innerHTML = '<p class="hint">The spam check did not load. Please refresh the page, or call instead.</p>';
  }
};

// ---------------------------------------------------------------------------
// 2. The contact form
// ---------------------------------------------------------------------------
const form = document.getElementById('contact-form');

if (form) {
  form.noValidate = true; // We show our own, clearer messages.
  const fields = {
    name: form.elements.name,
    email: form.elements.email,
    phone: form.elements.phone,
    message: form.elements.message,
  };
  const summary = document.getElementById('error-summary');
  const summaryList = document.getElementById('error-summary-list');
  const sendButton = document.getElementById('send');
  const sendLabel = document.getElementById('send-label');
  const status = document.getElementById('form-status');
  const DRAFT_KEY = 'contact-draft';

  const checks = {
    name: (v) => (v.trim() ? '' : MESSAGES.name),
    email: (v) => {
      if (!v.trim()) return MESSAGES.email;
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : MESSAGES.emailFormat;
    },
    phone: (v) => (!v.trim() || /^[0-9+()\-.\s]{7,40}$/.test(v.trim()) ? '' : MESSAGES.phone),
    message: (v) => (v.trim() ? '' : MESSAGES.message),
  };

  // Check a box when the person leaves it, not while they type.
  for (const [key, input] of Object.entries(fields)) {
    input.addEventListener('blur', () => {
      if (input.value === '' && !input.dataset.touched) return;
      showFieldError(key, checks[key](input.value));
    });
    input.addEventListener('input', () => {
      input.dataset.touched = '1';
      // Remove the error as soon as it is fixed.
      if (input.getAttribute('aria-invalid') === 'true' && !checks[key](input.value)) showFieldError(key, '');
      saveDraft();
    });
  }
  form.elements.topic.addEventListener('change', saveDraft);

  // Character counter: appears only near the limit.
  const counter = document.getElementById('message-count');
  const limit = Number(fields.message.getAttribute('maxlength')) || 5000;
  const updateCounter = () => {
    const left = limit - fields.message.value.length;
    const near = left <= 600;
    counter.textContent = near ? `${left.toLocaleString('en-GB')} characters left` : '';
    counter.classList.toggle('is-near', left <= 100);
  };
  fields.message.addEventListener('input', updateCounter);

  // Keep what the person typed if they reload or come back from an error.
  function saveDraft() {
    try {
      const data = { name: fields.name.value, email: fields.email.value, phone: fields.phone.value, topic: form.elements.topic.value, message: fields.message.value };
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(data));
    } catch { /* Storage can be blocked. The form still works. */ }
  }
  function restoreDraft() {
    try {
      const data = JSON.parse(sessionStorage.getItem(DRAFT_KEY) || 'null');
      if (!data) return;
      for (const key of ['name', 'email', 'phone', 'message']) if (data[key] && !fields[key].value) fields[key].value = data[key];
      if (data.topic) form.elements.topic.value = data.topic;
      updateCounter();
    } catch { /* ignore */ }
  }
  function clearDraft() {
    try { sessionStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ }
  }
  restoreDraft();

  function showFieldError(key, text) {
    const input = fields[key];
    const error = document.getElementById(`${key}-error`);
    if (!input || !error) return;
    const ids = new Set((input.getAttribute('aria-describedby') || '').split(' ').filter(Boolean));
    if (text) {
      error.innerHTML = '';
      const hidden = document.createElement('span');
      hidden.className = 'visually-hidden';
      hidden.textContent = 'Error: ';
      error.append(hidden, text);
      error.hidden = false;
      input.setAttribute('aria-invalid', 'true');
      ids.add(error.id);
    } else {
      error.hidden = true;
      error.textContent = '';
      input.removeAttribute('aria-invalid');
      ids.delete(error.id);
    }
    input.setAttribute('aria-describedby', [...ids].join(' '));
  }

  function clearError(key) {
    if (key === 'turnstile') {
      const item = summaryList.querySelector('[data-for="turnstile"]');
      if (item) item.remove();
      if (!summaryList.children.length) summary.hidden = true;
    }
  }
  window.clearError = clearError;

  function showSummary(items) {
    summaryList.innerHTML = '';
    for (const { id, text } of items) {
      const li = document.createElement('li');
      if (id) {
        li.dataset.for = id;
        const a = document.createElement('a');
        a.href = `#${id}`;
        a.textContent = text;
        a.addEventListener('click', (e) => {
          e.preventDefault();
          const target = document.getElementById(id);
          if (target) {
            target.scrollIntoView({ block: 'center' });
            target.focus({ preventScroll: true });
          }
        });
        li.append(a);
      } else {
        li.textContent = text;
      }
      summaryList.append(li);
    }
    summary.hidden = false;
    summary.focus();
  }

  function setSending(on) {
    form.classList.toggle('is-sending', on);
    sendButton.setAttribute('aria-disabled', on ? 'true' : 'false');
    sendLabel.textContent = on ? 'Sending…' : 'Send message';
    status.textContent = on ? 'Sending your message.' : '';
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (form.classList.contains('is-sending')) return;

    const problems = [];
    for (const [key, input] of Object.entries(fields)) {
      const text = checks[key](input.value);
      showFieldError(key, text);
      if (text) problems.push({ id: input.id, text });
    }
    const data = new FormData(form);
    if (!data.get('cf-turnstile-response')) problems.push({ id: 'turnstile', text: MESSAGES.spam });
    if (problems.length) {
      showSummary(problems);
      return;
    }

    summary.hidden = true;
    setSending(true);
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });
      const result = await response.json().catch(() => ({ ok: false, error: 'invalid' }));
      if (result.ok) {
        clearDraft();
        showSuccess(fields.name.value.trim());
        return;
      }
      for (const [key, text] of Object.entries(result.fields || {})) showFieldError(key, text);
      const reason = MESSAGES.server[result.error] || MESSAGES.server.invalid;
      showSummary([{ id: result.error === 'spam' ? 'turnstile' : null, text: reason }]);
    } catch {
      showSummary([{ text: 'Your message did not send. Check your internet connection, then try again.' }]);
    } finally {
      setSending(false);
      // A spam-check token works only once, so get a fresh one.
      if (window.turnstile && turnstileId !== null && document.getElementById('turnstile')) window.turnstile.reset(turnstileId);
    }
  });

  // Replace the form with a warm thank-you, in place.
  function showSuccess(name) {
    const area = document.getElementById('form-area');
    const first = name.split(/\s+/)[0] || '';
    area.innerHTML = `
      <div class="success" tabindex="-1" id="success">
        <svg class="success-mark" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="32" cy="32" r="25"/><path d="m21 33 8 8 15-17"/>
        </svg>
        <h2></h2>
        <p>Your message is safe with me. It can take courage to reach out, so well done for doing it.</p>
        <h3>What happens next</h3>
        <ol>
          <li><span>I read your message myself, usually the same day.</span></li>
          <li><span>I reply within one working day, by email or by phone if you asked.</span></li>
          <li><span>We find a time for a free 20-minute call. There is no pressure to book.</span></li>
        </ol>
        <p>Nothing from me yet? Check your junk folder, or call <a href="tel:+441632960418">01632 960418</a>.</p>
      </div>`;
    area.querySelector('h2').textContent = first ? `Thank you, ${first}.` : 'Thank you.';
    const success = document.getElementById('success');
    success.scrollIntoView({ block: 'start' });
    success.focus({ preventScroll: true });
  }

  // If a browser without this script sent the form and came back with an
  // error, show it here.
  const reason = new URLSearchParams(location.search).get('error');
  if (reason) {
    showSummary([{ id: reason === 'spam' ? 'turnstile' : null, text: MESSAGES.server[reason] || MESSAGES.server.invalid }]);
    history.replaceState(null, '', location.pathname + location.hash);
  }

  // -------------------------------------------------------------------------
  // 3. Topic links fill in "What would you like help with?"
  // -------------------------------------------------------------------------
  document.querySelectorAll('[data-topic]').forEach((link) => {
    link.addEventListener('click', () => {
      const select = form.elements.topic;
      const wanted = link.dataset.topic;
      const match = [...select.options].find((o) => o.value === wanted);
      if (match) select.value = wanted;
      saveDraft();
      setTimeout(() => fields.name.focus({ preventScroll: true }), 50);
    });
  });
}

// ---------------------------------------------------------------------------
// 4. "Open now" badge and today's row, in UK time
// ---------------------------------------------------------------------------
(function openNow() {
  const rows = document.querySelectorAll('tr[data-day]');
  const badge = document.getElementById('open-status');
  if (!rows.length || !badge) return;
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
      .formatToParts(new Date())
      .map((p) => [p.type, p.value]),
  );
  const day = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].indexOf(parts.weekday) + 1;
  const now = `${parts.hour}:${parts.minute}`;
  const toLabel = (t) => {
    const [h, m] = t.split(':').map(Number);
    const hour = h % 12 || 12;
    return `${hour}${m ? `:${String(m).padStart(2, '0')}` : ''}${h < 12 ? 'am' : 'pm'}`;
  };
  let open = false;
  rows.forEach((row) => {
    if (Number(row.dataset.day) !== day) return;
    row.classList.add('is-today');
    const { open: from, close: to } = row.dataset;
    if (from && to && now >= from && now < to) {
      open = true;
      badge.textContent = `Open now, until ${toLabel(to)}`;
    }
  });
  if (!open) badge.textContent = 'Closed now. Leave a message';
  badge.classList.toggle('is-open', open);
  badge.hidden = false;
})();

// ---------------------------------------------------------------------------
// 5. One slow breath: in for 4 seconds, out for 6, three times.
// ---------------------------------------------------------------------------
(function breathe() {
  const dialog = document.getElementById('breathe');
  const openers = document.querySelectorAll('[data-breathe]');
  if (!dialog || !dialog.showModal) return;
  const circle = document.getElementById('breathe-circle');
  const word = document.getElementById('breathe-word');
  let timers = [];
  const stop = () => { timers.forEach(clearTimeout); timers = []; circle.className = 'breathe-circle'; word.textContent = 'Ready'; };
  const run = () => {
    stop();
    let t = 600;
    for (let i = 0; i < 3; i++) {
      timers.push(setTimeout(() => { circle.className = 'breathe-circle is-in'; word.textContent = 'Breathe in'; }, t));
      t += 4000;
      timers.push(setTimeout(() => { circle.className = 'breathe-circle is-out'; word.textContent = 'And out'; }, t));
      t += 6000;
    }
    timers.push(setTimeout(() => { word.textContent = 'Well done'; }, t));
  };
  openers.forEach((b) => {
    b.hidden = false;
    b.addEventListener('click', () => { dialog.showModal(); run(); });
  });
  document.getElementById('breathe-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', stop);
  dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
})();

// ---------------------------------------------------------------------------
// 6. Header line after scrolling, and sections that fade in
// ---------------------------------------------------------------------------
(function polish() {
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
  const reveals = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    reveals.forEach((el) => el.classList.add('is-in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('is-in'); io.unobserve(entry.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  reveals.forEach((el) => io.observe(el));
})();
