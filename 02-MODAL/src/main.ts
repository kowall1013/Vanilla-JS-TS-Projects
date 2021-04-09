import { TimelineMax, Back } from "gsap";
const modalButton = document.querySelector(".jsModalButton") as HTMLElement;
const modalCloseButton = document.querySelector(".jsModalClose") as HTMLElement;
const modalOverlay = document.querySelector(".modal-overlay") as HTMLElement;
const wavingHand = document.querySelector(".wave-hand") as HTMLElement;
const modal = document.querySelector(".modal") as HTMLElement;

//FUNCTIONS

const wave = (hand: HTMLElement) => {
  const tl = new TimelineMax({});
  // Sets transform origin
  tl.set(hand, { transformOrigin: "bottom center" });
  tl.from(hand, 0.5, {
    scale: 0.25,
    opacity: 0,
    ease: Back.easeOut.config(1.5),
  });
  tl.to(hand, 0.2, { rotation: 15 });
  tl.to(hand, 0.2, { rotation: -15 });
  tl.to(hand, 0.2, { rotation: 15 });
  tl.to(hand, 0.2, { rotation: -15 });
  tl.to(hand, 0.2, { rotation: 0 });
};

const trapFocus = (event: KeyboardEvent) => {
  //Trap focus
  const focusable = modal.querySelectorAll("input, button");
  const firstFocusable = focusable[0] as HTMLElement;
  const lastFocusable = focusable[focusable.length - 1] as HTMLElement;

  //Directs to first focusable
  if (
    document.activeElement === lastFocusable &&
    event.key === "Tab" &&
    !event.shiftKey
  ) {
    event.preventDefault();
    firstFocusable.focus();
  }

  //Directs to last focusable
  if (
    document.activeElement === lastFocusable &&
    event.key === "Tab" &&
    event.shiftKey
  ) {
    event.preventDefault();
    lastFocusable.focus();
  }
};

/**
 *Close The modal and set focus on input
 */
const openModal = () => {
  document.body.classList.add("modal-is-open");

  const input = modal.querySelector("input") as HTMLInputElement;
  input.focus();
  document.addEventListener("keydown", trapFocus);
};

/**
 * close The Modal
 */
const closeModal = () => {
  document.body.classList.remove("modal-is-open");
  modalButton.focus();

  document.removeEventListener("keydown", trapFocus);
};

/**
 * Checks is modal is open
 * @returns Boolean if modal is open or nor
 */
const isModalOpen = () => {
  return document.body.classList.contains("modal-is-open");
};

//PROGRAM HERE

modalButton.addEventListener("click", (event) => {
  openModal();
  wave(wavingHand);
});

modalCloseButton.addEventListener("click", (event) => {
  closeModal();
});

modalOverlay.addEventListener("click", (event) => {
  const target = event.target as Element;
  if (!target.closest(".modal")) {
    closeModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && isModalOpen()) {
    closeModal();
  }
});
