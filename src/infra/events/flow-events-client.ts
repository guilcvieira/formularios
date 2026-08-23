interface EventPayload {
  event: string
  source: string
  data: Record<string, unknown>
}

/**
 * Dispatches an event to the flow-builder Events API.
 * Fire-and-forget: failures are logged but don't block the caller.
 */
export async function dispatchFlowEvent(event: string, data: Record<string, unknown>): Promise<void> {
  const url = process.env.FLOW_EVENTS_API_URL
  const token = process.env.FLOW_API_TOKEN

  console.log(`[flow-events] Attempting dispatch: event=${event}, url=${url ? 'set' : 'MISSING'}, token=${token ? 'set' : 'MISSING'}`)

  if (!url || !token) {
    console.warn(`[flow-events] Skipping dispatch: FLOW_EVENTS_API_URL=${url ? 'set' : 'undefined'}, FLOW_API_TOKEN=${token ? 'set' : 'undefined'}`)
    return
  }

  const payload: EventPayload = {
    event,
    source: 'formularios',
    data,
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(5000),
    })
    console.log(`[flow-events] Dispatched ${event}: status=${response.status}`)
  } catch (error) {
    console.error(`[flow-events] Failed to dispatch event: ${event}`, error)
  }
}
