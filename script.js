const model = {
    table: '',
    compareTable: '',
    fields: [],
    filter: '',
    startDate: '',
    endDate: '',
    scripts: {},
};

const view = {
    updateScripts(scripts) {
        for (const key in scripts) {
            const element = document.getElementById(`${key}-script`);
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
        document.getElementById('export-button').addEventListener('click', () => {
            this.exportScripts();
        });
    },
    handleFormSubmit() {
        this.updateModel();
        model.scripts = this.generateScripts();
        view.updateScripts(model.scripts);
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
        // This function generates a script to compare fields between two tables.
        // The user's request included a reference query that uses INFORMATION_SCHEMA to dynamically
        // discover columns. In this frontend-only environment, we cannot execute such a query.
        // Therefore, we rely on the user to provide the primary key and the fields to compare.

        if (!model.table || !model.compareTable) {
            return `/*\n  Instrucciones:\n  Para esta validación, debe proporcionar tanto el 'Nombre de la Tabla' (origen) como la 'Tabla a Comparar' (destino).\n*/\n\nSELECT 'Se requiere una tabla de origen y una tabla para comparar.' AS Error;`;
        }

        if (model.fields.length < 2) {
            return `/*\n  Instrucciones para la Validación de Consistencia de Campos:\n\n  1. Proporcione la clave primaria como el PRIMER campo en la lista de 'Campos'.\n  2. Proporcione todos los demás campos que desea comparar después de la clave primaria.\n\n  Ejemplo de Campos: id_cliente,nombre,apellido,email\n*/\n\nSELECT 'Se requiere al menos una clave primaria y un campo para comparar.' AS Error;`;
        }

        const primaryKey = model.fields[0];
        const fieldsToCompare = model.fields.slice(1);

        // This logic is inspired by the user's reference query. It builds the comparison clause for each field.
        const comparisons = fieldsToCompare.map(field =>
            `A.${field} AS valor_origen_${field}, B.${field} AS valor_destino_${field}, CASE WHEN A.${field} IS NULL AND B.${field} IS NULL THEN 'IGUAL' WHEN UPPER(TRIM(CAST(A.${field} AS STRING))) = UPPER(TRIM(CAST(B.${field} AS STRING))) THEN 'IGUAL' ELSE 'DIFERENTE' END AS estado_${field}`
        ).join(',\n           ');

        const dateRange = this.getDateRange();
        let origenFilter = "";
        const origenConditions = [];
        if (model.filter) {
            origenConditions.push(model.filter);
        }
        if (dateRange) {
            origenConditions.push(dateRange); // The hardcoded field name 'fecha' comes from getDateRange()
        }
        if(origenConditions.length > 0) {
            origenFilter = "\n    WHERE " + origenConditions.join(" AND ");
        }

        const finalWhereClauses = fieldsToCompare.map(f => `NOT (UPPER(TRIM(CAST(A.${f} AS STRING))) = UPPER(TRIM(CAST(B.${f} AS STRING))) OR (A.${f} IS NULL AND B.${f} IS NULL))`);


        return `
-- Validación de Consistencia de Campos
-- Compara los campos especificados entre la tabla de origen y la de destino, mostrando solo las diferencias.
-- La primera columna '${primaryKey}' se utiliza como clave de unión (JOIN key).

WITH origen AS (
    -- Selecciona los datos de la tabla de origen aplicando los filtros
    SELECT *
    FROM ${model.table}${origenFilter}
),
destino AS (
    -- Selecciona todos los datos de la tabla de destino
    SELECT *
    FROM ${model.compareTable}
)
SELECT
    -- Clave primaria y estado general del registro
    COALESCE(A.${primaryKey}, B.${primaryKey}) AS ${primaryKey},
    CASE
        WHEN A.${primaryKey} IS NOT NULL AND B.${primaryKey} IS NOT NULL THEN 'MODIFICADO'
        WHEN A.${primaryKey} IS NOT NULL AND B.${primaryKey} IS NULL THEN 'SOLO EN ORIGEN'
        WHEN A.${primaryKey} IS NULL AND B.${primaryKey} IS NOT NULL THEN 'SOLO EN DESTINO'
    END AS estado_general,

    -- Comparación detallada de cada campo
    ${comparisons}

FROM origen A
FULL OUTER JOIN destino B ON A.${primaryKey} = B.${primaryKey}
WHERE
    -- Filtra para mostrar solo registros que no existen en una de las tablas o que tienen diferencias en los campos comparados
    A.${primaryKey} IS NULL
    OR B.${primaryKey} IS NULL
    OR (${finalWhereClauses.join('\n    OR ')})
;
        `.trim();
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
    },
    exportScripts() {
        const data = Object.entries(model.scripts).map(([key, value]) => {
            const scriptName = key.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            return { 'Prueba': scriptName, 'Script': value };
        });

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Scripts de Calidad de Datos");
        XLSX.writeFile(wb, "scripts_calidad_datos.xlsx");
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
