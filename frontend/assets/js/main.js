import Dashboard from "./views/Dashboard.js"
import Login from "./views/Login.js"
import showMessage from "./utils.js"
import AbstractView from "./views/AbstractView.js";

let authMethods = new Login()
let graphMethods = new Dashboard()
let globalMethods = new AbstractView()

export const ConvertXpBar = (xp) => {
    // Convertit une valeur d'XP en une chaîne lisible avec des unités, avec une décimale
    if (xp < 1000) {
        return xp.toFixed(1).toString() + "B";
    } else if (xp < 1000000) {
        return ((xp * 0.001).toFixed(1)).toString() + "KB";
    } else {
        return (xp * 0.0001).toFixed(1).toString() + "MB";
    }
}

export const ConvertXp = (xp) => {
    // Convertit une valeur d'XP en une chaîne lisible avec des unités
    if (xp < 1000) {
        return (Math.round(xp)).toString() + "B";
    } else if (xp < 1000000) {
        return (Math.round(xp * 0.001)).toString() + "KB";
    } else {
        var temp = xp / 1000000
        return temp.toFixed(2).toString() + "MB";;
    }
}

export const navigateTo = url => {
    history.pushState(null, null, url)
    router().then()
}

const router = async () => {
    const routes = [
        { path: "/", view: Login },
        { path: "/dashboard", view: Dashboard },
    ]

    // Test each route for potential match
    const potentialMatches = routes.map(route => {
        return {
            route: route,
            isMatch: location.pathname === route.path
        }
    })

    let match = potentialMatches.find(potentialMatch => potentialMatch.isMatch)

    if (!match) {
        match = {
            route: routes[0],
            isMatch: true
        }
    }

    if (match.route.path === "/" && authMethods.isAuthenticated()) {
        navigateTo("/dashboard")
        return
    }

    if (match.route.path !== "/" && !authMethods.isAuthenticated()) {
        navigateTo("/")
        return
    }

    const view = new match.route.view()

    document.querySelector("#app").innerHTML = await view.getHtml()
}

window.addEventListener("popstate", router)

document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", e => {
        if (e.target.matches("[data-link]")) {
            e.preventDefault()
            navigateTo(e.target.href)
        }
    })

    if (authMethods.isAuthenticated()) {
        graphMethods.graphData()
    }

    router().then(() => {
        console.log("Router loaded")

        const togglePassword = document.getElementById("visibility")
        if (togglePassword) {
            togglePassword.addEventListener("change", (e) => {
                const password = document.getElementById("password")
                const show = document.getElementById("show")
                if (e.target.checked) {
                    password.type = "text"
                    show.innerText = "Hide password"
                } else {
                    password.type = "password"
                    show.innerText = "Show password"
                }
            })
        }

        const form = document.querySelector("form")
        if (form) {
            form.addEventListener("submit", async (e) => {
                e.preventDefault()

                credentials.username = document.getElementById("username").value
                credentials.password = document.getElementById("password").value

                if (!checkForm(credentials)) {
                    showMessage("Please fill in all fields")
                    return
                }

                authMethods.login(credentials)
            })
        }

        document.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault()

                credentials.username = document.getElementById("username").value
                credentials.password = document.getElementById("password").value

                if (!checkForm(credentials)) {
                    showMessage("Please fill in all fields")
                    return
                }

                authMethods.login(credentials)
            }
        })

        let btn = document.getElementById("logout")
        if (authMethods.isAuthenticated() && btn) {
            btn.addEventListener("click", (e) => {
                e.preventDefault()
                globalMethods.logout()
            })
        }
    })
})