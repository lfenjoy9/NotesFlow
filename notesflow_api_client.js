// Deprecated.

// var notesFlowApiUrl = "http://35.160.132.194:8000/"; // prod
var notesFlowApiUrl = "http://127.0.0.1:5000/"; // dev

function postNoteToRemoteServer(noteInfo) {
    var noteInfoData = "note=" + noteInfo.note +
    "&sentence=" + encodeURIComponent(noteInfo.sentence) + 
    "&url=" + encodeURIComponent(noteInfo.url) +
    "&offset=" + noteInfo.offset +
    "&term=" + noteInfo.term +
    "&timestamp=" + noteInfo.timestamp;
    console.log(noteInfoData);

    $.ajax({
        type: "POST",
        url: notesFlowApiUrl + "notes/create",
        data: noteInfoData,
        success: function(data) {
            postWordToRemoteServer(noteInfo);
            console.log(data);
            // TODO: alert if status is not success (0).
        },
    });
}

function postWordToRemoteServer(noteInfo) {
    var data = "word=" + noteInfo.term +
    "&wav=" + noteInfo.sound;
    $.ajax({
        type: "POST",
        url: notesFlowApiUrl + "words/create",     
        data: data,
        success: function(data) {
            console.log(data);
        },
    });
}

function listNotes() {
    $.ajax({
    type: "GET",
    url: notesFlowApiUrl + "notes/list",
    success: function(data) {
        console.log(data);
        var noteinfos = JSON.parse(data)
        console.log("Number of notes: " + noteinfos.length);
        console.log(noteinfos);
    },
    });
}

function showNote(noteId) {
    $.ajax({
    type: "GET",
    url: notesFlowApiUrl + "notes/" + noteId,
    success: function(data) {
        console.log(data);
    },
    });
}