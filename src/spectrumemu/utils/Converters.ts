/**
 * Converts the input value to a 4-digit hexadecimal string
 * @param value Value to convert
 */
export function intToX4(value: number): string {
  const hnum = value.toString(16).toUpperCase();
  if (hnum.length >= 4) {
      return hnum;
  }
  return "0000".substring(0, 4-hnum.length) + hnum;
}

/**
* Converts the input value to a 2-digit hexadecimal string
* @param value Value to convert
*/
export function intToX2(value: number): string {
  const hnum = value.toString(16).toUpperCase();
  if (hnum.length >= 2) {
      return hnum;
  }
  return "0" + hnum;
}