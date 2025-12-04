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

