from __future__ import absolute_import
from __future__ import division 
from __future__ import print_function 

from bson.json_util import dumps
from pymongo import MongoClient
from math import floor
import time
import uuid

DAYS_MILLI_SECS = 24 * 3600 * 1000 

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
            word['new_word'] = True 
            word['word'] = note['word']
            word['notes'] = []
            word['errors'] = 0
            word["last_review_time"] = 0 
            word['num_reviews'] = 0 
        else:
            if word['notes'] == None:
                word['notes'] = []
            self.words.delete_one({'word': note['word']})
        word['notes'].append(note)
        self.words.insert(word)

    
    def create_session(self, size=1):
        session = {}
        session['session_id'] = uuid.uuid1().hex 
        session['words'] = self.select_words(size)
        session['completedTime'] = 0
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
        for word in session['words']:
            self.update_word(word['word'], errors=word['errors'], last_review_time=session['completedTime'])
        self.sessions.insert(session)
        

    def update_word(self, word, errors, last_review_time):
        w = self.words.find_one({'word': word})
        # Clear new_word flag. 
        w['new_word'] = False 
        w['errors'] += errors
        w["last_review_time"] = last_review_time
        w['num_reviews'] += 1 
        self.words.update_one({'word': word}, {"$set": w}, upsert=False)
        

    def select_words(self, size=50):
        new_words = self.select_new_words(size)
        old_words = self.select_old_words(-1, 0, size) 
        error_words = self.select_error_words()
        words = self.merge([new_words, old_words, error_words], size)
        return words 


    def merge(self, words_srcs, size):
        words = []
        num_srcs = len(words_srcs)
        src_indices = [0] * num_srcs
        word_set = set()
        index = 0
        while len(words) < size and len(words_srcs) > 0:
            if src_indices[index] < len(words_srcs[index]):
               item = words_srcs[index][src_indices[index]]
               if item['word'] not in word_set:
                   words.append(item)
                   word_set.add(item['word'])
               src_indices[index] += 1
               index += 1
               if index >= len(words_srcs):
                   index = 0
            else:
                del words_srcs[index]
                del src_indices[index]
                if index >= len(words_srcs):
                   index = 0
        return words 


    def select_new_words(self, size=20):
        """Return words from new_words collection.""" 
        words = self.words.aggregate([
            {'$match': {'new_word': True}},
            {'$sample': {'size': size}},
        ])
        return list(words)


    def select_error_words(self, size=20):
        return []


    def get_today_start_timestamp_sec(self):
        """Return the starting timestmap in sec for today."""
        day_sec = int(floor(time.time()/(3600*24)-1)*(3600*24) + (3600*7))
        return day_sec


    # -1, 0
    # -3, -1
    # -7, -3
    def select_old_words(self, start, end, size=20):
        start_timestamp_ms = self.get_today_start_timestamp_sec() * 1000  + start * DAYS_MILLI_SECS
        end_timestamp_ms = self.get_today_start_timestamp_sec() * 1000  + end * DAYS_MILLI_SECS
        print("start_timestamp_ms:", start_timestamp_ms, "end_timestamp_ms:", end_timestamp_ms)
        words = self.words.aggregate([
            {
                '$match': {
                    'last_review_time': {'$gt': start_timestamp_ms, '$lt': end_timestamp_ms},
                }
            },
            {'$sample': {'size': size}},
        ])
        return list(words)
    

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
    session['completedTime'] = (int(time.time() - 3600 * 24))*1000
    db.update_session(session)
    print(db.get_word('bar'))
    print(db.get_word('get_today_start_timestamp_sec'))
    print(db.get_word('poo'))
    print(db.get_word('goo'))
    print(db.get_word('fred'))
    print("select new words (size=1)")
    print(db.select_new_words(1))
    print(db.get_session(session_id))
    print("select old words.")
    print(len(db.select_old_words(-1, 0)))
