document.getElementById('sql-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const table = document.getElementById('table').value;
    const fields = document.getElementById('fields').value.split(',').map(field => field.trim());
    const filter = document.getElementById('filter').value;
    const startDate = document.getElementById('start_date').value;
    const endDate = document.getElementById('end_date').value;

    let dateRange = "";
    if (startDate && endDate) {
        dateRange = `fecha BETWEEN '${startDate}' AND '${endDate}'`;
    }

    const nulidadScript = generateNulidadScript(table, fields, filter, dateRange);
    const totalidadScript = generateTotalidadScript(table, filter, dateRange);
    const duplicadosScript = generateDuplicadosScript(table, fields, filter, dateRange);

    document.getElementById('nulidad-script').textContent = nulidadScript;
    document.getElementById('totalidad-script').textContent = totalidadScript;
    document.getElementById('duplicados-script').textContent = duplicadosScript;
});

function generateNulidadScript(table, fields, filterCondition, dateRange) {
    const fieldsToCheck = fields.map(field => `${field} IS NULL`).join(' AND ');
    let whereClause = `WHERE ${fieldsToCheck}`;
    if (filterCondition) {
        whereClause += ` AND ${filterCondition}`;
    }
    if (dateRange) {
        whereClause += ` AND ${dateRange}`;
    }
    return `SELECT ${fields.join(', ')} FROM ${table} ${whereClause};`;
}

function generateTotalidadScript(table, filterCondition, dateRange) {
    let whereClause = "";
    const conditions = [];
    if (filterCondition) {
        conditions.push(filterCondition);
    }
    if (dateRange) {
        conditions.push(dateRange);
    }
    if (conditions.length > 0) {
        whereClause = "WHERE " + conditions.join(" AND ");
    }
    return `SELECT COUNT(*) FROM ${table} ${whereClause};`;
}

function generateDuplicadosScript(table, fields, filterCondition, dateRange) {
    const fieldsStr = fields.join(', ');
    let whereClause = "";
    const conditions = [];
    if (filterCondition) {
        conditions.push(filterCondition);
    }
    if (dateRange) {
        conditions.push(dateRange);
    }
    if (conditions.length > 0) {
        whereClause = "WHERE " + conditions.join(" AND ");
    }
    return `SELECT ${fieldsStr}, COUNT(*) FROM ${table} ${whereClause} GROUP BY ${fieldsStr} HAVING COUNT(*) > 1;`;
}
