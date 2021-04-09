/* globals getComputedStyle */
// ========================
// Variables
// ========================
const date = new Date(2019, 1, 13)
const input = document.querySelector('input')

// ========================
// Functions
// ========================
/**
 * Converts datetime into a Date object
 * @param {String} datetime - datetime attribute from <time> element
 */
const datetimeToDate = datetime => {
  const [year, month, day = 1] = datetime.split('-')
    .map(num => parseInt(num))

  return new Date(year, month - 1, day)
}

/**
 * Creates a number string with two digits.
 * @param {Number} number
 */
const toTwoDigitString = number => {
  return number.toString().padStart(2, '0')
}

const getFocusableElements = (element = document) => {
  return [...element.querySelectorAll(
    'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
  )]
}

/**
 * Creates the innerHTML for the date grid.
 * @param {Date} date - Date object
 * @returns {String}
 */
const createDateGridHTML = date => {
  const dategrid = document.createElement('div')
  const year = date.getFullYear()
  const month = date.getMonth()
  const firstDayOfMonth = new Date(date.setDate(1)).getDay()
  const lastDayInMonth = new Date(year, month + 1, 0)
  const daysInMonth = lastDayInMonth.getDate()
  const datetimeMonth = toTwoDigitString(month + 1)

  for (let day = 1; day <= daysInMonth; day++) {
    const button = document.createElement('button')
    button.classList.add('datepicker__date')
    button.setAttribute('type', 'button')

    if (day === 1) button.style.setProperty('--firstDayOfMonth', firstDayOfMonth + 1)
    if (day !== 1) button.setAttribute('tabindex', '-1')

    const datetimeDay = toTwoDigitString(day)
    button.innerHTML = `
      <time datetime="${year}-${datetimeMonth}-${datetimeDay}">${day}</time>
    `

    dategrid.appendChild(button)
  }

  return dategrid.innerHTML
}

/**
 * Create <time> for the year-month-indicator
 * @param {Date} date - Date object
 */
const createYearMonthIndicatorTimeElement = date => {
  const monthsInAYear = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]

  const year = date.getFullYear()
  const targetMonth = date.getMonth()
  const monthName = monthsInAYear[targetMonth]
  const datetimeMonth = toTwoDigitString(targetMonth + 1)

  return `
      <time datetime="${year}-${datetimeMonth}">${monthName} ${year}</time>
    `
}

/**
 * Creates the datepicker
 * @param {HTMLElement} input - the input element
 * @param {Date} date - Date object
 */
const createDatepicker = (input, date) => {
  const datepicker = document.createElement('div')
  datepicker.classList.add('datepicker')

  const previousNextMonthButtons = `
    <div class="datepicker__buttons">
      <button class="datepicker__previous">
        <svg viewBox="0 0 20 20">
          <path fill="currentColor" d="M7.05 9.293L6.343 10 12 15.657l1.414-1.414L9.172 10l4.242-4.243L12 4.343z" /></svg>
        </svg>
      </button>

      <button class="datepicker__next">
        <svg viewBox="0 0 20 20">
          <path fill="currentColor" d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z" />
        </svg>
      </button>
    </div>
  `

  const calendar = `
    <div class="datepicker__calendar">
      <div class="datepicker__year-month">
        ${createYearMonthIndicatorTimeElement(date)}
      </div>
      <div class="datepicker__day-of-week">
        <div>Su</div>
        <div>Mo</div>
        <div>Tu</div>
        <div>We</div>
        <div>Th</div>
        <div>Fr</div>
        <div>Sa</div>
      </div>
      <div class="datepicker__date-grid">
        ${createDateGridHTML(date)}
      </div>
    </div>
  `

  datepicker.innerHTML = `
    ${previousNextMonthButtons}
    ${calendar}
  `

  datepicker.setAttribute('hidden', true)

  // Positions the datepicker
  const inputRect = input.getBoundingClientRect()
  const oneRem = parseInt(getComputedStyle(document.body)['font-size'])
  datepicker.style.left = `${inputRect.left}px`
  datepicker.style.top = `${inputRect.bottom + oneRem}px`

  const previousnextMonthButtons = datepicker.querySelector('.datepicker__buttons')
  const dategrid = datepicker.querySelector('.datepicker__date-grid')

  // ========================
  // Functions
  // ========================
  /**
   * Gets a Date object from the Year Month indicator
   * @returns {Date}
   */
  const getDateFromYearMonthIndicator = _ => {
    const time = datepicker.querySelector('.datepicker__year-month').firstElementChild
    const datetime = time.getAttribute('datetime')
    return datetimeToDate(datetime)
  }

  // ========================
  // Event listeners
  // ========================
  previousnextMonthButtons.addEventListener('click', event => {
    if (!event.target.matches('button')) return
    // Gets current date
    const currentDate = getDateFromYearMonthIndicator()

    // Gets target date
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const targetDate = event.target.matches('.datepicker__previous')
      ? new Date(year, month - 1)
      : new Date(year, month + 1)

    // Updates the calendar
    const dategrid = datepicker.querySelector('.datepicker__date-grid')
    const yearMonthIndicator = datepicker.querySelector('.datepicker__year-month')
    yearMonthIndicator.innerHTML = createYearMonthIndicatorTimeElement(targetDate)
    dategrid.innerHTML = createDateGridHTML(targetDate)
  })

  // Selects a date
  dategrid.addEventListener('click', event => {
    if (!event.target.matches('button')) return
    const button = event.target
    const buttons = [...button.parentElement.children]

    // Highlights the selected button (and corrects tabindex)
    buttons.forEach(button => {
      button.classList.remove('is-selected')
      button.setAttribute('tabindex', '-1')
    })
    button.classList.add('is-selected')
    button.removeAttribute('tabindex')

    // Gets selected date
    const time = button.firstElementChild
    const datetime = time.getAttribute('datetime')
    const selectedDate = datetimeToDate(datetime)

    // Formats date for output
    const year = selectedDate.getFullYear()
    const month = toTwoDigitString(selectedDate.getMonth() + 1)
    const day = toTwoDigitString(selectedDate.getDate())
    const formatted = `${day}/${month}/${year}`

    // Output date to the input element
    input.value = formatted
  })

  // Shows the Datepicker
  input.addEventListener('focus', event => {
    datepicker.removeAttribute('hidden')
    input.dataset.state = 'focus'
  })

  // Hides the Datepicker
  document.addEventListener('click', event => {
    if (event.target.closest('.datepicker')) return
    if (event.target.closest('input') === input) return
    datepicker.setAttribute('hidden', true)
    delete input.dataset.state
  })

  // Tabs to Datepicker
  input.addEventListener('keydown', event => {
    const { key } = event
    if (key !== 'Tab') return
    if (event.shiftKey) return
    event.preventDefault()
    const focusablesInDatepicker = datepicker.querySelectorAll('button')
    const firstFocusableElement = focusablesInDatepicker[0]
    firstFocusableElement.focus()
  })

  // Tabbing out of Datepicker
  datepicker.addEventListener('keydown', event => {
    const { key } = event

    if (key === 'Tab' && event.target.matches('.datepicker__date')) {
      event.preventDefault()
      const focusableElements = getFocusableElements()
      const index = focusableElements.findIndex(element => element === input)
      event.preventDefault()
      focusableElements[index + 1].focus()

      datepicker.setAttribute('hidden', true)
      delete input.dataset.state
    }
  })

  // Arrow keyboard shortcuts
  datepicker.addEventListener('keydown', event => {
    const { key } = event
    if (
      key !== 'ArrowUp' &&
      key !== 'ArrowDown' &&
      key !== 'ArrowLeft' &&
      key !== 'ArrowRight'
    ) return
    event.preventDefault()

    const selectedDate = dategrid.querySelector('.is-selected')
    const dates = [...dategrid.children]

    if (!selectedDate && !document.activeElement.matches('.datepicker__date')) {
      return dates[0].focus()
    }

    const index = document.activeElement.matches('.datepicker__date')
      ? dates.findIndex(d => d === document.activeElement)
      : dates.findIndex(d => d === selectedDate)

    const previousMonthButton = datepicker.querySelector('.datepicker__previous')
    const nextMonthButton = datepicker.querySelector('.datepicker__next')
    const daysInMonth = dates.length

    // Previous day
    if (index === 0 && key === 'ArrowLeft') {
      previousMonthButton.click()
      const dates = [...datepicker.querySelectorAll('.datepicker__date')]
      dates[dates.length - 1].focus()
      return
    }
    if (key === 'ArrowLeft') return dates[index - 1].focus()

    // Next day
    if (index === dates.length - 1 && key === 'ArrowRight') {
      nextMonthButton.click()
      const dates = [...datepicker.querySelectorAll('.datepicker__date')]
      dates[0].focus()
      return
    }
    if (key === 'ArrowRight') return dates[index + 1].focus()

    // Previous Week
    if (key === 'ArrowUp' && index < 7) {
      previousMonthButton.click()
      const dates = [...datepicker.querySelectorAll('.datepicker__date')]
      const date = dates[dates.length - (7 - index)]
      date.focus()
      return
    }
    if (key === 'ArrowUp') return dates[index - 7].focus()

    // Next Week
    if (key === 'ArrowDown' && index + 7 > dates.length) {
      nextMonthButton.click()
      const dates = [...datepicker.querySelectorAll('.datepicker__date')]
      dates[index + 7 - daysInMonth].focus()
      return
    }
    if (key === 'ArrowDown') return dates[index + 7].focus()
  })

  return datepicker
}

// ========================
// Execution
// ========================
document.body.appendChild(createDatepicker(input, date))
