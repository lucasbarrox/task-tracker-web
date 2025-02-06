const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const TASKS_FILE = path.join(__dirname, '../tasks.json');

// Função para carregar as tarefas
function loadTasks() {
    if (!fs.existsSync(TASKS_FILE)) {
        return [];
    }
    const data = fs.readFileSync(TASKS_FILE, 'utf-8');
    return JSON.parse(data);
}

// Função para salvar as tarefas
function saveTasks(tasks) {
    fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 4), 'utf-8');
}

// Rota para obter todas as tarefas
router.get('/', (req, res) => {
    const tasks = loadTasks();
    res.json(tasks);
});

// Rota para adicionar uma nova tarefa
router.post('/', (req, res) => {
    const { description, dueDate } = req.body;
    if (!description || description.trim() === '') {
        return res.status(400).json({ error: 'A descrição da tarefa é obrigatória.' });
    }
    const tasks = loadTasks();
    const newTask = {
        id: tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1,
        description,
        status: 'todo',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
    };
    tasks.push(newTask);
    saveTasks(tasks);
    res.status(201).json(newTask);
});

// Rota para atualizar uma tarefa
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { description, status, dueDate } = req.body;
    const tasks = loadTasks();
    const taskIndex = tasks.findIndex((task) => task.id === parseInt(id));
    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Tarefa não encontrada.' });
    }
    const updatedTask = { ...tasks[taskIndex] };
    if (description) updatedTask.description = description;
    if (status) updatedTask.status = status;
    if (dueDate) updatedTask.dueDate = new Date(dueDate).toISOString();
    updatedTask.updatedAt = new Date().toISOString();
    tasks[taskIndex] = updatedTask;
    saveTasks(tasks);
    res.json(updatedTask);
});

// Rota para deletar uma tarefa
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    let tasks = loadTasks();
    const taskIndex = tasks.findIndex((task) => task.id === parseInt(id));
    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Tarefa não encontrada.' });
    }
});


module.exports = router;