"use strict";
// ========================
// Variables
// ========================
const popoverTriggers = [...document.querySelectorAll('.popover-trigger')];
// ========================
// Functions
// ========================
/**
 * Helpers for assertions
 */
function assert(condition, msg) {
    if (!condition) {
        throw new Error(msg);
    }
}
/**
 * Generates a unique string
 */
const generateUniqueString = (length) => {
    return Math.random().toString(36).substring(2, 2 + length);
};
/**
 * Finds a popover from the trigger
 */
const getPopover = (popoverTrigger) => {
    return document.querySelector(`#${popoverTrigger.dataset.target}`);
};
/**
 * Creates a popover according to the trigger
 * @returns {HTMLElement}
 */
const createPopover = (popoverTrigger) => {
    const popover = document.createElement('div');
    popover.classList.add('popover');
    popover.dataset.position = popoverTrigger.dataset.popoverPosition;
    // Dynamic id
    const id = generateUniqueString(5);
    popover.id = id;
    popoverTrigger.dataset.target = id;
    const p = document.createElement('p');
    const content = popoverTrigger.dataset.content;
    assert(content !== undefined, 'content is undefined');
    p.textContent = content;
    popover.appendChild(p);
    document.body.appendChild(popover);
    return popover;
};
/**
 * Calculates top and left position of popover
 * @param {HTMLElement} popoverTrigger
 * @param {HTMLElement} popover
 * @returns {Object} Top and left values in px (without units)
 */
const calculatePopoverPosition = (popoverTrigger, popover) => {
    const popoverTriggerRect = popoverTrigger.getBoundingClientRect();
    const popoverRect = popover.getBoundingClientRect();
    const { position } = popover.dataset;
    const space = 20;
    if (position === 'top') {
        return {
            left: (popoverTriggerRect.left + popoverTriggerRect.right) / 2 - popoverRect.width / 2,
            top: popoverTriggerRect.top - popoverRect.height - space
        };
    }
    if (position === 'left') {
        return {
            left: popoverTriggerRect.left - popoverRect.width - space,
            top: (popoverTriggerRect.top + popoverTriggerRect.bottom) / 2 -
                (popoverRect.height / 2)
        };
    }
    if (position === 'right') {
        return {
            left: popoverTriggerRect.right + space,
            top: (popoverTriggerRect.top + popoverTriggerRect.bottom) / 2 - popoverRect.height / 2
        };
    }
    if (position === 'bottom') {
        return {
            left: (popoverTriggerRect.left + popoverTriggerRect.right) / 2 - popoverRect.width / 2,
            top: popoverTriggerRect.bottom + space
        };
    }
};
const hidePopover = (popover) => {
    popover.setAttribute('hidden', 'true');
};
const showPopover = (popover) => {
    popover.removeAttribute('hidden');
};
const getKeyboardFocusableElement = (element) => {
    return [...element.querySelectorAll('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])')];
};
const getPopoverTrigger = (popover) => {
    return document.querySelector(`.popover-trigger[data-target="${popover}"]`);
};
// ========================
// Execution
// ========================
// Positions popover
popoverTriggers.forEach(popoverTrigger => {
    const popoverTriggerAsHTMLElement = popoverTrigger;
    const popover = getPopover(popoverTriggerAsHTMLElement) || createPopover(popoverTriggerAsHTMLElement);
    const popoverPosition = calculatePopoverPosition(popoverTrigger, popover);
    assert(popoverPosition !== undefined, 'popoverPosition is undefined');
    popover.style.top = `${popoverPosition.top}px`;
    popover.style.left = `${popoverPosition.left}px`;
    // Hides popover once it is positioned
    hidePopover(popover);
});
// Show or hide popover when user clicks on the trigger
document.addEventListener('click', event => {
    const target = event.target;
    const popoverTrigger = target.closest('.popover-trigger');
    if (!popoverTrigger)
        return;
    const popover = document.querySelector(`#${popoverTrigger.dataset.target}`);
    assert(popover !== null, 'popover is null');
    if (popover.hasAttribute('hidden')) {
        showPopover(popover);
    }
    else {
        hidePopover(popover);
    }
});
// Hides popover user clicks something other than trigger or popover
document.addEventListener('click', event => {
    const target = event.target;
    if (!target.closest('.popover') && !target.closest('.popover-trigger')) {
        const popovers = [...document.querySelectorAll('.popover')];
        popovers.forEach(popover => popover.setAttribute('hidden', 'true'));
    }
});
document.addEventListener('keydown', event => {
    const target = event.target;
    const { key } = event;
    if (key !== 'Tab')
        return;
    if (event.shiftKey)
        return;
    const popoverTrigger = target.closest('.popover-trigger');
    if (!popoverTrigger)
        return;
    const popover = getPopover(popoverTrigger);
    assert(popover !== null, 'popover is null');
    const focusables = getKeyboardFocusableElement(popover);
    const shouldTabIntoPopover = !popover.hasAttribute('hidden') && focusables.length !== 0;
    if (shouldTabIntoPopover) {
        event.preventDefault();
        focusables[0].focus();
    }
});
document.addEventListener('keydown', event => {
    const tagret = event.target;
    const popover = tagret.closest('.popover');
    if (!popover)
        return;
    if (event.key !== 'Tab')
        return;
    const popoverTrigger = getPopoverTrigger(popover.id);
    const focusables = getKeyboardFocusableElement(popover);
    assert(popoverTrigger !== null, 'popoverTrigger is null');
    if (event.shiftKey && event.target === focusables[0]) {
        event.preventDefault();
        return popoverTrigger.focus();
    }
    if (!event.shiftKey && event.target === focusables[focusables.length - 1]) {
        return popoverTrigger.focus();
    }
});
document.addEventListener('keydown', event => {
    const { key } = event;
    if (key !== 'Escape')
        return;
    const target = event.target;
    const popover = target.closest('.popover');
    if (!popover)
        return;
    hidePopover(popover);
    const popoverTrigger = getPopoverTrigger(popover.id);
    assert(popoverTrigger !== null, 'popoverTrigger is null');
    popoverTrigger.focus();
});
