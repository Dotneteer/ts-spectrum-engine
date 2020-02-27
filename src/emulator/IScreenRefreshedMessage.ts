/**
 * This message is sent from the backend to the UI when
 * a new screen frame is available
 */
export interface IScreenRefreshedMessage {
  frame: number;
  screenData: Uint8Array;
  ts: number; 
}
