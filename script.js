const model = {
    table: '',
    fields: [],
    filter: '',
    startDate: '',
    endDate: '',
};

const view = {
    updateScripts(nulidad, totalidad, duplicados) {
        document.getElementById('nulidad-script').textContent = nulidad;
        document.getElementById('totalidad-script').textContent = totalidad;
        document.getElementById('duplicados-script').textContent = duplicados;
    },
    showAlert(message) {
        alert(message);
    }
};

const controller = {
    init() {
        document.getElementById('sql-form').addEventListener('submit', (event) => {
            event.preventDefault();
            this.handleFormSubmit();
        });
    },
    handleFormSubmit() {
        this.updateModel();
        const { nulidad, totalidad, duplicados } = this.generateScripts();
        view.updateScripts(nulidad, totalidad, duplicados);
    },
    updateModel() {
        model.table = document.getElementById('table').value;
        model.fields = document.getElementById('fields').value.split(',').map(field => field.trim());
        model.filter = document.getElementById('filter').value;
        model.startDate = document.getElementById('start_date').value;
        model.endDate = document.getElementById('end_date').value;
    },
    generateScripts() {
        const dateRange = this.getDateRange();
        const nulidad = this.generateNulidadScript(dateRange);
        const totalidad = this.generateTotalidadScript(dateRange);
        const duplicados = this.generateDuplicadosScript(dateRange);
        return { nulidad, totalidad, duplicados };
    },
    getDateRange() {
        if (model.startDate && model.endDate) {
            return `fecha BETWEEN '${model.startDate}' AND '${model.endDate}'`;
        }
        return "";
    },
    generateNulidadScript(dateRange) {
        const fieldsToCheck = model.fields.map(field => `${field} IS NULL`).join(' AND ');
        let whereClause = `WHERE ${fieldsToCheck}`;
        if (model.filter) {
            whereClause += ` AND ${model.filter}`;
        }
        if (dateRange) {
            whereClause += ` AND ${dateRange}`;
        }
        return `SELECT ${model.fields.join(', ')} FROM ${model.table} ${whereClause};`;
    },
    generateTotalidadScript(dateRange) {
        let whereClause = "";
        const conditions = [];
        if (model.filter) {
            conditions.push(model.filter);
        }
        if (dateRange) {
            conditions.push(dateRange);
        }
        if (conditions.length > 0) {
            whereClause = "WHERE " + conditions.join(" AND ");
        }
        return `SELECT COUNT(*) FROM ${model.table} ${whereClause};`;
    },
    generateDuplicadosScript(dateRange) {
        const fieldsStr = model.fields.join(', ');
        let whereClause = "";
        const conditions = [];
        if (model.filter) {
            conditions.push(model.filter);
        }
        if (dateRange) {
            conditions.push(dateRange);
        }
        if (conditions.length > 0) {
            whereClause = "WHERE " + conditions.join(" AND ");
        }
        return `SELECT ${fieldsStr}, COUNT(*) FROM ${model.table} ${whereClause} GROUP BY ${fieldsStr} HAVING COUNT(*) > 1;`;
    }
};

controller.init();

function copyToClipboard(elementId) {
    const codeElement = document.getElementById(elementId);
    const textToCopy = codeElement.textContent;
    navigator.clipboard.writeText(textToCopy).then(() => {
        view.showAlert('¡Copiado al portapapeles!');
    }, (err) => {
        console.error('No se pudo copiar el texto: ', err);
    });
}
