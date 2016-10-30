// lookup the word and return entry word and wave file
function lookupWord(noteinfo, fn) {
    noteinfo["term"] = "";
    noteinfo["sound"] = "";
    if (noteinfo.note.split(" ").length > 1) {
        // Contains multiple words.
        fn(noteinfo);
        return;
    }

    var url = "http://www.dictionaryapi.com/api/v1/references/learners/xml/" + noteinfo.note;
    url += "?key=41d675dd-c2a7-46db-b71b-d572c8e2ae7d";

    $.ajax({
        url: url,
        dataType: "xml",
        success: function(data) {
            console.log(data);
            var entryIdHasSound;
            var wav;
            console.log(data);
            var entry_list = $(data).find("entry_list")
            var entries = entry_list.find("entry")
            if (entries.length === 0) {
                // Not found
                fn(noteinfo);
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

function playSound(wavFilename) {
    var url = "http://media.merriam-webster.com/soundc11/";
    url += wavFilename[0] + "/" + wavFilename;
    var audio = new Audio(url);
    audio.play();
}