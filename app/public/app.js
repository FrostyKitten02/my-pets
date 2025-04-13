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
    allPets = await res.json(); // store all pets
    renderPetList(allPets);
}

function renderPetList(pets) {
    const list = document.getElementById('petList');
    list.innerHTML = '';
    pets.forEach(pet => {
        const li = document.createElement('li');
        li.textContent = `${pet.name} - ${pet.sex === "M" ? "Male" : "Female"} (${pet.type}) `;

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.onclick = () => startEdit(pet);

        const delBtn = document.createElement('button');
        delBtn.textContent = 'Delete';
        delBtn.onclick = () => deletePet(pet.id);

        li.appendChild(editBtn);
        li.appendChild(delBtn);
        list.appendChild(li);
    });
}

function filterPets() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const filtered = allPets.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.type.toLowerCase().includes(query) ||
        (p.sex === 'M' ? 'male' : 'female').includes(query)
    );
    renderPetList(filtered);
}

async function deletePet(id) {
    if (!confirm('Are you sure you want to delete this pet?')) return;

    const res = await fetch(`${API}/pets/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (res.ok) {
        alert('Pet deleted');
        loadPets();
    } else {
        alert('Failed to delete pet');
    }
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

window.addEventListener('online', () => {
    if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ type: 'SYNC_REQUEST' });
    }
});