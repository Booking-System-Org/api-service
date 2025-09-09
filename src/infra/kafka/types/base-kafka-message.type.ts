export interface KafkaMessage {
  topic: string;
  key?: string;
  value: string;
  headers?: Record<string, string>;
}
