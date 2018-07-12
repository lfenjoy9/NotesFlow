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
        self.notes = self.db.notes

    def get_note(self, note_id):
        note = self.notes.find_one({'note_id': note_id})
        return dumps(note)

    def insert_or_update_note(self, note):
        note_id = uuid.uuid1().hex
        note['note_id'] = note_id       
        self.notes.insert(note)
        return note_id
        print('Note added.')
    
if __name__ == '__main__':
    db = Db()
    note_id = db.insert_or_update_note({'note': 'bar'})
    print(db.get_note(note_id))
