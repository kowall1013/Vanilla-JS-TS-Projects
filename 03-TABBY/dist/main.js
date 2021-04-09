"use strict";
// Resolve browser inconsistencies when clicking on buttons
document.addEventListener("click", (event) => {
    const target = event.target;
    if (target.matches("button")) {
        target.focus();
    }
});
function assert(condition, msg) {
    if (!condition) {
        throw new Error(msg);
    }
}
//VARAIBLES
const tabs = [...document.querySelectorAll(".tab")];
const tabby = document.querySelector(".tabby");
//Assertions
assert(tabby !== null, ".tabby not exists");
const tabContents = [...tabby.querySelectorAll(".tab-content")];
const tabsContainer = tabby.querySelector(".tabs");
//FUNCTIONS
/**
 * Select the correct tab
 * @param {HTMLEmelemnt} tab
 */
const selectTab = (tab) => {
    const target = tab.dataset.theme;
    const tabContent = tabby.querySelector("#" + target);
    //Select Tab
    tabs.forEach((t) => {
        t.classList.remove("is-selected");
        t.setAttribute("tabindex", "-1");
    });
    tab.classList.add("is-selected");
    tab.removeAttribute("tabindex");
    //Selects the corresponding tab content
    tabContents.forEach((content) => content.classList.remove("is-selected"));
    //Assertions
    assert(tabContent !== null, ".tabContent not exists");
    tabContent.classList.add("is-selected");
};
/**
 * Return the previous Element of the clcick element
 * @param {Number} index
 * @returns {HTMLElement}
 */
const getPreviousTab = (index) => {
    if (index !== 0) {
        return tabs[index - 1];
    }
};
/**
 *Return the next Element of the clcick element
 * @param {Number} index
 * @returns {HTMLElement}
 */
const getNextTab = (index) => {
    if (index !== tabs.length - 1) {
        return tabs[index + 1];
    }
};
//Assertions
assert(tabsContainer !== null, ".tabsContainer not exists");
tabsContainer.addEventListener("click", (event) => {
    const tab = event.target;
    assert(tab !== null, ".tabsContainer not exists");
    selectTab(tab);
});
tabsContainer.addEventListener("keydown", (event) => {
    const { key } = event;
    if (key !== "ArrowLeft" && key !== "ArrowRight")
        return;
    if (!event.target.matches(".tab"))
        return;
    const index = tabs.findIndex((tab) => tab.classList.contains("is-selected"));
    let targetTab;
    if (key === "ArrowLeft")
        targetTab = getPreviousTab(index);
    if (key === "ArrowRight")
        targetTab = getNextTab(index);
    if (targetTab) {
        selectTab(targetTab);
    }
});
