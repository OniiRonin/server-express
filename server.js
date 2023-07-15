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

// Ruta para obtener la lista de todas las tareas
app.get('/tareas', (req, res) => {
    res.json({ success: true, content: tareas });
});

// Ruta para obtener una sola tarea por su ID
app.get('/tareas/:id', (req, res) => {
    const tareaId = req.params.id;
    const tarea = tareas.find(t => t.id === tareaId);

    if (tarea) {
        res.json({ success: true, content: tarea });
    } else {
        res.status(404).json({ success: false, message: 'Tarea no encontrada' });
    }
});

// Ruta para agregar una nueva tarea
app.post('/tareas', (req, res) => {
    const tarea = req.body;
    tareas.push(tarea);
    res.status(201).json({ success: true, content: tarea });
});

// Ruta para actualizar una tarea existente
app.put('/tareas/:id', (req, res) => {
    const tareaId = req.params.id;
    const updatedTarea = req.body;
    const tareaIndex = tareas.findIndex(t => t.id === tareaId);

    if (tareaIndex !== -1) {
        tareas[tareaIndex] = updatedTarea;
        res.json({ success: true, content: updatedTarea });
    } else {
        res.status(404).json({ success: false, message: 'Tarea no encontrada' });
    }
});

// Ruta para eliminar una tarea existente
app.delete('/tareas/:id', (req, res) => {
    const tareaId = req.params.id;
    const tareaIndex = tareas.findIndex(t => t.id === tareaId);

    if (tareaIndex !== -1) {
        const deletedTarea = tareas.splice(tareaIndex, 1);
        res.json({ success: true, content: deletedTarea });
    } else {
        res.status(404).json({ success: false, message: 'Tarea no encontrada' });
    }
});

// Ruta para obtener la lista de tareas completas
app.get('/tareas/completas', (req, res) => {
    const completas = tareas.filter(t => t.isCompleted);
    res.json({ success: true, content: completas });
});

// Ruta para obtener la lista de tareas incompletas
app.get('/tareas/incompletas', (req, res) => {
    const incompletas = tareas.filter(t => !t.isCompleted);
    res.json({ success: true, content: incompletas });
});

// Encender el servidor
app.listen(port, () => {
    console.log('Servidor iniciado en el puerto ' + port);
});