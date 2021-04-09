/* globals zlFetch */
// ========================
// Variables
// ========================
const typeahead = document.querySelector('.typeahead')
const input = typeahead.querySelector('input')
let userEnteredValue

// ========================
// Functions
// ========================
const boldSearchTerms = (string, searchTerms) => {
  const length = searchTerms.length
  const toBold = string.substring(0, length)
  const restOfString = string.substring(length)
  return `<strong>${toBold}</strong>${restOfString}`
}

const considerPrediction = (prediction, event) => {
  if (!prediction) return
  event.preventDefault()
  prediction.classList.add('is-highlighted')
  input.value = prediction.querySelector('span').textContent
}

const initTypeahead = (typeahead, countries) => {
  const ul = typeahead.querySelector('ul')

  // Shows predictions
  input.addEventListener('input', event => {
    const input = event.target
    const inputValue = input.value.trim().toLowerCase()

    // Hides list if user typed nothing
    // (or empties input field)
    if (!inputValue) return ul.setAttribute('hidden', true)

    // Finds a list of matched countries
    const matches = countries.filter(country => {
      const name = country.name.toLowerCase()
      return name.startsWith(inputValue)
    })

    // Creates the innerHTML
    const listItems = matches.map(country => {
      return `<li>
        <img src="${country.flag}" alt="${country.name}'s flag" />
        <span>${boldSearchTerms(country.name, inputValue)}</span>
      </li>`
    })
      .join('')

    // Shows list
    ul.innerHTML = listItems
    ul.removeAttribute('hidden')
  })

  // Lets users select a prediction
  ul.addEventListener('click', event => {
    const prediction = event.target.closest('li')
    if (!prediction) return

    const span = prediction.querySelector('span')
    const countryName = span.textContent
    input.value = countryName
    ul.setAttribute('hidden', true)
  })

  document.addEventListener('click', event => {
    if (!event.target.closest('.typeahead')) {
      ul.setAttribute('hidden', true)
    }
  })

  input.addEventListener('keydown', event => {
    const { key } = event
    if (key !== 'ArrowUp' && key !== 'ArrowDown') return

    const predictions = [...ul.children]
    if (predictions.length === 0) return

    const firstPrediction = predictions[0]
    const lastPrediction = predictions[predictions.length - 1]

    const currentPrediction = ul.querySelector('.is-highlighted')


    if (!currentPrediction) {

      userEnteredValue = input.value.trim()
      if (key === 'ArrowUp') {
        considerPrediction(lastPrediction, event)
      }
      if (key === 'ArrowDown') {
        considerPrediction(firstPrediction, event)
      }
    }

    if (currentPrediction) {
      currentPrediction.classList.remove('is-highlighted')

      if (key === 'ArrowDown') {
        const nextPrediction = currentPrediction.nextElementSibling
        considerPrediction(nextPrediction, event)
      }

      if (key === 'ArrowUp') {
        const previousPrediction = currentPrediction.previousElementSibling
        considerPrediction(firstPrediction, event)

      }

      if (currentPrediction === firstPrediction && key === 'ArrowUp') {
        input.value = userEnteredValue
      }

      if (currentPrediction === lastPrediction && key === 'ArrowDown') {
        input.value = userEnteredValue
      }
    }
  })
}

// ========================
// Execution
// ========================
zlFetch('https://restcountries.eu/rest/v2/all?fields=name;flag')
  .then(response => initTypeahead(typeahead, response.body))
  .catch(error => console.log(error))
