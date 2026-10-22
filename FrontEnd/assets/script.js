const buttonsContainer = document.querySelector(".buttonsContainer");
const gallery = document.querySelector(".gallery");
const workCategory = document.getElementById("work-category");
let works = [];

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
    works = await apiWorks();
    const categories = await apiCategories();



    for (let i = 0; i < works.length; i++){
        display(works[i]);
        miniatureDisplay(works[i]);
    }

    const tousBtn = createBtn("Tous");
    tousBtn.classList.add("button-selected");
    tousBtn.addEventListener("click", () => {
        gallery.innerHTML = "";

        for (let i = 0; i < works.length; i++){
            display(works[i]);
        }

        updateBtn(tousBtn);
    })

    // reinitialiser categories
    workCategory.innerHTML = '<option value=""></option>';

    // filtres
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
        
        const newOption = document.createElement("option");
        newOption.innerText = categories[j].name;
        newOption.dataset.id = categories[j].id;
        workCategory.appendChild(newOption);
    }  
}

// Changement display login

const token = localStorage.getItem("token");

const editionBanner = document.getElementById("edition-banner");
const editButton = document.querySelector(".edit-button");
const loginLink = document.getElementById("login-link");

if (token){
    editionBanner.style.display = "block";
    editButton.style.display = "block";
    buttonsContainer.style.display = "none";
    loginLink.innerText = "logout";
    loginLink.href = "#";

    loginLink.addEventListener("click", function(event) {
        event.preventDefault();

        localStorage.removeItem("token");

        window.location.reload();
    });
}


// Modale

const modal = document.getElementById("modal");
const closeButton = document.getElementById("modal-close");
const galleryView = document.getElementById("modal-gallery-view");
const modalForm = document.getElementById("modal-form");
const addPhotoButton = document.querySelector(".modal-add-button");
const backButton = document.getElementById("modal-back");
const galleryModal = document.querySelector(".modal-gallery");


editButton.addEventListener("click", () => {
    modal.style.display = "flex";
    
    galleryView.hidden = false;
    modalForm.hidden = true;
})

closeButton.addEventListener("click", () => {
    modal.style.display ="none";
})

modal.addEventListener("click", function(event){
    if (event.target === modal){
        modal.style.display = "none";
    }
})

addPhotoButton.addEventListener("click", () => {
    galleryView.hidden = true;
    modalForm.hidden = false;
})

backButton.addEventListener("click", () => {
    galleryView.hidden = false;
    modalForm.hidden = true;
})


//ajout photo
const updatedfile = document.getElementById("modal-updated-file");
const fileErrorMessage = document.getElementById("file-error-message");
const workTitleInput = document.getElementById("work-title");
const updatedFileInfo = document.getElementById("updated-file-info");
const previewImgContainer = document.getElementById("preview-img-container");


updatedfile.addEventListener("change", () => {
    previewImgContainer.innerHTML = "";
    fileErrorMessage.innerText = "";

    const file = updatedfile.files[0];
    console.log(file);

    if (file.size > 4 * 1024 *1024){
        fileErrorMessage.innerText = "Trop volumineux";
        return;
    }

    const fileFormat = ["image/jpeg", "image/png"];
    if (!fileFormat.includes(file.type)){
        fileErrorMessage.innerText = "Mauvais format";
        return;
    }

    // Preview
    const previewImg = document.createElement("img");
    previewImg.src = URL.createObjectURL(file);
    previewImgContainer.appendChild(previewImg);
    updatedFileInfo.style.display = "none"
    previewImgContainer.style.display = "flex"
})


//ajout projet
const newWorkForm = document.getElementById("add-work-form");


newWorkForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    
    const file = updatedfile.files[0];
    const workTitle = workTitleInput.value;

    if (!file){
        return;
    }

    const selectCategory = document.getElementById("work-category");
    const workCategory = selectCategory.selectedOptions[0].dataset.id;

    const formData = new FormData();
    formData.append("image", file);
    formData.append("title", workTitle);
    formData.append("category", workCategory);

    const send = await fetch('http://localhost:5678/api/works' , {
        method: "POST",
        headers: {"Authorization": `Bearer ${localStorage.getItem("token")}`},
        body: formData
    })
     
    if (send.status === 201){
        console.log("projet ajouté");
        gallery.innerHTML = "";
        galleryModal.innerHTML = "";
        workTitleInput.value = "";
        updatedfile.value = "";
        previewImgContainer.style.display = "none";
        updatedFileInfo.style.display = "flex"
        await init();
    }
})



/////

init();

function miniatureDisplay(workToDisplay) {
    const miniContainer = document.createElement("figure");

    const newImage = document.createElement("img");
    newImage.src = workToDisplay.imageUrl;
    miniContainer.appendChild(newImage);

    const deleteContainer = document.createElement("div");
    deleteContainer.classList.add("delete-container")

    const icone = document.createElement("i");
    icone.classList.add("fa-solid", "fa-trash-can", "delete-icon");
    deleteContainer.appendChild(icone);

    miniContainer.appendChild(deleteContainer);

    galleryModal.appendChild(miniContainer);

    deleteContainer.addEventListener("click", () => {
        deleteWork(workToDisplay.id, miniContainer);
    })
}

async function deleteWork(id, miniContainer) {
    const token = localStorage.getItem("token");

    const response = await fetch(`http://localhost:5678/api/works/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if (response.ok) {
        miniContainer.remove();
        const projectToDelete = gallery.querySelector(`[data-id="${id}"]`);
        if (projectToDelete){
            projectToDelete.remove();
        }
    } else {
        console.log("Erreur");
    }
}

function display(workToDisplay) {
    const projectContainer = document.createElement("figure");
    projectContainer.dataset.id = workToDisplay.id;

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