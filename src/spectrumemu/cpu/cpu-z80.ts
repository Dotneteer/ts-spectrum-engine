/**
 * Represents the state of the Z80 CPU
 */
export interface Z80CpuState {
  // --- Configuration
  readonly allowExtendedInstructionSet: boolean;

  // --- Registers
  readonly a: number;
  readonly f: number;
  readonly af: number;
  readonly b: number;
  readonly c: number;
  readonly bc: number;
  readonly d: number;
  readonly e: number;
  readonly de: number;
  readonly h: number;
  readonly l: number;
  readonly hl: number;
  readonly _af_: number;
  readonly _bc_: number;
  readonly _de_: number;
  readonly _hl_: number;
  readonly i: number;
  readonly r: number;
  readonly pc: number;
  readonly sp: number;
  readonly xh: number;
  readonly xl: number;
  readonly ix: number;
  readonly yh: number;
  readonly yl: number;
  readonly iy: number;
  readonly wzh: number;
  readonly wzl: number;
  readonly wz: number;

  // --- Flags
  readonly sFlag: boolean;
  readonly zFlag: boolean;
  readonly r5Flag: boolean;
  readonly hFlag: boolean;
  readonly r3Flag: boolean;
  readonly pvFlag: boolean;
  readonly nFlag: boolean;
  readonly cFlag: boolean;

  // --- Processing state
  readonly tacts: number;
  readonly signals: Z80CpuSignals;
  readonly useGateArrayContention: boolean;
  readonly iff1: boolean;
  readonly iff2: boolean;
  readonly interruptMode: number;
  readonly isInterruptBlocked: boolean;
  readonly isInOpExecution: boolean;
  readonly prefixMode: OpPrefixMode;
  readonly indexMode: OpIndexMode;
  readonly lastFethcedOpCode: number;
}

/**
 * Represents the state of the Z80 CPU
 */
export interface Z80CpuTestSupport {
  // --- Registers
  setA(value: number): void;
  setF(value: number): void;
  setAF(value: number): void;
  setB(value: number): void;
  setC(value: number): void;
  setBC(value: number): void;
  setD(value: number): void;
  setE(value: number): void;
  setDE(value: number): void;
  setH(value: number): void;
  setL(value: number): void;
  setHL(value: number): void;
  set_AF_(value: number): void;
  set_BC_(value: number): void;
  set_DE_(value: number): void;
  set_HL_(value: number): void;
  setI(value: number): void;
  setR(value: number): void;
  setPC(value: number): void;
  setSP(value: number): void;
  setXH(value: number): void;
  setXL(value: number): void;
  setIX(value: number): void;
  setYH(value: number): void;
  setYL(value: number): void;
  setIY(value: number): void;
  setWZ(value: number): void;
}

/**
 * Specifies the interface of the Z80 CPU Engine
 */
export interface Z80CpuEngineInterface {
  /**
   * Retrieves the current value of Z80 registers
   */
  getCpuState(): Z80CpuState;

  /**
   * Retrieves the object that provides test support
   */
  getTestSupport(): Z80CpuTestSupport;

  /**
   * Resets the Z80 CPU
   */
  reset(): void;

  /**
   * Executes a single CPU cycle
   */
  executeCpuCycle(): void;

  /**
   * Sets the CPU's reset signal
   */
  setResetSignal(): void;

  /**
   * Clears the CPU's reset signal
   */
  clearResetSignal(): void;

  /**
   * Adds contention delay
   * @param delay #of clock tacts to delay
   */
  contentionDelay(delay: number): void;
}

/**
 * Implements the Z80 CPU Engine
 * @param memory Interface that provides access to the memory
 * @param portInterface Interface that provides access to the I/O ports
 * @param extendedSet Indicates if extended (ZX Spectrum Next) operation are supported
 */
export function z80CpuEngine(
  memory: CpuMemoryInterface,
  portInterface: CpuIoPortInterface,
  extendedSet = false
): Z80CpuEngineInterface {
  // --- Configuration
  let allowExtendedInstructionSet = extendedSet;

  // --- Registers
  let a = 0xff;
  let f = 0xff;
  let af = 0xffff;
  let b = 0xff;
  let c = 0xff;
  let bc = 0xffff;
  let d = 0xff;
  let e = 0xff;
  let de = 0xffff;
  let h = 0xff;
  let l = 0xff;
  let hl = 0xffff;
  let _af_ = 0xffff;
  let _bc_ = 0xffff;
  let _de_ = 0xffff;
  let _hl_ = 0xffff;
  let i = 0xff;
  let r = 0xff;
  let pc = 0xffff;
  let sp = 0xffff;
  let xh = 0xff;
  let xl = 0xff;
  let ix = 0xffff;
  let yh = 0xff;
  let yl = 0xff;
  let iy = 0xffff;
  let wzh = 0xff;
  let wzl = 0xff;
  let wz = 0xffff;

  // --- Processing state
  let tacts = 0;
  let signals = Z80CpuSignals.None;
  let useGateArrayContention: boolean;
  let iff1 = false;
  let iff2 = false;
  let interruptMode = 0;
  let isInterruptBlocked = false;
  let isInOpExecution = false;
  let prefixMode = OpPrefixMode.None;
  let indexMode = OpIndexMode.None;
  let lastFethcedOpCode = 0x00;

  // ============================================================================
  // Standars Z80 operations

  /**
   * Defines the processing of standard instructions
   */
  const standardOperations: Z80Operation[] = [
    // 0x00: NOP
    () => {},

    // 0x01: LD BC,NNNN
    () => {
      // pc+1:3
      c = memory.read(pc);
      tacts += 3;

      // pc+2:3
      pc = (pc + 1) & 0xffff;
      b = memory.read(pc);
      pc = (pc + 1) & 0xffff;
      bc = (b << 8) | c;
      tacts += 3;
    },

    // 0x02: LD (BC),A
    () => {
      // pc:3
      memory.write(bc, a);
      wzh = a;
      wz = (wzh << 8) | wzl;
      tacts += 3;
    },

    // 0x03: INC BC
    () => {
      bc = (bc + 1) & 0xffff;
      b = bc >> 8;
      c = bc & 0xff;
      tacts += 2;
    },

    // 0x04: INC B
    () => {
      f = incOpFlags[b] | (f & FlagsSetMask.C);
      b = (b + 1) & 0xff;
      bc = (b << 8) | c;
    },

    // 0x05: DEC B
    () => {
      f = decOpFlags[b] | (f & FlagsSetMask.C);
      b = (b - 1) & 0xff;
      bc = (b << 8) | c;
    },

    // 0x06: LD B,N
    () => {
      b = memory.read(pc);
      pc = (pc + 1) & 0xffff;
      bc = (b << 8) | c;
      tacts += 3;
    },

    // 0x07: RLCA
    () => {
      let rlcaVal = a;
      rlcaVal <<= 1;
      let cf = ((rlcaVal & 0x100) !== 0 ? FlagsSetMask.C : 0) & 0xff;
      if (cf !== 0) {
        rlcaVal = rlcaVal | 0x01;
      }
      a = rlcaVal & 0xff;
      f = cf | (f & FlagsSetMask.SZPV);
      af = (a << 8) | f;
    },

    // 0x08: EX AF,AF'
    () => {
      const tmp = af;
      af = _af_;
      _af_ = tmp;
      a = af >> 8;
      f = af & 0xff;
    },

    // 0x09: ADD HL,BC
    () => {
      wz = (hl + 1) & 0xffff;
      hl = aluAddHL(hl, bc);
      h = hl >> 8;
      l = hl & 0xff;
      tacts += 7;
    },

    // 0x0a: LD A,(BC)
    () => {
      wz = (bc + 1) & 0xffff;
      a = memory.read(bc);
      tacts += 3;
      af = (a << 8) | f;
    },

    // 0x0b: dec bc
    () => {
      bc = (bc - 1) & 0xffff;
      tacts += 2;
      b = bc >> 8;
      c = bc & 0xff;
    },

    // 0x0c: INC C
    () => {
      f = incOpFlags[c] | (f & FlagsSetMask.C);
      c = (c + 1) & 0xff;
      bc = (b << 8) | c;
    },

    // 0x0d: ???
    () => {},

    // 0x0e: LD E,N
    () => {
      c = memory.read(pc);
      pc = (pc + 1) & 0xffff;
      tacts += 3;
      bc = (b << 8) | c;
    },

    // 0x0f: ???
    () => {},

    // 0x10: ???
    () => {},

    // 0x11: ???
    () => {},

    // 0x12: ???
    () => {},

    // 0x13: ???
    () => {},

    // 0x14: ???
    () => {},

    // 0x15: ???
    () => {},

    // 0x16: ???
    () => {},

    // 0x17: ???
    () => {},

    // 0x18: ???
    () => {},

    // 0x19: ???
    () => {},

    // 0x1a: ???
    () => {},

    // 0x1b: ???
    () => {},

    // 0x1c: ???
    () => {},

    // 0x1d: ???
    () => {},

    // 0x1e: ???
    () => {},

    // 0x1f: ???
    () => {},

    // 0x20: ???
    () => {},

    // 0x21: LD HL,NNNN
    () => {
      // pc+1:3
      l = memory.read(pc);
      tacts += 3;

      // pc+2:3
      pc = (pc + 1) & 0xffff;
      h = memory.read(pc);
      pc = (pc + 1) & 0xffff;
      tacts += 3;
      hl = (h << 8) | l;
    },

    // 0x22: ???
    () => {},

    // 0x23: ???
    () => {},

    // 0x24: ???
    () => {},

    // 0x25: ???
    () => {},

    // 0x26: ???
    () => {},

    // 0x27: ???
    () => {},

    // 0x28: ???
    () => {},

    // 0x29: ???
    () => {},

    // 0x2a: ???
    () => {},

    // 0x2b: ???
    () => {},

    // 0x2c: ???
    () => {},

    // 0x2d: ???
    () => {},

    // 0x2e: ???
    () => {},

    // 0x2f: ???
    () => {},

    // 0x30: ???
    () => {},

    // 0x31: ???
    () => {},

    // 0x32: ???
    () => {},

    // 0x33: ???
    () => {},

    // 0x34: ???
    () => {},

    // 0x35: ???
    () => {},

    // 0x36: ???
    () => {},

    // 0x37: ???
    () => {},

    // 0x38: ???
    () => {},

    // 0x39: ???
    () => {},

    // 0x3a: ???
    () => {},

    // 0x3b: ???
    () => {},

    // 0x3c: ???
    () => {},

    // 0x3d: ???
    () => {},

    // 0x3e: LD A,N
    () => {
      a = memory.read(pc);
      pc = (pc + 1) & 0xffff;
      af = (a << 8) | f;
      tacts += 3;
    },

    // 0x3f: ???
    () => {},

    // 0x40: ???
    () => {},

    // 0x41: ???
    () => {},

    // 0x42: ???
    () => {},

    // 0x43: ???
    () => {},

    // 0x44: ???
    () => {},

    // 0x45: ???
    () => {},

    // 0x46: ???
    () => {},

    // 0x47: ???
    () => {},

    // 0x48: ???
    () => {},

    // 0x49: ???
    () => {},

    // 0x4a: ???
    () => {},

    // 0x4b: ???
    () => {},

    // 0x4c: ???
    () => {},

    // 0x4d: ???
    () => {},

    // 0x4e: ???
    () => {},

    // 0x4f: ???
    () => {},

    // 0x50: ???
    () => {},

    // 0x51: ???
    () => {},

    // 0x52: ???
    () => {},

    // 0x53: ???
    () => {},

    // 0x54: ???
    () => {},

    // 0x55: ???
    () => {},

    // 0x56: ???
    () => {},

    // 0x57: ???
    () => {},

    // 0x58: ???
    () => {},

    // 0x59: ???
    () => {},

    // 0x5a: ???
    () => {}
  ];

  const indexedOperations: Z80Operation[] = [];

  // --- Retrieve back the Z80 instance
  return {
    getCpuState,
    getTestSupport,
    reset,
    executeCpuCycle,
    setResetSignal,
    clearResetSignal,
    contentionDelay
  };

  // ==========================================================================
  // Public functions

  /**
   * Resets the Z80 CPU
   */
  function reset(): void {
    iff1 = false;
    iff2 = false;
    interruptMode = 0;
    isInterruptBlocked = false;
    signals = Z80CpuSignals.None;
    prefixMode = OpPrefixMode.None;
    indexMode = OpIndexMode.None;
    pc = 0x0000;
    i = 0x00;
    r = 0x00;
    isInOpExecution = false;
    tacts = 0;
  }

  /**
   * Adds contention delay
   * @param delay #of clock tacts to delay
   */
  function contentionDelay(delay: number): void {
    tacts += delay;
  }

  /**
   * Retrieves the current value of Z80 registers
   */
  function getCpuState(): Z80CpuState {
    return {
      allowExtendedInstructionSet,

      a,
      f,
      af,
      b,
      c,
      bc,
      d,
      e,
      de,
      h,
      l,
      hl,
      _af_,
      _bc_,
      _de_,
      _hl_,
      i,
      r,
      pc,
      sp,
      xh,
      xl,
      ix,
      yh,
      yl,
      iy,
      wzh,
      wzl,
      wz,

      sFlag: (f & FlagsSetMask.S) !== 0,
      zFlag: (f & FlagsSetMask.Z) !== 0,
      r5Flag: (f & FlagsSetMask.R5) !== 0,
      hFlag: (f & FlagsSetMask.H) !== 0,
      r3Flag: (f & FlagsSetMask.R3) !== 0,
      pvFlag: (f & FlagsSetMask.PV) !== 0,
      nFlag: (f & FlagsSetMask.N) !== 0,
      cFlag: (f & FlagsSetMask.C) !== 0,

      tacts,
      signals,
      useGateArrayContention,
      iff1,
      iff2,
      interruptMode,
      isInterruptBlocked,
      isInOpExecution,
      prefixMode,
      indexMode,
      lastFethcedOpCode
    };
  }

  function getTestSupport(): Z80CpuTestSupport {
    return {
      setA(value: number): void {
        a = value & 0xff;
        af = (a << 8) | f;
      },
      setF(value: number): void {
        f = value & 0xff;
        af = (a << 8) | f;
      },
      setAF(value: number): void {
        af = value & 0xffff;
        a = af >> 8;
        f = af & 0xff;
      },
      setB(value: number): void {
        b = value & 0xff;
        bc = (b << 8) | c;
      },
      setC(value: number): void {
        c = value & 0xff;
        bc = (b << 8) | c;
      },
      setBC(value: number): void {
        bc = value & 0xffff;
        b = bc >> 8;
        c = bc & 0xff;
      },
      setD(value: number): void {
        d = value & 0xff;
        de = (d << 8) | e;
      },
      setE(value: number): void {
        e = value & 0xff;
        de = (d << 8) | e;
      },
      setDE(value: number): void {
        de = value & 0xffff;
        d = de >> 8;
        e = de & 0xff;
      },
      setH(value: number): void {
        h = value & 0xff;
        hl = (h << 8) | l;
      },
      setL(value: number): void {
        l = value & 0xff;
        hl = (h << 8) | l;
      },
      setHL(value: number): void {
        hl = value & 0xffff;
        h = hl >> 8;
        l = hl & 0xff;
      },
      set_AF_(value: number): void {
        _af_ = value & 0xffff;
      },
      set_BC_(value: number): void {
        _bc_ = value & 0xffff;
      },
      set_DE_(value: number): void {
        _de_ = value & 0xffff;
      },
      set_HL_(value: number): void {
        _hl_ = value & 0xffff;
      },
      setI(value: number): void {
        i = value & 0xff;
      },
      setR(value: number): void {
        r = value & 0xff;
      },
      setPC(value: number): void {
        pc = value & 0xffff;
      },
      setSP(value: number): void {
        sp = value & 0xffff;
      },
      setXH(value: number): void {
        xh = value & 0xff;
        ix = (xh << 8) | xl;
      },
      setXL(value: number): void {
        xl = value & 0xff;
        ix = (xh << 8) | xl;
      },
      setIX(value: number): void {
        ix = value & 0xffff;
        xh = ix >> 8;
        xl = ix & 0xff;
      },
      setYH(value: number): void {
        yh = value & 0xff;
        iy = (yh << 8) | yl;
      },
      setYL(value: number): void {
        yl = value & 0xff;
        iy = (yh << 8) | yl;
      },
      setIY(value: number): void {
        iy = value & 0xffff;
        yh = iy >> 8;
        yl = iy & 0xff;
      },
      setWZ(value: number): void {
        wz = value & 0xffff;
        wzh = wz >> 8;
        wzl = wz & 0xff;
      }
    };
  }

  /**
   * Sets the CPU's reset signal
   */
  function setResetSignal(): void {
    isInterruptBlocked = true;
    signals |= Z80CpuSignals.Reset;
  }

  /**
   * Clears the CPU's reset signal
   */
  function clearResetSignal(): void {
    signals &= Z80CpuSignals.InvReset;
    isInterruptBlocked = false;
  }

  /**
   * Executes a single CPU cycle
   */
  function executeCpuCycle(): void {
    // --- Process any active CPU signals
    if (signals !== Z80CpuSignals.None && processCpuSignals()) {
      return;
    }

    // --- Get operation code and refresh the memory
    let opCode = memory.read(pc);
    tacts += 3;
    pc = (pc + 1) & 0xffff;
    refreshMemory();
    if (prefixMode === OpPrefixMode.None) {
      // -- The CPU is about to execute a standard operation
      switch (opCode) {
        case 0xdd:
          // --- An IX index prefix received
          // --- Disable the interrupt unless the full operation code is received
          indexMode = OpIndexMode.IX;
          isInOpExecution = isInterruptBlocked = true;
          return;

        case 0xfd:
          // --- An IY index prefix received
          // --- Disable the interrupt unless the full operation code is received
          indexMode = OpIndexMode.IY;
          isInOpExecution = isInterruptBlocked = true;
          return;

        case 0xcb:
          // --- A bit operation prefix received
          // --- Disable the interrupt unless the full operation code is received
          prefixMode = OpPrefixMode.Bit;
          isInOpExecution = isInterruptBlocked = true;
          return;

        case 0xed:
          // --- An extended operation prefix received
          // --- Disable the interrupt unless the full operation code is received
          prefixMode = OpPrefixMode.Extended;
          isInOpExecution = isInterruptBlocked = true;
          return;

        default:
          // --- Normal (8-bit) operation code received
          isInterruptBlocked = false;
          lastFethcedOpCode = opCode;
          processStandardOrIndexedOperations();
          prefixMode = OpPrefixMode.None;
          indexMode = OpIndexMode.None;
          isInOpExecution = false;
          return;
      }
    }

    if (prefixMode === OpPrefixMode.Bit) {
      // --- The CPU is already in BIT operations (0xCB) prefix mode
      isInterruptBlocked = false;
      lastFethcedOpCode = opCode;
      processCBPrefixedOperations();
      indexMode = OpIndexMode.None;
      prefixMode = OpPrefixMode.None;
      isInOpExecution = false;
      return;
    }

    if (prefixMode === OpPrefixMode.Extended) {
      // --- The CPU is already in Extended operations (0xED) prefix mode
      isInterruptBlocked = false;
      lastFethcedOpCode = opCode;
      processEDOperations();
      indexMode = OpIndexMode.None;
      prefixMode = OpPrefixMode.None;
      isInOpExecution = false;
    }

    /**
     * Processes the CPU signals coming from peripheral devices
     * @returns True, if a signal has been processed; otherwise, false
     */
    function processCpuSignals(): boolean {
      if ((signals & Z80CpuSignals.Int) !== 0 && !isInterruptBlocked && iff1) {
        executeInterrupt();
        return true;
      }

      if ((signals & Z80CpuSignals.Halted) !== 0) {
        // --- The HALT instruction suspends CPU operation until a
        // --- subsequent interrupt or reset is received. While in the
        // --- HALT state, the processor executes NOPs to maintain
        // --- memory refresh logic.
        tacts += 3;
        refreshMemory();
        return true;
      }

      if ((signals & Z80CpuSignals.Reset) !== 0) {
        reset();
        return true;
      }

      if ((signals & Z80CpuSignals.Nmi) !== 0) {
        // --- Process the NMI signal
        if ((signals & Z80CpuSignals.Halted) !== 0) {
          // --- We emulate stepping over the HALT instruction
          pc = (pc + 1) & 0xffff;
          signals &= Z80CpuSignals.InvHalted;
        }
        iff2 = iff1;
        iff1 = false;
        sp--;
        tacts++;
        memory.write(sp, pc >> 8);
        tacts += 3;
        sp--;
        memory.write(sp, pc & 0xff);
        tacts += 3;

        // --- NMI address
        pc = 0x0066;
        return true;
      }

      return false;
    }

    /**
     * Executes the INT signal
     */
    function executeInterrupt(): void {
      if ((signals & Z80CpuSignals.Halted) !== 0) {
        // --- We emulate stepping over the HALT instruction
        pc = (pc + 1) & 0xffff;
        signals &= Z80CpuSignals.InvHalted;
      }
      iff1 = false;
      iff2 = false;
      sp--;
      tacts++;
      memory.write(sp, pc >> 8);
      tacts += 3;
      sp--;
      memory.write(sp, pc & 0xff);
      tacts += 3;

      switch (interruptMode) {
        // --- Interrupt Mode 0:
        // --- The interrupting device can place any instruction on
        // --- the data bus and the CPU executes it. Consequently, the
        // --- interrupting device provides the next instruction to be
        // --- executed.
        case 0:

        // --- Interrupt Mode 1:
        // --- The CPU responds to an interrupt by executing a restart
        // --- at address 0038h.As a result, the response is identical to
        // --- that of a nonmaskable interrupt except that the call
        // --- location is 0038h instead of 0066h.
        case 1:
          // --- In this implementation, we do cannot emulate a device
          // --- that places instruction on the data bus, so we'll handle
          // --- IM 0 and IM 1 the same way
          wz = 0x0038;
          tacts += 5;
          break;

        // --- Interrupt Mode 2:
        // --- The programmer maintains a table of 16-bit starting addresses
        // --- for every interrupt service routine. This table can be
        // --- located anywhere in memory. When an interrupt is accepted,
        // --- a 16-bit pointer must be formed to obtain the required interrupt
        // --- service routine starting address from the table. The upper
        // --- eight bits of this pointer is formed from the contents of the I
        // --- register.The I register must be loaded with the applicable value
        // --- by the programmer. A CPU reset clears the I register so that it
        // --- is initialized to 0. The lower eight bits of the pointer must be
        // --- supplied by the interrupting device. Only seven bits are required
        // --- from the interrupting device, because the least-significant bit
        // --- must be a 0.
        // --- This process is required, because the pointer must receive two
        // --- adjacent bytes to form a complete 16-bit service routine starting
        // --- address; addresses must always start in even locations.
        default:
          // --- Getting the lower byte from device (assume 0)
          tacts += 2;
          let addr = (i << 8) | 0xff;
          tacts += 5;
          const l = memory.read(addr);
          tacts += 3;
          const h = memory.read(++addr);
          tacts += 3;
          wz = h * 0x100 + l;
          tacts += 6;
          break;
      }
      pc = wz;
    }
  }

  // ==========================================================================
  // ALU helper functions
  //
  /**
   * Adds the `regHL` value and `regOther` value according to the rule of
   * ADD HL,QQ operation
   * @param regHL HL contents
   * @param regOther Other register contents
   */
  function aluAddHL(regHL: number, regOther: number): number {
    // --- Keep unaffected flags
    f =
      f &
      ~(
        FlagsSetMask.N |
        FlagsSetMask.C |
        FlagsSetMask.R5 |
        FlagsSetMask.R3 |
        FlagsSetMask.H
      );

    // --- Calculate Carry from bit 11
    f |= (((regHL & 0x0fff) + (regOther & 0x0fff)) >> 8) & FlagsSetMask.H;
    const res = ((regHL & 0xffff) + (regOther & 0xffff)) & 0xffffffff;

    // --- Calculate Carry
    if ((res & 0x10000) !== 0) {
      f |= FlagsSetMask.C;
    }

    // --- Set R5 and R3 according to the low 8-bit of result
    f |= (res >> 8) & 0xff & (FlagsSetMask.R5 | FlagsSetMask.R3);
    af = (a << 8) | f;
    return res & 0xffff;
  }

  // ==========================================================================
  // Helper functions

  function refreshMemory(): void {
    r = ((r + 1) & 0x7f) | (r & 0x80);
    tacts++;
  }

  /**
   * Process Z80 opcodes without a prefix, or with DD and FD prefix
   */
  function processStandardOrIndexedOperations(): void {
    const opMethod =
      indexMode === OpIndexMode.None
        ? standardOperations[lastFethcedOpCode]
        : indexedOperations[lastFethcedOpCode];
    if (opMethod !== null) {
      opMethod();
    }
  }

  /**
   * Process Z80 opcodes with ED prefix
   */
  function processEDOperations(): void {
    // TODO: Implement this method
  }

  /**
   * Process Z80 opcodes with CB prefix
   */
  function processCBPrefixedOperations(): void {
    // TODO: Implement this method
  }
}

// ============================================================================
// Helper types

/**
 * The state of the Z80 CPU signals. Individual flags indicate a particular
 * signal so that to "No signal" state can be easily tested.
 */
export enum Z80CpuSignals {
  // No signal is set
  None = 0,

  // Indicates if an interrupt signal arrived
  Int = 0x01,

  // Indicates if a Non-Maskable Interrupt signal arrived
  Nmi = 0x02,

  // Indicates if a RESET signal arrived
  Reset = 0x04,

  // Is the CPU in HALTED state?
  Halted = 0x08,

  // Reset mask of INT
  InvInt = 0xff - Int,

  // Reset mask for NMI
  InvNmi = 0xff - Nmi,

  // Reset mask for RESET
  InvReset = 0xff - Reset,

  // Reset mask for HALT
  InvHalted = 0xff - Halted
}

/**
 * Operation prefix mode values
 */
export enum OpPrefixMode {
  // No operation prefix
  None = 0,

  // Extended mode (0xED prefix)
  Extended,

  // Bit operations mode (0xCB prefix)
  Bit
}

/**
 * Operation index mode
 */
export enum OpIndexMode {
  // Indexed address mode is not used</summary>
  None = 0,

  // <summary>Indexed address with IX register</summary>
  IX,

  // <summary>Indexed address with IY register</summary>
  IY
}

/**
 * Provides operations to access system memory
 */
export interface CpuMemoryInterface {
  /**
   * Reads the memory at the specified address
   * @param addr Memory address
   * @returns Memory contents
   */
  read(addr: number): number;

  /**
   * Sets the memory value at the specified address
   * @param addr Memory address
   * @param value Value to write
   */
  write(addr: number, value: number): void;
}

/**
 * Provides operations to access I/O ports
 */
export interface CpuIoPortInterface {
  /**
   * Reads the port with the specified address
   * @param addr Port address
   * @returns Port value
   */
  readPort(addr: number): number;

  /**
   * Sends a byte to the port with the specified address
   * @param addr Port address
   * @param data Data to write to the port
   */
  writePort(addr: number, data: number): void;
}

/**
 * Represents set mask for each Z80 CPU flag
 */
export enum FlagsSetMask {
  S = 0x80,
  Z = 0x40,
  R5 = 0x20,
  H = 0x10,
  R3 = 0x08,
  PV = 0x04,
  N = 0x02,
  C = 0x01,
  SZPV = S | Z | PV,
  NH = N | H,
  R3R5 = R3 | R5
}

/**
 * Represents reset mask for each Z80 CPU flag
 */
export enum FlagsResetMask {
  S = 0x7f,
  Z = 0xbf,
  R5 = 0xdf,
  H = 0xef,
  R3 = 0xf7,
  PV = 0xfb,
  N = 0xfd,
  C = 0xfe
}

/**
 * Represents a Z80 operation
 */
type Z80Operation = (() => void) | null;

// ========================================================================
// Initialize the ALU helper tables

// --- 8 bit INC operation flags
const incOpFlags: number[] = [];
for (let b = 0; b < 0x100; b++) {
  const oldVal = b & 0xff;
  const newVal = (oldVal + 1) & 0xff;
  incOpFlags[b] =
    // C is unaffected, we keep it false
    (newVal & FlagsSetMask.R3) |
    (newVal & FlagsSetMask.R5) |
    ((newVal & 0x80) !== 0 ? FlagsSetMask.S : 0) |
    (newVal === 0 ? FlagsSetMask.Z : 0) |
    ((oldVal & 0x0f) === 0x0f ? FlagsSetMask.H : 0) |
    (oldVal === 0x7f ? FlagsSetMask.PV : 0);
  // N is false
}

// --- 8 bit DEC operation flags
const decOpFlags = [];
for (let b = 0; b < 0x100; b++) {
  const oldVal = b & 0xff;
  const newVal = (oldVal - 1) & 0xff;
  decOpFlags[b] =
    // C is unaffected, we keep it false
    (newVal & FlagsSetMask.R3) |
    (newVal & FlagsSetMask.R5) |
    ((newVal & 0x80) !== 0 ? FlagsSetMask.S : 0) |
    (newVal === 0 ? FlagsSetMask.Z : 0) |
    ((oldVal & 0x0f) === 0x00 ? FlagsSetMask.H : 0) |
    (oldVal === 0x80 ? FlagsSetMask.PV : 0) |
    FlagsSetMask.N;
}
