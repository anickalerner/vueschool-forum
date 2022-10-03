import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faPencil } from '@fortawesome/free-solid-svg-icons'

library.add(faPencil)

export default (app) => {
  app.component('fa-icon', FontAwesomeIcon)
}
