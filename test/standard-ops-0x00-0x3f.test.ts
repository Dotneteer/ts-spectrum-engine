import "mocha";
import * as expect from "expect";
import { Z80TestMachine, RunMode } from "./Z80TestMachine";
import { FlagsSetMask } from "../src/spectrumemu/cpu/FlagsSetMask";

describe("Z80 CPU - standard 00-3f", () => {
  it("NOP", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0x00 // NOP
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters();
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0001);
    expect(s.tacts).toBe(4);
  });

  it("LD BC,NN", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
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
    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(10);
  });

  it("LD (BC),A", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
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
    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(24);
  });

  it("INC BC", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
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
    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(16);
  });

  it("INC BC with #FFFF", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x01,
      0xff,
      0xff, // LD BC,#FFFF
      0x03 // INC BC
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("BC");
    m.shouldKeepMemory();

    expect(s.bc).toBe(0x0000);
    expect(s.b).toBe(0x00);
    expect(s.c).toBe(0x00);
    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(16);
  });

  it("INC B", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
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
    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("INC B sets Z flag", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x06,
      0xff, // LD B,#FF
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

    expect(s.zFlag).toBeTruthy();

    expect(s.b).toBe(0x00);
    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("INC B sets S and PV flags", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x06,
      0x7f, // LD B,#7F
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

    expect(s.sFlag).toBeTruthy();
    expect(s.pvFlag).toBeTruthy();

    expect(s.b).toBe(0x80);
    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("INC B sets H flag", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x06,
      0x2f, // LD B,#2F
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

    expect(s.hFlag).toBeTruthy();

    expect(s.b).toBe(0x30);
    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("DEC B", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
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
    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("DEC B sets Z flag", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x06,
      0x01, // LD B,#01
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

    expect(s.zFlag).toBeTruthy();

    expect(s.b).toBe(0x00);
    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("DEC B sets S and PV flags", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x06,
      0x80, // LD B,#80
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

    expect(s.sFlag).toBeFalsy();
    expect(s.pvFlag).toBeTruthy();

    expect(s.b).toBe(0x7f);
    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("DEC B sets H flag", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x06,
      0x20, // LD B,#20
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

    expect(s.hFlag).toBeTruthy();

    expect(s.b).toBe(0x1f);
    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("LD B,N", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
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
    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(7);
  });

  it("RLCA", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x71, // LD A,#71
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
    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("RLCA generates carry", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x80, // LD A,#80
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
    expect(s.cFlag).toBeTruthy();

    expect(s.a).toBe(0x01);
    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
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
      0x08 // EX AF,AF'
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("AF, AF'");
    m.shouldKeepMemory();

    expect(s.a).toBe(0x34);
    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(22);
  });

  it("ADD HL,BC", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x21,
      0x34,
      0x12, // LD HL,#1234
      0x01,
      0x02,
      0x11, // LD BC,#1102
      0x09 // ADD HL,BC
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("F, BC, HL");
    m.shouldKeepMemory();
    m.shouldKeepSFlag();
    m.shouldKeepZFlag();
    m.shouldKeepPVFlag();
    expect(s.nFlag).toBeFalsy();

    expect(s.cFlag).toBeFalsy();
    expect(s.hFlag).toBeFalsy();

    expect(s.hl).toBe(0x2336);
    expect(s.pc).toBe(0x0007);
    expect(s.tacts).toBe(31);
  });

  it("ADD HL,BC generates carry", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x21,
      0x34,
      0xf2, // LD HL,#F234
      0x01,
      0x02,
      0x11, // LD BC,#1102
      0x09 // ADD HL,BC
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("F, BC, HL");
    m.shouldKeepMemory();
    m.shouldKeepSFlag();
    m.shouldKeepZFlag();
    m.shouldKeepPVFlag();
    expect(s.nFlag).toBeFalsy();

    expect(s.cFlag).toBeTruthy();
    expect(s.hFlag).toBeFalsy();

    expect(s.hl).toBe(0x0336);
    expect(s.pc).toBe(0x0007);
    expect(s.tacts).toBe(31);
  });

  it("LD A,(BC)", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x01,
      0x03,
      0x00, // LD BC,#0003
      0x0a // LD A,(BC)
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("BC, A");
    m.shouldKeepMemory();

    expect(s.a).toBe(0x0a);
    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(17);
  });

  it("DEC BC", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x01,
      0x26,
      0xa9, // LD BC,#A926
      0x0b // DEC BC
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("BC");
    m.shouldKeepMemory();

    expect(s.bc).toBe(0xa925);
    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(16);
  });

  it("INC C", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x0e,
      0x43, // LD C,#43
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
    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("INC C sets Z flag", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x0e,
      0xff, // LD C,#FF
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

    expect(s.zFlag).toBeTruthy();

    expect(s.c).toBe(0x00);
    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("INC C sets S and PV flags", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x0e,
      0x7f, // LD C,#7F
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

    expect(s.sFlag).toBeTruthy();
    expect(s.pvFlag).toBeTruthy();

    expect(s.c).toBe(0x80);
    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("INC C sets H flag", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x0e,
      0x2f, // LD C,#2F
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

    expect(s.hFlag).toBeTruthy();

    expect(s.c).toBe(0x30);
    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("DEC C", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x0e,
      0x43, // LD C,#43
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
    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("DEC C sets Z flag", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x0e,
      0x01, // LD C,#01
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

    expect(s.zFlag).toBeTruthy();

    expect(s.c).toBe(0x00);
    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("DEC C sets S and PV flags", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x0e,
      0x80, // LD C,#80
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

    expect(s.sFlag).toBeFalsy();
    expect(s.pvFlag).toBeTruthy();

    expect(s.c).toBe(0x7f);
    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("DEC C sets H flag", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x0e,
      0x20, // LD C,#20
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

    expect(s.hFlag).toBeTruthy();

    expect(s.c).toBe(0x1f);
    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("LD C,N", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
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
    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(7);
  });

  it("RRCA works as expected", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x70, // LD A,#70
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
    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("DJNZ works with no jump", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x06,
      0x01, // LD B,01H
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
    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(15);
  });

  it("DJNZ works with jump", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x06,
      0x02, // LD B,02H
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
    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(20);
  });

  it("LD DE,NN", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
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
    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(10);
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
    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(24);
  });

  it("INC DE", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x11,
      0x26,
      0xa9, // LD DE,#A926
      0x13 // INC DE
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("DE");
    m.shouldKeepMemory();

    expect(s.de).toBe(0xa927);
    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(16);
  });

  it("INC DE with #FFFF", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x11,
      0xff,
      0xff, // LD DE,#FFFF
      0x13 // INC DE
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("DE");
    m.shouldKeepMemory();

    expect(s.de).toBe(0x0000);
    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(16);
  });

  it("INC D", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x16,
      0x43, // LD D,#43
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
    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("INC D sets Z flag", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x16,
      0xff, // LD D,#FF
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

    expect(s.zFlag).toBeTruthy();

    expect(s.d).toBe(0x00);
    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("INC D sets S and PV flags", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x16,
      0x7f, // LD D,#7F
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

    expect(s.sFlag).toBeTruthy();
    expect(s.pvFlag).toBeTruthy();

    expect(s.d).toBe(0x80);
    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("INC D sets H flag", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x16,
      0x2f, // LD D,#2F
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

    expect(s.hFlag).toBeTruthy();

    expect(s.d).toBe(0x30);
    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
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
    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("DEC D sets S and PV flags", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x16,
      0x80, // LD D,#80
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

    expect(s.sFlag).toBeFalsy();
    expect(s.pvFlag).toBeTruthy();

    expect(s.d).toBe(0x7f);
    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("DEC D sets H flag", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x16,
      0x20, // LD D,#20
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

    expect(s.hFlag).toBeTruthy();

    expect(s.d).toBe(0x1f);
    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("LD D,N", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
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
    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(7);
  });

  it("RLA", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x81, // LD A,#81
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
    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("RLA uses carry", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x20, // LD A,#20
      0x37, // SCF
      0x17 // RLA
    ]);

    // --- Act
    m.run();
    const s = m.cpu.getCpuState();

    // --- Assert

    m.shouldKeepRegisters("A, F");
    m.shouldKeepMemory();
    m.shouldKeepSFlag();
    m.shouldKeepZFlag();
    m.shouldKeepPVFlag();
    expect(s.hFlag).toBeFalsy();
    expect(s.nFlag).toBeFalsy();

    expect(s.cFlag).toBeFalsy();

    expect(s.a).toBe(0x41);
    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(15);
  });

  it("JR E #1", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x20, // LD A,#20
      0x18,
      0x20 // JR #20
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("A");
    m.shouldKeepMemory();
    expect(s.pc).toBe(0x0024);
    expect(s.tacts).toBe(19);
  });

  it("JR E #2", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x20, // LD A,#20
      0x18,
      0xe0 // JR #20
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("A");
    m.shouldKeepMemory();
    expect(s.pc).toBe(0xffe4);
    expect(s.tacts).toBe(19);
  });

  it("ADD HL,DE", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x21,
      0x34,
      0x12, // LD HL,#1234
      0x11,
      0x02,
      0x11, // LD DE,#1102
      0x19 // ADD HL,DE
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("F, DE, HL");
    m.shouldKeepMemory();
    m.shouldKeepSFlag();
    m.shouldKeepZFlag();
    m.shouldKeepPVFlag();
    expect(s.nFlag).toBeFalsy();

    expect(s.cFlag).toBeFalsy();
    expect(s.hFlag).toBeFalsy();

    expect(s.hl).toBe(0x2336);
    expect(s.pc).toBe(0x0007);
    expect(s.tacts).toBe(31);
  });

  it("ADD HL,DE generates carry", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x21,
      0x34,
      0xf2, // LD HL,#F234
      0x11,
      0x02,
      0x11, // LD DE,#1102
      0x19 // ADD HL,DE
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("F, DE, HL");
    m.shouldKeepMemory();
    m.shouldKeepSFlag();
    m.shouldKeepZFlag();
    m.shouldKeepPVFlag();
    expect(s.nFlag).toBeFalsy();

    expect(s.cFlag).toBeTruthy();
    expect(s.hFlag).toBeFalsy();

    expect(s.hl).toBe(0x0336);
    expect(s.pc).toBe(0x0007);
    expect(s.tacts).toBe(31);
  });

  it("LD A,(DE)", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x11,
      0x03,
      0x00, // LD DE,#0003
      0x1a // LD A,(DE)
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("DE, A");
    m.shouldKeepMemory();

    expect(s.a).toBe(0x1a);
    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(17);
  });

  it("DEC DE", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x11,
      0x26,
      0xa9, // LD DE,#A926
      0x1b // DEC DE
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("DE");
    m.shouldKeepMemory();

    expect(s.de).toBe(0xa925);
    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(16);
  });

  it("INC E", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x1e,
      0x43, // LD E,#43
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
    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("INC E sets Z flag", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x1e,
      0xff, // LD E,#FF
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

    expect(s.zFlag).toBeTruthy();

    expect(s.e).toBe(0x00);
    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("INC E sets S and PV flags", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x1e,
      0x7f, // LD E,#7F
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

    expect(s.sFlag).toBeTruthy();
    expect(s.pvFlag).toBeTruthy();

    expect(s.e).toBe(0x80);
    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("INC E sets H flag", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x1e,
      0x2f, // LD E,#2F
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

    expect(s.hFlag).toBeTruthy();

    expect(s.e).toBe(0x30);
    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
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
    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("DEC E sets S and PV flags", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x1e,
      0x80, // LD E,#80
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

    expect(s.sFlag).toBeFalsy();
    expect(s.pvFlag).toBeTruthy();

    expect(s.e).toBe(0x7f);
    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("DEC E sets H flag", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x1e,
      0x20, // LD E,#20
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

    expect(s.hFlag).toBeTruthy();

    expect(s.e).toBe(0x1f);
    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("LD E,N", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
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
    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(7);
  });

  it("RRA", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x81, // LD A,#81
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
    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("RRA uses carry", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x20, // LD A,#20
      0x37, // SCF
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

    expect(s.cFlag).toBeFalsy();

    expect(s.a).toBe(0x0090);
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
      0x20,
      0x02 // JR NZ,#02
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("A, F");
    m.shouldKeepMemory();
    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(18);
  });

  it("JR NZ,E works with jump", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x02, // LD A,#02
      0x3d, // DEC A
      0x20,
      0x02 // JR NZ,#02
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("A, F");
    m.shouldKeepMemory();
    expect(s.pc).toBe(0x0007);
    expect(s.tacts).toBe(23);
  });

  it("LD HL,NN", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0x21,
      0x26,
      0xa9 // LD HL,#A926
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("HL");
    m.shouldKeepMemory();

    expect(s.hl).toBe(0xa926);
    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(10);
  });

  it("LD (NN),HL", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x21,
      0x26,
      0xa9, // LD HL,#A926
      0x22,
      0x00,
      0x10 // LD (#1000),HL
    ]);

    // --- Act
    const lBefore = m.memory[0x1000];
    const hBefore = m.memory[0x1001];
    m.run();
    const lAfter = m.memory[0x1000];
    const hAfter = m.memory[0x1001];

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("HL");
    m.shouldKeepMemory("1000-1001");

    expect(s.hl).toBe(0xa926);
    expect(lBefore).toBe(0x00);
    expect(hBefore).toBe(0x00);
    expect(lAfter).toBe(0x26);
    expect(hAfter).toBe(0xa9);

    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(26);
  });

  it("INC HL", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x21,
      0x26,
      0xa9, // LD HL,#A926
      0x23 // INC HL
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("HL");
    m.shouldKeepMemory();

    expect(s.hl).toBe(0xa927);
    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(16);
  });

  it("INC HL with #FFFF", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x21,
      0xff,
      0xff, // LD HL,#FFFF
      0x23 // INC HL
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("HL");
    m.shouldKeepMemory();

    expect(s.hl).toBe(0x0000);
    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(16);
  });

  it("INC H", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x26,
      0x43, // LD H,#43
      0x24 // INC H
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("H, F");
    m.shouldKeepMemory();
    m.shouldKeepCFlag();
    expect(s.nFlag).toBeFalsy();

    expect(s.h).toBe(0x44);
    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("INC H sets Z flag", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x26,
      0xff, // LD H,#FF
      0x24 // INC H
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("H, F");
    m.shouldKeepMemory();
    m.shouldKeepCFlag();
    expect(s.nFlag).toBeFalsy();

    expect(s.zFlag).toBeTruthy();

    expect(s.h).toBe(0x00);
    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("INC H sets S and PV flags", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x26,
      0x7f, // LD H,#7F
      0x24 // INC H
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("H, F");
    m.shouldKeepMemory();
    m.shouldKeepCFlag();
    expect(s.nFlag).toBeFalsy();

    expect(s.sFlag).toBeTruthy();
    expect(s.pvFlag).toBeTruthy();

    expect(s.h).toBe(0x80);
    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("INC H sets H flag", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x26,
      0x2f, // LD H,#2F
      0x24 // INC H
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("H, F");
    m.shouldKeepMemory();
    m.shouldKeepCFlag();
    expect(s.nFlag).toBeFalsy();

    expect(s.hFlag).toBeTruthy();

    expect(s.h).toBe(0x30);
    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("DEC H", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x26,
      0x43, // LD H,#43
      0x25 // DEC H
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("H, F");
    m.shouldKeepMemory();
    m.shouldKeepCFlag();
    expect(s.nFlag).toBeTruthy();

    expect(s.h).toBe(0x42);
    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("DEC H sets Z flag", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x26,
      0x01, // LD H,#01
      0x25 // DEC H
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("H, F");
    m.shouldKeepMemory();
    m.shouldKeepCFlag();
    expect(s.nFlag).toBeTruthy();

    expect(s.zFlag).toBeTruthy();

    expect(s.h).toBe(0x00);
    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("DEC H sets S and PV flags", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x26,
      0x80, // LD H,#80
      0x25 // DEC H
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("H, F");
    m.shouldKeepMemory();
    m.shouldKeepCFlag();
    expect(s.nFlag).toBeTruthy();

    expect(s.sFlag).toBeFalsy();
    expect(s.pvFlag).toBeTruthy();

    expect(s.h).toBe(0x7f);
    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("DEC H sets H flag", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x26,
      0x20, // LD H,#20
      0x25 // DEC H
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("H, F");
    m.shouldKeepMemory();
    m.shouldKeepCFlag();
    expect(s.nFlag).toBeTruthy();

    expect(s.hFlag).toBeTruthy();

    expect(s.h).toBe(0x1f);
    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("LD H,N", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0x26,
      0x26 // LD H,#26
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("H");
    m.shouldKeepMemory();

    expect(s.h).toBe(0x26);
    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(7);
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
      expect(s.pc).toBe(0x0001);
      expect(s.tacts).toBe(4);
    });
  });

  it("JR Z,E works with no jump", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x02, // LD A,#02
      0x3d, // DEC A
      0x28,
      0x02 // JR NZ,#02
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("A, F");
    m.shouldKeepMemory();
    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(18);
  });

  it("JR Z,E works with jump", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x01, // LD A,#01
      0x3d, // DEC A
      0x28,
      0x02 // JR NZ,#02
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("A, F");
    m.shouldKeepMemory();
    expect(s.pc).toBe(0x0007);
    expect(s.tacts).toBe(23);
  });

  it("ADD HL,HL", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x21,
      0x34,
      0x12, // LD HL,#1234
      0x29 // ADD HL,HL
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("F, HL");
    m.shouldKeepMemory();
    m.shouldKeepSFlag();
    m.shouldKeepZFlag();
    m.shouldKeepPVFlag();
    expect(s.nFlag).toBeFalsy();

    expect(s.cFlag).toBeFalsy();
    expect(s.hFlag).toBeFalsy();

    expect(s.hl).toBe(0x2468);
    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(21);
  });

  it("LD HL,(NN)", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x2a,
      0x00,
      0x10 // LD HL,(#1000)
    ]);
    m.memory[0x1000] = 0x34;
    m.memory[0x1001] = 0x12;

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("HL");
    m.shouldKeepMemory();

    expect(s.hl).toBe(0x1234);
    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(16);
  });

  it("DEC HL", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x21,
      0x26,
      0xa9, // LD HL,#A926
      0x2b // DEC HL
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("HL");
    m.shouldKeepMemory();

    expect(s.hl).toBe(0xa925);
    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(16);
  });

  it("INC L", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x2e,
      0x43, // LD L,#43
      0x2c // INC L
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("L, F");
    m.shouldKeepMemory();
    m.shouldKeepCFlag();
    expect(s.nFlag).toBeFalsy();

    expect(s.l).toBe(0x44);
    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("INC L sets Z flag", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x2e,
      0xff, // LD L,#FF
      0x2c // INC L
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("L, F");
    m.shouldKeepMemory();
    m.shouldKeepCFlag();
    expect(s.nFlag).toBeFalsy();

    expect(s.zFlag).toBeTruthy();

    expect(s.l).toBe(0x00);
    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("INC L sets S and PV flags", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x2e,
      0x7f, // LD L,#7F
      0x2c // INC L
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("L, F");
    m.shouldKeepMemory();
    m.shouldKeepCFlag();
    expect(s.nFlag).toBeFalsy();

    expect(s.sFlag).toBeTruthy();
    expect(s.pvFlag).toBeTruthy();

    expect(s.l).toBe(0x80);
    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("INC L sets H flag", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x2e,
      0x2f, // LD L,#2F
      0x2c // INC L
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("L, F");
    m.shouldKeepMemory();
    m.shouldKeepCFlag();
    expect(s.nFlag).toBeFalsy();

    expect(s.hFlag).toBeTruthy();

    expect(s.l).toBe(0x30);
    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("DEC L", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x2e,
      0x43, // LD L,#43
      0x2d // DEC L
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("L, F");
    m.shouldKeepMemory();
    m.shouldKeepCFlag();
    expect(s.nFlag).toBeTruthy();

    expect(s.l).toBe(0x42);
    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("DEC L sets Z flag", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x2e,
      0x01, // LD L,#01
      0x2d // DEC L
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("L, F");
    m.shouldKeepMemory();
    m.shouldKeepCFlag();
    expect(s.nFlag).toBeTruthy();

    expect(s.zFlag).toBeTruthy();

    expect(s.l).toBe(0x00);
    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("DEC L sets S and PV flags", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x2e,
      0x80, // LD L,#80
      0x2d // DEC L
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("L, F");
    m.shouldKeepMemory();
    m.shouldKeepCFlag();
    expect(s.nFlag).toBeTruthy();

    expect(s.sFlag).toBeFalsy();
    expect(s.pvFlag).toBeTruthy();

    expect(s.l).toBe(0x7f);
    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("DEC L sets H flag", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x2e,
      0x20, // LD L,#20
      0x2d // DEC L
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("L, F");
    m.shouldKeepMemory();
    m.shouldKeepCFlag();
    expect(s.nFlag).toBeTruthy();

    expect(s.hFlag).toBeTruthy();

    expect(s.l).toBe(0x1f);
    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("LD L,N works as expected", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0x2e,
      0x26 // LD L,#26
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("L");
    m.shouldKeepMemory();

    expect(s.l).toBe(0x26);
    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(7);
  });

  it("CPL works as expected", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x81, // LD A,#81
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
    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("JR NC,E works with no jump", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x37, // SCF
      0x30,
      0x02 // JR NC,#02
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("F");
    m.shouldKeepMemory();
    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("JR NC,E works with jump", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x37, // SCF
      0x3f, // CCF
      0x30,
      0x02 // JR NC,#02
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

  it("LD SP,NN", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
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
    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(10);
  });

  it("LD (NN),A", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0xa9, // LD A,#A9
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

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(20);
  });

  it("INC SP", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x31,
      0x26,
      0xa9, // LD SP,#A926
      0x33 // INC SP
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("SP");
    m.shouldKeepMemory();

    expect(s.sp).toBe(0xa927);
    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(16);
  });

  it("INC SP with #FFFF works as expected", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x31,
      0xff,
      0xff, // LD SP,#FFFF
      0x33 // INC SP
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("SP");
    m.shouldKeepMemory();

    expect(s.sp).toBe(0x0000);
    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(16);
  });

  it("INC (HL) works as expected", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x21,
      0x00,
      0x10, // LD HL,1000H
      0x34 // INC (HL)
    ]);
    m.memory[0x1000] = 0x23;

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("HL, F");
    m.shouldKeepMemory("1000");
    expect(m.memory[0x1000]).toBe(0x24);

    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(21);
  });

  it("DEC (HL)", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x21,
      0x00,
      0x10, // LD HL,#1000
      0x35 // DEC (HL)
    ]);
    m.memory[0x1000] = 0x23;

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("HL, F");
    m.shouldKeepMemory("1000");
    expect(m.memory[0x1000]).toBe(0x22);

    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(21);
  });

  it("LD (HL),N", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x21,
      0x00,
      0x10, // LD HL,#1000
      0x36,
      0x56 // LD (HL),#56
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("HL, F");
    m.shouldKeepMemory("1000");
    expect(m.memory[0x1000]).toBe(0x56);

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(20);
  });

  it("SCF works as expected", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x37 // SCF
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("F");
    m.shouldKeepMemory();
    expect(s.cFlag).toBeTruthy();

    expect(s.pc).toBe(0x0001);
    expect(s.tacts).toBe(4);
  });

  it("JR C,E", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x37, // SCF
      0x3f, // CCF
      0x38,
      0x02 // JR C,#02
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

  it("JR C,E works with jump", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x37, // SCF
      0x38,
      0x02 // JR C,02H
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("F");
    m.shouldKeepMemory();
    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(16);
  });

  it("ADD HL,SP works as expected", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x21,
      0x34,
      0x12, // LD HL,#1234
      0x31,
      0x02,
      0x11, // LD SP,#1102
      0x39 // ADD HL,SP
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("F, SP, HL");
    m.shouldKeepMemory();
    m.shouldKeepSFlag();
    m.shouldKeepZFlag();
    m.shouldKeepPVFlag();
    expect(s.nFlag).toBeFalsy();

    expect(s.cFlag).toBeFalsy();
    expect(s.hFlag).toBeFalsy();

    expect(s.hl).toBe(0x2336);
    expect(s.pc).toBe(0x0007);
    expect(s.tacts).toBe(31);
  });

  it("ADD HL,SP generates carry", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x21,
      0x34,
      0xf2, // LD HL,#F234
      0x31,
      0x02,
      0x11, // LD SP,#1102
      0x39 // ADD HL,SP
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("F, SP, HL");
    m.shouldKeepMemory();
    m.shouldKeepSFlag();
    m.shouldKeepZFlag();
    m.shouldKeepPVFlag();
    expect(s.nFlag).toBeFalsy();

    expect(s.cFlag).toBeTruthy();
    expect(s.hFlag).toBeFalsy();

    expect(s.hl).toBe(0x0336);
    expect(s.pc).toBe(0x0007);
    expect(s.tacts).toBe(31);
  });

  it("LD A,(NN)", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
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
    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(13);
  });

  it("DEC SP", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x31,
      0x26,
      0xa9, // LD SP,#A926
      0x3b // DEC SP
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("SP");
    m.shouldKeepMemory();

    expect(s.sp).toBe(0xa925);
    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(16);
  });

  it("INC A", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x43, // LD A,#43
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
    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("INC A sets Z flag", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0xff, // LD A,#FF
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

    expect(s.zFlag).toBeTruthy();

    expect(s.a).toBe(0x00);
    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("INC A sets S and PV flags", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x7f, // LD A,#7F
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

    expect(s.sFlag).toBeTruthy();
    expect(s.pvFlag).toBeTruthy();

    expect(s.a).toBe(0x80);
    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("INC A sets H flag", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x2f, // LD A,#2F
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

    expect(s.hFlag).toBeTruthy();

    expect(s.a).toBe(0x30);
    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("DEC A", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x43, // LD A,#43
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
    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("DEC A sets Z flag", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x01, // LD A,#01
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

    expect(s.zFlag).toBeTruthy();

    expect(s.a).toBe(0x00);
    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("DEC A sets S and PV flags", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x80, // LD A,#80
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

    expect(s.sFlag).toBeFalsy();
    expect(s.pvFlag).toBeTruthy();

    expect(s.a).toBe(0x7f);
    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("DEC A sets H flag", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x20, // LD A,#20
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

    expect(s.hFlag).toBeTruthy();

    expect(s.a).toBe(0x1f);
    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("LD A,N", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
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
    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(7);
  });

  it("CCF", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x37, // SCF
      0x3f // CCF
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    m.shouldKeepRegisters("F");
    m.shouldKeepMemory();
    expect(s.cFlag).toBeFalsy();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(8);
  });
});
