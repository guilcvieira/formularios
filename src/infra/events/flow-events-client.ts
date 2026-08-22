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

  if (!url || !token) return // Not configured, skip silently

  const payload: EventPayload = {
    event,
    source: 'formularios',
    data,
  }

  try {
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(5000),
    })
  } catch {
    console.error(`[flow-events] Failed to dispatch event: ${event}`)
  }
}
