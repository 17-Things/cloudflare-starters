// Small improvements. Every page works without this file.
(() => {
  // ---- Mobile menu ----------------------------------------------------------
  const btn = document.querySelector('.menu-btn');
  const menu = document.querySelector('.main-nav');
  if (btn && menu) {
    const set = (open) => {
      btn.setAttribute('aria-expanded', String(open));
      menu.dataset.open = String(open);
    };
    btn.addEventListener('click', () => set(btn.getAttribute('aria-expanded') !== 'true'));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.dataset.open === 'true') {
        set(false);
        btn.focus();
      }
    });
  }

  // ---- Before and after slider ---------------------------------------------
  // A native range input drives a CSS variable. Keyboard: arrow keys, Home, End.
  document.querySelectorAll('.ba').forEach((ba) => {
    const range = ba.querySelector('.ba-range');
    if (!range) return;
    const [before, after] = [...ba.querySelectorAll('.ba-label')].map((l) => l.textContent).reverse();
    range.hidden = false;
    const update = () => {
      const v = Number(range.value);
      ba.style.setProperty('--pos', `${v}%`);
      range.setAttribute('aria-valuetext', `${v}% ${before}, ${100 - v}% ${after}`);
    };
    range.addEventListener('input', update);
    update();
  });

  // ---- Opening hours: mark today and say if we are open now ----------------
  document.querySelectorAll('table.hours').forEach((table) => {
    const now = new Date();
    const day = now.getDay();
    const mins = now.getHours() * 60 + now.getMinutes();
    const toMins = (t) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3, 5));
    const fmt = (t) => {
      const [h, m] = [Number(t.slice(0, 2)), t.slice(3, 5)];
      return `${h % 12 || 12}${m === '00' ? '' : `:${m}`}${h < 12 ? 'am' : 'pm'}`;
    };
    const rows = [...table.querySelectorAll('tr[data-days]')];
    const covered = new Set(rows.flatMap((r) => r.dataset.days.split(',').map(Number)));
    const closedRow = table.querySelector('.closed-row');
    if (covered.size === 7 && closedRow) closedRow.remove();
    const today = rows.find((r) => r.dataset.days.split(',').map(Number).includes(day));
    (today || closedRow)?.classList.add('is-today');
    const status = table.nextElementSibling;
    if (!status?.classList.contains('open-now')) return;
    const open = today && mins >= toMins(today.dataset.opens) && mins < toMins(today.dataset.closes);
    status.dataset.open = String(Boolean(open));
    status.textContent = open ? `Open now · closes at ${fmt(today.dataset.closes)}` : 'Closed now · leave a message and we will call you back';
    status.hidden = false;
  });

  // ---- Fade-up as sections come into view ----------------------------------
  if ('IntersectionObserver' in window && matchMedia('(prefers-reduced-motion: no-preference)').matches) {
    const items = document.querySelectorAll('.section-head, .service-card, .step-card, .review, .mosaic li, .project-grid, .team li, .areas, .story');
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      }),
      { rootMargin: '0px 0px -8% 0px' }
    );
    items.forEach((el) => {
      if (el.getBoundingClientRect().top > innerHeight) {
        el.classList.add('reveal');
        io.observe(el);
      }
    });
  }

  // ---- Quote form ----------------------------------------------------------
  // Checks each field when you leave it, shows a list of problems on submit,
  // then sends without leaving the page. Without JavaScript the form still posts
  // and the Worker sends the visitor to /contact/thank-you/.
  document.querySelectorAll('form.js-enquiry').forEach((form) => {
    const status = form.querySelector('.form-status');
    const summary = form.querySelector('.error-summary');
    form.elements.page.value = location.pathname;
    form.elements.t.value = String(Date.now());

    // Pre-select the service from links such as /contact/?service=kitchens
    const wanted = new URLSearchParams(location.search).get('service');
    if (wanted) {
      const radio = [...form.querySelectorAll('input[name="type"]')].find((r) => r.dataset.id === wanted);
      if (radio) radio.checked = true;
    }

    const labelOf = (el) => (el.type === 'radio' ? 'the type of job' : form.querySelector(`label[for="${el.id}"]`)?.firstChild.textContent.trim().toLowerCase().replace(/^your /, ""));
    const messageFor = (el) => {
      if (el.type === 'radio') return form.querySelector('input[name="type"]:checked') ? '' : 'Choose what you need help with';
      const v = el.value.trim();
      if (el.required && !v) return el.name === 'message' ? 'Tell us a little about the job' : `Enter your ${labelOf(el)}`;
      if (el.type === 'email' && v && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return 'Enter an email address like name@example.co.uk';
      if (el.type === 'tel' && v && v.replace(/[^\d]/g, '').length < 10) return 'Enter a phone number with at least 10 digits, or leave it empty';
      return '';
    };
    const show = (el, msg) => {
      const holder = el.type === 'radio' ? form.querySelector('#f-type') : el;
      const errorId = el.type === 'radio' ? 'f-type-error' : `${el.id}-error`;
      const error = form.querySelector(`#${errorId}`);
      if (msg) {
        holder.setAttribute('aria-invalid', 'true');
        error.innerHTML = `<span class="visually-hidden">Error: </span>${msg}`;
      } else {
        holder.removeAttribute('aria-invalid');
        error.textContent = '';
      }
      return msg;
    };
    const fields = () => [form.querySelector('input[name="type"]'), ...form.querySelectorAll('.field input, .field textarea')].filter(Boolean);

    // Check a field when the visitor leaves it, and clear the error as soon as it is fixed.
    form.addEventListener('focusout', (e) => {
      const el = e.target;
      if (!el.matches('.field input, .field textarea') || (!el.value.trim() && !el.hasAttribute('aria-invalid'))) return;
      show(el, messageFor(el));
    });
    form.addEventListener('input', (e) => {
      const el = e.target;
      if (el.type === 'radio' || el.getAttribute('aria-invalid') === 'true') {
        if (!messageFor(el)) show(el, '');
      }
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const problems = fields().map((el) => [el, show(el, messageFor(el))]).filter(([, m]) => m);
      if (problems.length) {
        summary.querySelector('ul').innerHTML = problems
          .map(([el, m]) => `<li><a href="#${el.type === 'radio' ? form.querySelector('input[name="type"]').id : el.id}">${m}</a></li>`)
          .join('');
        summary.hidden = false;
        summary.focus();
        return;
      }
      summary.hidden = true;
      const button = form.querySelector('button[type="submit"]');
      button.disabled = true;
      const label = button.textContent;
      button.textContent = 'Sending…';
      status.dataset.state = '';
      status.textContent = '';
      try {
        const res = await fetch(form.action, { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(form) });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.ok) throw new Error(data.error || 'failed');
        document.dispatchEvent(new CustomEvent('site:enquiry-sent', { detail: { type: form.elements.type?.value || '' } }));
        const first = form.elements.name.value.trim().split(/\s+/)[0];
        const promise = form.querySelector('.reply-promise')?.textContent || '';
        const done = document.createElement('div');
        done.className = 'success';
        done.tabIndex = -1;
        done.innerHTML = `<span class="success-mark" aria-hidden="true"><svg viewBox="0 0 20 20" width="30" height="30"><path d="M4 10.5l4 4 8-9" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
          <h2></h2>
          <p class="lede"></p>
          <ol class="next" role="list"><li>We reply and book a time to visit.</li><li>We measure, talk it through and take photos.</li><li>You get drawings and a fixed price.</li></ol>
          <p><a href="/work/">See our recent work while you wait</a></p>`;
        done.querySelector('h2').textContent = `Thanks, ${first}. We have your message.`;
        done.querySelector('.lede').textContent = promise;
        form.replaceWith(done);
        done.focus();
      } catch (err) {
        status.dataset.state = 'error';
        status.textContent = err.message && err.message !== 'failed' ? err.message : 'Sorry, your message did not send. Please try again, or call or email us.';
        button.disabled = false;
        button.textContent = label;
      }
    });
  });
})();
