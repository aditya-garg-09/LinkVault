class FolderManager {
  constructor() {
    this.folders = JSON.parse(localStorage.getItem('folders') || '[]');
    this.initializeElements();
    this.bindEvents();
    this.render();
  }

  initializeElements() {
    this.folderList = document.getElementById('folder-list');
    this.addFolderBtn = document.getElementById('add-folder');
    this.newFolderName = document.getElementById('new-folder-name');
    this.newFolderTag = document.getElementById('new-folder-tag');
    this.themeToggle = document.getElementById('toggle-theme');
  }

  bindEvents() {
    if (this.addFolderBtn) {
      this.addFolderBtn.addEventListener('click', () => this.addFolder());
    }

    if (this.newFolderName) {
      this.newFolderName.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.addFolder();
        }
      });
    }

    if (this.themeToggle) {
      this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    this.initializeTheme();
  }

  addFolder() {
    const name = this.newFolderName?.value?.trim();
    const tag = this.newFolderTag?.value;

    if (!name) {
      this.showMessage('Please enter a folder name', 'error');
      return;
    }

    if (this.folders.some(f => f.name.toLowerCase() === name.toLowerCase())) {
      this.showMessage('Folder name already exists!', 'error');
      return;
    }

    const newFolder = {
      name,
      tag,
      createdAt: Date.now(),
      id: Date.now().toString()
    };

    this.folders.push(newFolder);
    this.saveFolders();

    if (this.newFolderName) this.newFolderName.value = '';
    if (this.newFolderTag) this.newFolderTag.value = 'green';

    this.render();
    this.showMessage('Folder created successfully!', 'success');
  }

  deleteFolder(folderId) {
    const folderIndex = this.folders.findIndex(f => f.id === folderId);
    if (folderIndex === -1) return;

    const folder = this.folders[folderIndex];

    if (confirm(`Are you sure you want to delete "${folder.name}"? Links in this folder will not be deleted.`)) {
      this.folders.splice(folderIndex, 1);
      this.saveFolders();
      this.render();
      this.showMessage('Folder deleted successfully!', 'success');
    }
  }

  editFolder(folderId) {
    const folder = this.folders.find(f => f.id === folderId);
    if (!folder) return;

    const newName = prompt('Enter new folder name:', folder.name);
    if (!newName || newName.trim() === '') return;

    const trimmedName = newName.trim();

    if (this.folders.some(f => f.id !== folderId && f.name.toLowerCase() === trimmedName.toLowerCase())) {
      this.showMessage('Folder name already exists!', 'error');
      return;
    }

    const oldName = folder.name;
    folder.name = trimmedName;
    this.saveFolders();

    this.updateLinksWithNewFolderName(oldName, trimmedName);
    this.render();
    this.showMessage('Folder renamed successfully!', 'success');
  }

  updateLinksWithNewFolderName(oldName, newName) {
    const links = JSON.parse(localStorage.getItem('links') || '[]');
    const updatedLinks = links.map(link => {
      if (link.folder === oldName) {
        return { ...link, folder: newName };
      }
      return link;
    });
    localStorage.setItem('links', JSON.stringify(updatedLinks));
  }

  saveFolders() {
    localStorage.setItem('folders', JSON.stringify(this.folders));
  }

  getFolderEmoji(tag) {
    const emojiMap = { red: '🔴', yellow: '🟡', green: '🟢' };
    return emojiMap[tag] || '📁';
  }

  getTimeAgo(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days < 1) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 30) return `${days} days ago`;
    return new Date(timestamp).toLocaleDateString();
  }

  render() {
    if (!this.folderList) return;

    this.folderList.innerHTML = '';

    if (this.folders.length === 0) {
      this.folderList.innerHTML = `
        <div class="text-center py-8 text-gray-500 dark:text-gray-400">
          No folders created yet. Add your first folder above!
        </div>
      `;
      return;
    }

    const sortedFolders = [...this.folders].sort((a, b) => b.createdAt - a.createdAt);

    sortedFolders.forEach(folder => {
      const folderElement = this.createFolderElement(folder);
      this.folderList.appendChild(folderElement);
    });
  }

  createFolderElement(folder) {
    const div = document.createElement('div');
    div.className = 'link-card flex items-center justify-between';

    const timeAgo = this.getTimeAgo(folder.createdAt);
    const linkCount = this.getLinkCount(folder.name);

    div.innerHTML = `
      <div class="flex items-center space-x-3">
        <span class="text-2xl">${this.getFolderEmoji(folder.tag)}</span>
        <div>
          <h3 class="font-medium text-gray-900 dark:text-gray-100">${this.escapeHtml(folder.name)}</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            ${linkCount} ${linkCount === 1 ? 'link' : 'links'} • Created ${timeAgo}
          </p>
        </div>
      </div>

      <div class="flex items-center space-x-2">
        <button onclick="folderManager.editFolder('${folder.id}')"
                class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 p-1"
                title="Edit folder">
          ✏️
        </button>
        <button onclick="folderManager.deleteFolder('${folder.id}')"
                class="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 p-1"
                title="Delete folder">
          🗑️
        </button>
      </div>
    `;

    return div;
  }

  getLinkCount(folderName) {
    const links = JSON.parse(localStorage.getItem('links') || '[]');
    return links.filter(link => link.folder === folderName).length;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  showMessage(message, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
      type === 'success' ? 'bg-green-100 border border-green-400 text-green-700' :
      type === 'error' ? 'bg-red-100 border border-red-400 text-red-700' :
      'bg-blue-100 border border-blue-400 text-blue-700'
    }`;
    messageDiv.textContent = message;

    document.body.appendChild(messageDiv);

    setTimeout(() => {
      messageDiv.remove();
    }, 3000);
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

let folderManager;
document.addEventListener('DOMContentLoaded', () => {
  folderManager = new FolderManager();
});