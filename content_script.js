/**
 * Copyright (c) 2011 The Chromium Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

var speakKeyStr;

// Returns NoteInfo 
// - note, 
// - sentence
// - offset, 
// - url
function getNoteInfo() {
  var sel = window.getSelection();
  var range = sel.getRangeAt(0);
  var text = range.startContainer.nodeValue;
  var startOffset = range.startOffset;
  for (; startOffset > 0 && text.charAt(startOffset - 1) != '.'; --startOffset);
  for (; text.charAt(startOffset) == ' '; ++startOffset);
  var endOffset = range.endOffset;
  for (; endOffset < text.length && text.charAt(endOffset) != '.'; ++endOffset);
  if (endOffset < text.length) {
    endOffset++;
  }
  var offset = range.startOffset - startOffset;
  return { 
    note: sel.toString().trim(), 
    sentence: text.substring(startOffset, endOffset), 
    offset: offset, 
    url: window.location.href
  };
}

// https://www.jspell.com/public-spell-checker.html
function getNoteInfoInInputArea() {
  var text = document.getElementById("pagetext");
  var textContent = text.value;
  var note = textContent.substr(text.selectionStart, text.selectionEnd - text.selectionStart);
  var startOffset = text.selectionStart;
  for (; startOffset > 0 && textContent.charAt(startOffset - 1) != '.'; --startOffset);
  for (; textContent.charAt(startOffset) == ' '; ++startOffset);
  var endOffset = text.selectionEnd;
  for (; endOffset < textContent.length && textContent.charAt(endOffset) != '.'; ++endOffset);
  var offset = text.selectionStart - startOffset;
  console.log('[' + startOffset + "," + endOffset + ']')
  return { 
      note: note, 
      sentence: textContent.substr(startOffset, endOffset + 1), 
      offset: offset, 
      url: '' 
  }; 
}

function speakSelection() {
  // Speak the selected text.
  var focused = document.activeElement;
  var selectedText;
  if (focused) {
    try {
      selectedText = focused.value.substring(
      focused.selectionStart, focused.selectionEnd);
    } catch (err) {
    }
  }
  if (selectedText == undefined) {
    var sel = window.getSelection();
    var selectedText = sel.toString();
  }
  var noteInfo = getNoteInfoInInputArea();
  console.log(noteInfo)
  chrome.extension.sendRequest({'speak': noteInfo.note});
  // Add note info.
  // chrome.extension.sendMessage({method: "add", noteInfo: noteInfo});
}

function onExtensionMessage(request) {
  if (request['speakSelection'] != undefined) {
    if (!document.hasFocus()) {
      return;
    }
    speakSelection();
  } else if (request['key'] != undefined) {
    speakKeyStr = request['key'];
  }
}

function initContentScript() {
  chrome.extension.onRequest.addListener(onExtensionMessage);
  chrome.extension.sendRequest({'init': true}, onExtensionMessage);

  document.addEventListener('keydown', function(evt) {
    if (!document.hasFocus()) {
      return true;
    }
    var keyStr = keyEventToString(evt);
    if (keyStr == speakKeyStr && speakKeyStr.length > 0) {
      speakSelection();
      evt.stopPropagation();
      evt.preventDefault();
      return false;
    }
    return true;
  }, false);
}

initContentScript();
