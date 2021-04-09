//VARIABLES
const places = {
  artScienceMuseum: '6 Bayfront Ave, Singapore 018974',
  gardensByTheBay: '18 Marina Gardens Dr, Singapore 018953',
  littleIndia: 'Little India, Singapore',
  sentosa: 'Sentosa, Singapore',
  singaporeZoo: '80 Mandai Lake Rd, Singapore 729826'
}

//FUNCTIONS

const fetchGoogleMapsApi = () => {
  const apiKey = 'AIzaSyAA3TJLp4Uyjn6WqbDmY1ldYNp3q80Ppt0'
  const script = document.createElement('script')
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMap`

  script.addEventListener('error', console.error)

  document.body.appendChild(script)
  document.body.removeChild(script)
}

const getDirections = request => {
  const directionsService = new google.maps.DirectionsService()
  return new Promise((resolve, reject) => {
    directionsService.route(request, result => {
      if (result.status === 'OK') return resolve(result)
      return reject(result)
    })
  })
}

/**
 * Returns array od HTML Elements
 * @returns {Array}
 */
const getSearchBoxes = _ => {
  return [...document.querySelectorAll('.search-box')]
}

const getSearchBoxValue = searchBox => {
  return searchBox.querySelector('input').value.trim()
}



fetchGoogleMapsApi()


function initGoogleMap() {
  const mapDiv = document.querySelector('#map')
  const searchPanel = document.querySelector('.search-panel')
  const searchBoxes = getSearchBoxes()
  const addSearchboxButton = searchPanel.querySelector('[data-js="add-searchbox"]')

  // Creating the Google Map
  const map = new google.maps.Map(mapDiv, {
    center: { lat: 49.848390, lng: 19.258830 },
    zoom: 13
  })

  /**
   *Initialize Google Autocomplete
   * @param {HTMLElement} searchBox
   */
  const initGoogleAutocomplete = searchBox => {
    const input = searchBox.querySelector('input')
    const autocomplete = new google.maps.places.Autocomplete(input)
    autocomplete.bindTo('bounds', map)
  }

  //Add new searchBoxes
  addSearchboxButton.addEventListener('click', event => {
    let searchBoxes = getSearchBoxes()
    if (searchBoxes.length >= 10) return
    const lastSearchBox = searchBoxes[searchBoxes.length - 1]

    const clone = lastSearchBox.cloneNode(true)

    const input = clone.querySelector('input')
    initGoogleAutocomplete(clone)

    lastSearchBox.insertAdjacentElement('afterend', clone)
    input.value = ''

    //Lets user delete search box
    searchBoxes = getSearchBoxes()
    searchBoxes.forEach(searchBox => {
      const deleteButton = searchBox.querySelector('button')
      deleteButton.removeAttribute('hidden')
    })
  })

  //Deleting a search box
  searchPanel.addEventListener('click', event => {
    const deleteButton = event.target.closest('.search-box__delete-icon')
    if (!deleteButton) return

    const searchBox = deleteButton.parentElement
    const searchBoxParent = searchBox.parentElement
    let searchBoxes = [...searchPanel.querySelectorAll('.search-box')]

    if (searchBoxes.length <= 3) {
      searchBoxes.forEach(searchBox => {
        const deleteButton = searchBox.querySelector('button')
        deleteButton.setAttribute('hidden', true)
      })
    }

    const index = searchBoxes.findIndex(sb => sb === searchBox)
    const googleAutocomplete = document.querySelectorAll('.pac-container')[index]

    searchBoxParent.removeChild(searchBox)
    document.body.removeChild(googleAutocomplete)

    searchBoxes = [...searchPanel.querySelectorAll('.search-box')]
    searchBoxes[0].querySelector('input').placeholder = "Starting point"

  })

  searchBoxes.forEach(initGoogleAutocomplete)

  searchPanel.addEventListener('submit', event => {
    event.preventDefault()
    const searchBoxes = getSearchBoxes()
    const originInput = searchBoxes[0].querySelector('input')
    const destinationInput = searchBoxes[1].querySelector('input')

    const origin = originInput.value.trim()
    const destination = destinationInput.value.trim()

    const request = {
      origin: getSearchBoxValue(searchBoxes[0]),
      destination: getSearchBoxValue(searchBoxes[searchBoxes.length - 1]),
      travelMode: 'DRIVING'
    }

    if (searchBoxes.length > 2) {
      const waypoints = searchBoxes.slice(1, searchBoxes.length - 1)
        .map(waypoint => {
          return {
            location: getSearchBoxValue(waypoint),
            stopover: true
          }
        })
      request.waypoints = waypoints
    }

    getDirections(request)
      .then(result => {
        directionsRenderer.setDirections(result)
      })
      .catch(result => {
        const errors = {
          INVALID_REQUEST: 'Invalid request',
          MAX_WAYPOINTS_EXCEEDED: 'Maximum of 8 waypoints allowed',
          NOT_FOUND: 'At least one location cannot be geocoded',
          OVER_QUERY_LIMIT: 'You sent too many requests in a short time. Slow down!',
          UNKNOWN_ERROR: 'An error happened on the server. Please try again later',
          ZERO_RESULTS: 'Cannot find route between origin and destination'
        }
        const message = errors[result.status]
        const errorDiv = searchPanel.querySelector('.search-panel__error')
        errorDiv.textContent = message
      })

    //Clear error when user typing another route
    const errorDiv = searchPanel.querySelector('.search-panel__error')
    errorDiv.textContent = ''

    const directionsRenderer = new google.maps.DirectionsRenderer({
      map,
      panel: document.querySelector('.directions-panel')
    })


  })

}

