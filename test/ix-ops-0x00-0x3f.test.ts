import "mocha";
import * as expect from "expect";
import { Z80TestMachine, RunMode } from "./Z80TestMachine";
import { FlagsSetMask } from "../src/spectrumemu/cpu/FlagsSetMask";

describe("Z80 CPU - IX-indexed 00-3f", () => {
  it("NOP", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xdd,
      0x00 // NOP
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters();
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(8);
  });

  it("LD BC,NN", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xdd,
      0x01,
      0x26,
      0xa9 // LD BC,#A926
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("BC");
    m.shouldKeepMemory();

    expect(s.bc).toBe(0xa926);
    expect(s.b).toBe(0xa9);
    expect(s.c).toBe(0x26);
    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(14);
  });

  it("LD (BC),A", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0xdd,
      0x01,
      0x26,
      0xa9, // LD BC,#A926
      0x3e,
      0x94, // LD A,#94
      0x02 // LD (BC),A
    ]);

    // --- Act
    const valueBefore = m.memory[0xa926];
    m.run();
    const valueAfter = m.memory[0xa926];

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("BC, A");
    m.shouldKeepMemory("A926");

    expect(s.bc).toBe(0xa926);
    expect(s.a).toBe(0x94);
    expect(valueBefore).toBe(0);
    expect(valueAfter).toBe(0x94);
    expect(s.pc).toBe(0x0007);
    expect(s.tacts).toBe(28);
  });

  it("INC BC", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0xdd,
      0x01,
      0x26,
      0xa9, // LD BC,#A926
      0x03 // INC BC
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("BC");
    m.shouldKeepMemory();

    expect(s.bc).toBe(0xa927);
    expect(s.b).toBe(0xa9);
    expect(s.c).toBe(0x27);
    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(20);
  });

  it("INC B", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0xdd,
      0x06,
      0x43, // LD B,#43
      0x04 // INC B
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("B, F");
    m.shouldKeepMemory();
    m.shouldKeepCFlag();
    expect(s.nFlag).toBeFalsy();

    expect(s.b).toBe(0x44);
    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(15);
  });

  it("DEC B", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0xdd,
      0x06,
      0x43, // LD B,#43
      0x05 // DEC B
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("B, F");
    m.shouldKeepMemory();
    m.shouldKeepCFlag();
    expect(s.nFlag).toBeTruthy();

    expect(s.b).toBe(0x42);
    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(15);
  });

  it("LD B,N", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xdd,
      0x06,
      0x26 // LD B,#26
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("B");
    m.shouldKeepMemory();

    expect(s.b).toBe(0x26);
    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("RLCA", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x71, // LD A,#71
      0xdd,
      0x07 // RLCA
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("A, F");
    m.shouldKeepMemory();
    m.shouldKeepSFlag();
    m.shouldKeepZFlag();
    m.shouldKeepPVFlag();

    expect(s.hFlag).toBeFalsy();
    expect(s.nFlag).toBeFalsy();
    expect(s.cFlag).toBeFalsy();

    expect(s.a).toBe(0xe2);
    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(15);
  });

  it("EX AF,AF'", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x34, // LD A,#34
      0x08, // EX AF,AF'
      0x3e,
      0x56, // LD A,#56
      0xdd,
      0x08 // EX AF,AF'
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("AF, AF'");
    m.shouldKeepMemory();

    expect(s.a).toBe(0x34);
    expect(s.pc).toBe(0x0007);
    expect(s.tacts).toBe(26);
  });

  it("ADD IX,BC", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0xdd,
      0x21,
      0x01,
      0x11, // LD IX,#1101
      0x01,
      0x34,
      0x12, // LD BC,#1234
      0xdd,
      0x09 // ADD IX,BC
    ]);
    m.cpu.getTestSupport().setF(m.cpu.getCpuState().f & 0xfe);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.ix).toBe(0x2335);
    expect(s.cFlag).toBeFalsy();
    expect(s.hFlag).toBeFalsy();

    expect(s.nFlag).toBeFalsy();
    m.shouldKeepRegisters("IX, BC, F");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0009);
    expect(s.tacts).toBe(39);
  });

  it("ADD IX,BC sets carry", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0xdd,
      0x21,
      0x01,
      0xf0, // LD IX,#F001
      0x01,
      0x34,
      0x12, // LD BC,#1234
      0xdd,
      0x09 // ADD IX,BC
    ]);
    m.cpu.getTestSupport().setF(m.cpu.getCpuState().f & 0xfe);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.ix).toBe(0x0235);
    expect(s.cFlag).toBeTruthy();
    expect(s.hFlag).toBeFalsy();

    expect(s.nFlag).toBeFalsy();
    m.shouldKeepRegisters("IX, BC, F");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0009);
    expect(s.tacts).toBe(39);
  });

  it("ADD IX,BC sets H flag", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0xdd,
      0x21,
      0x01,
      0x0f, // LD IX,#0F01
      0x01,
      0x34,
      0x12, // LD BC,#1234
      0xdd,
      0x09 // ADD IX,BC
    ]);
    m.cpu.getTestSupport().setF(m.cpu.getCpuState().f & 0xfe);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.ix).toBe(0x2135);
    expect(s.cFlag).toBeFalsy();
    expect(s.hFlag).toBeTruthy();

    expect(s.nFlag).toBeFalsy();
    m.shouldKeepRegisters("IX, BC, F");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0009);
    expect(s.tacts).toBe(39);
  });

  it("LD A,(BC)", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x01,
      0x03,
      0x00, // LD BC,#0003
      0xdd,
      0x0a // LD A,(BC)
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("BC, A");
    m.shouldKeepMemory();

    expect(s.a).toBe(0xdd);
    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(21);
  });

  it("DEC BC", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x01,
      0x26,
      0xa9, // LD BC,#A926
      0xdd,
      0x0b // DEC BC
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("BC");
    m.shouldKeepMemory();

    expect(s.bc).toBe(0xa925);
    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(20);
  });

  it("INC C", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x0e,
      0x43, // LD C,#43
      0xdd,
      0x0c // INC C
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("C, F");
    m.shouldKeepMemory();
    m.shouldKeepCFlag();
    expect(s.nFlag).toBeFalsy();

    expect(s.c).toBe(0x44);
    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(15);
  });

  it("DEC C", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x0e,
      0x43, // LD C,#43
      0xdd,
      0x0d // DEC C
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("C, F");
    m.shouldKeepMemory();
    m.shouldKeepCFlag();
    expect(s.nFlag).toBeTruthy();

    expect(s.c).toBe(0x42);
    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(15);
  });

  it("LD C,N", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xdd,
      0x0e,
      0x26 // LD C,#26
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("C");
    m.shouldKeepMemory();

    expect(s.c).toBe(0x26);
    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("RRCA", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x70, // LD A,#70
      0xdd,
      0x0f // RRCA
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("A, F");
    m.shouldKeepMemory();
    m.shouldKeepSFlag();
    m.shouldKeepZFlag();
    m.shouldKeepPVFlag();

    expect(s.hFlag).toBeFalsy();
    expect(s.nFlag).toBeFalsy();

    expect(s.cFlag).toBeFalsy();

    expect(s.a).toBe(0x38);
    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(15);
  });

  it("DJNZ works with no jump", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x06,
      0x01, // LD B,01H
      0xdd,
      0x10,
      0x02 // DJNZ 02H
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("B");
    m.shouldKeepMemory();

    expect(s.b).toBe(0x00);
    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(19);
  });

  it("DJNZ works with jump", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x06,
      0x02, // LD B,02H
      0xdd,
      0x10,
      0x02 // DJNZ 02H
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("B");
    m.shouldKeepMemory();

    expect(s.b).toBe(0x01);
    expect(s.pc).toBe(0x0007);
    expect(s.tacts).toBe(24);
  });

  it("LD DE,NN", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xdd,
      0x11,
      0x26,
      0xa9 // LD DE,#A926
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("DE");
    m.shouldKeepMemory();

    expect(s.de).toBe(0xa926);
    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(14);
  });

  it("LD (DE),A", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x11,
      0x26,
      0xa9, // LD DE,#A926
      0x3e,
      0x94, // LD A,#94
      0xdd,
      0x12 // LD (DE),A
    ]);

    // --- Act
    const valueBefore = m.memory[0xa926];
    m.run();
    const valueAfter = m.memory[0xa926];

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("DE, A");
    m.shouldKeepMemory("A926");

    expect(s.de).toBe(0xa926);
    expect(s.a).toBe(0x94);
    expect(valueBefore).toBe(0);
    expect(valueAfter).toBe(0x94);
    expect(s.pc).toBe(0x0007);
    expect(s.tacts).toBe(28);
  });

  it("INC DE", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x11,
      0x26,
      0xa9, // LD DE,#A926
      0xdd,
      0x13 // INC DE
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("DE");
    m.shouldKeepMemory();

    expect(s.de).toBe(0xa927);
    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(20);
  });

  it("INC D", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x16,
      0x43, // LD D,#43
      0xdd,
      0x14 // INC D
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("D, F");
    m.shouldKeepMemory();
    m.shouldKeepCFlag();
    expect(s.nFlag).toBeFalsy();

    expect(s.d).toBe(0x44);
    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(15);
  });
  it("DEC D", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x16,
      0x43, // LD D,#43
      0x15 // DEC D
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("D, F");
    m.shouldKeepMemory();
    m.shouldKeepCFlag();
    expect(s.nFlag).toBeTruthy();

    expect(s.d).toBe(0x42);
    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("DEC D sets Z flag", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x16,
      0x01, // LD D,#01
      0xdd,
      0x15 // DEC D
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("D, F");
    m.shouldKeepMemory();
    m.shouldKeepCFlag();
    expect(s.nFlag).toBeTruthy();

    expect(s.zFlag).toBeTruthy();

    expect(s.d).toBe(0x00);
    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(15);
  });

  it("LD D,N", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xdd,
      0x16,
      0x26 // LD D,#26
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("D");
    m.shouldKeepMemory();

    expect(s.d).toBe(0x26);
    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("RLA", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x81, // LD A,#81
      0xdd,
      0x17 // RLA
    ]);

    // --- Act
    let s = m.cpu.getCpuState();
    m.cpu.getTestSupport().setF(s.f & 0xfe);
    m.run();
    s = m.cpu.getCpuState();

    // --- Assert

    m.shouldKeepRegisters("A, F");
    m.shouldKeepMemory();
    m.shouldKeepSFlag();
    m.shouldKeepZFlag();
    m.shouldKeepPVFlag();
    expect(s.hFlag).toBeFalsy();
    expect(s.nFlag).toBeFalsy();

    expect(s.cFlag).toBeTruthy();

    expect(s.a).toBe(0x02);
    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(15);
  });

  it("JR E #1", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x20, // LD A,#20
      0xdd,
      0x18,
      0x20 // JR #20
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("A");
    m.shouldKeepMemory();
    expect(s.pc).toBe(0x0025);
    expect(s.tacts).toBe(23);
  });

  it("JR E #2", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x20, // LD A,#20
      0xdd,
      0x18,
      0xe0 // JR #20
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("A");
    m.shouldKeepMemory();
    expect(s.pc).toBe(0xffe5);
    expect(s.tacts).toBe(23);
  });

  it("ADD IX,DE", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0xdd,
      0x21,
      0x01,
      0x11, // LD IX,#1101
      0x11,
      0x34,
      0x12, // LD DE,#1234
      0xdd,
      0x19 // ADD IX,DE
    ]);
    m.cpu.getTestSupport().setF(m.cpu.getCpuState().f & 0xfe);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.ix).toBe(0x2335);
    expect(s.cFlag).toBeFalsy();
    expect(s.hFlag).toBeFalsy();

    expect(s.nFlag).toBeFalsy();
    m.shouldKeepRegisters("IX, DE, F");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0009);
    expect(s.tacts).toBe(39);
  });

  it("LD A,(DE)", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x11,
      0x03,
      0x00, // LD DE,#0003
      0xdd,
      0x1a // LD A,(DE)
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("DE, A");
    m.shouldKeepMemory();

    expect(s.a).toBe(0xdd);
    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(21);
  });

  it("DEC DE", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x11,
      0x26,
      0xa9, // LD DE,#A926
      0xdd,
      0x1b // DEC DE
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("DE");
    m.shouldKeepMemory();

    expect(s.de).toBe(0xa925);
    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(20);
  });

  it("INC E", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x1e,
      0x43, // LD E,#43
      0xdd,
      0x1c // INC E
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("E, F");
    m.shouldKeepMemory();
    m.shouldKeepCFlag();
    expect(s.nFlag).toBeFalsy();

    expect(s.e).toBe(0x44);
    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(15);
  });

  it("DEC E", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x1e,
      0x43, // LD E,#43
      0x1d // DEC E
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("E, F");
    m.shouldKeepMemory();
    m.shouldKeepCFlag();
    expect(s.nFlag).toBeTruthy();

    expect(s.e).toBe(0x42);
    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("DEC E sets Z flag", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x1e,
      0x01, // LD E,#01
      0xdd,
      0x1d // DEC E
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("E, F");
    m.shouldKeepMemory();
    m.shouldKeepCFlag();
    expect(s.nFlag).toBeTruthy();

    expect(s.zFlag).toBeTruthy();

    expect(s.e).toBe(0x00);
    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(15);
  });

  it("LD E,N", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xdd,
      0x1e,
      0x26 // LD D,#26
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("E");
    m.shouldKeepMemory();

    expect(s.e).toBe(0x26);
    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("RRA", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x81, // LD A,#81
      0xdd,
      0x1f // RRA
    ]);

    // --- Act
    let s = m.cpu.getCpuState();
    m.cpu.getTestSupport().setF(s.f & 0xfe);
    m.run();

    // --- Assert
    s = m.cpu.getCpuState();

    m.shouldKeepRegisters("A, F");
    m.shouldKeepMemory();
    m.shouldKeepSFlag();
    m.shouldKeepZFlag();
    m.shouldKeepPVFlag();
    expect(s.hFlag).toBeFalsy();
    expect(s.nFlag).toBeFalsy();

    expect(s.cFlag).toBeTruthy();

    expect(s.a).toBe(0x0040);
    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(15);
  });

  it("JR NZ,E works with no jump", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x01, // LD A,#01
      0x3d, // DEC A
      0xdd,
      0x20,
      0x02 // JR NZ,#02
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("A, F");
    m.shouldKeepMemory();
    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(22);
  });

  it("JR NZ,E works with jump", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x02, // LD A,#02
      0x3d, // DEC A
      0xdd,
      0x20,
      0x02 // JR NZ,#02
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("A, F");
    m.shouldKeepMemory();
    expect(s.pc).toBe(0x0008);
    expect(s.tacts).toBe(27);
  });

  it("LD (NN),IX", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0xdd,
      0x21,
      0x01,
      0x11, // LD IX,#1101
      0xdd,
      0x22,
      0x00,
      0x10 // LD (#1000),IX
    ]);
    let s = m.cpu.getCpuState();
    m.cpu.getTestSupport().setF(s.f & 0xfe);

    // --- Act
    m.run();

    // --- Assert
    s = m.cpu.getCpuState();
    expect(s.ix).toBe(0x1101);
    expect(m.memory[0x1000]).toBe(s.xl);
    expect(m.memory[0x1001]).toBe(s.xh);

    m.shouldKeepRegisters("IX");
    m.shouldKeepMemory("1000-1001");

    expect(s.pc).toBe(0x0008);
    expect(s.tacts).toBe(34);
  });

  it("INC IX", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0xdd,
      0x21,
      0x34,
      0x12, // LD IX,#1234
      0xdd,
      0x23 // INC IX
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.ix).toBe(0x1235);

    m.shouldKeepRegisters("IX");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(24);
  });

  it("INC XH", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0xdd,
      0x21,
      0x34,
      0x12, // LD IX,#1234
      0xdd,
      0x24 // INC XH
    ]);
    let s = m.cpu.getCpuState();
    m.cpu.getTestSupport().setF(s.f & 0xfe);

    // --- Act
    m.run();

    // --- Assert
    s = m.cpu.getCpuState();
    expect(s.ix).toBe(0x1334);

    m.shouldKeepRegisters("IX, F");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(22);
  });

  it("INC XH sets S flag", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0xdd,
      0x21,
      0x34,
      0xfe, // LD IX,#FE34
      0xdd,
      0x24 // INC XH
    ]);
    let s = m.cpu.getCpuState();
    m.cpu.getTestSupport().setF(s.f & 0xfe);

    // --- Act
    m.run();

    // --- Assert
    s = m.cpu.getCpuState();
    expect(s.ix).toBe(0xff34);
    expect(s.sFlag).toBeTruthy();
    expect(s.zFlag).toBeFalsy();
    expect(s.hFlag).toBeFalsy();
    expect(s.pvFlag).toBeFalsy();
    expect(s.cFlag).toBeFalsy();

    m.shouldKeepRegisters("F, IX");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(22);
  });

  it("INC XH sets H flag", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0xdd,
      0x21,
      0x34,
      0x4f, // LD IX,#4F34
      0xdd,
      0x24 // INC XH
    ]);
    let s = m.cpu.getCpuState();
    m.cpu.getTestSupport().setF(s.f & 0xfe);

    // --- Act
    m.run();

    // --- Assert
    s = m.cpu.getCpuState();
    expect(s.ix).toBe(0x5034);
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeFalsy();
    expect(s.hFlag).toBeTruthy();
    expect(s.pvFlag).toBeFalsy();
    expect(s.cFlag).toBeFalsy();

    m.shouldKeepRegisters("F, IX");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(22);
  });

  it("INC XH sets P flag", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0xdd,
      0x21,
      0x34,
      0x7f, // LD IX,#7F34
      0xdd,
      0x24 // INC XH
    ]);
    let s = m.cpu.getCpuState();
    m.cpu.getTestSupport().setF(s.f & 0xfe);

    // --- Act
    m.run();

    // --- Assert
    s = m.cpu.getCpuState();
    expect(s.ix).toBe(0x8034);
    expect(s.sFlag).toBeTruthy();
    expect(s.zFlag).toBeFalsy();
    expect(s.hFlag).toBeTruthy();
    expect(s.pvFlag).toBeTruthy();
    expect(s.cFlag).toBeFalsy();

    m.shouldKeepRegisters("F, IX");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(22);
  });

  it("INC XH sets Z flag", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0xdd,
      0x21,
      0x34,
      0xff, // LD IX,FF34H
      0xdd,
      0x24 // INC XH
    ]);
    let s = m.cpu.getCpuState();
    m.cpu.getTestSupport().setF(s.f & 0xfe);

    // --- Act
    m.run();

    // --- Assert
    s = m.cpu.getCpuState();
    expect(s.ix).toBe(0x0034);
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeTruthy();
    expect(s.hFlag).toBeTruthy();
    expect(s.pvFlag).toBeFalsy();
    expect(s.cFlag).toBeFalsy();

    m.shouldKeepRegisters("F, IX");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(22);
  });

  it("DEC XH", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0xdd,
      0x21,
      0x34,
      0x12, // LD IX,#1234
      0xdd,
      0x25 // DEC XH
    ]);
    let s = m.cpu.getCpuState();
    m.cpu.getTestSupport().setF(s.f & 0xfe);

    // --- Act
    m.run();

    // --- Assert
    s = m.cpu.getCpuState();
    expect(s.ix).toBe(0x1134);

    m.shouldKeepRegisters("IX, F");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(22);
  });

  it("DEC XH sets S flag", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0xdd,
      0x21,
      0x34,
      0x85, // LD IX,#8534
      0xdd,
      0x25 // DEC XH
    ]);
    let s = m.cpu.getCpuState();
    m.cpu.getTestSupport().setF(s.f & 0xfe);

    // --- Act
    m.run();

    // --- Assert
    s = m.cpu.getCpuState();
    expect(s.ix).toBe(0x8434);
    expect(s.sFlag).toBeTruthy();
    expect(s.zFlag).toBeFalsy();
    expect(s.hFlag).toBeFalsy();
    expect(s.pvFlag).toBeFalsy();
    expect(s.cFlag).toBeFalsy();

    m.shouldKeepRegisters("F, IX");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(22);
  });

  it("DEC XH sets H flag", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0xdd,
      0x21,
      0x34,
      0x40, // LD IX,#4034
      0xdd,
      0x25 // DEC XH
    ]);
    let s = m.cpu.getCpuState();
    m.cpu.getTestSupport().setF(s.f & 0xfe);

    // --- Act
    m.run();

    // --- Assert
    s = m.cpu.getCpuState();
    expect(s.ix).toBe(0x3f34);
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeFalsy();
    expect(s.hFlag).toBeTruthy();
    expect(s.pvFlag).toBeFalsy();
    expect(s.cFlag).toBeFalsy();

    m.shouldKeepRegisters("F, IX");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(22);
  });

  it("DEC XH sets P flag", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0xdd,
      0x21,
      0x34,
      0x80, // LD IX,#8034
      0xdd,
      0x25 // INC XH
    ]);
    let s = m.cpu.getCpuState();
    m.cpu.getTestSupport().setF(s.f & 0xfe);

    // --- Act
    m.run();

    // --- Assert
    s = m.cpu.getCpuState();
    expect(s.ix).toBe(0x7f34);
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeFalsy();
    expect(s.hFlag).toBeTruthy();
    expect(s.pvFlag).toBeTruthy();
    expect(s.cFlag).toBeFalsy();

    m.shouldKeepRegisters("F, IX");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(22);
  });

  it("DEC XH sets Z flag", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0xdd,
      0x21,
      0x34,
      0x01, // LD IX,#0134
      0xdd,
      0x25 // DEC XH
    ]);
    let s = m.cpu.getCpuState();
    m.cpu.getTestSupport().setF(s.f & 0xfe);

    // --- Act
    m.run();

    // --- Assert
    s = m.cpu.getCpuState();
    expect(s.ix).toBe(0x0034);
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeTruthy();
    expect(s.hFlag).toBeFalsy();
    expect(s.pvFlag).toBeFalsy();
    expect(s.cFlag).toBeFalsy();

    m.shouldKeepRegisters("F, IX");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(22);
  });

  it("LD XH,N works as expected", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0xdd,
      0x21,
      0x34,
      0x12, // LD IX,#1234
      0xdd,
      0x26,
      0x2d // LD XH,#2D
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.ix).toBe(0x2d34);

    m.shouldKeepRegisters("IX");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0007);
    expect(s.tacts).toBe(25);
  });

  const daaSamples = [
    { a: 0x99, h: false, n: false, c: false, af: 0x998c },
    { a: 0x99, h: true, n: false, c: false, af: 0x9f8c },
    { a: 0x7a, h: false, n: false, c: false, af: 0x8090 },
    { a: 0x7a, h: true, n: false, c: false, af: 0x8090 },
    { a: 0xa9, h: false, n: false, c: false, af: 0x090d },
    { a: 0x87, h: false, n: false, c: true, af: 0xe7a5 },
    { a: 0x87, h: true, n: false, c: true, af: 0xedad },
    { a: 0x1b, h: false, n: false, c: true, af: 0x8195 },
    { a: 0x1b, h: true, n: false, c: true, af: 0x8195 },
    { a: 0xaa, h: false, n: false, c: false, af: 0x1011 },
    { a: 0xaa, h: true, n: false, c: false, af: 0x1011 },
    { a: 0xc6, h: true, n: false, c: false, af: 0x2c29 }
  ];
  daaSamples.forEach((sample, index) => {
    it(`DAA #${index + 1}`, () => {
      // --- Arrange
      const m = new Z80TestMachine(RunMode.OneInstruction);
      m.initCode([
        0xdd,
        0x27 // DAA
      ]);
      const support = m.cpu.getTestSupport();
      support.setA(sample.a);
      support.setF(
        (sample.h ? FlagsSetMask.H : 0) |
          (sample.n ? FlagsSetMask.N : 0) |
          (sample.c ? FlagsSetMask.C : 0)
      );

      // --- Act
      m.run();

      // --- Assert
      const s = m.cpu.getCpuState();

      m.shouldKeepRegisters("AF");
      m.shouldKeepMemory();

      expect(s.af).toBe(sample.af);
      expect(s.pc).toBe(0x0002);
      expect(s.tacts).toBe(8);
    });
  });

  it("JR Z,E works with no jump", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x02, // LD A,#02
      0x3d, // DEC A
      0xdd,
      0x28,
      0x02 // JR NZ,#02
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("A, F");
    m.shouldKeepMemory();
    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(22);
  });

  it("JR Z,E works with jump", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x01, // LD A,#01
      0x3d, // DEC A
      0xdd,
      0x28,
      0x02 // JR NZ,#02
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("A, F");
    m.shouldKeepMemory();
    expect(s.pc).toBe(0x0008);
    expect(s.tacts).toBe(27);
  });

  it("ADD IX,IX", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0xdd,
      0x21,
      0x01,
      0x11, // LD IX,#1101
      0xdd,
      0x29 // ADD IX,IX
    ]);
    let s = m.cpu.getCpuState();
    m.cpu.getTestSupport().setF(s.f & 0xfe);

    // --- Act
    m.run();

    // --- Assert
    s = m.cpu.getCpuState();
    expect(s.ix).toBe(0x2202);
    expect(s.cFlag).toBeFalsy();
    expect(s.hFlag).toBeFalsy();

    expect(s.nFlag).toBeFalsy();
    m.shouldKeepRegisters("IX, F");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(29);
  });

  it("LD IX,(NN)", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0xdd,
      0x2a,
      0x00,
      0x10 // LD IX,(#1000)
    ]);
    m.memory[0x1000] = 0x34;
    m.memory[0x1001] = 0x12;

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.ix).toBe(0x1234);

    m.shouldKeepRegisters("IX");
    m.shouldKeepMemory("1000-1001");

    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(20);
  });

  it("DEC IX", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0xdd,
      0x21,
      0x34,
      0x12, // LD IX,#1234
      0xdd,
      0x2b // DEC IX
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.ix).toBe(0x1233);

    m.shouldKeepRegisters("IX");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(24);
  });

  it("INC XL works as expected", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0xdd,
      0x21,
      0x34,
      0x12, // LD IX,#1234
      0xdd,
      0x2c // INC XL
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.ix).toBe(0x1235);

    m.shouldKeepRegisters("IX, F");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(22);
  });

  it("DEC XL works as expected", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0xdd,
      0x21,
      0x34,
      0x12, // LD IX,#1234
      0xdd,
      0x2d // DEC XL
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.ix).toBe(0x1233);

    m.shouldKeepRegisters("IX, F");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(22);
  });

  it("LD XL,N", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0xdd,
      0x21,
      0x34,
      0x12, // LD IX,#1234
      0xdd,
      0x2e,
      0x2d // LD XH,#2D
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.ix).toBe(0x122d);

    m.shouldKeepRegisters("IX, F");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0007);
    expect(s.tacts).toBe(25);
  });

  it("CPL works as expected", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x81, // LD A,#81
      0xdd,
      0x2f // CPL
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("A, F");
    m.shouldKeepMemory();
    m.shouldKeepSFlag();
    m.shouldKeepZFlag();
    m.shouldKeepPVFlag();
    m.shouldKeepCFlag();

    expect(s.a).toBe(0x7e);
    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(15);
  });

  it("JR NC,E works with no jump", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x37, // SCF
      0xdd,
      0x30,
      0x02 // JR NC,#02
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("F");
    m.shouldKeepMemory();
    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(15);
  });

  it("JR NC,E works with jump", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x37, // SCF
      0x3f, // CCF
      0xdd,
      0x30,
      0x02 // JR NC,#02
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("F");
    m.shouldKeepMemory();
    expect(s.pc).toBe(0x0007);
    expect(s.tacts).toBe(24);
  });

  it("LD SP,NN", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xdd,
      0x31,
      0x26,
      0xa9 // LD SP,#A926
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("SP");
    m.shouldKeepMemory();

    expect(s.sp).toBe(0xa926);
    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(14);
  });

  it("LD (NN),A", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0xa9, // LD A,#A9
      0xdd,
      0x32,
      0x00,
      0x10 // LD (#1000),A
    ]);

    // --- Act
    const before = m.memory[0x1000];
    m.run();
    const after = m.memory[0x1000];

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("A");
    m.shouldKeepMemory("1000");

    expect(before).toBe(0x00);
    expect(after).toBe(0xa9);

    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(24);
  });

  it("INC SP", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x31,
      0x26,
      0xa9, // LD SP,#A926
      0xdd,
      0x33 // INC SP
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("SP");
    m.shouldKeepMemory();

    expect(s.sp).toBe(0xa927);
    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(20);
  });

  it("INC (IX+D)", () => {
    // --- Arrange
    const OFFS = 0x52;
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0xdd,
      0x34,
      OFFS // INC (IX+#52)
    ]);
    m.cpu.getTestSupport().setIX(0x1000);
    m.memory[0x1000 + OFFS] = 0xa5;

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(m.memory[s.ix + OFFS]).toBe(0xa6);

    m.shouldKeepRegisters("F");
    m.shouldKeepMemory("1052");

    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(23);
  });

  it("DEC (IX+D)", () => {
    // --- Arrange
    const OFFS = 0x52;
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0xdd,
      0x35,
      OFFS // DEC (IX+#52)
    ]);
    m.cpu.getTestSupport().setIX(0x1000);
    m.memory[0x1000 + OFFS] = 0xa5;

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(m.memory[s.ix + OFFS]).toBe(0xa4);

    m.shouldKeepRegisters("F");
    m.shouldKeepMemory("1052");

    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(23);
  });

  it("LD (IX+D),N", () => {
    // --- Arrange
    const OFFS = 0xfe;
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0xdd,
      0x36,
      0xfe,
      OFFS // LD (IX+52H),D2H
    ]);
    m.cpu.getTestSupport().setIX(0x1000);
    m.memory[0x1000 + (256 - OFFS)] = 0xa5;

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(m.memory[s.ix + (256 - OFFS)]).toBe(0xa5);

    m.shouldKeepRegisters("F");
    m.shouldKeepMemory("0FFE");

    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(19);
  });

  it("SCF", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0xdd,
      0x37 // SCF
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("F");
    m.shouldKeepMemory();
    expect(s.cFlag).toBeTruthy();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(8);
  });

  it("JR C,E", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x37, // SCF
      0x3f, // CCF
      0xdd,
      0x38,
      0x02 // JR C,#02
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("F");
    m.shouldKeepMemory();
    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(19);
  });

  it("JR C,E works with jump", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x37, // SCF
      0xdd,
      0x38,
      0x02 // JR C,02H
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("F");
    m.shouldKeepMemory();
    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(20);
  });

  it("ADD IX,SP", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0xdd,
      0x21,
      0x01,
      0x11, // LD IX,#1101
      0x31,
      0x34,
      0x12, // LD SP,#1234
      0xdd,
      0x39 // ADD IX,SP
    ]);
    m.cpu.getTestSupport().setF(m.cpu.getCpuState().f & 0xfe);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.ix).toBe(0x2335);
    expect(s.cFlag).toBeFalsy();
    expect(s.hFlag).toBeFalsy();

    expect(s.nFlag).toBeFalsy();
    m.shouldKeepRegisters("IX, SP, F");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0009);
    expect(s.tacts).toBe(39);
  });

  it("LD A,(NN)", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0xdd,
      0x3a,
      0x00,
      0x10 // LD A,(#1000)
    ]);
    m.memory[0x1000] = 0x34;

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("A");
    m.shouldKeepMemory();

    expect(s.a).toBe(0x34);
    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(17);
  });

  it("DEC SP", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x31,
      0x26,
      0xa9, // LD SP,#A926
      0xdd,
      0x3b // DEC SP
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("SP");
    m.shouldKeepMemory();

    expect(s.sp).toBe(0xa925);
    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(20);
  });

  it("INC A", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x43, // LD A,#43
      0xdd,
      0x3c // INC A
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("A, F");
    m.shouldKeepMemory();
    m.shouldKeepCFlag();
    expect(s.nFlag).toBeFalsy();

    expect(s.a).toBe(0x44);
    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(15);
  });

  it("DEC A", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x43, // LD A,#43
      0xdd,
      0x3d // DEC A
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("A, F");
    m.shouldKeepMemory();
    m.shouldKeepCFlag();
    expect(s.nFlag).toBeTruthy();

    expect(s.a).toBe(0x42);
    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(15);
  });

  it("LD A,N", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xdd,
      0x3e,
      0x26 // LD A,#26
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("A");
    m.shouldKeepMemory();

    expect(s.a).toBe(0x26);
    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("CCF", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x37, // SCF
      0xdd,
      0x3f // CCF
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("F");
    m.shouldKeepMemory();
    expect(s.cFlag).toBeFalsy();

    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(12);
  });
});
