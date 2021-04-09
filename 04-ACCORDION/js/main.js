//VARAIABLES
const accordionContainer = document.querySelector('.accordion-container')


//FUNCTIONS


/**
 * Finds the correct height of the accordion content
 * @param {HTMLElement} accordion
 * @returns {Number} Accordion content's height in px value
 */
const getContentHeight = (accordion) => {
  const accordionInner = accordion.querySelector('.accordion__inner')
  return accordionInner.getBoundingClientRect().height
}

/**
 *Update Accordion Content according to conatins class 'is-open'
 * @param {HTMLElement} accordion
 */
const updateAccordion = (accordion, height) => {
  const accordionContent = accordion.querySelector('.accordion__content')

  accordion.classList.toggle('is-open')
  accordionContent.style.height = `${height}px`
}

const closeAccordion = accordion => {
  const accordionHeaderButton = accordion.querySelector('.accordion__header').querySelector('button')
  const accordionContent = accordion.querySelector('.accordion__content')

  accordion.classList.remove('is-open')
  accordionContent.style.height = 0
  accordionHeaderButton.focus()
}

const openAccordion = accordion => {
  const accordionContent = accordion.querySelector('.accordion__content')
  const height = getContentHeight(accordion)

  accordionContent.style.height = `${getContentHeight(accordion)}px`
  accordion.classList.add('is-open')
}

const isAccordionOpen = accordion => {
  return accordion.classList.contains('is-open')
}



//ACCORDION

accordionContainer.addEventListener('click', event => {
  const accordionHeader = event.target.closest('.accordion__header')
  if (!accordionHeader) return

  const accordion = accordionHeader.parentElement

  isAccordionOpen(accordion)
    ? closeAccordion(accordion)
    : openAccordion(accordion)
})

document.addEventListener('keydown', event => {
  const accordion = event.target.closest('.accordion')
  const key = event.key

  if (!key === 'Escape') return
  if (!accordion) return

  if (isAccordionOpen(accordion)) {
    closeAccordion(accordion)
  }
})

document.addEventListener('keydown', event => {
  if (!event.target.closest('.accordion__header')) return
  const key = event.key

  const accordion = event.target.closest('.accordion')
  const accordions = [...accordionContainer.querySelectorAll('.accordion')]
  const index = accordions.findIndex(element => element === accordion)

  let targetAccordion

  if (key === 'ArrowDown' && accordions[index + 1]) {
    targetAccordion = accordions[index + 1]
  }

  if (key === 'ArrowUp' && accordions[index - 1]) {
    targetAccordion = accordions[index - 1]
  }

  if (targetAccordion) {
    targetAccordion.querySelector('button').focus()
  }
})









