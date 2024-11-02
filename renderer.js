const notesList = document.getElementById("notes");
const noteTitle = document.getElementById("noteTitle");
const noteContent = document.getElementById("noteContent");
const saveButton = document.getElementById("saveButton");
const toast = document.getElementById("toast");

let notes = [];
let editingIndex = null;

// function to show toast notification
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}

// load and display notes
function loadNotes() {
  window.electronAPI.loadNotes().then((loadedNotes) => {
    notes = loadedNotes;
    displayNotes();
  });
}

function displayNotes() {
  notesList.innerHTML = "";
  notes.forEach((note, index) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `<i class="fas fa-sticky-note"></i> ${
      note.title || "Untitled Note"
    }`;
    listItem.classList.add("note-item");
    listItem.addEventListener("click", () => loadNoteInEditor(note, index));
    notesList.appendChild(listItem);
  });
}

// load selected note into editor
function loadNoteInEditor(note, index) {
  noteTitle.value = note.title || "";
  noteContent.value = note.content;
  editingIndex = index; // Set editing index to the selected note's index
}

// save button click event to save or update note
saveButton.addEventListener("click", () => {
  const title = noteTitle.value.trim();
  const content = noteContent.value.trim();
  const note = { title, content };

  if (editingIndex !== null) {
    // Update existing note
    notes[editingIndex] = note;
  } else {
    // Save new note
    notes.push(note);
  }

  // save notes to storage and update the UI
  window.electronAPI.saveNotes(notes).then((updatedNotes) => {
    notes = updatedNotes;
    displayNotes();
    showToast("Note saved!");
    clearEditor();
  });
});

// clear editor after save
function clearEditor() {
  noteTitle.value = "";
  noteContent.value = "";
  editingIndex = null; // Reset editing index
}

// load notes on app start
loadNotes();
