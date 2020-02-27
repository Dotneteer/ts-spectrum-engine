import { FlagsSetMask } from './FlagsSetMask';

// Represents the register set of the Z80 CPU
export class Registers {
    private _a: number;
    private _f: number;
    private _b: number;
    private _c: number;
    private _de: number;
    private _hl: number;
    private _af_: number;
    private _bc_: number;
    private _de_: number;
    private _hl_: number;
    private _i: number;
    private _r: number;
    private _pc: number;
    private _sp: number;
    private _ix: number;
    private _iy: number;
    private _wz: number;

    // Register A
    public get A() { return this._a; }
    public set A(value: number) { this._a = value & 0xff; }

    // Register F
    public get F() { return this._f; }
    public set F(value: number) { this._f = value & 0xff; }

    // Register AF
    public get AF() { return (this._a << 8) | this._f; }
    public set AF(value: number) {
        this._a = (value >> 8) & 0xff;
        this._f = value & 0xff;
    }

    // Register B
    public get B() { return this._b; }
    public set B(value: number) { this._b = value & 0xff; }

    // Register C
    public get C() { return this._c; }
    public set C(value: number) { this._c = value & 0xff; }

    // Register BC
    public get BC() { return (this._b << 8) | this._c; }
    public set BC(value: number) {
        this._b = (value >> 8) & 0xff;
        this._c = value & 0xff;
    }

    // Register D
    public get D() { return (this._de >> 8) & 0xff; }
    public set D(value: number) { this._de = ((value << 8) & 0xff00) | (this._de & 0x00ff); }

    // Register E
    public get E() { return this._de & 0xff; }
    public set E(value: number) { this._de = (this._de & 0xff00) | (value & 0xff); }

    // Register DE
    public get DE() { return this._de; }
    public set DE(value: number) { this._de = value & 0xffff; }

    // Register H
    public get H() { return (this._hl >> 8) & 0xff; }
    public set H(value: number) { this._hl = ((value << 8) & 0xff00) | (this._hl & 0x00ff); }

    // Register L
    public get L() { return this._hl & 0xff; }
    public set L(value: number) { this._hl = (this._hl & 0xff00) | (value & 0xff); }

    // Register HL
    public get HL() { return this._hl; }
    public set HL(value: number) { this._hl = value & 0xffff; }

    // Register AF'
    public get _AF_() { return this._af_; }
    public set _AF_(value: number) { this._af_ = value & 0xffff; }
    
    // Register BC'
    public get _BC_() { return this._bc_; }
    public set _BC_(value: number) { this._bc_ = value & 0xffff; }
    
    // Register DE'
    public get _DE_() { return this._de_; }
    public set _DE_(value: number) { this._de_ = value & 0xffff; }
    
    // Register HL'
    public get _HL_() { return this._hl_; }
    public set _HL_(value: number) { this._hl_ = value & 0xffff; }
    
    // Register I
    public get I() { return this._i; }
    public set I(value: number) { this._i = value & 0xff; }
    
    // Register R
    public get R() { return this._r; }
    public set R(value: number) { this._r = value & 0xff; }
    
    // Register IR
    public get IR() { return (this._i << 8) | this._r; }
    public set IR(value: number) {
        this._i = (value >> 8) & 0xff;
        this._r = value & 0xff;
    }
    
    // Register PC
    public get PC() { return this._pc; }
    public set PC(value: number) { this._pc = value & 0xffff; }

    // Register SP
    public get SP() { return this._sp; }
    public set SP(value: number) { this._sp = value & 0xffff; }

    // Register XH
    public get XH() { return (this._ix >> 8) & 0xff; }
    public set XH(value: number) { this._ix = ((value << 8) & 0xff00) | (this._ix & 0x00ff); }

    // Register XL
    public get XL() { return this._ix & 0xff; }
    public set XL(value: number) { this._ix = (this._ix & 0xff00) | (value & 0xff); }

    // Register IX
    public get IX() { return this._ix; }
    public set IX(value: number) { this._ix = value & 0xffff; }

    // Register YH
    public get YH() { return (this._iy >> 8) & 0xff; }
    public set YH(value: number) { this._iy = ((value << 8) & 0xff00) | (this._iy & 0x00ff); }

    // Register YL
    public get YL() { return this._iy & 0xff; }
    public set YL(value: number) { this._iy = (this._iy & 0xff00) | (value & 0xff); }

    // Register IY
    public get IY() { return this._iy; }
    public set IY(value: number) { this._iy = value & 0xffff; }

    // Register YH
    public get WZH() { return (this._wz >> 8) & 0xff; }
    public set WZH(value: number) { this._wz = ((value << 8) & 0xff00) | (this._wz & 0x00ff); }

    // Register YL
    public get WZL() { return this._wz & 0xff; }
    public set WZL(value: number) { this._wz = (this._wz & 0xff00) | (value & 0xff); }

    // Register IY
    public get WZ() { return this._wz; }
    public set WZ(value: number) { this._wz = value & 0xffff; }

    // --- Individual flags
    public get SFlag() { return (this._f & FlagsSetMask.S) !== 0; }
    public get ZFlag() { return (this._f & FlagsSetMask.Z) !== 0; }
    public get R5Flag() { return (this._f & FlagsSetMask.R5) !== 0; }
    public get HFlag() { return (this._f & FlagsSetMask.H) !== 0; }
    public get R3Flag() { return (this._f & FlagsSetMask.R3) !== 0; }
    public get PVFlag() { return (this._f & FlagsSetMask.PV) !== 0; }
    public get NFlag() { return (this._f & FlagsSetMask.N) !== 0; }
    public get CFlag() { return (this._f & FlagsSetMask.C) !== 0; }

    constructor() {
        this._a = 0xff;
        this._f = 0xff;
        this._b = 0xff;
        this._c = 0xff;
        this._de = 0xffff;
        this._hl = 0xffff;
        this._af_ = 0xffff;
        this._bc_ = 0xffff;
        this._de_ = 0xffff;
        this._hl_ = 0xffff;
        this._i = 0xff;
        this._r = 0xff;
        this._pc = 0xffff;
        this._sp = 0xffff;
        this._ix = 0xffff;
        this._iy = 0xffff;
        this._wz = 0xffff;
    }
}