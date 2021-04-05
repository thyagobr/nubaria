import { start_game } from "./game"

const start = () => {
  const msq = document.querySelector("#app")
  if (window.location.hash == "#/login") {
    fetch('login.html').then((response) => {
      response.text().then((html) => {
        msq.innerHTML = html
      })
    })
  } else {
    fetch('canvas.html').then((response) => {
      response.text().then((html) => {
        msq.innerHTML = html
        start_game()
      })
    })
  }
  console.log(window.location.hash)
}

document.addEventListener('DOMContentLoaded', start)
