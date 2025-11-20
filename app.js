// State
let notes = JSON.parse(localStorage.getItem('notes')) || [];
let currentNoteId = null;

// DOM Elements
const notesList = document.getElementById('notes-grid');
const searchInput = document.getElementById('search-input');
const themeToggle = document.getElementById('theme-toggle');
const fabAdd = document.getElementById('fab-add');
const backBtn = document.getElementById('back-btn');
const saveBtn = document.getElementById('save-btn');
const deleteBtn = document.getElementById('delete-btn');

const listView = document.getElementById('notes-list-view');
const editorView = document.getElementById('note-editor-view');
const emptyState = document.getElementById('empty-state');

const noteTitleInput = document.getElementById('note-title');
const noteBodyInput = document.getElementById('note-body');
const lastEditedLabel = document.getElementById('last-edited');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    renderNotes();
    loadTheme();
});

// Theme Logic
function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

themeToggle.addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    const iconName = theme === 'dark' ? 'sun' : 'moon';
    themeToggle.innerHTML = `<i data-lucide="${iconName}"></i>`;
    lucide.createIcons();
}

// Navigation
function showEditor(noteId = null) {
    currentNoteId = noteId;
    
    if (noteId) {
        const note = notes.find(n => n.id === noteId);
        noteTitleInput.value = note.title;
        noteBodyInput.value = note.body;
        lastEditedLabel.textContent = `Diedit: ${new Date(note.updatedAt).toLocaleDateString('id-ID')}`;
    } else {
        noteTitleInput.value = '';
        noteBodyInput.value = '';
        lastEditedLabel.textContent = 'Catatan Baru';
        noteTitleInput.focus();
    }

    listView.classList.remove('active');
    setTimeout(() => {
        listView.style.display = 'none';
        editorView.style.display = 'flex';
        // Small delay to allow display:flex to apply before opacity transition
        requestAnimationFrame(() => {
            editorView.classList.add('active');
        });
    }, 300); // Match CSS transition
}

function showList() {
    editorView.classList.remove('active');
    setTimeout(() => {
        editorView.style.display = 'none';
        listView.style.display = 'block';
        requestAnimationFrame(() => {
            listView.classList.add('active');
        });
    }, 300);
    currentNoteId = null;
}

// CRUD Operations
function saveNote() {
    const title = noteTitleInput.value.trim();
    const body = noteBodyInput.value.trim();

    if (!title && !body) {
        showList();
        return;
    }

    const noteData = {
        id: currentNoteId || Date.now().toString(),
        title: title || 'Tanpa Judul',
        body: body,
        updatedAt: new Date().toISOString()
    };

    if (currentNoteId) {
        const index = notes.findIndex(n => n.id === currentNoteId);
        notes[index] = noteData;
    } else {
        notes.unshift(noteData); // Add to top
    }

    localStorage.setItem('notes', JSON.stringify(notes));
    renderNotes();
    showList();
}

function deleteNote() {
    if (currentNoteId) {
        if (confirm('Hapus catatan ini?')) {
            notes = notes.filter(n => n.id !== currentNoteId);
            localStorage.setItem('notes', JSON.stringify(notes));
            renderNotes();
            showList();
        }
    } else {
        showList(); // Just cancel if it was a new note
    }
}

function renderNotes(filterText = '') {
    notesList.innerHTML = '';
    
    const filteredNotes = notes.filter(note => 
        note.title.toLowerCase().includes(filterText.toLowerCase()) || 
        note.body.toLowerCase().includes(filterText.toLowerCase())
    );

    if (filteredNotes.length === 0) {
        emptyState.classList.remove('hidden');
    } else {
        emptyState.classList.add('hidden');
        filteredNotes.forEach(note => {
            const card = document.createElement('div');
            card.className = 'note-card';
            card.onclick = () => showEditor(note.id);
            
            const date = new Date(note.updatedAt).toLocaleDateString('id-ID', {
                day: 'numeric', month: 'short', year: 'numeric'
            });

            card.innerHTML = `
                <h3>${escapeHtml(note.title)}</h3>
                <p>${escapeHtml(note.body)}</p>
                <div class="note-date">${date}</div>
            `;
            notesList.appendChild(card);
        });
    }
}

// Utility
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Event Listeners
fabAdd.addEventListener('click', () => showEditor());
backBtn.addEventListener('click', saveNote); // Auto-save on back
saveBtn.addEventListener('click', saveNote);
deleteBtn.addEventListener('click', deleteNote);

searchInput.addEventListener('input', (e) => {
    renderNotes(e.target.value);
});
