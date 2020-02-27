/**
 * This enumeration represents the memory section types that can be used
 * when disassemblying a project.
 */
export enum MemorySectionType  {
  /**
   * Simply skip the section without any output code generation
   */
  Skip,

  /**
   * Create Z80 disassembly for the memory section
   */
  Disassemble,

  /**
   * Create a byte array for the memory section
   */
  ByteArray,

  /**
   * Create a word array for the memory section
   */
  WordArray,

  /**
   * Create an RST 28 bytecode memory section
   */
  Rst28Calculator
}