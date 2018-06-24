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
function postNoteIntoToNotesServer(noteInfo) {
    noteInfoDict = {
        "note": "",
        "term": noteInfo.term,
        "sound": noteInfo.sound,
        "sentence": noteInfo.sentence,
        "offset": noteInfo.offset,
        "timesamp": noteInfo.timesamp,
        "url": noteInfo.url
    }
    console.log(JSON.stringify(noteInfoDict))
    // TODO: Post nottInfoDict.
}