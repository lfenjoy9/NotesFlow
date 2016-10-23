# http://flask-sqlalchemy.pocoo.org/2.1/quickstart/
# create_all()
# \list List Database
# \dt
# CREATE DATABASE testdb1;
# \d note Describe 
# \d db_name Use database
# db.session.add(Note('note1', 'sentence1', 0, 'url1', 1, "term1"))
# db.session.add(Note('note2', 'sentence2', 0, 'url2', 2, "term2"))
# db.session.commit()
# notes = Note.query.all()
# note = Note.query.filter_by(id='admin').first()

# https://www.liquidweb.com/kb/how-to-install-pip-on-ubuntu-14-04-lts/

# http://flask.pocoo.org/docs/0.11/installation/
# http://stackoverflow.com/questions/7023052/flask-configure-dev-server-to-be-visible-across-the-network

# Postgre DB

psql -h localhost -U l9mtv mynotes
http://www.saintsjd.com/2014/08/13/howto-install-postgis-on-ubuntu-trusty.html

DROP TABLE mynotes;

# https://www.howtoinstall.co/en/ubuntu/trusty/python-flask-sqlalchemy
# http://stackoverflow.com/questions/11583714/install-psycopg2-on-ubuntu


# ec2-35-160-132-194.us-west-2.compute.amazonaws.com
# 35.160.132.194:8000

# gunicorn

gunicorn helloworld:app -b 0.0.0.0:8000 --daemon
http://docs.gunicorn.org/en/stable/install.html

ps ax|grep gunicorn

# Test

curl -i http://localhost:5000/notes/list
curl -i http://35.160.132.194:8000/notes/list

curl -i http://localhost:5000/notes/3

curl -i -X POST -H "application/x-www-form-urlencoded" http://localhost:5000/notes/create \
  -d 'note=Import&sentence=Import&url=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FWeb%2FJavaScript%2FReference%2FGlobal_Objects%2FencodeURIComponentl&offset=100&timestamp=100'

# URL Encoding

decodeURIComponent()
encodeURIComponent()
