/**
 * Copyright (c) 2011 The Chromium Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

var lastUtterance = '';
var speaking = false;
var globalUtteranceIndex = 0;

if (localStorage['lastVersionUsed'] != '1') {
  localStorage['lastVersionUsed'] = '1';
  chrome.tabs.create({
    url: chrome.extension.getURL('options.html')
  });
}

function speak(utterance) {  
  if (speaking && utterance == lastUtterance) {
    chrome.tts.stop();
    return;
  }

  speaking = true;
  lastUtterance = utterance;
  globalUtteranceIndex++;
  var utteranceIndex = globalUtteranceIndex;

  chrome.browserAction.setIcon({path: 'SpeakSel19-active.png'});

  var rate = localStorage['rate'] || 1.0;
  var pitch = localStorage['pitch'] || 1.0;
  var volume = localStorage['volume'] || 1.0;
  var voice = localStorage['voice'];
  chrome.tts.speak(
      utterance,
      {voiceName: voice,
       rate: parseFloat(rate),
       pitch: parseFloat(pitch),
       volume: parseFloat(volume),
       onEvent: function(evt) {
         if (evt.type == 'end' ||
             evt.type == 'interrupted' ||
             evt.type == 'cancelled' ||
             evt.type == 'error') {
           if (utteranceIndex == globalUtteranceIndex) {
             speaking = false;
             chrome.browserAction.setIcon({path: 'SpeakSel19.png'});
           }
         }
       }
      });
}

var exportNotesHandler = function(e) {
  exportNotes(downloadNotesInCSVFormat);
}

function downloadNotesInCSVFormat(result) {
  var csv = "";
  for (var i = 0; i < result.rows.length; ++i) {
      csv += result.rows.item(i)['Note'] + ',' +
      result.rows.item(i)['Sentence'] + ',' +
      result.rows.item(i)['Offset'] + ',' +
      result.rows.item(i)['URL'] + ',' +
      result.rows.item(i)['Timestamp'] + "\n";
  }
  var blob = new Blob([csv], {type: 'text/plain'});
  var link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = "NoteFlowNotes-" + new Date().getTime() + ".csv";
  fake_click(link);
}

function fake_click(obj) {
  var event = document.createEvent("MouseEvents");
  event.initMouseEvent(
      "click", true, false, window, 0, 0, 0, 0, 0
      , false, false, false, false, 0, null
      );
  obj.dispatchEvent(event);
}

function initBackground() {
  loadContentScriptInAllTabs();

  // Init DB.
  initDb(); 

  // Regiester context menu handler.
  chrome.contextMenus.create({
    "title": "Export NoteFlow Notes",
    "contexts": ["page", "selection", "image", "link"],
    "onclick" : exportNotesHandler
  });

  var defaultKeyString = getDefaultKeyString();
  var keyString = localStorage['speakKey'];
  if (keyString == undefined) {
    keyString = defaultKeyString;
    localStorage['speakKey'] = keyString;
  }
  sendKeyToAllTabs(keyString);

  chrome.extension.onRequest.addListener(
      function(request, sender, sendResponse) {
        if (request['init']) {
          sendResponse({'key': localStorage['speakKey']});
        } else if (request['speak']) {
          speak(request['speak']);
        }
      });

  chrome.browserAction.onClicked.addListener(
      function(tab) {
        chrome.tabs.sendRequest(
            tab.id,
            {'speakSelection': true});
      });      
}

initBackground();
