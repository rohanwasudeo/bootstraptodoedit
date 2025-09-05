document.addEventListener('DOMContentLoaded', function() {
  const todoForm = document.getElementById('todo-form');
  const todoInput = document.getElementById('todo-input');
  const todoList = document.getElementById('todo-list');
  const taskCount = document.getElementById('task-count');
  const clearCompletedBtn = document.getElementById('clear-completed');
  const addSpinner = document.getElementById('add-spinner');
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const mainBody = document.getElementById('main-body');

  // Theme logic
  function setTheme(theme) {
    if (theme === 'dark') {
      mainBody.classList.add('dark-theme');
      mainBody.classList.remove('bg-light');
      themeIcon.classList.remove('bi-moon');
      themeIcon.classList.add('bi-sun');
    } else {
      mainBody.classList.remove('dark-theme');
      mainBody.classList.add('bg-light');
      themeIcon.classList.remove('bi-sun');
      themeIcon.classList.add('bi-moon');
    }
  }
  function getPreferredTheme() {
    return localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  }
  function toggleTheme() {
    const current = mainBody.classList.contains('dark-theme') ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('theme', next);
  }
  setTheme(getPreferredTheme());
  themeToggle.addEventListener('click', toggleTheme);

  let todos = JSON.parse(localStorage.getItem('todos') || '[]');

  function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
  }

  function renderTodos() {
    todoList.innerHTML = '';
    if (todos.length === 0) {
      todoList.innerHTML = '<li class="list-group-item text-center text-muted">No tasks yet!</li>';
      taskCount.textContent = '';
      return;
    }
    todos.forEach((todo, idx) => {
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-center animate__animated animate__fadeIn';
      if (todo.completed) li.classList.add('completed');
      li.innerHTML = `
        <span class="flex-grow-1" style="user-select: none;">${todo.text}</span>
        <div>
          <button class="btn btn-sm btn-success me-2 complete-btn" title="Mark as ${todo.completed ? 'incomplete' : 'complete'}">
            <i class="bi ${todo.completed ? 'bi-arrow-counterclockwise' : 'bi-check-lg'}"></i>
          </button>
          <button class="btn btn-sm btn-outline-danger delete-btn" title="Delete">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      `;
      // Toggle complete
      li.querySelector('.complete-btn').addEventListener('click', function(e) {
        todos[idx].completed = !todos[idx].completed;
        saveTodos();
        renderTodos();
      });
      // Delete
      li.querySelector('.delete-btn').addEventListener('click', function(e) {
        li.classList.remove('animate__fadeIn');
        li.classList.add('animate__fadeOutLeft');
        setTimeout(() => {
          todos.splice(idx, 1);
          saveTodos();
          renderTodos();
        }, 400);
      });
      // Toggle complete by clicking on text
      li.querySelector('span').addEventListener('click', function() {
        todos[idx].completed = !todos[idx].completed;
        saveTodos();
        renderTodos();
      });
      todoList.appendChild(li);
    });
    const activeCount = todos.filter(t => !t.completed).length;
    taskCount.textContent = `${activeCount} task${activeCount !== 1 ? 's' : ''} left`;
  }

  todoForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const value = todoInput.value.trim();
    if (!value) {
      todoInput.classList.add('is-invalid');
      setTimeout(() => todoInput.classList.remove('is-invalid'), 1200);
      return;
    }
    addSpinner.classList.remove('d-none');
    setTimeout(() => {
      todos.unshift({ text: value, completed: false });
      saveTodos();
      renderTodos();
      todoInput.value = '';
      addSpinner.classList.add('d-none');
      todoInput.focus();
    }, 400);
  });

  clearCompletedBtn.addEventListener('click', function() {
    todos = todos.filter(t => !t.completed);
    saveTodos();
    renderTodos();
  });

  renderTodos();
});
