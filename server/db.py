from __future__ import absolute_import
from __future__ import division 
from __future__ import print_function 

from bson.json_util import dumps
from pymongo import MongoClient
import uuid

class Db:
    
    def __init__(self, db_name='mydb'):
        self.client = MongoClient()
        self.db = self.client[db_name]
        self.sessions = self.db.sessions
        self.words = self.db.words

    def reset(self):
        self.words.drop()

    def get_word(self, w):
        word = self.words.find_one({'word': w})
        return word 

    def insert_note(self, note):
        word = self.words.find_one({'word': note['word']})
        if word == None:
            word = {}
            word['word_id'] = uuid.uuid1().hex
            word['word'] = note['word']
            word['notes'] = []
        else:
            if word['notes'] == None:
                word['notes'] = []
            self.words.delete_one({'word': note['word']})
        word['notes'].append(note)
        self.words.insert(word)
    
    def create_session(self, size=1):
        words = self.words.aggregate([
            {'$sample': {'size': size}}
        ])
        session = {}
        session['session_id'] = uuid.uuid1().hex 
        session['words'] = list(words)
        self.sessions.insert(session)
        return session['session_id']
        
    def get_session(self, session_id):
        session = self.sessions.find_one({'session_id': session_id})
        return session 
    
    def update_session(self, session):
        if self.sessions.find_one({'session_id': session['session_id']}) != None:
            self.sessions.delete_one({'session_id': session['session_id']})
        # Cleanup '_id'
        del session['_id']
        for x in session['words']:
            del x['_id']
        self.sessions.insert(session)
        
if __name__ == '__main__':
    db = Db(db_name='testdb')
    db.reset()
    db.insert_note({'note': 'bar', 'word': 'bar'})
    print(db.get_word('bar'))
    db.insert_note({'note': 'fred', 'word': 'fred'})
    db.insert_note({'note': 'foo', 'word': 'foo'})
    db.insert_note({'note': 'poo', 'word': 'poo'})
    db.insert_note({'note': 'goo', 'word': 'goo'})
    print("create session.")
    session_id = db.create_session(2)
    session = db.get_session(session_id)
    print(session)
    print("update session.")
    session['status'] = 'completed'
    db.update_session(session)
    print(db.get_session(session_id))
