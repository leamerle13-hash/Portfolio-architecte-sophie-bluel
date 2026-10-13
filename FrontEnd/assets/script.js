const buttonsContainer = document.querySelector(".buttonsContainer");
const gallery = document.querySelector(".gallery");

async function apiWorks() {
    const response = await fetch('http://localhost:5678/api/works');
    const responseJson = await response.json();
    return responseJson;
}

async function apiCategories() {
    const response = await fetch('http://localhost:5678/api/categories');
    const responseJson = await response.json();
    return responseJson;
}

async function init() {
    const works = await apiWorks();
    const categories = await apiCategories();
    console.log(works);
    console.log(categories);


    for (let i = 0; i < works.length; i++){
        display(works[i]);
    }

    const tousBtn = createBtn("Tous");
    tousBtn.addEventListener("click", () => {
        gallery.innerHTML = "";

        for (let i = 0; i < works.length; i++){
            display(works[i]);
        }

        updateBtn(tousBtn);
    })


    for (let j = 0; j < categories.length; j++){
        const filterButton = createBtn(categories[j].name);
        filterButton.dataset.id = categories[j].id;

        filterButton.addEventListener("click", () => {
            gallery.innerHTML = "";

            for (let k = 0; k < works.length; k++){
                if (works[k].categoryId === Number(filterButton.dataset.id)){
                    display(works[k]);
                }
            }

            updateBtn(filterButton);
        })
    }
}

init();

function display(workToDisplay) {
    const projectContainer = document.createElement("figure");

    const newImage = document.createElement("img");
    newImage.src = workToDisplay.imageUrl;
    projectContainer.appendChild(newImage);

    const newTitle = document.createElement("p");
    newTitle.innerText = workToDisplay.title;
    projectContainer.appendChild(newTitle);

    gallery.appendChild(projectContainer);
}

function createBtn(name) {
    const btn = document.createElement("button");
    btn.innerText = name;
    buttonsContainer.appendChild(btn);
    return btn;
}

function updateBtn(btn) {
    const buttons = buttonsContainer.children;

    for (let i = 0; i < buttons.length; i++){
        buttons[i].classList.remove('button-selected');
    }
    
    btn.classList.add('button-selected');
}