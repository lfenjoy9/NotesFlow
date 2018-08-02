// Handle the reqeust from the content page.
chrome.extension.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.method == "addNote") {
            addNote(request.noteInfo);
        }
    }
);

function addNote(noteInfo) {
    var timestamp = new Date().getTime();
    noteInfo["timestamp"] = timestamp;
    // Lookup the word and post the note to server.
    lookupWord(noteInfo, postNoteInfoToNotesServer, function(err, noteInfo) {
        chrome.tabs.query({active:true,windowType:"normal", currentWindow: true},
            function(tabInfo){
                if (tabInfo.length == 0) {
                    console.error('Invalid tabInfo.', 'tabInfo:', tabInfo);
                    return;
                }
                var tabid = tabInfo[0].id;
                chrome.tabs.sendRequest(
                    tabid,
                    {
                        'notifyNoteStatus': true,
                        'error': err
                    });
            }
        );
   });
}