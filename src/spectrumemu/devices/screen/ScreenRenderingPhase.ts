/**
 * This enumeration defines the particular phases of ULA rendering
 */
export enum ScreenRenderingPhase {
    /**
     * The ULA does not do any rendering
     */
    None = 0,

    /**
     * The ULA sets the border color to display the current pixel.
     */
    Border,

    /**
     * The ULA sets the border color to display the current pixel. It
     * prepares to display the fist pixel in the row with prefetching the
     * corresponding byte from the display memory.
     */
    BorderFetchPixel,

    /**
     * The ULA sets the border color to display the current pixel. It has
     * already fetched the 8 pixel bits to display. It carries on
     * preparing to display the fist pixel in the row with prefetching the
     * corresponding attribute byte from the display memory.
     */
    BorderFetchPixelAttr,

    /**
     * The ULA displays the next two pixels of Byte1 sequentially during a
     * single Z80 clock cycle.
     */
    DisplayB1,

    /**
     * The ULA displays the next two pixels of Byte2 sequentially during a
     * single Z80 clock cycle.
     */
    DisplayB2,

    /**
     * The ULA displays the next two pixels of Byte1 sequentially during a
     * single Z80 clock cycle. It prepares to display the pixels of the next
     * byte in the row with prefetching the corresponding byte from the
     * display memory.
     */
    DisplayB1FetchB2,

    /**
     * The ULA displays the next two pixels of Byte1 sequentially during a
     * single Z80 clock cycle. It prepares to display the pixels of the next
     * byte in the row with prefetching the corresponding attribute from the
     * display memory.
     */
    DisplayB1FetchA2,

    /**
     * The ULA displays the next two pixels of Byte2 sequentially during a
     * single Z80 clock cycle. It prepares to display the pixels of the next
     * byte in the row with prefetching the corresponding byte from the
     * display memory.
     */
    DisplayB2FetchB1,

    /**
     * The ULA displays the next two pixels of Byte2 sequentially during a
     * single Z80 clock cycle. It prepares to display the pixels of the next
     * byte in the row with prefetching the corresponding attribute from the
     * display memory.
     */
    DisplayB2FetchA1
}