from db import Note
from db import Word
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask import render_template
import json
import time

app = Flask(__name__)
app.config.from_envvar('NOTES_FLOW_SERVER_SETTINGS')

db = SQLAlchemy(app)

@app.route("/")
def root():
    return "NotesFlow!"

# notes/create (note, sentence, offset, url, timestamp, term)
# notes/list
# notes/:note_id
# Reference 
# https://dev.twitter.com/rest/public

@app.route('/notes/create', methods=['POST'])
def create_note():
    if request.method == 'POST':
        note = request.form.get('note')
        sentence = request.form.get('sentence')
        offset = int(request.form.get('offset'))
        url = request.form.get('url')
        timestamp = int(request.form.get("timestamp"))
        term = request.form.get('term')
        if note == None or sentence == None or offset == None or url == None or timestamp == None:
            return jsonify(status=1)
        else:
            db.session.add(Note(note, sentence, offset, url, timestamp, term))
            db.session.commit()
            return jsonify(status=0)

@app.route('/notes/update', methods=['POST'])
def update_note():
    if request.method == 'POST':
        noteId = request.form.get('id')
        # Add more fields to update.
        term = request.form.get('term')
        if noteId == None or term == None:
            print "Missing noteId or term"
            return jsonify(status=1)
        else:
            db.session.query(Note).filter(Note.id == noteId).update({Note.term:term})
            db.session.commit()
            return jsonify(status=0)

@app.route('/notes/list')
def list_notes():
    notes = Note.query.all()
    noteinfoDictList = []
    for note in notes:
        noteinfoDictList.append(note.serialize())
    return json.dumps(noteinfoDictList) + "\n"

@app.route('/notes/<int:note_id>')
def show_note(note_id):
    note = Note.query.filter_by(id=note_id).first()
    if note == None:
        return jsonify(status=1)
    else:
        return jsonify(status=0, noteinfo=note.serialize())

# TODO
# sessions/create (type)
# sessions/list
# sessions/:session_id/ 

@app.route('/wordlist/day/<string:day>')
def list_word_by_day(day):
    # get the timestamp of the input day, i.e. "2016-10-23"
    ts_of_day = time.mktime(time.strptime(day, '%Y-%m-%d')) * 1000

    noteinfos = Note.query.filter(Note.timestamp>ts_of_day)
    wordinfos = []
    for noteinfo in noteinfos:
        wordinfo = Word.query.filter(Word.word==noteinfo.term).first()
        wordinfos.append(wordinfo)
    return render_template('wordlist.html', name=day, noteinfos=noteinfos, wordinfos=wordinfos)

@app.route('/words/create', methods=['POST'])
def create_word():
    if request.method == 'POST':
        word = request.form.get('word')
        wav = request.form.get('wav')
        if word == None or wav == None:
            return jsonify(status=1)
        else:
            db.session.add(Word(word, wav))
            rc = db.session.commit()
            print rc
            return jsonify(status=0)

@app.route('/words/<string:word>')
def show_word(word):
    wordinfo = Word.query.filter(Word.word==word).first()
    if wordinfo == None:
        return jsonify(status=1)
    else:
        return jsonify(status=0, wordinfo=wordinfo.serialize())

if __name__ == "__main__":
    app.run(host='0.0.0.0')
