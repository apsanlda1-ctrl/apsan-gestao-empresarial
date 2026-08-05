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

// 4. Gestão de Tarefas e Registos no Dashboard
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
    
    const tableBody = document.getElementById('departmentTableBody');
    const randomId = '#AP-' + Math.floor(100 + Math.random() * 900);
    const currentDate = new Date().toLocaleDateString('pt-PT');

    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${randomId}</td>
        <td>${title}</td>
        <td>${owner}</td>
        <td>${currentDate}</td>
        <td><span class="badge ${priority.toLowerCase() === 'alta' ? 'high' : 'medium'}">${priority}</span></td>
        <td><span class="badge in-progress">Em Curso</span></td>
        <td><button onclick="completeTask(this)" class="btn-action">Concluir</button></td>
    `;
    
    tableBody.prepend(newRow);
    closeNewTaskModal();
    showToast('Sucesso', 'Novo registo adicionado com sucesso.');
    document.getElementById('taskTitle').value = '';
    document.getElementById('taskOwner').value = '';
}

function completeTask(button) {
    const row = button.closest('tr');
    const statusBadge = row.querySelector('.badge.in-progress');
    if (statusBadge) {
        statusBadge.className = 'badge';
        statusBadge.style.backgroundColor = '#28a745';
        statusBadge.style.color = '#fff';
        statusBadge.textContent = 'Concluído';
    }
    button.remove();
    showToast('Atualizado', 'O registo foi marcado como concluído.');
}
