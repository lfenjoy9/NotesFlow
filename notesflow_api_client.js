function postNoteToRemoteServer(noteInfo, timestamp, url) {
    var noteInfoData = "note=" + noteInfo.note +
    "&sentence=" + encodeURIComponent(noteInfo.sentence) + 
    "&url=" + encodeURIComponent(noteInfo.url) +
    "&offset=" + noteInfo.offset +
    "&timestamp=" + timestamp;
    console.log(noteInfoData);

    $.ajax({
        type: "POST",
        // url: "http://127.0.0.1:5000/notes/create",
        url: "http://35.160.132.194:8000/notes/create",        
        data: noteInfoData,
        success: function(data) {
            console.log(data);
            // TODO: alert if status is not success (0).
        },
    });
}

function listNotes() {
    $.ajax({
    type: "GET",
    // url: "http://127.0.0.1:5000/notes/list",
    url: "http://35.160.132.194:8000/notes/list",
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
    // url: "http://127.0.0.1:5000/notes/" + noteId,
    url: "http://35.160.132.194:8000/notes/" + noteId,
    success: function(data) {
        console.log(data);
    },
    });
}