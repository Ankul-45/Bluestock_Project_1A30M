import pandas as pd
import psycopg2

conn = psycopg2.connect(
    host="localhost",
    database="india_location_db",
    user="postgres",
    password="password123"
)

cur = conn.cursor()

df = pd.read_csv("cleaned_village_data.csv")

state_map = {}
district_map = {}
subdistrict_map = {}

for _, row in df.iterrows():

    # STATE
    if row['state_code'] not in state_map:
        cur.execute(
            "INSERT INTO states (code, name) VALUES (%s, %s) RETURNING id",
            (row['state_code'], row['state_name'])
        )
        state_id = cur.fetchone()[0]
        state_map[row['state_code']] = state_id
    else:
        state_id = state_map[row['state_code']]

    # DISTRICT
    if row['district_code'] not in district_map:
        cur.execute(
            "INSERT INTO districts (code, name, state_id) VALUES (%s, %s, %s) RETURNING id",
            (row['district_code'], row['district_name'], state_id)
        )
        district_id = cur.fetchone()[0]
        district_map[row['district_code']] = district_id
    else:
        district_id = district_map[row['district_code']]

    # SUBDISTRICT
    if row['subdistrict_code'] not in subdistrict_map:
        cur.execute(
            "INSERT INTO sub_districts (code, name, district_id) VALUES (%s, %s, %s) RETURNING id",
            (row['subdistrict_code'], row['subdistrict_name'], district_id)
        )
        subdistrict_id = cur.fetchone()[0]
        subdistrict_map[row['subdistrict_code']] = subdistrict_id
    else:
        subdistrict_id = subdistrict_map[row['subdistrict_code']]

    # VILLAGE (SAFE INSERT)
    cur.execute(
        """
        INSERT INTO villages (code, name, sub_district_id)
        VALUES (%s, %s, %s)
        ON CONFLICT (code) DO NOTHING
        """,
        (row['village_code'], row['village_name'], subdistrict_id)
    )

conn.commit()
cur.close()
conn.close()

print("Data inserted successfully ")