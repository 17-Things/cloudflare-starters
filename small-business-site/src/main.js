// Small improvements. The site works without this file.
(() => {
  // Mobile menu
  const btn = document.querySelector('.menu-btn');
  const menu = document.getElementById('menu');
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

  // Enquiry form: check it, then send it without leaving the page.
  // Without JavaScript the form still posts and the Worker redirects to /contact/thank-you/.
  document.querySelectorAll('form.js-enquiry').forEach((form) => {
    const status = form.querySelector('.form-status');
    form.elements.page.value = location.pathname;
    form.elements.t.value = String(Date.now());
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        const bad = form.querySelector(':invalid');
        status.dataset.state = 'error';
        status.textContent = bad?.type === 'email' && bad.value ? 'Please check your email address.' : 'Please complete the required fields.';
        bad?.focus();
        return;
      }
      const button = form.querySelector('button[type="submit"]');
      button.disabled = true;
      status.dataset.state = '';
      status.textContent = 'Sending…';
      try {
        const res = await fetch(form.action, { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(form) });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.ok) throw new Error(data.error || 'failed');
        document.dispatchEvent(new CustomEvent('site:enquiry-sent', { detail: { type: form.elements.type?.value || '' } }));
        form.reset();
        form.elements.page.value = location.pathname;
        status.dataset.state = 'ok';
        status.textContent = 'Thank you. We have your message and will reply within one working day.';
      } catch (err) {
        status.dataset.state = 'error';
        status.textContent = err.message && err.message !== 'failed' ? err.message : 'Sorry, your message did not send. Please try again, or call or email us.';
      } finally {
        button.disabled = false;
      }
    });
  });
})();
