interface WebhookPayload {
  event: string
  timestamp: string
  source: string
  data: Record<string, unknown>
}

export async function dispatchWebhook(event: string, data: Record<string, unknown>): Promise<void> {
  const url = process.env.FLOW_WEBHOOK_URL
  const secret = process.env.FLOW_WEBHOOK_SECRET

  if (!url || !secret) return // Webhook not configured, skip silently

  const payload: WebhookPayload = {
    event,
    timestamp: new Date().toISOString(),
    source: 'formularios',
    data,
  }

  try {
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Secret': secret,
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(5000),
    })
  } catch {
    // Fire-and-forget: don't block on webhook failures
    console.error(`[webhook] Failed to dispatch ${event}`)
  }
}
