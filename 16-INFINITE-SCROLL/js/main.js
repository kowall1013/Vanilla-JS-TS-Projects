const endpoint = "https://api.learnjavascript.today/letters";
const lettersElement = document.querySelector(".letters");
const spinner = document.querySelector(".spinner");
const loadMoreButton = document.querySelector(".load-more-button");
const dribbbleSection = document.querySelector(".dribbble-section");

/**
 * Add Letters TPo DOM
 * @param {Array} letters
 */
const addLetterToDom = (letters) => {
  const fragmnet = document.createDocumentFragment();

  letters.forEach((letter) => {
    const li = document.createElement("li");
    li.innerHTML = `
                  <a class="letter" href="${letter.shotUrl}">
                    <span>By ${letter.creator}</span>
                    <img src="${letter.imageUrl}" alt="Picture of ${letter.letter}" width="400" height="300">
                  </a>
                `;
    fragmnet.appendChild(li);
  });
  lettersElement.appendChild(fragmnet);
};

/**
 * Hiding the HTML Element
 * @param {HTMLElement} element
 */
const hideElement = (element) => {
  element.setAttribute("hidden", "true");
};

/**
 *Showing the HTML Element
 * @param {HTMLElement} element
 */
const showElement = (element) => {
  element.removeAttribute("hidden");
};

/**
 * Updates the sections with fetching imgaes
 */
const fetchLetters = () => {
  showElement(spinner);
  hideElement(loadMoreButton);

  zlFetch(loadMoreButton.dataset.nextPage).then((response) => {
    const { letters, nextPage } = response.body;
    addLetterToDom(letters);
    hideElement(spinner);
    showElement(loadMoreButton);

    if (Boolean(nextPage)) {
      loadMoreButton.dataset.nextPage = nextPage;
    } else {
      hideElement(loadMoreButton);
      showElement(dribbbleSection);
    }
  });
};

zlFetch(`${endpoint}?limit=6&page=1`).then((response) => {
  const { letters, nextPage } = response.body;
  loadMoreButton.dataset.nextPage = nextPage;
  const fragmnet = document.createDocumentFragment();

  letters.forEach((letter) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <a class="letter" href="${letter.shotUrl}">
        <span>By ${letter.creator}</span>
        <img src="${letter.imageUrl}" alt="Picture of ${letter.letter}" width="400" height="300">
      </a>
    `;
    fragmnet.appendChild(li);
    hideElement(spinner);
  });
  lettersElement.appendChild(fragmnet);
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.click();
    }
  });
});

observer.observe(loadMoreButton);

loadMoreButton.addEventListener("click", fetchLetters);
