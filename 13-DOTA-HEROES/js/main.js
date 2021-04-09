//VARIABLES

const dotaApi = 'https://api.opendota.com/api'
const heroesList = document.querySelector('.heroes-list')
const filterDiv = document.querySelector('.filters')

//FUNCTIONS

/**
 * Create li element of the hero and append him to the DOM
 * @param {Object} hero
 */
const addHeroToDom = hero => {
  const { name, image } = hero
  const li = document.createElement('li')
  li.classList.add('hero')
  li.innerHTML = `
          <a href="#">
            <span class="hero__name">${name}</span>
            <img src="${image}" alt="${name}">
          </a>
        `
  heroesList.appendChild(li)
}

/**
 *  Filter heroes by categories
 * @param {Array} heroes
 * @returns {Array} of the filtered heros
 */
const filterHeroesByCategories = heroes => {
  const selectedAttackTypes = [...document.querySelectorAll('#attack-type input:checked')]
    .map(checkbox => checkbox.id)

  const selectedPrimaryAtributes = [...document.querySelectorAll('#primary-attribute input:checked')]
    .map(checkbox => checkbox.id)

  const selectedRoles = [...document.querySelectorAll('#role input:checked')]
    .map(checkbox => checkbox.id)

  return heroes
    .filter(hero => {
      if (selectedAttackTypes.length === 0) return true
      const attackType = hero.attackType
      return selectedAttackTypes.includes(attackType)
    })
    .filter(hero => {
      if (selectedPrimaryAtributes.length === 0) return true
      const selectedAttribute = hero.primaryAttribute
      return selectedPrimaryAtributes.includes(selectedAttribute)
    })
    .filter(hero => {
      if (selectedRoles.length === 0) return true
      const heroRoles = hero.roles

      return selectedRoles.some(role => {
        return heroRoles.includes(role)
      })
    })

}

zlFetch(`${dotaApi}/constants/heroes`)
  .then(response => {
    const heroes = Object.values(response.body).map(hero => {
      return {
        name: hero.localized_name,
        attackType: hero.attack_type.toLowerCase(),
        primaryAttribute: hero.primary_attr,
        roles: hero.roles.map(role => role.toLowerCase()),
        image: `https://api.opendota.com${hero.img}`,
      }
    })
    heroes.forEach(addHeroToDom)

    filterDiv.addEventListener('change', event => {

      const filterd = filterHeroesByCategories(heroes)

      heroesList.innerHTML = ''
      filterd.forEach(addHeroToDom)
    })
  })
  .catch(error => console.log(error))