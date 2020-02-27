import { KeyCode } from "./KeyCode";
import { SpectrumKeyCode } from "./SpectrumKeyCode";

/**
 * Describes a key mapping between the PC and the ZX Spectrum keyboard
 */
export class KeyMapping {
    /**
     * Initializes a key mapping
     * @param key PC keyboard key code
     * @param zxPrimary Primary (mandatory) ZX Spectrum key code
     * @param zxSecondary Optional secondary ZX Spectrum key code
     */
    constructor(public key: KeyCode, 
        public zxPrimary: SpectrumKeyCode, 
        public zxSecondary?: SpectrumKeyCode) {
    }
}

// --- Define the Spectrum key and name associations
const _spKeys = new Map<string, SpectrumKeyCode>();
_spKeys.set("N0", SpectrumKeyCode.N0);
_spKeys.set("N1", SpectrumKeyCode.N1);
_spKeys.set("N2", SpectrumKeyCode.N2);
_spKeys.set("N3", SpectrumKeyCode.N3);
_spKeys.set("N4", SpectrumKeyCode.N4);
_spKeys.set("N5", SpectrumKeyCode.N5);
_spKeys.set("N6", SpectrumKeyCode.N6);
_spKeys.set("N7", SpectrumKeyCode.N7);
_spKeys.set("N8", SpectrumKeyCode.N8);
_spKeys.set("N9", SpectrumKeyCode.N9);

_spKeys.set("Q", SpectrumKeyCode.Q);
_spKeys.set("W", SpectrumKeyCode.W);
_spKeys.set("E", SpectrumKeyCode.E);
_spKeys.set("R", SpectrumKeyCode.R);
_spKeys.set("T", SpectrumKeyCode.T);
_spKeys.set("Y", SpectrumKeyCode.Y);
_spKeys.set("U", SpectrumKeyCode.U);
_spKeys.set("I", SpectrumKeyCode.I);
_spKeys.set("O", SpectrumKeyCode.O);
_spKeys.set("P", SpectrumKeyCode.P);

_spKeys.set("A", SpectrumKeyCode.A);
_spKeys.set("S", SpectrumKeyCode.S);
_spKeys.set("D", SpectrumKeyCode.D);
_spKeys.set("F", SpectrumKeyCode.F);
_spKeys.set("G", SpectrumKeyCode.G);
_spKeys.set("H", SpectrumKeyCode.H);
_spKeys.set("J", SpectrumKeyCode.J);
_spKeys.set("K", SpectrumKeyCode.K);
_spKeys.set("L", SpectrumKeyCode.L);
_spKeys.set("Enter", SpectrumKeyCode.Enter);

_spKeys.set("CShift", SpectrumKeyCode.CShift);
_spKeys.set("Z", SpectrumKeyCode.Z);
_spKeys.set("X", SpectrumKeyCode.X);
_spKeys.set("C", SpectrumKeyCode.C);
_spKeys.set("V", SpectrumKeyCode.V);
_spKeys.set("B", SpectrumKeyCode.B);
_spKeys.set("N", SpectrumKeyCode.N);
_spKeys.set("M", SpectrumKeyCode.M);
_spKeys.set("SShift", SpectrumKeyCode.SShift);
_spKeys.set("Space", SpectrumKeyCode.Space);

export const SpectrumKeyNames = _spKeys;

// --- Define PC key and name associations 
const _pcKeys = new Map<string, KeyCode>();
_pcKeys.set("Break", KeyCode.Break);
_pcKeys.set("Backspace", KeyCode.Backspace);
_pcKeys.set("Tab", KeyCode.Tab);
_pcKeys.set("NumEqual", KeyCode.NumEqual);
_pcKeys.set("Enter", KeyCode.Enter);
_pcKeys.set("Shift", KeyCode.Shift);
_pcKeys.set("Ctrl", KeyCode.Ctrl);
_pcKeys.set("Alt", KeyCode.Alt);
_pcKeys.set("Pause", KeyCode.Pause);
_pcKeys.set("CapsLock", KeyCode.CapsLock);
_pcKeys.set("Esc", KeyCode.Esc);
_pcKeys.set("Space", KeyCode.Space);
_pcKeys.set("PageUp", KeyCode.PageUp);
_pcKeys.set("PageDown", KeyCode.PageDown);
_pcKeys.set("End", KeyCode.End);
_pcKeys.set("Home", KeyCode.Home);
_pcKeys.set("ArrowLeft", KeyCode.ArrowLeft);
_pcKeys.set("ArrowUp", KeyCode.ArrowUp);
_pcKeys.set("ArrowRight", KeyCode.ArrowRight);
_pcKeys.set("ArrowDown", KeyCode.ArrowDown);
_pcKeys.set("Insert", KeyCode.Insert);
_pcKeys.set("Delete", KeyCode.Delete);
_pcKeys.set("D0", KeyCode.D0);
_pcKeys.set("D1", KeyCode.D1);
_pcKeys.set("D2", KeyCode.D2);
_pcKeys.set("D3", KeyCode.D3);
_pcKeys.set("D4", KeyCode.D4);
_pcKeys.set("D5", KeyCode.D5);
_pcKeys.set("D6", KeyCode.D6);
_pcKeys.set("D7", KeyCode.D7);
_pcKeys.set("D8", KeyCode.D8);
_pcKeys.set("D9", KeyCode.D9);
_pcKeys.set("A", KeyCode.A);
_pcKeys.set("B", KeyCode.B);
_pcKeys.set("C", KeyCode.C);
_pcKeys.set("D", KeyCode.D);
_pcKeys.set("E", KeyCode.E);
_pcKeys.set("F", KeyCode.F);
_pcKeys.set("G", KeyCode.G);
_pcKeys.set("H", KeyCode.H);
_pcKeys.set("I", KeyCode.I);
_pcKeys.set("J", KeyCode.J);
_pcKeys.set("K", KeyCode.K);
_pcKeys.set("L", KeyCode.L);
_pcKeys.set("M", KeyCode.M);
_pcKeys.set("N", KeyCode.N);
_pcKeys.set("O", KeyCode.O);
_pcKeys.set("P", KeyCode.P);
_pcKeys.set("Q", KeyCode.Q);
_pcKeys.set("R", KeyCode.R);
_pcKeys.set("S", KeyCode.S);
_pcKeys.set("T", KeyCode.T);
_pcKeys.set("U", KeyCode.U);
_pcKeys.set("V", KeyCode.V);
_pcKeys.set("W", KeyCode.W);
_pcKeys.set("X", KeyCode.X);
_pcKeys.set("Y", KeyCode.Y);
_pcKeys.set("Z", KeyCode.Z);
_pcKeys.set("OSLeft", KeyCode.OSLeft);
_pcKeys.set("OSRight", KeyCode.OSRight);
_pcKeys.set("ContextMenu", KeyCode.ContextMenu);
_pcKeys.set("N0", KeyCode.N0);
_pcKeys.set("N1", KeyCode.N1);
_pcKeys.set("N2", KeyCode.N2);
_pcKeys.set("N3", KeyCode.N3);
_pcKeys.set("N4", KeyCode.N4);
_pcKeys.set("N5", KeyCode.N5);
_pcKeys.set("N6", KeyCode.N6);
_pcKeys.set("N7", KeyCode.N7);
_pcKeys.set("N8", KeyCode.N8);
_pcKeys.set("N9", KeyCode.N9);
_pcKeys.set("NumMul", KeyCode.NumMul);
_pcKeys.set("NumAdd", KeyCode.NumAdd);
_pcKeys.set("NumSubtr", KeyCode.NumSubtr);
_pcKeys.set("NumDec", KeyCode.NumDec);
_pcKeys.set("NumDiv", KeyCode.NumDiv);
_pcKeys.set("NumLock", KeyCode.NumLock);
_pcKeys.set("Semicolon", KeyCode.Semicolon);
_pcKeys.set("Equal", KeyCode.Equal);
_pcKeys.set("Comma", KeyCode.Comma);
_pcKeys.set("Minus", KeyCode.Minus);
_pcKeys.set("Period", KeyCode.Period);
_pcKeys.set("Backquote", KeyCode.Backquote);
_pcKeys.set("NumComma", KeyCode.NumComma);
_pcKeys.set("BracketLeft", KeyCode.BracketLeft);
_pcKeys.set("Backslash", KeyCode.Backslash);
_pcKeys.set("BracketRight", KeyCode.BracketRight);
_pcKeys.set("Quote", KeyCode.Quote);

export const PcKeyNames = _pcKeys;

const hunKeyMapping: KeyMapping[] = [
    new KeyMapping(KeyCode.D1, SpectrumKeyCode.N1),
    new KeyMapping(KeyCode.D2, SpectrumKeyCode.N2),
    new KeyMapping(KeyCode.D3, SpectrumKeyCode.N3),
    new KeyMapping(KeyCode.D4, SpectrumKeyCode.N4),
    new KeyMapping(KeyCode.D5, SpectrumKeyCode.N5),
    new KeyMapping(KeyCode.D6, SpectrumKeyCode.N6),
    new KeyMapping(KeyCode.D7, SpectrumKeyCode.N7),
    new KeyMapping(KeyCode.D8, SpectrumKeyCode.N8),
    new KeyMapping(KeyCode.D9, SpectrumKeyCode.N9),
    new KeyMapping(KeyCode.D0, SpectrumKeyCode.N0),

    new KeyMapping(KeyCode.N1, SpectrumKeyCode.N1),
    new KeyMapping(KeyCode.N2, SpectrumKeyCode.N2),
    new KeyMapping(KeyCode.N3, SpectrumKeyCode.N3),
    new KeyMapping(KeyCode.N4, SpectrumKeyCode.N4),
    new KeyMapping(KeyCode.N5, SpectrumKeyCode.N5),
    new KeyMapping(KeyCode.N6, SpectrumKeyCode.N6),
    new KeyMapping(KeyCode.N7, SpectrumKeyCode.N7),
    new KeyMapping(KeyCode.N8, SpectrumKeyCode.N8),
    new KeyMapping(KeyCode.N9, SpectrumKeyCode.N9),
    new KeyMapping(KeyCode.N0, SpectrumKeyCode.N0),

    new KeyMapping(KeyCode.Q, SpectrumKeyCode.Q),
    new KeyMapping(KeyCode.W, SpectrumKeyCode.W),
    new KeyMapping(KeyCode.E, SpectrumKeyCode.E),
    new KeyMapping(KeyCode.R, SpectrumKeyCode.R),
    new KeyMapping(KeyCode.T, SpectrumKeyCode.T),
    new KeyMapping(KeyCode.Y, SpectrumKeyCode.Y),
    new KeyMapping(KeyCode.U, SpectrumKeyCode.U),
    new KeyMapping(KeyCode.I, SpectrumKeyCode.I),
    new KeyMapping(KeyCode.O, SpectrumKeyCode.O),
    new KeyMapping(KeyCode.P, SpectrumKeyCode.P),

    new KeyMapping(KeyCode.A, SpectrumKeyCode.A),
    new KeyMapping(KeyCode.S, SpectrumKeyCode.S),
    new KeyMapping(KeyCode.D, SpectrumKeyCode.D),
    new KeyMapping(KeyCode.F, SpectrumKeyCode.F),
    new KeyMapping(KeyCode.G, SpectrumKeyCode.G),
    new KeyMapping(KeyCode.H, SpectrumKeyCode.H),
    new KeyMapping(KeyCode.J, SpectrumKeyCode.J),
    new KeyMapping(KeyCode.K, SpectrumKeyCode.K),
    new KeyMapping(KeyCode.L, SpectrumKeyCode.L),
    new KeyMapping(KeyCode.Enter, SpectrumKeyCode.Enter),

    new KeyMapping(KeyCode.Shift, SpectrumKeyCode.CShift),
    new KeyMapping(KeyCode.Z, SpectrumKeyCode.Z),
    new KeyMapping(KeyCode.X, SpectrumKeyCode.X),
    new KeyMapping(KeyCode.C, SpectrumKeyCode.C),
    new KeyMapping(KeyCode.V, SpectrumKeyCode.V),
    new KeyMapping(KeyCode.B, SpectrumKeyCode.B),
    new KeyMapping(KeyCode.N, SpectrumKeyCode.N),
    new KeyMapping(KeyCode.M, SpectrumKeyCode.M),
    new KeyMapping(KeyCode.Space, SpectrumKeyCode.Space),
    new KeyMapping(KeyCode.Alt, SpectrumKeyCode.SShift),

    new KeyMapping(KeyCode.Comma, SpectrumKeyCode.SShift, SpectrumKeyCode.N),
    new KeyMapping(KeyCode.NumDec, SpectrumKeyCode.SShift, SpectrumKeyCode.M),
    new KeyMapping(KeyCode.Period, SpectrumKeyCode.SShift, SpectrumKeyCode.M),
    new KeyMapping(KeyCode.NumDiv, SpectrumKeyCode.SShift, SpectrumKeyCode.V),
    new KeyMapping(KeyCode.NumMul, SpectrumKeyCode.SShift, SpectrumKeyCode.B),
    new KeyMapping(KeyCode.NumAdd, SpectrumKeyCode.SShift, SpectrumKeyCode.K),
    new KeyMapping(KeyCode.NumSubtr, SpectrumKeyCode.SShift, SpectrumKeyCode.J),
    new KeyMapping(KeyCode.Backspace, SpectrumKeyCode.CShift, SpectrumKeyCode.N0),
    new KeyMapping(KeyCode.ArrowLeft, SpectrumKeyCode.CShift, SpectrumKeyCode.N5),
    new KeyMapping(KeyCode.ArrowDown, SpectrumKeyCode.CShift, SpectrumKeyCode.N6),
    new KeyMapping(KeyCode.ArrowUp, SpectrumKeyCode.CShift, SpectrumKeyCode.N7),
    new KeyMapping(KeyCode.ArrowRight, SpectrumKeyCode.CShift, SpectrumKeyCode.N8),
    new KeyMapping(KeyCode.Home, SpectrumKeyCode.CShift, SpectrumKeyCode.N1)
];

/**
 * Default key mapping
 */
export const DefaultKeyMapping = hunKeyMapping;
