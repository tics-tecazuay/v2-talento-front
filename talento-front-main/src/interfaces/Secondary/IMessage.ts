export interface IMessage {
    severity: 'success' | 'info' | 'warn' | 'error',
    summary?: string,
    detail: string,
    life?: number
}
