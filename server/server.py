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
import json

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

    def post(self, session_id):
        session = request.get_json()
        db.update_session(session)
        return dumps({'status': 'ok'}), 200, {'Access-Control-Allow-Origin': '*'}

    def get(self, session_id):
        session_id = db.create_session(10)
        session = db.get_session(session_id)
        print(dumps(session))
        return dumps(session), 200, {'Access-Control-Allow-Origin': '*'}

    # https://stackoverflow.com/questions/19962699/flask-restful-cross-domain-issue-with-angular-put-options-methods
    def options (self, session_id):
        return {'Allow' : 'PUT' }, 200, \
            { 'Access-Control-Allow-Origin': '*', \
            'Access-Control-Allow-Methods' : 'PUT,GET,POST', \
            'Access-Control-Allow-Headers' : 'Content-Type' }


api.add_resource(Note, '/notes/<string:note_id>')
api.add_resource(Session, '/sessions/<string:session_id>')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)