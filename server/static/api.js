// lookup the word and return entry word and wave file
function lookupWord(noteinfo, fn) {
    var url = "http://www.dictionaryapi.com/api/v1/references/learners/xml/" + noteinfo.note;
    url += "?key=41d675dd-c2a7-46db-b71b-d572c8e2ae7d";
    $.ajax({
        url: url,
        dataType: "xml",
        crossDomain: true,
        success: function(data) {
            console.log(data);
            var entryIdHasSound;
            var wav;
            var entry_list = $(data).find("entry_list")
            var entries = entry_list.find("entry")
            if (entries.length === 0) {
                // Not found
                return;
            }
            entries.each(function() {
                if (entryIdHasSound) {
                    return;
                }
                var sounds = $(this).find("sound");
                if (sounds.length > 0) {
                    var wavs = $(sounds[0]).find("wav");
                    if (wavs.length > 0) {
                        entryIdHasSound = $(this).attr('id');
                        wav = $(wavs[0]).text();
                    }
                }
            });
            if (entryIdHasSound) {
                var entryWord = entryIdHasSound.replace(/[0-9]|\[|\]/g, "");
                console.log(entryWord + "," + wav);                
                noteinfo["term"] = entryWord;
                noteinfo["sound"] = wav;
                playSound(wav);
            } else {
                // TODO: Get the word of the first entry.
            }
            fn(noteinfo);
        },
    });
}

// {id: <id>, term: <term>}
function updateNoteToRemoteServer(noteInfo) {
    var data = "id=" + noteInfo.id + "&term=" + noteInfo.term;
    console.log(data);
    $.ajax({
        type: "POST",
        url: getApiRootUrl() + "notes/update",
        data: data,
        success: function(data) {
            console.log(data);
         },
    });
}

// {term: <term>, sound: <sound>}
function postWordToRemoteServer(wordInfo) {
    var data = "word=" + wordInfo.term + "&wav=" + wordInfo.sound;
    console.log(data);
    $.ajax({
        type: "POST",
        url: getApiRootUrl() + "words/create",     
        data: data,
        success: function(data) {
            console.log(data);
        },
    });
}

function getApiRootUrl() {
    var apiRootUrl = window.location.protocol + "//" + 
        window.location.hostname + ":" + 
        window.location.port + "/";
    console.log("apiRootUrl=" + apiRootUrl);
    return apiRootUrl;
}