
## Start Mongo Db

./mongod --dbpath=/Users/l9mtv/workplaces/mongodb-osx-x86_64-3.6.6-7-gdef12b4/data

## Insert note 

curl http://localhost:5000/notes/note_id -d "data={\"note\": \"foo\", \"word\": \"foo\"}" -X POST

curl http://localhost:5000/notes/note_id -d "data={\"note\": \"bar\", \"word\": \"bar\"}" -X POST

curl http://localhost:5000/notes/note_id -d "data={\"note\": \"fred\", \"word\": \"fred\"}" -X POST

## Get session

curl http://localhost:5000/sessions/<session_id>


# Mongo Db Console

```
show dbs
```

```
use <db>
```

```
show collections
```

```
db.<collection>.count
```

```
db.words.find({'word':'test'})
```

```
db.words.drop()
```
