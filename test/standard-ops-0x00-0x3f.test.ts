import "mocha";
import * as expect from "expect";
import { Z80TestMachine, RunMode } from "./Z80TestMachine";

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
});
