// NoteInfo
// - note
// - sentence
// - offset 
// - url

var lastNote = '';

function isSpaceCharacter(c) {
  return c == ' ' || c == '\n' || c == '\t';
}

// Returns NoteInfo from the selected text.
function extractNotInfo(text, selectionStart, selectionEnd) {
  var note = text.substr(selectionStart, selectionEnd - selectionStart);
  var startOffset = selectionStart;
  for (; startOffset > 0 && text.charAt(startOffset - 1) != '.'; --startOffset);
  for (; isSpaceCharacter(text.charAt(startOffset)); ++startOffset);
  var endOffset = selectionEnd;
  for (; endOffset < text.length && text.charAt(endOffset) != '.'; ++endOffset);
  var offset = selectionStart - startOffset;
  return { 
      note: note, 
      sentence: text.substr(startOffset, endOffset + 1), 
      offset: offset, 
      url: '' 
  }; 
}

// Returns NoteInfo from the selected text and sentence.
function getSelectedNoteInfo() {
  var sel = window.getSelection();
  var range = sel.getRangeAt(0);
  var noteInfo = extractNotInfo(range.startContainer.nodeValue, range.startOffset, range.endOffset);
  noteInfo['url'] = window.location.href;
  return noteInfo;
}

// Returns NoteInfo from the selected text in the input area.
function getNoteInfoInInputArea() {
  var text = document.getElementById("pagetext");
  return extractNotInfo(text.value, text.selectionStart, text.selectionEnd);
}

// Adds note for the selected text.
function addNote() {
  var noteInfo;
  if (window.location.href == 'https://www.jspell.com/public-spell-checker.html') {
    noteInfo = getNoteInfoInInputArea();
  } else {
    noteInfo = getSelectedNoteInfo()
  }
  if (noteInfo.note == lastNote) {
    // TODO: Display warn on the page.
    console.warn("Skip the duplicate note,", 'note:', noteInfo.note);
    return;
  }
  lastNote = noteInfo.note;
  console.log('addNote', 'noteInfo:', noteInfo);
  chrome.extension.sendMessage({method: "addNote", noteInfo: noteInfo});
}

function onExtensionMessage(request) {
  if (request['addNote'] != undefined) {
    console.log('addNote', request);
    if (!document.hasFocus()) {
      console.log('Document doesn\'t have focus');
      return;
    }
    addNote();
  } else if(request['notifyNoteStatus'] != undefined) {
    console.log('notifyNoteStatus', request);
    if (request['error'] != undefined) {
      // TODO: Display error on the page.
      alert('error:' + request.error);
    }
  }
}

function initContentScript() {
  chrome.extension.onRequest.addListener(onExtensionMessage);

  document.body.addEventListener('dblclick',function(evt){
    addNote();
  }, false);
}

initContentScript();
