"use strict";
//VARIABLES
var button = document.querySelector("button");
var body = document.body;
var menu = document.querySelector(".nav");
//FUNCTIONS
/**
 *Check whether the sidebar is open
 */
var isOffcanvasMenuOpen = function () {
    return body.classList.contains("offsite-is-open");
};
/**
 * Closes Sidebar
 */
var closeOffcanvasMenu = function () {
    body.classList.remove("offsite-is-open");
    button === null || button === void 0 ? void 0 : button.focus();
};
/**
 * Open Sidebar
 */
var openOffcanvasMenu = function () {
    body.classList.add("offsite-is-open");
    menu === null || menu === void 0 ? void 0 : menu.focus();
};
button === null || button === void 0 ? void 0 : button.addEventListener("click", function (event) {
    isOffcanvasMenuOpen() ? closeOffcanvasMenu() : openOffcanvasMenu();
});
document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && isOffcanvasMenuOpen()) {
        closeOffcanvasMenu();
    }
});
