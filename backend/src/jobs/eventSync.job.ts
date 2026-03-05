import cron from "node-cron"
import { syncExternalEvents } from "../services/eventAggregator"

export const startEventSyncJob = () => {

  cron.schedule("0 */6 * * *", async () => {

    console.log("Syncing external events...")

    await syncExternalEvents()

  })

}