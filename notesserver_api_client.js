var notesFlowServer = "http://127.0.0.1:5000"; 

/**
 * Posts noteInfo to Notes Server.
 * @param {*} noteInfo 
 *  note
 *  term
 *  sound
 *  sentence
 *  offset
 *  timestamp
 *  url
 */
function postNoteInfoToNotesServer(noteInfo) {
    var noteInfoDict = {
        "note": "",
        "term": noteInfo.term,
        "sound": noteInfo.sound,
        "sentence": noteInfo.sentence,
        "offset": noteInfo.offset,
        "timesamp": noteInfo.timesamp,
        "url": noteInfo.url
    };
    var data = JSON.stringify(noteInfoDict);
    console.log(data);
    $.ajax({
        type: "POST",
        url: notesFlowServer + "/notes/0",
        data: data,
        success: function(response) {
            console.log(response);
        },
    });
}