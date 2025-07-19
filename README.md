# Generador de Scripts SQL para Validación de Migraciones

Este proyecto es una herramienta web que genera scripts SQL para validaciones de nulidad, totalidad y duplicados, facilitando el proceso de migración de datos.

## Demo

Puedes ver una demostración en vivo de la aplicación aquí: `your-username.pythonanywhere.com` (reemplaza con tu URL de PythonAnywhere).

## Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/mjmc4498/ValidacionesDeMigraciones.git
   ```
2. Navega al directorio del proyecto:
   ```bash
   cd ValidacionesDeMigraciones
   ```
3. (Opcional) Crea un entorno virtual:
   ```bash
   python -m venv venv
   source venv/bin/activate  # En Windows usa `venv\Scripts\activate`
   ```
4. Instala las dependencias:
   ```bash
   pip install -r requirements.txt
   ```
5. Ejecuta la aplicación:
   ```bash
   python app.py
   ```
6. Abre tu navegador y ve a `http://127.0.0.1:5000`.

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

## Despliegue en PythonAnywhere

1.  Regístrate para obtener una cuenta gratuita en [PythonAnywhere](https://www.pythonanywhere.com/).
2.  Sube tus archivos (`app.py`, `requirements.txt`, y la carpeta `templates`) a tu espacio de archivos en PythonAnywhere.
3.  Abre una consola Bash en PythonAnywhere y ejecuta los siguientes comandos:
    ```bash
    pip3.10 install --user -r requirements.txt
    ```
4.  Ve a la pestaña "Web" y crea una nueva aplicación web.
5.  Selecciona "Flask" y la versión de Python que prefieras (se recomienda 3.10).
6.  Edita el archivo de configuración WSGI (lo encontrarás en la sección "Code" de la pestaña "Web"). Reemplaza su contenido con lo siguiente:
    ```python
    import sys
    path = '/home/your-username/path-to-your-project'  # Reemplaza con tu ruta
    if path not in sys.path:
        sys.path.append(path)
    from app import app as application
    ```
7.  Recarga tu aplicación web desde la pestaña "Web".

¡Y listo! Tu aplicación estará en vivo en `your-username.pythonanywhere.com`.

## Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o un pull request para discutir los cambios que te gustaría hacer.

## Contacto

Marco Josue Martinez Cruz - [mjmc4498](https://github.com/mjmc4498)
