# Sistema de Gestión Hospitalaria (HIS) - Práctico Integrador

### Enlace al Proyecto Desplegado
**URL:** [https://his-app-ian-chiti.onrender.com]

Este proyecto es un Sistema de Información Hospitalaria (HIS) desarrollado como parte del Trabajo Práctico Integrador para la materia Programación Web 2. La aplicación permite gestionar el ciclo completo de un paciente dentro de un hospital, desde su admisión hasta el alta, incluyendo la gestión de camas y la carga de evaluaciones clínicas por parte del personal de enfermería y médico.

---

## Funcionalidades Implementadas

* **Gestión de Pacientes (CRUD Completo):**
    * Crear nuevos pacientes.
    * Ver un listado de todos los pacientes.
    * Ver la ficha de detalle de un paciente específico.
    * Editar la información de un paciente existente.
    * Eliminar un paciente (con confirmación).
* **Gestión de Internaciones:**
    * Formulario de nueva internación con selección de paciente y camas disponibles.
    * Validación de reglas de negocio (ej: no asignar pacientes de sexos opuestos a una misma habitación compartida).
    * El estado de la cama se actualiza automáticamente a "Ocupada".
* **Gestión de Evaluaciones Clínicas:**
    * **Evaluación de Enfermería:** Formulario para registrar signos vitales, antecedentes, notas y plan de cuidados.
    * **Evaluación Médica:** Formulario para registrar diagnóstico, tratamiento y notas médicas.
    * Visualización del historial clínico completo (ambas evaluaciones) en la ficha del paciente.
* **Gestión de Camas:**
    * Panel de control para ver el estado de todas las camas del hospital (Libre/Ocupada, Higienizada/No Higienizada).
    * Funcionalidad para marcar una cama como higienizada y dejarla disponible para una nueva internación.
* **Alta Hospitalaria:**
    * Funcionalidad para dar de alta a un paciente, finalizando su internación y liberando la cama para su posterior higienización.

---

## Stack Tecnológico

* **Backend:** Node.js, Express.js
* **Frontend (Server-Side Rendered):** Pug (anteriormente Jade)
* **Base de Datos:** MySQL (gestionado con XAMPP en desarrollo)
* **Estilos:** Bootstrap 5

---

## Instrucciones para Instalación y Despliegue Local

Para correr este proyecto en un entorno local, sigue estos pasos:

1.  **Prerrequisitos:**
    * Tener instalado [Node.js](https://nodejs.org/) (versión LTS recomendada).
    * Tener instalado [Git](https://git-scm.com/).
    * Tener instalado y corriendo [XAMPP](https://www.apachefriends.org/es/index.html) (con los servicios de Apache y MySQL iniciados).

2.  **Clonar el Repositorio:**
    ```bash
    git clone [https://github.com/tu-usuario/tu-repositorio.git](https://github.com/tu-usuario/tu-repositorio.git)
    cd tu-repositorio
    ```
    3.  **Instalar Dependencias:**
    ```bash
    npm install
    ```

4.  **Configurar Variables de Entorno:**
    * Crea un nuevo archivo llamado `.env` en la raíz del proyecto.
    * Añade el siguiente contenido, asegurándote de que la contraseña coincida con la de tu instalación de MySQL (para XAMPP por defecto está vacía):
        ```
        DB_HOST=localhost
        DB_USER=root
        DB_PASSWORD=
        DB_NAME=his_db
        PORT=3000
        ```

5.  **Configurar la Base de Datos:**
    * Abre **phpMyAdmin** desde el panel de control de XAMPP.
    * Crea una nueva base de datos llamada `his_db` con el cotejamiento `utf8mb4_unicode_ci`.
    * Selecciona la base de datos `his_db`, ve a la pestaña **Importar**, selecciona el archivo `database.sql` de la raíz del proyecto y ejecuta la importación.

6.  **Iniciar el Servidor:**
    ```bash
    npm run dev
    ```

7.  **Acceder a la Aplicación:**
    * Abre tu navegador y ve a `http://localhost:3000`.

---

## Usuarios de Prueba

La base de datos se crea con los siguientes usuarios de prueba.

| Rol        | Username  |
|------------|-----------|
| Admin      | `admin`     |
| Admisión   | `admision`  |
| Enfermería | `enfermera` |
| Médico     | `medico`    |

---

## Informe: Problemas Encontrados y Soluciones

Durante el desarrollo de este proyecto, me encontré con varios desafíos técnicos que fueron cruciales para mi aprendizaje. Los más destacados fueron:

* **Error de Puerto en Uso (`EADDRINUSE`):** Al principio, me encontré con este error al intentar iniciar el servidor. **Solución:** Aprendí que cada puerto solo puede ser usado por un proceso a la vez y que debía detener cualquier instancia previa del servidor (con `Ctrl + C`) antes de iniciar una nueva.

* **Error de Conexión a la BD (`ECONNREFUSED`):** La aplicación no podía conectarse a la base de datos. **Solución:** Descubrí que no bastaba con tener el código, sino que el servicio del servidor de base de datos (MySQL en XAMPP) debía estar explícitamente iniciado para poder recibir conexiones.

* **Error de Acceso Denegado a la BD (`ER_ACCESS_DENIED_ERROR`):** A pesar de que el servidor de BD estaba corriendo, la conexión fallaba. **Solución:** El problema estaba en las credenciales. Aprendí la importancia de gestionar las contraseñas en el archivo `.env` y que la configuración por defecto de XAMPP para el usuario `root` es una contraseña vacía.

* **Error de Clave Foránea (`ER_NO_REFERENCED_ROW_2`):** Al intentar crear una internación, la base de datos me daba un error. **Solución:** Comprendí el concepto de integridad referencial. El error ocurría porque intentaba crear un registro "hijo" (internación) para un "padre" (paciente) que no existía en la base de datos. La solución fue asegurarme de usar siempre IDs de pacientes existentes.

* **Bug Crítico - Borrado de Camas:** En la implementación del alta, noté que las camas se eliminaban en lugar de actualizarse. **Solución:** Este fue un ejercicio de depuración cuidadosa. Revisé la función del modelo (`darAltaHospitalaria`) y encontré que por un error de tipeo se estaba ejecutando una consulta `DELETE` en lugar de `UPDATE`. Corregirlo y entender el impacto de una sola palabra fue una lección muy importante.