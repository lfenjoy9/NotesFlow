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
        url: "http://127.0.0.1:5000/notes/create",
        // url: "http://35.160.132.194:8000/notes/create",        
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
        url: "http://127.0.0.1:5000/words/create",
        // url: "http://35.160.132.194:8000/words/create",        
        data: data,
        success: function(data) {
            console.log(data);
        },
    });
}

function listNotes() {
    $.ajax({
    type: "GET",
    url: "http://127.0.0.1:5000/notes/list",
    // url: "http://35.160.132.194:8000/notes/list",
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
    url: "http://127.0.0.1:5000/notes/" + noteId,
    // url: "http://35.160.132.194:8000/notes/" + noteId,
    success: function(data) {
        console.log(data);
    },
    });
}