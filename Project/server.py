from flask import Flask
from flask import request
from flask_cors import CORS

import psycopg2
import json



app = Flask(__name__)
CORS(app)

@app.route("/")
def hello():
    return "Hello World!"


@app.route("/findmachine")
def findmachine():

    lat = request.args.get('lat')
    lng = request.args.get('lng')


    conn = psycopg2.connect("dbname='Parking' \
                             host='localhost' \
                             user='postgres' \
                             password='1q2w3e4r5t'")

    cur = conn.cursor()

    cur.execute("""SELECT vejnavn, type, ST_AsGeoJSON(geom)
    FROM parking
    WHERE ST_DWITHIN(
    	ST_SetSRID(ST_MakePoint(%s, %s), 4326)::geography, geom::geography, 1000)
    ORDER BY ST_DISTANCE(ST_SetSRID(
    	ST_MakePoint(%s, %s), 4326)::geography, geom::geography)
    LIMIT 1;""", (lng, lat, lng, lat ))

    res = cur.fetchone()

    vejnavn = res[0]
    type = res[1]

    closest_machine = json.dumps(res[2])
    closest_coords = closest_machine.split("[[")[1]

    coords = closest_coords.split("]]")[0]

    response = '{"type": "Feature","geometry": {"type": "Point","coordinates": ['+coords+']},"properties": {"vejnavn": "'+vejnavn+'", "type": "'+type+'"}}'




    cur.close()
    conn.close()


    return response





    #return "Find a machine at " + lat + ", " +lng
