const express = require('express');
const listViewRouter = express.Router();

const tareas = [
    { id: "123456", isCompleted: false, description: "Leer un libro" },
    { id: "234567", isCompleted: true, description: "Comprar Fruta" },
    { id: "345678", isCompleted: false, description: "Estudiar Material" }
];

// Middleware para gestionar parámetros correctos
const handleInvalidParams = (req, res, next) => {
    if (req.query.foo !== 'bar') {
        res.status(400).send('Bad Request: Invalid parameter');
    } else {
        next();
    }
};

// Ruta para obtener la lista de tareas completas
listViewRouter.get('/completas', handleInvalidParams, (req, res) => {
    const completas = tareas.filter(tarea => tarea.isCompleted);
    res.send({
        success: true,
        content: completas
    });
});

// Ruta para obtener la lista de tareas incompletas
listViewRouter.get('/incompletas', handleInvalidParams, (req, res) => {
    const incompletas = tareas.filter(tarea => !tarea.isCompleted);
    res.send({
        success: true,
        content: incompletas
    });
});

module.exports = listViewRouter;
