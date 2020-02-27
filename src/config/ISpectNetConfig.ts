/**
 * This interface defines the format of the project's configuration file
 */
export interface ISpectNetConfig {
  /**
   * The ZX Spectrum model to use
   */
  model: string;

  /**
   * The edition of the model to use
   */
  edition: string;
  
  /**
   * The defualt tape file
   */
  defaultTape?: string;

  /**
   * Enables or disables fast load
   */
  fastLoad?: boolean;
  
  /**
   * Keyboard mappings
   */
  keymappings?: { [key: string] : string | string[] };

  /**
   * Name of the annotation file
   */
  annotationFile?: string;

  /**
   * Signs that ROM annotations should be put into the RAM annotation file
   */
  hoistRomAnnotations?: boolean;
}