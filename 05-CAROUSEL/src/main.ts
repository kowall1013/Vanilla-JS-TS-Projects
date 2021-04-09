function assert(condition: boolean, msg: string): asserts condition {
  if (!condition) {
    throw new Error(msg);
  }
}

const carousel = document.querySelector(".carousel");
assert(carousel !== null, "Cant find element carousel ");
const previousButton = carousel.querySelector(".previous-button");
const nextButton = carousel.querySelector(".next-button");
const carouselContents = carousel.querySelector(
  ".carousel__contents"
) as HTMLElement;
assert(carouselContents !== null, "Cant find element carousel ");
const slides = [
  ...carouselContents.querySelectorAll<HTMLElement>(".carousel__slide"),
];

const dotsContainer = createDots(slides);
const dots = [...dotsContainer.children];

function createDots(slides: HTMLElement[]) {
  const dotsContainer = document.createElement("div");
  dotsContainer.classList.add("carousel__dots");
  slides.forEach((slide) => {
    const dot = document.createElement("button");
    dot.classList.add("carousel__dot");

    if (slide.classList.contains("is-selected")) {
      dot.classList.add("is-selected");
    }
    dotsContainer.appendChild(dot);
  });
  return dotsContainer;
}

const setSlidePosition = () => {
  const slideWidthJs = slides[0].getBoundingClientRect().width;
  slides.forEach((slide, index) => {
    slide.style.left = slideWidthJs * index + "px";
  });
};

const hightlightDot = (currentDotIndex: number, targetDotIndex: number) => {
  const currentDot = dots[currentDotIndex];
  const targetDot = dots[targetDotIndex];
  currentDot.classList.remove("is-selected");
  targetDot.classList.add("is-selected");
};

const showHideArrowButtons = (tragetSlideIndex: number) => {
  assert(previousButton !== null, "Cant find element previousButton ");
  assert(nextButton !== null, "Cant find element nextButton ");

  if (tragetSlideIndex === 0) {
    previousButton.setAttribute("hidden", "true");
    nextButton.removeAttribute("hidden");
  } else if (tragetSlideIndex === dots.length - 1) {
    nextButton.setAttribute("hidden", "true");
    previousButton.removeAttribute("hidden");
  } else {
    nextButton.removeAttribute("hidden");
    previousButton.removeAttribute("hidden");
  }
};

const switchSlide = (currentSlideIndex: number, targetSlideIndex: number) => {
  const currentSlide = slides[currentSlideIndex];
  const targetSlide = slides[targetSlideIndex];
  const destination = getComputedStyle(targetSlide).left;

  carouselContents.style.transform = `translateX(-${destination})`;
  currentSlide.classList.remove("is-selected");
  targetSlide.classList.add("is-selected");
};

const getCurrentSlideIndex = () => {
  const currentSlide = carouselContents.querySelector(".is-selected");
  return slides.findIndex((s) => s === currentSlide);
};

setSlidePosition();
carousel.appendChild(dotsContainer);

assert(nextButton !== null, "Cant find element nextButton ");
nextButton.addEventListener("click", (event) => {
  const currentSlideIndex = getCurrentSlideIndex();
  const nextSlideIndex = currentSlideIndex + 1;

  const currentDot = dotsContainer.querySelector(".is-selected");
  assert(currentDot !== null, "Cant find element nextButton ");
  const nextDot = currentDot.nextElementSibling;

  switchSlide(currentSlideIndex, nextSlideIndex);
  hightlightDot(currentSlideIndex, nextSlideIndex);
  showHideArrowButtons(nextSlideIndex);
});

assert(previousButton !== null, "Cant find element previousButton ");
previousButton.addEventListener("click", (event) => {
  const currentSlideIndex = getCurrentSlideIndex();
  const previousSlideIndex = currentSlideIndex - 1;

  const currentDot = dotsContainer.querySelector(".is-selected");
  assert(currentDot !== null, "Cant find element currentDot ");
  const previousDot = currentDot.previousElementSibling;

  switchSlide(currentSlideIndex, previousSlideIndex);
  hightlightDot(currentSlideIndex, previousSlideIndex);
  showHideArrowButtons(previousSlideIndex);
});

const handleDots = (event: MouseEvent) => {
  assert(event.target !== null, "Cant find element currentDot ");
  const target = event.target as HTMLElement;
  const dot = target.closest("button");
  if (!dot) return;

  const currentSlideIndex = getCurrentSlideIndex();
  const tragetSlideIndex = dots.findIndex((d) => d === dot);
  const currentDot = dotsContainer.querySelector(".is-selected");

  switchSlide(currentSlideIndex, tragetSlideIndex);
  hightlightDot(currentSlideIndex, tragetSlideIndex);
  showHideArrowButtons(tragetSlideIndex);
};

dotsContainer.addEventListener("click", handleDots);
