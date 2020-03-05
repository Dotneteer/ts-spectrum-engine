import "mocha";
import * as expect from "expect";
import { Z80TestMachine, RunMode } from "./Z80TestMachine";
import { FlagsSetMask } from "../src/spectrumemu/cpu/FlagsSetMask";

describe("Z80 CPU - IX-indexed 80-bf", () => {
  it("ADD A,B", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x12, // LD A,#12
      0x06,
      0x24, // LD B,#24
      0xdd,
      0x80 // ADD A,B
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x36);
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeFalsy();
    expect(s.hFlag).toBeFalsy();
    expect(s.pvFlag).toBeFalsy();
    expect(s.cFlag).toBeFalsy();

    expect(s.nFlag).toBeFalsy();

    m.shouldKeepRegisters("AF, B");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(22);
  });

  it("ADD A,C", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x12, // LD A,#12
      0x0e,
      0x24, // LD C,#24
      0xdd,
      0x81 // ADD A,C
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x36);
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeFalsy();
    expect(s.hFlag).toBeFalsy();
    expect(s.pvFlag).toBeFalsy();
    expect(s.cFlag).toBeFalsy();

    expect(s.nFlag).toBeFalsy();

    m.shouldKeepRegisters("AF, C");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(22);
  });

  it("ADD A,D", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x12, // LD A,#12
      0x16,
      0x24, // LD D,#24
      0xdd,
      0x82 // ADD A,D
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x36);
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeFalsy();
    expect(s.hFlag).toBeFalsy();
    expect(s.pvFlag).toBeFalsy();
    expect(s.cFlag).toBeFalsy();

    expect(s.nFlag).toBeFalsy();

    m.shouldKeepRegisters("AF, D");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(22);
  });

  it("ADD A,E", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x12, // LD A,#12
      0x1e,
      0x24, // LD E,#24
      0xdd,
      0x83 // ADD A,E
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x36);
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeFalsy();
    expect(s.hFlag).toBeFalsy();
    expect(s.pvFlag).toBeFalsy();
    expect(s.cFlag).toBeFalsy();

    expect(s.nFlag).toBeFalsy();

    m.shouldKeepRegisters("AF, E");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(22);
  });

  it("ADD A,XH", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x12, // LD A,#12
      0xdd,
      0x21,
      0x24,
      0x3d, // LD IX,#3D24
      0xdd,
      0x84 // ADD A,XH
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x4f);
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeFalsy();
    expect(s.hFlag).toBeFalsy();
    expect(s.pvFlag).toBeFalsy();
    expect(s.cFlag).toBeFalsy();

    expect(s.nFlag).toBeFalsy();
    m.shouldKeepRegisters("AF, IX");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0008);
    expect(s.tacts).toBe(29);
  });

  it("ADD A,XL", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x12, // LD A,#12
      0xdd,
      0x21,
      0x24,
      0x3d, // LD IX,#3D24
      0xdd,
      0x85 // ADD A,XL
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x36);
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeFalsy();
    expect(s.hFlag).toBeFalsy();
    expect(s.pvFlag).toBeFalsy();
    expect(s.cFlag).toBeFalsy();

    expect(s.nFlag).toBeFalsy();
    m.shouldKeepRegisters("AF, IX");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0008);
    expect(s.tacts).toBe(29);
  });

  it("ADD A,(IX+D)", () => {
    // --- Arrange
    const OFFS = 0x54;
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x02, // LD A,2
      0xdd,
      0x86,
      OFFS // ADD A,(IX+#54)
    ]);
    m.cpu.getTestSupport().setIX(0x1000);
    m.memory[0x1000 + OFFS] = 0x7c;

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x7e);

    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(26);
  });

  it("ADD A,A", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x12, // LD A,#12
      0xdd,
      0x87 // ADD A,A
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x24);
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeFalsy();
    expect(s.hFlag).toBeFalsy();
    expect(s.pvFlag).toBeFalsy();
    expect(s.cFlag).toBeFalsy();

    expect(s.nFlag).toBeFalsy();

    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(15);
  });

  it("ADC A,B", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x12, // LD A,#12
      0x06,
      0x24, // LD B,#24
      0xdd,
      0x88 // ADC A,B
    ]);

    // --- Act
    let s = m.cpu.getCpuState();
    m.cpu.getTestSupport().setF(s.f & 0xfe);
    m.run();

    // --- Assert
    s = m.cpu.getCpuState();

    expect(s.a).toBe(0x36);
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeFalsy();
    expect(s.hFlag).toBeFalsy();
    expect(s.pvFlag).toBeFalsy();
    expect(s.cFlag).toBeFalsy();

    expect(s.nFlag).toBeFalsy();

    m.shouldKeepRegisters("AF, B");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(22);
  });

  it("ADC A,C", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x12, // LD A,#12
      0x0e,
      0x24, // LD C,#24
      0xdd,
      0x89 // ADC A,C
    ]);

    // --- Act
    let s = m.cpu.getCpuState();
    m.cpu.getTestSupport().setF(s.f & 0xfe);
    m.run();

    // --- Assert
    s = m.cpu.getCpuState();

    expect(s.a).toBe(0x36);
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeFalsy();
    expect(s.hFlag).toBeFalsy();
    expect(s.pvFlag).toBeFalsy();
    expect(s.cFlag).toBeFalsy();

    expect(s.nFlag).toBeFalsy();

    m.shouldKeepRegisters("AF, C");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(22);
  });

  it("ADC A,D", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x12, // LD A,#12
      0x16,
      0x24, // LD D,#24
      0xdd,
      0x8a // ADC A,D
    ]);

    // --- Act
    let s = m.cpu.getCpuState();
    m.cpu.getTestSupport().setF(s.f & 0xfe);
    m.run();

    // --- Assert
    s = m.cpu.getCpuState();

    expect(s.a).toBe(0x36);
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeFalsy();
    expect(s.hFlag).toBeFalsy();
    expect(s.pvFlag).toBeFalsy();
    expect(s.cFlag).toBeFalsy();

    expect(s.nFlag).toBeFalsy();

    m.shouldKeepRegisters("AF, D");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(22);
  });

  it("ADC A,E", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x12, // LD A,#12
      0x1e,
      0x24, // LD E,#24
      0xdd,
      0x8b // ADC A,E
    ]);

    // --- Act
    let s = m.cpu.getCpuState();
    m.cpu.getTestSupport().setF(s.f & 0xfe);
    m.run();

    // --- Assert
    s = m.cpu.getCpuState();

    expect(s.a).toBe(0x36);
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeFalsy();
    expect(s.hFlag).toBeFalsy();
    expect(s.pvFlag).toBeFalsy();
    expect(s.cFlag).toBeFalsy();

    expect(s.nFlag).toBeFalsy();

    m.shouldKeepRegisters("AF, E");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(22);
  });

  it("ADC A,XH", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0xf0, // LD A,#F0
      0x37, // SCF
      0xdd,
      0x8c // ADC A,XH
    ]);
    m.cpu.getTestSupport().setIX(0xf0aa);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0xe1);
    expect(s.sFlag).toBeTruthy();
    expect(s.zFlag).toBeFalsy();
    expect(s.hFlag).toBeFalsy();
    expect(s.pvFlag).toBeFalsy();
    expect(s.cFlag).toBeTruthy();

    expect(s.nFlag).toBeFalsy();
    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(19);
  });

  it("ADC A,XL", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0xf0, // LD A,#F0
      0x37, // SCF
      0xdd,
      0x8d // ADC A,XL
    ]);
    m.cpu.getTestSupport().setIX(0xaaf0);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0xe1);
    expect(s.sFlag).toBeTruthy();
    expect(s.zFlag).toBeFalsy();
    expect(s.hFlag).toBeFalsy();
    expect(s.pvFlag).toBeFalsy();
    expect(s.cFlag).toBeTruthy();

    expect(s.nFlag).toBeFalsy();
    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(19);
  });

  it("ADC A,(IX+D)", () => {
    // --- Arrange
    const OFFS = 0x54;
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x02, // LD A,2
      0xdd,
      0x8e,
      OFFS // ADD A,(IX+#54)
    ]);
    const sup = m.cpu.getTestSupport();
    sup.setIX(0x1000);
    sup.setF(m.cpu.getCpuState().f | FlagsSetMask.C);
    m.memory[0x1000 + OFFS] = 0x7c;

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x7f);

    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(26);
  });

  it("ADC A,A", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x12, // LD A,#12
      0x37, // SCF
      0xdd,
      0x8f // ADC A,L
    ]);

    // --- Act
    let s = m.cpu.getCpuState();
    m.cpu.getTestSupport().setF(s.f & 0xfe);
    m.run();

    // --- Assert
    s = m.cpu.getCpuState();

    expect(s.a).toBe(0x25);
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeFalsy();
    expect(s.hFlag).toBeFalsy();
    expect(s.pvFlag).toBeFalsy();
    expect(s.cFlag).toBeFalsy();

    expect(s.nFlag).toBeFalsy();

    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(19);
  });

  it("SUB B", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x36, // LD A,#36
      0x06,
      0x24, // LD B,#24
      0xdd,
      0x90 // SUB B
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x12);
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeFalsy();
    expect(s.hFlag).toBeFalsy();
    expect(s.pvFlag).toBeFalsy();
    expect(s.cFlag).toBeFalsy();

    expect(s.nFlag).toBeTruthy();

    m.shouldKeepRegisters("AF, B");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(22);
  });

  it("SUB C", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x36, // LD A,#36
      0x0e,
      0x24, // LD C,#24
      0xdd,
      0x91 // SUB C
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x12);
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeFalsy();
    expect(s.hFlag).toBeFalsy();
    expect(s.pvFlag).toBeFalsy();
    expect(s.cFlag).toBeFalsy();

    expect(s.nFlag).toBeTruthy();

    m.shouldKeepRegisters("AF, C");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(22);
  });

  it("SUB D", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x36, // LD A,#36
      0x16,
      0x24, // LD D,#24
      0xdd,
      0x92 // SUB D
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x12);
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeFalsy();
    expect(s.hFlag).toBeFalsy();
    expect(s.pvFlag).toBeFalsy();
    expect(s.cFlag).toBeFalsy();

    expect(s.nFlag).toBeTruthy();

    m.shouldKeepRegisters("AF, D");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(22);
  });

  it("SUB E", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x36, // LD A,#36
      0x1e,
      0x24, // LD E,#24
      0xdd,
      0x93 // SUB E
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x12);
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeFalsy();
    expect(s.hFlag).toBeFalsy();
    expect(s.pvFlag).toBeFalsy();
    expect(s.cFlag).toBeFalsy();

    expect(s.nFlag).toBeTruthy();

    m.shouldKeepRegisters("AF, E");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(22);
  });

  it("SUB XH", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x36, // LD A,#36
      0xdd,
      0x21,
      0x3d,
      0x24, // LD IX,#243D
      0xdd,
      0x94 // SUB XH
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x12);
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeFalsy();
    expect(s.hFlag).toBeFalsy();
    expect(s.pvFlag).toBeFalsy();
    expect(s.cFlag).toBeFalsy();

    expect(s.nFlag).toBeTruthy();
    m.shouldKeepRegisters("AF, IX");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0008);
    expect(s.tacts).toBe(29);
  });

  it("SUB XL", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x36, // LD A,#36
      0xdd,
      0x21,
      0x24,
      0x3d, // LD IX,#3D24
      0xdd,
      0x95 // SUB XL
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x12);
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeFalsy();
    expect(s.hFlag).toBeFalsy();
    expect(s.pvFlag).toBeFalsy();
    expect(s.cFlag).toBeFalsy();

    expect(s.nFlag).toBeTruthy();
    m.shouldKeepRegisters("AF, IX");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0008);
    expect(s.tacts).toBe(29);
  });

  it("SUB A,(IX+D)", () => {
    // --- Arrange
    const OFFS = 0x54;
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x02, // LD A,2
      0xdd,
      0x96,
      OFFS // SUB A,(IX+#54)
    ]);
    const sup = m.cpu.getTestSupport();
    sup.setIX(0x1000);
    sup.setF(m.cpu.getCpuState().f | FlagsSetMask.C);
    m.memory[0x1000 + OFFS] = 0x7c;

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x86);

    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(26);
  });

  it("SUB A", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x36, // LD A,#36
      0xdd,
      0x97 // SUB A
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x00);
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeTruthy();
    expect(s.hFlag).toBeFalsy();
    expect(s.pvFlag).toBeFalsy();
    expect(s.cFlag).toBeFalsy();

    expect(s.nFlag).toBeTruthy();

    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(15);
  });

  it("SBC A,B", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x36, // LD A,#36
      0x06,
      0x24, // LD B,#24
      0x37, // SCF
      0xdd,
      0x98 // SBC B
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x11);
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeFalsy();
    expect(s.hFlag).toBeFalsy();
    expect(s.pvFlag).toBeFalsy();
    expect(s.cFlag).toBeFalsy();

    expect(s.nFlag).toBeTruthy();

    m.shouldKeepRegisters("AF, B");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0007);
    expect(s.tacts).toBe(26);
  });

  it("SBC A,C", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x36, // LD A,#36
      0x0e,
      0x24, // LD C,#24
      0x37, // SCF
      0xdd,
      0x99 // SBC C
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x11);
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeFalsy();
    expect(s.hFlag).toBeFalsy();
    expect(s.pvFlag).toBeFalsy();
    expect(s.cFlag).toBeFalsy();

    expect(s.nFlag).toBeTruthy();

    m.shouldKeepRegisters("AF, C");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0007);
    expect(s.tacts).toBe(26);
  });

  it("SBC A,D", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x36, // LD A,#36
      0x16,
      0x24, // LD D,#24
      0x37, // SCF
      0xdd,
      0x9a // SBC D
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x11);
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeFalsy();
    expect(s.hFlag).toBeFalsy();
    expect(s.pvFlag).toBeFalsy();
    expect(s.cFlag).toBeFalsy();

    expect(s.nFlag).toBeTruthy();

    m.shouldKeepRegisters("AF, D");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0007);
    expect(s.tacts).toBe(26);
  });

  it("SBC A,E", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x36, // LD A,#36
      0x1e,
      0x24, // LD E,#24
      0x37, // SCF
      0xdd,
      0x9b // SBC E
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x11);
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeFalsy();
    expect(s.hFlag).toBeFalsy();
    expect(s.pvFlag).toBeFalsy();
    expect(s.cFlag).toBeFalsy();

    expect(s.nFlag).toBeTruthy();

    m.shouldKeepRegisters("AF, E");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0007);
    expect(s.tacts).toBe(26);
  });

  it("SBC A,XH", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x36, // LD A,#36
      0xdd,
      0x21,
      0x3d,
      0x24, // LD IX,#243D
      0xdd,
      0x9c // SBC XH
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x11);
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeFalsy();
    expect(s.hFlag).toBeFalsy();
    expect(s.pvFlag).toBeFalsy();
    expect(s.cFlag).toBeFalsy();

    expect(s.nFlag).toBeTruthy();
    m.shouldKeepRegisters("AF, IX");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0008);
    expect(s.tacts).toBe(29);
  });

  it("SBC A,XL", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x36, // LD A,#36
      0xdd,
      0x21,
      0x24,
      0x3d, // LD IX,#3D24
      0xdd,
      0x9d // SBC XL
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x11);
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeFalsy();
    expect(s.hFlag).toBeFalsy();
    expect(s.pvFlag).toBeFalsy();
    expect(s.cFlag).toBeFalsy();

    expect(s.nFlag).toBeTruthy();
    m.shouldKeepRegisters("AF, IX");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0008);
    expect(s.tacts).toBe(29);
  });

  it("SBC A,(IX+D)", () => {
    // --- Arrange
    const OFFS = 0x54;
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x02, // LD A,2
      0xdd,
      0x9e,
      OFFS // SBC A,(IX+#54)
    ]);
    const sup = m.cpu.getTestSupport();
    sup.setIX(0x1000);
    sup.setF(m.cpu.getCpuState().f | FlagsSetMask.C);
    m.memory[0x1000 + OFFS] = 0x7c;

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x85);

    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(26);
  });

  it("SBC A,A", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x36, // LD A,#36
      0x37, // SCF
      0xdd,
      0x9f // SBC A
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0xff);
    expect(s.sFlag).toBeTruthy();
    expect(s.zFlag).toBeFalsy();
    expect(s.hFlag).toBeTruthy();
    expect(s.pvFlag).toBeFalsy();
    expect(s.cFlag).toBeTruthy();

    expect(s.nFlag).toBeTruthy();

    m.shouldKeepRegisters("AF, L");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(19);
  });

  it("AND B", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x12, // LD A,#12
      0x06,
      0x23, // LD B,#23
      0xdd,
      0xa0 // AND B
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x02);
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeFalsy();
    expect(s.pvFlag).toBeFalsy();

    expect(s.hFlag).toBeTruthy();
    expect(s.nFlag).toBeFalsy();
    expect(s.cFlag).toBeFalsy();

    m.shouldKeepRegisters("AF, B");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(22);
  });

  it("AND C", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x12, // LD A,#12
      0x0e,
      0x23, // LD C,#23
      0xdd,
      0xa1 // AND C
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x02);
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeFalsy();
    expect(s.pvFlag).toBeFalsy();

    expect(s.hFlag).toBeTruthy();
    expect(s.nFlag).toBeFalsy();
    expect(s.cFlag).toBeFalsy();

    m.shouldKeepRegisters("AF, C");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(22);
  });

  it("AND D", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x12, // LD A,#12
      0x16,
      0x23, // LD D,#23
      0xdd,
      0xa2 // AND D
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x02);
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeFalsy();
    expect(s.pvFlag).toBeFalsy();

    expect(s.hFlag).toBeTruthy();
    expect(s.nFlag).toBeFalsy();
    expect(s.cFlag).toBeFalsy();

    m.shouldKeepRegisters("AF, D");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(22);
  });

  it("AND E", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x12, // LD A,#12
      0x1e,
      0x23, // LD E,#23
      0xdd,
      0xa3 // AND E
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x02);
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeFalsy();
    expect(s.pvFlag).toBeFalsy();

    expect(s.hFlag).toBeTruthy();
    expect(s.nFlag).toBeFalsy();
    expect(s.cFlag).toBeFalsy();

    m.shouldKeepRegisters("AF, E");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(22);
  });

  it("AND XH", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x12, // LD A,#12
      0xdd,
      0xa4 // AND XH
    ]);
    const sup = m.cpu.getTestSupport();
    sup.setIX(0x23aa);
    sup.setF(m.cpu.getCpuState().f & 0xfe);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x02);
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeFalsy();
    expect(s.pvFlag).toBeFalsy();

    expect(s.hFlag).toBeTruthy();
    expect(s.cFlag).toBeFalsy();
    expect(s.nFlag).toBeFalsy();
    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(15);
  });

  it("AND XL", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x12, // LD A,#12
      0xdd,
      0xa5 // AND XL
    ]);
    const sup = m.cpu.getTestSupport();
    sup.setIX(0xaa23);
    sup.setF(m.cpu.getCpuState().f & 0xfe);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x02);
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeFalsy();
    expect(s.pvFlag).toBeFalsy();

    expect(s.hFlag).toBeTruthy();
    expect(s.cFlag).toBeFalsy();
    expect(s.nFlag).toBeFalsy();
    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(15);
  });

  it("AND (IX+D)", () => {
    // --- Arrange
    const OFFS = 0x54;
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x71, // LD A,#71
      0xdd,
      0xa6,
      OFFS // AND (IX+#54)
    ]);
    const sup = m.cpu.getTestSupport();
    sup.setIX(0x1000);
    sup.setF(m.cpu.getCpuState().f | FlagsSetMask.C);
    m.memory[0x1000 + OFFS] = 0x7d;

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x71);

    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(26);
  });

  it("AND A", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x12, // LD A,#12
      0xdd,
      0xa7 // AND A
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x12);
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeFalsy();
    expect(s.pvFlag).toBeTruthy();

    expect(s.hFlag).toBeTruthy();
    expect(s.nFlag).toBeFalsy();
    expect(s.cFlag).toBeFalsy();

    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(15);
  });

  it("XOR B", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x12, // LD A,#12
      0x06,
      0x23, // LD B,#23
      0xdd,
      0xa8 // XOR B
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x31);
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeFalsy();
    expect(s.pvFlag).toBeFalsy();

    expect(s.hFlag).toBeFalsy();
    expect(s.nFlag).toBeFalsy();
    expect(s.cFlag).toBeFalsy();

    m.shouldKeepRegisters("AF, B");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(22);
  });

  it("XOR C", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x12, // LD A,#12
      0x0e,
      0x23, // LD C,#23
      0xdd,
      0xa9 // XOR C
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x31);
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeFalsy();
    expect(s.pvFlag).toBeFalsy();

    expect(s.hFlag).toBeFalsy();
    expect(s.nFlag).toBeFalsy();
    expect(s.cFlag).toBeFalsy();

    m.shouldKeepRegisters("AF, C");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(22);
  });

  it("XOR D", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x12, // LD A,#12
      0x16,
      0x23, // LD D,#23
      0xdd,
      0xaa // XOR D
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x31);
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeFalsy();
    expect(s.pvFlag).toBeFalsy();

    expect(s.hFlag).toBeFalsy();
    expect(s.nFlag).toBeFalsy();
    expect(s.cFlag).toBeFalsy();

    m.shouldKeepRegisters("AF, D");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(22);
  });

  it("XOR E", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x12, // LD A,#12
      0x1e,
      0x23, // LD E,#23
      0xdd,
      0xab // XOR E
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x31);
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeFalsy();
    expect(s.pvFlag).toBeFalsy();

    expect(s.hFlag).toBeFalsy();
    expect(s.nFlag).toBeFalsy();
    expect(s.cFlag).toBeFalsy();

    m.shouldKeepRegisters("AF, E");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(22);
  });

  it("XOR XH works as expected", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x12, // LD A,#12
      0xdd,
      0xac // XOR XH
    ]);
    const sup = m.cpu.getTestSupport();
    sup.setIX(0x23aa);
    sup.setF(m.cpu.getCpuState().f & 0xfe);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x31);
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeFalsy();
    expect(s.pvFlag).toBeFalsy();

    expect(s.hFlag).toBeFalsy();
    expect(s.cFlag).toBeFalsy();
    expect(s.nFlag).toBeFalsy();
    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(15);
  });

  it("XOR XL works as expected", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x12, // LD A,#12
      0xdd,
      0xad // XOR XL
    ]);
    const sup = m.cpu.getTestSupport();
    sup.setIX(0xaa23);
    sup.setF(m.cpu.getCpuState().f & 0xfe);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x31);
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeFalsy();
    expect(s.pvFlag).toBeFalsy();

    expect(s.hFlag).toBeFalsy();
    expect(s.cFlag).toBeFalsy();
    expect(s.nFlag).toBeFalsy();
    m.shouldKeepRegisters("AF, IX");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(15);
  });

  it("XOR (IX+D)", () => {
    // --- Arrange
    const OFFS = 0x54;
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x71, // LD A,#71
      0xdd,
      0xae,
      OFFS // XOR (IX+#54)
    ]);
    const sup = m.cpu.getTestSupport();
    sup.setIX(0x1000);
    sup.setF(m.cpu.getCpuState().f & 0xfe);
    m.memory[0x1000 + OFFS] = 0x7d;

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x0c);

    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(26);
  });

  it("XOR A", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x12, // LD A,#12
      0xdd,
      0xaf // XOR A
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x00);
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeTruthy();
    expect(s.pvFlag).toBeTruthy();

    expect(s.hFlag).toBeFalsy();
    expect(s.nFlag).toBeFalsy();
    expect(s.cFlag).toBeFalsy();

    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(15);
  });

  it("OR B", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x52, // LD A,#52
      0x06,
      0x23, // LD B,#23
      0xdd,
      0xb0 // OR B
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x73);
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeFalsy();
    expect(s.pvFlag).toBeFalsy();

    expect(s.hFlag).toBeFalsy();
    expect(s.nFlag).toBeFalsy();
    expect(s.cFlag).toBeFalsy();

    m.shouldKeepRegisters("AF, B");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(22);
  });

  it("OR C", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x52, // LD A,#52
      0x0e,
      0x23, // LD C,#23
      0xdd,
      0xb1 // OR C
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x73);
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeFalsy();
    expect(s.pvFlag).toBeFalsy();

    expect(s.hFlag).toBeFalsy();
    expect(s.nFlag).toBeFalsy();
    expect(s.cFlag).toBeFalsy();

    m.shouldKeepRegisters("AF, C");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(22);
  });

  it("OR D", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x52, // LD A,#52
      0x16,
      0x23, // LD D,#23
      0xdd,
      0xb2 // OR D
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x73);
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeFalsy();
    expect(s.pvFlag).toBeFalsy();

    expect(s.hFlag).toBeFalsy();
    expect(s.nFlag).toBeFalsy();
    expect(s.cFlag).toBeFalsy();

    m.shouldKeepRegisters("AF, D");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(22);
  });

  it("OR E", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x52, // LD A,#52
      0x1e,
      0x23, // LD E,#23
      0xdd,
      0xb3 // OR E
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x73);
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeFalsy();
    expect(s.pvFlag).toBeFalsy();

    expect(s.hFlag).toBeFalsy();
    expect(s.nFlag).toBeFalsy();
    expect(s.cFlag).toBeFalsy();

    m.shouldKeepRegisters("AF, E");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(22);
  });

  it("OR XH", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x12, // LD A,#12
      0xdd,
      0xb4 // OR XH
    ]);
    const sup = m.cpu.getTestSupport();
    sup.setIX(0x23aa);
    sup.setF(m.cpu.getCpuState().f & 0xfe);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x33);
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeFalsy();
    expect(s.pvFlag).toBeTruthy();

    expect(s.hFlag).toBeFalsy();
    expect(s.cFlag).toBeFalsy();
    expect(s.nFlag).toBeFalsy();
    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(15);
  });

  it("OR XL", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x12, // LD A,#12
      0xdd,
      0xb5 // OR XL
    ]);
    const sup = m.cpu.getTestSupport();
    sup.setIX(0xaa23);
    sup.setF(m.cpu.getCpuState().f & 0xfe);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x33);
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeFalsy();
    expect(s.pvFlag).toBeTruthy();

    expect(s.hFlag).toBeFalsy();
    expect(s.cFlag).toBeFalsy();
    expect(s.nFlag).toBeFalsy();
    m.shouldKeepRegisters("AF, IX");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(15);
  });

  it("OR (IX+D)", () => {
    // --- Arrange
    const OFFS = 0x54;
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x0d, // LD A,#0D
      0xdd,
      0xb6,
      OFFS // OR (IX+#54)
    ]);
    const sup = m.cpu.getTestSupport();
    sup.setIX(0x1000);
    sup.setF(m.cpu.getCpuState().f & 0xfe);
    m.memory[0x1000 + OFFS] = 0x70;

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x7d);

    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(26);
  });

  it("OR A", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x52, // LD A,#52
      0xdd,
      0xb7 // OR A
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x52);
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeFalsy();
    expect(s.pvFlag).toBeFalsy();

    expect(s.hFlag).toBeFalsy();
    expect(s.nFlag).toBeFalsy();
    expect(s.cFlag).toBeFalsy();

    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(15);
  });

  it("CP B", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x06,
      0x24, // LD B,#24
      0xdd,
      0xb8 // CP B
    ]);
    m.cpu.getTestSupport().setA(0x36);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeFalsy();
    expect(s.hFlag).toBeFalsy();
    expect(s.pvFlag).toBeFalsy();
    expect(s.cFlag).toBeFalsy();

    expect(s.nFlag).toBeTruthy();

    m.shouldKeepRegisters("F, B");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(15);
  });

  it("CP C", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x0e,
      0x24, // LD C,#24
      0xdd,
      0xb9 // CP C
    ]);
    m.cpu.getTestSupport().setA(0x36);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeFalsy();
    expect(s.hFlag).toBeFalsy();
    expect(s.pvFlag).toBeFalsy();
    expect(s.cFlag).toBeFalsy();

    expect(s.nFlag).toBeTruthy();

    m.shouldKeepRegisters("F, C");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(15);
  });

  it("CP D", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x16,
      0x24, // LD D,#24
      0xdd,
      0xba // CP D
    ]);
    m.cpu.getTestSupport().setA(0x36);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeFalsy();
    expect(s.hFlag).toBeFalsy();
    expect(s.pvFlag).toBeFalsy();
    expect(s.cFlag).toBeFalsy();

    expect(s.nFlag).toBeTruthy();

    m.shouldKeepRegisters("F, D");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(15);
  });

  it("CP E", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x1e,
      0x24, // LD E,#24
      0xdd,
      0xbb // CP E
    ]);
    m.cpu.getTestSupport().setA(0x36);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeFalsy();
    expect(s.hFlag).toBeFalsy();
    expect(s.pvFlag).toBeFalsy();
    expect(s.cFlag).toBeFalsy();

    expect(s.nFlag).toBeTruthy();

    m.shouldKeepRegisters("F, E");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(15);
  });

  it("CP XH", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0xdd,
      0xbc // CP XH
    ]);
    const sup = m.cpu.getTestSupport();
    sup.setA(0x36);
    sup.setIX(0x24aa);
    sup.setF(m.cpu.getCpuState().f & 0xfe);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeFalsy();
    expect(s.hFlag).toBeFalsy();
    expect(s.pvFlag).toBeFalsy();
    expect(s.cFlag).toBeFalsy();

    expect(s.nFlag).toBeTruthy();
    m.shouldKeepRegisters("F");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(8);
  });

  it("CP XL", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0xdd,
      0xbd // CP XL
    ]);
    const sup = m.cpu.getTestSupport();
    sup.setA(0x36);
    sup.setIX(0xaa24);
    sup.setF(m.cpu.getCpuState().f & 0xfe);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeFalsy();
    expect(s.hFlag).toBeFalsy();
    expect(s.pvFlag).toBeFalsy();
    expect(s.cFlag).toBeFalsy();

    expect(s.nFlag).toBeTruthy();
    m.shouldKeepRegisters("F");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(8);
  });

  it("CP (IX+D)", () => {
    // --- Arrange
    const OFFS = 0x54;
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x70, // LD A,#70
      0xdd,
      0xbe,
      OFFS // CP (IX+#54)
    ]);
    const sup = m.cpu.getTestSupport();
    sup.setIX(0x1000);
    sup.setF(m.cpu.getCpuState().f & 0xfe);
    m.memory[0x1000 + OFFS] = 0x70;

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.f).toBe(0x42);

    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(26);
  });

  it("CP A", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0xdd,
      0xbf // CP A
    ]);
    m.cpu.getTestSupport().setA(0x36);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeTruthy();
    expect(s.hFlag).toBeFalsy();
    expect(s.pvFlag).toBeFalsy();
    expect(s.cFlag).toBeFalsy();

    expect(s.nFlag).toBeTruthy();

    m.shouldKeepRegisters("F");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(8);
  });
});
