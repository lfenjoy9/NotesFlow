from __future__ import absolute_import
from __future__ import division 
from __future__ import print_function 

from bson.json_util import loads
from db import Db
from flask import Flask
from flask import request
from flask_restful import Api
from flask_restful import Resource

app = Flask(__name__)
api = Api(app)

db = Db()

class Note(Resource):

    def put(self, note_id):
        note_id = db.insert_or_update_note(loads(request.form['data']))
        return {'status': 'ok', 'note_id': note_id}
    
    def get(self, note_id):
        return db.get_note(note_id)

api.add_resource(Note, '/note/<string:note_id>')

if __name__ == '__main__':
    app.run(host='0.0.0.0')