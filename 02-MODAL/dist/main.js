"use strict";
/* global TimelineMax Back */
var modalButton = document.querySelector(".jsModalButton");
var modalCloseButton = document.querySelector(".jsModalClose");
var modalOverlay = document.querySelector(".modal-overlay");
var wavingHand = document.querySelector(".wave-hand");
var modal = document.querySelector(".modal");
//FUNCTIONS
var wave = function (hand) {
  var tl = new TimelineMax({});
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
var trapFocus = function (event) {
  //Trap focus
  var focusable = modal.querySelectorAll("input, button");
  var firstFocusable = focusable[0];
  var lastFocusable = focusable[focusable.length - 1];
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
var openModal = function () {
  document.body.classList.add("modal-is-open");
  var input = modal.querySelector("input");
  input.focus();
  document.addEventListener("keydown", trapFocus);
};
/**
 * close The Modal
 */
var closeModal = function () {
  document.body.classList.remove("modal-is-open");
  modalButton.focus();
  document.removeEventListener("keydown", trapFocus);
};
/**
 * Checks is modal is open
 * @returns Boolean if modal is open or nor
 */
var isModalOpen = function () {
  return document.body.classList.contains("modal-is-open");
};
//PROGRAM HERE
modalButton.addEventListener("click", function (event) {
  openModal();
  wave(wavingHand);
});
modalCloseButton.addEventListener("click", function (event) {
  closeModal();
});
modalOverlay.addEventListener("click", function (event) {
  if (!event.target.closest(".modal")) {
    closeModal();
  }
});
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && isModalOpen()) {
    closeModal();
  }
});
