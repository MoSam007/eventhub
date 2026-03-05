import { Request, Response } from "express"
import { syncExternalEvents } from "../services/eventAggregator"

export const triggerEventSync = async (req: Request, res: Response) => {

  const count = await syncExternalEvents()

  res.json({
    message: "Event sync complete",
    count
  })
}