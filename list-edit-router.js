const express = require('express');
const listEditRouter = express.Router();

const tareas = [
    { id: "123456", isCompleted: false, description: "Leer un libro" },
    { id: "234567", isCompleted: true, description: "Comprar Fruta" },
    { id: "345678", isCompleted: false, description: "Estudiar Material" }
];

// Ruta para crear una nueva tarea
listEditRouter.post('/', (req, res) => {
    const tarea = req.body;
    tareas.push(tarea);
    res.send({
        success: true,
        content: tareas
    });
});

// Ruta para eliminar una tarea existente
listEditRouter.delete('/:id', (req, res) => {
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

// Ruta para actualizar una tarea existente
listEditRouter.put('/:id', (req, res) => {
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

module.exports = listEditRouter;
