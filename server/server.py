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

    def put(self, note_id):
        db.insert_note(loads(request.form['data']))
        return {'status': 'ok'}
    
    def get(self, note_id):
        # Do nothing.
        return {'status': 'ok'}

class Session(Resource):

    def put(self, session_id):
        db.update_session(loads(request.form['data']))
        return {'status': 'ok'}

    def get(self, session_id):
        session_id = db.create_session()
        session = db.get_session(session_id)
        return dumps(session)

api.add_resource(Note, '/note/<string:note_id>')
api.add_resource(Session, '/session/<string:session_id>')

if __name__ == '__main__':
    app.run(host='0.0.0.0')