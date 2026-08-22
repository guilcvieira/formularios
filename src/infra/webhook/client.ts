// Webhook client for flow-runner integration
// This module will handle sending events to the flow-runner service
// when form submissions or other triggers occur.

export interface WebhookPayload {
  event: string
  formId: number
  data: Record<string, unknown>
  timestamp: string
}

export interface WebhookClient {
  send(payload: WebhookPayload): Promise<void>
}
