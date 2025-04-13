const API = 'http://localhost:8080';
let token = localStorage.getItem('token');

if (token) {
    showMain();
}

async function register() {
    const username = getVal('username');
    const password = getVal('password');
    const res = await fetch(`${API}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    if (res.ok) alert('Registered! Now log in.');
    else alert(data.error);
}

async function login() {
    const username = getVal('username');
    const password = getVal('password');
    const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    if (res.ok) {
        token = data.token;
        localStorage.setItem('token', token);
        showMain();
    } else {
        alert(data.error);
    }
}

async function addPet() {
    const name = getVal('petName');
    const type = getVal('petType');
    const sex  = getVal('sex');
    const id   = getVal('editingId');

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API}/pets/${id}` : `${API}/pets`;

    const res = await fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, type, sex })
    });

    if (res.ok) {
        clearForm();
        loadPets();
    } else {
        alert('Failed to save pet');
    }
}

function clearForm() {
    ['petName', 'petType', 'sex', 'editingId'].forEach(id => {
        document.getElementById(id).value = '';
    });
}

async function loadPets() {
    const res = await fetch(`${API}/pets`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const pets = await res.json();
    const list = document.getElementById('petList');
    list.innerHTML = '';
    pets.forEach(pet => {
        const li = document.createElement('li');
        li.textContent = `${pet.name} - ${pet.sex === "M" ? "Male" : "Female"} (${pet.type}) `;

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.onclick = () => startEdit(pet);

        li.appendChild(editBtn);
        list.appendChild(li);
    });
}

function startEdit(pet) {
    document.getElementById('editingId').value = pet.id;
    document.getElementById('petName').value = pet.name;
    document.getElementById('petType').value = pet.type;
    document.getElementById('sex').value = pet.sex;
}

function showMain() {
    document.getElementById('auth').style.display = 'none';
    document.getElementById('main').style.display = 'block';
    loadPets();
}

function getVal(id) {
    return document.getElementById(id).value;
}

// Register service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
        .then(() => console.log('Service worker registered.'));
}
