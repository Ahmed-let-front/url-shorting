const elements = {
  shortenForm: document.getElementById('shorten-form'),
  urlInput: document.getElementById('urlInput'),
  btnSubmitShortForm: document.getElementById('btn-submit-short-form'),
  errorMsg: document.getElementById('error-msg'),
  shortlLinkEl: document.getElementById('short-link'),
  originalLinkEl: document.getElementById('original-link'),
  shortenedLinksContainer: document.getElementById('shortened-links-container'),
  notificationsList: document.getElementById('notifications-list'),
  copyBtn: document.getElementById('copyBtn'),
  fakeLinkDialog: document.getElementById('fake-link-dialog'),
  allObservElements: document.querySelectorAll('.before-observer-up'),
};

const config = {
  TIMEOUT_SEC: 10,
  API_KEY_SHORTING:
    '3VJyfigaZiEGNJmTwE53AtU23exrvl66xXYY1lWIKK0PolOQCfrRPOT5wKo6',
  API_URL_SHORTING: 'https://api.t.ly/api/v1/link/shorten',
};

const state = {
  shortUrl: '',
  originalURL: '',
};

const timeout = s => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(
        new Error(`Operation failed due to a timeout delay of ${s} seconds.`),
      );
    }, 1000 * s);
  });
};
const AJAX = async (apiUrl, longURL) => {
  const fetchPro = longURL
    ? fetch(apiUrl, {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          authorization: `Bearer ${config.API_KEY_SHORTING}`,
        },
        body: JSON.stringify({
          long_url: longURL,
        }),
      })
    : fetch(apiUrl);
  const res = await Promise.race([fetchPro, timeout(config.TIMEOUT_SEC)]);
  if (!res.ok) throw new Error('Something Went Error');
  const data = await res.json();
  return data;
};
const handleObservervUp = () => {
  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.2,
  };
  const callBack = (entries, observ) => {
    entries.forEach(entry => {
      if (!entry.intersectionRatio) return;
      const targetEl = entry.target;
      targetEl.classList.add('opacity-100', 'translate-y-0');
      observ.unobserve(targetEl);
    });
  };
  const observer = new IntersectionObserver(callBack, options);
  elements.allObservElements.forEach(el => observer.observe(el));
};
const checkValidData = () => {
  if (!elements.urlInput.value.trim() || !elements.urlInput.checkValidity()) {
    elements.urlInput.setAttribute('aria-invalid', true);
    elements.errorMsg.setAttribute('aria-hidden', false);
    return false;
  } else {
    elements.errorMsg.setAttribute('aria-hidden', true);
    elements.urlInput.setAttribute('aria-invalid', false);
    return true;
  }
};
const showSpinner = () => {
  const markup = `
    <div
    class="size-5 rounded-full border-4 border-violet border-l-transparent animate-spin"
    ></div>
    `;
  elements.btnSubmitShortForm.innerHTML = markup;
};
const hiddenSpinner = () => {
  elements.btnSubmitShortForm.innerHTML = 'Shorten It!';
};
const shortenUrl = async longURL => {
  showSpinner();
  const data = await AJAX(config.API_URL_SHORTING, longURL);
  const shortUrlFromData = data.short_url;
  const originalUrlFromData = data.long_url;
  state.shortUrl = shortUrlFromData;
  state.originalURL = originalUrlFromData;
};
const hiddenShortURLContainer = () => {
  elements.shortenedLinksContainer.inert = true;
};
const showShortURLContainer = () => {
  elements.shortenedLinksContainer.inert = false;
};
const updateShortUrlEl = () => {
  showShortURLContainer();
  elements.shortlLinkEl.textContent = state.shortUrl;
  elements.originalLinkEl.textContent = state.originalURL;
  elements.shortlLinkEl.href = state.shortUrl;
  elements.originalLinkEl.href = state.originalURL;
};
const clearInput = () => {
  elements.urlInput.value = '';
};
const showPopup = (sign, msg) => {
  const li = document.createElement('li');
  li.setAttribute('role', 'status');
  li.className =
    'bg-midnight text-white text-[0.7rem] md:text-sm px-6 py-3 rounded-lg shadow-xl flex items-center gap-3 border-l-4 border-cyan transform  starting:translate-x-30 starting:opacity-0 transition-all duration-500 translate-x-0 opacity-100 transition-discrete';
  li.innerHTML = `
    <span>${sign}</span>
    <p class="font-medium">${msg}</p>
  `;
  elements.notificationsList.append(li);
  closePopup(li);
};
const closePopup = liEl => {
  setTimeout(() => {
    liEl.classList.remove('translate-x-0', 'opacity-100');
    liEl.classList.add('translate-x-30', 'opacity-0');
    setTimeout(() => {
      liEl.remove();
    }, 500);
  }, 4500);
};
const handleShortenForm = async () => {
  elements.shortenForm.addEventListener('submit', async e => {
    e.preventDefault();
    if (!checkValidData()) return;
    hiddenShortURLContainer();
    try {
      const longURL = e.currentTarget.querySelector('input').value;
      await shortenUrl(longURL);
      clearInput();
      updateShortUrlEl();
      showPopup('✔', 'URL shortening operation completed');
    } catch (err) {
      showPopup('✖', err.message);
    } finally {
      hiddenSpinner();
    }
  });
};
const copyToClipboard = async textToCopy => {
  if (!textToCopy) {
    showPopup('✖', 'No URL to copy!');
    return;
  }
  try {
    await navigator.clipboard.writeText(textToCopy);
    showPopup('✔', 'Copied to clipboard!');
  } catch (err) {
    showPopup('✖', err.message);
  }
};
const handleCopyBtn = () => {
  elements.copyBtn.addEventListener('click', () =>
    copyToClipboard(state.shortUrl),
  );
};
const handleDialogFakeLink = () => {
  document.addEventListener('click', e => {
    const btn = e.target.closest('.demo-btn');
    if (!btn) return;
    e.preventDefault();
    elements.fakeLinkDialog.showPopover();
  });
};
const init = () => {
  handleObservervUp();
  handleCopyBtn();
  handleShortenForm();
  handleDialogFakeLink();
};
init();
