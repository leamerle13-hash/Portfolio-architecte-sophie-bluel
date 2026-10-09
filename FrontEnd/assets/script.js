const portfolio = document.getElementById("portfolio");
const gallery = document.querySelector(".gallery");
const buttonContainer = document.querySelector(".buttonContainer");

fetch("http://localhost:5678/api/works")
    .then(response => response.json())
    .then(data => {
        data.map(function (work){
        const figure = document.createElement("figure");
        gallery.appendChild(figure);

        //console.log(work.imageUrl)
        const image = document.createElement("img");
        image.setAttribute('src', work.imageUrl);
        figure.appendChild(image);

        const caption = document.createElement("figcaption");
        caption.innerText = work.title;
        figure.appendChild(caption);        
})

    //// Filtres
    const tousButton = document.createElement("button");
    tousButton.innerText = "Tous";
    buttonContainer.appendChild(tousButton);

    tousButton.addEventListener("click", () => {
        updateButtons(tousButton);
        display(data);
    })


    const objectButton = document.createElement("button");
    objectButton.innerText = "Objets";
    buttonContainer.appendChild(objectButton);

    objectButton.addEventListener("click", () => {
        updateButtons(objectButton);
        const objects = data.filter(function (work){
            return work.category.name === "Objets";
        })
        display(objects);
    })


    const appartementsButton = document.createElement("button");
    appartementsButton.innerText = "Appartements";
    buttonContainer.appendChild(appartementsButton);

    appartementsButton.addEventListener("click", () => {
        updateButtons(appartementsButton)
        const appartements = data.filter(function (work){
            return work.category.name === "Appartements";
        })
        display(appartements);
    })


    const hotelButton = document.createElement("button");
    hotelButton.innerText = "Hotels & restaurants";
    buttonContainer.appendChild(hotelButton);

    hotelButton.addEventListener("click", () => {
        updateButtons(hotelButton)
        const hotels = data.filter(function (work){
            return work.category.name === "Hotels & restaurants";
        })
        display(hotels);
    })
    
});





function display (works){
    gallery.innerHTML = "";
    works.map(function (work){
    const figure = document.createElement("figure");
    gallery.appendChild(figure);

    const image = document.createElement("img");
    image.setAttribute('src', work.imageUrl);
    figure.appendChild(image);

    const caption = document.createElement("figcaption");
    caption.innerText = work.title;
    figure.appendChild(caption);
    })
}

function updateButtons (buttonSelected){
    const allButtons = buttonContainer.children;
    for (let button of allButtons){
        button.classList.remove("button-selected");
    }
    buttonSelected.classList.add("button-selected");
}
