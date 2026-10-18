'use strict';
// Progressive enhancement: the photo stays full-bleed without JavaScript.
// Overscan in CSS exceeds the clamped travel so the hero never exposes a gap.
(() => {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const motion = matchMedia('(min-width:769px) and (prefers-reduced-motion:no-preference)');
  let frame = 0;
  function render() {
    frame = 0;
    const top = hero.getBoundingClientRect().top;
    const shift = Math.max(-100, Math.min(100, -top * .2));
    hero.style.setProperty('--hero-shift', `${shift}px`);
  }
  function schedule() {
    if (!frame) frame = requestAnimationFrame(render);
  }
  function configure() {
    window.removeEventListener('scroll', schedule);
    window.removeEventListener('resize', schedule);
    cancelAnimationFrame(frame);
    frame = 0;
    hero.style.removeProperty('--hero-shift');
    if (motion.matches) {
      window.addEventListener('scroll', schedule, { passive: true });
      window.addEventListener('resize', schedule);
      schedule();
    }
  }
  motion.addEventListener('change', configure);
  configure();
})();
// Pure payload builder; the separate launcher makes verification safe (no inquiry sent).
window.buildQuoteDraft = function (form) {
  const data = new FormData(form);
  const value = key => String(data.get(key) || '').trim();
  const subject = 'Quote request — ' + value('name');
  const body = ['Hi Dave’s Glass,', '', value('message'), '', 'Name: ' + value('name'),
    'Phone: ' + value('phone'), 'ZIP: ' + (value('zip') || 'Not provided'), '',
    'Prepared using the Dave’s Glass website.'].join('\n');
  return { body, subject, href: 'mailto:office@davesglassllc.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body) };
};
window.openQuoteEmail = href => { window.location.href = href; };
const form = document.querySelector('#quoteForm');
const draftText = document.querySelector('#draft-text');
const status = document.querySelector('#draft-status');
document.querySelector('.draft-tools').hidden = false;
function updateDraft() {
  const draft = window.buildQuoteDraft(form);
  draftText.value = 'To: office@davesglassllc.com\nSubject: ' + draft.subject + '\n\n' + draft.body;
  return draft;
}
form.addEventListener('input', () => { updateDraft(); status.textContent = ''; });
form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const draft = updateDraft();
  status.textContent = 'Nothing has been sent. Finish sending in your email app, or copy the message below.';
  window.openQuoteEmail(draft.href);
});
document.querySelector('.copy-draft').addEventListener('click', async () => {
  if (!form.reportValidity()) return;
  updateDraft();
  try {
    await navigator.clipboard.writeText(draftText.value);
    status.textContent = 'Message copied. Paste it into your email app. Nothing has been sent.';
  } catch (_) {
    draftText.focus(); draftText.select();
    status.textContent = 'Select and copy the text below, then paste it into your email app. Nothing has been sent.';
  }
});
updateDraft();
// Native image links and details remain useful without JavaScript.
const lightbox = document.querySelector('#lightbox');
let photoTrigger;
if (typeof lightbox.showModal === 'function') {
  document.querySelectorAll('.photo-link').forEach(link => {
    link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      photoTrigger = link;
      const image = link.querySelector('img');
      lightbox.querySelector('img').src = link.getAttribute('href');
      lightbox.querySelector('img').alt = image.alt;
      lightbox.querySelector('figcaption').textContent = image.alt;
      lightbox.showModal();
      lightbox.querySelector('button').focus();
    });
  });
  lightbox.querySelector('button').addEventListener('click', () => lightbox.close());
  lightbox.addEventListener('close', () => photoTrigger?.focus());
  lightbox.addEventListener('click', event => {
    if (event.target !== lightbox) return;
    const box = lightbox.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) lightbox.close();
  });
  lightbox.addEventListener('keydown', event => {
    if (event.key === 'Tab') {
      event.preventDefault();
      lightbox.querySelector('button').focus();
    }
  });
}
