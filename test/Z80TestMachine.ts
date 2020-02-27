import {
  CpuMemoryInterface,
  CpuIoPortInterface,
  Z80CpuEngineInterface,
  Z80CpuState,
  z80CpuEngine,
  Z80CpuSignals
} from "../src/spectrumemu/cpu/cpu-z80";
import { ILiteEvent, LiteEvent } from "../src/spectrumemu/utils/LiteEvent";
import { FlagsSetMask } from "../src/spectrumemu/cpu/FlagsSetMask";

// This class implements a Z80 machine that can be used for unit testing.
export class Z80TestMachine {
  private _breakReceived: boolean;
  private _cpuCycleCompleted = new LiteEvent<void>();

  readonly cpu: Z80CpuEngineInterface;
  runMode: RunMode;
  memory: number[];
  codeEndsAt: number = 0;
  readonly memoryAccessLog: MemoryOp[];
  readonly ioAccessLog: IoOp[];
  readonly ioInputSequence: number[];
  ioReadCount: number;

  stateBeforeRun: Z80CpuState;
  memoryBeforeRun: number[];

  // Initializes the test machine
  constructor(runMode = RunMode.Normal, allowExtendedInstructions = false) {
    this.memory = [];
    for (let i = 0; i <= 0xffff; i++) {
      this.memory[i] = 0x00;
    }
    this.memoryBeforeRun = [];
    this.memoryAccessLog = [];
    this.ioAccessLog = [];
    this.ioInputSequence = [];
    this.ioReadCount = 0;
    let memoryInterface = new Z80TestMemoryInterface(
      this.readMemory,
      this.writeMemory
    );
    let portInterface = new Z80TestIoPortInterface(this.readPort, this.writePort);
    this.cpu = z80CpuEngine( memoryInterface,
      portInterface,
      allowExtendedInstructions);
    portInterface.setCpu(this.cpu);
    this.stateBeforeRun = this.cpu.getCpuState();

    this.runMode = runMode;
    this._breakReceived = false;
  }

  /**
   * Signs that the CPU cycle has been completed.
   */
  get cpuCycleCompleted(): ILiteEvent<void> {
    return this._cpuCycleCompleted;
  }

  /**
   * Initializes the code passed in `programCode` This code is put into the 
   * memory from `codeAddress` and code execution starts at `startAddress`
   */
  public initCode(
    programCode: number[],
    codeAddress = 0,
    startAddress = 0
  ): void {
    // --- Initialize the code
    if (programCode !== null) {
      for (let i = 0; i < programCode.length; i++) {
        this.memory[codeAddress++] = programCode[i];
      }
      this.codeEndsAt = codeAddress;
      while (codeAddress < 0x10000) {
        this.memory[codeAddress++] = 0;
      }
    }

    // --- Init code execution
    this.cpu.reset();
    this.cpu.getTestSupport().setPC(startAddress);
  }

  // Runs the code
  public run(): boolean {
    this.stateBeforeRun = this.cpu.getCpuState();
    this.memoryBeforeRun = [];
    for (let i = 0; i <= 0xffff; i++) {
      this.memoryBeforeRun[i] = this.memory[i];
    }
    let stopped = false;

    while (!stopped) {
      this.cpu.executeCpuCycle();
      this._cpuCycleCompleted.trigger();
      const state = this.cpu.getCpuState();
      switch (this.runMode) {
        case RunMode.Normal:
        case RunMode.UntilBreak:
          stopped = this._breakReceived;
          break;
        case RunMode.OneCycle:
          stopped = true;
          break;
        case RunMode.OneInstruction:
          stopped = !state.isInOpExecution;
          break;
        case RunMode.UntilHalt:
          stopped = (state.signals & Z80CpuSignals.Halted) !== 0;
          break;
        default:
          stopped = state.pc >= this.codeEndsAt;
          break;
      }
    }
    return this._breakReceived;
  }

  public break(): void {
    this._breakReceived = true;
  }

  protected readMemory = (addr: number): number => {
    let value = this.memory[addr];
    this.memoryAccessLog.push(new MemoryOp(addr, value, false));
    return value;
  };

  protected writeMemory = (addr: number, value: number): void => {
    this.memory[addr] = value;
    this.memoryAccessLog.push(new MemoryOp(addr, value, true));
  };

  protected readPort = (addr: number): number => {
    let value =
      this.ioReadCount >= this.ioInputSequence.length
        ? 0x00
        : this.ioInputSequence[this.ioReadCount++];
    this.ioAccessLog.push(new IoOp(addr, value, false));
    return value;
  };

  protected writePort = (addr: number, value: number): void => {
    this.ioAccessLog.push(new IoOp(addr, value, true));
  };

  // Checks if all registers keep their original values, except the ones
  // listed in <paramref name="except"/>
  shouldKeepRegisters(except?: string): void {
    const before = this.stateBeforeRun;
    const after = this.cpu.getCpuState();
    let exclude = except === undefined ? [] : except.split(",");
    exclude = exclude.map(reg => reg.toUpperCase().trim());
    let differs: string[] = [];

    if (before._af_ !== after._af_ && exclude.indexOf("AF'") < 0) {
      differs.push("AF'");
    }
    if (before._bc_ !== after._bc_ && exclude.indexOf("BC'") < 0) {
      differs.push("BC'");
    }
    if (before._de_ !== after._de_ && exclude.indexOf("DE'") < 0) {
      differs.push("DE'");
    }
    if (before._hl_ !== after._hl_ && exclude.indexOf("HL'") < 0) {
      differs.push("HL'");
    }
    if (
      before.af !== after.af &&
      !(
        exclude.indexOf("AF") > -1 ||
        exclude.indexOf("A") > -1 ||
        exclude.indexOf("F") > -1
      )
    ) {
      differs.push("AF");
    }
    if (
      before.bc !== after.bc &&
      !(
        exclude.indexOf("BC") > -1 ||
        exclude.indexOf("B") > -1 ||
        exclude.indexOf("C") > -1
      )
    ) {
      differs.push("BC");
    }
    if (
      before.de !== after.de &&
      !(
        exclude.indexOf("DE") > -1 ||
        exclude.indexOf("D") > -1 ||
        exclude.indexOf("E") > -1
      )
    ) {
      differs.push("DE");
    }
    if (
      before.hl !== after.hl &&
      !(
        exclude.indexOf("HL") > -1 ||
        exclude.indexOf("H") > -1 ||
        exclude.indexOf("L") > -1
      )
    ) {
      differs.push("HL");
    }
    if (before.sp !== after.sp && exclude.indexOf("SP") < 0) {
      differs.push("SP");
    }
    if (before.ix !== after.ix && exclude.indexOf("IX") < 0) {
      differs.push("IX");
    }
    if (before.iy !== after.iy && exclude.indexOf("IY") < 0) {
      differs.push("IY");
    }
    if (
      before.a !== after.a &&
      exclude.indexOf("A") < 0 &&
      exclude.indexOf("AF") < 0
    ) {
      differs.push("A");
    }
    if (
      before.f !== after.f &&
      exclude.indexOf("F") < 0 &&
      exclude.indexOf("AF") < 0
    ) {
      differs.push("F");
    }
    if (
      before.b !== after.b &&
      exclude.indexOf("B") < 0 &&
      exclude.indexOf("BC") < 0
    ) {
      differs.push("B");
    }
    if (
      before.c !== after.c &&
      exclude.indexOf("C") < 0 &&
      exclude.indexOf("BC") < 0
    ) {
      differs.push("C");
    }
    if (
      before.d !== after.d &&
      exclude.indexOf("D") < 0 &&
      exclude.indexOf("DE") < 0
    ) {
      differs.push("D");
    }
    if (
      before.e !== after.e &&
      exclude.indexOf("E") < 0 &&
      exclude.indexOf("DE") < 0
    ) {
      differs.push("E");
    }
    if (
      before.h !== after.h &&
      exclude.indexOf("H") < 0 &&
      exclude.indexOf("HL") < 0
    ) {
      differs.push("H");
    }
    if (
      before.l !== after.l &&
      exclude.indexOf("L") < 0 &&
      exclude.indexOf("HL") < 0
    ) {
      differs.push("L");
    }
    if (differs.length === 0) {
      return;
    }
    throw new Error(
      "The following registers are expected to remain intact, " +
        `but their values have been changed: ${differs.join(", ")}`
    );
  }

  // Tests if S flag keeps its value while running a test.
  shouldKeepSFlag(): void {
    const before = (this.stateBeforeRun.f & FlagsSetMask.S) !== 0;
    const after = (this.cpu.getCpuState().f & FlagsSetMask.S) !== 0;
    if (after === before) {
      return;
    }
    throw new Error(
      `S flag expected to keep its value, but it changed from ${before} to ${after}`
    );
  }

  // Tests if Z flag keeps its value while running a test.
  shouldKeepZFlag(): void {
    const before = (this.stateBeforeRun.f & FlagsSetMask.Z) !== 0;
    const after = (this.cpu.getCpuState().f & FlagsSetMask.Z) !== 0;
    if (after === before) {
      return;
    }
    throw new Error(
      `Z flag expected to keep its value, but it changed from ${before} to ${after}`
    );
  }

  // Tests if N flag keeps its value while running a test.
  shouldKeepNFlag(): void {
    const before = (this.stateBeforeRun.f & FlagsSetMask.N) !== 0;
    const after = (this.cpu.getCpuState().f & FlagsSetMask.N) !== 0;
    if (after === before) {
      return;
    }
    throw new Error(
      `N flag expected to keep its value, but it changed from ${before} to ${after}`
    );
  }

  // Tests if PV flag keeps its value while running a test.
  shouldKeepPVFlag(): void {
    const before = (this.stateBeforeRun.f & FlagsSetMask.PV) !== 0;
    const after = (this.cpu.getCpuState().f & FlagsSetMask.PV) !== 0;
    if (after === before) {
      return;
    }
    throw new Error(
      `PV flag expected to keep its value, but it changed from ${before} to ${after}`
    );
  }

  // Tests if H flag keeps its value while running a test.
  shouldKeepHFlag(): void {
    const before = (this.stateBeforeRun.f & FlagsSetMask.H) !== 0;
    const after = (this.cpu.getCpuState().f & FlagsSetMask.H) !== 0;
    if (after === before) {
      return;
    }
    throw new Error(
      `PV flag expected to keep its value, but it changed from {before} to {after}`
    );
  }

  // Tests if C flag keeps its value while running a test.
  shouldKeepCFlag(): void {
    const before = (this.stateBeforeRun.f & FlagsSetMask.C) !== 0;
    const after = (this.cpu.getCpuState().f & FlagsSetMask.C) !== 0;
    if (after === before) {
      return;
    }
    throw new Error(
      `C flag expected to keep its value, but it changed from ${before} to ${after}`
    );
  }

  // Check if the machine's memory keeps its previous values, except
  // the addresses and address ranges specified in <paramref name="except"/>
  shouldKeepMemory(except?: string): void {
    const MAX_DEVS = 10;
    const ranges: { From: number; To: number }[] = [];
    const deviations: number[] = [];

    // --- Parse ranges
    let strRanges = except === undefined ? [] : except.split(",");
    for (let i = 0; i < strRanges.length; i++) {
      const range = strRanges[i];
      const blocks = range.split("-");
      let lower = 0xffff;
      let upper = 0xffff;
      if (blocks.length >= 1) {
        lower = parseInt(blocks[0], 16);
        upper = lower;
      }
      if (blocks.length >= 2) {
        upper = parseInt(blocks[1], 16);
      }
      ranges.push({ From: lower, To: upper });
    }

    // --- Check each byte of memory, ignoring the stack
    let upperMemoryBound = this.cpu.getCpuState().sp;
    if (upperMemoryBound === 0) {
      upperMemoryBound = 0x10000;
    }
    for (let idx = 0; idx < upperMemoryBound; idx++) {
      if (this.memory[idx] === this.memoryBeforeRun[idx]) {
        continue;
      }

      // --- Test allowed deviations
      let found = ranges.some(range => idx >= range.From && idx <= range.To);
      if (found) {
        continue;
      }

      // --- Report deviation
      deviations.push(idx);
      if (deviations.length >= MAX_DEVS) {
        break;
      }
    }

    if (deviations.length > 0) {
      throw new Error(
        "The following memory locations are expected to remain intact, " +
          "but their values have been changed: " +
          deviations.map(d => d.toString(16)).join(", ")
      );
    }
  }
}

// Holds information about a memory operation
class MemoryOp {
  constructor(
    public Address: number,
    public Values: number,
    public IsWrite: boolean
  ) {}
}

// Holds information about an I/O operation
class IoOp {
  constructor(
    public Address: number,
    public Value: number,
    public IsOutput: boolean
  ) {}
}

// The test machine uses this memory device
class Z80TestMemoryInterface implements CpuMemoryInterface {
  constructor(
    private readFunc: (addr: number) => number,
    private writeFunc: (addr: number, value: number) => void
  ) {}

  read(addr: number): number {
    return this.readFunc(addr);
  }

  write(addr: number, value: number): void {
    this.writeFunc(addr, value);
  }
}

// The test machine uses this port device
class Z80TestIoPortInterface implements CpuIoPortInterface {
  private _cpu: Z80CpuEngineInterface;

  constructor(
    private readFunc: (addr: number) => number,
    private writeFunc: (address: number, value: number) => void
  ) {}

  setCpu(cpu: Z80CpuEngineInterface): void {
    this._cpu = cpu;
  }

  readPort(addr: number): number {
    this._cpu.contentionDelay(4);
    return this.readFunc(addr);
  }

  writePort(addr: number, data: number): void {
    this._cpu.contentionDelay(4);
    this.writeFunc(addr, data);
  }
}

// This enum defines the run modes the Z80TestMachine allows
export enum RunMode {
  // Run while the machine is disposed or a break signal arrives.
  Normal,

  // Run a single CPU Execution cycle, even if an operation
  // contains multiple bytes
  OneCycle,

  // Pause when the next single instruction is executed.
  OneInstruction,

  // Run until a HALT instruction is reached.
  UntilHalt,

  // Run until a break signal arrives.
  UntilBreak,

  // Run until the whole injected code is executed
  UntilEnd
}
