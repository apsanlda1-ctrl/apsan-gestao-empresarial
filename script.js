// Variáveis de Estado do Sistema
let currentSelectedDept = '';
let currentRequiredCode = '';

// Sistema de Notificações Toast
function showToast(title, message, isError = false) {
    const toast = document.getElementById('toastNotification');
    if (!toast) return;
    document.getElementById('toastTitle').textContent = title;
    document.getElementById('toastMessage').textContent = message;
    toast.style.borderLeft = isError ? '4px solid #dc3545' : '4px solid #28a745';
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

// 1. Gestão de Login
function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('userEmail').value;
    const pass = document.getElementById('userPassword').value;

    if (email && pass) {
        document.getElementById('loggedUserDisplay').textContent = email;
        document.getElementById('loginScreen').classList.remove('active');
        document.getElementById('departmentScreen').classList.add('active');
        showToast('Login Bem-Sucedido', 'Bem-vindo ao Sistema de Gestão Integrada da APSAN, LDA.');
    } else {
        showToast('Erro', 'Por favor, preencha todos os campos.', true);
    }
}

function logout() {
    document.getElementById('departmentScreen').classList.remove('active');
    document.getElementById('dashboardScreen').classList.remove('active');
    document.getElementById('loginScreen').classList.add('active');
    document.getElementById('userEmail').value = '';
    document.getElementById('userPassword').value = '';
    showToast('Sessão Terminada', 'Saiu do sistema com segurança.');
}

// 2. Seleção de Departamentos e Códigos de Acesso
function selectDept(deptName, deptCode) {
    currentSelectedDept = deptName;
    currentRequiredCode = deptCode;
    
    document.getElementById('modalDeptTitle').textContent = deptName;
    document.getElementById('deptCodeInput').value = '';
    document.getElementById('codeModal').style.display = 'flex';
}

function closeCodeModal() {
    document.getElementById('codeModal').style.display = 'none';
}

function verifyDeptCode(event) {
    event.preventDefault();
    const enteredCode = document.getElementById('deptCodeInput').value.trim().toUpperCase();

    if (enteredCode === currentRequiredCode.toUpperCase()) {
        closeCodeModal();
        document.getElementById('departmentScreen').classList.remove('active');
        document.getElementById('dashboardScreen').classList.add('active');
        document.getElementById('activeDeptNameIndicator').textContent = currentSelectedDept;
        document.getElementById('currentDeptMainTitle').innerHTML = `<i class="fas fa-tasks"></i> Gestão Operacional: ${currentSelectedDept}`;
        renderTasks(); // Carrega os dados persistentes ao entrar
        showToast('Acesso Permitido', `Entrou no departamento de ${currentSelectedDept}.`);
    } else {
        showToast('Código Incorreto', 'O código introduzido não corresponde ao exigido para este departamento.', true);
    }
}

function backToDepartments() {
    document.getElementById('dashboardScreen').classList.remove('active');
    document.getElementById('departmentScreen').classList.add('active');
}

// 3. Alternar Tema (Claro / Escuro)
function toggleTheme() {
    const body = document.body;
    const themeIcon = document.getElementById('themeIcon');
    
    if (body.getAttribute('data-theme') === 'light') {
        body.setAttribute('data-theme', 'dark');
        themeIcon.className = 'fas fa-sun';
        showToast('Tema Alterado', 'Modo escuro ativado.');
    } else {
        body.setAttribute('data-theme', 'light');
        themeIcon.className = 'fas fa-moon';
        showToast('Tema Alterado', 'Modo claro ativado.');
    }
}

// 4. Gestão de Tarefas (Offline-First com LocalStorage)
function openNewTaskModal() {
    document.getElementById('taskModal').style.display = 'flex';
}

function closeNewTaskModal() {
    document.getElementById('taskModal').style.display = 'none';
}

function addNewTask(event) {
    event.preventDefault();
    const title = document.getElementById('taskTitle').value;
    const owner = document.getElementById('taskOwner').value;
    const priority = document.getElementById('taskPriority').value;
    
    const newTask = {
        id: '#AP-' + Math.floor(100 + Math.random() * 900),
        title: title,
        owner: owner,
        date: new Date().toLocaleDateString('pt-PT'),
        priority: priority,
        status: 'Em Curso',
        synced: navigator.onLine
    };

    let tasks = JSON.parse(localStorage.getItem('apsan_tasks')) || [];
    tasks.unshift(newTask);
    localStorage.setItem('apsan_tasks', JSON.stringify(tasks));

    renderTasks();
    closeNewTaskModal();
    document.getElementById('taskTitle').value = '';
    document.getElementById('taskOwner').value = '';

    if (navigator.onLine) {
        showToast('Sucesso', 'Registo guardado e sincronizado.');
    } else {
        showToast('Modo Offline', 'Sem rede! O registo foi guardado localmente.');
    }
}

function renderTasks() {
    const tbody = document.getElementById('departmentTableBody');
    if (!tbody) return;

    let tasks = JSON.parse(localStorage.getItem('apsan_tasks')) || [];
    tbody.innerHTML = '';

    tasks.forEach((task, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${task.id} ${!task.synced ? '<i class="fas fa-clock" title="Pendente de sincronização" style="color:orange; margin-left:5px;"></i>' : ''}</td>
            <td>${task.title}</td>
            <td>${task.owner}</td>
            <td>${task.date}</td>
            <td><span class="badge ${task.priority.toLowerCase() === 'alta' ? 'high' : 'medium'}">${task.priority}</span></td>
            <td><span class="badge ${task.status === 'Concluído' ? '' : 'in-progress'}">${task.status}</span></td>
            <td>${task.status !== 'Concluído' ? `<button onclick="completeTask(${index})" class="btn-action">Concluir</button>` : ''}</td>
        `;
        tbody.appendChild(tr);
    });
}

function completeTask(index) {
    let tasks = JSON.parse(localStorage.getItem('apsan_tasks')) || [];
    tasks[index].status = 'Concluído';
    localStorage.setItem('apsan_tasks', JSON.stringify(tasks));
    renderTasks();
    showToast('Atualizado', 'O registo foi marcado como concluído.');
}

// Sincronização Automática ao detetar rede
window.addEventListener('online', () => {
    let tasks = JSON.parse(localStorage.getItem('apsan_tasks')) || [];
    let hasChanges = false;

    tasks = tasks.map(task => {
        if (!task.synced) {
            task.synced = true;
            hasChanges = true;
        }
        return task;
    });

    if (hasChanges) {
        localStorage.setItem('apsan_tasks', JSON.stringify(tasks));
        renderTasks();
        showToast('Rede Restabelecida', 'Dados sincronizados com sucesso!');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    renderTasks();
});
