const express = require('express');
const listEditRouter = express.Router();

const tareas = [
    { id: "123456", isCompleted: false, description: "Leer un libro" },
    { id: "234567", isCompleted: true, description: "Comprar Fruta" },
    { id: "345678", isCompleted: false, description: "Estudiar Material" }
];

// Middleware para manejar errores en solicitudes POST y PUT
const handleBadRequest = (req, res, next) => {
    if (req.method === 'POST' && !req.body) {
        res.status(400).send('Bad Request: Empty body in POST request');
    } else if (req.method === 'POST' && (typeof req.body !== 'object' || !req.body.id || !req.body.isCompleted || !req.body.description)) {
        res.status(400).send('Bad Request: Invalid or missing attributes in POST request');
    } else if (req.method === 'PUT' && !req.body) {
        res.status(400).send('Bad Request: Empty body in PUT request');
    } else if (req.method === 'PUT' && (typeof req.body !== 'object' || !req.body.id || !req.body.isCompleted || !req.body.description)) {
        res.status(400).send('Bad Request: Invalid or missing attributes in PUT request');
    } else {
        next();
    }
};

// Ruta para crear una nueva tarea
listEditRouter.post('/', handleBadRequest, (req, res) => {
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
listEditRouter.put('/:id', handleBadRequest, (req, res) => {
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
