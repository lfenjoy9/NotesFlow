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
        

if __name__ == '__main__':
    unittest.main()