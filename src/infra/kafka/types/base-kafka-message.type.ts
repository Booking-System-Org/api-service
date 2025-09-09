export interface KafkaMessage {
  key?: string;
  value: string;
  headers: Record<string, string>;
}
