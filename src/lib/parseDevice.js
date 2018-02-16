export default {
  icon (device) {
    if (device.type === 'BROWSER') return 'tab'
    else if (device.type === 'DESKTOP') return 'flash_on'
    else if (device.type === 'MOBILE') return 'phone_android'
    else if (device.type === 'WINDOWS') return 'fa-windows'
    else if (device.type === 'MAC') return 'fa-apple'
    else return 'add'
  },
  color (device) {
    if (device.status === 'OFFLINE') return 'grey'
    else if (device.status === 'ONLINE') return 'blue'
    else if (device.status === 'ACTIVE') return 'green'
  }
}
