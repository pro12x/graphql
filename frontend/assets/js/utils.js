export const encodeBase64 = (data) => {
    return btoa(data)
}

export const credentials = {
    username: "",
    password: ""
}

export const showMessage = (message) => {
    const item = document.getElementById("error")
    item.textContent = message
    item.style.display = "block"
    item.classList.add("error")

    setTimeout(() => {
        item.innerHTML = "&nbsp;"
        item.classList.remove("error")
    }, 3000)
}

export const checkForm = (credentials) => {
    return !(credentials.username.trim() === "" || credentials.password.trim() === "");
}