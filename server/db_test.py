import unittest
from db import Db
import time


class TestStringMethods(unittest.TestCase):

    def setUp(self):
        self.db = Db(db_name='testdb') 
        self.db.reset()
        self.db.insert_note({'note': 'bar', 'word': 'bar'})
        self.db.insert_note({'note': 'fred', 'word': 'fred'})
        self.db.insert_note({'note': 'foo', 'word': 'foo'})
        self.db.insert_note({'note': 'poo', 'word': 'poo'})
        self.db.insert_note({'note': 'goo', 'word': 'goo'})

    def test_merge1(self):
        words1 = [{'word': "foo1"}, {'word': 'fred1'}]
        words2 = [{'word': "foo2"}, {'word': 'fred2'}]
        words3 = [{'word': "foo3"}, {'word': 'fred3'}]
        words = self.db.merge([words1, words2, words3], 4)
        self.assertEqual(words, [{'word': 'foo1'}, {'word': 'foo2'}, 
            {'word': 'foo3'}, {'word': 'fred1'}])

        
    def test_merge2(self):
        words1 = [{'word': "foo1"}, {'word': 'fred1'}]
        words2 = [{'word': "foo2"}, {'word': 'fred2'}]
        words3 = [{'word': "foo3"}, {'word': 'fred3'}]
        words = self.db.merge([words1, words2, words3], 6)
        self.assertEqual(words, [{'word': 'foo1'}, {'word': 'foo2'}, 
            {'word': 'foo3'}, {'word': 'fred1'}, {'word': 'fred2'}, {'word': 'fred3'}])


    def test_merge3(self):
        words1 = [{'word': "foo1"}, {'word': 'fred1'}]
        words2 = [{'word': "foo2"}, {'word': 'fred2'}]
        words3 = [{'word': "foo3"}, {'word': 'fred3'}]
        words = self.db.merge([words1, words2, words3], 7)
        self.assertEqual(words, [{'word': 'foo1'}, {'word': 'foo2'}, 
            {'word': 'foo3'}, {'word': 'fred1'}, {'word': 'fred2'}, {'word': 'fred3'}])


    def test_merge_duplicate_word(self):
        words1 = [{'word': "foo1"}, {'word': 'fred'}]
        words2 = [{'word': "foo2"}, {'word': 'fred'}]
        words3 = [{'word': "foo3"}, {'word': 'fred'}]
        words = self.db.merge([words1, words2, words3], 6)
        self.assertEqual(words, [{'word': 'foo1'}, {'word': 'foo2'}, 
            {'word': 'foo3'}, {'word': 'fred'}])


    def test_merge_empty_src1(self):
        words1 = [{'word': "foo1"}, {'word': 'fred1'}]
        words = self.db.merge([words1, [], []], 6)
        self.assertEqual(words, [{'word': "foo1"}, {'word': 'fred1'}])


    def test_merge_empty_src2(self):
        words1 = [{'word': "foo1"}, {'word': 'fred1'}]
        words = self.db.merge([[], words1, []], 6)
        self.assertEqual(words, [{'word': "foo1"}, {'word': 'fred1'}])


    def test_get_error_words(self):
        session_id = self.db.create_session(1)
        session = self.db.get_session(session_id)
        session['status'] = 'completed'
        session['completedTime'] = (int(time.time() - 3600 * 24))*1000
        session['words'][0]['errors'] = 1
        error_word = session['words'][0]['word']
        self.db.update_session(session)
        error_words_selected = self.db.select_error_words(-3, 0)
        self.assertEqual(len(error_words_selected), 1)
        self.assertEqual(error_words_selected[0]['word'], error_word)
        

    def test_select_old_words(self):
        session_id = self.db.create_session(2)
        session = self.db.get_session(session_id)
        words_of_session = list(map(lambda word: word['word'], session['words']))
        session['status'] = 'completed'
        session['completedTime'] = (int(time.time() - 3600 * 24))*1000
        self.db.update_session(session)
        old_words =  list(map(lambda word: word['word'], self.db.select_old_words(-1, 0)))
        self.assertListEqual(words_of_session, old_words)


    def test_insert_note(self):
       self.db.insert_note({'word': 'poopp', 'note': 'This is poopp.'})
       word = self.db.get_word('poopp') 
       self.assertEqual(word['word'], 'poopp')
       self.assertEqual(word['notes'][0]['note'], 'This is poopp.')
       self.db.insert_note({'word': 'poopp', 'note': 'This is poopp again.'})
       word = self.db.get_word('poopp') 
       self.assertEqual(word['notes'][0]['note'], 'This is poopp.')
       self.assertEqual(word['notes'][1]['note'], 'This is poopp again.')


    def test_session(self):
        session_id = self.db.create_session(2)
        session = self.db.get_session(session_id)
        self.assertEqual(len(session['words']), 2)
        session['status'] = 'completed'
        session['completedTime'] = (int(time.time() - 3600 * 24))*1000
        self.db.update_session(session)
        session = self.db.get_session(session_id)


if __name__ == '__main__':
    unittest.main()