// TODO: Make it configurable.
var notesFlowServer = "http://127.0.0.1:5000"; 

/**
 * Posts noteInfo to Notes Server.
 * @param {*} noteInfo 
 *  note
 *  term (word)
 *  sound
 *  sentence
 *  offset
 *  timestamp
 *  url
 */
function postNoteInfoToNotesServer(noteInfo) {
    var noteInfoDict = {
        "note": "",
        "word": noteInfo.term,
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
        contentType: 'application/json',
        url: notesFlowServer + "/notes/0",
        data: data,
        dataType : 'json',
        success: function(response) {
            console.log('success.', 'response:', response);
        },
        error: function(result) {
            console.log('error.', 'result:', result);
        }
    });
}