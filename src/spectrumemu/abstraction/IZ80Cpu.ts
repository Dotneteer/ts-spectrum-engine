import { IDevice } from './IDevice';
import { Z80StateFlags } from '../cpu/Z80StateFlags';
import { IMemoryDevice } from './IMemoryDevice';
import { IPortDevice } from './IPortDevice';
import { IStackDebugSupport } from './IStackDebugSupport';
import { IBranchDebugSupport } from './IBranchDebugSupport';

/**
 * Represents a Z80 CPU
 */
export interface IZ80Cpu extends IDevice {
    /**
     * Register A
     */
    a: number;

    /**
     * Register F
     */
    f: number;

    /**
     * Register AF
     */
    af: number;

    /**
     * Register B
     */
    b: number;

    /**
     * Register C
     */
    c: number;

    /**
     * Register BC
     */
    bc: number;

    /**
     * Register D
     */
    d: number;

    /**
     * Register E
     */
    e: number;

    /**
     * Register DE
     */
    de: number;

    /**
     * Register H
     */
    h: number;

    /**
     * Register L
     */
    l: number;

    /**
     * Register HL
     */
    hl: number;

    /**
     * Register AF'
     */
    _af_: number;
    
    /**
     * Register BC'
     */
    _bc_: number;
    
    /**
     * Register DE'
     */
    _de_: number;
    
    /**
     * Register HL'
     */
    _hl_: number;
    
    /**
     * Register I
     */
    i: number;
    
    /**
     * Register R
     */
    r: number;
    
    /**
     * Register IR
     */
    ir: number;
    
    /**
     * Register PC
     */
    pc: number;

    /**
     * Register SP
     */
    sp: number;

    /**
     * Register XH
     */
    xh: number;

    /**
     * Register XL
     */
    xl: number;

    /**
     * Register IX
     */
    ix: number;

    /**
     * Register YH
     */
    yh: number;

    /**
     * Register YL
     */
    yl: number;

    /**
     * Register IY
     */
    iy: number;

    /**
     * Register YH
     */
    wzh: number;

    /**
     * Register YL
     */
    wzl: number;

    /**
     * Register IY
     */
    wz: number;

    /**
     * Flag S
     */
    readonly sFlag: boolean;

    /**
     * Flag Z
     */
    readonly zFlag: boolean;

    /**
     * Flag R5
     */
    readonly r5Flag: boolean;

    /**
     * Flag H
     */
    readonly hFlag: boolean;

    /**
     * Flag R3
     */
    readonly r3Flag: boolean;

    /**
     * Flag PV
     */
    readonly pvFlag: boolean;

    /**
     * Flag N
     */
    readonly nFlag: boolean;

    /**
     * Flag C
     */
    readonly cFlag: boolean;

    /**
     * Exchanges AF and AF'
     */
    exchangeAfSet(): void;

    /**
     * Exchanges primary and secondary registers
     */
    exchangeRegisterSet(): void;

    /**
     * Get 8-bit register value by its index
     * @param index Register index
     */
    getReg8(index: number): number;

    /**
     * Set 8-bit register value by its index
     * @param index Register index
     * @param value Register value
     */
    setReg8(index: number, value: number): void;

    /**
     * Get 16-bit register value by its index
     * @param index Register index
     */
    getReg16(index: number): number;

    /**
     * Set 16-bit register value by its index
     * @param index Register index
     * @param value Register value
     */
    setReg16(index: number, value: number): void;

    /**
     * Increment PC
     */
    incPc(): void;

    /**
     * Gets the current tact of the device -- the clock cycles since
     * the device was reset    
     */
    readonly tacts: number;

    /**
     * CPU signals and HW flags
     */
    stateFlags: Z80StateFlags;

    /**
     * Specifies the contention mode that affects the CPU.
     * False: ULA contention mode;
     * True: Gate array contention mode;
     */
    useGateArrayContention: boolean;

    /**
     * Interrupt Enable Flip-Flop #1
     */
    readonly iff1: boolean;

    /**
     * Interrupt Enable Flip-Flop #2
     */
    readonly iff2: boolean;

    /**
     * The current Interrupt mode
     */
    readonly interruptMode: number;

    /**
     * The interrupt is blocked
     */
    readonly isInterruptBlocked: boolean;

    /**
     * Is currently in opcode execution?
     */
    readonly isInOpExecution: boolean;

    /**
     * Increments the internal clock with the specified delay ticks
     * @param tacts Number of tacts to delay
     */
    delay(tacts: number): void;

    /**
     * Executes a CPU cycle
     */
    executeCpuCycle(): void;

    /**
     * Checks if the next instruction to be executed is a call instruction or not
     */
    getCallInstructionLength(): number;

    /**
     * Gets the memory device associated with the CPU
     */
    readonly memoryDevice: IMemoryDevice | undefined;

    /**
     * Gets the device that handles Z80 CPU I/O operations
     */
    readonly portDevice: IPortDevice | undefined;

    /**
     * Gets the object that supports debugging the stack
     */
    stackDebugSupport: IStackDebugSupport | undefined;

    /**
     * Gets the object that supports debugging jump instructions
     */
    readonly branchDebugSupport: IBranchDebugSupport | undefined;

    /**
     * This flag signs if the Z80 extended instruction set (Spectrum Next)
     * is allowed, or NOP instructions should be executed instead of
     * these extended operations.
     */
    readonly allowExtendedInstructionSet: boolean;

    /**
     * Sets the CPU's RESET signal
     */
    setResetSignal(): void;

    /**
     * Releases the CPU's RESET signal
     */
    releaseResetSignal(): void;
}
