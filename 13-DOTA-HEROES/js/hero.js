//VARIABLES
const dotaApi = 'https://api.opendota.com/api'
const heroName = 'axe'
const heroNameEl = document.querySelector('[data-hero-name]')
const heroImageEl = document.querySelector('[data-hero-image]')
const heroDescEl = document.querySelector('[data-hero-description]')
const heroAbilitiesEl = document.querySelector('[data-hero-abilities]')

//FUNCTIONS

zlFetch(`${dotaApi}/constants/heroes`)
  .then(response => {
    const heroes = Object.values(response.body).map(hero => {
      return {
        name: hero.localized_name,
        npcHeroName: hero.name.replace('npc_dota_hero_', ''),
        attackType: hero.attack_type.toLowerCase(),
        primaryAttribute: hero.primary_attr,
        roles: hero.roles.map(role => role.toLowerCase()),
        image: `https://api.opendota.com${hero.img}`
      }
    })
    const hero = heroes.find(h => h.npcHeroName === heroName)

    heroNameEl.textContent = hero.name
    heroImageEl.src = `${hero.image}`



  })
  .catch(console.log)

zlFetch(`${dotaApi}/constants/hero_lore`)
  .then(response => {
    const heroLore = response.body[heroName]
    heroDescEl.textContent = heroLore
  })


Promise.all([
  zlFetch(`${dotaApi}/constants/abilities`),
  zlFetch(`${dotaApi}/constants/hero_abilities`)
])
  .then(responses => {
    const allAbilities = responses[0].body
    const heroesAbilities = responses[1].body

    const heroAbilities = heroesAbilities[`npc_dota_hero_${heroName}`]
      .abilities
      .filter(ability => ability !== 'generic_hidden')
      .map(ability => allAbilities[ability])
      .map(ability => {
        return {
          name: ability.dname,
          description: ability.desc,
          image: `https://api.opendota.com${ability.img}`
        }
      })
      .map(ability => {
        return `
              <li class="ability">
                <p class="ability__title">${ability.name}</p>
                <img class="ability__img" src="${ability.image}" alt="${ability.name}">
                <p class="desc">${ability.description}</p>
              </li>
           `
      })
      .join(' ')

    heroAbilitiesEl.innerHTML = heroAbilities
    heroAbilitiesEl.closest('section').removeAttribute('hidden')

  })


