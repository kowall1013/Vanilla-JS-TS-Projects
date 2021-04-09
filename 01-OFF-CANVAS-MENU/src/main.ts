//VARIABLES
const button = document.querySelector("button") as HTMLButtonElement;
const body = document.body;
const menu = document.querySelector(".nav") as HTMLElement;

//FUNCTIONS

/**
 *Check whether the sidebar is open
 */
const isOffcanvasMenuOpen = () => {
  return body.classList.contains("offsite-is-open");
};

/**
 * Closes Sidebar
 */
const closeOffcanvasMenu = () => {
  body.classList.remove("offsite-is-open");
  button.focus();
};

/**
 * Open Sidebar
 */
const openOffcanvasMenu = () => {
  body.classList.add("offsite-is-open");
  menu.focus();
};

button.addEventListener("click", (event) => {
  isOffcanvasMenuOpen() ? closeOffcanvasMenu() : openOffcanvasMenu();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && isOffcanvasMenuOpen()) {
    closeOffcanvasMenu();
  }
});
