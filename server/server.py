from __future__ import absolute_import
from __future__ import division 
from __future__ import print_function 

from bson.json_util import loads
from bson.json_util import dumps
from db import Db
from flask import Flask
from flask import request
from flask_restful import Api
from flask_restful import Resource

app = Flask(__name__)
api = Api(app)

db = Db()

class Note(Resource):

    def post(self, note_id):
        note = request.get_json()
        print(note)
        db.insert_note(note)
        return {'status': 'ok'}
    
    def get(self, note_id):
        # Do nothing.   
        return {'status': 'ok'}

class Session(Resource):

    def put(self, session_id):
        db.update_session(loads(request.form['data']))
        return {'status': 'ok'}

    def get(self, session_id):
        session_id = db.create_session(10)
        session = db.get_session(session_id)
        print(dumps(session))
        return dumps(session), 200, {'Access-Control-Allow-Origin': '*'}

api.add_resource(Note, '/notes/<string:note_id>')
api.add_resource(Session, '/sessions/<string:session_id>')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)