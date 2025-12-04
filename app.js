let database = [];
let lastId = 0;

const LS_KEY = "biblio_db_final";

const titleInput = document.querySelector("#title");
const authorInput = document.querySelector("#author");
const categoryInput = document.querySelector("#category");
const isbnInput = document.querySelector("#isbn");
const searchInput = document.querySelector("#search");

const btnAdd = document.querySelector("#btnAdd");
const btnReset = document.querySelector("#btnReset");

const tableBody = document.querySelector("#tableBody");
const countSpan = document.querySelector("#count");
const msgBox = document.querySelector("#message");

function loadDatabase() {
    const data = localStorage.getItem(LS_KEY);
    if (!data) return;

    try {
        database = JSON.parse(data);
        if (database.length > 0) {
            lastId = database[database.length - 1].uid;
        }
    } catch {
        console.error("Erreur JSON");
    }
}

loadDatabase();
render();

btnAdd.addEventListener("click", () => {
    const title = titleInput.value.trim();
    const author = authorInput.value.trim();
    const isbn = isbnInput.value.trim();
    const categoryValue = categoryInput.value;

    if (!title) return alert("Erreur Titre");
    if (!author) return alert("Erreur Auteur");
    if (isbn.length <= 3) return alert("Erreur ISBN");

    lastId++;

    const dateObj = new Date();
    const dateStr = `${dateObj.getDate()}/${dateObj.getMonth() + 1}/${dateObj.getFullYear()}`;

    const categoryLabel =
        categoryValue === "1" ? "Science-Fiction" :
        categoryValue === "2" ? "Documentaire" :
        "Roman";

    const item = {
        uid: lastId,
        Name: title,
        auteur_name: author,
        k: categoryLabel,
        stuff: `${isbn} | ${dateStr}`,
        is_dead: false
    };

    database.push(item);
    saveDatabase();
    render();
    clearForm();
    showMessage("C'est bon !");
});

function saveDatabase() {
    localStorage.setItem(LS_KEY, JSON.stringify(database));
}

function render() {
    tableBody.innerHTML = "";
    let count = 0;

    database.forEach((item) => {
        if (item.is_dead) return;

        count++;

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>#${item.uid}</td>
            <td><b>${item.Name.toUpperCase()}</b><br><i>${item.auteur_name}</i></td>
            <td><span class="tag">${item.k}</span></td>
            <td>${item.stuff}</td>
            <td><button class="btn-del" data-id="${item.uid}">X</button></td>
        `;

        tableBody.appendChild(row);
    });

    countSpan.textContent = count;
}

tableBody.addEventListener("click", (e) => {
    if (!e.target.classList.contains("btn-del")) return;

    const id = Number(e.target.dataset.id);
    if (!confirm("Supprimer ?")) return;

    database = database.map((item) =>
        item.uid === id ? { ...item, is_dead: true } : item
    );

    saveDatabase();
    render();
});

searchInput.addEventListener("input", () => {
    const filter = searchInput.value.toUpperCase();
    const rows = tableBody.getElementsByTagName("tr");

    Array.from(rows).forEach((row) => {
        const col = row.getElementsByTagName("td")[1];
        const txt = col.textContent.toUpperCase();
        row.style.display = txt.includes(filter) ? "" : "none";
    });
});

btnReset.addEventListener("click", () => {
    if (!confirm("Voulez-vous vraiment tout supprimer ?")) return;
    localStorage.clear();
    location.reload();
});

function clearForm() {
    titleInput.value = "";
    authorInput.value = "";
    isbnInput.value = "";
}

function showMessage(msg) {
    msgBox.textContent = msg;
    setTimeout(() => (msgBox.textContent = ""), 3000);
}