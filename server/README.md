
## Start Mongo Db

./mongod --dbpath=/Users/l9mtv/workplaces/mongodb-osx-x86_64-3.6.6-7-gdef12b4/data

## Insert note 

curl http://localhost:5000/notes/note_id -d "data={\"note\": \"foo\", \"word\": \"foo\"}" -X PUT

curl http://localhost:5000/notes/note_id -d "data={\"note\": \"bar\", \"word\": \"bar\"}" -X PUT

curl http://localhost:5000/notes/note_id -d "data={\"note\": \"fred\", \"word\": \"fred\"}" -X PUT

## Get session

curl http://localhost:5000/sessions/<session_id>