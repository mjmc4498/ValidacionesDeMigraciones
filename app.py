from flask import Flask, render_template, request

app = Flask(__name__)

def generate_nulidad_script(table, fields, filter_condition, date_range):
    fields_to_check = " AND ".join([f"{field} IS NULL" for field in fields])
    where_clause = f"WHERE {fields_to_check}"
    if filter_condition:
        where_clause += f" AND {filter_condition}"
    if date_range:
        where_clause += f" AND {date_range}"
    return f"SELECT {', '.join(fields)} FROM {table} {where_clause};"

def generate_totalidad_script(table, filter_condition, date_range):
    where_clause = ""
    if filter_condition or date_range:
        where_clause = "WHERE "
        conditions = []
        if filter_condition:
            conditions.append(filter_condition)
        if date_range:
            conditions.append(date_range)
        where_clause += " AND ".join(conditions)

    return f"SELECT COUNT(*) FROM {table} {where_clause};"

def generate_duplicados_script(table, fields, filter_condition, date_range):
    fields_str = ", ".join(fields)
    where_clause = ""
    if filter_condition or date_range:
        where_clause = "WHERE "
        conditions = []
        if filter_condition:
            conditions.append(filter_condition)
        if date_range:
            conditions.append(date_range)
        where_clause += " AND ".join(conditions)
    return f"SELECT {fields_str}, COUNT(*) FROM {table} {where_clause} GROUP BY {fields_str} HAVING COUNT(*) > 1;"


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate():
    table = request.form['table']
    fields = [field.strip() for field in request.form['fields'].split(',')]
    filter_condition = request.form['filter']
    start_date = request.form['start_date']
    end_date = request.form['end_date']

    date_range = ""
    if start_date and end_date:
        date_range = f"fecha BETWEEN '{start_date}' AND '{end_date}'"


    nulidad_script = generate_nulidad_script(table, fields, filter_condition, date_range)
    totalidad_script = generate_totalidad_script(table, filter_condition, date_range)
    duplicados_script = generate_duplicados_script(table, fields, filter_condition, date_range)

    return render_template('results.html',
                           nulidad_script=nulidad_script,
                           totalidad_script=totalidad_script,
                           duplicados_script=duplicados_script)

if __name__ == '__main__':
    app.run(debug=True)
