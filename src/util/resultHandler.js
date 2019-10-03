import { Notify } from 'quasar'

class ResultHandler {
  constructor (message, stack) {
    Notify.setDefaults({
      position: 'top-right',
      textColor: 'vdark',
      timeout: 60000,
      color: 'vgreen',
      icon: 'fas fa-check-circle',
      multiLine: true,
      html: true,
      actions: [
        { label: 'Got it', color: 'vdark', handler: () => { /* console.log('wooow') */ } }
      ]
    })
    const details = JSON.stringify(stack, null, 2)
    return { message, details }
  }
}

export const userResult = (message, stack) => {
  if (!process.env.PROD) return devResult(message, stack)
  const result = new ResultHandler(message, stack)
  Notify.create({ message: result.message })
}

export const devResult = (message, stack) => {
  if (process.env.PROD) return
  const result = new ResultHandler(message, stack)
  Notify.create({ message: result.message })
  // Notify.create({ message: result.message + '<p>' + result.details + '</p>' })
}