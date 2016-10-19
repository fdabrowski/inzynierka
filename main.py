from flask_sqlalchemy import SQLAlchemy
from flask import request, redirect, render_template, Flask, url_for, jsonify
from flask_security import Security, SQLAlchemyUserDatastore, UserMixin, RoleMixin, login_required
import datetime
from datetime import timedelta
#from json import dumps
import json

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://filip:nowehaslo123@localhost/alarms'
app.config['SECRET_KEY'] = 'super-secret'
app.debug=True
app.permanent_session_lifetime = timedelta(minutes=20)

db = SQLAlchemy(app)
dbUser = SQLAlchemy(app)

class Alarms(db.Model):
    __tablename__ = 'alarmsTable2'
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(50), unique=False)
    date = db.Column(db.DateTime(50), unique=False)

    def __init__(self, type, date):
        self.type = type
        self.date = date

    def __repr__(self):
        return '<Type: %r >' % (self.type)

    @property
    def serialize(self):
       return {
           'id': self.id,
           'type': self.type,
           'date': dump_datetime(self.date),
       }

def dump_datetime(value):
    """Deserialize datetime object into string form for JSON processing."""
    if value is None:
        return None
    return [value.strftime("%Y-%m-%d"), value.strftime("%H:%M:%S")]

#################################################################################
# Define models
roles_users = dbUser.Table('roles_users',
        dbUser.Column('user_id', dbUser.Integer(), dbUser.ForeignKey('user.id')),
        dbUser.Column('role_id', dbUser.Integer(), dbUser.ForeignKey('role.id')))

class Role(dbUser.Model, RoleMixin):
    id = dbUser.Column(dbUser.Integer(), primary_key=True)
    name = dbUser.Column(dbUser.String(80), unique=True)
    description = dbUser.Column(dbUser.String(255))

class User(dbUser.Model, UserMixin):
    id = dbUser.Column(db.Integer, primary_key=True)
    email = dbUser.Column(db.String(255), unique=True)
    password = dbUser.Column(db.String(255))
    active = dbUser.Column(db.Boolean())
    confirmed_at = dbUser.Column(db.DateTime())
    roles = dbUser.relationship('Role', secondary=roles_users,
                            backref=dbUser.backref('users', lazy='dynamic'))

# Setup Flask-Security
user_datastore = SQLAlchemyUserDatastore(dbUser, User, Role)
security = Security(app, user_datastore)

# Create a user to test with
@app.before_first_request
def create_user():
    db.create_all()
    user_datastore.create_user(email='alcart', password='nowehaslo123')
    db.session.commit()
#################################################################################

@app.route("/")
@login_required
def index():
    all = Alarms.query.all()
    kontaktron1 = Alarms.query.filter_by(type="kontaktron1")
    kontaktron2 = Alarms.query.filter_by(type="kontaktron2")
    move = Alarms.query.filter_by(type="move")
    smoke = Alarms.query.filter_by(type="smoke")
    water = Alarms.query.filter_by(type="water")
    highTemperature = Alarms.query.filter_by(type="highTemperature")

    #data =jsonify(kontaktron1=[i.serialize for i in kontaktron1], kontaktron2=[i.serialize for i in kontaktron2],
    #               move=[i.serialize for i in move], smoke=[i.serialize for i in smoke],
    #               water=[i.serialize for i in water], highTemperature = [i.serialize for i in highTemperature])

    return render_template('index.html', all=all, kontaktron1=kontaktron1, kontaktron2=kontaktron2, move=move, smoke=smoke, water=water, highTemperature=highTemperature)

@app.route("/background", methods=['GET','POST'])
def background():
    kontaktron1 = Alarms.query.filter_by(type="kontaktron1")
    kontaktron2 = Alarms.query.filter_by(type="kontaktron2")
    move = Alarms.query.filter_by(type="move")
    smoke = Alarms.query.filter_by(type="smoke")
    water = Alarms.query.filter_by(type="water")
    highTemperature = Alarms.query.filter_by(type="highTemperature")

    return jsonify(kontaktron1List=[i.serialize for i in kontaktron1], kontaktron2List=[i.serialize for i in kontaktron2],
                   moveList=[i.serialize for i in move], smokeList=[i.serialize for i in smoke],
                   waterList=[i.serialize for i in water], highTemperatureList=[i.serialize for i in highTemperature])

@app.route("/post_user", methods=['POST'])
def post_user():
    alarms = Alarms(request.form['type'], datetime.datetime.now())
    db.session.add(alarms)
    db.session.commit()
    user_datastore.deactivate_user(User)
    return redirect(url_for('index'))

if __name__ == "__main__":
    #db.create_all()
    app.run()