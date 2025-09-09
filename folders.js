// Folder management JS for folders.html
const folderList = document.getElementById('folder-list');
const addFolderBtn = document.getElementById('add-folder');
const newFolderName = document.getElementById('new-folder-name');
const newFolderTag = document.getElementById('new-folder-tag');

let folders = JSON.parse(localStorage.getItem('folders') || '[]');

function saveFolders() {
  localStorage.setItem('folders', JSON.stringify(folders));
}

function renderFolders() {
  folderList.innerHTML = '';
  folders.forEach(folder => {
    const div = document.createElement('div');
    div.innerHTML = `${folder.tag === 'red' ? '🔴' : folder.tag === 'yellow' ? '🟡' : '🟢'} <strong>${folder.name}</strong>`;
    folderList.appendChild(div);
  });
}

addFolderBtn.onclick = () => {
  const name = newFolderName.value.trim();
  const tag = newFolderTag.value;
  if (!name) return;
  if (folders.some(f => f.name === name)) {
    alert('Folder name already exists!');
    return;
  }
  folders.push({ name, tag });
  saveFolders();
  newFolderName.value = '';
  renderFolders();
};

renderFolders();
