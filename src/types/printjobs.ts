export interface ServerPrintjobsState {
  printjobs: ServerPrintjobsStatePrintjob[]
  currentPrintjob: ServerPrintjobsStatePrintjob | null
  status: 'idle' | 'maintenance'
  job_totals: {
    total_jobs: number
    total_time: number
    total_print_time: number
    total_filament_used: number
    longest_job: number
    longest_print: number
  }

}

export interface ServerPrintjobsStatePrintjob {
  id: string
  name: string
  description: string
  creation_time: number
  start_time: number
  end_time: number
  print_duration: number
  filename: string
  metadata: any
  status: string
  priority: 'NORMAL' | 'HIGH' | 'LOW' | 'DELAY'
  delay_time: number
  exists: boolean
  total_duration: number
  filament_used: number,
  priorityIcon?: string,
  priorityColor?: string
  priorityNumber?: number
}

export interface allPrintStatusEntry {
  name: string;
  value: number;
  showInTable: boolean;
  itemStyle: any;
}
