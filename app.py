from flask_sqlalchemy import SQLAlchemy
from flask import request, redirect, render_template, Flask, url_for, jsonify
from flask_security import Security, SQLAlchemyUserDatastore, UserMixin, RoleMixin, login_required, logout_user, current_user, LoginForm, RegisterForm
import datetime
from datetime import timedelta
from dateutil.relativedelta import relativedelta

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://filip:nowehaslo123@localhost/alarms' #user,password,database name
app.config['SECRET_KEY'] = 'super-secret'
app.config['SECURITY_REGISTERABLE'] = True
app.debug = True
app.permanent_session_lifetime = timedelta(minutes=20)

db = SQLAlchemy(app)
dbUser = SQLAlchemy(app)

#Database model

class Alarms(db.Model):
    __tablename__ = 'alarmsTable2'
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(50), unique=False)
    date = db.Column(db.DateTime(50), unique=False)
    value = db.Column(db.Float, unique=False)

    def __init__(self, type, date, value):
        self.type = type
        self.date = date
        self.value = value

    def __repr__(self):
        return '<Type: %r >' % (self.type)

    @property
    def serialize(self):
        return {
            'id': self.id,
            'type': self.type,
            'date': dump_datetime(self.date),
            'value': self.value,
        }


def dump_datetime(value):
    """Deserialize datetime object into string form for JSON processing."""
    if value is None:
        return None
    return [value.strftime("%Y-%m-%d"), value.strftime("%H:%M:%S")]


def getCurrentUser():
    return current_user.email


def getMonth():
    days = []
    now = datetime.datetime.now()
    day = now + relativedelta(months=-1)
    while day <= now + relativedelta(days=-1):
        day = day + relativedelta(days=+1)
        days.append(day.date().isoformat())
    return days


def getWeek():
    days = []
    now = datetime.datetime.now()
    day = now + relativedelta(days=-7)
    while day <= now + relativedelta(days=-1):
        day = day + relativedelta(days=+1)
        days.append(day.date().isoformat())
    return days


def avgTemperature(date, list):
    listAvg = []
    listRecords = []

    for o in range(0,len(date)):
        listAvg.append(0)
        listRecords.append(0)

    for k in range(0,len(list)):
        strDate= str(list[k].date.year)+"-"+str(list[k].date.month)+"-"+str(list[k].date.day)
        for i in range(0,len(date)):
            if (strDate == date[i]):
                listAvg[i] += list[k].value
                listRecords[i] +=1

    for j in range(0,len(listAvg)):
        if(listAvg[j]!=0):
            listAvg[j] = listAvg[j]/listRecords[j]

    return listAvg

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

#  Create a user to test with
'''
@app.before_first_request
def create_user():
    db.create_all()
    user_datastore.create_user(email='alcart', password='nowehaslo123')
    db.session.commit()
'''

@app.route("/")
@login_required
def index():
    return render_template('index.html', currentUserName=getCurrentUser())


@app.route("/charts.html")
@login_required
def charts():
    return render_template('charts.html', currentUserName=getCurrentUser())


@app.route("/tables.html")
@login_required
def tables():
    return render_template('tables.html', currentUserName=getCurrentUser())


@app.route("/logout")
def logout():
    logout_user
    return render_template('index.html')


@app.route("/background", methods=['GET', 'POST'])
def background():
    now = datetime.datetime.now()


    ## All queries
    kontaktron1 = Alarms.query.filter_by(type="kontaktron1")
    move = Alarms.query.filter_by(type="move")
    smoke = Alarms.query.filter_by(type="smoke")
    water = Alarms.query.filter_by(type="water")
    temperature = Alarms.query.filter_by(type="temperature")

    kontaktron1Month = Alarms.query.filter(Alarms.type == "kontaktron1", Alarms.date.between(now + relativedelta(months=-1), now))
    moveMonth = Alarms.query.filter(Alarms.type == "move", Alarms.date.between(now + relativedelta(months=-1), now))
    smokeMonth = Alarms.query.filter(Alarms.type == "smoke", Alarms.date.between(now + relativedelta(months=-1), now))
    waterMonth = Alarms.query.filter(Alarms.type == "water", Alarms.date.between(now + relativedelta(months=-1), now))
    temperatureMonth = Alarms.query.filter(Alarms.type == "temperature",Alarms.date.between(now + relativedelta(months=-1), now+ relativedelta(days=1)))
    temperatureMonthList = temperatureMonth.all()

    kontaktron1Week = Alarms.query.filter(Alarms.type == "kontaktron1",Alarms.date.between(now + relativedelta(days=-7), now))
    moveWeek = Alarms.query.filter(Alarms.type == "move", Alarms.date.between(now + relativedelta(days=-7), now))
    smokeWeek = Alarms.query.filter(Alarms.type == "smoke", Alarms.date.between(now + relativedelta(days=-7), now))
    waterWeek = Alarms.query.filter(Alarms.type == "water", Alarms.date.between(now + relativedelta(days=-7), now))
    temperatureWeek = Alarms.query.filter(Alarms.type == "temperature",Alarms.date.between(now + relativedelta(days=-8), now+ relativedelta(days=1)))
    temperatureWeekList = temperatureWeek.all()

    return jsonify(kontaktron1List=[i.serialize for i in kontaktron1],
                   moveList=[i.serialize for i in move],
                   smokeList=[i.serialize for i in smoke],
                   waterList=[i.serialize for i in water],
                   temperatureList=[i.serialize for i in temperature],
                   kontaktron1MonthList=[i.serialize for i in kontaktron1Month],
                   moveMonthList=[i.serialize for i in moveMonth],
                   smokeMonthList=[i.serialize for i in smokeMonth],
                   waterMonthList=[i.serialize for i in waterMonth],
                   temperatureMonthist=[i.serialize for i in temperatureMonth],
                   kontaktron1WeekList=[i.serialize for i in kontaktron1Week],
                   moveWeekList=[i.serialize for i in moveWeek],
                   smokeWeekList=[i.serialize for i in smokeWeek],
                   waterWeekList=[i.serialize for i in waterWeek],
                   temperatureWeekList=[i.serialize for i in temperatureWeek],
                   daysFromMonth=getMonth(),
                   daysFromWeek=getWeek(),
                   temperatureNow=temperatureWeekList[len(temperatureWeekList) - 1].serialize,
                   avgTemperatureWeekList=avgTemperature(getWeek(), temperatureWeekList),
                   avgTemperatureMonthList=avgTemperature(getMonth(), temperatureMonthList))

if __name__ == "__main__":
    # Create all database
    # db.create_all()
    app.run()
