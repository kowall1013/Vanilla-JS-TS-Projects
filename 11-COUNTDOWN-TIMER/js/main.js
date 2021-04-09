const toMilliseconds = units => {
  const seconds = 1000
  const minutes = seconds * 60
  const hours = minutes * 60
  const days = hours * 24

  if (units === 'seconds') return seconds
  if (units === 'minutes') return minutes
  if (units === 'hours') return hours
  if (units === 'days') return days
}

const getCountdown = (endDate, startDate) => {
  const difference = endDate - startDate

  const days = Math.floor(difference / toMilliseconds('days'))
  const hours = Math.floor(difference % toMilliseconds('days') / toMilliseconds('hours'))
  const minutes = Math.floor(difference % toMilliseconds('hours') / toMilliseconds('minutes'))
  const seconds = Math.floor(difference % toMilliseconds('minutes') / toMilliseconds('seconds'))

  return {
    days,
    hours,
    minutes,
    seconds
  }
}

const now = new Date()
const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)

const setCountdownTarget = date => {
  const target = document.querySelector('.countdown__target')
  target.textContent = `Time to
  ${nextMonth.toLocaleString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })}
`

  target.dataset.datetime = date.toLocaleString('en-GB', { year: 'numeric' }) +
    '-' + date.toLocaleString('en-GB', { month: '2-digit' }) +
    '-' + date.toLocaleString('en-GB', { day: '2-digit' })
}

const updateBoxes = endDate => {
  const now = new Date()
  const values = getCountdown(endDate, now)
  const boxes = [...document.querySelectorAll('.timer__box')]

  boxes.forEach(box => {
    const unit = box.dataset.unit
    const value = values[unit]
    box.firstElementChild.textContent = value
  })
}

const getMonthDiff = (endDate, startDate) => {
  const yearDiff = endDate.getFullYear() - startDate.getFullYear()
  let monthDiff = endDate.getMonth() + yearDiff * 12 - startDate.getMonth()

  const d = new Date(endDate)
  d.setMonth(endDate.getMonth() - monthDiff)
  if (d < startDate) monthDiff = monthDiff - 1

  return monthDiff
}

const date1 = new Date(2019, 1, 5)
const date2 = new Date(2019, 0, 3)

const diffrence = date1 - date2
const monthDiff = getMonthDiff(date1, date2)
const remainingDiff = diffrence - monthDiff * 31 * toMilliseconds('days')
const days = Math.floor(remainingDiff / toMilliseconds('days'))
console.log(days);




setCountdownTarget(nextMonth)
updateBoxes(nextMonth)
setInterval(updateBoxes, 1000, nextMonth)














