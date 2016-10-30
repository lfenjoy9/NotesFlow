/**
 * Copyright (c) 2011 The Chromium Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

var speakKeyStr;

// Returns NoteInfo (Note, Sentence, Offset, URL)
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
  return { note: sel.toString().trim(), sentence: text.substring(startOffset, endOffset), offset: offset, url: window.location.href };
}

function speakSelection() {
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

  // Add note info.
  var noteInfo = getNoteInfo();
  chrome.extension.sendMessage({method: "add", noteInfo: noteInfo});

  chrome.extension.sendRequest({'speak': selectedText});
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
