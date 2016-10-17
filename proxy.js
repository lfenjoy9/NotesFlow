// Handle reqeust from the page.
chrome.extension.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.method == "export") {
            exportNotes();
        } else if (request.method == "add") {
            console.log("add " + request.noteInfo.note + ", " + request.noteInfo.sentence);
            addNote(request.noteInfo);
        }
    }
);