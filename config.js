export const dollarString = (value, currency = "EUR") => {
  switch (currency) {
    case "EUR":
      return `${value}€`
    case "PLN":
      return `${value}zł`
    default:
      return `$${value}`
  }
  return
}

export const colors = {
  primary: '#a16547',
  accent: '#ddb465',
  surface: '#1d1d22',
  text: 'white',
  background: '#333240',
  disabled: 'white',
  placeholder: '#F7F8F6'
}

export const icons = {
  transfer: 'refresh',
  cancel: 'cancel',
  remove: 'cancel',
  add: 'add'
}
