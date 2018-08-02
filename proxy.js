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
        console.error(err, noteInfo);
    });
}