// lookup the word and return entry word and wave file
function lookupWord(word) {
    var url = "http://www.dictionaryapi.com/api/v1/references/learners/xml/" + word;
    url += "?key=41d675dd-c2a7-46db-b71b-d572c8e2ae7d";

    $.ajax({
        url: url,
        dataType: "xml",
        success: function(data) {
            var entryIdHasSound;
            var wav;
            console.log(data);
            var entry_list = $(data).find("entry_list")
            var entries = entry_list.find("entry")
            if (entries.length === 0) {
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
                playSound(wav);
            }
        },
    });
}

function playSound(wavFilename) {
    var url = "http://media.merriam-webster.com/soundc11/";
    url += wavFilename[0] + "/" + wavFilename;
    var pr = new Audio(url);
    pr.play();
}