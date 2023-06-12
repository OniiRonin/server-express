// Importamos el módulo de express
const express = require('express');

// Utilizamos express
const app = express();

// Configuración para parsear JSON en las solicitudes
app.use(express.json());

// Definimos un puerto
const port = 3000;

//estructura JSON
const tareas = [
    { id: "123456", isCompleted: false, description: "Leer un libro" },
    { id: "234567", isCompleted: true, description: "Comprar Fruta" },
    { id: "345678", isCompleted: false, description: "Estudiar Material" }
];

// Ruta para obtener la lista de tareas
app.get('/tareas', (req, res) => {
    res.send({
        success: true,
        content: tareas
    });
});

// Ruta para agregar una nueva tarea
app.post('/tareas', (req, res) => {
    const tarea = req.body;
    tareas.push(tarea);
    res.send({
        success: true,
        content: tareas
    });
});

// Ruta para editar una tarea existente
app.put('/tareas/:id', (req, res) => {
    const tareaId = req.params.id;
    const updatedTarea = req.body;
    const tareaIndex = tareas.findIndex((tarea) => tarea.id === tareaId);

    if (tareaIndex !== -1) {
        tareas[tareaIndex] = updatedTarea;
        res.send({
            success: true,
            content: tareas
        });
    } else {
        res.status(404).send({
            success: false,
            message: 'Tarea no encontrada'
        });
    }
});

// Ruta para eliminar una tarea existente
app.delete('/tareas/:id', (req, res) => {
    const tareaId = req.params.id;
    const tareaIndex = tareas.findIndex((tarea) => tarea.id === tareaId);

    if (tareaIndex !== -1) {
        tareas.splice(tareaIndex, 1);
        res.send({
            success: true,
            content: tareas
        });
    } else {
        res.status(404).send({
            success: false,
            message: 'Tarea no encontrada'
        });
    }
});

// Encender el servidor
app.listen(port, () => {
    console.log('Servidor iniciado en el puerto ' + port);
});