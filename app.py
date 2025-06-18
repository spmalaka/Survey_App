from flask import Flask, render_template, request
from db import get_connection
from datetime import datetime, date
import os
from setup_database import setup_database 

app = Flask(__name__)

# Initialize database
setup_database() 

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/submit', methods=['POST'])
def submit():
    full_name = request.form.get('full_name')
    email = request.form.get('email')
    contact_number = request.form.get('contact_number')
    dob_str = request.form.get('date_of_birth')
    favorite_food = ', '.join(request.form.getlist('favorite_food'))
    movies = request.form.get('movies')
    radio = request.form.get('radio')
    eating_out = request.form.get('eating_out')
    tv = request.form.get('tv')

    try:
        dob = datetime.strptime(dob_str, "%Y-%m-%d").date()
    except:
        return "Invalid date format", 400

    conn = get_connection()
    cursor = conn.cursor()

    # Insert data using SQLite parameter style (? instead of %s)
    cursor.execute("""
        INSERT INTO surveys (full_name, email, contact_number, date_of_birth, favorite_food, movies, radio, eating_out, tv)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (full_name, email, contact_number, dob, favorite_food, movies, radio, eating_out, tv))

    conn.commit()
    cursor.close()
    conn.close()

    return render_template("index.html")

@app.route('/results')
def results():
    conn = get_connection()
    cursor = conn.cursor()
    
    # SQLite doesn't have dictionary=True, but we set row_factory in db.py
    cursor.execute("SELECT * FROM surveys")
    surveys = cursor.fetchall()

    if not surveys:
        cursor.close()
        conn.close()
        return "No Surveys Available"

    
    ages = []
    for row in surveys:
        # Convert date string back to date object for calculation
        if isinstance(row['date_of_birth'], str):
            birth_date = datetime.strptime(row['date_of_birth'], "%Y-%m-%d").date()
        else:
            birth_date = row['date_of_birth']
        age = (date.today() - birth_date).days // 365
        ages.append(age)
    
    total_surveys = len(surveys)
    avg_age = sum(ages) // total_surveys if total_surveys > 0 else 0
    max_age = max(ages) if ages else 0
    min_age = min(ages) if ages else 0
    
   
    foods = []
    for row in surveys:
        if row['favorite_food']:
            foods.extend(row['favorite_food'].split(', '))
    
    total_foods = len(foods)
    if total_foods > 0:
        food_stats = {
            "pizza": round((foods.count("Pizza") / total_foods) * 100, 1),
            "pasta": round((foods.count("Pasta") / total_foods) * 100, 1),
            "Pap and Wors": round((foods.count("Pap and Wors") / total_foods) * 100, 1),
        }
    else:
        food_stats = {
            "pizza": 0.0,
            "pasta": 0.0,
            "Pap and Wors": 0.0,
        }

    def avg_rating(field_name):
        if total_surveys == 0:
            return 0.0
        total = sum(int(row[field_name]) for row in surveys if row[field_name] is not None)
        return round(total / total_surveys, 2)

    ratings = {
        "movies": avg_rating('movies'),
        "radio": avg_rating('radio'),
        "eating_out": avg_rating('eating_out'),
        "tv": avg_rating('tv'),
    }

    cursor.close()
    conn.close()

    return render_template("results.html",
                           total=total_surveys,
                           avg_age=avg_age,
                           max_age=max_age,
                           min_age=min_age,
                           food_stats=food_stats,
                           ratings=ratings)

if __name__ == '__main__':
    app.run(debug=True)
    #port = int(os.environ.get('PORT', 5000))
    #app.run(host='0.0.0.0', port=port, debug=False)