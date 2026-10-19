const elements = {
  shortenForm: document.getElementById('shorten-form'),
  urlInput: document.getElementById('urlInput'),
  btnSubmitShortForm: document.getElementById('btn-submit-short-form'),
  errorMsg: document.getElementById('error-msg'),
  linksContainer: document.getElementById('links'),
  notificationsList: document.getElementById('notifications-list'),
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
  links: JSON.parse(localStorage.getItem('shortly-links') ?? '[]'),
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
    elements.errorMsg.textContent = 'Please add a valid link';
    elements.urlInput.focus();
    return false;
  } else {
    elements.urlInput.setAttribute('aria-invalid', false);
    elements.errorMsg.textContent = '';
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
  return {
    short: data.short_url,
    original: data.long_url,
  };
};

const renderLinks = () => {
  if (!elements.linksContainer) return;

  const rows = state.links.map(({ original, short }) => {
    const row = document.getElementById('link-row').content.cloneNode(true);
    const origEl = row.querySelector('.link-original');
    const shortEl = row.querySelector('.link-short');

    origEl.textContent = original;
    origEl.href = original;
    origEl.setAttribute('aria-label', `Original link: ${original}`);

    shortEl.textContent = short;
    shortEl.href = short;
    shortEl.setAttribute('aria-label', `Shortened link: ${short}`);

    const copyBtn = row.querySelector('button');
    copyBtn.dataset.url = short;
    return row;
  });

  elements.linksContainer.replaceChildren(...rows);
};
const saveLink = (original, short) => {
  state.links.unshift({ original, short });
  localStorage.setItem('shortly-links', JSON.stringify(state.links));
  renderLinks();
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
    try {
      const longURL = e.currentTarget.querySelector('input').value;
      const { original, short } = await shortenUrl(longURL);
      clearInput();
      saveLink(original, short);
      showPopup('✔', 'URL shortening operation completed');
    } catch (err) {
      showPopup('✖', err.message);
    } finally {
      hiddenSpinner();
    }
  });
};

const copyToClipboard = async (textToCopy, btnEl) => {
  if (!textToCopy) {
    showPopup('✖', 'No URL to copy!');
    return;
  }
  try {
    await navigator.clipboard.writeText(textToCopy);
    btnEl.dataset.copied = 'true';
    btnEl.textContent = 'Copied!';
    showPopup('✔', 'Copied to clipboard!');
  } catch (err) {
    showPopup('✖', err.message);
  }
};

const handleCopyList = () => {
  elements.linksContainer.addEventListener('click', e => {
    const copyBtn = e.target.closest('button[data-url]');
    if (!copyBtn) return;
    copyToClipboard(copyBtn.dataset.url, copyBtn);
  });
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
  renderLinks();
  handleCopyList();
  handleShortenForm();
  handleDialogFakeLink();
};

init();
