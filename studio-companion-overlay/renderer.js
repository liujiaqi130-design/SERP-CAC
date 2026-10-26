const root = document.querySelector("#root")
const chatFrame = document.querySelector("#chat-frame")

function setOpen(open) {
  root.classList.toggle("open", open)
  if (open && chatFrame.src === "about:blank") {
    chatFrame.src = chatFrame.dataset.src
  }
  window.studioCompanion.setSize(open ? "open" : "collapsed")
}

document.querySelector("#open").addEventListener("click", () => setOpen(true))
document.querySelector("#collapse").addEventListener("click", () => setOpen(false))
document.querySelector("#quit").addEventListener("click", () => window.studioCompanion.quit())
document.querySelector("#quit-open").addEventListener("click", () => window.studioCompanion.quit())