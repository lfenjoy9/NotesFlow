from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://l9mtv:mtvl9@localhost:5432/mynotes'
db = SQLAlchemy(app)

# id, note, sentence, offset, url, timestamp, term
class Note(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    note = db.Column(db.String())
    sentence = db.Column(db.String())
    offset = db.Column(db.Integer)
    url = db.Column(db.String())
    timestamp = db.Column(db.BigInteger)
    term = db.Column(db.String())

    def __init__(self, note, sentence, offset, url, timestamp, term):
        self.note = note
        self.sentence = sentence
        self.offset = offset
        self.url = url
        self.timestamp = timestamp
        self.term = term

    def __repr__(self):
        return '<Note %d %s>' % (self.id, self.note)

    def serialize(self):
        return {
            'id': self.id,
            'note': self.note,
            'sentence': self.sentence,
            'offset': self.offset,
            'url': self.url,
            'timestamp': self.timestamp,
            'term': self.term,
        }

