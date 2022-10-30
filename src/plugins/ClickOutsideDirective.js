const ClickOutsideDirective = {
  mounted (el, binding) {
    el.__ClickOutsideDirectiveHandler__ = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value()
      }
    }
    document.body.addEventListener('click', el.__ClickOutsideDirectiveHandler__)
  },
  unmounted (el) {
    document.body.removeEventListener('click', el.__ClickOutsideDirectiveHandler__)
  }
}
export default (app) => {
  app.directive('click-outside', ClickOutsideDirective)
}
