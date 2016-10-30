var db;
function initDb() {
    console.log("init WordFlow db");
    db = openDatabase("WordFlow", "0.1", "Database for WordFlow", 200000);
    db.transaction(function (tx) {
        tx.executeSql("SELECT COUNT(*) FROM `Notes`", [],
        function(result) {
            console.log("Notes table exists.");
        },
        function(tx, error) {
            // id INTEGER  
            // Note TEXT 
            // Sentence TEXT
            // Offset INTEGER
            // URL TEXT
            // Timestamp REAL
            // https://www.sqlite.org/datatype3.html
            tx.executeSql("CREATE TABLE `Notes` (`id` INTEGER PRIMARY KEY, `Note` TEXT,  `Sentence` TEXT,  `Offset` INTEGER,  `URL` TEXT, `Timestamp` REAL)", [],
            function() {
                console.log("Notes table is created.")
                localStorage.db_version = 2;
            },
            null);
        });
    });
}

function addNote(noteInfo) {
    var timestamp = new Date().getTime();

    db.transaction(function(tx) {
        tx.executeSql("INSERT INTO `Notes` (`Note`, `Sentence`, `Offset`, `URL`, `Timestamp`) values(?, ?, ?, ?, ?)",
        [noteInfo.note, noteInfo.sentence, noteInfo.offset, noteInfo.url, timestamp],
        function(){
            console.log(noteInfo.note + " is added.");
        },
        null
        );
    });

    noteInfo["timestamp"] = timestamp;

    // Lookup the word and then post the note to server.
    lookupWord(noteInfo, postNoteToRemoteServer);
}

var csv = "";

function exportNotes(processFunc) {
    console.log("export notes");
    getNotes(processFunc);
}

function getNotes(processFunc) {
    db.transaction(function(tx) {
        tx.executeSql("SELECT `Note`, `Sentence`, `Offset`, `URL`, `Timestamp` FROM `Notes` ORDER BY `Timestamp` ASC", [],
        function(tx, result) {
            processFunc(result);
        }, null);
    });
}