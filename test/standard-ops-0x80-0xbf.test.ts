import "mocha";
import * as expect from "expect";
import { Z80TestMachine, RunMode } from "./Z80TestMachine";

describe("Z80 CPU - standard 80-bf", () => {
  it("ADD A,B", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x12, // LD A,#12
      0x06,
      0x24, // LD B,#24
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

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(18);
  });

  it("ADD A,B handles Carry flag", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0xf0, // LD A,#F0
      0x06,
      0xf0, // LD B,#F0
      0x80 // ADD A,B
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0xe0);
    expect(s.sFlag).toBeTruthy();
    expect(s.zFlag).toBeFalsy();
    expect(s.hFlag).toBeFalsy();
    expect(s.pvFlag).toBeFalsy();
    expect(s.cFlag).toBeTruthy();

    expect(s.nFlag).toBeFalsy();

    m.shouldKeepRegisters("AF, B");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(18);
  });

  it("ADD A,B handles Z flag", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x82, // LD A,#82
      0x06,
      0x7e, // LD B,#7E
      0x80 // ADD A,B
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x00);
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeTruthy();
    expect(s.hFlag).toBeTruthy();
    expect(s.pvFlag).toBeFalsy();
    expect(s.cFlag).toBeTruthy();

    expect(s.nFlag).toBeFalsy();

    m.shouldKeepRegisters("AF, B");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(18);
  });

  it("ADD A,B handles S flag", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x44, // LD A,#44
      0x06,
      0x42, // LD B,#42
      0x80 // ADD A,B
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x86);
    expect(s.sFlag).toBeTruthy();
    expect(s.zFlag).toBeFalsy();
    expect(s.hFlag).toBeFalsy();
    expect(s.pvFlag).toBeTruthy();
    expect(s.cFlag).toBeFalsy();

    expect(s.nFlag).toBeFalsy();

    m.shouldKeepRegisters("AF, B");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(18);
  });

  it("ADD A,C works as expected", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x12, // LD A,#12
      0x0e,
      0x24, // LD C,#24
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

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(18);
  });

  it("ADD A,D", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x12, // LD A,#12
      0x16,
      0x24, // LD D,#24
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

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(18);
  });

  it("ADD A,E", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x12, // LD A,#12
      0x1e,
      0x24, // LD E,#24
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

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(18);
  });

  it("ADD A,H", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x12, // LD A,#12
      0x26,
      0x24, // LD H,#24
      0x84 // ADD A,H
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

    m.shouldKeepRegisters("AF, H");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(18);
  });

  it("ADD A,L", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x12, // LD A,#12
      0x2e,
      0x24, // LD L,#24
      0x85 // ADD A,L
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

    m.shouldKeepRegisters("AF, L");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(18);
  });

  it("ADD A,(HL)", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x12, // LD A,#12
      0x21,
      0x00,
      0x10, // LD HL,#1000
      0x86 // ADD A,(HL)
    ]);
    m.memory[0x1000] = 0x24;

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

    m.shouldKeepRegisters("AF, HL");
    m.shouldKeepMemory("1000");

    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(24);
  });

  it("ADD A,A", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x12, // LD A,#12
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

    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("ADC A,B", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x12, // LD A,#12
      0x06,
      0x24, // LD B,#24
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

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(18);
  });

  it("ADC A,B handles carry flag", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0xf0, // LD A,#F0
      0x06,
      0xf0, // LD B,#F0
      0x88 // ADC A,B
    ]);

    // --- Act
    let s = m.cpu.getCpuState();
    m.cpu.getTestSupport().setF(s.f & 0xfe);
    m.run();

    // --- Assert
    s = m.cpu.getCpuState();

    expect(s.a).toBe(0xe0);
    expect(s.sFlag).toBeTruthy();
    expect(s.zFlag).toBeFalsy();
    expect(s.hFlag).toBeFalsy();
    expect(s.pvFlag).toBeFalsy();
    expect(s.cFlag).toBeTruthy();

    expect(s.nFlag).toBeFalsy();

    m.shouldKeepRegisters("AF, B");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(18);
  });

  it("ADC A,B handles Z flag", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x82, // LD A,#82
      0x06,
      0x7e, // LD B,#7E
      0x88 // ADC A,B
    ]);

    // --- Act
    let s = m.cpu.getCpuState();
    m.cpu.getTestSupport().setF(s.f & 0xfe);
    m.run();

    // --- Assert
    s = m.cpu.getCpuState();

    expect(s.a).toBe(0x00);
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeTruthy();
    expect(s.hFlag).toBeTruthy();
    expect(s.pvFlag).toBeFalsy();
    expect(s.cFlag).toBeTruthy();

    expect(s.nFlag).toBeFalsy();

    m.shouldKeepRegisters("AF, B");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(18);
  });

  it("ADC A,B handles S flag", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x44, // LD A,#44
      0x06,
      0x42, // LD B,#42
      0x88 // ADC A,B
    ]);

    // --- Act
    let s = m.cpu.getCpuState();
    m.cpu.getTestSupport().setF(s.f & 0xfe);
    m.run();

    // --- Assert
    s = m.cpu.getCpuState();

    expect(s.a).toBe(0x86);
    expect(s.sFlag).toBeTruthy();
    expect(s.zFlag).toBeFalsy();
    expect(s.hFlag).toBeFalsy();
    expect(s.pvFlag).toBeTruthy();
    expect(s.cFlag).toBeFalsy();

    expect(s.nFlag).toBeFalsy();

    m.shouldKeepRegisters("AF, B");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(18);
  });

  it("ADC A,B with carry", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x12, // LD A,#12
      0x06,
      0x24, // LD B,#24
      0x37, // SCF
      0x88 // ADC A,B
    ]);

    // --- Act
    let s = m.cpu.getCpuState();
    m.cpu.getTestSupport().setF(s.f & 0xfe);
    m.run();

    // --- Assert
    s = m.cpu.getCpuState();

    expect(s.a).toBe(0x37);
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

  it("ADC A,B with carry handles carry flag", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0xf0, // LD A,#F0
      0x06,
      0xf0, // LD B,#F0
      0x37, // SCF
      0x88 // ADC A,B
    ]);

    // --- Act
    let s = m.cpu.getCpuState();
    m.cpu.getTestSupport().setF(s.f & 0xfe);
    m.run();

    // --- Assert
    s = m.cpu.getCpuState();

    expect(s.a).toBe(0xe1);
    expect(s.sFlag).toBeTruthy();
    expect(s.zFlag).toBeFalsy();
    expect(s.hFlag).toBeFalsy();
    expect(s.pvFlag).toBeFalsy();
    expect(s.cFlag).toBeTruthy();

    expect(s.nFlag).toBeFalsy();

    m.shouldKeepRegisters("AF, B");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(22);
  });

  it("ADC A,B with carry handles Z flag", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x82, // LD A,#82
      0x06,
      0x7d, // LD B,#7D
      0x37, // SCF
      0x88 // ADC A,B
    ]);

    // --- Act
    let s = m.cpu.getCpuState();
    m.cpu.getTestSupport().setF(s.f & 0xfe);
    m.run();

    // --- Assert
    s = m.cpu.getCpuState();

    expect(s.a).toBe(0x00);
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeTruthy();
    expect(s.hFlag).toBeTruthy();
    expect(s.pvFlag).toBeFalsy();
    expect(s.cFlag).toBeTruthy();

    expect(s.nFlag).toBeFalsy();

    m.shouldKeepRegisters("AF, B");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(22);
  });

  it("ADC A,B with carry A,B handles S flag", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x44, // LD A,#44
      0x06,
      0x42, // LD B,#42
      0x37, // SCF
      0x88 // ADC A,B
    ]);

    // --- Act
    let s = m.cpu.getCpuState();
    m.cpu.getTestSupport().setF(s.f & 0xfe);
    m.run();

    // --- Assert
    s = m.cpu.getCpuState();

    expect(s.a).toBe(0x87);
    expect(s.sFlag).toBeTruthy();
    expect(s.zFlag).toBeFalsy();
    expect(s.hFlag).toBeFalsy();
    expect(s.pvFlag).toBeTruthy();
    expect(s.cFlag).toBeFalsy();

    expect(s.nFlag).toBeFalsy();

    m.shouldKeepRegisters("AF, B");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(22);
  });

  it("ADC A,C works as expected", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x12, // LD A,#12
      0x0e,
      0x24, // LD C,#24
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

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(18);
  });

  it("ADC A,C with carry", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x12, // LD A,#12
      0x0e,
      0x24, // LD C,#24
      0x37, // SCF
      0x89 // ADC A,C
    ]);

    // --- Act
    let s = m.cpu.getCpuState();
    m.cpu.getTestSupport().setF(s.f & 0xfe);
    m.run();

    // --- Assert
    s = m.cpu.getCpuState();

    expect(s.a).toBe(0x37);
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

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(18);
  });

  it("ADC A,D with carry", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x12, // LD A,#12
      0x16,
      0x24, // LD D,#24
      0x37, // SCF
      0x8a // ADC A,D
    ]);

    // --- Act
    let s = m.cpu.getCpuState();
    m.cpu.getTestSupport().setF(s.f & 0xfe);
    m.run();

    // --- Assert
    s = m.cpu.getCpuState();

    expect(s.a).toBe(0x37);
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

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(18);
  });

  it("ADC A,E with carry", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x12, // LD A,#12
      0x1e,
      0x24, // LD E,#24
      0x37, // SCF
      0x8b // ADC A,E
    ]);

    // --- Act
    let s = m.cpu.getCpuState();
    m.cpu.getTestSupport().setF(s.f & 0xfe);
    m.run();

    // --- Assert
    s = m.cpu.getCpuState();

    expect(s.a).toBe(0x37);
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

  it("ADC A,H", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x12, // LD A,#12
      0x26,
      0x24, // LD H,#24
      0x8c // ADC A,H
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

    m.shouldKeepRegisters("AF, H");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(18);
  });

  it("ADC A,H with carry", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x12, // LD A,#12
      0x26,
      0x24, // LD H,#24
      0x37, // SCF
      0x8c // ADC A,H
    ]);

    // --- Act
    let s = m.cpu.getCpuState();
    m.cpu.getTestSupport().setF(s.f & 0xfe);
    m.run();

    // --- Assert
    s = m.cpu.getCpuState();

    expect(s.a).toBe(0x37);
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeFalsy();
    expect(s.hFlag).toBeFalsy();
    expect(s.pvFlag).toBeFalsy();
    expect(s.cFlag).toBeFalsy();

    expect(s.nFlag).toBeFalsy();

    m.shouldKeepRegisters("AF, H");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(22);
  });

  it("ADC A,L", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x12, // LD A,#12
      0x2e,
      0x24, // LD L,#24
      0x8d // ADC A,L
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

    m.shouldKeepRegisters("AF, L");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(18);
  });

  it("ADC A,L with carry", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x12, // LD A,#12
      0x2e,
      0x24, // LD L,#24
      0x37, // SCF
      0x8d // ADC A,L
    ]);

    // --- Act
    let s = m.cpu.getCpuState();
    m.cpu.getTestSupport().setF(s.f & 0xfe);
    m.run();

    // --- Assert
    s = m.cpu.getCpuState();

    expect(s.a).toBe(0x37);
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeFalsy();
    expect(s.hFlag).toBeFalsy();
    expect(s.pvFlag).toBeFalsy();
    expect(s.cFlag).toBeFalsy();

    expect(s.nFlag).toBeFalsy();

    m.shouldKeepRegisters("AF, L");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(22);
  });

  it("ADC A,A", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x12, // LD A,#12
      0x8f // ADC A,L
    ]);

    // --- Act
    let s = m.cpu.getCpuState();
    m.cpu.getTestSupport().setF(s.f & 0xfe);
    m.run();

    // --- Assert
    s = m.cpu.getCpuState();

    expect(s.a).toBe(0x24);
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeFalsy();
    expect(s.hFlag).toBeFalsy();
    expect(s.pvFlag).toBeFalsy();
    expect(s.cFlag).toBeFalsy();

    expect(s.nFlag).toBeFalsy();

    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("ADC A,(HL)", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x12, // LD A,#12
      0x21,
      0x00,
      0x10, // LD HL,#1000
      0x8e // ADD A,(HL)
    ]);
    m.memory[0x1000] = 0x24;

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

    m.shouldKeepRegisters("AF, HL");
    m.shouldKeepMemory("1000");

    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(24);
  });

  it("ADC A,A with carry", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x12, // LD A,#12
      0x37, // SCF
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

    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(15);
  });

  it("SUB B", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x36, // LD A,#36
      0x06,
      0x24, // LD B,#24
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

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(18);
  });

  it("SUB B handles carry flag", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x40, // LD A,#40
      0x06,
      0x60, // LD B,#60
      0x90 // SUB B
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0xe0);
    expect(s.sFlag).toBeTruthy();
    expect(s.zFlag).toBeFalsy();
    expect(s.hFlag).toBeFalsy();
    expect(s.pvFlag).toBeFalsy();
    expect(s.cFlag).toBeTruthy();

    expect(s.nFlag).toBeTruthy();

    m.shouldKeepRegisters("AF, B");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(18);
  });

  it("SUB B handles Z flag", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x40, // LD A,#40
      0x06,
      0x40, // LD B,#40
      0x90 // SUB B
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

    m.shouldKeepRegisters("AF, B");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(18);
  });

  it("SUB B handles H flag", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x41, // LD A,#41
      0x06,
      0x43, // LD B,#43
      0x90 // SUB B
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0xfe);
    expect(s.sFlag).toBeTruthy();
    expect(s.zFlag).toBeFalsy();
    expect(s.hFlag).toBeTruthy();
    expect(s.pvFlag).toBeFalsy();
    expect(s.cFlag).toBeTruthy();

    expect(s.nFlag).toBeTruthy();

    m.shouldKeepRegisters("AF, B");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(18);
  });

  it("SUB B handles P flag", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x61, // LD A,#61
      0x06,
      0xb3, // LD B,#B3
      0x90 // SUB B
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0xae);
    expect(s.sFlag).toBeTruthy();
    expect(s.zFlag).toBeFalsy();
    expect(s.hFlag).toBeTruthy();
    expect(s.pvFlag).toBeTruthy();
    expect(s.cFlag).toBeTruthy();

    expect(s.nFlag).toBeTruthy();

    m.shouldKeepRegisters("AF, B");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(18);
  });

  it("SUB C", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x36, // LD A,#36
      0x0e,
      0x24, // LD C,#24
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

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(18);
  });

  it("SUB D", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x36, // LD A,#36
      0x16,
      0x24, // LD D,#24
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

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(18);
  });

  it("SUB E", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x36, // LD A,#36
      0x1e,
      0x24, // LD E,#24
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

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(18);
  });

  it("SUB H", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x36, // LD A,#36
      0x26,
      0x24, // LD H,#24
      0x94 // SUB H
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

    m.shouldKeepRegisters("AF, H");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(18);
  });

  it("SUB L", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x36, // LD A,#36
      0x2e,
      0x24, // LD L,#24
      0x95 // SUB L
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

    m.shouldKeepRegisters("AF, L");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(18);
  });

  it("SUB (HL)", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x36, // LD A,#36
      0x21,
      0x00,
      0x10, // LD HL,#1000
      0x96 // SUB (HL)
    ]);
    m.memory[0x1000] = 0x24;

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

    m.shouldKeepRegisters("AF, HL");
    m.shouldKeepMemory("1000");

    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(24);
  });

  it("SUB A", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x36, // LD A,#36
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

    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
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

    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(22);
  });

  it("SBC A,B handles carry flag", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x40, // LD A,#40
      0x06,
      0x60, // LD B,#60
      0x37, // SCF
      0x98 // SBC B
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0xdf);
    expect(s.sFlag).toBeTruthy();
    expect(s.zFlag).toBeFalsy();
    expect(s.hFlag).toBeTruthy();
    expect(s.pvFlag).toBeFalsy();
    expect(s.cFlag).toBeTruthy();

    expect(s.nFlag).toBeTruthy();

    m.shouldKeepRegisters("AF, B");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(22);
  });

  it("SBC A,B handles Z flag", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x40, // LD A,#40
      0x06,
      0x3f, // LD B,#3F
      0x37, // SCF
      0x98 // SBC B
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x00);
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeTruthy();
    expect(s.hFlag).toBeTruthy();
    expect(s.pvFlag).toBeFalsy();
    expect(s.cFlag).toBeFalsy();

    expect(s.nFlag).toBeTruthy();

    m.shouldKeepRegisters("AF, B");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(22);
  });

  it("SBC A,B handles H flag", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x41, // LD A,#41
      0x06,
      0x43, // LD B,#43
      0x37, // SCF
      0x98 // SBC B
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0xfd);
    expect(s.sFlag).toBeTruthy();
    expect(s.zFlag).toBeFalsy();
    expect(s.hFlag).toBeTruthy();
    expect(s.pvFlag).toBeFalsy();
    expect(s.cFlag).toBeTruthy();

    expect(s.nFlag).toBeTruthy();

    m.shouldKeepRegisters("AF, B");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(22);
  });

  it("SBC A,B handles P flag", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x61, // LD A,#61
      0x06,
      0xb3, // LD B,#B3
      0x37, // SCF
      0x98 // SBC B
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0xad);
    expect(s.sFlag).toBeTruthy();
    expect(s.zFlag).toBeFalsy();
    expect(s.hFlag).toBeTruthy();
    expect(s.pvFlag).toBeTruthy();
    expect(s.cFlag).toBeTruthy();

    expect(s.nFlag).toBeTruthy();

    m.shouldKeepRegisters("AF, B");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(22);
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

    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(22);
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

    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(22);
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

    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(22);
  });

  it("SBC A,H", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x36, // LD A,#36
      0x26,
      0x24, // LD H,#24
      0x37, // SCF
      0x9c // SBC H
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

    m.shouldKeepRegisters("AF, H");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(22);
  });

  it("SBC A,L", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x36, // LD A,#36
      0x2e,
      0x24, // LD L,#24
      0x37, // SCF
      0x9d // SBC L
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

    m.shouldKeepRegisters("AF, L");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(22);
  });

  it("SBC A,(HL)", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x36, // LD A,#36
      0x21,
      0x00,
      0x10, // LD HL,#1000
      0x37, // SCF
      0x9e // SBC (HL)
    ]);
    m.memory[0x1000] = 0x24;

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

    m.shouldKeepRegisters("AF, HL");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0007);
    expect(s.tacts).toBe(28);
  });

  it("SBC A,A", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x36, // LD A,#36
      0x37, // SCF
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

    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(15);
  });

  it("AND B", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x12, // LD A,#12
      0x06,
      0x23, // LD B,#23
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

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(18);
  });

  it("AND B handles S flag", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0xf2, // LD A,#F2
      0x06,
      0xf3, // LD B,#F3
      0xa0 // AND B
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0xf2);
    expect(s.sFlag).toBeTruthy();
    expect(s.zFlag).toBeFalsy();
    expect(s.pvFlag).toBeFalsy();

    expect(s.hFlag).toBeTruthy();
    expect(s.nFlag).toBeFalsy();
    expect(s.cFlag).toBeFalsy();

    m.shouldKeepRegisters("AF, B");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(18);
  });

  it("AND B handles Z flag", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0xc3, // LD A,#C3
      0x06,
      0x3c, // LD B,#37
      0xa0 // AND B
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x00);
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeTruthy();
    expect(s.pvFlag).toBeTruthy();

    expect(s.hFlag).toBeTruthy();
    expect(s.nFlag).toBeFalsy();
    expect(s.cFlag).toBeFalsy();

    m.shouldKeepRegisters("AF, B");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(18);
  });

  it("AND B handles P flag", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x33, // LD A,#33
      0x06,
      0x22, // LD B,#22
      0xa0 // AND B
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x22);
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeFalsy();
    expect(s.pvFlag).toBeTruthy();

    expect(s.hFlag).toBeTruthy();
    expect(s.nFlag).toBeFalsy();
    expect(s.cFlag).toBeFalsy();

    m.shouldKeepRegisters("AF, B");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(18);
  });

  it("AND C", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x12, // LD A,#12
      0x0e,
      0x23, // LD C,#23
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

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(18);
  });

  it("AND D", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x12, // LD A,#12
      0x16,
      0x23, // LD D,#23
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

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(18);
  });

  it("AND E", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x12, // LD A,#12
      0x1e,
      0x23, // LD E,#23
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

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(18);
  });

  it("AND H", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x12, // LD A,#12
      0x26,
      0x23, // LD H,#23
      0xa4 // AND H
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

    m.shouldKeepRegisters("AF, H");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(18);
  });

  it("AND L", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x12, // LD A,#12
      0x2e,
      0x23, // LD L,#23
      0xa5 // AND L
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

    m.shouldKeepRegisters("AF, L");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(18);
  });

  it("AND (HL)", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x12, // LD A,#12
      0x21,
      0x00,
      0x10, // LD HL,#1000
      0xa6 // AND (HL)
    ]);
    m.memory[0x1000] = 0x23;

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

    m.shouldKeepRegisters("AF, HL");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(24);
  });

  it("AND A", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x12, // LD A,#12
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

    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("XOR B", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x12, // LD A,#12
      0x06,
      0x23, // LD B,#23
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

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(18);
  });

  it("XOR B handles S flag", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0xf2, // LD A,#F2
      0x06,
      0x03, // LD B,#F3
      0xa8 // XOR B
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0xf1);
    expect(s.sFlag).toBeTruthy();
    expect(s.zFlag).toBeFalsy();
    expect(s.pvFlag).toBeFalsy();

    expect(s.hFlag).toBeFalsy();
    expect(s.nFlag).toBeFalsy();
    expect(s.cFlag).toBeFalsy();

    m.shouldKeepRegisters("AF, B");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(18);
  });

  it("XOR B handles Z flag", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x43, // LD A,#C3
      0x06,
      0x43, // LD B,#C3
      0xa8 // XOR B
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

    m.shouldKeepRegisters("AF, B");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(18);
  });

  it("XOR B handles P flag", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x33, // LD A,#33
      0x06,
      0x22, // LD B,#22
      0xa8 // XOR B
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x11);
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeFalsy();
    expect(s.pvFlag).toBeTruthy();

    expect(s.hFlag).toBeFalsy();
    expect(s.nFlag).toBeFalsy();
    expect(s.cFlag).toBeFalsy();

    m.shouldKeepRegisters("AF, B");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(18);
  });

  it("XOR C", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x12, // LD A,#12
      0x0e,
      0x23, // LD C,#23
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

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(18);
  });

  it("XOR D", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x12, // LD A,#12
      0x16,
      0x23, // LD D,#23
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

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(18);
  });

  it("XOR E", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x12, // LD A,#12
      0x1e,
      0x23, // LD E,#23
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

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(18);
  });

  it("XOR H", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x12, // LD A,#12
      0x26,
      0x23, // LD H,#23
      0xac // XOR H
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

    m.shouldKeepRegisters("AF, H");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(18);
  });

  it("XOR L", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x12, // LD A,#12
      0x2e,
      0x23, // LD L,#23
      0xad // XOR L
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

    m.shouldKeepRegisters("AF, L");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(18);
  });

  it("XOR (HL)", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x12, // LD A,#12
      0x21,
      0x00,
      0x10, // LD HL,#1000
      0xae // XOR (HL)
    ]);
    m.memory[0x1000] = 0x23;

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

    m.shouldKeepRegisters("AF, HL");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(24);
  });

  it("XOR A", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x12, // LD A,#12
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

    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("OR B", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x52, // LD A,#52
      0x06,
      0x23, // LD B,#23
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

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(18);
  });

  it("OR B handles S flag", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x82, // LD A,#82
      0x06,
      0x22, // LD B,#22
      0xb0 // OR B
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0xa2);
    expect(s.sFlag).toBeTruthy();
    expect(s.zFlag).toBeFalsy();
    expect(s.pvFlag).toBeFalsy();

    expect(s.hFlag).toBeFalsy();
    expect(s.nFlag).toBeFalsy();
    expect(s.cFlag).toBeFalsy();

    m.shouldKeepRegisters("AF, B");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(18);
  });

  it("OR B handles Z flag", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x00, // LD A,#00
      0x06,
      0x00, // LD B,#00
      0xb0 // OR B
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

    m.shouldKeepRegisters("AF, B");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(18);
  });

  it("OR B handles P flag", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x32, // LD A,#32
      0x06,
      0x11, // LD B,#11
      0xb0 // OR B
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x33);
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeFalsy();
    expect(s.pvFlag).toBeTruthy();

    expect(s.hFlag).toBeFalsy();
    expect(s.nFlag).toBeFalsy();
    expect(s.cFlag).toBeFalsy();

    m.shouldKeepRegisters("AF, B");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(18);
  });

  it("OR C", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x52, // LD A,#52
      0x0e,
      0x23, // LD C,#23
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

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(18);
  });

  it("OR D", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x52, // LD A,#52
      0x16,
      0x23, // LD D,#23
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

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(18);
  });

  it("OR E works as expected", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x52, // LD A,#52
      0x1e,
      0x23, // LD E,#23
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

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(18);
  });

  it("OR H", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x52, // LD A,#52
      0x26,
      0x23, // LD H,#23
      0xb4 // OR H
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

    m.shouldKeepRegisters("AF, H");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(18);
  });

  it("OR L", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x52, // LD A,#52
      0x2e,
      0x23, // LD L,#23
      0xb5 // OR L
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

    m.shouldKeepRegisters("AF, L");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(18);
  });

  it("OR (HL)", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x52, // LD A,#52
      0x21,
      0x00,
      0x10, // LD HL,#1000
      0xb6 // OR (HL)
    ]);
    m.memory[0x1000] = 0x23;

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

    m.shouldKeepRegisters("AF, HL");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(24);
  });

  it("OR A", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x52, // LD A,#52
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

    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("CP B", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x06,
      0x24, // LD B,#24
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

    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("CP B handles carry flag", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x06,
      0x60, // LD B,#60
      0xb8 // CP B
    ]);
    m.cpu.getTestSupport().setA(0x40);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.sFlag).toBeTruthy();
    expect(s.zFlag).toBeFalsy();
    expect(s.hFlag).toBeFalsy();
    expect(s.pvFlag).toBeFalsy();
    expect(s.cFlag).toBeTruthy();

    expect(s.nFlag).toBeTruthy();

    m.shouldKeepRegisters("F, B");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("CP B handles Z flag", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x06,
      0x40, // LD B,#40
      0xb8 // CP B
    ]);
    m.cpu.getTestSupport().setA(0x40);

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

    m.shouldKeepRegisters("F, B");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("CP B handles H flag", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x06,
      0x43, // LD B,#43
      0xb8 // CP B
    ]);
    m.cpu.getTestSupport().setA(0x41);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.sFlag).toBeTruthy();
    expect(s.zFlag).toBeFalsy();
    expect(s.hFlag).toBeTruthy();
    expect(s.pvFlag).toBeFalsy();
    expect(s.cFlag).toBeTruthy();

    expect(s.nFlag).toBeTruthy();

    m.shouldKeepRegisters("F, B");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("CP C", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x0e,
      0x24, // LD C,#24
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

    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("CP D", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x16,
      0x24, // LD D,#24
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

    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("CP E works as expected", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x1e,
      0x24, // LD E,#24
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

    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("CP H", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x26,
      0x24, // LD H,#24
      0xbc // CP H
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

    m.shouldKeepRegisters("F, H");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("CP L", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x2e,
      0x24, // LD L,#24
      0xbd // CP L
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

    m.shouldKeepRegisters("F, L");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("CP (HL)", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x21,
      0x00,
      0x10, // LD HL,#1000
      0xbe // CP (HL)
    ]);
    m.cpu.getTestSupport().setA(0x61);
    m.memory[0x1000] = 0xb3;

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.sFlag).toBeTruthy();
    expect(s.zFlag).toBeFalsy();
    expect(s.hFlag).toBeTruthy();
    expect(s.pvFlag).toBeTruthy();
    expect(s.cFlag).toBeTruthy();

    expect(s.nFlag).toBeTruthy();

    m.shouldKeepRegisters("F, HL");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(17);
  });

  it("CP A", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
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

    expect(s.pc).toBe(0x0001);
    expect(s.tacts).toBe(4);
  });
});
