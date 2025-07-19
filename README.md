# Pruebas Unitarias de Calidad de Datos

Este proyecto es una herramienta web de frontend puro que genera scripts SQL para una amplia variedad de pruebas unitarias de calidad de datos.

## Demo

Puedes ver una demostración en vivo de la aplicación aquí: [https://mjmc4498.github.io/ValidacionesDeMigraciones](https://mjmc4498.github.io/ValidacionesDeMigraciones)

## Instalación

Simplemente clona el repositorio y abre el archivo `index.html` en tu navegador.

```bash
git clone https://github.com/mjmc4498/ValidacionesDeMigraciones.git
cd ValidacionesDeMigraciones
# Abre index.html en tu navegador
```

## Manual del Sistema y Uso

1.  **Nombre de la Tabla:** Ingresa el nombre de la tabla de la base de datos que deseas validar.
2.  **Tabla a Comparar (opcional):** Ingresa el nombre de una tabla para comparar (por ejemplo, antes de una migración).
3.  **Campos:** Ingresa los nombres de los campos (columnas) que deseas incluir en la validación, separados por comas.
4.  **Filtro (opcional):** Agrega cualquier condición `WHERE` adicional para filtrar los datos.
5.  **Fecha de Inicio y Fin (opcional):** Selecciona un rango de fechas para limitar la validación a un período de tiempo específico.
6.  Haz clic en **"Generar Scripts"**.

La aplicación generará y mostrará una variedad de scripts SQL, incluyendo:

*   Nulidad
*   Totalidad
*   Duplicados
*   Rango Numérico Válido
*   Valores Categóricos Válidos
*   Fecha en Rango Aceptable
*   Integridad Referencial
*   Formato de Campo
*   Consistencia entre Campos
*   Porcentaje de Nulos
*   Valores Fuera de Tendencia
*   Longitud de Texto
*   Sumatoria por Grupo
*   Conteo de Registros Únicos
*   Carga sin Registros

## Exportar a Excel

Puedes exportar todos los scripts generados a un archivo de Excel haciendo clic en el botón **"Exportar a Excel"**.

## Estructura del Código (MVC)

El código JavaScript está organizado siguiendo el patrón Modelo-Vista-Controlador (MVC):

*   **Modelo:** Un objeto que maneja los datos de la aplicación (los valores del formulario).
*   **Vista:** El `index.html` que muestra la interfaz de usuario.
*   **Controlador:** El `script.js` que maneja la lógica de la aplicación (generar los scripts y actualizar la vista).

## Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o un pull request para discutir los cambios que te gustaría hacer.

## Contacto

Marco Josue Martinez Cruz - [mjmc4498](https://github.com/mjmc4498)
