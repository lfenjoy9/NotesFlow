
## Start Mongo Db

./mongod --dbpath=/Users/l9mtv/workplaces/mongodb-osx-x86_64-3.6.6-7-gdef12b4/data

## PUT

curl http://localhost:5000/note/note_id -d "data={\"note\": \"foo\"}" -X PUT

## GET

curl http://localhost:5000/note/<note_id>