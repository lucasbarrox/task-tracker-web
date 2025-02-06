document.addEventListener('DOMContentLoaded', () => {
    const tasksContainer = document.getElementById('tasks-container');
    const addTaskForm = document.getElementById('add-task-form');

    // Função para buscar tarefas e renderizar na página
    function fetchTasks() {
        fetch('/tasks')
            .then(response => response.json())
            .then(tasks => {
                tasksContainer.innerHTML = '';
                if (tasks.length === 0) {
                    tasksContainer.innerHTML = '<p>Nenhuma tarefa encontrada.</p>';
                    return;
                }
                tasks.forEach(task => {
                    const taskEl = document.createElement('div');
                    taskEl.className = 'task';
                    taskEl.innerHTML = `
                        <p><strong>ID:</strong> ${task.id}</p>
                        <p><strong>Descrição:</strong> ${task.description}</p>
                        <p><strong>Status:</strong> ${task.status}</p>
                        <p><strong>Data de Criação:</strong> ${new Date(task.createdAt).toLocaleString()}</p>
                        <hr>
                    `;
                    tasksContainer.appendChild(taskEl);
                });
            })
            .catch(err => console.error('Erro ao buscar tarefas:', err));
    }

    // Buscar tarefas assim que a página carregar
    fetchTasks();

    // Adicionar nova tarefa
    addTaskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(addTaskForm);
        const description = formData.get('description');
        const dueDate = formData.get('dueDate');

        fetch('/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ description, dueDate })
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw err; });
            }
            return response.json();
        })
        .then(newTask => {
            console.log('Tarefa adicionada:', newTask);
            addTaskForm.reset();
            fetchTasks();
        })
        .catch(error => {
            console.error('Erro ao adicionar tarefa:', error);
            alert(error.error || 'Erro ao adicionar tarefa');
        });
    });
});
