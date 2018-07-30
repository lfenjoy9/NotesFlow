function initBackground() {
  // Register the browser action to add note.
  chrome.browserAction.onClicked.addListener(
      function(tab) {
        chrome.tabs.sendRequest(
            tab.id,
            {'addNote': true});
      });      
}

initBackground();
