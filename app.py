# Flask is a Python web developpement framework to build web applications. It comes with jinja2, a templating language for Python, and Werkzeug, a WSGI utility module.
# PostgreSQL is an open source relational database system which, as its name suggests,
# uses SQL.
# SQLAlchemy is an Object Relational Mapper (ORM), it is a layer between
# object oriented Python and the database schema of Postgres.


import os
from flask import Flask
from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
from datetime import datetime
from datetime import timedelta

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Database Setup
#################################################

from flask_sqlalchemy import SQLAlchemy
from config import (POSTGRES_URL,POSTGRES_USER,POSTGRES_PW,POSTGRES_DB)


# Remove tracking modifications # Enable debugging
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['Debug']=True

# connect to the postgress database
# DB_URL = 'postgresql+psycopg2://postgres:Mercydb1@localhost:{db}'.format(user=POSTGRES_USER,pw=POSTGRES_PW,url=POSTGRES_URL,db=POSTGRES_DB)
DB_URL = 'postgresql://{user}:{pw}@{url}/{db}'.format(user=POSTGRES_USER,pw=POSTGRES_PW,url=POSTGRES_URL,db=POSTGRES_DB)
app.config['SQLALCHEMY_DATABASE_URI'] = DB_URL


db = SQLAlchemy(app)

engine = create_engine(DB_URL)
# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)

# Save reference to the table
Dataset = Base.classes.covid_cases
State = Base.classes.state_county_info


@app.route("/")
def index():
    print("index page requested")
    return render_template("/index.html")

@app.route("/about")
def about():
    print("about page requested")
    return render_template("about.html")  


@app.route("/data/state")
# dataset to bee used for the map markers
def datastate():
    print("State ICU beds/population data requested")

   # Create our session (link) from Python to the DB
    session = Session(engine)
    results=session.query(State.state,func.count(State.county_id).label("county_count"),func.sum(State.population).label("population"),func.sum(State.icu_beds).label("beds")).group_by(State.state)
    # Create a dictionary from the row data and append to a list of all_passengers
    data_list = []
    for row in results:
        data_dict={
        "state":row.state,
        "county_count":row.county_count,
        "Population": str(row.population),
        "beds":str(row.beds)
        }
        data_list.append(data_dict)
        
      # close session
    session.close()

    return jsonify(data_list)

 

    # return redirect("/")

@app.route("/data/cases")
# dataset to bee used for covid cases 
def datacases():
    print("covid-19 cases data requested")

   # Create our session (link) from Python to the DB
    session = Session(engine)
    
    # results=session.query(Dataset.state,func.count(Dataset.county_id).label("county_count"),Dataset.month,func.sum(Dataset.confirmed).label("confirmed"),func.sum(Dataset.deaths).label("deaths"),func.sum(Dataset.recovered).label("recovered")).group_by(Dataset.state,Dataset.month)
    results=session.query(Dataset.state,func.count(Dataset.county_id).label("county_count"),Dataset.month,func.sum(Dataset.confirmed).label("confirmed"),func.sum(Dataset.deaths).label("deaths"),func.sum(Dataset.recovered).label("recovered")).group_by(Dataset.state,Dataset.month)
    # Create a dictionary from the row data and append to a list of all_passengers func.month(Dataset.occurence_date)
    cases_list = []
    for row in results:
        cases_dict={
        "state":row.state,
        "month":row.month,
        "confirmed":str(row.confirmed),
        "recovered": str(row.recovered),
        "deaths":str(row.deaths)
        }
        cases_list.append(cases_dict)
        
 

    # close session
    session.close()

    return jsonify(cases_list)

    # return redirect("/")


@app.route("/data/casessummary")
# dataset to bee used for covid cases 
def datacasessummary():
    print("covid-19 cases summary data requested")

   # Create our session (link) from Python to the DB
    session = Session(engine)
    
    results=session.query(Dataset.state,func.sum(Dataset.confirmed).label("confirmed"),func.sum(Dataset.deaths).label("deaths"),func.sum(Dataset.recovered).label("recovered")).group_by(Dataset.state)
    casessummary_list = []
    for row in results:
        cases_dict={
        "state":row.state,
        "confirmed":str(row.confirmed),
        "recovered": str(row.recovered),
        "deaths":str(row.deaths)
        }
        casessummary_list.append(cases_dict)
        
 

    # close session
    session.close()

    return jsonify(casessummary_list)

    # return redirect("/")

if __name__ == "__main__":
    app.run()