const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const app = express();

app.use(express.json());
dotenv.config(); // Carga las variables de entorno desde el archivo .env

const port = 3000;

// Array de usuarios predefinidos (por simplicidad, pero normalmente esto estaría en una base de datos)
const users = [
    { id: 1, username: 'usuario1', password: 'contrasena1' },
    { id: 2, username: 'usuario2', password: 'contrasena2' },
    // Añadir más usuarios aquí si es necesario
];

// Ruta para el proceso de autenticación
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Buscar el usuario en el array
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
    }

    // Crear el token JWT
    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ success: true, token });
});

// Middleware para proteger rutas
const protectRoute = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ success: false, message: 'Token no proporcionado' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ success: false, message: 'Token inválido' });
        }

        // El token es válido, podemos continuar
        req.user = decoded;
        next();
    });
};

// Ruta protegida
app.get('/protected', protectRoute, (req, res) => {
    res.json({ success: true, message: 'Ruta protegida', user: req.user });
});

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

// Importar los enrutadores
const listViewRouter = require('./list-view-router');
const listEditRouter = require('./list-edit-router');

// Usar los enrutadores
app.use('/list-view', listViewRouter);
app.use('/list-edit', listEditRouter);

// Encender el servidor
app.listen(port, () => {
    console.log('Servidor iniciado en el puerto ' + port);
});
