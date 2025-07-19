# Generador de Scripts SQL para Validación de Migraciones

Este proyecto es una herramienta web de frontend puro que genera scripts SQL para validaciones de nulidad, totalidad y duplicados, facilitando el proceso de migración de datos.

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
2.  **Campos:** Ingresa los nombres de los campos (columnas) que deseas incluir en la validación, separados por comas.
3.  **Filtro (opcional):** Agrega cualquier condición `WHERE` adicional para filtrar los datos.
4.  **Fecha de Inicio y Fin (opcional):** Selecciona un rango de fechas para limitar la validación a un período de tiempo específico.
5.  Haz clic en **"Generar Scripts"**.

La aplicación generará y mostrará los siguientes scripts SQL:

*   **Nulidad:** Verifica si alguno de los campos especificados es nulo.
*   **Totalidad:** Cuenta el número total de registros en la tabla (con el filtro opcional).
*   **Duplicados:** Encuentra registros duplicados basados en los campos especificados.

## Estructura del Código (MVC)

El código JavaScript está organizado siguiendo el patrón Modelo-Vista-Controlador (MVC):

*   **Modelo:** Un objeto que maneja los datos de la aplicación (los valores del formulario).
*   **Vista:** El `index.html` que muestra la interfaz de usuario.
*   **Controlador:** El `script.js` que maneja la lógica de la aplicación (generar los scripts y actualizar la vista).

## Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o un pull request para discutir los cambios que te gustaría hacer.

## Contacto

Marco Josue Martinez Cruz - [mjmc4498](https://github.com/mjmc4498)
