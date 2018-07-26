import unittest
from db import Db

db = Db()

class TestStringMethods(unittest.TestCase):

    def setUp(self):
        self.db = Db(db_name='testdb') 
        self.db.reset()

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


if __name__ == '__main__':
    unittest.main()