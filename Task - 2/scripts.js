document.addEventListener('DOMContentLoaded', function () {
    const taskForm = document.getElementById('task-form');
    const taskList = document.getElementById('task-list');
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Load tasks from localStorage
    tasks.forEach(task => addTask(task.text, task.completed));

    // Add new task
    taskForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const taskInput = document.getElementById('new-task');
        const taskText = taskInput.value.trim();
        if (taskText !== '') {
            addTask(taskText);
            tasks.push({ text: taskText, completed: false });
            localStorage.setItem('tasks', JSON.stringify(tasks));
            taskInput.value = '';
        }
    });

    // Handle task actions (complete, edit, delete)
    taskList.addEventListener('click', function (e) {
        if (e.target.tagName === 'BUTTON') {
            const action = e.target.className.split(' ')[0];
            const li = e.target.closest('li');
            const taskIndex = li.getAttribute('data-index');

            if (action === 'complete-btn') {
                li.classList.toggle('completed');
                tasks[taskIndex].completed = !tasks[taskIndex].completed;
            } else if (action === 'edit-btn') {
                const span = li.querySelector('.task-text');
                const input = document.createElement('input');
                input.type = 'text';
                input.value = span.textContent;
                input.className = 'edit-input';
                li.replaceChild(input, span);
                e.target.textContent = 'Save';
                e.target.className = 'save-btn';
            } else if (action === 'save-btn') {
                const input = li.querySelector('.edit-input');
                const updatedText = input.value.trim();
                if (updatedText !== '') {
                    tasks[taskIndex].text = updatedText; // Update task text in array
                    const span = document.createElement('span');
                    span.className = 'task-text';
                    span.textContent = updatedText;
                    li.replaceChild(span, input);
                    e.target.textContent = '✎';
                    e.target.className = 'edit-btn';
                    localStorage.setItem('tasks', JSON.stringify(tasks)); // Update localStorage
                }
            } else if (action === 'delete-btn') {
                li.remove();
                tasks.splice(taskIndex, 1);
                updateTaskIndexes();
                localStorage.setItem('tasks', JSON.stringify(tasks)); // Update localStorage
            }
        }
    });

    function addTask(taskText, completed = false) {
        const li = document.createElement('li');
        li.setAttribute('data-index', tasks.length);
        li.innerHTML = `
            <span class="task-text">${taskText}</span>
            <div>
                <button class="complete-btn">✔</button>
                <button class="edit-btn">✎</button>
                <button class="delete-btn">✖</button>
            </div>
        `;
        if (completed) {
            li.classList.add('completed');
        }
        taskList.appendChild(li);
    }

    function updateTaskIndexes() {
        const listItems = taskList.querySelectorAll('li');
        listItems.forEach((li, index) => {
            li.setAttribute('data-index', index);
        });
    }
});
