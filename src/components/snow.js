const addSnow = {
  init() {
    const {el} = this
    const snowBtn = document.getElementById('snow-button')
    let isSnowing = false
    snowBtn.addEventListener('click', () => {
      if (isSnowing) {
        el.setAttribute('scale', '0 0 0')
      } else {
        el.setAttribute('scale', '1 1 1')
      }
      isSnowing = !isSnowing
    })
  },

}
export {addSnow}