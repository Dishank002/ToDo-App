document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addButton = document.getElementById('addButton');
    const taskList = document.getElementById('taskList');
    
    // Load tasks from localStorage
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function renderTasks() {
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <i class="fas fa-pencil-alt edit-btn"></i>
                <span class="task-text">${task.text}</span>
                <input type="checkbox" class="checkbox" ${task.completed ? 'checked' : ''}>
                <span class="complete-status ${task.completed ? 'complete' : ''}">${task.completed ? 'Complete' : 'Incomplete'}</span>
                <i class="fas fa-times delete-btn"></i>
            `;

            const checkbox = li.querySelector('.checkbox');
            const status = li.querySelector('.complete-status');
            const editBtn = li.querySelector('.edit-btn');
            const deleteBtn = li.querySelector('.delete-btn');
            const taskSpan = li.querySelector('.task-text');

            checkbox.addEventListener('change', () => {
                tasks[index].completed = checkbox.checked;
                status.textContent = checkbox.checked ? 'Complete' : 'Incomplete';
                status.classList.toggle('complete', checkbox.checked);
                saveTasks();
            });

            deleteBtn.addEventListener('click', () => {
                tasks.splice(index, 1);
                saveTasks();
                li.remove();
            });

            editBtn.addEventListener('click', () => {
                const currentText = task.text;
                const input = document.createElement('input');
                input.type = 'text';
                input.value = currentText;
                input.className = 'edit-input';
                
                li.replaceChild(input, taskSpan);
                input.focus();

                const saveEdit = () => {
                    const newText = input.value.trim();
                    tasks[index].text = newText || currentText;
                    taskSpan.textContent = tasks[index].text;
                    li.replaceChild(taskSpan, input);
                    saveTasks();
                };

                input.addEventListener('blur', saveEdit);
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') saveEdit();
                });
            });

            taskList.appendChild(li);
        });
    }

    // Initial render
    renderTasks();

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText === '') return;

        tasks.push({
            text: taskText,
            completed: false
        });
        saveTasks();
        renderTasks();
        taskInput.value = '';
    }

    addButton.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });
});