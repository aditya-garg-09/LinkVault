
// DOM elements
const form = document.getElementById('link-form');
const list = document.getElementById('link-list');
const search = document.getElementById('search');
const folderSelect = document.getElementById('folder-select');

// Data
let links = JSON.parse(localStorage.getItem('links') || '[]');
let folders = JSON.parse(localStorage.getItem('folders') || '[]');

function saveLinks() {
  localStorage.setItem('links', JSON.stringify(links));
}
function saveFolders() {
  localStorage.setItem('folders', JSON.stringify(folders));
}

function renderFolders() {
  // Only update folder select
  folderSelect.innerHTML = '';
  folders.forEach((folder, idx) => {
    const option = document.createElement('option');
    option.value = folder.name;
    option.textContent = `${folder.tag === 'red' ? '🔴' : folder.tag === 'yellow' ? '🟡' : '🟢'} ${folder.name}`;
    folderSelect.appendChild(option);
  });
}

function render() {
  list.innerHTML = '';
  const query = search.value.toLowerCase();
  const selectedFolder = folderSelect.value;

  links
    .filter(link =>
      (!selectedFolder || link.folder === selectedFolder) &&
      (
        link.url.toLowerCase().includes(query) ||
        link.tags.some(tag => tag.toLowerCase().includes(query)) ||
        link.note.toLowerCase().includes(query)
      )
    )
    .forEach((link, index) => {
      const item = document.createElement('div');
      item.innerHTML = `
        <a href="${link.url}" target="_blank">${link.url}</a>
        <p>${link.note}</p>
        <small>Tags: ${link.tags.join(', ')}</small>
        <small>Folder: ${link.folder ? link.folder : 'None'}</small>
        <button onclick="deleteLink(${index})">❌ Delete</button>
      `;
      list.appendChild(item);
    });
}

form.onsubmit = e => {
  e.preventDefault();
  const url = document.getElementById('url').value.trim();
  const tags = document.getElementById('tags').value.split(',').map(t => t.trim()).filter(Boolean);
  const note = document.getElementById('note').value;
  const folder = folderSelect.value || '';

  links.push({ url, tags, note, folder, createdAt: Date.now() });
  saveLinks();
  form.reset();
  render();
};


function deleteLink(index) {
  links.splice(index, 1);
  saveLinks();
  render();
}

const toggleTheme = document.getElementById('toggle-theme');

toggleTheme.onclick = () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('darkMode', document.body.classList.contains('dark'));
};

if (localStorage.getItem('darkMode') === 'true') {
  document.body.classList.add('dark');
}

search.oninput = render;
folderSelect.onchange = render;

renderFolders();
render();
