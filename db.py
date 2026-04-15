import psycopg2

def get_connection():
    return psycopg2.connect(
        host="localhost",
        database="india_location_db",
        user="postgres",
        password="password123"
    )