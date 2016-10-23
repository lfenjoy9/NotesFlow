from db import Note
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
import json

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://l9mtv@localhost:5432/mynotes'

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

if __name__ == "__main__":
    app.run(host='0.0.0.0')