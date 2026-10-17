// Dave's Glass — site.js
// 1. Quote form: convert into a real mailto: payload when submitted
// 2. Year in footer
// 3. Header CTAs: phone / email / quote wiring

(function () {
  'use strict';

  // ---- Footer year ----
  function setYear() {
    var y = document.getElementById('year');
    if (y) y.textContent = String(new Date().getFullYear());
  }

  // ---- Quote form: build a clean email body and let the user's mail client send it ----
  function wireQuoteForm() {
    var form = document.getElementById('quoteForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      // If the user has no mail client, the form will fall back to a normal submit.
      // We only intercept to build a tidier body.
      e.preventDefault();
      var name = (form.querySelector('#qf-name') || {}).value || '';
      var phone = (form.querySelector('#qf-phone') || {}).value || '';
      var zip = (form.querySelector('#qf-zip') || {}).value || '';
      var msg = (form.querySelector('#qf-msg') || {}).value || '';

      var subject = 'Quote request from website — ' + (name || 'Website visitor');
      var body = [
        'Hi Dave\'s Glass,',
        '',
        'I\'d like a quote on the following:',
        '',
        msg || '(no message provided)',
        '',
        '---',
        'Name:    ' + (name || '—'),
        'Phone:   ' + (phone || '—'),
        'Zip:     ' + (zip || '—'),
        '',
        'Sent from the davesglassllc.com website contact form.',
      ].join('\n');

      var href = 'mailto:office@davesglassllc.com'
               + '?subject=' + encodeURIComponent(subject)
               + '&body='    + encodeURIComponent(body);

      // Open the user's mail client
      window.location.href = href;

      // Lightweight visual confirmation
      var btn = form.querySelector('.form-submit');
      if (btn) {
        var original = btn.textContent;
        btn.textContent = 'Opening your email app…';
        setTimeout(function () { btn.textContent = original; }, 3500);
      }
    });
  }

  // ---- Init ----
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }
  ready(function () {
    setYear();
    wireQuoteForm();
  });
})();
