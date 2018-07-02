/**
 * Copyright (c) 2011 The Chromium Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

var speakKeyStr;

function isSpaceCharacter(c) {
  return c == ' ' || c == '\n' || c == '\t';
}

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
  return extractNotInfo(text.value, text.selectionStart, text.selectionEnd);
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
  chrome.extension.sendMessage({method: "add", noteInfo: noteInfo});
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

  document.body.addEventListener('dblclick',function(evt){
    speakSelection();
  }, false);

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
