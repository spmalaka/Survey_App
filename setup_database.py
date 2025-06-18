from db import get_connection

def setup_database():
    """Create the surveys table if it doesn't exist"""
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS surveys (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            full_name TEXT,
            email TEXT,
            contact_number TEXT,
            date_of_birth DATE,
            favorite_food TEXT,
            movies INTEGER,
            radio INTEGER,
            eating_out INTEGER,
            tv INTEGER
        )
    """)
    
    conn.commit()
    cursor.close()
    conn.close()
    print("Database setup complete!")

if __name__ == "__main__":
    setup_database()