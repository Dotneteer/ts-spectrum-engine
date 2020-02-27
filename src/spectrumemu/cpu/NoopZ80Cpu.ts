import { IZ80Cpu } from "../abstraction/IZ80Cpu";
import { Registers } from "./Registers";
import { Z80StateFlags } from "./Z80StateFlags";
import { IMemoryDevice } from "../abstraction/IMemoryDevice";
import { IPortDevice } from "../abstraction/IPortDevice";
import { IStackDebugSupport } from "../abstraction/IStackDebugSupport";
import { IBranchDebugSupport } from "../abstraction/IBranchDebugSupport";

/**
 * Non-operating (dummy) Z80 CPU device
 */
export class NoopZ80Cpu implements IZ80Cpu {
    readonly key = "Z80Cpu";
    a= 0;
    f = 0;
    af = 0;
    b = 0;
    c = 0;
    bc = 0;
    d = 0;
    e = 0;
    de = 0;
    h = 0;
    l = 0;
    hl = 0;
    _af_ = 0;
    _bc_ = 0;
    _de_ = 0;
    _hl_ = 0;
    i = 0;
    r = 0;
    ir = 0;
    pc = 0;
    sp = 0;
    xh = 0;
    xl = 0;
    ix = 0;
    yh = 0;
    yl = 0;
    iy = 0;
    wzh = 0;
    wzl = 0;
    wz = 0;
    sFlag = false;
    zFlag = false;
    r5Flag = false;
    hFlag = false;
    r3Flag = false;
    pvFlag = false;
    nFlag = false;
    cFlag = false;
    exchangeAfSet(): void {}
    exchangeRegisterSet(): void  {}
    getReg8(index: number): number { return 0; }
    setReg8(index: number, value: number): void {}
    getReg16(index: number): number { return 0; }
    setReg16(index: number, value: number): void  {}
    incPc(): void {}

    reset(): void {}
    getDeviceState(): any {}
    restoreDeviceState(state: any): void {}
    readonly tacts = 0;
    readonly registers = new Registers();
    stateFlags = Z80StateFlags.None;
    useGateArrayContention = false;
    readonly iff1 = false;
    readonly iff2 = false;
    readonly interruptMode = 0;
    readonly isInterruptBlocked = false;
    readonly isInOpExecution = false;
    delay(tacts: number): void {}
    executeCpuCycle(): void {}
    getCallInstructionLength(): number { return 0; }
    readonly memoryDevice: IMemoryDevice | undefined;
    readonly portDevice: IPortDevice | undefined;
    stackDebugSupport: IStackDebugSupport | undefined;
    readonly branchDebugSupport: IBranchDebugSupport | undefined;
    readonly allowExtendedInstructionSet = false;
    setResetSignal(): void {}
    releaseResetSignal(): void {}
}