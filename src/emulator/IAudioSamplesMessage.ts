/**
 * This message is sent from the backend to the UI when
 * audio samples available
 */
export interface IAudioSamplesMessage {
  samples:  number[];
}
