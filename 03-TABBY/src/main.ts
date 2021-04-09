// Resolve browser inconsistencies when clicking on buttons
document.addEventListener("click", (event) => {
  const target = event.target as HTMLElement;
  if (target.matches("button")) {
    target.focus();
  }
});

function assert(condition: boolean, msg: string): asserts condition {
  if (!condition) {
    throw new Error(msg);
  }
}

//VARAIBLES
const tabs = [...document.querySelectorAll<HTMLElement>(".tab")];
const tabby = document.querySelector(".tabby");

//Assertions
assert(tabby !== null, ".tabby not exists");

const tabContents = [...tabby.querySelectorAll(".tab-content")];
const tabsContainer = tabby.querySelector<HTMLElement>(".tabs");
//FUNCTIONS

/**
 * Select the correct tab
 * @param {HTMLEmelemnt} tab
 */
const selectTab = (tab: HTMLElement) => {
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
const getPreviousTab = (index: number) => {
  if (index !== 0) {
    return tabs[index - 1];
  }
};

/**
 *Return the next Element of the clcick element
 * @param {Number} index
 * @returns {HTMLElement}
 */
const getNextTab = (index: number) => {
  if (index !== tabs.length - 1) {
    return tabs[index + 1];
  }
};

//Assertions
assert(tabsContainer !== null, ".tabsContainer not exists");

tabsContainer.addEventListener("click", (event) => {
  const tab = <HTMLElement>event.target;
  selectTab(tab);
});

tabsContainer.addEventListener("keydown", (event) => {
  if (!event.currentTarget) {
    return;
  }

  const target = event.currentTarget as HTMLElement;

  const { key } = event;
  if (key !== "ArrowLeft" && key !== "ArrowRight") return;
  if (!target.matches(".tab")) return;
  const index = tabs.findIndex((tab) => tab.classList.contains("is-selected"));
  let targetTab;
  if (key === "ArrowLeft") targetTab = getPreviousTab(index);
  if (key === "ArrowRight") targetTab = getNextTab(index);
  if (targetTab) {
    selectTab(targetTab);
  }
});
