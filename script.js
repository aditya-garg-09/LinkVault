const form = document.getElementById('link-form');
const list = document.getElementById('link-list');
const search = document.getElementById('search');

let links = JSON.parse(localStorage.getItem('links') || '[]');

function saveLinks() {
  localStorage.setItem('links', JSON.stringify(links));
}

function render() {
  list.innerHTML = '';
  const query = search.value.toLowerCase();

  links
    .filter(link =>
      link.url.toLowerCase().includes(query) ||
      link.tags.some(tag => tag.toLowerCase().includes(query)) ||
      link.note.toLowerCase().includes(query)
    )
    .forEach((link, index) => {
      const item = document.createElement('div');
      item.innerHTML = `
        <a href="${link.url}" target="_blank">${link.url}</a>
        <p>${link.note}</p>
        <small>Tags: ${link.tags.join(', ')}</small>
        <button onclick="deleteLink(${index})">❌ Delete</button>
      `;
      list.appendChild(item);
    });
}

form.onsubmit = e => {
  e.preventDefault();
  const url = document.getElementById('url').value.trim();
  const tags = document.getElementById('tags').value.split(',').map(t => t.trim());
  const note = document.getElementById('note').value;

  links.push({ url, tags, note, createdAt: Date.now() });
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

render();
