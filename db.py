import os
import sqlite3
from dotenv import load_dotenv

load_dotenv()

def get_connection():
    # Get database path from environment or use default
    db_path = os.getenv("DATABASE_PATH", "app.db")
    
    # Create connection to SQLite database
    conn = sqlite3.connect(db_path)
    
    # This makes rows behave like dictionaries (optional but helpful)
    conn.row_factory = sqlite3.Row
    
    return conn

# Optional: Helper function to execute queries
def execute_query(query, params=None):
    conn = get_connection()
    try:
        cursor = conn.cursor()
        if params:
            cursor.execute(query, params)
        else:
            cursor.execute(query)
        
        # For SELECT queries
        if query.strip().upper().startswith('SELECT'):
            return cursor.fetchall()
        
        # For INSERT, UPDATE, DELETE
        conn.commit()
        return cursor.rowcount
    finally:
        conn.close()

# Helper function to get a single record
def fetch_one(query, params=None):
    conn = get_connection()
    try:
        cursor = conn.cursor()
        if params:
            cursor.execute(query, params)
        else:
            cursor.execute(query)
        return cursor.fetchone()
    finally:
        conn.close()

# Helper function to get multiple records
def fetch_all(query, params=None):
    conn = get_connection()
    try:
        cursor = conn.cursor()
        if params:
            cursor.execute(query, params)
        else:
            cursor.execute(query)
        return cursor.fetchall()
    finally:
        conn.close()




