class LinkVault {
  constructor() {
    this.links = JSON.parse(localStorage.getItem('links') || '[]');
    this.folders = JSON.parse(localStorage.getItem('folders') || '[]');
    this.initializeElements();
    this.bindEvents();
    this.render();
  }

  initializeElements() {
    this.form = document.getElementById('link-form');
    this.linkList = document.getElementById('link-list');
    this.searchInput = document.getElementById('search');
    this.folderSelect = document.getElementById('folder-select');
    this.themeToggle = document.getElementById('toggle-theme');
  }

  bindEvents() {
    if (this.form) {
      this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    if (this.searchInput) {
      this.searchInput.addEventListener('input', () => this.render());
    }

    if (this.folderSelect) {
      this.folderSelect.addEventListener('change', () => this.render());
    }

    if (this.themeToggle) {
      this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    this.initializeTheme();
  }

  handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(this.form);
    const url = formData.get('url').trim();
    const tags = formData.get('tags').split(',').map(t => t.trim()).filter(Boolean);
    const note = formData.get('note');
    const folder = formData.get('folder') || '';

    if (!url) return;

    this.addLink({ url, tags, note, folder, createdAt: Date.now() });
    this.form.reset();
  }

  addLink(link) {
    this.links.unshift(link);
    this.saveLinks();
    this.render();
  }

  deleteLink(index) {
    this.links.splice(index, 1);
    this.saveLinks();
    this.render();
  }

  saveLinks() {
    localStorage.setItem('links', JSON.stringify(this.links));
  }

  saveFolders() {
    localStorage.setItem('folders', JSON.stringify(this.folders));
  }

  renderFolders() {
    if (!this.folderSelect) return;

    this.folderSelect.innerHTML = '<option value="">All Folders</option>';
    this.folders.forEach(folder => {
      const option = document.createElement('option');
      option.value = folder.name;
      option.textContent = `${this.getFolderEmoji(folder.tag)} ${folder.name}`;
      this.folderSelect.appendChild(option);
    });
  }

  getFolderEmoji(tag) {
    const emojiMap = { red: '🔴', yellow: '🟡', green: '🟢' };
    return emojiMap[tag] || '📁';
  }

  render() {
    this.renderFolders();

    if (!this.linkList) return;

    const query = this.searchInput?.value?.toLowerCase() || '';
    const selectedFolder = this.folderSelect?.value || '';

    const filteredLinks = this.links.filter(link => {
      const matchesFolder = !selectedFolder || link.folder === selectedFolder;
      const matchesSearch = !query ||
        link.url.toLowerCase().includes(query) ||
        link.tags.some(tag => tag.toLowerCase().includes(query)) ||
        link.note.toLowerCase().includes(query);

      return matchesFolder && matchesSearch;
    });

    this.linkList.innerHTML = '';

    if (filteredLinks.length === 0) {
      this.linkList.innerHTML = `
        <div class="text-center py-8 text-gray-500 dark:text-gray-400">
          ${this.links.length === 0 ? 'No links saved yet. Add your first link above!' : 'No links match your search criteria.'}
        </div>
      `;
      return;
    }

    filteredLinks.forEach((link, index) => {
      const linkElement = this.createLinkElement(link, index);
      this.linkList.appendChild(linkElement);
    });
  }

  createLinkElement(link, index) {
    const div = document.createElement('div');
    div.className = 'link-card space-y-2';

    const domain = new URL(link.url).hostname;
    const timeAgo = this.getTimeAgo(link.createdAt);

    div.innerHTML = `
      <div class="flex items-start justify-between">
        <div class="flex-1 min-w-0">
          <a href="${link.url}" target="_blank" rel="noopener noreferrer"
             class="text-blue-600 dark:text-blue-400 hover:underline font-medium break-all">
            ${domain}
          </a>
          <p class="text-sm text-gray-600 dark:text-gray-400 break-all">${link.url}</p>
        </div>
        <button onclick="app.deleteLink(${index})"
                class="btn-danger ml-2 flex-shrink-0"
                title="Delete link">
          ×
        </button>
      </div>

      ${link.note ? `<p class="text-gray-800 dark:text-gray-200">${this.escapeHtml(link.note)}</p>` : ''}

      <div class="flex flex-wrap gap-2 items-center text-sm text-gray-500 dark:text-gray-400">
        ${link.tags.length > 0 ? `
          <div class="flex flex-wrap gap-1">
            ${link.tags.map(tag => `<span class="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">#${this.escapeHtml(tag)}</span>`).join('')}
          </div>
        ` : ''}

        ${link.folder ? `
          <span class="folder-tag bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
            ${this.getFolderEmoji(this.folders.find(f => f.name === link.folder)?.tag)} ${this.escapeHtml(link.folder)}
          </span>
        ` : ''}

        <span class="ml-auto">${timeAgo}</span>
      </div>
    `;

    return div;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  getTimeAgo(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 30) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString();
  }

  toggleTheme() {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    localStorage.setItem('darkMode', isDark);
  }

  initializeTheme() {
    const isDark = localStorage.getItem('darkMode') === 'true';
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }
}

let app;
document.addEventListener('DOMContentLoaded', () => {
  app = new LinkVault();
});