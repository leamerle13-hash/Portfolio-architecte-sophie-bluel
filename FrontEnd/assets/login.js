const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginForm = document.querySelector(".connection");
const error = document.getElementById("error");

loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const loginValues = {
        email: emailInput.value,
        password: passwordInput.value
    };

    const loginJson = JSON.stringify(loginValues);

    const response = await fetch('http://localhost:5678/api/users/login', {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: loginJson
    });

    const data = await response.json();
    console.log(data);

    if (response.ok){
        window.localStorage.setItem("token", data.token);
        window.location.href = "index.html";
    } else {
        error.innerHTML = "";
        const errorMessage = document.createElement("p");
        errorMessage.innerText = "Email ou mot de passe incorrect";
        error.appendChild(errorMessage);
    }
});