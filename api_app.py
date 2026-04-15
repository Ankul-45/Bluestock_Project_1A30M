from flask import Flask, jsonify
from db import get_connection
from flask import request


app = Flask(__name__)
def check_api_auth():
    api_key = request.headers.get("x-api-key")
    api_secret = request.headers.get("x-api-secret")

    conn = get_connection()
    cur = conn.cursor()

    cur.execute(
        "SELECT * FROM api_keys WHERE api_key = %s AND api_secret = %s",
        (api_key, api_secret)
    )

    result = cur.fetchone()

    cur.close()
    conn.close()

    return result is not None

# Get all states
@app.route("/states", methods=["GET"])
def get_states():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("SELECT id, name FROM states ORDER BY name")
    data = cur.fetchall()

    cur.close()
    conn.close()

    return jsonify([
        {"id": row[0], "name": row[1]}
        for row in data
    ])

#Get districts by state
@app.route("/states/<int:state_id>/districts", methods=["GET"])
def get_districts(state_id):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute(
        "SELECT id, name FROM districts WHERE state_id = %s ORDER BY name",
        (state_id,)
    )
    data = cur.fetchall()

    cur.close()
    conn.close()

    return jsonify([
        {"id": row[0], "name": row[1]}
        for row in data
    ])

#Get subdistricts
@app.route("/districts/<int:district_id>/subdistricts", methods=["GET"])
def get_subdistricts(district_id):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute(
        "SELECT id, name FROM sub_districts WHERE district_id = %s ORDER BY name",
        (district_id,)
    )
    data = cur.fetchall()

    cur.close()
    conn.close()

    return jsonify([
        {"id": row[0], "name": row[1]}
        for row in data
    ])

#Get villages
@app.route("/subdistricts/<int:subdistrict_id>/villages", methods=["GET"])
def get_villages(subdistrict_id):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute(
        "SELECT id, name FROM villages WHERE sub_district_id = %s ORDER BY name LIMIT 100",
        (subdistrict_id,)
    )
    data = cur.fetchall()

    cur.close()
    conn.close()

    return jsonify([
        {"id": row[0], "name": row[1]}
        for row in data
    ])
@app.route("/search", methods=["GET"])
def search():
    query = request.args.get("q")

    conn = get_connection()
    cur = conn.cursor()

    cur.execute(
        """
        SELECT v.name, sd.name, d.name, s.name
        FROM villages v
        JOIN sub_districts sd ON v.sub_district_id = sd.id
        JOIN districts d ON sd.district_id = d.id
        JOIN states s ON d.state_id = s.id
        WHERE v.name ILIKE %s
        LIMIT 20
        """,
        (f"%{query}%",)
    )

    data = cur.fetchall()

    cur.close()
    conn.close()

    return jsonify([
        {
            "village": row[0],
            "subdistrict": row[1],
            "district": row[2],
            "state": row[3]
        }
        for row in data
    ])
if __name__ == "__main__":
    app.run(debug=True)