// Handle reqeust from the page.
chrome.extension.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.method == "export") {
            exportNotes();
        } else if (request.method == "add") {
            addNote(request.noteInfo);
        }
    }
);