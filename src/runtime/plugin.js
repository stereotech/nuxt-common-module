
import Vue from 'vue'
import FileManager from '~common/components/FileManager.vue'
import CardTitle from '~common/components/CardTitle.vue'
// import PrintQueue from '~common/components/dashboard/PrintQueue'
// import CreatePrintjobDialog from '~common/components/dashboard/CreatePrintjobDialog'
import WebcamCard from '~common/components/webcam/WebcamCard'
// import StatsAllPrintStatus from '~common/components/stats/AllPrintStatus'
// import StatsAllPrintStatusTime from '~common/components/stats/AllPrintStatusTime'
// import StatsAllPrintStatusMaterial from '~common/components/stats/AllPrintStatusMaterial'
// import StatsFilter from "~common/components/stats/StatsFilter"
// import StatsDisplayPeriod from "~common/components/stats/StatsDisplayPeriod"
// import StatsFilamentUsage from "~common/components/stats/FilamentUsage"
// import StatsPrintTimeAvg from '~common/components/stats/PrintTimeAvg'
// import StatsMain from '~common/components/stats/StatsMain'
// import StatsListPanel from '~common/components/stats/StatsListPanel'
// import DashboardPrinter from '~common/components/dashboard/DashboardPrinter'
// import DashboardPrinterAvatar from '~common/components/dashboard/DashboardPrinterAvatar'
// import DashboardPrinterActions from '~common/components/dashboard/DashboardPrinterActions'
// import DashboardPrinterHeaters from '~common/components/dashboard/DashboardPrinterHeaters'
// import { Helpers } from '~common/plugins/helpers'
// import { Notification } from '~common/plugins/notifications'

Vue.component(FileManager.name, FileManager)
Vue.component(CardTitle.name, CardTitle)
// Vue.component(PrintQueue.name, PrintQueue)
// Vue.component(CreatePrintjobDialog.name, CreatePrintjobDialog)
Vue.component(WebcamCard.name, WebcamCard)
// Vue.component(StatsAllPrintStatus.name, StatsAllPrintStatus)
// Vue.component(StatsAllPrintStatusTime.name, StatsAllPrintStatusTime)
// Vue.component(StatsAllPrintStatusMaterial.name, StatsAllPrintStatusMaterial)
// Vue.component(StatsFilter.name, StatsFilter)
// Vue.component(StatsDisplayPeriod.name, StatsDisplayPeriod)
// Vue.component(StatsFilamentUsage.name, StatsFilamentUsage)
// Vue.component(StatsPrintTimeAvg.name, StatsPrintTimeAvg)
// Vue.component(StatsMain.name, StatsMain)
// Vue.component(StatsListPanel.name, StatsListPanel)
// Vue.component(DashboardPrinter.name, DashboardPrinter)
// Vue.component(DashboardPrinterAvatar.name, DashboardPrinterAvatar)
// Vue.component(DashboardPrinterActions.name, DashboardPrinterActions)
// Vue.component(DashboardPrinterHeaters.name, DashboardPrinterHeaters)

export default function (nuxtContext, inject) {
  const $common = {}
  inject('common', $common)

  // const helpers = new Helpers()
  // inject('helpers', helpers)

  // const notify = new Notification(nuxtContext)
  // inject('notify', notify)
}