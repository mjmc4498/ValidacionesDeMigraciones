const model = {
    table: '',
    compareTable: '',
    fields: [],
    filter: '',
    startDate: '',
    endDate: '',
};

const view = {
    updateScripts(scripts) {
        for (const key in scripts) {
            const element = document.getElementById(key);
            if (element) {
                element.textContent = scripts[key];
            }
        }
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
        const scripts = this.generateScripts();
        view.updateScripts(scripts);
    },
    updateModel() {
        model.table = document.getElementById('table').value;
        model.compareTable = document.getElementById('compare_table').value;
        model.fields = document.getElementById('fields').value.split(',').map(field => field.trim());
        model.filter = document.getElementById('filter').value;
        model.startDate = document.getElementById('start_date').value;
        model.endDate = document.getElementById('end_date').value;
    },
    generateScripts() {
        const dateRange = this.getDateRange();
        const scripts = {
            nulidad: this.generateNulidadScript(dateRange),
            totalidad: this.generateTotalidadScript(dateRange),
            duplicados: this.generateDuplicadosScript(dateRange),
            'rango-numerico': this.generateRangoNumericoScript(),
            'valores-categoricos': this.generateValoresCategoricosScript(),
            'fecha-rango': this.generateFechaRangoScript(),
            'integridad-referencial': this.generateIntegridadReferencialScript(),
            'formato-campo': this.generateFormatoCampoScript(),
            'consistencia-campos': this.generateConsistenciaCamposScript(),
            'porcentaje-nulos': this.generatePorcentajeNulosScript(),
            'valores-fuera-tendencia': this.generateValoresFueraTendenciaScript(),
            'longitud-texto': this.generateLongitudTextoScript(),
            'sumatoria-grupo': this.generateSumatoriaGrupoScript(),
            'conteo-unicos': this.generateConteoUnicosScript(),
            'carga-sin-registros': this.generateCargaSinRegistrosScript(),
        };
        return scripts;
    },
    getDateRange() {
        if (model.startDate && model.endDate) {
            return `fecha BETWEEN '${model.startDate}' AND '${model.endDate}'`;
        }
        return "";
    },
    generateNulidadScript(dateRange) {
        const fieldsToCheck = model.fields.map(field => `${field} IS NULL`).join(' OR ');
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

        if (model.compareTable) {
            return `SELECT (SELECT COUNT(*) FROM ${model.table} ${whereClause}) AS total_tabla_1, (SELECT COUNT(*) FROM ${model.compareTable} ${whereClause}) AS total_tabla_2;`;
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
    },
    generateRangoNumericoScript() {
        const field = model.fields[0];
        return `SELECT ${field} FROM ${model.table} WHERE ${field} NOT BETWEEN [valor_minimo] AND [valor_maximo];`;
    },
    generateValoresCategoricosScript() {
        const field = model.fields[0];
        return `SELECT ${field} FROM ${model.table} WHERE ${field} NOT IN ('valor1', 'valor2', '...'));`;
    },
    generateFechaRangoScript() {
        const field = model.fields[0];
        return `SELECT ${field} FROM ${model.table} WHERE ${field} NOT BETWEEN '[fecha_inicio]' AND '[fecha_fin]';`;
    },
    generateIntegridadReferencialScript() {
        const field = model.fields[0];
        if (model.compareTable) {
            return `SELECT t1.${field} FROM ${model.table} t1 LEFT JOIN ${model.compareTable} t2 ON t1.${field} = t2.${field} WHERE t2.${field} IS NULL;`;
        }
        return `SELECT t1.${field} FROM ${model.table} t1 LEFT JOIN [tabla_referencia] t2 ON t1.${field} = t2.[campo_referencia] WHERE t2.[campo_referencia] IS NULL;`;
    },
    generateFormatoCampoScript() {
        const field = model.fields[0];
        return `SELECT ${field} FROM ${model.table} WHERE ${field} NOT LIKE '[formato]'; -- Ejemplo: '____-__-__' para fechas`;
    },
    generateConsistenciaCamposScript() {
        const [field1, field2] = model.fields;
        return `SELECT ${field1}, ${field2} FROM ${model.table} WHERE NOT ([condicion_consistencia]); -- Ejemplo: campo_pais = 'USA' AND campo_moneda != 'USD'`;
    },
    generatePorcentajeNulosScript() {
        const field = model.fields[0];
        return `SELECT (COUNT(*) - COUNT(${field})) * 100.0 / COUNT(*) AS porcentaje_nulos FROM ${model.table};`;
    },
    generateValoresFueraTendenciaScript() {
        const field = model.fields[0];
        return `SELECT ${field} FROM ${model.table} WHERE ${field} > (SELECT AVG(${field}) + 3 * STDDEV(${field}) FROM ${model.table}); -- Detecta valores atípicos (outliers)`;
    },
    generateLongitudTextoScript() {
        const field = model.fields[0];
        return `SELECT ${field} FROM ${model.table} WHERE LENGTH(${field}) > [longitud_maxima];`;
    },
    generateSumatoriaGrupoScript() {
        const [groupField, sumField] = model.fields;
        if (model.compareTable) {
            return `SELECT t1.${groupField}, SUM(t1.${sumField}) AS sum_tabla_1, SUM(t2.${sumField}) AS sum_tabla_2 FROM ${model.table} t1 JOIN ${model.compareTable} t2 ON t1.${groupField} = t2.${groupField} GROUP BY t1.${groupField};`;
        }
        return `SELECT ${groupField}, SUM(${sumField}) FROM ${model.table} GROUP BY ${groupField};`;
    },
    generateConteoUnicosScript() {
        const field = model.fields[0];
        if (model.compareTable) {
            return `SELECT (SELECT COUNT(DISTINCT ${field}) FROM ${model.table}) AS unicos_tabla_1, (SELECT COUNT(DISTINCT ${field}) FROM ${model.compareTable}) AS unicos_tabla_2;`;
        }
        return `SELECT COUNT(DISTINCT ${field}) FROM ${model.table};`;
    },
    generateCargaSinRegistrosScript() {
        return `SELECT CASE WHEN COUNT(*) = 0 THEN 'Carga sin registros' ELSE 'Carga con registros' END FROM ${model.table};`;
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
