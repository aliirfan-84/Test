const apiForm = document.getElementById('api-form');
const apiUrlInput = document.getElementById('api-url');
const resultsList = document.getElementById('results');
const statusText = document.getElementById('status');

const defaultUrl = 'https://jsonplaceholder.typicode.com/posts';

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function normalizeItems(data) {
  if (Array.isArray(data)) {
    return data;
  }

  if (data && typeof data === 'object') {
    if (Array.isArray(data.items)) return data.items;
    if (Array.isArray(data.results)) return data.results;
  }

  return [];
}

function renderItems(items) {
  resultsList.innerHTML = '';

  if (!items.length) {
    resultsList.innerHTML = '<li>No items found.</li>';
    return;
  }

  items.forEach((item) => {
    const li = document.createElement('li');
    const title = item.title || item.name || item.id || 'Untitled item';
    const description = item.body || item.description || item.message || '';

    li.innerHTML = `<strong>${escapeHtml(title)}</strong>${escapeHtml(description)}`;
    resultsList.appendChild(li);
  });
}

async function loadData(url) {
  statusText.textContent = 'Loading data...';

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();
    const items = normalizeItems(data);

    renderItems(items);
    statusText.textContent = `Loaded ${items.length} item${items.length === 1 ? '' : 's'}.`;
  } catch (error) {
    console.error(error);
    resultsList.innerHTML = '<li>Unable to load data from that endpoint.</li>';
    statusText.textContent = `Error: ${error.message}`;
  }
}

apiForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const url = apiUrlInput.value.trim() || defaultUrl;
  loadData(url);
});

loadData(defaultUrl);
