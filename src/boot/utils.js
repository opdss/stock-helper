// import something here
import * as service from 'src/libraries/service'
import * as utils from 'src/libraries/utils'
import _ from 'lodash'

// "async" is optional;
// more info on params: https://quasar.dev/quasar-cli/cli-documentation/boot-files#Anatomy-of-a-boot-file
export default async ( { app, router, Vue } ) => {
  Vue.prototype.$service = service
  Vue.prototype.$utils = utils
  Vue.prototype.$_ = _
}
