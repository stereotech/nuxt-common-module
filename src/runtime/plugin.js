
import Vue from 'vue'
import FileManager from '~common/components/FileManager.vue'
import CardTitle from '~common/components/CardTitle.vue'
import PrintQueue from '~common/components/dashboard/PrintQueue'
import CreatePrintjobDialog from '~common/components/dashboard/CreatePrintjobDialog'
import WebcamCard from '~common/components/webcam/WebcamCard'
//Stats
import StatsFilter from "~common/components/stats/StatsFilter"
import BarChart from "~common/components/stats/BarChart"
import GaugeChart from "~common/components/stats/GaugeChart"
import PieChart from "~common/components/stats/PieChart"
import StatsListPanel from '~common/components/stats/StatsListPanel'
import StatsTotalTable from '~common/components/stats/StatsTotalTable'
//Dashboard
import DashboardPrinterAction from '~common/components/dashboard/DashboardPrinterAction'
import DashboardPrinterAvatar from '~common/components/dashboard/DashboardPrinterAvatar'
import ToolbarPrinterControls from '~common/components/dashboard/ToolbarPrinterControls'
import DashboardPrinterHeaters from '~common/components/dashboard/DashboardPrinterHeaters'
import LastJobStatus from '~common/components/dashboard/LastJobStatus'
import DashboardPrinterActionTitle from '~common/components/dashboard/DashboardPrinterActionTitle'
//Plugins
import { Helpers } from '~common/plugins/helpers'
import { Notification } from '~common/plugins/notifications'

Vue.component(FileManager.name, FileManager)
Vue.component(CardTitle.name, CardTitle)
Vue.component(PrintQueue.name, PrintQueue)
Vue.component(CreatePrintjobDialog.name, CreatePrintjobDialog)
Vue.component(WebcamCard.name, WebcamCard)
//Stats
Vue.component(StatsFilter.name, StatsFilter)
Vue.component(BarChart.name, BarChart)
Vue.component(GaugeChart.name, GaugeChart)
Vue.component(PieChart.name, PieChart)
Vue.component(StatsListPanel.name, StatsListPanel)
Vue.component(StatsTotalTable.name, StatsTotalTable)
//Dashboard
Vue.component(DashboardPrinterAction.name, DashboardPrinterAction)
Vue.component(DashboardPrinterAvatar.name, DashboardPrinterAvatar)
Vue.component(DashboardPrinterActionTitle.name, DashboardPrinterActionTitle)
Vue.component(DashboardPrinterHeaters.name, DashboardPrinterHeaters)
Vue.component(ToolbarPrinterControls.name, ToolbarPrinterControls)
Vue.component(LastJobStatus.name, LastJobStatus)



export default function (nuxtContext, inject) {
  // const $common = {}
  // inject('common', $common)

  const helpers = new Helpers()
  inject('helpers', helpers)

  const notify = new Notification(nuxtContext)
  inject('notify', notify)
}
