import { IZ80Cpu } from '../abstraction/IZ80Cpu';
import { IZ80CpuTestSupport } from '../abstraction/IZ80CpuTestSupport';
import { Z80StateFlags } from './Z80StateFlags';
import { IMemoryDevice } from '../abstraction/IMemoryDevice';
import { IPortDevice } from '../abstraction/IPortDevice';
import { IStackDebugSupport } from '../abstraction/IStackDebugSupport';
import { IBranchDebugSupport } from '../abstraction/IBranchDebugSupport';
import { OpPrefixMode } from './OpPrefixMode';
import { OpIndexMode } from './OpIndexMode';
import { MemoryStatusArray } from './MemoryStatusArray';
import { ITbBlueControlDevice } from '../abstraction/ITbBlueControlDevice';
import { FlagsSetMask } from './FlagsSetMask';
import { BranchEvent } from './BranchEvent';
import { FlagsResetMask } from './FlagsResetMask';
import { StackContentManipulationEvent } from './StackContentManipulationEvent';
import { StackPointerManipulationEvent } from './StackPointerManipulationEvent';
import { NoopMemoryDevice } from '../devices/memory/NoopMemoryDevice';
import { NoopPortDevice } from '../devices/ports/NoopPortDevice';


// ========================================================================
// Instruction process function jump tables

const _standardOperations: (((cpu: Z80Cpu) => void) | null)[] = [
    null,      LdBCNN,    LdBCiA,    IncBC,     IncB,      DecB,      LdBN,      Rlca,    // 00..07
    ExAF,      AddHLBC,   LdABCi,    DecBC,     IncC,      DecC,      LdCN,      Rrca,    // 08..0F
    Djnz,      LdDENN,    LdDEiA,    IncDE,     IncD,      DecD,      LdDN,      Rla,     // 10..17
    JrE,       AddHLDE,   LdADEi,    DecDE,     IncE,      DecE,      LdEN,      Rra,     // 18..1F
    JrNZ,      LdHLNN,    LdNNiHL,   IncHL,     IncH,      DecH,      LdHN,      Daa,     // 20..27
    JrZ,       AddHLHL,   LdHLNNi,   DecHL,     IncL,      DecL,      LdLN,      Cpl,     // 28..2F
    JrNC,      LdSPNN,    LdNNiA,    IncSP,     IncHLi,    DecHLi,    LdHLiN,    Scf,     // 30..37
    JrC,       AddHLSP,   LdANNi,    DecSP,     IncA,      DecA,      LdAN,      Ccf,     // 38..3F

    null,      LdB_C,     LdB_D,     LdB_E,     LdB_H,     LdB_L,     LdB_HLi,   LdB_A,   // 40..47
    LdC_B,     null,      LdC_D,     LdC_E,     LdC_H,     LdC_L,     LdC_HLi,   LdC_A,   // 48..4F
    LdD_B,     LdD_C,     null,      LdD_E,     LdD_H,     LdD_L,     LdD_HLi,   LdD_A,   // 50..57
    LdE_B,     LdE_C,     LdE_D,     null,      LdE_H,     LdE_L,     LdE_HLi,   LdE_A,   // 58..5F
    LdH_B,     LdH_C,     LdH_D,     LdH_E,     null,      LdH_L,     LdH_HLi,   LdH_A,   // 60..67
    LdL_B,     LdL_C,     LdL_D,     LdL_E,     LdL_H,     null,      LdL_HLi,   LdL_A,   // 68..6F
    LdHLi_B,   LdHLi_C,   LdHLi_D,   LdHLi_E,   LdHLi_H,   LdHLi_L,   Halt,      LdHLi_A, // 70..77
    LdA_B,     LdA_C,     LdA_D,     LdA_E,     LdA_H,     LdA_L,     LdA_HLi,   null,    // 78..7F

    AddA_B,    AddA_C,    AddA_D,    AddA_E,    AddA_H,    AddA_L,    AddA_HLi,  AddA_A,  // 80..87
    AdcA_B,    AdcA_C,    AdcA_D,    AdcA_E,    AdcA_H,    AdcA_L,    AdcA_HLi,  AdcA_A,  // 88..8F
    SubB,      SubC,      SubD,      SubE,      SubH,      SubL,      SubHLi,    SubA,    // 90..97
    SbcB,      SbcC,      SbcD,      SbcE,      SbcH,      SbcL,      SbcHLi,    SbcA,    // 98..9F
    AndB,      AndC,      AndD,      AndE,      AndH,      AndL,      AndHLi,    AndA,    // A0..A7
    XorB,      XorC,      XorD,      XorE,      XorH,      XorL,      XorHLi,    XorA,    // A8..AF
    OrB,       OrC,       OrD,       OrE,       OrH,       OrL,       OrHLi,     OrA,     // B0..B7
    CpB,       CpC,       CpD,       CpE,       CpH,       CpL,       CpHLi,     CpA,     // B8..BF

    RetNZ,     PopBC,     JpNZ_NN,   JpNN,      CallNZ,    PushBC,    AluAN,     Rst00,   // C0..C7
    RetZ,      Ret,       JpZ_NN,    null,      CallZ,     CallNN,    AluAN,     Rst08,   // C8..CF
    RetNC,     PopDE,     JpNC_NN,   OutNA,     CallNC,    PushDE,    AluAN,     Rst10,   // D0..D7
    RetC,      Exx,       JpC_NN,    InAN,      CallC,     null,      AluAN,     Rst18,   // D8..DF
    RetPO,     PopHL,     JpPO_NN,   ExSPiHL,   CallPO,    PushHL,    AluAN,     Rst20,   // E0..E7
    RetPE,     JpHL,      JpPE_NN,   ExDEHL,    CallPE,    null,      AluAN,     Rst28,   // E8..EF
    RetP,      PopAF,     JpP_NN,    Di,        CallP,     PushAF,    AluAN,     Rst30,   // F0..F7
    RetM,      LdSPHL,    JpM_NN,    Ei,        CallM,     null,      AluAN,     Rst38    // F8..FF
];

const _extendedOperations: (((cpu: Z80Cpu) => void) | null)[] = [
    null,      null,      null,      null,      null,      null,      null,      null,    // 00..07
    null,      null,      null,      null,      null,      null,      null,      null,    // 08..0F
    null,      null,      null,      null,      null,      null,      null,      null,    // 10..17
    null,      null,      null,      null,      null,      null,      null,      null,    // 18..1F
    null,      null,      null,      Swapnib,   MirrA,     null,      MirrDE,    TestN,   // 20..27
    null,      null,      null,      null,      null,      null,      null,      null,    // 28..2F
    Mul,       AddHL_A,   AddDE_A,   AddBC_A,   AddHLNN,   AddDENN,   AddBCNN,   null,    // 30..37
    null,      null,      null,      null,      null,      null,      null,      null,    // 38..3F

    InB_C,     OutC_B,    SbcHL_QQ,  LdNNi_QQ,  Neg,       Retn,      ImN,       LdXR_A,  // 40..47
    InC_C,     OutC_C,    AdcHL_QQ,  LdQQ_NNi,  Neg,       Reti,      ImN,       LdXR_A,  // 48..4F
    InD_C,     OutC_D,    SbcHL_QQ,  LdNNi_QQ,  Neg,       Retn,      ImN,       LdA_XR,  // 50..57
    InE_C,     OutC_E,    AdcHL_QQ,  LdQQ_NNi,  Neg,       Retn,      ImN,       LdA_XR,  // 58..5F
    InH_C,     OutC_H,    SbcHL_QQ,  LdNNi_QQ,  Neg,       Retn,      ImN,       Rrd,     // 60..67
    InL_C,     OutC_L,    AdcHL_QQ,  LdQQ_NNi,  Neg,       Retn,      ImN,       Rld,     // 60..6F
    InF_C,     OutC_0,    SbcHL_QQ,  LdNNi_QQ,  Neg,       Retn,      ImN,       null,    // 70..77
    InA_C,     OutC_A,    AdcHL_QQ,  LdSP_NNi,  Neg,       Retn,      ImN,       null,    // 78..7F

    null,      null,      null,      null,      null,      null,      null,      null,    // 80..87
    null,      null,      PushNN,    null,      null,      null,      null,      null,    // 88..8F
    Outinb,    Nextreg,   NextregA,  Pixeldn,   Pixelad,   Setae,     null,      null,    // 90..97
    null,      null,      null,      null,      null,      null,      null,      null,    // 98..9F
    Ldi,       Cpi,       Ini,       Outi,      Ldix,      null,      null,      null,    // A0..A7
    Ldd,       Cpd,       Ind,       Outd,      Lddx,      null,      null,      null,    // A8..AF
    Ldir,      Cpir,      Inir,      Otir,      Ldirx,     null,      Ldirscale, Ldpirx,  // B0..B7
    Lddr,      Cpdr,      Indr,      Otdr,      Lddrx,     null,      null,      null,    // B0..BF

    null,      null,      null,      null,      null,      null,      null,      null,    // C0..C7
    null,      null,      null,      null,      null,      null,      null,      null,    // C8..CF
    null,      null,      null,      null,      null,      null,      null,      null,    // D0..D7
    null,      null,      null,      null,      null,      null,      null,      null,    // D8..DF
    null,      null,      null,      null,      null,      null,      null,      null,    // E0..E7
    null,      null,      null,      null,      null,      null,      null,      null,    // E8..EF
    null,      null,      null,      null,      null,      null,      null,      null,    // F0..F7
    null,      null,      null,      null,      null,      null,      null,      null     // F8..FF
];

const _bitOperations: (((cpu: Z80Cpu) => void) | null)[] = [
    RlcB,      RlcC,      RlcD,      RlcE,      RlcH,      RlcL,      RlcHLi,    RlcA,    // 00..07
    RrcB,      RrcC,      RrcD,      RrcE,      RrcH,      RrcL,      RrcHLi,    RrcA,    // 08..0F
    RlB,       RlC,       RlD,       RlE,       RlH,       RlL,       RlHLi,     RlA,     // 10..17
    RrB,       RrC,       RrD,       RrE,       RrH,       RrL,       RrHLi,     RrA,     // 18..1F
    SlaB,      SlaC,      SlaD,      SlaE,      SlaH,      SlaL,      SlaHLi,    SlaA,    // 20..27
    SraB,      SraC,      SraD,      SraE,      SraH,      SraL,      SraHLi,    SraA,    // 28..2F
    SllB,      SllC,      SllD,      SllE,      SllH,      SllL,      SllHLi,    SllA,    // 30..37
    SrlB,      SrlC,      SrlD,      SrlE,      SrlH,      SrlL,      SrlHLi,    SrlA,    // 38..3F

    BitN_Q,    BitN_Q,    BitN_Q,    BitN_Q,    BitN_Q,    BitN_Q,    BinN_HLi,  BitN_Q,   // 40..47
    BitN_Q,    BitN_Q,    BitN_Q,    BitN_Q,    BitN_Q,    BitN_Q,    BinN_HLi,  BitN_Q,   // 48..4F
    BitN_Q,    BitN_Q,    BitN_Q,    BitN_Q,    BitN_Q,    BitN_Q,    BinN_HLi,  BitN_Q,   // 50..57
    BitN_Q,    BitN_Q,    BitN_Q,    BitN_Q,    BitN_Q,    BitN_Q,    BinN_HLi,  BitN_Q,   // 58..5F
    BitN_Q,    BitN_Q,    BitN_Q,    BitN_Q,    BitN_Q,    BitN_Q,    BinN_HLi,  BitN_Q,   // 60..67
    BitN_Q,    BitN_Q,    BitN_Q,    BitN_Q,    BitN_Q,    BitN_Q,    BinN_HLi,  BitN_Q,   // 68..6F
    BitN_Q,    BitN_Q,    BitN_Q,    BitN_Q,    BitN_Q,    BitN_Q,    BinN_HLi,  BitN_Q,   // 70..77
    BitN_Q,    BitN_Q,    BitN_Q,    BitN_Q,    BitN_Q,    BitN_Q,    BinN_HLi,  BitN_Q,   // 78..7F

    ResN_Q,    ResN_Q,    ResN_Q,    ResN_Q,    ResN_Q,    ResN_Q,    ResN_HLi,  ResN_Q,   // 80..87
    ResN_Q,    ResN_Q,    ResN_Q,    ResN_Q,    ResN_Q,    ResN_Q,    ResN_HLi,  ResN_Q,   // 88..8F
    ResN_Q,    ResN_Q,    ResN_Q,    ResN_Q,    ResN_Q,    ResN_Q,    ResN_HLi,  ResN_Q,   // 90..97
    ResN_Q,    ResN_Q,    ResN_Q,    ResN_Q,    ResN_Q,    ResN_Q,    ResN_HLi,  ResN_Q,   // 98..9F
    ResN_Q,    ResN_Q,    ResN_Q,    ResN_Q,    ResN_Q,    ResN_Q,    ResN_HLi,  ResN_Q,   // A0..A7
    ResN_Q,    ResN_Q,    ResN_Q,    ResN_Q,    ResN_Q,    ResN_Q,    ResN_HLi,  ResN_Q,   // A8..AF
    ResN_Q,    ResN_Q,    ResN_Q,    ResN_Q,    ResN_Q,    ResN_Q,    ResN_HLi,  ResN_Q,   // B0..B7
    ResN_Q,    ResN_Q,    ResN_Q,    ResN_Q,    ResN_Q,    ResN_Q,    ResN_HLi,  ResN_Q,   // B8..BF

    SetN_Q,    SetN_Q,    SetN_Q,    SetN_Q,    SetN_Q,    SetN_Q,    SetN_HLi,  SetN_Q,   // C0..C7
    SetN_Q,    SetN_Q,    SetN_Q,    SetN_Q,    SetN_Q,    SetN_Q,    SetN_HLi,  SetN_Q,   // C8..CF
    SetN_Q,    SetN_Q,    SetN_Q,    SetN_Q,    SetN_Q,    SetN_Q,    SetN_HLi,  SetN_Q,   // D0..D7
    SetN_Q,    SetN_Q,    SetN_Q,    SetN_Q,    SetN_Q,    SetN_Q,    SetN_HLi,  SetN_Q,   // D8..DF
    SetN_Q,    SetN_Q,    SetN_Q,    SetN_Q,    SetN_Q,    SetN_Q,    SetN_HLi,  SetN_Q,   // E0..E7
    SetN_Q,    SetN_Q,    SetN_Q,    SetN_Q,    SetN_Q,    SetN_Q,    SetN_HLi,  SetN_Q,   // E8..EF
    SetN_Q,    SetN_Q,    SetN_Q,    SetN_Q,    SetN_Q,    SetN_Q,    SetN_HLi,  SetN_Q,   // F0..F7
    SetN_Q,    SetN_Q,    SetN_Q,    SetN_Q,    SetN_Q,    SetN_Q,    SetN_HLi,  SetN_Q    // F8..FF
];

const indexedOperations: (((cpu: Z80Cpu) => void) | null)[] = [
    null,      LdBCNN,    LdBCiA,    IncBC,     IncB,      DecB,      LdBN,      Rlca,     // 00..07
    ExAF,      AddIX_QQ,  LdABCi,    DecBC,     IncC,      DecC,      LdCN,      Rrca,     // 08..0F
    Djnz,      LdDENN,    LdDEiA,    IncDE,     IncD,      DecD,      LdDN,      Rla,      // 10..17
    JrE,       AddIX_QQ,  LdADEi,    DecDE,     IncE,      DecE,      LdEN,      Rra,      // 18..1F
    JrNZ,      LdIX_NN,   LdNNi_IX,  IncIX,     IncXH,     DecXH,     LdXH_N,    Daa,      // 20..27
    JrZ,       AddIX_QQ,  LdIX_NNi,  DecIX,     IncXL,     DecXL,     LdXL_N,    Cpl,      // 28..2F
    JrNC,      LdSPNN,    LdNNiA,    IncSP,     IncIXi,    DecIXi,    LdIXi_NN,  Scf,      // 30..37
    JrC,       AddIX_QQ,  LdNNiA,    DecSP,     IncA,      DecA,      LdAN,      Ccf,      // 38..3F

    null,      LdB_C,     LdB_D,     LdB_E,     LdQ_XH,    LdQ_XL,    LdQ_IXi,   LdB_A,    // 40..47
    LdC_B,     null,      LdC_D,     LdC_E,     LdQ_XH,    LdQ_XL,    LdQ_IXi,   LdC_A,    // 48..4F
    LdD_B,     LdD_C,     null,      LdD_E,     LdQ_XH,    LdQ_XL,    LdQ_IXi,   LdD_A,    // 50..57
    LdE_B,     LdE_C,     LdE_D,     null,      LdQ_XH,    LdQ_XL,    LdQ_IXi,   LdE_A,    // 58..5F
    LdXH_Q,    LdXH_Q,    LdXH_Q,    LdXH_Q,    null,      LdXH_XL,   LdQ_IXi,   LdXH_Q,   // 60..67
    LdXL_Q,    LdXL_Q,    LdXL_Q,    LdXL_Q,    LdXL_XH,   null,      LdQ_IXi,   LdXL_Q,   // 68..6F
    LdIXi_Q,   LdIXi_Q,   LdIXi_Q,   LdIXi_Q,   LdIXi_Q,   LdIXi_Q,   Halt,      LdIXi_Q,  // 70..77
    LdA_B,     LdA_C,     LdA_D,     LdA_E,     LdQ_XH,    LdQ_XL,    LdQ_IXi,   null,     // 78..7F

    AddA_B,    AddA_C,    AddA_D,    AddA_E,    AluA_XH,   AluA_XL,   AluA_IXi,  AddA_A,   // 80..87
    AdcA_B,    AdcA_C,    AdcA_D,    AdcA_E,    AluA_XH,   AluA_XL,   AluA_IXi,  AdcA_A,   // 88..8F
    SubB,      SubC,      SubD,      SubE,      AluA_XH,   AluA_XL,   AluA_IXi,  SubA,     // 90..97
    SbcB,      SbcC,      SbcD,      SbcE,      AluA_XH,   AluA_XL,   AluA_IXi,  SbcA,     // 98..9F
    AndB,      AndC,      AndD,      AndE,      AluA_XH,   AluA_XL,   AluA_IXi,  AndA,     // A0..A7
    XorB,      XorC,      XorD,      XorE,      AluA_XH,   AluA_XL,   AluA_IXi,  XorA,     // A8..AF
    OrB,       OrC,       OrD,       OrE,       AluA_XH,   AluA_XL,   AluA_IXi,  OrA,      // B0..B7
    CpB,       CpC,       CpD,       CpE,       AluA_XH,   AluA_XL,   AluA_IXi,  CpA,      // B8..BF

    RetNZ,     PopBC,     JpNZ_NN,   JpNN,      CallNZ,    PushBC,    AluAN,     Rst00,    // C0..C7
    RetZ,      Ret,       JpZ_NN,    null,      CallZ,     CallNN,    AluAN,     Rst08,    // C8..CF
    RetNC,     PopDE,     JpNC_NN,   OutNA,     CallNC,    PushDE,    AluAN,     Rst10,    // D0..D7
    RetC,      Exx,       JpC_NN,    InAN,      CallC,     null,      AluAN,     Rst18,    // D8..DF
    RetPO,     PopIX,     JpPO_NN,   ExSPiIX,   CallPO,    PushIX,    AluAN,     Rst20,    // E0..E7
    RetPE,     JpIXi,     JpPE_NN,   ExDEHL,    CallPE,    null,      AluAN,     Rst28,    // E8..EF
    RetP,      PopAF,     JpP_NN,    Di,        CallP,     PushAF,    AluAN,     Rst30,    // F0..F7
    RetM,      LdSPIX,    JpM_NN,    Ei,        CallM,     null,      AluAN,     Rst38     // F8..FF
];

const indexedBitOperations: (((cpu: Z80Cpu, addr: number) => void) | null)[] = [
    XrlcQ,     XrlcQ,     XrlcQ,    XrlcQ,      XrlcQ,     XrlcQ,     Xrlc,      XrlcQ,    // 00..07
    XrrcQ,     XrrcQ,     XrrcQ,    XrrcQ,      XrrcQ,     XrrcQ,     Xrrc,      XrrcQ,    // 08..0F
    XrlQ,      XrlQ,      XrlQ,     XrlQ,       XrlQ,      XrlQ,      Xrl,       XrlQ,     // 10..17
    XrrQ,      XrrQ,      XrrQ,     XrrQ,       XrrQ,      XrrQ,      Xrr,       XrrQ,     // 18..1F
    XslaQ,     XslaQ,     XslaQ,    XslaQ,      XslaQ,     XslaQ,     Xsla,      XslaQ,    // 20..27
    XsraQ,     XsraQ,     XsraQ,    XsraQ,      XsraQ,     XsraQ,     Xsra,      XsraQ,    // 28..2F
    XsllQ,     XsllQ,     XsllQ,    XsllQ,      XsllQ,     XsllQ,     Xsll,      XsllQ,    // 30..37
    XsrlQ,     XsrlQ,     XsrlQ,    XsrlQ,      XsrlQ,     XsrlQ,     Xsrl,      XsrlQ,    // 38..3F

    XbitN,    XbitN,    XbitN,    XbitN,    XbitN,    XbitN,    XbitN,    XbitN,    // 40..47
    XbitN,    XbitN,    XbitN,    XbitN,    XbitN,    XbitN,    XbitN,    XbitN,    // 48..4F
    XbitN,    XbitN,    XbitN,    XbitN,    XbitN,    XbitN,    XbitN,    XbitN,    // 50..57
    XbitN,    XbitN,    XbitN,    XbitN,    XbitN,    XbitN,    XbitN,    XbitN,    // 58..5F
    XbitN,    XbitN,    XbitN,    XbitN,    XbitN,    XbitN,    XbitN,    XbitN,    // 60..67
    XbitN,    XbitN,    XbitN,    XbitN,    XbitN,    XbitN,    XbitN,    XbitN,    // 68..6F
    XbitN,    XbitN,    XbitN,    XbitN,    XbitN,    XbitN,    XbitN,    XbitN,    // 70..77
    XbitN,    XbitN,    XbitN,    XbitN,    XbitN,    XbitN,    XbitN,    XbitN,    // 78..7F

    Xres,     Xres,     Xres,     Xres,     Xres,     Xres,     Xres,     Xres,    // 80..87
    Xres,     Xres,     Xres,     Xres,     Xres,     Xres,     Xres,     Xres,    // 88..8F
    Xres,     Xres,     Xres,     Xres,     Xres,     Xres,     Xres,     Xres,    // 90..97
    Xres,     Xres,     Xres,     Xres,     Xres,     Xres,     Xres,     Xres,    // 98..9F
    Xres,     Xres,     Xres,     Xres,     Xres,     Xres,     Xres,     Xres,    // A0..A7
    Xres,     Xres,     Xres,     Xres,     Xres,     Xres,     Xres,     Xres,    // A8..AF
    Xres,     Xres,     Xres,     Xres,     Xres,     Xres,     Xres,     Xres,    // B0..B7
    Xres,     Xres,     Xres,     Xres,     Xres,     Xres,     Xres,     Xres,    // B8..BF

    Xset,     Xset,     Xset,     Xset,     Xset,     Xset,     Xset,     Xset,    // C0..C7
    Xset,     Xset,     Xset,     Xset,     Xset,     Xset,     Xset,     Xset,    // C8..CF
    Xset,     Xset,     Xset,     Xset,     Xset,     Xset,     Xset,     Xset,    // D0..D7
    Xset,     Xset,     Xset,     Xset,     Xset,     Xset,     Xset,     Xset,    // D8..DF
    Xset,     Xset,     Xset,     Xset,     Xset,     Xset,     Xset,     Xset,    // E0..E7
    Xset,     Xset,     Xset,     Xset,     Xset,     Xset,     Xset,     Xset,    // E8..EF
    Xset,     Xset,     Xset,     Xset,     Xset,     Xset,     Xset,     Xset,    // F0..F7
    Xset,     Xset,     Xset,     Xset,     Xset,     Xset,     Xset,     Xset     // F8..FF
];

// ========================================================================
// Helper tables for ALU operations

const aluAlgorithms: ((cpu: Z80Cpu, value: number, carry: boolean) => void)[] = [
    AluADD,
    AluADC,
    AluSUB,
    AluSBC,
    AluAND,
    AluXOR,
    AluOR,
    AluCP
];

// Provides a table that contains the value of the F register after a 8-bit INC operation
let incOpFlags: number[];

// Provides a table that contains the value of the F register after a 8-bit INC operation
let decOpFlags: number[];

// Stores the accepted AF results of a DAA operation. The first 8 bits of
// the index is the value of A before the DAA operation; the ramining 3 bits
// are H, N, and C flags respectively.
// The upper 8 bits of the value represent A, the lower 8 bits are for F.
let daaResults: number[];

// Provides a table that contains the value of the F register after a 8-bit ADD/ADC operation.
let adcFlags: number[];

// Provides a table that contains the value of the F register after a 8-bit SUB/SBC operation.
let sbcFlags: number[];

// Provides a table that contains the value of the F register after an
// 8-bit ALU bitwise logic operation (according to the result).
let aluLogOpFlags: number[];

// Provides a table that contains the value of the F register after an
// 8-bit ALU RLC operation (according to the result).
let rlcFlags: number[];

// Provides a table that contains the result of rotate left operations.
let rolOpResults: number[];

// Provides a table that contains the value of the F register after an
// 8-bit ALU RRC operation (according to the result).
let rrcFlags: number[];

// Provides a table that contains the result of rotate right operations.
let rorOpResults: number[];

// Provides a table that contains the value of the F register after an
// 8-bit ALU RL operation with a previous Carry flag value of 1 (according to the result).
// This table supports the ALU SLA operation, too.
let rlCarry0Flags: number[];

// Provides a table that contains the value of the F register after an
// 8-bit ALU RL operation with a previous Carry flag value of 1 (according to the result).
let rlCarry1Flags: number[];

// Provides a table that contains the value of the F register after an
// 8-bit ALU RL operation with a previous Carry flag value of 1 (according to the result).
// This table supports the ALU SRA operation, too.
let rrCarry0Flags: number[];

// Provides a table that contains the value of the F register after an
// 8-bit ALU RL operation with a previous Carry flag value of 1 (according to the result).
let rrCarry1Flags: number[];

// Provides a table that contains the value of the F register after an
// 8-bit ALU SRA operation (according to the result).
let sraFlags: number[];

// ========================================================================
// Initialize the ALU helper tables

// --- 8 bit INC operation flags
incOpFlags = [];
for (let b = 0; b < 0x100; b++) {
    const oldVal = b & 0xFF;
    const newVal = (oldVal + 1) & 0xFF;
    incOpFlags[b] =
        // C is unaffected, we keep it false
        (newVal & FlagsSetMask.R3) |
        (newVal & FlagsSetMask.R5) |
        ((newVal & 0x80) !== 0 ? FlagsSetMask.S : 0) |
        (newVal === 0 ? FlagsSetMask.Z : 0) |
        ((oldVal & 0x0F) === 0x0F ? FlagsSetMask.H : 0) |
        (oldVal === 0x7F ? FlagsSetMask.PV : 0);
        // N is false
}

// --- 8 bit DEC operation flags
decOpFlags = [];
for (let b = 0; b < 0x100; b++) {
    const oldVal = b & 0xFF;
    const newVal = (oldVal - 1) & 0xFF;
    decOpFlags[b] =
        // C is unaffected, we keep it false
        (newVal & FlagsSetMask.R3) |
        (newVal & FlagsSetMask.R5) |
        ((newVal & 0x80) !== 0 ? FlagsSetMask.S : 0) |
        (newVal === 0 ? FlagsSetMask.Z : 0) |
        ((oldVal & 0x0F) === 0x00 ? FlagsSetMask.H : 0) |
        (oldVal === 0x80 ? FlagsSetMask.PV : 0) |
        FlagsSetMask.N;
}

// --- DAA flags table
daaResults = [];
for (let b = 0; b < 0x100; b++) {
    const hNibble = b >> 4;
    const lNibble = b & 0x0F;

    for (let H = 0; H <= 1; H++) {
        for (let N = 0; N <= 1; N++) {
            for (let C = 0; C <= 1; C++) {
                // --- Calculate DIFF and the new value of C Flag
                let diff = 0x00;
                let cAfter = 0;
                if (C === 0) {
                    if (hNibble >= 0 && hNibble <= 9 && lNibble >= 0 && lNibble <= 9) {
                        diff = H === 0 ? 0x00 : 0x06;
                    }
                    else if (hNibble >= 0 && hNibble <= 8 && lNibble >= 0x0A && lNibble <= 0xF) {
                        diff = 0x06;
                    }
                    else if (hNibble >= 0x0A && hNibble <= 0x0F && lNibble >= 0 && lNibble <= 9 && H === 0) {
                        diff = 0x60;
                        cAfter = 1;
                    }
                    else if (hNibble >= 9 && hNibble <= 0x0F && lNibble >= 0x0A && lNibble <= 0xF) {
                        diff = 0x66;
                        cAfter = 1;
                    }
                    else if (hNibble >= 0x0A && hNibble <= 0x0F && lNibble >= 0 && lNibble <= 9) {
                        if (H === 1) {
                            diff = 0x66;
                        }
                        cAfter = 1;
                    }
                }
                else {
                    // C == 1
                    cAfter = 1;
                    if (lNibble >= 0 && lNibble <= 9) {
                        diff = H === 0 ? 0x60 : 0x66;
                    }
                    else if (lNibble >= 0x0A && lNibble <= 0x0F) {
                        diff = 0x66;
                    }
                }

                // --- Calculate new value of H Flag
                let hAfter = 0;
                if (lNibble >= 0x0A && lNibble <= 0x0F && N === 0
                    || lNibble >= 0 && lNibble <= 5 && N === 1 && H === 1) {
                    hAfter = 1;
                }

                // --- Calculate new value of register A
                let A = (N === 0 ? b + diff : b - diff) & 0xFF;

                // --- Calculate other flags
                let aPar = 0;
                let val = A;
                for (let i = 0; i < 8; i++) {
                    aPar += val & 0x01;
                    val >>= 1;
                }

                // --- Calculate result
                let fAfter =
                    (A & FlagsSetMask.R3) |
                    (A & FlagsSetMask.R5) |
                    ((A & 0x80) !== 0 ? FlagsSetMask.S : 0) |
                    (A === 0 ? FlagsSetMask.Z : 0) |
                    (aPar % 2 === 0 ? FlagsSetMask.PV : 0) |
                    (N === 1 ? FlagsSetMask.N : 0) |
                    (hAfter === 1 ? FlagsSetMask.H : 0) |
                    (cAfter === 1 ? FlagsSetMask.C : 0);

                let result = (A << 8 | (fAfter & 0xFF)) & 0xFFFF;
                let fBefore = (H * 4 + N * 2 + C) & 0xFF;
                let idx = (fBefore << 8) + b;
                daaResults[idx] = result;
            }
        }
    }
}

// --- ADD and ADC flags
adcFlags = [];
for (let C = 0; C < 2; C++) {
    for (let X = 0; X < 0x100; X++) {
        for (let Y = 0; Y < 0x100; Y++) {
            const res = (X + Y + C) & 0xFFFF;
            let flags = 0;
            if ((res & 0xFF) === 0) {
                flags |= FlagsSetMask.Z;
            }
            flags |= res & (FlagsSetMask.R3 | FlagsSetMask.R5 | FlagsSetMask.S);
            if (res >= 0x100) { flags |= FlagsSetMask.C; }
            if ((((X & 0x0F) + (Y & 0x0F) + C) & 0x10) !== 0) { flags |= FlagsSetMask.H; }
            let ri = toSbyte(X) + toSbyte(Y) + C;
            if (ri >= 0x80 || ri <= -0x81) { flags |= FlagsSetMask.PV; }
            adcFlags[C * 0x10000 + X * 0x100 + Y] = flags & 0xFF;
        }
    }
}

// --- SUB and SBC flags
sbcFlags = [];
for (let C = 0; C < 2; C++) {
    for (let X = 0; X < 0x100; X++) {
        for (let Y = 0; Y < 0x100; Y++) {
            const res = X - Y - C;
            let flags = res & (FlagsSetMask.R3 | FlagsSetMask.R5 | FlagsSetMask.S);
            if ((res & 0xFF) === 0) { flags |= FlagsSetMask.Z; }
            if ((res & 0x10000) !== 0) { flags |= FlagsSetMask.C; }
            let ri = toSbyte(X) - toSbyte(Y) - C;
            if (ri >= 0x80 || ri < -0x80) { flags |= FlagsSetMask.PV; }
            if ((((X & 0x0F) - (res & 0x0F) - C) & 0x10) !== 0) { flags |= FlagsSetMask.H; }
            flags |= FlagsSetMask.N;
            sbcFlags[C * 0x10000 + X * 0x100 + Y] = flags &0xFF;
        }
    }
}

// --- ALU log operation (AND, XOR, OR) flags
aluLogOpFlags = [];
for (let b = 0; b < 0x100; b++) {
    const fl = b & (FlagsSetMask.R3 | FlagsSetMask.R5 | FlagsSetMask.S);
    let p = FlagsSetMask.PV;
    for (let i = 0x80; i !== 0; i /= 2) {
        if ((b & i) !== 0) { p ^= FlagsSetMask.PV; }
    }
    aluLogOpFlags[b] = (fl | p) &0xFF;
}
aluLogOpFlags[0] |= FlagsSetMask.Z;

// --- 8-bit RLC operation flags
rlcFlags = [];
for (let b = 0; b < 0x100; b++) {
    let rlcVal = b;
    rlcVal <<= 1;
    let cf = (rlcVal & 0x100) !== 0 ? FlagsSetMask.C : 0;
    if (cf !== 0) {
        rlcVal = (rlcVal | 0x01) & 0xFF;
    }
    let p = FlagsSetMask.PV;
    for (let i = 0x80; i !== 0; i /= 2) {
        if ((rlcVal & i) !== 0) { p ^= FlagsSetMask.PV; }
    }
    let flags = (rlcVal & (FlagsSetMask.S | FlagsSetMask.R5 | FlagsSetMask.R3) | p | cf) & 0xFF;
    if (rlcVal === 0) { flags |= FlagsSetMask.Z; }
    rlcFlags[b] = flags;
}

 // --- 8-bit RRC operation flags
rrcFlags = [];
for (let b = 0; b < 0x100; b++) {
    let rrcVal = b;
    let cf = (rrcVal & 0x01) !== 0 ? FlagsSetMask.C : 0;
    rrcVal >>= 1;
    if (cf !== 0) {
        rrcVal = (rrcVal | 0x80);
    }
    let p = FlagsSetMask.PV;
    for (let i = 0x80; i !== 0; i /= 2) {
        if ((rrcVal & i) !== 0) { p ^= FlagsSetMask.PV; }
    }
    let flags = (rrcVal & (FlagsSetMask.S | FlagsSetMask.R5 | FlagsSetMask.R3) | p | cf) & 0xFF;
    if (rrcVal === 0) { flags |= FlagsSetMask.Z; }
    rrcFlags[b] = flags;
}

// --- 8-bit RL operations with 0 Carry flag
rlCarry0Flags = [];
for (let b = 0; b < 0x100; b++) {
    let rlVal = b;
    rlVal <<= 1;
    let cf = (rlVal & 0x100) !== 0 ? FlagsSetMask.C : 0;
    let p = FlagsSetMask.PV;
    for (let i = 0x80; i !== 0; i /= 2) {
        if ((rlVal & i) !== 0) { p ^= FlagsSetMask.PV; }
    }
    let flags = (rlVal & (FlagsSetMask.S | FlagsSetMask.R5 | FlagsSetMask.R3) | p | cf) & 0xFF;
    if ((rlVal & 0xFF) === 0) {
        flags |= FlagsSetMask.Z;
    }
    rlCarry0Flags[b] = flags;
}

// --- 8-bit RL operations with Carry flag set
rlCarry1Flags = [];
for (let b = 0; b < 0x100; b++) {
    let rlVal = b;
    rlVal <<= 1;
    rlVal++;
    let cf = (rlVal & 0x100) !== 0 ? FlagsSetMask.C : 0;
    let p = FlagsSetMask.PV;
    for (let i = 0x80; i !== 0; i /= 2) {
        if ((rlVal & i) !== 0) { p ^= FlagsSetMask.PV; }
    }
    let flags = (rlVal & (FlagsSetMask.S | FlagsSetMask.R5 | FlagsSetMask.R3) | p | cf) & 0xFF;
    if ((rlVal & 0x1FF) === 0) {
        flags |= FlagsSetMask.Z;
    }
    rlCarry1Flags[b] = flags;
}

// --- 8-bit RR operations with 0 Carry flag
rrCarry0Flags = [];
for (let b = 0; b < 0x100; b++) {
    let rrVal = b;
    let cf = (rrVal & 0x01) !== 0 ? FlagsSetMask.C : 0;
    rrVal >>= 1;
    let p = FlagsSetMask.PV;
    for (let i = 0x80; i !== 0; i /= 2) {
        if ((rrVal & i) !== 0) { p ^= FlagsSetMask.PV; }
    }
    let flags = (rrVal & (FlagsSetMask.S | FlagsSetMask.R5 | FlagsSetMask.R3) | p | cf) & 0xFF;
    if (rrVal === 0) { flags |= FlagsSetMask.Z; }
    rrCarry0Flags[b] = flags;
}

// --- 8-bit RR operations with Carry flag set
rrCarry1Flags = [];
for (let b = 0; b < 0x100; b++) {
    let rrVal = b;
    let cf = (rrVal & 0x01) !== 0 ? FlagsSetMask.C : 0;
    rrVal >>= 1;
    rrVal += 0x80;
    let p = FlagsSetMask.PV;
    for (let i = 0x80; i !== 0; i /= 2) {
        if ((rrVal & i) !== 0) { p ^= FlagsSetMask.PV; }
    }
    let flags = (rrVal & (FlagsSetMask.S | FlagsSetMask.R5 | FlagsSetMask.R3) | p | cf) &0xFF;
    if (rrVal === 0) { flags |= FlagsSetMask.Z; }
    rrCarry1Flags[b] = flags;
}

// --- 8-bit SRA operation flags
sraFlags = [];
for (let b = 0; b < 0x100; b++) {
    let sraVal = b;
    let cf = (sraVal & 0x01) !== 0 ? FlagsSetMask.C : 0;
    sraVal = (sraVal >> 1) + (sraVal & 0x80);
    let p = FlagsSetMask.PV;
    for (let i = 0x80; i !== 0; i /= 2) {
        if ((sraVal & i) !== 0) { p ^= FlagsSetMask.PV; }
    }
    let flags = (sraVal & (FlagsSetMask.S | FlagsSetMask.R5 | FlagsSetMask.R3) | p | cf) & 0xFF;
    if ((sraVal & 0xFF) === 0) { flags |= FlagsSetMask.Z; }
    sraFlags[b] = flags;
}

// --- Initialize rotate operation tables
rolOpResults = [];
rorOpResults = [];

for (let b = 0; b < 0x100; b++) {
    rolOpResults[b] = ((b << 1) + (b >> 7)) & 0xFF;
    rorOpResults[b] = ((b >> 1) + (b << 7)) & 0xFF;
}

// Converts an unsigned byte to a signed byte
export function toSbyte(x: number) {
    x &= 0xFF;
    return x >= 128 ? x - 256 : x;
}

// Converts value to a signed short
export function toSshort(x: number) {
    x &= 0xFFFF;
    return x >= 32768 ? x - 65536 : x;
}

// ========================================================================
// This class represents the Z80 CPU
export class Z80Cpu implements IZ80Cpu, IZ80CpuTestSupport {

    private _a: number;
    private _f: number;
    private _b: number;
    private _c: number;
    private _de: number;
    private _hl: number;
    private __af_: number;
    private __bc_: number;
    private __de_: number;
    private __hl_: number;
    private _i: number;
    private _r: number;
    private _pc: number;
    private _sp: number;
    private _ix: number;
    private _iy: number;
    private _wz: number;

    /**
     * Device key information
     */
    get key(): string {
        return "Z80CPUDevice";
    }

    /**
     * Last fethced opcode
     */
    opCode: number = 0;

    // Gets the current tact of the device -- the clock cycles since
    // the device was reset
    tacts: number = 0;

    // CPU signals and HW flags
    stateFlags: Z80StateFlags = Z80StateFlags.None;

    // Specifies the contention mode that affects the CPU.
    // False: ULA contention mode;
    // True: Gate array contention mode;
    useGateArrayContention: boolean = false;

    // Interrupt Enable Flip-Flop #1
    iff1: boolean = false;

    // Interrupt Enable Flip-Flop #2
    iff2: boolean = false;

    // The current Interrupt mode
    interruptMode: number = 0;

    // The interrupt is blocked
    isInterruptBlocked: boolean = false;

    // Is currently in opcode execution?
    isInOpExecution: boolean = false;

    // Gets the memory device associated with the CPU
    memoryDevice: IMemoryDevice;

    // Gets the device that handles Z80 CPU I/O operations
    portDevice: IPortDevice;

    // Gets the object that supports debugging the stack
    stackDebugSupport: IStackDebugSupport | undefined;

    // Gets the object that supports debugging jump instructions
    branchDebugSupport: IBranchDebugSupport | undefined;

    // This flag indicates if the CPU entered into a maskable
    // interrupt method as a result of an INT signal
    maskableInterruptModeEntered: boolean = false;

    // This flag signs if the Z80 extended instruction set (Spectrum Next)
    // is allowed, or NOP instructions should be executed instead of
    // these extended operations.
    allowExtendedInstructionSet: boolean;

    // The TBBlue device attached to this CPU
    tbBlueDevice: ITbBlueControlDevice | undefined;

    // Gets the current execution flow status
    executionFlowStatus: MemoryStatusArray;

    // Gets the current memory read status
    memoryReadStatus: MemoryStatusArray;

    // Gets the current memory write status
    memoryWriteStatus: MemoryStatusArray;

    // The current Operation Prefix Mode
    prefixMode: OpPrefixMode = OpPrefixMode.None;

    // The current Operation Index Mode
    indexMode: OpIndexMode = OpIndexMode.None;

    // =======================================================================
    // Lifecycle

    constructor(memoryDevice?: IMemoryDevice, portDevice?: IPortDevice, 
        allowExtendedInstructionSet: boolean = false, tbBlueDevice?: ITbBlueControlDevice) {

        this._a = 0xff;
        this._f = 0xff;
        this._b = 0xff;
        this._c = 0xff;
        this._de = 0xffff;
        this._hl = 0xffff;
        this.__af_ = 0xffff;
        this.__bc_ = 0xffff;
        this.__de_ = 0xffff;
        this.__hl_ = 0xffff;
        this._i = 0xff;
        this._r = 0xff;
        this._pc = 0xffff;
        this._sp = 0xffff;
        this._ix = 0xffff;
        this._iy = 0xffff;
        this._wz = 0xffff;

        this.memoryDevice = memoryDevice ? memoryDevice : new NoopMemoryDevice();
        this.portDevice = portDevice ? portDevice : new NoopPortDevice();
        this.allowExtendedInstructionSet = allowExtendedInstructionSet 
            ? false : allowExtendedInstructionSet;
        this.tbBlueDevice = tbBlueDevice;
        this.executionFlowStatus = new MemoryStatusArray();
        this.memoryReadStatus = new MemoryStatusArray();
        this.memoryWriteStatus = new MemoryStatusArray();
        this.executeReset();
    }


    // ========================================================================
    // Register & flag operations
    
    /**
     * Register A
     */
    public get a() { return this._a; }
    public set a(value: number) { this._a = value & 0xff; }

    /**
     * Register F
     */
    public get f() { return this._f; }
    public set f(value: number) { this._f = value & 0xff; }

    /**
     * Register AF
     */
    public get af() { return (this._a << 8) | this._f; }
    public set af(value: number) {
        this._a = (value >> 8) & 0xff;
        this._f = value & 0xff;
    }

    /**
     * Register B
     */
    public get b() { return this._b; }
    public set b(value: number) { this._b = value & 0xff; }

    /**
     * Register C
     */
    public get c() { return this._c; }
    public set c(value: number) { this._c = value & 0xff; }

    /**
     * Register BC
     */
    public get bc() { return (this._b << 8) | this._c; }
    public set bc(value: number) {
        this._b = (value >> 8) & 0xff;
        this._c = value & 0xff;
    }

    /**
     * Register D
     */
    public get d() { return (this._de >> 8) & 0xff; }
    public set d(value: number) { this._de = ((value << 8) & 0xff00) | (this._de & 0x00ff); }

    /**
     * Register E
     */
    public get e() { return this._de & 0xff; }
    public set e(value: number) { this._de = (this._de & 0xff00) | (value & 0xff); }

    /**
     * Register DE
     */
    public get de() { return this._de; }
    public set de(value: number) { this._de = value & 0xffff; }

    /**
     * Register H
     */
    public get h() { return (this._hl >> 8) & 0xff; }
    public set h(value: number) { this._hl = ((value << 8) & 0xff00) | (this._hl & 0x00ff); }

    /**
     * Register L
     */
    public get l() { return this._hl & 0xff; }
    public set l(value: number) { this._hl = (this._hl & 0xff00) | (value & 0xff); }

    /**
     * Register HL
     */
    public get hl() { return this._hl; }
    public set hl(value: number) { this._hl = value & 0xffff; }

    /**
     * Register AF'
     */
    public get _af_() { return this.__af_; }
    public set _af_(value: number) { this.__af_ = value & 0xffff; }
    
    /**
     * Register BC'
     */
    public get _bc_() { return this.__bc_; }
    public set _bc_(value: number) { this.__bc_ = value & 0xffff; }
    
    /**
     * Register DE'
     */
    public get _de_() { return this.__de_; }
    public set _de_(value: number) { this.__de_ = value & 0xffff; }
    
    /**
     * Register HL'
     */
    public get _hl_() { return this.__hl_; }
    public set _hl_(value: number) { this.__hl_ = value & 0xffff; }
    
    /**
     * Register I
     */
    public get i() { return this._i; }
    public set i(value: number) { this._i = value & 0xff; }
    
    /**
     * Register R
     */
    public get r() { return this._r; }
    public set r(value: number) { this._r = value & 0xff; }
    
    /**
     * Register IR
     */
    public get ir() { return (this._i << 8) | this._r; }
    public set ir(value: number) {
        this._i = (value >> 8) & 0xff;
        this._r = value & 0xff;
    }
    
    /**
     * Register PC
     */
    public get pc() { return this._pc; }
    public set pc(value: number) { this._pc = value & 0xffff; }

    /**
     * Register SP
     */
    public get sp() { return this._sp; }
    public set sp(value: number) { this._sp = value & 0xffff; }

    /**
     * Register XH
     */
    public get xh() { return (this._ix >> 8) & 0xff; }
    public set xh(value: number) { this._ix = ((value << 8) & 0xff00) | (this._ix & 0x00ff); }

    /**
     * Register XL
     */
    public get xl() { return this._ix & 0xff; }
    public set xl(value: number) { this._ix = (this._ix & 0xff00) | (value & 0xff); }

    /**
     * Register IX
     */
    public get ix() { return this._ix; }
    public set ix(value: number) { this._ix = value & 0xffff; }

    /**
     * Register YH
     */
    public get yh() { return (this._iy >> 8) & 0xff; }
    public set yh(value: number) { this._iy = ((value << 8) & 0xff00) | (this._iy & 0x00ff); }

    /**
     * Register YL
     */
    public get yl() { return this._iy & 0xff; }
    public set yl(value: number) { this._iy = (this._iy & 0xff00) | (value & 0xff); }

    /**
     * Register IY
     */
    public get iy() { return this._iy; }
    public set iy(value: number) { this._iy = value & 0xffff; }

    /**
     * Register YH
     */
    public get wzh() { return (this._wz >> 8) & 0xff; }
    public set wzh(value: number) { this._wz = ((value << 8) & 0xff00) | (this._wz & 0x00ff); }

    /**
     * Register YL
     */
    public get wzl() { return this._wz & 0xff; }
    public set wzl(value: number) { this._wz = (this._wz & 0xff00) | (value & 0xff); }

    /**
     * Register IY
     */
    public get wz() { return this._wz; }
    public set wz(value: number) { this._wz = value & 0xffff; }

    /**
     * Flag S
     */
    public get sFlag() { return (this._f & FlagsSetMask.S) !== 0; }

    /**
     * Flag Z
     */
    public get zFlag() { return (this._f & FlagsSetMask.Z) !== 0; }

    /**
     * Flag R5
     */
    public get r5Flag() { return (this._f & FlagsSetMask.R5) !== 0; }

    /**
     * Flag H
     */
    public get hFlag() { return (this._f & FlagsSetMask.H) !== 0; }

    /**
     * Flag R3
     */
    public get r3Flag() { return (this._f & FlagsSetMask.R3) !== 0; }

    /**
     * Flag PV
     */
    public get pvFlag() { return (this._f & FlagsSetMask.PV) !== 0; }

    /**
     * Flag N
     */
    public get nFlag() { return (this._f & FlagsSetMask.N) !== 0; }

    /**
     * Flag C
     */
    public get cFlag() { return (this._f & FlagsSetMask.C) !== 0; }

    /**
     * Exchanges AF and AF'
     */
    public exchangeAfSet() {
        let tmp = this.af;
        this.af = this._af_;
        this._af_ = tmp;
    }

    /**
     * Exchanges primary and secondary registers
     */
    public exchangeRegisterSet() {
        let tmp = this.bc;
        this.bc = this._bc_;
        this._bc_ = tmp;
        tmp = this.de;
        this.de = this._de_;
        this._de_ = tmp;
        tmp = this.hl;
        this.hl = this._hl_;
        this._hl_ = tmp;
    }

    /**
     * Get 8-bit register value by its index
     * @param index Register index
     */
    public getReg8(index: number) {
        switch (index) {
            case 0: return this._b;
            case 1: return this._c;
            case 2: return this.d;
            case 3: return this.e;
            case 4: return this.h;
            case 5: return this.l;
            case 7: return this._a;
            default:
                throw new Error(`${index} is out of the range when reading an 8-bit register value.`);
        }
    }

    /**
     * Set 8-bit register value by its index
     * @param index Register index
     * @param value Register value
     */
    public setReg8(index: number, value: number) {
        switch (index) {
            case 0:
                this.b = value;
                break;
            case 1:
                this.c = value;
                break;
            case 2:
                this.d = value;
                break;
            case 3:
                this.e = value;
                break;
            case 4:
                this.h = value;
                break;
            case 5:
                this.l = value;
                break;
            case 7:
                this.a = value;
                break;
            default:
                throw new Error(`${index} is out of the range when writing an 8-bit register value.`);
        }
    }

    /**
     * Get 16-bit register value by its index
     * @param index Register index
     */
    public getReg16(index: number) {
        switch (index) {
            case 0: return this.bc;
            case 1: return this.de;
            case 2: return this.hl;
            case 3: return this.sp;
            default:
                throw new Error(`${index} is out of the range when reading a 16-bit register value.`);
        }
    }

    /**
     * Set 16-bit register value by its index
     * @param index Register index
     * @param value Register value
     */
    public setReg16(index: number, value: number) {
        switch (index) {
            case 0:
                this.bc = value;
                break;
            case 1:
                this.de = value;
                break;
            case 2:
                this.hl = value;
                break;
            case 3:
                this.sp = value;
                break;
            default:
                throw new Error(`${index} is out of the range when writing an 8-bit register value.`);
        }
    }

    /**
     * Increment PC
     */
    incPc() {
        this._pc++;
        this._pc &= 0xFFFF;
    }

    // Applies the RESET signal
    reset() {
        this.executeReset();
    }
    
    // ========================================================================
    // Clock handling methods
    // Increments the internal clock with the specified delay ticks
    delay(ticks: number) {
        this.tacts += ticks;
    }
    
    // ========================================================================
    // Main execution cycle methods

    // Executes a CPU cycle
    executeCpuCycle() {
        // --- If any of the RST, INT or NMI signals has been processed,
        // --- Execution flow in now on the corresponding way
        // --- Nothing more to do in this execution cycle
        if (this.stateFlags !== Z80StateFlags.None && 
            this.processCpuSignals()) { 
                return;
        }

        // --- Get operation code and refresh the memory
        let opCode = this.readCodeMemory();
        this.tacts += 3;
        this.incPc();
        this.refreshMemory();
        if (this.prefixMode === OpPrefixMode.None) {
            // -- The CPU is about to execute a standard operation
            switch (opCode) {
                case 0xDD:
                    // --- An IX index prefix received
                    // --- Disable the interrupt unless the full operation code is received
                    this.indexMode = OpIndexMode.IX;
                    this.isInOpExecution = this.isInterruptBlocked = true;
                    return;

                case 0xFD:
                    // --- An IY index prefix received
                    // --- Disable the interrupt unless the full operation code is received
                    this.indexMode = OpIndexMode.IY;
                    this.isInOpExecution = this.isInterruptBlocked = true;
                    return;

                case 0xCB:
                    // --- A bit operation prefix received
                    // --- Disable the interrupt unless the full operation code is received
                    this.prefixMode = OpPrefixMode.Bit;
                    this.isInOpExecution = this.isInterruptBlocked = true;
                    return;

                case 0xED:
                    // --- An extended operation prefix received
                    // --- Disable the interrupt unless the full operation code is received
                    this.prefixMode = OpPrefixMode.Extended;
                    this.isInOpExecution = this.isInterruptBlocked = true;
                    return;

                default:
                    // --- Normal (8-bit) operation code received
                    this.isInterruptBlocked = false;
                    this.opCode = opCode;
                    this.processStandardOrIndexedOperations();
                    this.prefixMode = OpPrefixMode.None;
                    this.indexMode = OpIndexMode.None;
                    this.isInOpExecution = false;
                    return;
            }
        }

        if (this.prefixMode === OpPrefixMode.Bit) {
            // --- The CPU is already in BIT operations (0xCB) prefix mode
            this.isInterruptBlocked = false;
            this.opCode = opCode;
            this.processCBPrefixedOperations();
            this.indexMode = OpIndexMode.None;
            this.prefixMode = OpPrefixMode.None;
            this.isInOpExecution = false;
            return;
        }

        if (this.prefixMode === OpPrefixMode.Extended) {
            // --- The CPU is already in Extended operations (0xED) prefix mode
            this.isInterruptBlocked = false;
            this.opCode = opCode;
            this.processEDOperations();
            this.indexMode = OpIndexMode.None;
            this.prefixMode = OpPrefixMode.None;
            this.isInOpExecution = false;
        }
    }
  
    // Checks if the next instruction to be executed is a call instruction or not
    getCallInstructionLength(): number {
        // --- We intentionally avoid using ReadMemory() directly
        // --- So that we can prevent false memory touching.
        let opCode = this.memoryDevice.read(this.pc);

        // --- CALL instruction
        if (opCode === 0xCD) {
            return 3;
        }

        // --- Call instruction with condition
        if ((opCode & 0xC7) === 0xC4) {
            return 3;
        }

        // --- Check for RST instructions
        if ((opCode & 0xC7) === 0xC7) {
            return 1;
        }

        // --- Check for HALT instruction
        if (opCode  === 0x76) {
            return 1;
        }

        // --- Check for extended instruction prefix
        if (opCode !== 0xED) {
            return 0;
        }

        // --- Check for I/O and block transfer instructions
        opCode = this.memoryDevice.read((this.pc + 1) & 0xFFFF);
        return ((opCode & 0xB4) === 0xB0) ? 2 : 0;
    }
    
    // ========================================================================
    // Memory and port device operations

    // Read the memory at the specified address
    readMemory(addr: number): number {
        this.memoryReadStatus.touch(addr);
        return this.memoryDevice.read(addr);
    }

    // Read the memory at the PC address
    readCodeMemory(): number {
        this.executionFlowStatus.touch(this.pc);
        return this.memoryDevice.read(this.pc);
    }

    // Set the memory value at the specified address
    writeMemory(addr: number, value: number) {
        this.memoryWriteStatus.touch(addr);
        this.memoryDevice.write(addr, value);
    }

    // Read the port with the specified address
    readPort(addr: number): number {
        return this.portDevice.readPort(addr);
    }

    // Write data to the port with the specified address
    writePort(addr: number, data: number) {
        this.portDevice.writePort(addr, data);
    }

    // ========================================================================
    // CPU signal processing methods

    // Processes the CPU signals coming from peripheral devices
    // of the computer
    // Returns true, if a signal has been processed; otherwise, false
    private processCpuSignals(): boolean {
        if ((this.stateFlags & Z80StateFlags.Int) !== 0 && !this.isInterruptBlocked && this.iff1) {
            this.executeInterrupt();
            return true;
        }

        if ((this.stateFlags & Z80StateFlags.Halted) !== 0) {
            // --- The HALT instruction suspends CPU operation until a 
            // --- subsequent interrupt or reset is received. While in the
            // --- HALT state, the processor executes NOPs to maintain
            // --- memory refresh logic.
            this.tacts += 3;
            this.refreshMemory();
            return true;
        }

        if ((this.stateFlags & Z80StateFlags.Reset) !== 0) {
            this.executeReset();
            return true;
        }

        if ((this.stateFlags & Z80StateFlags.Nmi) !== 0) {
            this.executeNmi();
            return true;
        }

        return false;
    }

    // Executes an INT
    private executeInterrupt() {
        if ((this.stateFlags & Z80StateFlags.Halted) !== 0)
        {
            // --- We emulate stepping over the HALT instruction
            this.incPc();
            this.stateFlags &= Z80StateFlags.InvHalted;
        }
        this.iff1 = false;
        this.iff2 = false;
        this.sp--;
        this.tacts++;
        this.writeMemory(this.sp, this.pc >> 8);
        this.tacts += 3;
        this.sp--;
        this.writeMemory(this.sp, this.pc & 0xFF);
        this.tacts += 3;

        switch (this.interruptMode)
        {
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
                this.wz = 0x0038;
                this.tacts += 5;
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
                this.tacts += 2;
                let addr = (this.ir & 0xFF00) | 0xFF;
                this.tacts += 5;
                let l = this.readMemory(addr);
                this.tacts += 3;
                let h = this.readMemory(++addr);
                this.tacts += 3;
                this.wz = (h * 0x100 + l);
                this.tacts += 6;
                break;
        }
        this.pc = this.wz;
    }

    // Takes care of refreching the dynamic memory
    // The Z80 CPU contains a memory refresh counter, enabling dynamic 
    // memories to be used with the same ease as static memories. Seven 
    // bits of this 8-bit register are automatically incremented after 
    // each instruction fetch. The eighth bit remains as programmed, 
    // resulting from an "LD R, A" instruction. The data in the refresh
    // counter is sent out on the lower portion of the address bus along 
    // with a refresh control signal while the CPU is decoding and 
    // executing the fetched instruction. This mode of refresh is 
    // transparent to the programmer and does not slow the CPU operation.
    // </remarks>
    private refreshMemory() {
        this.r = ((this.r + 1) & 0x7F) | (this.r & 0x80);
        this.tacts++;
    }

    // Executes a hard reset
    private executeReset() {
        this.iff1 = false;
        this.iff2 = false;
        this.interruptMode = 0;
        this.isInterruptBlocked = false;
        this.stateFlags = Z80StateFlags.None;
        this.prefixMode = OpPrefixMode.None;
        this.indexMode = OpIndexMode.None;
        this.pc = 0x0000;
        this.ir = 0x0000;
        this.isInOpExecution = false;
        this.tacts = 0;
    }

    // Executes an NMI
    private executeNmi() {
        if ((this.stateFlags & Z80StateFlags.Halted) !== 0) {
            // --- We emulate stepping over the HALT instruction
            this.incPc();
            this.stateFlags &= Z80StateFlags.InvHalted;
        }
        this.iff2 = this.iff1;
        this.iff1 = false;
        this.sp--;
        this.tacts++;
        this.writeMemory(this.sp, this.pc >> 8);
        this.tacts += 3;
        this.sp--;
        this.writeMemory(this.sp, this.pc & 0xFF);
        this.tacts += 3;

        // --- NMI address
        this.pc = 0x0066;
    }

    // Sets the CPU's RESET signal
    setResetSignal(): void {
        this.isInterruptBlocked = true;
        this.stateFlags |= Z80StateFlags.Reset;
    }

    // Releases the CPU's RESET signal
    releaseResetSignal(): void {
        this.stateFlags &= Z80StateFlags.InvReset;
        this.isInterruptBlocked = false;
    }

    // ========================================================================
    // Test support methods

    // Allows setting the number of tacts
    setTacts(tacts: number) {
        this.tacts = tacts;
    }

    // Sets the specified interrupt mode
    setInterruptMode(im: number) {
        this.interruptMode = im;
    }

    // Sets the IFF1 and IFF2 flags to the specified value;
    setIffValues(value: boolean) {
        this.iff1 = this.iff2 = value;
    }

    // Block interrupts
    blockInterrupt() {
        this.isInterruptBlocked = true;
    }

    // Removes the CPU from its halted state
    removeFromHaltedState() {
        if ((this.stateFlags & Z80StateFlags.Halted) === 0) { return; }
        this.incPc();
        this.stateFlags &= Z80StateFlags.InvHalted;
    }

    // =======================================================================
    // Device state management
    getDeviceState() {
    }

    restoreDeviceState(state: any) {
    }

    // ========================================================================
    // Instruction execution
    
    // Process Z80 opcodes without a prefix, or with DD and FD prefix
    processStandardOrIndexedOperations() {
        const opMethod = this.indexMode === OpIndexMode.None
            ? _standardOperations[this.opCode]
            : indexedOperations[this.opCode];
        if (opMethod !== null) {
            opMethod(this);
        }
    }

    // Process Z80 opcodes with ED prefix
    processEDOperations(){
        const opMethod = _extendedOperations[this.opCode];
        if (opMethod !== null) {
            opMethod(this);
        }
    }

    // Process Z80 opcodes with CB prefix
    processCBPrefixedOperations() {
        if (this.indexMode === OpIndexMode.None) {
            const opMethod = _bitOperations[this.opCode];
            if (opMethod !== null) {
                opMethod(this);
            }
            return;
        }

        this.wz = (this.indexMode === OpIndexMode.IX 
                ? this.ix 
                : this.iy)
            + toSbyte(this.opCode);
        if (!this.useGateArrayContention)
        {
            this.readMemory(this.pc - 1);
        }
        this.tacts++;
        this.opCode = this.readCodeMemory();
        this.tacts += 3;
        this.incPc();
        const opMethod = indexedBitOperations[this.opCode];
        if (opMethod !== null) {
            opMethod(this, this.wz);
        }
    }

    // Gets the value of the current index register
    getIndexReg(): number {
        return this.indexMode === OpIndexMode.IY 
            ? this.iy 
            : this.ix;
    }

    // Sets the value of the current index register
    setIndexReg(value: number) {
        if (this.indexMode === OpIndexMode.IY) {
            this.iy = value;
        } else {
            this.ix = value;
        }
    }
    
    // ========================================================================
    // ALU Helper functions

    // Adds the <paramref name="regHL"/> value and <paramref name="regOther"/> value
    // according to the rule of ADD HL,QQ operation
    aluAddHL(regHL: number, regOther: number): number {
        // --- Keep unaffected flags
        this.f = (this.f & ~(FlagsSetMask.N | FlagsSetMask.C 
            | FlagsSetMask.R5 | FlagsSetMask.R3 | FlagsSetMask.H));

        // --- Calculate Carry from bit 11
        this.f |= (((regHL & 0x0FFF) + (regOther & 0x0FFF)) >> 8) & FlagsSetMask.H;
        let res = ((regHL & 0xFFFF) + (regOther & 0xFFFF)) & 0xFFFFFFFF;

        // --- Calculate Carry
        if ((res & 0x10000) !== 0) {
            this.f |= FlagsSetMask.C;
        }

        // --- Set R5 and R3 according to the low 8-bit of result
        this.f |= ((res >> 8) & 0xFF) & (FlagsSetMask.R5 | FlagsSetMask.R3);
        return res & 0xFFFF;
    }
    
    // Increments the specified value and sets F according to INC ALU logic
    aluIncByte(value: number): number {
        this.f = incOpFlags[value] | this.f & FlagsSetMask.C;
        value++;
        return value;
    }

    // Increments the specified value and sets F according to INC ALU logic
    aluDecByte(val: number): number {
        this.f = decOpFlags[val] | this.f & FlagsSetMask.C;
        val--;
        return val;
    }
}

// ========================================================================
// Processing standard (no prefix) Z80 instructions    

function LdBCNN(cpu: Z80Cpu) {
    // pc+1:3
    cpu.c = cpu.readCodeMemory();
    cpu.tacts += 3;
    
    // pc+2:3
    cpu.incPc();
    cpu.b = cpu.readCodeMemory();
    cpu.incPc();
    cpu.tacts += 3;
}

function LdBCiA(cpu: Z80Cpu) {
    // pc:3
    cpu.writeMemory(cpu.bc, cpu.a);
    cpu.wzh = cpu.a;
    cpu.tacts += 3;
}

function IncBC(cpu: Z80Cpu) {
    cpu.bc++;
    cpu.tacts += 2;
}

function IncB(cpu: Z80Cpu) {
    cpu.f = incOpFlags[cpu.b++] 
        | (cpu.f & FlagsSetMask.C);
}

function DecB(cpu: Z80Cpu) {
    cpu.f = decOpFlags[cpu.b--] 
        | (cpu.f & FlagsSetMask.C);
}

function LdBN(cpu: Z80Cpu) {
    cpu.b = cpu.readCodeMemory();
    cpu.incPc();
    cpu.tacts += 3;
}

function Rlca(cpu: Z80Cpu) {
    let rlcaVal = cpu.a;
    rlcaVal <<= 1;
    let cf = ((rlcaVal & 0x100) !== 0 ? FlagsSetMask.C : 0) & 0xFF;
    if (cf !== 0) {
        rlcaVal = rlcaVal | 0x01;
    }
    cpu.a = rlcaVal;
    cpu.f = cf | (cpu.f & FlagsSetMask.SZPV);
}

function ExAF(cpu: Z80Cpu) {
    cpu.exchangeAfSet();
}

function AddHLBC(cpu: Z80Cpu) {
    cpu.wz = cpu.hl + 1;
    cpu.hl = cpu.aluAddHL(cpu.hl, cpu.bc);
    cpu.tacts += 7;
}

function LdABCi(cpu: Z80Cpu) {
    // bc:3
    cpu.wz = cpu.bc + 1;
    cpu.a = cpu.readMemory(cpu.bc);
    cpu.tacts += 3;
}

function DecBC(cpu: Z80Cpu) {
    cpu.bc--;
    cpu.tacts += 2;
}

function IncC(cpu: Z80Cpu) {
    cpu.f = incOpFlags[cpu.c++] 
        | (cpu.f & FlagsSetMask.C);
}

function DecC(cpu: Z80Cpu) {
    cpu.f = decOpFlags[cpu.c--] 
        | (cpu.f & FlagsSetMask.C);
}

function LdCN(cpu: Z80Cpu) {
    cpu.c = cpu.readCodeMemory();
    cpu.incPc();
    cpu.tacts += 3;
}

function Rrca(cpu: Z80Cpu) {
    let rrcaVal = cpu.a;
    let cf = ((rrcaVal & 0x01) !== 0 ? FlagsSetMask.C : 0) & 0xFF;
    if ((rrcaVal & 0x01) !== 0) {
        rrcaVal = (rrcaVal >> 1) | 0x80;
    }
    else {
        rrcaVal >>= 1;
    }
    cpu.a = rrcaVal;
    cpu.f = cf | (cpu.f & FlagsSetMask.SZPV);
}

function Djnz(cpu: Z80Cpu) {
    cpu.tacts++;
    let e = cpu.readCodeMemory();
    cpu.tacts += 3;
    cpu.incPc();
    if (--cpu.b === 0) {
        return;
    }

    if (cpu.useGateArrayContention) {
        cpu.tacts += 5;
    }
    else {
        cpu.readMemory(cpu.pc);
        cpu.tacts++;
        cpu.readMemory(cpu.pc);
        cpu.tacts++;
        cpu.readMemory(cpu.pc);
        cpu.tacts++;
        cpu.readMemory(cpu.pc);
        cpu.tacts++;
        cpu.readMemory(cpu.pc);
        cpu.tacts++;
    }
    const oldPc = cpu.pc - 2;
    cpu.wz = cpu.pc = cpu.pc + toSbyte(e);

    if (cpu.branchDebugSupport !== undefined) {
        cpu.branchDebugSupport.recordBranchEvent(
            new BranchEvent(oldPc, 
                `djnz #${cpu.pc.toString(16)}`,
                cpu.pc,
                cpu.tacts));
    }
}

function LdDENN(cpu: Z80Cpu) {
    // pc+1:3
    cpu.e = cpu.readCodeMemory();
    cpu.tacts += 3;
    
    // pc+2:3
    cpu.incPc();
    cpu.d = cpu.readCodeMemory();
    cpu.incPc();
    cpu.tacts += 3;
}

function LdDEiA(cpu: Z80Cpu) {
    // de:3
    cpu.writeMemory(cpu.de, cpu.a);
    cpu.wzh = cpu.a;
    cpu.tacts += 3;

}

function IncDE(cpu: Z80Cpu) {
    cpu.de++;
    cpu.tacts += 2;
}

function IncD(cpu: Z80Cpu) {
    cpu.f = incOpFlags[cpu.d++] 
        | (cpu.f & FlagsSetMask.C);
}

function DecD(cpu: Z80Cpu) {
    cpu.f = decOpFlags[cpu.d--] 
        | (cpu.f & FlagsSetMask.C);
}

function LdDN(cpu: Z80Cpu) {
    cpu.d = cpu.readCodeMemory();
    cpu.incPc();
    cpu.tacts += 3;
}

function Rla(cpu: Z80Cpu) {
    let rlaVal = cpu.a;
    let newCF = (rlaVal & 0x80) !== 0 ? FlagsSetMask.C : 0;
    rlaVal <<= 1;
    if (cpu.cFlag) {
        rlaVal |= 0x01;
    }
    cpu.a = rlaVal;
    cpu.f = newCF | (cpu.f & FlagsSetMask.SZPV);
}

function JrE(cpu: Z80Cpu) {
    const oldPc = cpu.pc - 1;
    const e = cpu.readCodeMemory();
    cpu.tacts += 3;
    cpu.incPc();
    cpu.wz = cpu.pc = cpu.pc + toSbyte(e);
    cpu.tacts += 5;

    if (cpu.branchDebugSupport !== undefined) {
        cpu.branchDebugSupport.recordBranchEvent(
            new BranchEvent(oldPc, 
                `jr #${cpu.pc.toString(16)}`,
                cpu.pc,
                cpu.tacts));
            }
}

function AddHLDE(cpu: Z80Cpu) {
    cpu.wz = cpu.hl + 1;
    cpu.hl = cpu.aluAddHL(cpu.hl, cpu.de);
    cpu.tacts += 7;
}

function LdADEi(cpu: Z80Cpu) {
    // bc:3
    cpu.wz = cpu.bc + 1;
    cpu.a = cpu.readMemory(cpu.de);
    cpu.tacts += 3;
}

function DecDE(cpu: Z80Cpu) {
    cpu.de--;
    cpu.tacts += 2;
}

function IncE(cpu: Z80Cpu) {
    cpu.f = incOpFlags[cpu.e++] 
        | (cpu.f & FlagsSetMask.C);
}

function DecE(cpu: Z80Cpu) {
    cpu.f = decOpFlags[cpu.e--] 
        | (cpu.f & FlagsSetMask.C);
}

function LdEN(cpu: Z80Cpu) {
    cpu.e = cpu.readCodeMemory();
    cpu.incPc();
    cpu.tacts += 3;
}

function Rra(cpu: Z80Cpu) {
    let rlcaVal = cpu.a;
    const newCF = (rlcaVal & 0x01) !== 0 ? FlagsSetMask.C : 0;
    rlcaVal >>= 1;
    if (cpu.cFlag) {
        rlcaVal |= 0x80;
    }
    cpu.a = rlcaVal;
    cpu.f = newCF | (cpu.f & FlagsSetMask.SZPV);
}

function JrNZ(cpu: Z80Cpu) {
    const oldPc = cpu.pc - 1;
    const e = cpu.readCodeMemory();
    cpu.tacts += 3;
    cpu.incPc();
    if ((cpu.f & FlagsSetMask.Z) !== 0) {
        return;
    }

    if (cpu.useGateArrayContention) {
        cpu.tacts += 5;
    }
    else {
        cpu.readMemory(cpu.pc);
        cpu.tacts++;
        cpu.readMemory(cpu.pc);
        cpu.tacts++;
        cpu.readMemory(cpu.pc);
        cpu.tacts++;
        cpu.readMemory(cpu.pc);
        cpu.tacts++;
        cpu.readMemory(cpu.pc);
        cpu.tacts++;
    }
    cpu.wz = cpu.pc = cpu.pc + toSbyte(e);

    if (cpu.branchDebugSupport !== undefined) {
        cpu.branchDebugSupport.recordBranchEvent(
            new BranchEvent(oldPc, 
                `jr nz,#${cpu.pc.toString(16)}`,
                cpu.pc,
                cpu.tacts));
            }
}

function LdHLNN(cpu: Z80Cpu) {
    // pc+1:3
    cpu.l = cpu.readCodeMemory();
    cpu.tacts += 3;
    
    // pc+2:3
    cpu.incPc();
    cpu.h = cpu.readCodeMemory();
    cpu.incPc();
    cpu.tacts += 3;
}

function LdNNiHL(cpu: Z80Cpu) {
    // pc+1:3
    const l = cpu.readCodeMemory();
    cpu.tacts += 3;
    cpu.incPc();
    
    // pc+2:3
    const addr = (cpu.readCodeMemory() << 8) | l;
    cpu.tacts += 3;
    cpu.incPc();
    
    // nn:3
    cpu.wz = addr + 1;
    cpu.writeMemory(addr, cpu.l);
    cpu.tacts += 3;

    // nn+1:3
    cpu.writeMemory(cpu.wz, cpu.h);
    cpu.tacts += 3;
}

function IncHL(cpu: Z80Cpu) {
    cpu.hl++;
    cpu.tacts += 2;
}

function IncH(cpu: Z80Cpu) {
    cpu.f = incOpFlags[cpu.h++] 
        | (cpu.f & FlagsSetMask.C);
}

function DecH(cpu: Z80Cpu) {
    cpu.f = decOpFlags[cpu.h--] 
        | (cpu.f & FlagsSetMask.C);
}

function LdHN(cpu: Z80Cpu) {
    cpu.h = cpu.readCodeMemory();
    cpu.incPc();
    cpu.tacts += 3;
}

function Daa(cpu: Z80Cpu) {
    const daaIndex = cpu.a + (((cpu.f & 3) + ((cpu.f >> 2) & 4)) << 8);
    cpu.af = daaResults[daaIndex];
}

function JrZ(cpu: Z80Cpu) {
    const oldPc = cpu.pc - 1;
    const e = cpu.readCodeMemory();
    cpu.tacts += 3;
    cpu.incPc();
    if ((cpu.f & FlagsSetMask.Z) === 0) {
        return;
    }

    if (cpu.useGateArrayContention) {
        cpu.tacts += 5;
    }
    else {
        cpu.readMemory(cpu.pc);
        cpu.tacts++;
        cpu.readMemory(cpu.pc);
        cpu.tacts++;
        cpu.readMemory(cpu.pc);
        cpu.tacts++;
        cpu.readMemory(cpu.pc);
        cpu.tacts++;
        cpu.readMemory(cpu.pc);
        cpu.tacts++;
    }
    cpu.wz = cpu.pc = cpu.pc + toSbyte(e);

    if (cpu.branchDebugSupport !== undefined) {
        cpu.branchDebugSupport.recordBranchEvent(
            new BranchEvent(oldPc, 
                `jr z,#${cpu.pc.toString(16)}`,
                cpu.pc,
                cpu.tacts));
            }
}

function AddHLHL(cpu: Z80Cpu) {
    cpu.wz = cpu.hl + 1;
    cpu.hl = cpu.aluAddHL(cpu.hl, cpu.hl);
    cpu.tacts += 7;
}

function LdHLNNi(cpu: Z80Cpu) {
    // pc+1:3
    let addr = cpu.readCodeMemory();
    cpu.incPc();
    cpu.tacts += 3;

    // pc+2:3
    addr += cpu.readCodeMemory() << 8;
    cpu.incPc();
    cpu.tacts += 3;

    // nn:3
    cpu.wz = addr + 1;
    let val = cpu.readMemory(addr);
    cpu.tacts += 3;

    // nn+1:3
    val += cpu.readMemory(cpu.wz) << 8;
    cpu.tacts += 3;
    cpu.hl = val;
}

function DecHL(cpu: Z80Cpu) {
    cpu.hl--;
    cpu.tacts += 2;
}

function IncL(cpu: Z80Cpu) {
    cpu.f = incOpFlags[cpu.l++] 
        | (cpu.f & FlagsSetMask.C);
}

function DecL(cpu: Z80Cpu) {
    cpu.f = decOpFlags[cpu.l--] 
        | (cpu.f & FlagsSetMask.C);
}

function LdLN(cpu: Z80Cpu) {
    cpu.l = cpu.readCodeMemory();
    cpu.incPc();
    cpu.tacts += 3;
}

function Cpl(cpu: Z80Cpu) {
    cpu.a ^= 0xFF;
    cpu.f = (cpu.f & ~FlagsSetMask.R3R5)
        | FlagsSetMask.NH
        | FlagsSetMask.H
        | (cpu.a & FlagsSetMask.R3R5);
}

function JrNC(cpu: Z80Cpu) {
    const oldPc = cpu.pc - 1;
    const e = cpu.readCodeMemory();
    cpu.tacts += 3;
    cpu.incPc();
    if ((cpu.f & FlagsSetMask.C) !== 0) {
        return;
    }

    if (cpu.useGateArrayContention) {
        cpu.tacts += 5;
    }
    else {
        cpu.readMemory(cpu.pc);
        cpu.tacts++;
        cpu.readMemory(cpu.pc);
        cpu.tacts++;
        cpu.readMemory(cpu.pc);
        cpu.tacts++;
        cpu.readMemory(cpu.pc);
        cpu.tacts++;
        cpu.readMemory(cpu.pc);
        cpu.tacts++;
    }
    cpu.wz = cpu.pc = cpu.pc + toSbyte(e);

    if (cpu.branchDebugSupport !== undefined) {
        cpu.branchDebugSupport.recordBranchEvent(
            new BranchEvent(oldPc, 
                `jr nc,#${cpu.pc.toString(16)}`,
                cpu.pc,
                cpu.tacts));
            }
}

function LdSPNN(cpu: Z80Cpu) {
    // pc+1:3
    const p = cpu.readCodeMemory();
    cpu.tacts += 3;
    
    // pc+2:3
    cpu.incPc();
    const s = cpu.readCodeMemory();
    cpu.incPc();
    cpu.sp = (s << 8) | p;
    cpu.tacts += 3;
}

function LdNNiA(cpu: Z80Cpu) {
    // pc+1:3
    const l = cpu.readCodeMemory();
    cpu.incPc();
    cpu.tacts += 3;
    
    // pc+2:3
    let addr = (cpu.readCodeMemory() << 8) | l;
    cpu.incPc();
    cpu.tacts += 3;
    
    // nn:3
    cpu.wz = ((addr + 1) & 0xFF) + (cpu.a << 8);
    cpu.writeMemory(addr, cpu.a);
    cpu.wzh = cpu.a;
    cpu.tacts += 3;
}

function IncSP(cpu: Z80Cpu) {
    cpu.sp++;
    cpu.tacts += 2;
}

function IncHLi(cpu: Z80Cpu) {
    let memValue = cpu.readMemory(cpu.hl);
    if (cpu.useGateArrayContention) {
        cpu.tacts += 4;
    }
    else {
        cpu.tacts += 3;
        cpu.readMemory(cpu.hl);
        cpu.tacts++;
    }
    memValue = cpu.aluIncByte(memValue);
    cpu.writeMemory(cpu.hl, memValue);
    cpu.tacts += 3;
}

function DecHLi(cpu: Z80Cpu) {
    let memValue = cpu.readMemory(cpu.hl);
    if (cpu.useGateArrayContention) {
        cpu.tacts += 4;
    }
    else {
        cpu.tacts += 3;
        cpu.readMemory(cpu.hl);
        cpu.tacts++;
    }
    memValue = cpu.aluDecByte(memValue);
    cpu.writeMemory(cpu.hl, memValue);
    cpu.tacts += 3;
}

function LdHLiN(cpu: Z80Cpu) {
    // pc+1: 3
    const val = cpu.readCodeMemory();
    cpu.tacts += 3;
    cpu.incPc();
    cpu.writeMemory(cpu.hl, val);
    cpu.tacts += 3;
}

function Scf(cpu: Z80Cpu) {
    cpu.f = ((cpu.f & (FlagsSetMask.SZPV))
        | (cpu.a & (FlagsSetMask.R5 | FlagsSetMask.R3))
        | FlagsSetMask.C);
}

function JrC(cpu: Z80Cpu) {
    const oldPc = cpu.pc - 1;
    const e = cpu.readCodeMemory();
    cpu.tacts += 3;
    cpu.incPc();
    if ((cpu.f & FlagsSetMask.C) === 0) {
        return;
    }

    if (cpu.useGateArrayContention) {
        cpu.tacts += 5;
    }
    else {
        cpu.readMemory(cpu.pc);
        cpu.tacts++;
        cpu.readMemory(cpu.pc);
        cpu.tacts++;
        cpu.readMemory(cpu.pc);
        cpu.tacts++;
        cpu.readMemory(cpu.pc);
        cpu.tacts++;
        cpu.readMemory(cpu.pc);
        cpu.tacts++;
    }
    cpu.wz = cpu.pc = cpu.pc + toSbyte(e);

    if (cpu.branchDebugSupport !== undefined) {
        cpu.branchDebugSupport.recordBranchEvent(
            new BranchEvent(oldPc, 
                `jr c,#${cpu.pc.toString(16)}`,
                cpu.pc,
                cpu.tacts));
            }
}

function AddHLSP(cpu: Z80Cpu) {
    cpu.wz = cpu.hl + 1;
    cpu.hl = cpu.aluAddHL(cpu.hl, cpu.sp);
    cpu.tacts += 7;
}

function LdANNi(cpu: Z80Cpu) {
    let addr = cpu.readCodeMemory();
    cpu.tacts += 3;
    cpu.incPc();
    addr += cpu.readCodeMemory() * 0x100;
    cpu.tacts += 3;
    cpu.incPc();
    cpu.wz = addr + 1;
    cpu.a = cpu.readMemory(addr);
    cpu.tacts += 3;
}

function DecSP(cpu: Z80Cpu) {
    cpu.sp--;
    cpu.tacts += 2;
}

function IncA(cpu: Z80Cpu) {
    cpu.f = incOpFlags[cpu.a++] 
        | (cpu.f & FlagsSetMask.C);
}

function DecA(cpu: Z80Cpu) {
    cpu.f = decOpFlags[cpu.a--] 
        | (cpu.f & FlagsSetMask.C);
}

function LdAN(cpu: Z80Cpu) {
    cpu.a = cpu.readCodeMemory();
    cpu.incPc();
    cpu.tacts += 3;
}

function Ccf(cpu: Z80Cpu) {
    cpu.f = (cpu.f & (FlagsSetMask.SZPV))
    | (cpu.a & (FlagsSetMask.R5 | FlagsSetMask.R3))
    | ((cpu.f & FlagsSetMask.C) !== 0 ? FlagsSetMask.H : FlagsSetMask.C);
}

function LdB_C(cpu: Z80Cpu) {
    cpu.b = cpu.c;
}

function LdB_D(cpu: Z80Cpu) {
    cpu.b = cpu.d;
}

function LdB_E(cpu: Z80Cpu) {
    cpu.b = cpu.e;
}

function LdB_H(cpu: Z80Cpu) {
    cpu.b = cpu.h;
}

function LdB_L(cpu: Z80Cpu) {
    cpu.b = cpu.l;
}

function LdB_HLi(cpu: Z80Cpu) {
    cpu.b = cpu.readMemory(cpu.hl);
    cpu.tacts += 3;
}

function LdB_A(cpu: Z80Cpu) {
    cpu.b = cpu.a;
}

function LdC_B(cpu: Z80Cpu) {
    cpu.c = cpu.b;
}

function LdC_D(cpu: Z80Cpu) {
    cpu.c = cpu.d;
}

function LdC_E(cpu: Z80Cpu) {
    cpu.c = cpu.e;
}

function LdC_H(cpu: Z80Cpu) {
    cpu.c = cpu.h;
}

function LdC_L(cpu: Z80Cpu) {
    cpu.c = cpu.l;
}

function LdC_HLi(cpu: Z80Cpu) {
    cpu.c = cpu.readMemory(cpu.hl);
    cpu.tacts += 3;
}

function LdC_A(cpu: Z80Cpu) {
    cpu.c = cpu.a;
}

function LdD_B(cpu: Z80Cpu) {
    cpu.d = cpu.b;
}

function LdD_C(cpu: Z80Cpu) {
    cpu.d = cpu.c;
}

function LdD_E(cpu: Z80Cpu) {
    cpu.d = cpu.e;
}

function LdD_H(cpu: Z80Cpu) {
    cpu.d = cpu.h;
}

function LdD_L(cpu: Z80Cpu) {
    cpu.d = cpu.l;
}

function LdD_HLi(cpu: Z80Cpu) {
    cpu.d = cpu.readMemory(cpu.hl);
    cpu.tacts += 3;
}

function LdD_A(cpu: Z80Cpu) {
    cpu.d = cpu.a;
}

function LdE_B(cpu: Z80Cpu) {
    cpu.e = cpu.b;
}

function LdE_C(cpu: Z80Cpu) {
    cpu.e = cpu.c;
}

function LdE_D(cpu: Z80Cpu) {
    cpu.e = cpu.d;
}

function LdE_H(cpu: Z80Cpu) {
    cpu.e = cpu.h;
}

function LdE_L(cpu: Z80Cpu) {
    cpu.e = cpu.l;
}

function LdE_HLi(cpu: Z80Cpu) {
    cpu.e = cpu.readMemory(cpu.hl);
    cpu.tacts += 3;
}

function LdE_A(cpu: Z80Cpu) {
    cpu.e = cpu.a;
}

function LdH_B(cpu: Z80Cpu) {
    cpu.h = cpu.b;
}

function LdH_C(cpu: Z80Cpu) {
    cpu.h = cpu.c;
}

function LdH_D(cpu: Z80Cpu) {
    cpu.h = cpu.d;
}

function LdH_E(cpu: Z80Cpu) {
    cpu.h = cpu.e;
}

function LdH_L(cpu: Z80Cpu) {
    cpu.h = cpu.l;
}

function LdH_HLi(cpu: Z80Cpu) {
    cpu.h = cpu.readMemory(cpu.hl);
    cpu.tacts += 3;
}

function LdH_A(cpu: Z80Cpu) {
    cpu.h = cpu.a;
}

function LdL_B(cpu: Z80Cpu) {
    cpu.l = cpu.b;
}

function LdL_C(cpu: Z80Cpu) {
    cpu.l = cpu.c;
}

function LdL_D(cpu: Z80Cpu) {
    cpu.l = cpu.d;
}

function LdL_E(cpu: Z80Cpu) {
    cpu.l = cpu.e;
}

function LdL_H(cpu: Z80Cpu) {
    cpu.l = cpu.h;
}

function LdL_HLi(cpu: Z80Cpu) {
    cpu.l = cpu.readMemory(cpu.hl);
    cpu.tacts += 3;
}

function LdL_A(cpu: Z80Cpu) {
    cpu.l = cpu.a;
}

function LdHLi_B(cpu: Z80Cpu) {
    cpu.writeMemory(cpu.hl, cpu.b);
    cpu.tacts += 3;
}

function LdHLi_C(cpu: Z80Cpu) {
    cpu.writeMemory(cpu.hl, cpu.c);
    cpu.tacts += 3;
}

function LdHLi_D(cpu: Z80Cpu) {
    cpu.writeMemory(cpu.hl, cpu.d);
    cpu.tacts += 3;
}

function LdHLi_E(cpu: Z80Cpu) {
    cpu.writeMemory(cpu.hl, cpu.e);
    cpu.tacts += 3;
}

function LdHLi_H(cpu: Z80Cpu) {
    cpu.writeMemory(cpu.hl, cpu.h);
    cpu.tacts += 3;
}

function LdHLi_L(cpu: Z80Cpu) {
    cpu.writeMemory(cpu.hl, cpu.l);
    cpu.tacts += 3;
}

function Halt(cpu: Z80Cpu) {
    cpu.stateFlags |= Z80StateFlags.Halted;
    cpu.pc--;
}

function LdHLi_A(cpu: Z80Cpu) {
    cpu.writeMemory(cpu.hl, cpu.a);
    cpu.tacts += 3;
}

function LdA_B(cpu: Z80Cpu) {
    cpu.a = cpu.b;
}

function LdA_C(cpu: Z80Cpu) {
    cpu.a = cpu.c;
}

function LdA_D(cpu: Z80Cpu) {
    cpu.a = cpu.d;
}

function LdA_E(cpu: Z80Cpu) {
    cpu.a = cpu.e;
}

function LdA_H(cpu: Z80Cpu) {
    cpu.a = cpu.h;
}

function LdA_L(cpu: Z80Cpu) {
    cpu.a = cpu.l;
}

function LdA_HLi(cpu: Z80Cpu) {
    cpu.a = cpu.readMemory(cpu.hl);
    cpu.tacts += 3;
}

function AddA_B(cpu: Z80Cpu) {
    const src = cpu.b;
    cpu.f = adcFlags[cpu.a * 0x100 + src];
    cpu.a += src;
}

function AddA_C(cpu: Z80Cpu) {
    const src = cpu.c;
    cpu.f = adcFlags[cpu.a * 0x100 + src];
    cpu.a += src;
}

function AddA_D(cpu: Z80Cpu) {
    const src = cpu.d;
    cpu.f = adcFlags[cpu.a * 0x100 + src];
    cpu.a += src;
}

function AddA_E(cpu: Z80Cpu) {
    const src = cpu.e;
    cpu.f = adcFlags[cpu.a * 0x100 + src];
    cpu.a += src;
}

function AddA_H(cpu: Z80Cpu) {
    const src = cpu.h;
    cpu.f = adcFlags[cpu.a * 0x100 + src];
    cpu.a += src;
}

function AddA_L(cpu: Z80Cpu) {
    const src = cpu.l;
    cpu.f = adcFlags[cpu.a * 0x100 + src];
    cpu.a += src;
}

function AddA_HLi(cpu: Z80Cpu) {
    const src = cpu.readMemory(cpu.hl);
    cpu.tacts += 3;
    cpu.f = adcFlags[cpu.a * 0x100 + src];
    cpu.a += src;
}

function AddA_A(cpu: Z80Cpu) {
    const src = cpu.a;
    cpu.f = adcFlags[cpu.a * 0x100 + src];
    cpu.a += src;
}

function AdcA_B(cpu: Z80Cpu) {
    const src = cpu.b;
    const carry = (cpu.f & FlagsSetMask.C) === 0 ? 0 : 1;
    cpu.f = adcFlags[carry * 0x10000 + cpu.a * 0x100 + src];
    cpu.a += src + carry;
}

function AdcA_C(cpu: Z80Cpu) {
    const src = cpu.c;
    const carry = (cpu.f & FlagsSetMask.C) === 0 ? 0 : 1;
    cpu.f = adcFlags[carry * 0x10000 + cpu.a * 0x100 + src];
    cpu.a += src + carry;
}

function AdcA_D(cpu: Z80Cpu) {
    const src = cpu.d;
    const carry = (cpu.f & FlagsSetMask.C) === 0 ? 0 : 1;
    cpu.f = adcFlags[carry * 0x10000 + cpu.a * 0x100 + src];
    cpu.a += src + carry;
}

function AdcA_E(cpu: Z80Cpu) {
    const src = cpu.e;
    const carry = (cpu.f & FlagsSetMask.C) === 0 ? 0 : 1;
    cpu.f = adcFlags[carry * 0x10000 + cpu.a * 0x100 + src];
    cpu.a += src + carry;
}

function AdcA_H(cpu: Z80Cpu) {
    const src = cpu.h;
    const carry = (cpu.f & FlagsSetMask.C) === 0 ? 0 : 1;
    cpu.f = adcFlags[carry * 0x10000 + cpu.a * 0x100 + src];
    cpu.a += src + carry;
}

function AdcA_L(cpu: Z80Cpu) {
    const src = cpu.l;
    const carry = (cpu.f & FlagsSetMask.C) === 0 ? 0 : 1;
    cpu.f = adcFlags[carry * 0x10000 + cpu.a * 0x100 + src];
    cpu.a += src + carry;
}

function AdcA_HLi(cpu: Z80Cpu) {
    const src = cpu.readMemory(cpu.hl);
    cpu.tacts += 3;
    const carry = (cpu.f & FlagsSetMask.C) === 0 ? 0 : 1;
    cpu.f = adcFlags[carry * 0x10000 + cpu.a * 0x100 + src];
    cpu.a += src + carry;
}

function AdcA_A(cpu: Z80Cpu) {
    const src = cpu.a;
    const carry = (cpu.f & FlagsSetMask.C) === 0 ? 0 : 1;
    cpu.f = adcFlags[carry * 0x10000 + cpu.a * 0x100 + src];
    cpu.a += src + carry;
}

function SubB(cpu: Z80Cpu) {
    const src = cpu.b;
    cpu.f = sbcFlags[cpu.a * 0x100 + src];
    cpu.a -= src;
}

function SubC(cpu: Z80Cpu) {
    const src = cpu.c;
    cpu.f = sbcFlags[cpu.a * 0x100 + src];
    cpu.a -= src;
}

function SubD(cpu: Z80Cpu) {
    const src = cpu.d;
    cpu.f = sbcFlags[cpu.a * 0x100 + src];
    cpu.a -= src;
}

function SubE(cpu: Z80Cpu) {
    const src = cpu.e;
    cpu.f = sbcFlags[cpu.a * 0x100 + src];
    cpu.a -= src;
}

function SubH(cpu: Z80Cpu) {
    const src = cpu.h;
    cpu.f = sbcFlags[cpu.a * 0x100 + src];
    cpu.a -= src;
}

function SubL(cpu: Z80Cpu) {
    const src = cpu.l;
    cpu.f = sbcFlags[cpu.a * 0x100 + src];
    cpu.a -= src;
}

function SubHLi(cpu: Z80Cpu) {
    const src = cpu.readMemory(cpu.hl);
    cpu.tacts += 3;
    cpu.f = sbcFlags[cpu.a * 0x100 + src];
    cpu.a -= src;
}

function SubA(cpu: Z80Cpu) {
    const src = cpu.a;
    cpu.f = sbcFlags[cpu.a * 0x100 + src];
    cpu.a -= src;
}

function SbcB(cpu: Z80Cpu) {
    const src = cpu.b;
    const carry = (cpu.f & FlagsSetMask.C) === 0 ? 0 : 1;
    cpu.f = sbcFlags[carry * 0x10000 + cpu.a * 0x100 + src];
    cpu.a -= src + carry;
}

function SbcC(cpu: Z80Cpu) {
    const src = cpu.c;
    const carry = (cpu.f & FlagsSetMask.C) === 0 ? 0 : 1;
    cpu.f = sbcFlags[carry * 0x10000 + cpu.a * 0x100 + src];
    cpu.a -= src + carry;
}

function SbcD(cpu: Z80Cpu) {
    const src = cpu.d;
    const carry = (cpu.f & FlagsSetMask.C) === 0 ? 0 : 1;
    cpu.f = sbcFlags[carry * 0x10000 + cpu.a * 0x100 + src];
    cpu.a -= src + carry;
}

function SbcE(cpu: Z80Cpu) {
    const src = cpu.e;
    const carry = (cpu.f & FlagsSetMask.C) === 0 ? 0 : 1;
    cpu.f = sbcFlags[carry * 0x10000 + cpu.a * 0x100 + src];
    cpu.a -= src + carry;
}

function SbcH(cpu: Z80Cpu) {
    const src = cpu.h;
    const carry = (cpu.f & FlagsSetMask.C) === 0 ? 0 : 1;
    cpu.f = sbcFlags[carry * 0x10000 + cpu.a * 0x100 + src];
    cpu.a -= src + carry;
}

function SbcL(cpu: Z80Cpu) {
    const src = cpu.l;
    const carry = (cpu.f & FlagsSetMask.C) === 0 ? 0 : 1;
    cpu.f = sbcFlags[carry * 0x10000 + cpu.a * 0x100 + src];
    cpu.a -= src + carry;
}

function SbcHLi(cpu: Z80Cpu) {
    const src = cpu.readMemory(cpu.hl);
    cpu.tacts += 3;
    const carry = (cpu.f & FlagsSetMask.C) === 0 ? 0 : 1;
    cpu.f = sbcFlags[carry * 0x10000 + cpu.a * 0x100 + src];
    cpu.a -= src + carry;
}

function SbcA(cpu: Z80Cpu) {
    const src = cpu.a;
    const carry = (cpu.f & FlagsSetMask.C) === 0 ? 0 : 1;
    cpu.f = sbcFlags[carry * 0x10000 + cpu.a * 0x100 + src];
    cpu.a -= src + carry;
}

function AndB(cpu: Z80Cpu) {
    const src = cpu.b;
    cpu.a &= src;
    cpu.f = aluLogOpFlags[cpu.a] | FlagsSetMask.H;
}

function AndC(cpu: Z80Cpu) {
    const src = cpu.c;
    cpu.a &= src;
    cpu.f = aluLogOpFlags[cpu.a] | FlagsSetMask.H;
}

function AndD(cpu: Z80Cpu) {
    const src = cpu.d;
    cpu.a &= src;
    cpu.f = aluLogOpFlags[cpu.a] | FlagsSetMask.H;
}

function AndE(cpu: Z80Cpu) {
    const src = cpu.e;
    cpu.a &= src;
    cpu.f = aluLogOpFlags[cpu.a] | FlagsSetMask.H;
}

function AndH(cpu: Z80Cpu) {
    const src = cpu.h;
    cpu.a &= src;
    cpu.f = aluLogOpFlags[cpu.a] | FlagsSetMask.H;
}

function AndL(cpu: Z80Cpu) {
    const src = cpu.l;
    cpu.a &= src;
    cpu.f = aluLogOpFlags[cpu.a] | FlagsSetMask.H;
}

function AndHLi(cpu: Z80Cpu) {
    const src = cpu.readMemory(cpu.hl);
    cpu.tacts += 3;
    cpu.a &= src;
    cpu.f = aluLogOpFlags[cpu.a] | FlagsSetMask.H;
}

function AndA(cpu: Z80Cpu) {
    const src = cpu.a;
    cpu.a &= src;
    cpu.f = aluLogOpFlags[cpu.a] | FlagsSetMask.H;
}

function XorB(cpu: Z80Cpu) {
    const src = cpu.b;
    cpu.a ^= src;
    cpu.f = aluLogOpFlags[cpu.a];
}

function XorC(cpu: Z80Cpu) {
    const src = cpu.c;
    cpu.a ^= src;
    cpu.f = aluLogOpFlags[cpu.a];
}

function XorD(cpu: Z80Cpu) {
    const src = cpu.d;
    cpu.a ^= src;
    cpu.f = aluLogOpFlags[cpu.a];
}

function XorE(cpu: Z80Cpu) {
    const src = cpu.e;
    cpu.a ^= src;
    cpu.f = aluLogOpFlags[cpu.a];
}

function XorH(cpu: Z80Cpu) {
    const src = cpu.h;
    cpu.a ^= src;
    cpu.f = aluLogOpFlags[cpu.a];
}

function XorL(cpu: Z80Cpu) {
    const src = cpu.l;
    cpu.a ^= src;
    cpu.f = aluLogOpFlags[cpu.a];
}

function XorHLi(cpu: Z80Cpu) {
    const src = cpu.readMemory(cpu.hl);
    cpu.tacts += 3;
    cpu.a ^= src;
    cpu.f = aluLogOpFlags[cpu.a];
}

function XorA(cpu: Z80Cpu) {
    const src = cpu.a;
    cpu.a ^= src;
    cpu.f = aluLogOpFlags[cpu.a];
}

function OrB(cpu: Z80Cpu) {
    const src = cpu.b;
    cpu.a |= src;
    cpu.f = aluLogOpFlags[cpu.a];
}

function OrC(cpu: Z80Cpu) {
    const src = cpu.c;
    cpu.a |= src;
    cpu.f = aluLogOpFlags[cpu.a];
}

function OrD(cpu: Z80Cpu) {
    const src = cpu.d;
    cpu.a |= src;
    cpu.f = aluLogOpFlags[cpu.a];
}

function OrE(cpu: Z80Cpu) {
    const src = cpu.e;
    cpu.a |= src;
    cpu.f = aluLogOpFlags[cpu.a];
}

function OrH(cpu: Z80Cpu) {
    const src = cpu.h;
    cpu.a |= src;
    cpu.f = aluLogOpFlags[cpu.a];
}

function OrL(cpu: Z80Cpu) {
    const src = cpu.l;
    cpu.a |= src;
    cpu.f = aluLogOpFlags[cpu.a];
}

function OrHLi(cpu: Z80Cpu) {
    const src = cpu.readMemory(cpu.hl);
    cpu.tacts += 3;
    cpu.a |= src;
    cpu.f = aluLogOpFlags[cpu.a];
}

function OrA(cpu: Z80Cpu) {
    const src = cpu.a;
    cpu.a |= src;
    cpu.f = aluLogOpFlags[cpu.a];
}

function CpB(cpu: Z80Cpu) {
    const src = cpu.b;
    const res = cpu.a * 0x100 + src;
    cpu.f = (sbcFlags[res] & FlagsResetMask.R3 & FlagsResetMask.R5)
        | (res & FlagsSetMask.R3R5);
}

function CpC(cpu: Z80Cpu) {
    const src = cpu.c;
    const res = cpu.a * 0x100 + src;
    cpu.f = (sbcFlags[res] & FlagsResetMask.R3 & FlagsResetMask.R5)
        | (res & FlagsSetMask.R3R5);
}

function CpD(cpu: Z80Cpu) {
    const src = cpu.d;
    const res = cpu.a * 0x100 + src;
    cpu.f = (sbcFlags[res] & FlagsResetMask.R3 & FlagsResetMask.R5)
        | (res & FlagsSetMask.R3R5);
}

function CpE(cpu: Z80Cpu) {
    const src = cpu.e;
    const res = cpu.a * 0x100 + src;
    cpu.f = (sbcFlags[res] & FlagsResetMask.R3 & FlagsResetMask.R5)
        | (res & FlagsSetMask.R3R5);
}

function CpH(cpu: Z80Cpu) {
    const src = cpu.h;
    const res = cpu.a * 0x100 + src;
    cpu.f = (sbcFlags[res] & FlagsResetMask.R3 & FlagsResetMask.R5)
        | (res & FlagsSetMask.R3R5);
}

function CpL(cpu: Z80Cpu) {
    const src = cpu.l;
    const res = cpu.a * 0x100 + src;
    cpu.f = (sbcFlags[res] & FlagsResetMask.R3 & FlagsResetMask.R5)
        | (res & FlagsSetMask.R3R5);
}

function CpHLi(cpu: Z80Cpu) {
    const src = cpu.readMemory(cpu.hl);
    cpu.tacts += 3;
    const res = cpu.a * 0x100 + src;
    cpu.f = (sbcFlags[res] & FlagsResetMask.R3 & FlagsResetMask.R5)
        | (res & FlagsSetMask.R3R5);
}

function CpA(cpu: Z80Cpu) {
    const src = cpu.a;
    const res = cpu.a * 0x100 + src;
    cpu.f = (sbcFlags[res] & FlagsResetMask.R3 & FlagsResetMask.R5)
        | (res & FlagsSetMask.R3R5);
}

function RetNZ(cpu: Z80Cpu) {
    const oldSp = cpu.sp;

    cpu.tacts++;
    if ((cpu.f & FlagsSetMask.Z) !== 0) {
        return;
    }
    var oldPc = cpu.pc - 1;
    cpu.wz = cpu.readMemory(cpu.sp);
    cpu.tacts += 3;
    cpu.sp++;
    cpu.wz += cpu.readMemory(cpu.sp) * 0x100;
    cpu.tacts += 3;
    cpu.sp++;
    cpu.pc = cpu.wz;

    if (cpu.branchDebugSupport !== undefined) {
        cpu.branchDebugSupport.recordBranchEvent(
            new BranchEvent(oldPc, 
                'ret nz',
                cpu.pc,
                cpu.tacts));
            }
}

function PopBC(cpu: Z80Cpu) {
    const oldSp = cpu.sp;
    const val = cpu.readMemory(cpu.sp);
    cpu.tacts += 3;
    cpu.sp++;
    cpu.bc = (cpu.readMemory(cpu.sp) << 8) | val;
    cpu.tacts += 3;
    cpu.sp++;

    if (cpu.stackDebugSupport !== undefined) {
    cpu.stackDebugSupport.recordStackContentManipulationEvent(
        new StackContentManipulationEvent(cpu.pc - 1,
            'pop bc',
            oldSp,
            cpu.bc,
            cpu.tacts));
    }
}

function JpNZ_NN(cpu: Z80Cpu) {
    const oldPc = cpu.pc - 1;

    cpu.wz = cpu.readCodeMemory();
    cpu.tacts += 3;
    cpu.incPc();
    cpu.wz += cpu.readCodeMemory() << 8;
    cpu.tacts += 3;
    cpu.incPc();
    if ((cpu.f & FlagsSetMask.Z) !== 0) {
        return;
    }
    cpu.pc = cpu.wz;

    if (cpu.branchDebugSupport !== undefined) {
        cpu.branchDebugSupport.recordBranchEvent(
            new BranchEvent(oldPc, 
                `jp nz,#${cpu.pc}`,
                cpu.pc,
                cpu.tacts));
    }
}

function JpNN(cpu: Z80Cpu) {
    const oldPc = cpu.pc - 1;

    cpu.wz = cpu.readCodeMemory();
    cpu.tacts += 3;
    cpu.incPc();
    cpu.wz += cpu.readCodeMemory() << 8;
    cpu.tacts += 3;
    cpu.incPc();
    cpu.pc = cpu.wz;

    if (cpu.branchDebugSupport !== undefined) {
        cpu.branchDebugSupport.recordBranchEvent(
            new BranchEvent(oldPc, 
                `jp #${cpu.pc}`,
                cpu.pc,
                cpu.tacts));
    }
}

function CallNZ(cpu: Z80Cpu) {
    cpu.wz = cpu.readCodeMemory();
    cpu.tacts += 3;
    cpu.incPc();
    cpu.wz += cpu.readCodeMemory() << 8;
    cpu.tacts += 3;
    cpu.incPc();
    if ((cpu.f & FlagsSetMask.Z) !== 0) {
        return;
    }
    const oldPc = cpu.pc;
    if (!cpu.useGateArrayContention)
    {
        cpu.readMemory(cpu.pc);
    }
    cpu.tacts++;

    cpu.sp--;
    cpu.writeMemory(cpu.sp, cpu.pc >> 8);
    cpu.tacts += 3;
    cpu.sp--;
    cpu.writeMemory(cpu.sp, cpu.pc);
    cpu.tacts += 3;
    cpu.pc = cpu.wz;

    if (cpu.stackDebugSupport !== undefined) {
        cpu.stackDebugSupport.recordStackContentManipulationEvent(
            new StackContentManipulationEvent(cpu.pc - 1,
                `call nz,#${cpu.pc}`,
                cpu.sp,
                oldPc,
                cpu.tacts));
    }
}

function PushBC(cpu: Z80Cpu) {
    const val = cpu.bc;
    cpu.sp--;
    cpu.tacts++;
    cpu.writeMemory(cpu.sp, val >> 8);
    cpu.tacts += 3;
    cpu.sp--;
    cpu.writeMemory(cpu.sp, val & 0xFF);
    cpu.tacts += 3;

    if (cpu.stackDebugSupport !== undefined) {
        cpu.stackDebugSupport.recordStackContentManipulationEvent(
            new StackContentManipulationEvent(cpu.pc - 1,
                'push bc',
                cpu.sp,
                val,
                cpu.tacts));
    }
}

function AluAN(cpu: Z80Cpu) {
    const val = cpu.readCodeMemory();
    cpu.tacts += 3;
    cpu.incPc();
    aluAlgorithms[(cpu.opCode & 0x38) >> 3](cpu, val, cpu.cFlag);
}

function Rst00(cpu: Z80Cpu) {
    const oldPc = cpu.pc;

    cpu.sp--;
    cpu.tacts++;

    cpu.writeMemory(cpu.sp, cpu.pc >> 8);
    cpu.tacts += 3;
    cpu.sp--;
    cpu.writeMemory(cpu.sp, cpu.pc);
    cpu.tacts += 3;

    cpu.wz = 0x0000;
    cpu.pc = cpu.wz;

    if (cpu.stackDebugSupport !== undefined) {
        cpu.stackDebugSupport.recordStackContentManipulationEvent(
            new StackContentManipulationEvent(oldPc - 1,
                'rst #00',
                cpu.sp,
                oldPc,
                cpu.tacts));
    }
}

function RetZ(cpu: Z80Cpu) {
    const oldSp = cpu.sp;

    cpu.tacts++;
    if ((cpu.f & FlagsSetMask.Z) === 0) {
        return;
    }
    var oldPc = cpu.pc - 1;
    cpu.wz = cpu.readMemory(cpu.sp);
    cpu.tacts += 3;
    cpu.sp++;
    cpu.wz += cpu.readMemory(cpu.sp) * 0x100;
    cpu.tacts += 3;
    cpu.sp++;
    cpu.pc = cpu.wz;

    if (cpu.branchDebugSupport !== undefined) {
        cpu.branchDebugSupport.recordBranchEvent(
            new BranchEvent(oldPc, 
                'ret z',
                cpu.pc,
                cpu.tacts));
            }
}

function Ret(cpu: Z80Cpu) {
    const oldSp = cpu.sp;
    const oldPc = cpu.pc - 1;

    cpu.wz = cpu.readMemory(cpu.sp);
    cpu.tacts += 3;
    cpu.sp++;
    cpu.wz += cpu.readMemory(cpu.sp) * 0x100;
    cpu.tacts += 3;
    cpu.sp++;
    cpu.pc = cpu.wz;

    if (cpu.branchDebugSupport !== undefined) {
        cpu.branchDebugSupport.recordBranchEvent(
            new BranchEvent(oldPc, 
                'ret',
                cpu.pc,
                cpu.tacts));
    }
}

function JpZ_NN(cpu: Z80Cpu) {
    const oldPc = cpu.pc - 1;

    cpu.wz = cpu.readCodeMemory();
    cpu.tacts += 3;
    cpu.incPc();
    cpu.wz += cpu.readCodeMemory() << 8;
    cpu.tacts += 3;
    cpu.incPc();
    if ((cpu.f & FlagsSetMask.Z) === 0) {
        return;
    }
    cpu.pc = cpu.wz;

    if (cpu.branchDebugSupport !== undefined) {
        cpu.branchDebugSupport.recordBranchEvent(
            new BranchEvent(oldPc, 
                `jp z,#${cpu.pc}`,
                cpu.pc,
                cpu.tacts));
    }
}

function CallZ(cpu: Z80Cpu) {
    cpu.wz = cpu.readCodeMemory();
    cpu.tacts += 3;
    cpu.incPc();
    cpu.wz += cpu.readCodeMemory() << 8;
    cpu.tacts += 3;
    cpu.incPc();
    if ((cpu.f & FlagsSetMask.Z) === 0) {
        return;
    }
    const oldPc = cpu.pc;
    if (!cpu.useGateArrayContention)
    {
        cpu.readMemory(cpu.pc);
    }
    cpu.tacts++;

    cpu.sp--;
    cpu.writeMemory(cpu.sp, cpu.pc >> 8);
    cpu.tacts += 3;
    cpu.sp--;
    cpu.writeMemory(cpu.sp, cpu.pc);
    cpu.tacts += 3;
    cpu.pc = cpu.wz;

    if (cpu.stackDebugSupport !== undefined) {
        cpu.stackDebugSupport.recordStackContentManipulationEvent(
            new StackContentManipulationEvent(cpu.pc - 1,
                `call z,#${cpu.pc}`,
                cpu.sp,
                oldPc,
                cpu.tacts));
    }
}

function CallNN(cpu: Z80Cpu) {
    cpu.wz = cpu.readCodeMemory();
    cpu.tacts += 3;
    cpu.incPc();
    cpu.wz += cpu.readCodeMemory() << 8;
    cpu.tacts += 3;
    cpu.incPc();
    if (!cpu.useGateArrayContention)
    {
        cpu.readMemory(cpu.pc);
    }
    cpu.tacts++;

    const oldPc = cpu.pc;
    cpu.sp--;
    cpu.writeMemory(cpu.sp, cpu.pc >> 8);
    cpu.tacts += 3;
    cpu.sp--;
    cpu.writeMemory(cpu.sp, cpu.pc & 0xFF);
    cpu.tacts += 3;
    cpu.pc = cpu.wz;

    if (cpu.branchDebugSupport !== undefined) {
        cpu.branchDebugSupport.recordBranchEvent(
            new BranchEvent(oldPc, 
                `call #${cpu.pc}`,
                cpu.pc,
                cpu.tacts));
    }
}

function Rst08(cpu: Z80Cpu) {
    const oldPc = cpu.pc;

    cpu.sp--;
    cpu.tacts++;

    cpu.writeMemory(cpu.sp, cpu.pc >> 8);
    cpu.tacts += 3;
    cpu.sp--;
    cpu.writeMemory(cpu.sp, cpu.pc);
    cpu.tacts += 3;

    cpu.wz = 0x0008;
    cpu.pc = cpu.wz;

    if (cpu.stackDebugSupport !== undefined) {
        cpu.stackDebugSupport.recordStackContentManipulationEvent(
            new StackContentManipulationEvent(oldPc - 1,
                'rst #08',
                cpu.sp,
                oldPc,
                cpu.tacts));
    }
}

function RetNC(cpu: Z80Cpu) {
    const oldSp = cpu.sp;

    cpu.tacts++;
    if ((cpu.f & FlagsSetMask.C) !== 0) {
        return;
    }
    var oldPc = cpu.pc - 1;
    cpu.wz = cpu.readMemory(cpu.sp);
    cpu.tacts += 3;
    cpu.sp++;
    cpu.wz += cpu.readMemory(cpu.sp) * 0x100;
    cpu.tacts += 3;
    cpu.sp++;
    cpu.pc = cpu.wz;

    if (cpu.branchDebugSupport !== undefined) {
        cpu.branchDebugSupport.recordBranchEvent(
            new BranchEvent(oldPc, 
                'ret nc',
                cpu.pc,
                cpu.tacts));
            }
}

function PopDE(cpu: Z80Cpu) {
    const oldSp = cpu.sp;
    const val = cpu.readMemory(cpu.sp);
    cpu.tacts += 3;
    cpu.sp++;
    cpu.de = (cpu.readMemory(cpu.sp) << 8) | val;
    cpu.tacts += 3;
    cpu.sp++;

    if (cpu.stackDebugSupport !== undefined) {
    cpu.stackDebugSupport.recordStackContentManipulationEvent(
        new StackContentManipulationEvent(cpu.pc - 1,
            'pop de',
            oldSp,
            cpu.bc,
            cpu.tacts));
    }
}

function JpNC_NN(cpu: Z80Cpu) {
    const oldPc = cpu.pc - 1;

    cpu.wz = cpu.readCodeMemory();
    cpu.tacts += 3;
    cpu.incPc();
    cpu.wz += cpu.readCodeMemory() << 8;
    cpu.tacts += 3;
    cpu.incPc();
    if ((cpu.f & FlagsSetMask.C) !== 0) {
        return;
    }
    cpu.pc = cpu.wz;

    if (cpu.branchDebugSupport !== undefined) {
        cpu.branchDebugSupport.recordBranchEvent(
            new BranchEvent(oldPc, 
                `jp nc,#${cpu.pc}`,
                cpu.pc,
                cpu.tacts));
    }
}

function OutNA(cpu: Z80Cpu) {
    // pc+1:3
    let port = cpu.readCodeMemory();
    cpu.incPc();
    cpu.tacts += 3;

    // I/O
    cpu.wz = ((port + 1) & 0xFF) + (cpu.a << 8);
    port += cpu.a << 8;
    cpu.writePort(port, cpu.a);
}

function CallNC(cpu: Z80Cpu) {
    cpu.wz = cpu.readCodeMemory();
    cpu.tacts += 3;
    cpu.incPc();
    cpu.wz += cpu.readCodeMemory() << 8;
    cpu.tacts += 3;
    cpu.incPc();
    if ((cpu.f & FlagsSetMask.C) !== 0) {
        return;
    }
    const oldPc = cpu.pc;
    if (!cpu.useGateArrayContention)
    {
        cpu.readMemory(cpu.pc);
    }
    cpu.tacts++;

    cpu.sp--;
    cpu.writeMemory(cpu.sp, cpu.pc >> 8);
    cpu.tacts += 3;
    cpu.sp--;
    cpu.writeMemory(cpu.sp, cpu.pc);
    cpu.tacts += 3;
    cpu.pc = cpu.wz;

    if (cpu.stackDebugSupport !== undefined) {
        cpu.stackDebugSupport.recordStackContentManipulationEvent(
            new StackContentManipulationEvent(cpu.pc - 1,
                `call nc,#${cpu.pc}`,
                cpu.sp,
                oldPc,
                cpu.tacts));
    }
}

function PushDE(cpu: Z80Cpu) {
    const val = cpu.de;
    cpu.sp--;
    cpu.tacts++;
    cpu.writeMemory(cpu.sp, val >> 8);
    cpu.tacts += 3;
    cpu.sp--;
    cpu.writeMemory(cpu.sp, val & 0xFF);
    cpu.tacts += 3;

    if (cpu.stackDebugSupport !== undefined) {
        cpu.stackDebugSupport.recordStackContentManipulationEvent(
            new StackContentManipulationEvent(cpu.pc - 1,
                'push de',
                cpu.sp,
                val,
                cpu.tacts));
    }
}

function Rst10(cpu: Z80Cpu) {
    const oldPc = cpu.pc;

    cpu.sp--;
    cpu.tacts++;

    cpu.writeMemory(cpu.sp, cpu.pc >> 8);
    cpu.tacts += 3;
    cpu.sp--;
    cpu.writeMemory(cpu.sp, cpu.pc);
    cpu.tacts += 3;

    cpu.wz = 0x0010;
    cpu.pc = cpu.wz;

    if (cpu.stackDebugSupport !== undefined) {
        cpu.stackDebugSupport.recordStackContentManipulationEvent(
            new StackContentManipulationEvent(oldPc - 1,
                'rst #10',
                cpu.sp,
                oldPc,
                cpu.tacts));
    }
}

function RetC(cpu: Z80Cpu) {
    const oldSp = cpu.sp;

    cpu.tacts++;
    if ((cpu.f & FlagsSetMask.C) === 0) {
        return;
    }
    var oldPc = cpu.pc - 1;
    cpu.wz = cpu.readMemory(cpu.sp);
    cpu.tacts += 3;
    cpu.sp++;
    cpu.wz += cpu.readMemory(cpu.sp) * 0x100;
    cpu.tacts += 3;
    cpu.sp++;
    cpu.pc = cpu.wz;

    if (cpu.branchDebugSupport !== undefined) {
        cpu.branchDebugSupport.recordBranchEvent(
            new BranchEvent(oldPc, 
                'ret nc',
                cpu.pc,
                cpu.tacts));
    }
}

function Exx(cpu: Z80Cpu) {
    cpu.exchangeRegisterSet();
}

function JpC_NN(cpu: Z80Cpu) {
    const oldPc = cpu.pc - 1;

    cpu.wz = cpu.readCodeMemory();
    cpu.tacts += 3;
    cpu.incPc();
    cpu.wz += cpu.readCodeMemory() << 8;
    cpu.tacts += 3;
    cpu.incPc();
    if ((cpu.f & FlagsSetMask.C) === 0) {
        return;
    }
    cpu.pc = cpu.wz;

    if (cpu.branchDebugSupport !== undefined) {
        cpu.branchDebugSupport.recordBranchEvent(
            new BranchEvent(oldPc, 
                `jp c,#${cpu.pc}`,
                cpu.pc,
                cpu.tacts));
    }
}

function InAN(cpu: Z80Cpu) {
    // pc+1:3
    let port = cpu.readCodeMemory();
    cpu.incPc();
    cpu.tacts += 3;

    // I/O
    port += cpu.a << 8;
    cpu.wz = (cpu.a << 8) + port + 1;
    cpu.a = cpu.readPort(port);
}

function CallC(cpu: Z80Cpu) {
    cpu.wz = cpu.readCodeMemory();
    cpu.tacts += 3;
    cpu.incPc();
    cpu.wz += cpu.readCodeMemory() << 8;
    cpu.tacts += 3;
    cpu.incPc();
    if ((cpu.f & FlagsSetMask.C) === 0) {
        return;
    }
    const oldPc = cpu.pc;
    if (!cpu.useGateArrayContention)
    {
        cpu.readMemory(cpu.pc);
    }
    cpu.tacts++;

    cpu.sp--;
    cpu.writeMemory(cpu.sp, cpu.pc >> 8);
    cpu.tacts += 3;
    cpu.sp--;
    cpu.writeMemory(cpu.sp, cpu.pc);
    cpu.tacts += 3;
    cpu.pc = cpu.wz;

    if (cpu.stackDebugSupport !== undefined) {
        cpu.stackDebugSupport.recordStackContentManipulationEvent(
            new StackContentManipulationEvent(cpu.pc - 1,
                `call c,#${cpu.pc}`,
                cpu.sp,
                oldPc,
                cpu.tacts));
    }
}

function Rst18(cpu: Z80Cpu) {
    const oldPc = cpu.pc;

    cpu.sp--;
    cpu.tacts++;

    cpu.writeMemory(cpu.sp, cpu.pc >> 8);
    cpu.tacts += 3;
    cpu.sp--;
    cpu.writeMemory(cpu.sp, cpu.pc);
    cpu.tacts += 3;

    cpu.wz = 0x0018;
    cpu.pc = cpu.wz;

    if (cpu.stackDebugSupport !== undefined) {
        cpu.stackDebugSupport.recordStackContentManipulationEvent(
            new StackContentManipulationEvent(oldPc - 1,
                'rst #18',
                cpu.sp,
                oldPc,
                cpu.tacts));
    }
}

function RetPO(cpu: Z80Cpu) {
    const oldSp = cpu.sp;

    cpu.tacts++;
    if ((cpu.f & FlagsSetMask.PV) !== 0) {
        return;
    }
    var oldPc = cpu.pc - 1;
    cpu.wz = cpu.readMemory(cpu.sp);
    cpu.tacts += 3;
    cpu.sp++;
    cpu.wz += cpu.readMemory(cpu.sp) * 0x100;
    cpu.tacts += 3;
    cpu.sp++;
    cpu.pc = cpu.wz;

    if (cpu.branchDebugSupport !== undefined) {
        cpu.branchDebugSupport.recordBranchEvent(
            new BranchEvent(oldPc, 
                'ret nc',
                cpu.pc,
                cpu.tacts));
    }
}

function PopHL(cpu: Z80Cpu) {
    const oldSp = cpu.sp;
    const val = cpu.readMemory(cpu.sp);
    cpu.tacts += 3;
    cpu.sp++;
    cpu.hl = (cpu.readMemory(cpu.sp) << 8) | val;
    cpu.tacts += 3;
    cpu.sp++;

    if (cpu.stackDebugSupport !== undefined) {
    cpu.stackDebugSupport.recordStackContentManipulationEvent(
        new StackContentManipulationEvent(cpu.pc - 1,
            'pop hl',
            oldSp,
            cpu.bc,
            cpu.tacts));
    }
}

function JpPO_NN(cpu: Z80Cpu) {
    const oldPc = cpu.pc - 1;

    cpu.wz = cpu.readCodeMemory();
    cpu.tacts += 3;
    cpu.incPc();
    cpu.wz += cpu.readCodeMemory() << 8;
    cpu.tacts += 3;
    cpu.incPc();
    if ((cpu.f & FlagsSetMask.PV) !== 0) {
        return;
    }
    cpu.pc = cpu.wz;

    if (cpu.branchDebugSupport !== undefined) {
        cpu.branchDebugSupport.recordBranchEvent(
            new BranchEvent(oldPc, 
                `jp po,#${cpu.pc}`,
                cpu.pc,
                cpu.tacts));
    }
}

function ExSPiHL(cpu: Z80Cpu) {
    let tmpSp = cpu.sp;
    cpu.wz = cpu.readMemory(tmpSp);
    cpu.tacts += 3;
    tmpSp++;
    cpu.wz += cpu.readMemory(tmpSp) * 0x100;
    if (cpu.useGateArrayContention) {
        cpu.tacts += 4;
    } else {
        cpu.tacts += 3;
        cpu.readMemory(tmpSp);
        cpu.tacts++;
    }
    cpu.writeMemory(tmpSp, cpu.h);
    tmpSp--;
    cpu.tacts += 3;
    cpu.writeMemory(tmpSp, cpu.l);
    if (cpu.useGateArrayContention) {
        cpu.tacts += 5;
    } else {
        cpu.tacts += 3;
        cpu.writeMemory(tmpSp, cpu.l);
        cpu.tacts++;
        cpu.writeMemory(tmpSp, cpu.l);
        cpu.tacts++;
    }
    cpu.hl = cpu.wz;

    if (cpu.stackDebugSupport !== undefined) {
        cpu.stackDebugSupport.recordStackContentManipulationEvent(
            new StackContentManipulationEvent(cpu.pc - 1,
                'ex (sp),hl',
                cpu.sp,
                cpu.hl,
                cpu.tacts));
    }
}

function CallPO(cpu: Z80Cpu) {
    cpu.wz = cpu.readCodeMemory();
    cpu.tacts += 3;
    cpu.incPc();
    cpu.wz += cpu.readCodeMemory() << 8;
    cpu.tacts += 3;
    cpu.incPc();
    if ((cpu.f & FlagsSetMask.PV) !== 0) {
        return;
    }
    const oldPc = cpu.pc;
    if (!cpu.useGateArrayContention)
    {
        cpu.readMemory(cpu.pc);
    }
    cpu.tacts++;

    cpu.sp--;
    cpu.writeMemory(cpu.sp, cpu.pc >> 8);
    cpu.tacts += 3;
    cpu.sp--;
    cpu.writeMemory(cpu.sp, cpu.pc);
    cpu.tacts += 3;
    cpu.pc = cpu.wz;

    if (cpu.stackDebugSupport !== undefined) {
        cpu.stackDebugSupport.recordStackContentManipulationEvent(
            new StackContentManipulationEvent(cpu.pc - 1,
                `call po,#${cpu.pc}`,
                cpu.sp,
                oldPc,
                cpu.tacts));
    }
}

function PushHL(cpu: Z80Cpu) {
    const val = cpu.hl;
    cpu.sp--;
    cpu.tacts++;
    cpu.writeMemory(cpu.sp, val >> 8);
    cpu.tacts += 3;
    cpu.sp--;
    cpu.writeMemory(cpu.sp, val & 0xFF);
    cpu.tacts += 3;

    if (cpu.stackDebugSupport !== undefined) {
        cpu.stackDebugSupport.recordStackContentManipulationEvent(
            new StackContentManipulationEvent(cpu.pc - 1,
                'push hl',
                cpu.sp,
                val,
                cpu.tacts));
    }
}

function Rst20(cpu: Z80Cpu) {
    const oldPc = cpu.pc;

    cpu.sp--;
    cpu.tacts++;

    cpu.writeMemory(cpu.sp, cpu.pc >> 8);
    cpu.tacts += 3;
    cpu.sp--;
    cpu.writeMemory(cpu.sp, cpu.pc);
    cpu.tacts += 3;

    cpu.wz = 0x0020;
    cpu.pc = cpu.wz;

    if (cpu.stackDebugSupport !== undefined) {
        cpu.stackDebugSupport.recordStackContentManipulationEvent(
            new StackContentManipulationEvent(oldPc - 1,
                'rst #20',
                cpu.sp,
                oldPc,
                cpu.tacts));
    }
}

function RetPE(cpu: Z80Cpu) {
    const oldSp = cpu.sp;

    cpu.tacts++;
    if ((cpu.f & FlagsSetMask.PV) === 0) {
        return;
    }
    var oldPc = cpu.pc - 1;
    cpu.wz = cpu.readMemory(cpu.sp);
    cpu.tacts += 3;
    cpu.sp++;
    cpu.wz += cpu.readMemory(cpu.sp) * 0x100;
    cpu.tacts += 3;
    cpu.sp++;
    cpu.pc = cpu.wz;

    if (cpu.branchDebugSupport !== undefined) {
        cpu.branchDebugSupport.recordBranchEvent(
            new BranchEvent(oldPc, 
                'ret nc',
                cpu.pc,
                cpu.tacts));
    }
}

function JpHL(cpu: Z80Cpu) {
    const oldPc = cpu.pc - 1;
    cpu.pc = cpu.hl;

    if (cpu.branchDebugSupport !== undefined) {
        cpu.branchDebugSupport.recordBranchEvent(
            new BranchEvent(oldPc, 
                'jp (hl)',
                cpu.pc,
                cpu.tacts));
    }
}

function JpPE_NN(cpu: Z80Cpu) {
    const oldPc = cpu.pc - 1;

    cpu.wz = cpu.readCodeMemory();
    cpu.tacts += 3;
    cpu.incPc();
    cpu.wz += cpu.readCodeMemory() << 8;
    cpu.tacts += 3;
    cpu.incPc();
    if ((cpu.f & FlagsSetMask.PV) === 0) {
        return;
    }
    cpu.pc = cpu.wz;

    if (cpu.branchDebugSupport !== undefined) {
        cpu.branchDebugSupport.recordBranchEvent(
            new BranchEvent(oldPc, 
                `jp pe,#${cpu.pc}`,
                cpu.pc,
                cpu.tacts));
    }
}

function ExDEHL(cpu: Z80Cpu) {
    const tmp = cpu.de;
    cpu.de = cpu.hl;
    cpu.hl = tmp;
}

function CallPE(cpu: Z80Cpu) {
    cpu.wz = cpu.readCodeMemory();
    cpu.tacts += 3;
    cpu.incPc();
    cpu.wz += cpu.readCodeMemory() << 8;
    cpu.tacts += 3;
    cpu.incPc();
    if ((cpu.f & FlagsSetMask.PV) === 0) {
        return;
    }
    const oldPc = cpu.pc;
    if (!cpu.useGateArrayContention)
    {
        cpu.readMemory(cpu.pc);
    }
    cpu.tacts++;

    cpu.sp--;
    cpu.writeMemory(cpu.sp, cpu.pc >> 8);
    cpu.tacts += 3;
    cpu.sp--;
    cpu.writeMemory(cpu.sp, cpu.pc);
    cpu.tacts += 3;
    cpu.pc = cpu.wz;

    if (cpu.stackDebugSupport !== undefined) {
        cpu.stackDebugSupport.recordStackContentManipulationEvent(
            new StackContentManipulationEvent(cpu.pc - 1,
                `call pe,#${cpu.pc}`,
                cpu.sp,
                oldPc,
                cpu.tacts));
    }
}

function Rst28(cpu: Z80Cpu) {
    const oldPc = cpu.pc;

    cpu.sp--;
    cpu.tacts++;

    cpu.writeMemory(cpu.sp, cpu.pc >> 8);
    cpu.tacts += 3;
    cpu.sp--;
    cpu.writeMemory(cpu.sp, cpu.pc);
    cpu.tacts += 3;

    cpu.wz = 0x0028;
    cpu.pc = cpu.wz;

    if (cpu.stackDebugSupport !== undefined) {
        cpu.stackDebugSupport.recordStackContentManipulationEvent(
            new StackContentManipulationEvent(oldPc - 1,
                'rst #28',
                cpu.sp,
                oldPc,
                cpu.tacts));
    }
}

function RetP(cpu: Z80Cpu) {
    const oldSp = cpu.sp;

    cpu.tacts++;
    if ((cpu.f & FlagsSetMask.S) !== 0) {
        return;
    }
    var oldPc = cpu.pc - 1;
    cpu.wz = cpu.readMemory(cpu.sp);
    cpu.tacts += 3;
    cpu.sp++;
    cpu.wz += cpu.readMemory(cpu.sp) * 0x100;
    cpu.tacts += 3;
    cpu.sp++;
    cpu.pc = cpu.wz;

    if (cpu.branchDebugSupport !== undefined) {
        cpu.branchDebugSupport.recordBranchEvent(
            new BranchEvent(oldPc, 
                'ret p',
                cpu.pc,
                cpu.tacts));
    }
}

function PopAF(cpu: Z80Cpu) {
    const oldSp = cpu.sp;
    const val = cpu.readMemory(cpu.sp);
    cpu.tacts += 3;
    cpu.sp++;
    cpu.af = (cpu.readMemory(cpu.sp) << 8) | val;
    cpu.tacts += 3;
    cpu.sp++;

    if (cpu.stackDebugSupport !== undefined) {
    cpu.stackDebugSupport.recordStackContentManipulationEvent(
        new StackContentManipulationEvent(cpu.pc - 1,
            'pop af',
            oldSp,
            cpu.bc,
            cpu.tacts));
    }
}

function JpP_NN(cpu: Z80Cpu) {
    const oldPc = cpu.pc - 1;

    cpu.wz = cpu.readCodeMemory();
    cpu.tacts += 3;
    cpu.incPc();
    cpu.wz += cpu.readCodeMemory() << 8;
    cpu.tacts += 3;
    cpu.incPc();
    if ((cpu.f & FlagsSetMask.S) !== 0) {
        return;
    }
    cpu.pc = cpu.wz;

    if (cpu.branchDebugSupport !== undefined) {
        cpu.branchDebugSupport.recordBranchEvent(
            new BranchEvent(oldPc, 
                `jp p,#${cpu.pc}`,
                cpu.pc,
                cpu.tacts));
    }
}

function Di(cpu: Z80Cpu) {
    cpu.iff2 = cpu.iff1 = false;
}

function CallP(cpu: Z80Cpu) {
    cpu.wz = cpu.readCodeMemory();
    cpu.tacts += 3;
    cpu.incPc();
    cpu.wz += cpu.readCodeMemory() << 8;
    cpu.tacts += 3;
    cpu.incPc();
    if ((cpu.f & FlagsSetMask.S) !== 0) {
        return;
    }
    const oldPc = cpu.pc;
    if (!cpu.useGateArrayContention)
    {
        cpu.readMemory(cpu.pc);
    }
    cpu.tacts++;

    cpu.sp--;
    cpu.writeMemory(cpu.sp, cpu.pc >> 8);
    cpu.tacts += 3;
    cpu.sp--;
    cpu.writeMemory(cpu.sp, cpu.pc);
    cpu.tacts += 3;
    cpu.pc = cpu.wz;

    if (cpu.stackDebugSupport !== undefined) {
        cpu.stackDebugSupport.recordStackContentManipulationEvent(
            new StackContentManipulationEvent(cpu.pc - 1,
                `call p,#${cpu.pc}`,
                cpu.sp,
                oldPc,
                cpu.tacts));
    }
}

function PushAF(cpu: Z80Cpu) {
    const val = cpu.af;
    cpu.sp--;
    cpu.tacts++;
    cpu.writeMemory(cpu.sp, val >> 8);
    cpu.tacts += 3;
    cpu.sp--;
    cpu.writeMemory(cpu.sp, val & 0xFF);
    cpu.tacts += 3;

    if (cpu.stackDebugSupport !== undefined) {
        cpu.stackDebugSupport.recordStackContentManipulationEvent(
            new StackContentManipulationEvent(cpu.pc - 1,
                'push af',
                cpu.sp,
                val,
                cpu.tacts));
    }
}

function Rst30(cpu: Z80Cpu) {
    const oldPc = cpu.pc;

    cpu.sp--;
    cpu.tacts++;

    cpu.writeMemory(cpu.sp, cpu.pc >> 8);
    cpu.tacts += 3;
    cpu.sp--;
    cpu.writeMemory(cpu.sp, cpu.pc);
    cpu.tacts += 3;

    cpu.wz = 0x0030;
    cpu.pc = cpu.wz;

    if (cpu.stackDebugSupport !== undefined) {
        cpu.stackDebugSupport.recordStackContentManipulationEvent(
            new StackContentManipulationEvent(oldPc - 1,
                'rst #30',
                cpu.sp,
                oldPc,
                cpu.tacts));
    }
}

function RetM(cpu: Z80Cpu) {
    const oldSp = cpu.sp;

    cpu.tacts++;
    if ((cpu.f & FlagsSetMask.S) === 0) {
        return;
    }
    var oldPc = cpu.pc - 1;
    cpu.wz = cpu.readMemory(cpu.sp);
    cpu.tacts += 3;
    cpu.sp++;
    cpu.wz += cpu.readMemory(cpu.sp) * 0x100;
    cpu.tacts += 3;
    cpu.sp++;
    cpu.pc = cpu.wz;

    if (cpu.branchDebugSupport !== undefined) {
        cpu.branchDebugSupport.recordBranchEvent(
            new BranchEvent(oldPc, 
                'ret m',
                cpu.pc,
                cpu.tacts));
    }
}

function LdSPHL(cpu: Z80Cpu) {
    const oldSP = cpu.sp;

    cpu.sp = cpu.hl;
    cpu.tacts += 2;

    if (cpu.stackDebugSupport !== undefined) {
        cpu.stackDebugSupport.recordStackPointerManipulationEvent(
            new StackPointerManipulationEvent(cpu.pc - 1,
                'ld sp,hl',
                cpu.sp,
                oldSP,
                cpu.tacts));
    }
}

function JpM_NN(cpu: Z80Cpu) {
    const oldPc = cpu.pc - 1;

    cpu.wz = cpu.readCodeMemory();
    cpu.tacts += 3;
    cpu.incPc();
    cpu.wz += cpu.readCodeMemory() << 8;
    cpu.tacts += 3;
    cpu.incPc();
    if ((cpu.f & FlagsSetMask.S) === 0) {
        return;
    }
    cpu.pc = cpu.wz;

    if (cpu.branchDebugSupport !== undefined) {
        cpu.branchDebugSupport.recordBranchEvent(
            new BranchEvent(oldPc, 
                `jp m,#${cpu.pc}`,
                cpu.pc,
                cpu.tacts));
    }
}

function Ei(cpu: Z80Cpu) {
    cpu.iff2 = cpu.iff1 = cpu.isInterruptBlocked = true;
}

function CallM(cpu: Z80Cpu) {
    cpu.wz = cpu.readCodeMemory();
    cpu.tacts += 3;
    cpu.incPc();
    cpu.wz += cpu.readCodeMemory() << 8;
    cpu.tacts += 3;
    cpu.incPc();
    if ((cpu.f & FlagsSetMask.S) === 0) {
        return;
    }
    const oldPc = cpu.pc;
    if (!cpu.useGateArrayContention)
    {
        cpu.readMemory(cpu.pc);
    }
    cpu.tacts++;

    cpu.sp--;
    cpu.writeMemory(cpu.sp, cpu.pc >> 8);
    cpu.tacts += 3;
    cpu.sp--;
    cpu.writeMemory(cpu.sp, cpu.pc);
    cpu.tacts += 3;
    cpu.pc = cpu.wz;

    if (cpu.stackDebugSupport !== undefined) {
        cpu.stackDebugSupport.recordStackContentManipulationEvent(
            new StackContentManipulationEvent(cpu.pc - 1,
                `call m,#${cpu.pc}`,
                cpu.sp,
                oldPc,
                cpu.tacts));
    }
}

function Rst38(cpu: Z80Cpu) {
    const oldPc = cpu.pc;

    cpu.sp--;
    cpu.tacts++;

    cpu.writeMemory(cpu.sp, cpu.pc >> 8);
    cpu.tacts += 3;
    cpu.sp--;
    cpu.writeMemory(cpu.sp, cpu.pc);
    cpu.tacts += 3;

    cpu.wz = 0x0038;
    cpu.pc = cpu.wz;

    if (cpu.stackDebugSupport !== undefined) {
        cpu.stackDebugSupport.recordStackContentManipulationEvent(
            new StackContentManipulationEvent(oldPc - 1,
                'rst #38',
                cpu.sp,
                oldPc,
                cpu.tacts));
    }
}

// ========================================================================
// Processing extended (ED prefix) Z80 instructions    

function Swapnib(cpu: Z80Cpu) {
    if (!cpu.allowExtendedInstructionSet) {
        return;
    }
    cpu.a = (cpu.a >> 4) | (cpu.a << 4);
}

function MirrA(cpu: Z80Cpu) {
    if (!cpu.allowExtendedInstructionSet) {
        return;
    }
    let newA = 0;
    let oldA = cpu.a;
    for (var i = 0; i < 8; i++)
    {
        newA <<= 1;
        newA |= oldA & 0x01;
        oldA >>= 1;
    }
    cpu.a = newA;
}

function MirrDE(cpu: Z80Cpu) {
    if (!cpu.allowExtendedInstructionSet) {
        return;
    }
    var newDE = 0;
    var oldDE = cpu.de;
    for (var i = 0; i < 16; i++)
    {
        newDE <<= 1;
        newDE |= oldDE & 0x01;
        oldDE >>= 1;
    }
    cpu.de = newDE;
}

function TestN(cpu: Z80Cpu) {
    if (!cpu.allowExtendedInstructionSet) {
        return;
    }
    const value = cpu.readCodeMemory();
    cpu.tacts += 3;
    cpu.incPc();
    const result = cpu.a & value;
    cpu.f = aluLogOpFlags[result] | FlagsSetMask.H;
}

function Mul(cpu: Z80Cpu) {
    if (!cpu.allowExtendedInstructionSet) {
        return;
    }
    const mul = cpu.hl * cpu.de;
    cpu.de = mul;
    cpu.hl = (mul >> 16);
}

function AddHL_A(cpu: Z80Cpu) {
    if (!cpu.allowExtendedInstructionSet) {
        return;
    }
    cpu.hl += cpu.a;
}

function AddDE_A(cpu: Z80Cpu) {
    if (!cpu.allowExtendedInstructionSet) {
        return;
    }
    cpu.de += cpu.a;
}

function AddBC_A(cpu: Z80Cpu) {
    if (!cpu.allowExtendedInstructionSet) {
        return;
    }
    cpu.bc += cpu.a;
}

function AddHLNN(cpu: Z80Cpu) {
    if (!cpu.allowExtendedInstructionSet) {
        return;
    }
    let value = cpu.readCodeMemory();
    cpu.tacts += 4;
    cpu.incPc();
    value += cpu.readCodeMemory() << 8;
    cpu.tacts += 4;
    cpu.incPc();
    cpu.hl += value;
}

function AddDENN(cpu: Z80Cpu) {
    if (!cpu.allowExtendedInstructionSet) {
        return;
    }
    let value = cpu.readCodeMemory();
    cpu.tacts += 4;
    cpu.incPc();
    value += cpu.readCodeMemory() << 8;
    cpu.tacts += 4;
    cpu.incPc();
    cpu.de += value;
}

function AddBCNN(cpu: Z80Cpu) {
    if (!cpu.allowExtendedInstructionSet) {
        return;
    }
    let value = cpu.readCodeMemory();
    cpu.tacts += 4;
    cpu.incPc();
    value += cpu.readCodeMemory() << 8;
    cpu.tacts += 4;
    cpu.incPc();
    cpu.bc += value;
}

function InB_C(cpu: Z80Cpu) {
    cpu.wz = cpu.bc + 1;
    const pval = cpu.readPort(cpu.bc);
    cpu.b = pval;
    cpu.f = aluLogOpFlags[pval] | (cpu.f & FlagsSetMask.C);
}

function OutC_B(cpu: Z80Cpu) {
    cpu.wz = cpu.bc + 1;
    cpu.writePort(cpu.bc, cpu.b);
}

function SbcHL_QQ(cpu: Z80Cpu) {
    cpu.wz = cpu.hl + 1;
    const cfVal = cpu.cFlag ? 1 : 0;
    var qq = (cpu.opCode & 0x30) >> 4;
    let flags = FlagsSetMask.N;
    flags |= (((cpu.hl & 0x0FFF) - (cpu.getReg16(qq) & 0x0FFF) - cfVal) >> 8) 
        & FlagsSetMask.H;
    let sbcVal = (cpu.hl & 0xFFFF) - (cpu.getReg16(qq) & 0xFFFF) - cfVal;
    if ((sbcVal & 0x10000) !== 0) {
        flags |= FlagsSetMask.C;
    }
    if ((sbcVal & 0xFFFF) === 0) {
        flags |= FlagsSetMask.Z;
    }
    var signedSbc = toSshort(cpu.hl) - toSshort(cpu.getReg16(qq)) - cfVal;
    if (signedSbc < -0x8000 || signedSbc >= 0x8000)
    {
        flags |= FlagsSetMask.PV;
    }
    cpu.hl = toSshort(sbcVal);
    cpu.f = flags | (cpu.h & (FlagsSetMask.S | FlagsSetMask.R3 | FlagsSetMask.R5));
    cpu.tacts += 7;
}

function LdNNi_QQ(cpu: Z80Cpu) {
    const l = cpu.readCodeMemory();
    cpu.tacts += 3;
    cpu.incPc();
    let addr = cpu.readCodeMemory() << 8 | l;
    cpu.tacts += 3;
    cpu.incPc();
    cpu.wz = addr + 1;
    const regVal =  cpu.getReg16((cpu.opCode & 0x30) >> 4);
    cpu.writeMemory(addr, regVal & 0xFF);
    cpu.tacts += 3;
    cpu.writeMemory(cpu.wz, regVal >> 8);
    cpu.tacts += 3;
}

function Neg(cpu: Z80Cpu) {
    const result = -cpu.a;
    const lNibble = -(cpu.a & 0x0F) & 0x10;

    let flags = result & (FlagsSetMask.S | FlagsSetMask.R5 | FlagsSetMask.R3);
    flags |= FlagsSetMask.N;
    if ((result & 0xFF) === 0) {
        flags |= FlagsSetMask.Z;
    }
    if (cpu.a !== 0) {
        flags |= FlagsSetMask.C;
    }
    if (lNibble !== 0) {
        flags |= FlagsSetMask.H;
    }
    if (cpu.a === 0x80) {
        flags |= FlagsSetMask.PV;
    }
    cpu.f = flags;
    cpu.a = result;
}

function Retn(cpu: Z80Cpu) {
    var oldSp = cpu.sp;
    var oldPc = cpu.pc - 2;

    cpu.iff1 = cpu.iff2;
    let addr = cpu.readMemory(cpu.sp);
    cpu.tacts += 3;
    cpu.sp++;
    addr += cpu.readMemory(cpu.sp) * 0x100;
    cpu.tacts += 3;
    cpu.sp++;
    cpu.pc = addr;
    cpu.wz = addr;

    if (cpu.branchDebugSupport !== undefined) {
        cpu.branchDebugSupport.recordBranchEvent(
            new BranchEvent(oldPc, 
                'retn',
                cpu.pc,
                cpu.tacts));
    }
}

function ImN(cpu: Z80Cpu) {
    let mode = (cpu.opCode & 0x18) >> 3;
    if (mode < 2) {
        mode = 1;
    }
    mode--;
    cpu.interruptMode = mode;
}

function LdXR_A(cpu: Z80Cpu) {
    if ((cpu.opCode & 0x08) === 0) {
        cpu.i = cpu.a;
    } else {
        cpu.r = cpu.a;
    }
    cpu.tacts++;
}

function InC_C(cpu: Z80Cpu) {
    cpu.wz = cpu.bc + 1;
    const pval = cpu.readPort(cpu.bc);
    cpu.c = pval;
    cpu.f = aluLogOpFlags[pval] | (cpu.f & FlagsSetMask.C);
}

function OutC_C(cpu: Z80Cpu) {
    cpu.wz = cpu.bc + 1;
    cpu.writePort(cpu.bc, cpu.c);
}

function AdcHL_QQ(cpu: Z80Cpu) {
    cpu.wz = cpu.hl + 1;
    const cfVal = cpu.cFlag ? 1 : 0;
    const qq = (cpu.opCode & 0x30) >> 4;
    let flags = ((((cpu.hl & 0x0FFF) + (cpu.getReg16(qq) & 0x0FFF) 
        + (cpu.f & FlagsSetMask.C)) >> 8) & FlagsSetMask.H) & 0xFF;
    const adcVal = (cpu.hl & 0xFFFF) + (cpu.getReg16(qq) & 0xFFFF) + cfVal;
    if ((adcVal & 0x10000) !== 0) {
        flags |= FlagsSetMask.C;
    }
    if ((adcVal & 0xFFFF) === 0) {
        flags |= FlagsSetMask.Z;
    }
    const signedAdc = toSshort(cpu.hl) + toSshort(cpu.getReg16(qq)) + cfVal;
    if (signedAdc < -0x8000 || signedAdc >= 0x8000) {
        flags |= FlagsSetMask.PV;
    }
    cpu.hl = adcVal;
    cpu.f = flags | (cpu.h & (FlagsSetMask.S | FlagsSetMask.R3 | FlagsSetMask.R5));
    cpu.tacts += 7;
}

function LdQQ_NNi(cpu: Z80Cpu) {
    const addrl = cpu.readCodeMemory();
    cpu.tacts += 3;
    cpu.incPc();
    const addr = cpu.readCodeMemory() << 8 | addrl;
    cpu.tacts += 3;
    cpu.incPc();
    cpu.wz = addr + 1;
    const l = cpu.readMemory(addr);
    cpu.tacts += 3;
    const h = cpu.readMemory(cpu.wz);
    cpu.tacts += 3;
    cpu.setReg16((cpu.opCode & 0x30) >> 4, h << 8 | l);
}

function Reti(cpu: Z80Cpu) {
    var oldSp = cpu.sp;
    var oldPc = cpu.pc - 2;

    cpu.iff1 = cpu.iff2;
    let addr = cpu.readMemory(cpu.sp);
    cpu.tacts += 3;
    cpu.sp++;
    addr += cpu.readMemory(cpu.sp) * 0x100;
    cpu.tacts += 3;
    cpu.sp++;
    cpu.pc = addr;
    cpu.wz = addr;

    if (cpu.branchDebugSupport !== undefined) {
        cpu.branchDebugSupport.recordBranchEvent(
            new BranchEvent(oldPc, 
                'reti',
                cpu.pc,
                cpu.tacts));
    }
}

function InD_C(cpu: Z80Cpu) {
    cpu.wz = cpu.bc + 1;
    const pval = cpu.readPort(cpu.bc);
    cpu.d = pval;
    cpu.f = aluLogOpFlags[pval] | (cpu.f & FlagsSetMask.C);
}

function OutC_D(cpu: Z80Cpu) {
    cpu.wz = cpu.bc + 1;
    cpu.writePort(cpu.bc, cpu.d);
}

function LdA_XR(cpu: Z80Cpu) {
    const source = (cpu.opCode & 0x08) === 0
        ? cpu.i : cpu.r;
    cpu.a = source;
    const flags = cpu.f & FlagsSetMask.C
            | (source & FlagsSetMask.R3R5)
            | (cpu.iff2 ? FlagsSetMask.PV : 0)
            | (source & 0x80)
            | (source === 0 ? FlagsSetMask.Z : 0);
    cpu.f = flags;
    cpu.tacts++;
}

function InE_C(cpu: Z80Cpu) {
    cpu.wz = cpu.bc + 1;
    const pval = cpu.readPort(cpu.bc);
    cpu.e = pval;
    cpu.f = aluLogOpFlags[pval] | (cpu.f & FlagsSetMask.C);
}

function OutC_E(cpu: Z80Cpu) {
    cpu.wz = cpu.bc + 1;
    cpu.writePort(cpu.bc, cpu.e);
}

function Rrd(cpu: Z80Cpu) {
    const tmp = cpu.readMemory(cpu.hl);
    cpu.tacts += 3;
    if (cpu.useGateArrayContention)
    {
        cpu.tacts += 4;
    }
    else
    {
        cpu.readMemory(cpu.hl);
        cpu.tacts++;
        cpu.readMemory(cpu.hl);
        cpu.tacts++;
        cpu.readMemory(cpu.hl);
        cpu.tacts++;
        cpu.readMemory(cpu.hl);
        cpu.tacts++;
    }

    cpu.wz = cpu.hl + 1;
    cpu.writeMemory(cpu.hl, ((cpu.a << 4) | (tmp >> 4)) & 0xFF);
    cpu.tacts += 3;

    cpu.a = (cpu.a & 0xF0) | (tmp & 0x0F);
    cpu.f = aluLogOpFlags[cpu.a] | (cpu.f & FlagsSetMask.C);
}

function InH_C(cpu: Z80Cpu) {
    cpu.wz = cpu.bc + 1;
    const pval = cpu.readPort(cpu.bc);
    cpu.h = pval;
    cpu.f = aluLogOpFlags[pval] | (cpu.f & FlagsSetMask.C);
}

function OutC_H(cpu: Z80Cpu) {
    cpu.wz = cpu.bc + 1;
    cpu.writePort(cpu.bc, cpu.h);
}

function Rld(cpu: Z80Cpu) {
    const tmp = cpu.readMemory(cpu.hl);
    cpu.tacts += 3;

    if (cpu.useGateArrayContention)
    {
        cpu.tacts += 4;
    }
    else
    {
        cpu.readMemory(cpu.hl);
        cpu.tacts++;
        cpu.readMemory(cpu.hl);
        cpu.tacts++;
        cpu.readMemory(cpu.hl);
        cpu.tacts++;
        cpu.readMemory(cpu.hl);
        cpu.tacts++;
    }

    cpu.wz = cpu.hl + 1;
    cpu.writeMemory(cpu.hl, ((cpu.a & 0x0F) | (tmp << 4)) & 0xFF);
    cpu.tacts += 3;

    cpu.a = (cpu.a & 0xF0) | (tmp >> 4);
    cpu.f = aluLogOpFlags[cpu.a] | (cpu.f & FlagsSetMask.C);
}

function InL_C(cpu: Z80Cpu) {
    cpu.wz = cpu.bc + 1;
    const pval = cpu.readPort(cpu.bc);
    cpu.l = pval;
    cpu.f = aluLogOpFlags[pval] | (cpu.f & FlagsSetMask.C);
}

function OutC_L(cpu: Z80Cpu) {
    cpu.wz = cpu.bc + 1;
    cpu.writePort(cpu.bc, cpu.l);
}

function InF_C(cpu: Z80Cpu) {
    cpu.wz = cpu.bc + 1;
    const pval = cpu.readPort(cpu.bc);
    cpu.f = aluLogOpFlags[pval] | (cpu.f & FlagsSetMask.C);
}

function OutC_0(cpu: Z80Cpu) {
    cpu.wz = cpu.bc + 1;
    cpu.writePort(cpu.bc, 0);
}

function InA_C(cpu: Z80Cpu) {
    cpu.wz = cpu.bc + 1;
    const pval = cpu.readPort(cpu.bc);
    cpu.a = pval;
    cpu.f = aluLogOpFlags[pval] | (cpu.f & FlagsSetMask.C);
}

function OutC_A(cpu: Z80Cpu) {
    cpu.wz = cpu.bc + 1;
    cpu.writePort(cpu.bc, cpu.a);
}

function LdSP_NNi(cpu: Z80Cpu) {
    const oldSP = cpu.sp;

    const addrl = cpu.readCodeMemory();
    cpu.tacts += 3;
    cpu.incPc();
    const addr = cpu.readCodeMemory() << 8 | addrl;
    cpu.tacts += 3;
    cpu.incPc();
    cpu.wz = addr + 1;
    const l = cpu.readMemory(addr);
    cpu.tacts += 3;
    const h = cpu.readMemory(cpu.wz);
    cpu.tacts += 3;
    cpu.sp = h << 8 | l;

    if (cpu.stackDebugSupport !== undefined) {
        cpu.stackDebugSupport.recordStackPointerManipulationEvent(
            new StackPointerManipulationEvent(oldSP - 1,
                `ld sp,(#${addr.toString(16)})`,
                cpu.sp,
                oldSP,
                cpu.tacts));
    }
}

function PushNN(cpu: Z80Cpu) {
    if (!cpu.allowExtendedInstructionSet) {
        return;
    }
    let value = cpu.readCodeMemory();
    cpu.tacts += 3;
    cpu.incPc();
    value += cpu.readCodeMemory() << 8;
    cpu.tacts += 3;
    cpu.incPc();
    cpu.sp--;
    cpu.writeMemory(cpu.sp, value >> 8);
    cpu.tacts += 3;
    cpu.sp--;
    cpu.writeMemory(cpu.sp, value);
    cpu.tacts += 3;
}

function Outinb(cpu: Z80Cpu) {
    if (!cpu.allowExtendedInstructionSet) {
        return;
    }
    
    // pc+1:5 -> remaining 1
    cpu.tacts++;

    // hl:3
    var val = cpu.readMemory(cpu.hl);
    cpu.tacts += 3;

    // I/O
    cpu.writePort(cpu.bc, val);
    cpu.hl++;
}

function Nextreg(cpu: Z80Cpu) {
    if (!cpu.allowExtendedInstructionSet) {
        return;
    }
    const reg = cpu.readCodeMemory();
    cpu.tacts += 3;
    cpu.incPc();
    const val = cpu.readCodeMemory();
    cpu.tacts += 3;
    cpu.incPc();
    if (cpu.tbBlueDevice === undefined) {
        return;
    }
    cpu.tbBlueDevice.setRegisterIndex(reg);
    cpu.tbBlueDevice.setRegisterValue(val);
}

function NextregA(cpu: Z80Cpu) {
    if (!cpu.allowExtendedInstructionSet) {
        return;
    }
    const reg = cpu.readCodeMemory();
    cpu.tacts += 3;
    cpu.incPc();
    if (cpu.tbBlueDevice === undefined) {
        return;
    }
    cpu.tbBlueDevice.setRegisterIndex(reg);
    cpu.tbBlueDevice.setRegisterValue(cpu.a);
}

function Pixeldn(cpu: Z80Cpu) {
    if (!cpu.allowExtendedInstructionSet) {
        return;
    }

    if ((cpu.h & 0x07) === 0x07) {
        if (cpu.l < 0xE0) {
            cpu.l += 0x20;
            cpu.h &= 0xF8;
        } else {
            cpu.l += 0x20;
            cpu.h++;
        }
    } else {
        cpu.hl += 0x0100;
    }
}

function Pixelad(cpu: Z80Cpu) {
    if (!cpu.allowExtendedInstructionSet) {
        return;
    }
    const da = 0x4000 | (cpu.e >> 3) | (cpu.d << 5);
    cpu.hl = 
        ((da & 0xF81F)            // --- Reset V5, V4, V3, V2, V1
        | ((da & 0x0700) >> 3)    // --- Keep V5, V4, V3 only
        | ((da & 0x00E0) << 3));  // --- Exchange the V2, V1, V0 bit 
                                  // --- group with V5, V4, V3
}

function Setae(cpu: Z80Cpu) {
    if (!cpu.allowExtendedInstructionSet) {
        return;
    }
    cpu.a |= 0x01 << (cpu.e & 0x07);
}

function Ldi(cpu: Z80Cpu) {
    let memVal = cpu.readMemory(cpu.hl++);
    cpu.tacts += 3;
    cpu.writeMemory(cpu.de, memVal);
    if (cpu.useGateArrayContention)
    {
        cpu.tacts += 5;
    }
    else
    {
        cpu.tacts += 3;
        cpu.writeMemory(cpu.de, memVal);
        cpu.tacts++;
        cpu.writeMemory(cpu.de, memVal);
        cpu.tacts++;
    }
    cpu.de++;
    memVal += cpu.a;
    memVal = ((memVal & FlagsSetMask.R3) | ((memVal << 4) & FlagsSetMask.R5)) & 0xFF;
    cpu.f = (cpu.f 
        & ~(FlagsSetMask.N | FlagsSetMask.H | FlagsSetMask.PV | FlagsSetMask.R3 | FlagsSetMask.R5)) | memVal;
    if (--cpu.bc !== 0) {
        cpu.f |= FlagsSetMask.PV;
    }
}

function Cpi(cpu: Z80Cpu) {
    let memVal = cpu.readMemory(cpu.hl);
    const compRes = cpu.a - memVal;
    let r3r5 = compRes;
    let flags = (cpu.f & FlagsSetMask.C) | FlagsSetMask.N;
    if ((((cpu.a & 0x0F) - (compRes & 0x0F)) & 0x10) !== 0) {
        flags |= FlagsSetMask.H;
        r3r5 = compRes - 1;
    }
    if ((compRes & 0xFF) === 0) {
        flags |= FlagsSetMask.Z;
    }
    flags |= compRes & FlagsSetMask.S;
    flags |= (r3r5 & FlagsSetMask.R3) | ((r3r5 << 4) & FlagsSetMask.R5);

    cpu.tacts += 3;
    if (cpu.useGateArrayContention)
    {
        cpu.tacts += 5;
    }
    else
    {
        cpu.readMemory(cpu.hl);
        cpu.tacts++;
        cpu.readMemory(cpu.hl);
        cpu.tacts++;
        cpu.readMemory(cpu.hl);
        cpu.tacts++;
        cpu.readMemory(cpu.hl);
        cpu.tacts++;
        cpu.readMemory(cpu.hl);
        cpu.tacts++;
    }
    cpu.hl++;

    if (--cpu.bc !== 0) {
        flags |= FlagsSetMask.PV;
    }
    cpu.f = flags;
    cpu.wz++;
}

function Ini(cpu: Z80Cpu) {
    // pc+1:5 -> remaining 1
    cpu.tacts++;

    // I/O
    cpu.wz = cpu.bc + 1;
    const val = cpu.readPort(cpu.bc);

    // hl:3
    cpu.writeMemory(cpu.hl, val);
    cpu.tacts += 3;

    cpu.f = decOpFlags[cpu.b] | (cpu.f & FlagsSetMask.C);
    cpu.b--;
    cpu.hl++;
}

function Outi(cpu: Z80Cpu) {
    // pc+1:5 -> remaining 1
    cpu.tacts++;

    cpu.f = decOpFlags[cpu.b];
    cpu.b--;

    // hl:3
    const val = cpu.readMemory(cpu.hl);
    cpu.tacts += 3;

    // I/O
    cpu.writePort(cpu.bc, val);

    cpu.hl++;
    cpu.f &= FlagsResetMask.C;
    if (cpu.l === 0) {
        cpu.f |= FlagsSetMask.C;
    }
    cpu.wz = cpu.bc + 1;
}

function Ldix(cpu: Z80Cpu) {
    if (!cpu.allowExtendedInstructionSet) {
        return;
    }
    let memVal = cpu.readMemory(cpu.hl++);
    cpu.tacts += 3;
    if (cpu.a !== memVal) {
        cpu.writeMemory(cpu.de, memVal);
        cpu.tacts += 3;
    }
    cpu.tacts += 2;
    cpu.de++;
    memVal += cpu.a;
    memVal = (memVal & FlagsSetMask.R3) | ((memVal << 4) & FlagsSetMask.R5) & 0xFF;
    cpu.f = (cpu.f & ~(FlagsSetMask.N | FlagsSetMask.H 
        | FlagsSetMask.PV | FlagsSetMask.R3 | FlagsSetMask.R5)) | memVal;
    if (--cpu.bc !== 0) {
        cpu.f |= FlagsSetMask.PV;
    }
}

function Ldd(cpu: Z80Cpu) {
    let memVal = cpu.readMemory(cpu.hl--);
    cpu.tacts += 3;
    cpu.writeMemory(cpu.de, memVal);
    if (cpu.useGateArrayContention) {
        cpu.tacts += 5;
    } else {
        cpu.tacts += 3;
        cpu.writeMemory(cpu.de, memVal);
        cpu.tacts++;
        cpu.writeMemory(cpu.de, memVal);
        cpu.tacts++;
    }
    cpu.de--;
    memVal += cpu.a;
    memVal = ((memVal & FlagsSetMask.R3) | ((memVal << 4) & FlagsSetMask.R5)) & 0xFF;
    cpu.f = (cpu.f 
        & ~(FlagsSetMask.N | FlagsSetMask.H | FlagsSetMask.PV | FlagsSetMask.R3 | FlagsSetMask.R5)) | memVal;
    if (--cpu.bc !== 0) {
        cpu.f |= FlagsSetMask.PV;
    }
}

function Cpd(cpu: Z80Cpu) {
    let memVal = cpu.readMemory(cpu.hl);
    const compRes = cpu.a - memVal;
    let r3r5 = compRes;
    let flags = (cpu.f & FlagsSetMask.C) | FlagsSetMask.N;
    if ((((cpu.a & 0x0F) - (compRes & 0x0F)) & 0x10) !== 0) {
        flags |= FlagsSetMask.H;
        r3r5 = compRes - 1;
    }
    if ((compRes & 0xFF) === 0) {
        flags |= FlagsSetMask.Z;
    }
    flags |= compRes & FlagsSetMask.S;
    flags |= (r3r5 & FlagsSetMask.R3) | ((r3r5 << 4) & FlagsSetMask.R5);

    cpu.tacts += 3;
    if (cpu.useGateArrayContention)
    {
        cpu.tacts += 5;
    }
    else
    {
        cpu.readMemory(cpu.hl);
        cpu.tacts++;
        cpu.readMemory(cpu.hl);
        cpu.tacts++;
        cpu.readMemory(cpu.hl);
        cpu.tacts++;
        cpu.readMemory(cpu.hl);
        cpu.tacts++;
        cpu.readMemory(cpu.hl);
        cpu.tacts++;
    }
    cpu.hl--;

    if (--cpu.bc !== 0) {
        flags |= FlagsSetMask.PV;
    }
    cpu.f = flags;
    cpu.wz--;
}

function Ind(cpu: Z80Cpu) {
    // pc+1:5 -> remaining 1
    cpu.tacts++;

    cpu.wz = cpu.bc - 1;

    // I/O
    const val = cpu.readPort(cpu.bc);

    // hl:3
    cpu.writeMemory(cpu.hl, val);
    cpu.tacts += 3;

    cpu.f = decOpFlags[cpu.b] | (cpu.f & FlagsSetMask.C);
    cpu.b--;
    cpu.hl--;
}

function Outd(cpu: Z80Cpu) {
    // pc+1:5 -> remaining 1
    cpu.tacts++;

    cpu.f = decOpFlags[cpu.b];
    cpu.b--;

    // hl:3
    const val = cpu.readMemory(cpu.hl);
    cpu.tacts += 3;

    // I/O
    cpu.writePort(cpu.bc, val);

    cpu.hl--;
    cpu.f &= FlagsResetMask.C;
    if (cpu.l === 0xFF) {
        cpu.f |= FlagsSetMask.C;
    }
    cpu.wz = cpu.bc - 1;
}

function Lddx(cpu: Z80Cpu) {
    if (!cpu.allowExtendedInstructionSet) {
        return;
    }
    let memVal = cpu.readMemory(cpu.hl--);
    cpu.tacts += 3;
    if (cpu.a !== memVal)
    {
        cpu.writeMemory(cpu.de, memVal);
        cpu.tacts += 3;
    }
    cpu.tacts += 2;
    cpu.de--;
    memVal += cpu.a;
    memVal = (memVal & FlagsSetMask.R3) | ((memVal << 4) & FlagsSetMask.R5);
    cpu.f = (cpu.f & ~(FlagsSetMask.N | FlagsSetMask.H | 
        FlagsSetMask.PV | FlagsSetMask.R3 | FlagsSetMask.R5)) | memVal;
    if (--cpu.bc !== 0) {
        cpu.f |= FlagsSetMask.PV;
    }
}

function Ldir(cpu: Z80Cpu) {
    let memVal = cpu.readMemory(cpu.hl++);
    cpu.tacts += 3;
    cpu.writeMemory(cpu.de, memVal);
    if (cpu.useGateArrayContention)
    {
        cpu.tacts += 5;
    }
    else
    {
        cpu.tacts += 3;
        cpu.writeMemory(cpu.de, memVal);
        cpu.tacts++;
        cpu.writeMemory(cpu.de, memVal);
        cpu.tacts++;
    }
    cpu.de++;
    memVal += cpu.a;
    memVal = ((memVal & FlagsSetMask.R3) | ((memVal << 4) & FlagsSetMask.R5)) & 0xFF;
    cpu.f = (cpu.f 
        & ~(FlagsSetMask.N | FlagsSetMask.H | FlagsSetMask.PV | FlagsSetMask.R3 | FlagsSetMask.R5)) | memVal;
    if (--cpu.bc === 0) {
        return;
    }

    cpu.f |= FlagsSetMask.PV;
    cpu.pc -= 2;
    if (cpu.useGateArrayContention)
    {
        cpu.tacts += 5;
    }
    else
    {
        cpu.readMemory(cpu.de - 1);
        cpu.tacts++;
        cpu.readMemory(cpu.de - 1);
        cpu.tacts++;
        cpu.readMemory(cpu.de - 1);
        cpu.tacts++;
        cpu.readMemory(cpu.de - 1);
        cpu.tacts++;
        cpu.readMemory(cpu.de - 1);
        cpu.tacts++;
    }
    cpu.wz = cpu.pc + 1;
}

function Cpir(cpu: Z80Cpu) {
    let memVal = cpu.readMemory(cpu.hl);
    const compRes = cpu.a - memVal;
    let r3r5 = compRes;
    let flags = (cpu.f & FlagsSetMask.C) | FlagsSetMask.N;
    if ((((cpu.a & 0x0F) - (compRes & 0x0F)) & 0x10) !== 0) {
        flags |= FlagsSetMask.H;
        r3r5 = compRes - 1;
    }
    if ((compRes & 0xFF) === 0) {
        flags |= FlagsSetMask.Z;
    }
    flags |= compRes & FlagsSetMask.S;
    flags |= (r3r5 & FlagsSetMask.R3) | ((r3r5 << 4) & FlagsSetMask.R5);

    cpu.tacts += 3;
    if (cpu.useGateArrayContention)
    {
        cpu.tacts += 5;
    }
    else
    {
        cpu.readMemory(cpu.hl);
        cpu.tacts++;
        cpu.readMemory(cpu.hl);
        cpu.tacts++;
        cpu.readMemory(cpu.hl);
        cpu.tacts++;
        cpu.readMemory(cpu.hl);
        cpu.tacts++;
        cpu.readMemory(cpu.hl);
        cpu.tacts++;
    }
    cpu.hl++;

    if (--cpu.bc !== 0) {
        flags |= FlagsSetMask.PV;
        if ((flags & FlagsSetMask.Z) === 0) {
            cpu.pc -= 2;
            if (cpu.useGateArrayContention) {
                cpu.tacts += 5;
            } else {
                cpu.readMemory(cpu.hl - 1);
                cpu.tacts++;
                cpu.readMemory(cpu.hl - 1);
                cpu.tacts++;
                cpu.readMemory(cpu.hl - 1);
                cpu.tacts++;
                cpu.readMemory(cpu.hl - 1);
                cpu.tacts++;
                cpu.readMemory(cpu.hl - 1);
                cpu.tacts++;
            }
            cpu.wz = cpu.pc + 1;
        }
    }
    cpu.f = flags;
}

function Inir(cpu: Z80Cpu) {
    // pc+1:5 -> remaining 1
    cpu.tacts++;

    // I/O
    cpu.wz = cpu.bc + 1;
    const val = cpu.readPort(cpu.bc);

    // hl:3
    cpu.writeMemory(cpu.hl, val);
    cpu.tacts += 3;

    cpu.f = decOpFlags[cpu.b] | (cpu.f & FlagsSetMask.C);
    cpu.b--;
    cpu.hl++;

    if (cpu.b !== 0) {
        cpu.f |= FlagsSetMask.PV;
        cpu.pc -= 2;
        if (cpu.useGateArrayContention) {
            cpu.tacts += 5;
        } else {
            cpu.readMemory(cpu.hl - 1);
            cpu.tacts++;
            cpu.readMemory(cpu.hl - 1);
            cpu.tacts++;
            cpu.readMemory(cpu.hl - 1);
            cpu.tacts++;
            cpu.readMemory(cpu.hl - 1);
            cpu.tacts++;
            cpu.readMemory(cpu.hl - 1);
            cpu.tacts++;
        }
    } else {
        cpu.f &= FlagsResetMask.PV;
    }
}

function Otir(cpu: Z80Cpu) {
    // pc+1:5 -> remaining 1
    cpu.tacts++;

    cpu.f = decOpFlags[cpu.b];
    cpu.b--;

    // hl:3
    const val = cpu.readMemory(cpu.hl++);
    cpu.tacts += 3;

    // I/O
    cpu.writePort(cpu.bc, val);

    if (cpu.b !== 0) {
        cpu.f |= FlagsSetMask.PV;
        cpu.pc -= 2;
        if (cpu.useGateArrayContention) {
            cpu.tacts += 5;
        } else {
            cpu.readMemory(cpu.bc);
            cpu.tacts++;
            cpu.readMemory(cpu.bc);
            cpu.tacts++;
            cpu.readMemory(cpu.bc);
            cpu.tacts++;
            cpu.readMemory(cpu.bc);
            cpu.tacts++;
            cpu.readMemory(cpu.bc);
            cpu.tacts++;
        }
    } else {
        cpu.f &= FlagsResetMask.PV;
    }
    cpu.f &= FlagsResetMask.C;
    if (cpu.l === 0) {
        cpu.f |= FlagsSetMask.C;
    }
    cpu.wz = cpu.bc + 1;
}

function Ldirx(cpu: Z80Cpu) {
    if (!cpu.allowExtendedInstructionSet) {
        return;
    }
    let memVal = cpu.readMemory(cpu.hl++);
    cpu.tacts += 3;
    if (cpu.a !== memVal) {
        cpu.writeMemory(cpu.de, memVal);
        cpu.tacts += 3;
    }
    cpu.tacts += 2;
    cpu.de++;
    memVal += cpu.a;
    memVal = (memVal & FlagsSetMask.R3) | ((memVal << 4) & FlagsSetMask.R5);
    cpu.f = (cpu.f & 
        ~(FlagsSetMask.N | FlagsSetMask.H | FlagsSetMask.PV | FlagsSetMask.R3 | FlagsSetMask.R5)) | memVal;
    if (--cpu.bc === 0) {
        return;
    }
    cpu.f |= FlagsSetMask.PV;
    cpu.pc -= 2;
    cpu.tacts += 5;
    cpu.wz = cpu.pc + 1;
}

function Lddr(cpu: Z80Cpu) {
    let memVal = cpu.readMemory(cpu.hl--);
    cpu.tacts += 3;
    cpu.writeMemory(cpu.de, memVal);
    if (cpu.useGateArrayContention) {
        cpu.tacts += 5;
    } else {
        cpu.tacts += 3;
        cpu.writeMemory(cpu.de, memVal);
        cpu.tacts++;
        cpu.writeMemory(cpu.de, memVal);
        cpu.tacts++;
    }
    cpu.de--;
    memVal += cpu.a;
    memVal = ((memVal & FlagsSetMask.R3) | ((memVal << 4) & FlagsSetMask.R5)) & 0xFF;
    cpu.f = (cpu.f 
        & ~(FlagsSetMask.N | FlagsSetMask.H | FlagsSetMask.PV | FlagsSetMask.R3 | FlagsSetMask.R5)) | memVal;
    if (--cpu.bc === 0) {
        return;
    }
    cpu.f |= FlagsSetMask.PV;
    cpu.pc -= 2;
    if (cpu.useGateArrayContention) {
        cpu.tacts += 5;
    } else  {
        cpu.readMemory(cpu.de + 1);
        cpu.tacts++;
        cpu.readMemory(cpu.de + 1);
        cpu.tacts++;
        cpu.readMemory(cpu.de + 1);
        cpu.tacts++;
        cpu.readMemory(cpu.de + 1);
        cpu.tacts++;
        cpu.readMemory(cpu.de + 1);
        cpu.tacts++;
    }
    cpu.wz = cpu.pc + 1;
}

function Cpdr(cpu: Z80Cpu) {
    let memVal = cpu.readMemory(cpu.hl);
    const compRes = cpu.a - memVal;
    let r3r5 = compRes;
    let flags = (cpu.f & FlagsSetMask.C) | FlagsSetMask.N;
    if ((((cpu.a & 0x0F) - (compRes & 0x0F)) & 0x10) !== 0) {
        flags |= FlagsSetMask.H;
        r3r5 = compRes - 1;
    }
    if ((compRes & 0xFF) === 0) {
        flags |= FlagsSetMask.Z;
    }
    flags |= compRes & FlagsSetMask.S;
    flags |= (r3r5 & FlagsSetMask.R3) | ((r3r5 << 4) & FlagsSetMask.R5);

    cpu.tacts += 3;
    if (cpu.useGateArrayContention)
    {
        cpu.tacts += 5;
    }
    else
    {
        cpu.readMemory(cpu.hl);
        cpu.tacts++;
        cpu.readMemory(cpu.hl);
        cpu.tacts++;
        cpu.readMemory(cpu.hl);
        cpu.tacts++;
        cpu.readMemory(cpu.hl);
        cpu.tacts++;
        cpu.readMemory(cpu.hl);
        cpu.tacts++;
    }
    cpu.hl--;

    if (--cpu.bc !== 0) {
        flags |= FlagsSetMask.PV;
        if ((flags & FlagsSetMask.Z) === 0) {
            cpu.pc -= 2;
            if (cpu.useGateArrayContention) {
                cpu.tacts += 5;
            } else {
                cpu.readMemory(cpu.hl + 1);
                cpu.tacts++;
                cpu.readMemory(cpu.hl + 1);
                cpu.tacts++;
                cpu.readMemory(cpu.hl + 1);
                cpu.tacts++;
                cpu.readMemory(cpu.hl + 1);
                cpu.tacts++;
                cpu.readMemory(cpu.hl + 1);
                cpu.tacts++;
            }
            cpu.wz = cpu.pc + 1;
        }
    }
    cpu.f = flags;
}

function Indr(cpu: Z80Cpu) {
    // pc+1:5 -> remaining 1
    cpu.tacts++;

    cpu.wz = cpu.bc - 1;

    // I/O
    const val = cpu.readPort(cpu.bc);

    // hl:3
    cpu.writeMemory(cpu.hl, val);
    cpu.tacts += 3;

    cpu.f = decOpFlags[cpu.b] | (cpu.f & FlagsSetMask.C);
    cpu.b--;
    cpu.hl--;

    if (cpu.b !== 0) {
        cpu.f |= FlagsSetMask.PV;
        cpu.pc -= 2;
        if (cpu.useGateArrayContention) {
            cpu.tacts += 5;
        } else {
            cpu.readMemory(cpu.hl + 1);
            cpu.tacts++;
            cpu.readMemory(cpu.hl + 1);
            cpu.tacts++;
            cpu.readMemory(cpu.hl + 1);
            cpu.tacts++;
            cpu.readMemory(cpu.hl + 1);
            cpu.tacts++;
            cpu.readMemory(cpu.hl + 1);
            cpu.tacts++;
        }
    } else {
        cpu.f &= FlagsResetMask.PV;
    }
}

function Otdr(cpu: Z80Cpu) {
    // pc+1:5 -> remaining 1
    cpu.tacts++;

    cpu.f = decOpFlags[cpu.b];
    cpu.b--;

    // hl:3
    const val = cpu.readMemory(cpu.hl--);
    cpu.tacts += 3;

    // I/O
    cpu.writePort(cpu.bc, val);

    if (cpu.b !== 0) {
        cpu.f |= FlagsSetMask.PV;
        cpu.pc -= 2;
        if (cpu.useGateArrayContention) {
            cpu.tacts += 5;
        } else {
            cpu.readMemory(cpu.bc);
            cpu.tacts++;
            cpu.readMemory(cpu.bc);
            cpu.tacts++;
            cpu.readMemory(cpu.bc);
            cpu.tacts++;
            cpu.readMemory(cpu.bc);
            cpu.tacts++;
            cpu.readMemory(cpu.bc);
            cpu.tacts++;
        }
    } else {
        cpu.f &= FlagsResetMask.PV;
    }
    cpu.f &= FlagsResetMask.C;
    if (cpu.l === 0xFF) {
        cpu.f |= FlagsSetMask.C;
    }
    cpu.wz = cpu.bc - 1;
}

function Lddrx(cpu: Z80Cpu) {
    if (!cpu.allowExtendedInstructionSet) {
        return;
    }
    let memVal = cpu.readMemory(cpu.hl--);
    cpu.tacts += 3;
    if (cpu.a !== memVal) {
        cpu.writeMemory(cpu.de, memVal);
        cpu.tacts += 3;
    }
    cpu.tacts += 2;
    cpu.de--;
    memVal += cpu.a;
    memVal = (memVal & FlagsSetMask.R3) | ((memVal << 4) & FlagsSetMask.R5);
    cpu.f = (cpu.f 
        & ~(FlagsSetMask.N | FlagsSetMask.H | FlagsSetMask.PV | FlagsSetMask.R3 | FlagsSetMask.R5)) | memVal;
    if (--cpu.bc === 0) {
        return;
    }
    cpu.f |= FlagsSetMask.PV;
    cpu.pc -= 2;
    cpu.tacts += 5;
    cpu.wz = cpu.pc + 1;
}

function Ldirscale(cpu: Z80Cpu) {
    if (!cpu.allowExtendedInstructionSet) {
        return;
    }
    let memVal = cpu.readMemory(cpu.hl++);
    cpu.tacts += 3;
    if (cpu.a !== memVal) {
        cpu.writeMemory(cpu.de, memVal);
        cpu.tacts += 3;
    }
    cpu.tacts += 2;

    const hl_a = cpu.hl << 8 + (cpu._af_ >> 8) + cpu._bc_;
    cpu.hl = hl_a >> 8;
    cpu._af_ = ((hl_a << 8) & 0x0F) | (cpu._af_ & 0x0F);
    cpu.de += cpu._de_;

    memVal += cpu.a;
    memVal = (memVal & FlagsSetMask.R3) | ((memVal << 4) & FlagsSetMask.R5);
    cpu.f = (cpu.f 
        & ~(FlagsSetMask.N | FlagsSetMask.H | FlagsSetMask.PV | FlagsSetMask.R3 | FlagsSetMask.R5)) | memVal;
    if (--cpu.bc === 0) {
        return;
    }
    cpu.f |= FlagsSetMask.PV;
    cpu.pc -= 2;
    cpu.tacts += 5;
    cpu.wz = cpu.pc + 1;
}

function Ldpirx(cpu: Z80Cpu) {
    if (!cpu.allowExtendedInstructionSet) {
        return;
    }
    const addr = (cpu.hl & 0xFFFF8) + (cpu.e & 0x07);
    var memVal = cpu.readMemory(addr);
    cpu.tacts += 3;
    if (cpu.a !== memVal) {
        cpu.writeMemory(cpu.de, memVal);
        cpu.tacts += 3;
    }
    cpu.tacts += 2;
    cpu.de++;
    memVal += cpu.a;
    memVal = (memVal & FlagsSetMask.R3) | ((memVal << 4) & FlagsSetMask.R5);
    cpu.f = (cpu.f 
        & ~(FlagsSetMask.N | FlagsSetMask.H | FlagsSetMask.PV | FlagsSetMask.R3 | FlagsSetMask.R5)) | memVal;
    if (--cpu.bc !== 0) {
        cpu.f |= FlagsSetMask.PV;
    }
}

// ========================================================================
// Processing bit (CB prefix) Z80 instructions    

function RlcB(cpu: Z80Cpu) {
    const rlcVal = cpu.b;
    cpu.b = rolOpResults[rlcVal];
    cpu.f = rlcFlags[rlcVal];
}

function RlcC(cpu: Z80Cpu) {
    const rlcVal = cpu.c;
    cpu.c = rolOpResults[rlcVal];
    cpu.f = rlcFlags[rlcVal];
}

function RlcD(cpu: Z80Cpu) {
    const rlcVal = cpu.d;
    cpu.d = rolOpResults[rlcVal];
    cpu.f = rlcFlags[rlcVal];
}

function RlcE(cpu: Z80Cpu) {
    const rlcVal = cpu.e;
    cpu.e = rolOpResults[rlcVal];
    cpu.f = rlcFlags[rlcVal];
}

function RlcH(cpu: Z80Cpu) {
    const rlcVal = cpu.h;
    cpu.h = rolOpResults[rlcVal];
    cpu.f = rlcFlags[rlcVal];
}

function RlcL(cpu: Z80Cpu) {
    const rlcVal = cpu.l;
    cpu.l = rolOpResults[rlcVal];
    cpu.f = rlcFlags[rlcVal];
}

function RlcHLi(cpu: Z80Cpu) {
    const rlcVal = cpu.readMemory(cpu.hl);
    cpu.f = rlcFlags[rlcVal];
    if (cpu.useGateArrayContention) {
        cpu.tacts += 4;
    } else {
        cpu.tacts += 3;
        cpu.readMemory(cpu.hl);
        cpu.tacts++;
    }
    cpu.writeMemory(cpu.hl, rolOpResults[rlcVal]);
    cpu.tacts += 3;
}

function RlcA(cpu: Z80Cpu) {
    const rlcVal = cpu.a;
    cpu.a = rolOpResults[rlcVal];
    cpu.f = rlcFlags[rlcVal];
}

function RrcB(cpu: Z80Cpu) {
    const rrcVal = cpu.b;
    cpu.b = rorOpResults[rrcVal];
    cpu.f = rrcFlags[rrcVal];
}

function RrcC(cpu: Z80Cpu) {
    const rrcVal = cpu.c;
    cpu.c = rorOpResults[rrcVal];
    cpu.f = rrcFlags[rrcVal];
}

function RrcD(cpu: Z80Cpu) {
    const rrcVal = cpu.d;
    cpu.d = rorOpResults[rrcVal];
    cpu.f = rrcFlags[rrcVal];
}

function RrcE(cpu: Z80Cpu) {
    const rrcVal = cpu.e;
    cpu.e = rorOpResults[rrcVal];
    cpu.f = rrcFlags[rrcVal];
}

function RrcH(cpu: Z80Cpu) {
    const rrcVal = cpu.h;
    cpu.h = rorOpResults[rrcVal];
    cpu.f = rrcFlags[rrcVal];
}

function RrcL(cpu: Z80Cpu) {
    const rrcVal = cpu.l;
    cpu.l = rorOpResults[rrcVal];
    cpu.f = rrcFlags[rrcVal];
}

function RrcHLi(cpu: Z80Cpu) {
    const rrcVal = cpu.readMemory(cpu.hl);
    cpu.f = rrcFlags[rrcVal];
    if (cpu.useGateArrayContention) {
        cpu.tacts += 4;
    } else {
        cpu.tacts += 3;
        cpu.readMemory(cpu.hl);
        cpu.tacts++;
    }
    cpu.writeMemory(cpu.hl, rorOpResults[rrcVal]);
    cpu.tacts += 3;
}

function RrcA(cpu: Z80Cpu) {
    const rrcVal = cpu.a;
    cpu.a = rorOpResults[rrcVal];
    cpu.f = rrcFlags[rrcVal];
}

function RlB(cpu: Z80Cpu) {
    const rlVal = cpu.b;
    if (cpu.cFlag) {
        cpu.f = rlCarry1Flags[rlVal];
        cpu.b = (rlVal << 1) + 1;
    } else {
        cpu.f = rlCarry0Flags[rlVal];
        cpu.b = rlVal << 1;
    }
}

function RlC(cpu: Z80Cpu) {
    const rlVal = cpu.c;
    if (cpu.cFlag) {
        cpu.f = rlCarry1Flags[rlVal];
        cpu.c = (rlVal << 1) + 1;
    } else {
        cpu.f = rlCarry0Flags[rlVal];
        cpu.c = rlVal << 1;
    }
}

function RlD(cpu: Z80Cpu) {
    const rlVal = cpu.d;
    if (cpu.cFlag) {
        cpu.f = rlCarry1Flags[rlVal];
        cpu.d = (rlVal << 1) + 1;
    } else {
        cpu.f = rlCarry0Flags[rlVal];
        cpu.d = rlVal << 1;
    }
}

function RlE(cpu: Z80Cpu) {
    const rlVal = cpu.e;
    if (cpu.cFlag) {
        cpu.f = rlCarry1Flags[rlVal];
        cpu.e = (rlVal << 1) + 1;
    } else {
        cpu.f = rlCarry0Flags[rlVal];
        cpu.e = rlVal << 1;
    }
}

function RlH(cpu: Z80Cpu) {
    const rlVal = cpu.h;
    if (cpu.cFlag) {
        cpu.f = rlCarry1Flags[rlVal];
        cpu.h = (rlVal << 1) + 1;
    } else {
        cpu.f = rlCarry0Flags[rlVal];
        cpu.h = rlVal << 1;
    }
}

function RlL(cpu: Z80Cpu) {
    const rlVal = cpu.l;
    if (cpu.cFlag) {
        cpu.f = rlCarry1Flags[rlVal];
        cpu.l = (rlVal << 1) + 1;
    } else {
        cpu.f = rlCarry0Flags[rlVal];
        cpu.l = rlVal << 1;
    }
}

function RlHLi(cpu: Z80Cpu) {
    var rlVal = cpu.readMemory(cpu.hl);
    if (cpu.cFlag)
    {
        cpu.f = rlCarry1Flags[rlVal];
        rlVal = (rlVal << 1) + 1;
    }
    else
    {
        cpu.f = rlCarry0Flags[rlVal];
        rlVal = rlVal << 1;
    }
    if (cpu.useGateArrayContention) {
        cpu.tacts += 4;
    } else {
        cpu.tacts += 3;
        cpu.readMemory(cpu.hl);
        cpu.tacts++;
    }
    cpu.writeMemory(cpu.hl, rlVal);
    cpu.tacts += 3;
}

function RlA(cpu: Z80Cpu) {
    const rlVal = cpu.a;
    if (cpu.cFlag) {
        cpu.f = rlCarry1Flags[rlVal];
        cpu.a = (rlVal << 1) + 1;
    } else {
        cpu.f = rlCarry0Flags[rlVal];
        cpu.a = rlVal << 1;
    }
}

function RrB(cpu: Z80Cpu) {
    const rrVal = cpu.b;
    if (cpu.cFlag) {
        cpu.f = rrCarry1Flags[rrVal];
        cpu.b = (rrVal >> 1) + 0x80;
    } else {
        cpu.f = rrCarry0Flags[rrVal];
        cpu.b = rrVal >> 1;
    }
}

function RrC(cpu: Z80Cpu) {
    const rrVal = cpu.c;
    if (cpu.cFlag) {
        cpu.f = rrCarry1Flags[rrVal];
        cpu.c = (rrVal >> 1) + 0x80;
    } else {
        cpu.f = rrCarry0Flags[rrVal];
        cpu.c = rrVal >> 1;
    }
}

function RrD(cpu: Z80Cpu) {
    const rrVal = cpu.d;
    if (cpu.cFlag) {
        cpu.f = rrCarry1Flags[rrVal];
        cpu.d = (rrVal >> 1) + 0x80;
    } else {
        cpu.f = rrCarry0Flags[rrVal];
        cpu.d = rrVal >> 1;
    }
}

function RrE(cpu: Z80Cpu) {
    const rrVal = cpu.e;
    if (cpu.cFlag) {
        cpu.f = rrCarry1Flags[rrVal];
        cpu.e = (rrVal >> 1) + 0x80;
    } else {
        cpu.f = rrCarry0Flags[rrVal];
        cpu.e = rrVal >> 1;
    }
}

function RrH(cpu: Z80Cpu) {
    const rrVal = cpu.h;
    if (cpu.cFlag) {
        cpu.f = rrCarry1Flags[rrVal];
        cpu.h = (rrVal >> 1) + 0x80;
    } else {
        cpu.f = rrCarry0Flags[rrVal];
        cpu.h = rrVal >> 1;
    }
}

function RrL(cpu: Z80Cpu) {
    const rrVal = cpu.l;
    if (cpu.cFlag) {
        cpu.f = rrCarry1Flags[rrVal];
        cpu.l = (rrVal >> 1) + 0x80;
    } else {
        cpu.f = rrCarry0Flags[rrVal];
        cpu.l = rrVal >> 1;
    }
}

function RrHLi(cpu: Z80Cpu) {
    let rrVal = cpu.readMemory(cpu.hl);
    if (cpu.cFlag) {
        cpu.f = rrCarry1Flags[rrVal];
        rrVal = (rrVal >> 1) + 0x80;
    } else {
        cpu.f = rrCarry0Flags[rrVal];
        rrVal = rrVal >> 1;
    }
    if (cpu.useGateArrayContention) {
        cpu.tacts += 4;
    } else {
        cpu.tacts += 3;
        cpu.readMemory(cpu.hl);
        cpu.tacts++;
    }
    cpu.writeMemory(cpu.hl, rrVal);
    cpu.tacts += 3;
}

function RrA(cpu: Z80Cpu) {
    const rrVal = cpu.a;
    if (cpu.cFlag) {
        cpu.f = rrCarry1Flags[rrVal];
        cpu.a = (rrVal >> 1) + 0x80;
    } else {
        cpu.f = rrCarry0Flags[rrVal];
        cpu.a = rrVal >> 1;
    }
}

function SlaB(cpu: Z80Cpu) {
    const slaVal = cpu.b;
    cpu.f = rlCarry0Flags[slaVal];
    cpu.b = slaVal << 1;
}

function SlaC(cpu: Z80Cpu) {
    const slaVal = cpu.c;
    cpu.f = rlCarry0Flags[slaVal];
    cpu.c = slaVal << 1;
}

function SlaD(cpu: Z80Cpu) {
    const slaVal = cpu.d;
    cpu.f = rlCarry0Flags[slaVal];
    cpu.d = slaVal << 1;
}

function SlaE(cpu: Z80Cpu) {
    const slaVal = cpu.e;
    cpu.f = rlCarry0Flags[slaVal];
    cpu.e = slaVal << 1;
}

function SlaH(cpu: Z80Cpu) {
    const slaVal = cpu.h;
    cpu.f = rlCarry0Flags[slaVal];
    cpu.h = slaVal << 1;
}

function SlaL(cpu: Z80Cpu) {
    const slaVal = cpu.l;
    cpu.f = rlCarry0Flags[slaVal];
    cpu.l = slaVal << 1;
}

function SlaHLi(cpu: Z80Cpu) {
    let slaVal = cpu.readMemory(cpu.hl);
    cpu.f = rlCarry0Flags[slaVal];
    slaVal <<= 1;
    if (cpu.useGateArrayContention) {
        cpu.tacts += 4;
    } else {
        cpu.tacts += 3;
        cpu.readMemory(cpu.hl);
        cpu.tacts++;
    }
    cpu.writeMemory(cpu.hl, slaVal);
    cpu.tacts += 3;
}

function SlaA(cpu: Z80Cpu) {
    const slaVal = cpu.a;
    cpu.f = rlCarry0Flags[slaVal];
    cpu.a = slaVal << 1;
}

function SraB(cpu: Z80Cpu) {
    const sraVal = cpu.b;
    cpu.f = sraFlags[sraVal];
    cpu.b = (sraVal >> 1) + (sraVal & 0x80);
}

function SraC(cpu: Z80Cpu) {
    const sraVal = cpu.c;
    cpu.f = sraFlags[sraVal];
    cpu.c = (sraVal >> 1) + (sraVal & 0x80);
}

function SraD(cpu: Z80Cpu) {
    const sraVal = cpu.d;
    cpu.f = sraFlags[sraVal];
    cpu.d = (sraVal >> 1) + (sraVal & 0x80);
}

function SraE(cpu: Z80Cpu) {
    const sraVal = cpu.e;
    cpu.f = sraFlags[sraVal];
    cpu.e = (sraVal >> 1) + (sraVal & 0x80);
}

function SraH(cpu: Z80Cpu) {
    const sraVal = cpu.h;
    cpu.f = sraFlags[sraVal];
    cpu.h = (sraVal >> 1) + (sraVal & 0x80);
}

function SraL(cpu: Z80Cpu) {
    const sraVal = cpu.l;
    cpu.f = sraFlags[sraVal];
    cpu.l = (sraVal >> 1) + (sraVal & 0x80);
}

function SraHLi(cpu: Z80Cpu) {
    let sraVal = cpu.readMemory(cpu.hl);
    cpu.f = sraFlags[sraVal];
    sraVal = (sraVal >> 1) + (sraVal & 0x80);
    if (cpu.useGateArrayContention) {
        cpu.tacts += 4;
    } else {
        cpu.tacts += 3;
        cpu.readMemory(cpu.hl);
        cpu.tacts++;
    }
    cpu.writeMemory(cpu.hl, sraVal);
    cpu.tacts += 3;
}

function SraA(cpu: Z80Cpu) {
    const sraVal = cpu.a;
    cpu.f = sraFlags[sraVal];
    cpu.a = (sraVal >> 1) + (sraVal & 0x80);
}

function SllB(cpu: Z80Cpu) {
    const sllVal = cpu.b;
    cpu.f = rlCarry1Flags[sllVal];
    cpu.b = (sllVal << 1) + 1;
}

function SllC(cpu: Z80Cpu) {
    const sllVal = cpu.c;
    cpu.f = rlCarry1Flags[sllVal];
    cpu.c = (sllVal << 1) + 1;
}

function SllD(cpu: Z80Cpu) {
    const sllVal = cpu.d;
    cpu.f = rlCarry1Flags[sllVal];
    cpu.d = (sllVal << 1) + 1;
}

function SllE(cpu: Z80Cpu) {
    const sllVal = cpu.e;
    cpu.f = rlCarry1Flags[sllVal];
    cpu.e = (sllVal << 1) + 1;
}

function SllH(cpu: Z80Cpu) {
    const sllVal = cpu.h;
    cpu.f = rlCarry1Flags[sllVal];
    cpu.h = (sllVal << 1) + 1;
}

function SllL(cpu: Z80Cpu) {
    const sllVal = cpu.l;
    cpu.f = rlCarry1Flags[sllVal];
    cpu.l = (sllVal << 1) + 1;
}

function SllHLi(cpu: Z80Cpu) {
    let sllVal = cpu.readMemory(cpu.hl);
    cpu.f = rlCarry1Flags[sllVal];
    sllVal <<= 1;
    sllVal++;
    if (cpu.useGateArrayContention) {
        cpu.tacts += 4;
    } else {
        cpu.tacts += 3;
        cpu.readMemory(cpu.hl);
        cpu.tacts++;
    }
    cpu.writeMemory(cpu.hl, sllVal);
    cpu.tacts += 3;
}

function SllA(cpu: Z80Cpu) {
    const sllVal = cpu.a;
    cpu.f = rlCarry1Flags[sllVal];
    cpu.a = (sllVal << 1) + 1;
}

function SrlB(cpu: Z80Cpu) {
    const srlVal = cpu.b;
    cpu.f = rrCarry0Flags[srlVal];
    cpu.b = srlVal >> 1;
}

function SrlC(cpu: Z80Cpu) {
    const srlVal = cpu.c;
    cpu.f = rrCarry0Flags[srlVal];
    cpu.c = srlVal >> 1;
}

function SrlD(cpu: Z80Cpu) {
    const srlVal = cpu.d;
    cpu.f = rrCarry0Flags[srlVal];
    cpu.d = srlVal >> 1;
}

function SrlE(cpu: Z80Cpu) {
    const srlVal = cpu.e;
    cpu.f = rrCarry0Flags[srlVal];
    cpu.e = srlVal >> 1;
}

function SrlH(cpu: Z80Cpu) {
    const srlVal = cpu.h;
    cpu.f = rrCarry0Flags[srlVal];
    cpu.h = srlVal >> 1;
}

function SrlL(cpu: Z80Cpu) {
    const srlVal = cpu.l;
    cpu.f = rrCarry0Flags[srlVal];
    cpu.l = srlVal >> 1;
}

function SrlHLi(cpu: Z80Cpu) {
    let srlVal = cpu.readMemory(cpu.hl);
    cpu.f = rlCarry0Flags[srlVal];
    srlVal >>= 1;
    if (cpu.useGateArrayContention) {
        cpu.tacts += 4;
    } else {
        cpu.tacts += 3;
        cpu.readMemory(cpu.hl);
        cpu.tacts++;
    }
    cpu.writeMemory(cpu.hl, srlVal);
    cpu.tacts += 3;
}

function SrlA(cpu: Z80Cpu) {
    const srlVal = cpu.a;
    cpu.f = rrCarry0Flags[srlVal];
    cpu.a = srlVal >> 1;
}

function BitN_Q(cpu: Z80Cpu) {
    const q = cpu.opCode & 0x07;
    const n = (cpu.opCode & 0x38) >> 3;
    const srcVal = cpu.getReg8(q);
    const testVal = srcVal & (1 << n);
    var flags = FlagsSetMask.H
        | (cpu.f & FlagsSetMask.C)
        | (srcVal & (FlagsSetMask.R3 | FlagsSetMask.R5));
    if (testVal === 0) {
        flags |= FlagsSetMask.Z | FlagsSetMask.PV;
    }
    if (n === 7 && testVal !== 0) {
        flags |= FlagsSetMask.S;
    }
    cpu.f = flags;
}

function BinN_HLi(cpu: Z80Cpu) {
    const srcVal = cpu.readMemory(cpu.hl);
    const n = (cpu.opCode & 0x38) >> 3;
    const testVal = srcVal & (1 << n);
    var flags = FlagsSetMask.H
        | (cpu.f & FlagsSetMask.C)
        | (srcVal & (FlagsSetMask.R3 | FlagsSetMask.R5));
    if (testVal === 0) {
        flags |= FlagsSetMask.Z | FlagsSetMask.PV;
    }
    if (n === 7 && testVal !== 0) {
        flags |= FlagsSetMask.S;
    }
    flags = (flags & (FlagsResetMask.R3 | FlagsResetMask.R5) 
        | (cpu.wzh & (FlagsSetMask.R3 | FlagsSetMask.R5)));

    cpu.f = flags;
    if (cpu.useGateArrayContention) {
        cpu.tacts += 4;
    } else {
        cpu.tacts += 3;
        cpu.readMemory(cpu.hl);
        cpu.tacts++;
    }
}

function ResN_Q(cpu: Z80Cpu) {
    const q = cpu.opCode & 0x07;
    const n = (cpu.opCode & 0x38) >> 3;
    cpu.setReg8(q, cpu.getReg8(q) & ~(1 << n));
}

function ResN_HLi(cpu: Z80Cpu) {
    let memVal = cpu.readMemory(cpu.hl);
    const n = (cpu.opCode & 0x38) >> 3;
    memVal &= ~(1 << n);
    if (cpu.useGateArrayContention) {
        cpu.tacts += 4;
    } else {
        cpu.tacts += 3;
        cpu.readMemory(cpu.hl);
        cpu.tacts++;
    }
    cpu.writeMemory(cpu.hl, memVal);
    cpu.tacts += 3;
}

function SetN_Q(cpu: Z80Cpu) {
    const q = cpu.opCode & 0x07;
    const n = (cpu.opCode & 0x38) >> 3;
    cpu.setReg8(q, cpu.getReg8(q) | (1 << n));
}

function SetN_HLi(cpu: Z80Cpu) {
    let memVal = cpu.readMemory(cpu.hl);
    const n = (cpu.opCode & 0x38) >> 3;
    memVal |= 1 << n;
    if (cpu.useGateArrayContention) {
        cpu.tacts += 4;
    } else {
        cpu.tacts += 3;
        cpu.readMemory(cpu.hl);
        cpu.tacts++;
    }
    cpu.writeMemory(cpu.hl, memVal);
    cpu.tacts += 3;
}

// ========================================================================
// Processing indexed (DD or FD prefix) Z80 instructions    

function AddIX_QQ(cpu: Z80Cpu) {
    const ixVal = cpu.getIndexReg();
    cpu.wz = ixVal + 1;

    const qq = (cpu.opCode & 0x30) >> 4;
    const qqVal = qq ===2 ? ixVal : cpu.getReg16(qq);
    cpu.tacts += 4;

    const result = qqVal + ixVal;
    cpu.f = cpu.f & (FlagsSetMask.S | FlagsSetMask.Z | FlagsSetMask.PV);
    cpu.f |= (((result >> 8) & 0xFF) & (FlagsSetMask.R5 | FlagsSetMask.R3));
    cpu.f |= (((ixVal & 0x0FFF) + (qqVal & 0x0FFF)) >> 8) & FlagsSetMask.H;
    if ((result & 0x10000) !== 0) {
        cpu.f |= FlagsSetMask.C;
    }
    cpu.setIndexReg(result);
    cpu.tacts += 3;
}

function LdIX_NN(cpu: Z80Cpu) {
    const l = cpu.readCodeMemory();
    cpu.tacts += 3;
    cpu.incPc();
    const nn = cpu.readCodeMemory() << 8 | l;
    cpu.tacts += 3;
    cpu.incPc();
    cpu.setIndexReg(nn);
}

function LdNNi_IX(cpu: Z80Cpu) {
    const ixVal = cpu.getIndexReg();
    const l = cpu.readCodeMemory();
    cpu.tacts += 3;
    cpu.incPc();
    const addr = cpu.readCodeMemory() << 8 | l;
    cpu.tacts += 3;
    cpu.incPc();
    cpu.wz = addr + 1;
    cpu.writeMemory(addr, ixVal & 0xFF);
    cpu.tacts += 3;
    cpu.writeMemory(cpu.wz, (ixVal >> 8) & 0xFF);
    cpu.tacts += 3;
}

function IncIX(cpu: Z80Cpu) {
    cpu.setIndexReg((cpu.getIndexReg() + 1));
    cpu.tacts += 2;
}

function IncXH(cpu: Z80Cpu) {
    const ixVal = cpu.getIndexReg();
    const hVal = cpu.aluIncByte(ixVal >> 8);
    cpu.setIndexReg(hVal << 8 | (ixVal & 0xFF));
}

function LdXH_N(cpu: Z80Cpu) {
    const val = cpu.readCodeMemory();
    cpu.tacts += 3;
    cpu.incPc();
    cpu.setIndexReg(val << 8 | (cpu.getIndexReg() & 0xFF));
}

function LdIX_NNi(cpu: Z80Cpu) {
    const l = cpu.readCodeMemory();
    cpu.tacts += 3;
    cpu.incPc();
    const addr = cpu.readCodeMemory() << 8 | l;
    cpu.tacts += 3;
    cpu.incPc();
    cpu.wz = addr + 1;
    let val = cpu.readMemory(addr);
    cpu.tacts += 3;
    val += cpu.readMemory(cpu.wz) << 8;
    cpu.tacts += 3;
    cpu.setIndexReg(val);
}

function DecIX(cpu: Z80Cpu) {
    cpu.setIndexReg((cpu.getIndexReg() - 1));
    cpu.tacts += 2;
}

function DecXH(cpu: Z80Cpu) {
    const ixVal = cpu.getIndexReg();
    const hVal = cpu.aluDecByte(ixVal >> 8);
    cpu.setIndexReg(hVal << 8 | (ixVal & 0xFF));
}

function IncXL(cpu: Z80Cpu) {
    const ixVal = cpu.getIndexReg();
    const lVal = cpu.aluIncByte(ixVal);
    cpu.setIndexReg(ixVal & 0xFF00 | lVal);
}

function DecXL(cpu: Z80Cpu) {
    const ixVal = cpu.getIndexReg();
    const lVal = cpu.aluDecByte(ixVal);
    cpu.setIndexReg(ixVal & 0xFF00 | lVal);
}

function LdXL_N(cpu: Z80Cpu) {
    const val = cpu.readCodeMemory();
    cpu.tacts += 3;
    cpu.incPc();
    cpu.setIndexReg(cpu.getIndexReg() & 0xFF00 | val);
}

function IncIXi(cpu: Z80Cpu) {
    const ixVal = cpu.getIndexReg();
    const offset = cpu.readCodeMemory();
    cpu.tacts += 3;
    if (cpu.useGateArrayContention) {
        cpu.tacts += 5;
    } else {
        cpu.readMemory(cpu.pc);
        cpu.tacts++;
        cpu.readMemory(cpu.pc);
        cpu.tacts++;
        cpu.readMemory(cpu.pc);
        cpu.tacts++;
        cpu.readMemory(cpu.pc);
        cpu.tacts++;
        cpu.readMemory(cpu.pc);
        cpu.tacts++;
    }
    cpu.incPc();
    const addr = ixVal + toSbyte(offset);
    let memVal = cpu.readMemory(addr);
    cpu.tacts += 3;
    memVal = cpu.aluIncByte(memVal);
    cpu.tacts++;
    cpu.writeMemory(addr, memVal);
    cpu.tacts += 3;
}

function DecIXi(cpu: Z80Cpu) {
    const ixVal = cpu.getIndexReg();
    const offset = cpu.readCodeMemory();
    cpu.tacts += 3;
    if (cpu.useGateArrayContention) {
        cpu.tacts += 5;
    } else {
        cpu.readMemory(cpu.pc);
        cpu.tacts++;
        cpu.readMemory(cpu.pc);
        cpu.tacts++;
        cpu.readMemory(cpu.pc);
        cpu.tacts++;
        cpu.readMemory(cpu.pc);
        cpu.tacts++;
        cpu.readMemory(cpu.pc);
        cpu.tacts++;
    }
    cpu.incPc();
    const addr = ixVal + toSbyte(offset);
    let memVal = cpu.readMemory(addr);
    cpu.tacts += 3;
    memVal = cpu.aluDecByte(memVal);
    cpu.tacts++;
    cpu.writeMemory(addr, memVal);
    cpu.tacts += 3;
}

function LdIXi_NN(cpu: Z80Cpu) {
    const ixVal = cpu.getIndexReg();
    const offset = cpu.readCodeMemory();
    cpu.tacts += 3;
    cpu.incPc();
    const val = cpu.readCodeMemory();
    cpu.tacts += 3;
    if (cpu.useGateArrayContention) {
        cpu.tacts += 2;
    } else {
        cpu.readMemory(cpu.pc);
        cpu.tacts++;
        cpu.readMemory(cpu.pc);
        cpu.tacts++;
    }
    cpu.incPc();
    const addr = ixVal + toSbyte(offset);
    cpu.writeMemory(addr, val);
    cpu.tacts += 3;
}

function LdQ_XH(cpu: Z80Cpu) {
    const q = (cpu.opCode & 0x38) >> 3;
    const ixVal = cpu.getIndexReg();
    cpu.setReg8(q, ixVal >> 8);
}

function LdQ_XL(cpu: Z80Cpu) {
    const q = (cpu.opCode & 0x38) >> 3;
    const ixVal = cpu.getIndexReg();
    cpu.setReg8(q, ixVal & 0xFF);
}

function LdQ_IXi(cpu: Z80Cpu) {
    const q = (cpu.opCode & 0x38) >> 3;
    const ixVal = cpu.getIndexReg();
    const offset = cpu.readCodeMemory();
    cpu.tacts += 3;
    if (cpu.useGateArrayContention) {
        cpu.tacts += 5;
    } else {
        cpu.readMemory(cpu.pc);
        cpu.tacts++;
        cpu.readMemory(cpu.pc);
        cpu.tacts++;
        cpu.readMemory(cpu.pc);
        cpu.tacts++;
        cpu.readMemory(cpu.pc);
        cpu.tacts++;
        cpu.readMemory(cpu.pc);
        cpu.tacts++;
    }
    cpu.incPc();
    const addr = ixVal + toSbyte(offset);
    cpu.setReg8(q, cpu.readMemory(addr));
    cpu.tacts += 3;
}

function LdXH_Q(cpu: Z80Cpu) {
    const q = cpu.opCode & 0x07;
    const ixVal = cpu.getIndexReg();
    cpu.setIndexReg(cpu.getReg8(q) << 8 | ixVal & 0xFF);
}

function LdXH_XL(cpu: Z80Cpu) {
    const ixVal = cpu.getIndexReg();
    cpu.setIndexReg((ixVal & 0xFF) << 8 | ixVal & 0xFF);
}

function LdXL_Q(cpu: Z80Cpu) {
    const q = cpu.opCode & 0x07;
    const ixVal = cpu.getIndexReg();
    cpu.setIndexReg(ixVal & 0xFF00 | cpu.getReg8(q));
}

function LdIXi_Q(cpu: Z80Cpu) {
    const q = cpu.opCode & 0x07;
    const ixVal = cpu.getIndexReg();
    const offset = cpu.readCodeMemory();
    cpu.tacts += 3;
    if (cpu.useGateArrayContention) {
        cpu.tacts += 5;
    } else {
        cpu.readMemory(cpu.pc);
        cpu.tacts++;
        cpu.readMemory(cpu.pc);
        cpu.tacts++;
        cpu.readMemory(cpu.pc);
        cpu.tacts++;
        cpu.readMemory(cpu.pc);
        cpu.tacts++;
        cpu.readMemory(cpu.pc);
        cpu.tacts++;
    }
    cpu.incPc();
    const addr = ixVal + toSbyte(offset);
    cpu.writeMemory(addr, cpu.getReg8(q));
    cpu.tacts += 3;
}

function LdXL_XH(cpu: Z80Cpu) {
    const ixVal = cpu.getIndexReg();
    cpu.setIndexReg(ixVal & 0xFF00 | (ixVal >> 8));
}

function AluA_XH(cpu: Z80Cpu) {
    const ix = cpu.getIndexReg();
    const op = (cpu.opCode & 0x38) >> 3;
    aluAlgorithms[op](cpu, ix >> 8, cpu.cFlag);
}

function AluA_XL(cpu: Z80Cpu) {
    const ix = cpu.getIndexReg();
    const op = (cpu.opCode & 0x38) >> 3;
    aluAlgorithms[op](cpu, ix & 0xFF, cpu.cFlag);
}

function AluA_IXi(cpu: Z80Cpu) {
    const ixVal = cpu.getIndexReg();
    const offset = cpu.readCodeMemory();
    cpu.tacts += 3;
    if (cpu.useGateArrayContention) {
        cpu.tacts += 5;
    } else {
        cpu.readMemory(cpu.pc);
        cpu.tacts++;
        cpu.readMemory(cpu.pc);
        cpu.tacts++;
        cpu.readMemory(cpu.pc);
        cpu.tacts++;
        cpu.readMemory(cpu.pc);
        cpu.tacts++;
        cpu.readMemory(cpu.pc);
        cpu.tacts++;
    }
    cpu.incPc();
    const addr = ixVal + toSbyte(offset);
    const op = (cpu.opCode & 0x38) >> 3;
    aluAlgorithms[op](cpu, cpu.readMemory(addr), cpu.cFlag);
    cpu.tacts += 3;
}

function ExSPiIX(cpu: Z80Cpu) {
    let spOld = cpu.sp;
    const ix = cpu.getIndexReg();
    const l = cpu.readMemory(spOld);
    cpu.tacts += 3;
    const h = cpu.readMemory(++spOld);
    if (cpu.useGateArrayContention) {
        cpu.tacts += 4;
    } else {
        cpu.tacts += 3;
        cpu.readMemory(spOld);
        cpu.tacts++;
    }
    cpu.writeMemory(spOld, ix >> 8);
    cpu.tacts += 3;
    cpu.writeMemory(--spOld, ix & 0xFF);
    if (cpu.useGateArrayContention) {
        cpu.tacts += 5;
    } else {
        cpu.tacts += 3;
        cpu.readMemory(spOld);
        cpu.tacts++;
        cpu.readMemory(spOld);
        cpu.tacts++;
    }
    cpu.wz = h << 8 | l;
    cpu.setIndexReg(cpu.wz);

    if (cpu.stackDebugSupport !== undefined) {
        cpu.stackDebugSupport.recordStackContentManipulationEvent(
            new StackContentManipulationEvent(cpu.pc - 2,
                cpu.indexMode === OpIndexMode.IX ? 'ex (sp),ix' : 'ex (sp),iy',
                cpu.sp,
                cpu.wz,
                cpu.tacts));
    }
}

function PushIX(cpu: Z80Cpu) {
    const ix = cpu.getIndexReg();
    cpu.sp--;
    cpu.tacts++;
    cpu.writeMemory(cpu.sp, ix >> 8);
    cpu.tacts += 3;
    cpu.sp--;
    cpu.writeMemory(cpu.sp, ix & 0xFF);
    cpu.tacts += 3;

    if (cpu.stackDebugSupport !== undefined) {
        cpu.stackDebugSupport.recordStackContentManipulationEvent(
            new StackContentManipulationEvent(cpu.pc - 2,
                cpu.indexMode === OpIndexMode.IX ? 'push ix' : 'push iy',
                cpu.sp,
                ix,
                cpu.tacts));
    }
}

function PopIX(cpu: Z80Cpu) {
    const oldSp = cpu.sp;
    let val = cpu.readMemory(cpu.sp);
    cpu.tacts += 3;
    cpu.sp++;
    val += cpu.readMemory(cpu.sp) * 0x100;
    cpu.tacts += 3;
    cpu.sp++;
    cpu.setIndexReg(val);

    if (cpu.stackDebugSupport !== undefined) {
        cpu.stackDebugSupport.recordStackContentManipulationEvent(
            new StackContentManipulationEvent(cpu.pc - 2,
                cpu.indexMode === OpIndexMode.IX ? 'pop ix' : 'pop iy',
                cpu.sp,
                cpu.getIndexReg(),
                cpu.tacts));
    }
}

function JpIXi(cpu: Z80Cpu) {
    const oldPc = cpu.pc - 2;
    cpu.pc = cpu.getIndexReg();

    if (cpu.branchDebugSupport !== undefined) {
        cpu.branchDebugSupport.recordBranchEvent(
            new BranchEvent(oldPc, 
                cpu.indexMode === OpIndexMode.IX ? "jp (ix)" : "jp (iy)",
                cpu.pc,
                cpu.tacts));
    }
}

function LdSPIX(cpu: Z80Cpu) {
    const oldSP = cpu.sp;
    cpu.sp = cpu.getIndexReg();
    cpu.tacts += 2;

    if (cpu.stackDebugSupport !== undefined) {
        cpu.stackDebugSupport.recordStackContentManipulationEvent(
            new StackContentManipulationEvent(cpu.pc - 2,
                cpu.indexMode === OpIndexMode.IX ? 'ld sp,ix' : 'ld sp,iy',
                oldSP,
                cpu.sp,
                cpu.tacts));
    }
}

// ========================================================================
// Processing indexed bit (CB/DD or CB/FD prefix) Z80 instructions    

function XrlcQ(cpu: Z80Cpu, addr: number) {
    const q = cpu.opCode & 0x07;
    let rlcVal = cpu.readMemory(addr);
    cpu.tacts += 3;
    if (!cpu.useGateArrayContention) {
        cpu.readMemory(addr);
    } cpu.tacts++;
    cpu.f = rlcFlags[rlcVal];
    rlcVal <<= 1;
    if ((rlcVal & 0x100) !== 0) {
        rlcVal = (rlcVal | 0x01) & 0xFF;
    }
    cpu.writeMemory(addr, rlcVal);
    cpu.setReg8(q, rlcVal);
    cpu.tacts += 3;
}

function Xrlc(cpu: Z80Cpu, addr: number) {
    let rlcVal = cpu.readMemory(addr);
    cpu.tacts += 3;
    if (!cpu.useGateArrayContention) {
        cpu.readMemory(addr);
    } cpu.tacts++;
    cpu.f = rlcFlags[rlcVal];
    rlcVal <<= 1;
    if ((rlcVal & 0x100) !== 0) {
        rlcVal = (rlcVal | 0x01) & 0xFF;
    }
    cpu.writeMemory(addr, rlcVal);
    cpu.tacts += 3;
}

function XrrcQ(cpu: Z80Cpu, addr: number) {
    const q = cpu.opCode & 0x07;
    let rrcVal = cpu.readMemory(addr);
    cpu.tacts += 3;
    if (!cpu.useGateArrayContention) {
        cpu.readMemory(addr);
    }
    cpu.tacts++;
    cpu.f = rlcFlags[rrcVal];
    rrcVal = (rrcVal & 0x01) !== 0 ? (rrcVal >> 1) | 0x80 : rrcVal >> 1;
    cpu.writeMemory(addr, rrcVal);
    cpu.setReg8(q, rrcVal);
    cpu.tacts += 3;
}

function Xrrc(cpu: Z80Cpu, addr: number) {
    let rrcVal = cpu.readMemory(addr);
    cpu.tacts += 3;
    if (!cpu.useGateArrayContention) {
        cpu.readMemory(addr);
    }
    cpu.tacts++;
    cpu.f = rlcFlags[rrcVal];
    rrcVal = (rrcVal & 0x01) !== 0 ? (rrcVal >> 1) | 0x80 : rrcVal >> 1;
    cpu.writeMemory(addr, rrcVal);
    cpu.tacts += 3;
}

function XrlQ(cpu: Z80Cpu, addr: number) {
    const q = cpu.opCode & 0x07;
    let rlVal = cpu.readMemory(addr);
    cpu.tacts += 3;
    if (!cpu.useGateArrayContention) {
        cpu.readMemory(addr);
    }
    cpu.tacts++;
    if (cpu.cFlag) {
        cpu.f = rlCarry1Flags[rlVal];
        rlVal <<= 1;
        rlVal++;
    } else {
        cpu.f = rlCarry0Flags[rlVal];
        rlVal <<= 1;
    }
    cpu.writeMemory(addr, rlVal);
    cpu.setReg8(q, rlVal);
    cpu.tacts += 3;
}

function Xrl(cpu: Z80Cpu, addr: number) {
    let rlVal = cpu.readMemory(addr);
    cpu.tacts += 3;
    if (!cpu.useGateArrayContention) {
        cpu.readMemory(addr);
    }
    cpu.tacts++;
    if (cpu.cFlag) {
        cpu.f = rlCarry1Flags[rlVal];
        rlVal <<= 1;
        rlVal++;
    } else {
        cpu.f = rlCarry0Flags[rlVal];
        rlVal <<= 1;
    }
    cpu.writeMemory(addr, rlVal);
    cpu.tacts += 3;
}

function XrrQ(cpu: Z80Cpu, addr: number) {
    const q = cpu.opCode & 0x07;
    let rrVal = cpu.readMemory(addr);
    cpu.tacts += 3;
    if (!cpu.useGateArrayContention) {
        cpu.readMemory(addr);
    }
    cpu.tacts++;
    if (cpu.cFlag) {
        cpu.f = rrCarry1Flags[rrVal];
        rrVal >>= 1;
        rrVal += 0x80;
    } else {
        cpu.f = rrCarry0Flags[rrVal];
        rrVal >>= 1;
    }
    cpu.writeMemory(addr, rrVal);
    cpu.setReg8(q, rrVal);
    cpu.tacts += 3;
}

function Xrr(cpu: Z80Cpu, addr: number) {
    let rrVal = cpu.readMemory(addr);
    cpu.tacts += 3;
    if (!cpu.useGateArrayContention) {
        cpu.readMemory(addr);
    }
    cpu.tacts++;
    if (cpu.cFlag) {
        cpu.f = rrCarry1Flags[rrVal];
        rrVal >>= 1;
        rrVal += 0x80;
    } else {
        cpu.f = rrCarry0Flags[rrVal];
        rrVal >>= 1;
    }
    cpu.writeMemory(addr, rrVal);
    cpu.tacts += 3;
}

function XslaQ(cpu: Z80Cpu, addr: number) {
    const q = cpu.opCode & 0x07;
    let slaVal = cpu.readMemory(addr);
    cpu.tacts += 3;
    if (!cpu.useGateArrayContention) {
        cpu.readMemory(addr);
    }
    cpu.tacts++;
    cpu.f = rlCarry0Flags[slaVal];
    slaVal <<= 1;
    cpu.writeMemory(addr, slaVal);
    cpu.setReg8(q, slaVal);
    cpu.tacts += 3;
}

function Xsla(cpu: Z80Cpu, addr: number) {
    let slaVal = cpu.readMemory(addr);
    cpu.tacts += 3;
    if (!cpu.useGateArrayContention) {
        cpu.readMemory(addr);
    }
    cpu.tacts++;
    cpu.f = rlCarry0Flags[slaVal];
    slaVal <<= 1;
    cpu.writeMemory(addr, slaVal);
    cpu.tacts += 3;
}

function XsraQ(cpu: Z80Cpu, addr: number) {
    const q = cpu.opCode & 0x07;
    let sraVal = cpu.readMemory(addr);
    cpu.tacts += 3;
    if (!cpu.useGateArrayContention) {
        cpu.readMemory(addr);
    }
    cpu.tacts++;
    cpu.f = sraFlags[sraVal];
    sraVal = (sraVal >> 1) + (sraVal & 0x80);
    cpu.writeMemory(addr, sraVal);
    cpu.setReg8(q, sraVal);
    cpu.tacts += 3;
}

function Xsra(cpu: Z80Cpu, addr: number) {
    let sraVal = cpu.readMemory(addr);
    cpu.tacts += 3;
    if (!cpu.useGateArrayContention) {
        cpu.readMemory(addr);
    }
    cpu.tacts++;
    cpu.f = sraFlags[sraVal];
    sraVal = (sraVal >> 1) + (sraVal & 0x80);
    cpu.writeMemory(addr, sraVal);
    cpu.tacts += 3;
}

function XsllQ(cpu: Z80Cpu, addr: number) {
    const q = cpu.opCode & 0x07;
    let sllVal = cpu.readMemory(addr);
    cpu.tacts += 3;
    if (!cpu.useGateArrayContention) {
        cpu.readMemory(addr);
    }
    cpu.tacts++;
    cpu.f = rlCarry1Flags[sllVal];
    sllVal <<= 1;
    sllVal++;
    cpu.writeMemory(addr, sllVal);
    cpu.setReg8(q, sllVal);
    cpu.tacts += 3;
}

function Xsll(cpu: Z80Cpu, addr: number) {
    let sllVal = cpu.readMemory(addr);
    cpu.tacts += 3;
    if (!cpu.useGateArrayContention) {
        cpu.readMemory(addr);
    }
    cpu.tacts++;
    cpu.f = rlCarry1Flags[sllVal];
    sllVal <<= 1;
    sllVal++;
    cpu.writeMemory(addr, sllVal);
    cpu.tacts += 3;
}

function XsrlQ(cpu: Z80Cpu, addr: number) {
    const q = cpu.opCode & 0x07;
    let srlVal = cpu.readMemory(addr);
    cpu.tacts += 3;
    if (!cpu.useGateArrayContention) {
        cpu.readMemory(addr);
    }
    cpu.tacts++;
    cpu.f = rrCarry0Flags[srlVal];
    srlVal >>= 1;
    cpu.writeMemory(addr, srlVal);
    cpu.setReg8(q, srlVal);
    cpu.tacts += 3;
}

function Xsrl(cpu: Z80Cpu, addr: number) {
    let srlVal = cpu.readMemory(addr);
    cpu.tacts += 3;
    if (!cpu.useGateArrayContention) {
        cpu.readMemory(addr);
    }
    cpu.tacts++;
    cpu.f = rrCarry0Flags[srlVal];
    srlVal >>= 1;
    cpu.writeMemory(addr, srlVal);
    cpu.tacts += 3;
}

function XbitN(cpu: Z80Cpu, addr: number) {
    const n = (cpu.opCode & 0x38) >> 3;
    const srcVal = cpu.readMemory(addr);
    cpu.tacts += 3;
    if (!cpu.useGateArrayContention) {
        cpu.readMemory(addr);
    }
    cpu.tacts++;
    const testVal = srcVal & (1 << n);
    let flags = FlagsSetMask.H
        | (cpu.f & FlagsSetMask.C)
        | (srcVal & (FlagsSetMask.R3 | FlagsSetMask.R5));
    if (testVal === 0) {
        flags |= FlagsSetMask.Z | FlagsSetMask.PV;
    }
    if (n === 7 && testVal !== 0) {
        flags |= FlagsSetMask.S;
    }
    cpu.f = flags;
}

function Xres(cpu: Z80Cpu, addr: number) {
    let srcVal = cpu.readMemory(addr);
    const n = (cpu.opCode & 0x38) >> 3;
    const q = cpu.opCode & 0x07;
    srcVal &= ~(1 << n);
    if (q !== 6) {
        cpu.setReg8(q, srcVal);
    }
    cpu.tacts += 3;
    if (!cpu.useGateArrayContention) {
        cpu.readMemory(addr);
    }
    cpu.tacts++;
    cpu.writeMemory(addr, srcVal);
    cpu.tacts += 3;
}

function Xset(cpu: Z80Cpu, addr: number) {
    let srcVal = cpu.readMemory(addr);
    const n = (cpu.opCode & 0x38) >> 3;
    const q = cpu.opCode & 0x07;
    srcVal |= 1 << n;
    if (q !== 6) {
        cpu.setReg8(q, srcVal);
    }
    cpu.tacts += 3;
    if (!cpu.useGateArrayContention) {
        cpu.readMemory(addr);
    }
    cpu.tacts++;
    cpu.writeMemory(addr, srcVal);
    cpu.tacts += 3;
}

// ========================================================================
// Alu operations

// Executes the ADD operation.
function AluADD(cpu: Z80Cpu, right: number, cf: boolean) {
    AluADC(cpu, right, false);
}

// Executes the ADC operation.
function AluADC(cpu: Z80Cpu, right: number, cf: boolean) {
    const c = cf ? 1 : 0;
    const result = cpu.a + right + c;
    const signed = toSbyte(cpu.a) + toSbyte(right) + c;
    const lNibble = ((cpu.a & 0x0F) + (right & 0x0F) + c) & 0x10;

    var flags = (result & (FlagsSetMask.S | FlagsSetMask.R5 | FlagsSetMask.R3)) & 0xFF;
    if ((result & 0xFF) === 0) {
        flags |= FlagsSetMask.Z;
    }
    if (result >= 0x100) {
        flags |= FlagsSetMask.C;
    }
    if (lNibble !== 0) {
        flags |= FlagsSetMask.H;
    }
    if (signed >= 0x80 || signed <= -0x81) {
        flags |= FlagsSetMask.PV;
    }
    cpu.f = flags;
    cpu.a = result;
}

// Executes the SUB operation.
function AluSUB(cpu: Z80Cpu, right: number, cf: boolean) {
    AluSBC(cpu, right, false);
}

// Executes the SBC operation.
function AluSBC(cpu: Z80Cpu, right: number, cf: boolean) {
    const c = cf ? 1 : 0;
    const result = cpu.a - right - c;
    const signed = toSbyte(cpu.a) - toSbyte(right) - c;
    const lNibble = ((cpu.a & 0x0F) - (right & 0x0F) - c) & 0x10;

    var flags = (result & (FlagsSetMask.S | FlagsSetMask.R5 | FlagsSetMask.R3)) & 0x0F;
    flags |= FlagsSetMask.N;
    if ((result & 0xFF) === 0) {
        flags |= FlagsSetMask.Z;
    }
    if ((result & 0x10000) !== 0) {
        flags |= FlagsSetMask.C;
    }
    if (lNibble !== 0) {
        flags |= FlagsSetMask.H;
    }
    if (signed >= 0x80 || signed <= -0x81) {
        flags |= FlagsSetMask.PV;
    }
    cpu.f = flags;
    cpu.a = result;
}

// Executes the AND operation.
function AluAND(cpu: Z80Cpu, right: number, cf: boolean) {
    cpu.a &= right;
    cpu.f = aluLogOpFlags[cpu.a] | FlagsSetMask.H;
}

// Executes the XOR operation.
function AluXOR(cpu: Z80Cpu, right: number, cf: boolean) {
    cpu.a ^= right;
    cpu.f = aluLogOpFlags[cpu.a];
}

// Executes the OR operation.
function AluOR(cpu: Z80Cpu, right: number, cf: boolean) {
    cpu.a |= right;
    cpu.f = aluLogOpFlags[cpu.a];
}

// Executes the CP operation.
function AluCP(cpu: Z80Cpu, right: number, cf: boolean) {
    const result = cpu.a - right;
    const signed = toSbyte(cpu.a) - toSbyte(right);
    const lNibble = ((cpu.a & 0x0F) - (right & 0x0F)) & 0x10;
    var flags = (result & (FlagsSetMask.S | FlagsSetMask.R5 | FlagsSetMask.R3)) & 0xFF;
    flags |= FlagsSetMask.N;
    if ((result & 0xFF) === 0) {
        flags |= FlagsSetMask.Z;
    }
    if ((result & 0x10000) !== 0) {
        flags |= FlagsSetMask.C;
    }
    if (lNibble !== 0) {
        flags |= FlagsSetMask.H;
    }
    if (signed >= 0x80 || signed <= -0x81) {
        flags |= FlagsSetMask.PV;
    }
    cpu.f = flags;
}