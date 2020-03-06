import "mocha";
import * as expect from "expect";
import { Z80TestMachine, RunMode } from "./Z80TestMachine";
import { FlagsSetMask } from "../src/spectrumemu/cpu/FlagsSetMask";

describe("Z80 CPU - extended", () => {
  it("SWAPNIB", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction, true);
    m.initCode([
      0xed,
      0x23 // SWAPNIB
    ]);
    m.cpu.getTestSupport().setA(0x3d);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0xd3);
    m.shouldKeepRegisters("A");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(8);
  });

  it("SWAPNIB requires extended instruction set", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x23 // SWAPNIB
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

  it("MIRROR A", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction, true);
    m.initCode([
      0xed,
      0x24 // MIRROR A
    ]);
    m.cpu.getTestSupport().setA(0xc4);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x23);
    m.shouldKeepRegisters("A");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(8);
  });

  it("MIRROR A requires extended instruction set", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x24 // MIRROR A
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

  it("TEST N", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction, true);
    m.initCode([
      0xed,
      0x27,
      0x83 // TEST N
    ]);
    m.cpu.getTestSupport().setA(0x81);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.f).toBe(0x94);
    m.shouldKeepRegisters("F");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("TEST N requires extended instruction set", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x27 // TEST N
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

  it("MUL works as expected", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction, true);
    m.initCode([
      0xed,
      0x30 // MUL
    ]);
    m.cpu.getTestSupport().setDE(0x6478);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.de).toBe(0x2ee0);
    m.shouldKeepRegisters("DE");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(8);
  });

  it("MUL requires extended instruction set", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x30 // MUL
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

  it("ADD HL,A", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction, true);
    m.initCode([
      0xed,
      0x31 // ADD HL,A
    ]);
    m.cpu.getTestSupport().setHL(0x5555);
    m.cpu.getTestSupport().setA(0x44);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.hl).toBe(0x5599);
    m.shouldKeepRegisters("HL");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(8);
  });

  it("ADD HL,A requires extended instruction set", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x31 // ADD HL,A
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

  it("ADD DE,A", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction, true);
    m.initCode([
      0xed,
      0x32 // ADD DE,A
    ]);
    m.cpu.getTestSupport().setDE(0x5555);
    m.cpu.getTestSupport().setA(0x44);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.de).toBe(0x5599);
    m.shouldKeepRegisters("DE");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(8);
  });

  it("ADD DE,A requires extended instruction set", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x32 // ADD DE,A
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

  it("ADD BC,A", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction, true);
    m.initCode([
      0xed,
      0x33 // ADD BC,A
    ]);
    m.cpu.getTestSupport().setBC(0x5555);
    m.cpu.getTestSupport().setA(0x44);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.bc).toBe(0x5599);
    m.shouldKeepRegisters("BC");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(8);
  });

  it("ADD BC,A requires extended instruction set", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x33 // ADD BC,A
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

  it("ADD HL,NN works as expected", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction, true);
    m.initCode([
      0xed,
      0x34,
      0x23,
      0x80 // ADD HL,#8023
    ]);
    m.cpu.getTestSupport().setHL(0xc401);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.hl).toBe(0x4424);
    m.shouldKeepRegisters("HL");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(16);
  });

  it("ADD HL,NN requires extended instruction set", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x34 // ADD HL,NN
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

  it("ADD DE,NN works as expected", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction, true);
    m.initCode([
      0xed,
      0x35,
      0x23,
      0x80 // ADD DE,#8023
    ]);
    m.cpu.getTestSupport().setDE(0xc401);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.de).toBe(0x4424);
    m.shouldKeepRegisters("DE");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(16);
  });

  it("ADD DE,NN requires extended instruction set", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x35 // ADD DE,NN
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

  it("ADD BC,NN works as expected", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction, true);
    m.initCode([
      0xed,
      0x36,
      0x23,
      0x80 // ADD BC,#8023
    ]);
    m.cpu.getTestSupport().setBC(0xc401);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.bc).toBe(0x4424);
    m.shouldKeepRegisters("BC");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(16);
  });

  it("ADD BC,NN requires extended instruction set", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x36 // ADD BC,NN
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

  it("IN B,(C) works as expected", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x40 // IN B,(C)
    ]);
    m.ioInputSequence.push(0xd5);
    m.cpu.getTestSupport().setBC(0x1234);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.b).toBe(0xd5);
    expect(m.ioAccessLog.length).toBe(1);
    expect(m.ioAccessLog[0].Address).toBe(0x1234);
    expect(m.ioAccessLog[0].Value).toBe(0xd5);
    expect(m.ioAccessLog[0].IsOutput).toBeFalsy();

    m.shouldKeepRegisters("F, B");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(12);
  });

  it("OUT (C),B works as expected", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x41 // OUT (C),B
    ]);
    m.cpu.getTestSupport().setBC(0x1234);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(m.ioAccessLog.length).toBe(1);
    expect(m.ioAccessLog[0].Address).toBe(0x1234);
    expect(m.ioAccessLog[0].Value).toBe(0x12);
    expect(m.ioAccessLog[0].IsOutput).toBeTruthy();

    m.shouldKeepRegisters();
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(12);
  });

  it("SBC HL,BC", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x42 // SBC HL,BC
    ]);
    const sup = m.cpu.getTestSupport();
    sup.setF(m.cpu.getCpuState().f & 0xfe);
    sup.setHL(0x3456);
    sup.setBC(0x1234);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.hl).toBe(0x2222);
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeFalsy();
    expect(s.cFlag).toBeFalsy();
    expect(s.nFlag).toBeTruthy();

    m.shouldKeepRegisters("HL, F");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(15);
  });

  it("SBC HL,BC sets carry flag", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x42 // SBC HL,BC
    ]);
    const sup = m.cpu.getTestSupport();
    sup.setF(m.cpu.getCpuState().f & 0xfe);
    sup.setHL(0x1234);
    sup.setBC(0x3456);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.hl).toBe(0xddde);
    expect(s.sFlag).toBeTruthy();
    expect(s.zFlag).toBeFalsy();
    expect(s.cFlag).toBeTruthy();
    expect(s.nFlag).toBeTruthy();

    m.shouldKeepRegisters("HL, F");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(15);
  });

  it("SBC HL,BC sets Z flag", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x42 // SBC HL,BC
    ]);
    const sup = m.cpu.getTestSupport();
    sup.setF(m.cpu.getCpuState().f & 0xfe);
    sup.setHL(0x1234);
    sup.setBC(0x1234);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.hl).toBe(0x0);
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeTruthy();
    expect(s.cFlag).toBeFalsy();
    expect(s.nFlag).toBeTruthy();

    m.shouldKeepRegisters("HL, F");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(15);
  });

  it("SBC HL,BC uses carry flag", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x42 // SBC HL,BC
    ]);
    const sup = m.cpu.getTestSupport();
    sup.setF(m.cpu.getCpuState().f | FlagsSetMask.C);
    sup.setHL(0x3456);
    sup.setBC(0x1234);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.hl).toBe(0x2221);
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeFalsy();
    expect(s.cFlag).toBeFalsy();
    expect(s.nFlag).toBeTruthy();

    m.shouldKeepRegisters("HL, F");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(15);
  });

  it("LD (NN),BC", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x43,
      0x00,
      0x10 // LD (#1000),BC
    ]);
    m.cpu.getTestSupport().setBC(0x1234);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(m.memory[0x1000]).toBe(0x34);
    expect(m.memory[0x1001]).toBe(0x12);

    m.shouldKeepRegisters();
    m.shouldKeepMemory("1000-1001");

    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(20);
  });

  it("NEG #1", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x44 // NEG
    ]);
    m.cpu.getTestSupport().setA(0x03);

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

    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(8);
  });

  it("NEG sets Z flag", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x44 // NEG
    ]);
    m.cpu.getTestSupport().setA(0x00);

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

    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(8);
  });

  it("NEG sets P flag", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x44 // NEG
    ]);
    m.cpu.getTestSupport().setA(0x80);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x80);
    expect(s.sFlag).toBeTruthy();
    expect(s.zFlag).toBeFalsy();
    expect(s.hFlag).toBeFalsy();
    expect(s.pvFlag).toBeTruthy();
    expect(s.cFlag).toBeTruthy();

    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(8);
  });

  it("NEG resets H flag", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x44 // NEG
    ]);
    m.cpu.getTestSupport().setA(0xd0);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x30);
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeFalsy();
    expect(s.hFlag).toBeFalsy();
    expect(s.pvFlag).toBeFalsy();
    expect(s.cFlag).toBeTruthy();

    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(8);
  });

  it("RETN works with DI #1", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilHalt);
    m.initCode([
      0x3e,
      0x16, // LD A,#16
      0xcd,
      0x06,
      0x00, // CALL #0006
      0x76, // HALT
      0xed,
      0x45 // RETN
    ]);
    const sup = m.cpu.getTestSupport();
    sup.setSP(0x000);
    sup.setIff1(false);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.iff1).toBe(s.iff2);

    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory("FFFE-FFFF");

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(42);
  });

  it("RETN works with EI #1", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilHalt);
    m.initCode([
      0x3e,
      0x16, // LD A,#16
      0xcd,
      0x06,
      0x00, // CALL #0006
      0x76, // HALT
      0xed,
      0x45 // RETN
    ]);
    const sup = m.cpu.getTestSupport();
    sup.setSP(0x000);
    sup.setIff1(false);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.iff1).toBe(s.iff2);

    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory("FFFE-FFFF");

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(42);
  });

  it("IM 0 #1", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x46 // IM 0
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.interruptMode).toBe(0);

    m.shouldKeepRegisters();
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(8);
  });

  it("LD I,A works as expected", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x47 // LD I,A
    ]);
    m.cpu.getTestSupport().setA(0xd5);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.i).toBe(0xd5);

    m.shouldKeepRegisters();
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(9);
  });

  it("IN C,(C) works as expected", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x48 // IN C,(C)
    ]);
    m.ioInputSequence.push(0xd5);
    m.cpu.getTestSupport().setBC(0x1234);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.c).toBe(0xd5);
    expect(m.ioAccessLog.length).toBe(1);
    expect(m.ioAccessLog[0].Address).toBe(0x1234);
    expect(m.ioAccessLog[0].Value).toBe(0xd5);
    expect(m.ioAccessLog[0].IsOutput).toBeFalsy();

    m.shouldKeepRegisters("F, C");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(12);
  });

  it("OUT (C),C works as expected", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x49 // OUT (C),C
    ]);
    m.cpu.getTestSupport().setBC(0x1234);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(m.ioAccessLog.length).toBe(1);
    expect(m.ioAccessLog[0].Address).toBe(0x1234);
    expect(m.ioAccessLog[0].Value).toBe(0x34);
    expect(m.ioAccessLog[0].IsOutput).toBeTruthy();

    m.shouldKeepRegisters();
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(12);
  });

  it("ADC HL,BC", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x4a // ADC HL,BC
    ]);
    m.cpu.getTestSupport().setF(m.cpu.getCpuState().f | FlagsSetMask.C);
    m.cpu.getTestSupport().setHL(0x1111);
    m.cpu.getTestSupport().setBC(0x1234);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.hl).toBe(0x2346);
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeFalsy();
    expect(s.hFlag).toBeFalsy();
    expect(s.pvFlag).toBeFalsy();
    expect(s.cFlag).toBeFalsy();
    expect(s.nFlag).toBeFalsy();

    m.shouldKeepRegisters("HL, F");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(15);
  });

  it("ADC HL,BC sets carry flag", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x4a // ADC HL,BC
    ]);
    m.cpu.getTestSupport().setF(m.cpu.getCpuState().f | FlagsSetMask.C);
    m.cpu.getTestSupport().setHL(0x1111);
    m.cpu.getTestSupport().setBC(0xf234);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.hl).toBe(0x0346);
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeFalsy();
    expect(s.hFlag).toBeFalsy();
    expect(s.pvFlag).toBeFalsy();
    expect(s.cFlag).toBeTruthy();
    expect(s.nFlag).toBeFalsy();

    m.shouldKeepRegisters("HL, F");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(15);
  });

  it("ADC HL,BC sets S flag", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x4a // ADC HL,BC
    ]);
    m.cpu.getTestSupport().setF(m.cpu.getCpuState().f | FlagsSetMask.C);
    m.cpu.getTestSupport().setHL(0x1111);
    m.cpu.getTestSupport().setBC(0x7234);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.hl).toBe(0x8346);
    expect(s.sFlag).toBeTruthy();
    expect(s.zFlag).toBeFalsy();
    expect(s.hFlag).toBeFalsy();
    expect(s.pvFlag).toBeTruthy();
    expect(s.cFlag).toBeFalsy();
    expect(s.nFlag).toBeFalsy();

    m.shouldKeepRegisters("HL, F");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(15);
  });

  it("ADC HL,BC sets Z flag", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x4a // ADC HL,BC
    ]);
    m.cpu.getTestSupport().setF(m.cpu.getCpuState().f | FlagsSetMask.C);
    m.cpu.getTestSupport().setHL(0x0001);
    m.cpu.getTestSupport().setBC(0xfffe);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.hl).toBe(0x0000);
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeTruthy();
    expect(s.hFlag).toBeTruthy();
    expect(s.pvFlag).toBeFalsy();
    expect(s.cFlag).toBeTruthy();
    expect(s.nFlag).toBeFalsy();

    m.shouldKeepRegisters("HL, F");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(15);
  });

  it("LD BC,(NN)", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x4b,
      0x00,
      0x10 // LD BC,(#1000)
    ]);
    m.memory[0x1000] = 0x34;
    m.memory[0x1001] = 0x12;

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.bc).toBe(0x1234);

    m.shouldKeepRegisters("BC");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(20);
  });

  it("NEG #2", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x4c // NEG
    ]);
    m.cpu.getTestSupport().setA(0x03);

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

    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(8);
  });

  it("RETN works with DI #2", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilHalt);
    m.initCode([
      0x3e,
      0x16, // LD A,#16
      0xcd,
      0x06,
      0x00, // CALL #0006
      0x76, // HALT
      0xed,
      0x4d // RETN
    ]);
    const sup = m.cpu.getTestSupport();
    sup.setSP(0x000);
    sup.setIff1(false);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.iff1).toBe(s.iff2);

    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory("FFFE-FFFF");

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(42);
  });

  it("RETN works with EI #2", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilHalt);
    m.initCode([
      0x3e,
      0x16, // LD A,#16
      0xcd,
      0x06,
      0x00, // CALL #0006
      0x76, // HALT
      0xed,
      0x4d // RETN
    ]);
    const sup = m.cpu.getTestSupport();
    sup.setSP(0x000);
    sup.setIff1(false);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.iff1).toBe(s.iff2);

    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory("FFFE-FFFF");

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(42);
  });

  it("IM 0 #2", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x4e // IM 0
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.interruptMode).toBe(0);

    m.shouldKeepRegisters();
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(8);
  });

  it("LD R,A works as expected", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x4f // LD R,A
    ]);
    m.cpu.getTestSupport().setA(0xd5);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.r).toBe(0xd5);

    m.shouldKeepRegisters();
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(9);
  });

  it("IN D,(C) works as expected", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x50 // IN D,(C)
    ]);
    m.ioInputSequence.push(0xd5);
    m.cpu.getTestSupport().setBC(0x1234);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.d).toBe(0xd5);
    expect(m.ioAccessLog.length).toBe(1);
    expect(m.ioAccessLog[0].Address).toBe(0x1234);
    expect(m.ioAccessLog[0].Value).toBe(0xd5);
    expect(m.ioAccessLog[0].IsOutput).toBeFalsy();

    m.shouldKeepRegisters("F, D");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(12);
  });

  it("OUT (C),D works as expected", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x51 // OUT (C),D
    ]);
    m.cpu.getTestSupport().setBC(0x1234);
    m.cpu.getTestSupport().setDE(0x1234);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(m.ioAccessLog.length).toBe(1);
    expect(m.ioAccessLog[0].Address).toBe(0x1234);
    expect(m.ioAccessLog[0].Value).toBe(0x12);
    expect(m.ioAccessLog[0].IsOutput).toBeTruthy();

    m.shouldKeepRegisters();
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(12);
  });

  it("SBC HL,DE", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x52 // SBC HL,DE
    ]);
    const sup = m.cpu.getTestSupport();
    sup.setF(m.cpu.getCpuState().f & 0xfe);
    sup.setHL(0x3456);
    sup.setDE(0x1234);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.hl).toBe(0x2222);
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeFalsy();
    expect(s.cFlag).toBeFalsy();
    expect(s.nFlag).toBeTruthy();

    m.shouldKeepRegisters("HL, F");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(15);
  });

  it("SBC HL,DE sets carry flag", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x52 // SBC HL,DE
    ]);
    const sup = m.cpu.getTestSupport();
    sup.setF(m.cpu.getCpuState().f & 0xfe);
    sup.setHL(0x1234);
    sup.setDE(0x3456);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.hl).toBe(0xddde);
    expect(s.sFlag).toBeTruthy();
    expect(s.zFlag).toBeFalsy();
    expect(s.cFlag).toBeTruthy();
    expect(s.nFlag).toBeTruthy();

    m.shouldKeepRegisters("HL, F");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(15);
  });

  it("SBC HL,DE sets Z flag", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x52 // SBC HL,DE
    ]);
    const sup = m.cpu.getTestSupport();
    sup.setF(m.cpu.getCpuState().f & 0xfe);
    sup.setHL(0x1234);
    sup.setDE(0x1234);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.hl).toBe(0x0);
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeTruthy();
    expect(s.cFlag).toBeFalsy();
    expect(s.nFlag).toBeTruthy();

    m.shouldKeepRegisters("HL, F");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(15);
  });

  it("SBC HL,DE uses carry flag", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x52 // SBC HL,DE
    ]);
    const sup = m.cpu.getTestSupport();
    sup.setF(m.cpu.getCpuState().f | FlagsSetMask.C);
    sup.setHL(0x3456);
    sup.setDE(0x1234);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.hl).toBe(0x2221);
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeFalsy();
    expect(s.cFlag).toBeFalsy();
    expect(s.nFlag).toBeTruthy();

    m.shouldKeepRegisters("HL, F");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(15);
  });

  it("NEG #3", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x54 // NEG
    ]);
    m.cpu.getTestSupport().setA(0x03);

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

    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(8);
  });

  it("RETN works with DI #3", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilHalt);
    m.initCode([
      0x3e,
      0x16, // LD A,#16
      0xcd,
      0x06,
      0x00, // CALL #0006
      0x76, // HALT
      0xed,
      0x55 // RETN
    ]);
    const sup = m.cpu.getTestSupport();
    sup.setSP(0x000);
    sup.setIff1(false);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.iff1).toBe(s.iff2);

    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory("FFFE-FFFF");

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(42);
  });

  it("RETN works with EI #3", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilHalt);
    m.initCode([
      0x3e,
      0x16, // LD A,#16
      0xcd,
      0x06,
      0x00, // CALL #0006
      0x76, // HALT
      0xed,
      0x55 // RETN
    ]);
    const sup = m.cpu.getTestSupport();
    sup.setSP(0x000);
    sup.setIff1(false);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.iff1).toBe(s.iff2);

    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory("FFFE-FFFF");

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(42);
  });

  it("IM 1 #1", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x56 // IM 0
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.interruptMode).toBe(1);

    m.shouldKeepRegisters();
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(8);
  });

  it("LD A,I", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x57 // LD A,I
    ]);
    m.cpu.getTestSupport().setI(0xd5);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0xd5);

    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(9);
  });

  it("LD A,I resets H and N", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x57 // LD A,I
    ]);
    m.cpu.getTestSupport().setI(0xd5);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0xd5);

    expect(s.hFlag).toBeFalsy();
    expect(s.nFlag).toBeFalsy();

    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(9);
  });

  it("LD A,I sets S when negative", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x57 // LD A,I
    ]);
    m.cpu.getTestSupport().setI(0xd5);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0xd5);

    expect(s.sFlag).toBeTruthy();

    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(9);
  });

  it("LD A,I resets S when non-negative", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x57 // LD A,I
    ]);
    m.cpu.getTestSupport().setI(0x25);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x25);

    expect(s.sFlag).toBeFalsy();

    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(9);
  });

  it("LD A,I sets Z when zero", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x57 // LD A,I
    ]);
    m.cpu.getTestSupport().setI(0x00);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x00);
    expect(s.zFlag).toBeTruthy();
    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(9);
  });

  it("LD A,I resets Z when non-zero", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x57 // LD A,I
    ]);
    m.cpu.getTestSupport().setI(0x25);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x25);

    expect(s.zFlag).toBeFalsy();

    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(9);
  });

  it("LD A,I resets PV when IFF2 is reset", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x57 // LD A,I
    ]);
    m.cpu.getTestSupport().setI(0x25);
    m.cpu.getTestSupport().setIff2(false);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x25);

    expect(s.pvFlag).toBeFalsy();

    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(9);
  });

  it("LD A,I sets PV when IFF2 is set", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x57 // LD A,I
    ]);
    m.cpu.getTestSupport().setI(0x25);
    m.cpu.getTestSupport().setIff2(true);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x25);

    expect(s.pvFlag).toBeTruthy();

    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(9);
  });

  it("LD A,I keeps C when set", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x57 // LD A,I
    ]);
    m.cpu.getTestSupport().setI(0x25);
    m.cpu.getTestSupport().setIff2(true);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x25);

    expect(s.cFlag).toBeTruthy();

    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(9);
  });

  it("LD A,I keeps F3 and F5", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x57 // LD A,I
    ]);
    m.cpu.getTestSupport().setF(m.cpu.getCpuState().f | FlagsSetMask.C);
    m.cpu.getTestSupport().setI(0x09);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x09);

    expect(s.r3Flag).toBeTruthy();
    expect(s.r5Flag).toBeFalsy();

    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(9);
  });

  it("IN E,(C) works as expected", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x58 // IN E,(C)
    ]);
    m.ioInputSequence.push(0xd5);
    m.cpu.getTestSupport().setBC(0x1234);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.e).toBe(0xd5);
    expect(m.ioAccessLog.length).toBe(1);
    expect(m.ioAccessLog[0].Address).toBe(0x1234);
    expect(m.ioAccessLog[0].Value).toBe(0xd5);
    expect(m.ioAccessLog[0].IsOutput).toBeFalsy();

    m.shouldKeepRegisters("F, E");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(12);
  });

  it("OUT (C),E works as expected", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x59 // OUT (C),E
    ]);
    m.cpu.getTestSupport().setBC(0x1234);
    m.cpu.getTestSupport().setDE(0x1234);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(m.ioAccessLog.length).toBe(1);
    expect(m.ioAccessLog[0].Address).toBe(0x1234);
    expect(m.ioAccessLog[0].Value).toBe(0x34);
    expect(m.ioAccessLog[0].IsOutput).toBeTruthy();

    m.shouldKeepRegisters();
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(12);
  });

  it("ADC HL,DE", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x5a // ADC HL,DE
    ]);
    m.cpu.getTestSupport().setF(m.cpu.getCpuState().f | FlagsSetMask.C);
    m.cpu.getTestSupport().setHL(0x1111);
    m.cpu.getTestSupport().setDE(0x1234);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.hl).toBe(0x2346);
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeFalsy();
    expect(s.hFlag).toBeFalsy();
    expect(s.pvFlag).toBeFalsy();
    expect(s.cFlag).toBeFalsy();
    expect(s.nFlag).toBeFalsy();

    m.shouldKeepRegisters("HL, F");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(15);
  });

  it("ADC HL,DE sets carry flag", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x5a // ADC HL,DE
    ]);
    m.cpu.getTestSupport().setF(m.cpu.getCpuState().f | FlagsSetMask.C);
    m.cpu.getTestSupport().setHL(0x1111);
    m.cpu.getTestSupport().setDE(0xf234);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.hl).toBe(0x0346);
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeFalsy();
    expect(s.hFlag).toBeFalsy();
    expect(s.pvFlag).toBeFalsy();
    expect(s.cFlag).toBeTruthy();
    expect(s.nFlag).toBeFalsy();

    m.shouldKeepRegisters("HL, F");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(15);
  });

  it("ADC HL,DE sets S flag", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x5a // ADC HL,DE
    ]);
    m.cpu.getTestSupport().setF(m.cpu.getCpuState().f | FlagsSetMask.C);
    m.cpu.getTestSupport().setHL(0x1111);
    m.cpu.getTestSupport().setDE(0x7234);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.hl).toBe(0x8346);
    expect(s.sFlag).toBeTruthy();
    expect(s.zFlag).toBeFalsy();
    expect(s.hFlag).toBeFalsy();
    expect(s.pvFlag).toBeTruthy();
    expect(s.cFlag).toBeFalsy();
    expect(s.nFlag).toBeFalsy();

    m.shouldKeepRegisters("HL, F");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(15);
  });

  it("ADC HL,DE sets Z flag", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x5a // ADC HL,DE
    ]);
    m.cpu.getTestSupport().setF(m.cpu.getCpuState().f | FlagsSetMask.C);
    m.cpu.getTestSupport().setHL(0x0001);
    m.cpu.getTestSupport().setDE(0xfffe);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.hl).toBe(0x0000);
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeTruthy();
    expect(s.hFlag).toBeTruthy();
    expect(s.pvFlag).toBeFalsy();
    expect(s.cFlag).toBeTruthy();
    expect(s.nFlag).toBeFalsy();

    m.shouldKeepRegisters("HL, F");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(15);
  });

  it("LD DE,(NN)", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x5b,
      0x00,
      0x10 // LD BC,(#1000)
    ]);
    m.memory[0x1000] = 0x34;
    m.memory[0x1001] = 0x12;

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.de).toBe(0x1234);

    m.shouldKeepRegisters("DE");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(20);
  });

  it("NEG #4", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x5c // NEG
    ]);
    m.cpu.getTestSupport().setA(0x03);

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

    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(8);
  });

  it("RETN works with DI #4", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilHalt);
    m.initCode([
      0x3e,
      0x16, // LD A,#16
      0xcd,
      0x06,
      0x00, // CALL #0006
      0x76, // HALT
      0xed,
      0x5d // RETN
    ]);
    const sup = m.cpu.getTestSupport();
    sup.setSP(0x000);
    sup.setIff1(false);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.iff1).toBe(s.iff2);

    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory("FFFE-FFFF");

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(42);
  });

  it("RETN works with EI #4", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilHalt);
    m.initCode([
      0x3e,
      0x16, // LD A,#16
      0xcd,
      0x06,
      0x00, // CALL #0006
      0x76, // HALT
      0xed,
      0x5d // RETN
    ]);
    const sup = m.cpu.getTestSupport();
    sup.setSP(0x000);
    sup.setIff1(false);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.iff1).toBe(s.iff2);

    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory("FFFE-FFFF");

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(42);
  });

  it("IM 2 #1", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x5e // IM 0
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.interruptMode).toBe(2);

    m.shouldKeepRegisters();
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(8);
  });

  it("LD A,R", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x5f // LD A,R
    ]);
    m.cpu.getTestSupport().setR(0xd5);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0xd7);

    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(9);
  });

  it("LD A,R resets H and N", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x5f // LD A,R
    ]);
    m.cpu.getTestSupport().setR(0xd3);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0xd5);

    expect(s.hFlag).toBeFalsy();
    expect(s.nFlag).toBeFalsy();

    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(9);
  });

  it("LD A,R sets S when negative", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x5f // LD A,R
    ]);
    m.cpu.getTestSupport().setR(0xd3);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0xd5);

    expect(s.sFlag).toBeTruthy();

    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(9);
  });

  it("LD A,R resets S when non-negative", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x5f // LD A,R
    ]);
    m.cpu.getTestSupport().setR(0x23);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x25);

    expect(s.sFlag).toBeFalsy();

    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(9);
  });

  it("LD A,R sets Z when zero", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x57 // LD A,I
    ]);
    m.cpu.getTestSupport().setR(0x7e);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x00);
    expect(s.zFlag).toBeTruthy();
    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(9);
  });

  it("LD A,R resets Z when non-zero", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x5f // LD A,R
    ]);
    m.cpu.getTestSupport().setR(0x23);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x25);

    expect(s.zFlag).toBeFalsy();

    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(9);
  });

  it("LD A,R resets PV when IFF2 is reset", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x5f // LD A,R
    ]);
    m.cpu.getTestSupport().setR(0x23);
    m.cpu.getTestSupport().setIff2(false);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x25);

    expect(s.pvFlag).toBeFalsy();

    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(9);
  });

  it("LD A,R sets PV when IFF2 is set", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x5f // LD A,R
    ]);
    m.cpu.getTestSupport().setR(0x23);
    m.cpu.getTestSupport().setIff2(true);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x25);

    expect(s.pvFlag).toBeTruthy();

    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(9);
  });

  it("LD A,R keeps C when set", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x5f // LD A,R
    ]);
    m.cpu.getTestSupport().setR(0x23);
    m.cpu.getTestSupport().setIff2(true);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x25);

    expect(s.cFlag).toBeTruthy();

    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(9);
  });

  it("LD A,R keeps F3 and F5", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x5f // LD A,R
    ]);
    m.cpu.getTestSupport().setF(m.cpu.getCpuState().f | FlagsSetMask.C);
    m.cpu.getTestSupport().setR(0x07);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x09);

    expect(s.r3Flag).toBeTruthy();
    expect(s.r5Flag).toBeFalsy();

    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(9);
  });

  it("IN H,(C) works as expected", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x60 // IN H,(C)
    ]);
    m.ioInputSequence.push(0xd5);
    m.cpu.getTestSupport().setBC(0x1234);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.h).toBe(0xd5);
    expect(m.ioAccessLog.length).toBe(1);
    expect(m.ioAccessLog[0].Address).toBe(0x1234);
    expect(m.ioAccessLog[0].Value).toBe(0xd5);
    expect(m.ioAccessLog[0].IsOutput).toBeFalsy();

    m.shouldKeepRegisters("F, H");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(12);
  });

  it("OUT (C),H works as expected", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x61 // OUT (C),H
    ]);
    m.cpu.getTestSupport().setBC(0x1234);
    m.cpu.getTestSupport().setHL(0x1234);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(m.ioAccessLog.length).toBe(1);
    expect(m.ioAccessLog[0].Address).toBe(0x1234);
    expect(m.ioAccessLog[0].Value).toBe(0x12);
    expect(m.ioAccessLog[0].IsOutput).toBeTruthy();

    m.shouldKeepRegisters();
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(12);
  });

  it("SBC HL,HL works as expected", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x62 // SBC HL,HL
    ]);
    m.cpu.getTestSupport().setF(m.cpu.getCpuState().f | FlagsSetMask.C);
    m.cpu.getTestSupport().setHL(0x3456);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.hl).toBe(0xffff);
    expect(s.sFlag).toBeTruthy();
    expect(s.zFlag).toBeFalsy();
    expect(s.cFlag).toBeTruthy();
    expect(s.nFlag).toBeTruthy();

    m.shouldKeepRegisters("HL, F");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(15);
  });

  it("NEG #5", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x64 // NEG
    ]);
    m.cpu.getTestSupport().setA(0x03);

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

    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(8);
  });

  it("RETN works with DI #5", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilHalt);
    m.initCode([
      0x3e,
      0x16, // LD A,#16
      0xcd,
      0x06,
      0x00, // CALL #0006
      0x76, // HALT
      0xed,
      0x65 // RETN
    ]);
    const sup = m.cpu.getTestSupport();
    sup.setSP(0x000);
    sup.setIff1(false);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.iff1).toBe(s.iff2);

    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory("FFFE-FFFF");

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(42);
  });

  it("RETN works with EI #5", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilHalt);
    m.initCode([
      0x3e,
      0x16, // LD A,#16
      0xcd,
      0x06,
      0x00, // CALL #0006
      0x76, // HALT
      0xed,
      0x65 // RETN
    ]);
    const sup = m.cpu.getTestSupport();
    sup.setSP(0x000);
    sup.setIff1(false);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.iff1).toBe(s.iff2);

    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory("FFFE-FFFF");

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(42);
  });

  it("IM 0 #3", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x66 // IM 0
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.interruptMode).toBe(0);

    m.shouldKeepRegisters();
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(8);
  });

  
  it("IN L,(C) works as expected", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x68 // IN L,(C)
    ]);
    m.ioInputSequence.push(0xd5);
    m.cpu.getTestSupport().setBC(0x1234);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.l).toBe(0xd5);
    expect(m.ioAccessLog.length).toBe(1);
    expect(m.ioAccessLog[0].Address).toBe(0x1234);
    expect(m.ioAccessLog[0].Value).toBe(0xd5);
    expect(m.ioAccessLog[0].IsOutput).toBeFalsy();

    m.shouldKeepRegisters("F, L");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(12);
  });

  it("OUT (C),L works as expected", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x69 // OUT (C),L
    ]);
    m.cpu.getTestSupport().setBC(0x1234);
    m.cpu.getTestSupport().setHL(0x1234);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(m.ioAccessLog.length).toBe(1);
    expect(m.ioAccessLog[0].Address).toBe(0x1234);
    expect(m.ioAccessLog[0].Value).toBe(0x34);
    expect(m.ioAccessLog[0].IsOutput).toBeTruthy();

    m.shouldKeepRegisters();
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(12);
  });

  it("ADC HL,HL works as expected", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x6a // ADC HL,HL
    ]);
    m.cpu.getTestSupport().setF(m.cpu.getCpuState().f | FlagsSetMask.C);
    m.cpu.getTestSupport().setHL(0x1111);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.hl).toBe(0x2223);
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeFalsy();
    expect(s.hFlag).toBeFalsy();
    expect(s.pvFlag).toBeFalsy();
    expect(s.cFlag).toBeFalsy();
    expect(s.nFlag).toBeFalsy();

    m.shouldKeepRegisters("HL, F");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(15);
  });

  it("LD HL,(NN)", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x6b,
      0x00,
      0x10 // LD BC,(#1000)
    ]);
    m.memory[0x1000] = 0x34;
    m.memory[0x1001] = 0x12;

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.hl).toBe(0x1234);

    m.shouldKeepRegisters("HL");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(20);
  });

  it("NEG #6", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x6c // NEG
    ]);
    m.cpu.getTestSupport().setA(0x03);

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

    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(8);
  });

  it("RETN works with DI #6", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilHalt);
    m.initCode([
      0x3e,
      0x16, // LD A,#16
      0xcd,
      0x06,
      0x00, // CALL #0006
      0x76, // HALT
      0xed,
      0x6d // RETN
    ]);
    const sup = m.cpu.getTestSupport();
    sup.setSP(0x000);
    sup.setIff1(false);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.iff1).toBe(s.iff2);

    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory("FFFE-FFFF");

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(42);
  });

  it("RETN works with EI #6", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilHalt);
    m.initCode([
      0x3e,
      0x16, // LD A,#16
      0xcd,
      0x06,
      0x00, // CALL #0006
      0x76, // HALT
      0xed,
      0x6d // RETN
    ]);
    const sup = m.cpu.getTestSupport();
    sup.setSP(0x000);
    sup.setIff1(false);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.iff1).toBe(s.iff2);

    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory("FFFE-FFFF");

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(42);
  });

  it("IM 0 #4", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x6e // IM 0
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.interruptMode).toBe(0);

    m.shouldKeepRegisters();
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(8);
  });

  it("IN (C) works as expected", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x70 // IN (C)
    ]);
    m.ioInputSequence.push(0xd5);
    m.cpu.getTestSupport().setBC(0x1234);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(m.ioAccessLog.length).toBe(1);
    expect(m.ioAccessLog[0].Address).toBe(0x1234);
    expect(m.ioAccessLog[0].Value).toBe(0xd5);
    expect(m.ioAccessLog[0].IsOutput).toBeFalsy();

    m.shouldKeepRegisters("F");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(12);
  });

  it("OUT (C),0 works as expected", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x71 // OUT (C),0
    ]);
    m.cpu.getTestSupport().setBC(0x1234);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(m.ioAccessLog.length).toBe(1);
    expect(m.ioAccessLog[0].Address).toBe(0x1234);
    expect(m.ioAccessLog[0].Value).toBe(0x00);
    expect(m.ioAccessLog[0].IsOutput).toBeTruthy();

    m.shouldKeepRegisters();
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(12);
  });

  it("SBC HL,SP", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x72 // SBC HL,SP
    ]);
    const sup = m.cpu.getTestSupport();
    sup.setF(m.cpu.getCpuState().f & 0xfe);
    sup.setHL(0x3456);
    sup.setSP(0x1234);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.hl).toBe(0x2222);
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeFalsy();
    expect(s.cFlag).toBeFalsy();
    expect(s.nFlag).toBeTruthy();

    m.shouldKeepRegisters("HL, F");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(15);
  });

  it("SBC HL,SP sets carry flag", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x72 // SBC HL,SP
    ]);
    const sup = m.cpu.getTestSupport();
    sup.setF(m.cpu.getCpuState().f & 0xfe);
    sup.setHL(0x1234);
    sup.setSP(0x3456);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.hl).toBe(0xddde);
    expect(s.sFlag).toBeTruthy();
    expect(s.zFlag).toBeFalsy();
    expect(s.cFlag).toBeTruthy();
    expect(s.nFlag).toBeTruthy();

    m.shouldKeepRegisters("HL, F");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(15);
  });

  it("SBC HL,SP sets Z flag", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x72 // SBC HL,SP
    ]);
    const sup = m.cpu.getTestSupport();
    sup.setF(m.cpu.getCpuState().f & 0xfe);
    sup.setHL(0x1234);
    sup.setSP(0x1234);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.hl).toBe(0x0);
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeTruthy();
    expect(s.cFlag).toBeFalsy();
    expect(s.nFlag).toBeTruthy();

    m.shouldKeepRegisters("HL, F");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(15);
  });

  it("SBC HL,SP uses carry flag", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x72 // SBC HL,DE
    ]);
    const sup = m.cpu.getTestSupport();
    sup.setF(m.cpu.getCpuState().f | FlagsSetMask.C);
    sup.setHL(0x3456);
    sup.setSP(0x1234);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.hl).toBe(0x2221);
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeFalsy();
    expect(s.cFlag).toBeFalsy();
    expect(s.nFlag).toBeTruthy();

    m.shouldKeepRegisters("HL, F");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(15);
  });

  it("NEG #7", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x74 // NEG
    ]);
    m.cpu.getTestSupport().setA(0x03);

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

    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(8);
  });

  it("RETN works with DI #7", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilHalt);
    m.initCode([
      0x3e,
      0x16, // LD A,#16
      0xcd,
      0x06,
      0x00, // CALL #0006
      0x76, // HALT
      0xed,
      0x75 // RETN
    ]);
    const sup = m.cpu.getTestSupport();
    sup.setSP(0x000);
    sup.setIff1(false);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.iff1).toBe(s.iff2);

    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory("FFFE-FFFF");

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(42);
  });

  it("RETN works with EI #7", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilHalt);
    m.initCode([
      0x3e,
      0x16, // LD A,#16
      0xcd,
      0x06,
      0x00, // CALL #0006
      0x76, // HALT
      0xed,
      0x75 // RETN
    ]);
    const sup = m.cpu.getTestSupport();
    sup.setSP(0x000);
    sup.setIff1(false);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.iff1).toBe(s.iff2);

    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory("FFFE-FFFF");

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(42);
  });

  it("IM 1 #2", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x76 // IM 0
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.interruptMode).toBe(1);

    m.shouldKeepRegisters();
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(8);
  });

  it("IN A,(C) works as expected", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x78 // IN A,(C)
    ]);
    m.ioInputSequence.push(0xd5);
    m.cpu.getTestSupport().setBC(0x1234);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0xd5);
    expect(m.ioAccessLog.length).toBe(1);
    expect(m.ioAccessLog[0].Address).toBe(0x1234);
    expect(m.ioAccessLog[0].Value).toBe(0xd5);
    expect(m.ioAccessLog[0].IsOutput).toBeFalsy();

    m.shouldKeepRegisters("F, A");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(12);
  });

  it("OUT (C),A works as expected", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x79 // OUT (C),A
    ]);
    m.cpu.getTestSupport().setBC(0x1234);
    m.cpu.getTestSupport().setA(0x12);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(m.ioAccessLog.length).toBe(1);
    expect(m.ioAccessLog[0].Address).toBe(0x1234);
    expect(m.ioAccessLog[0].Value).toBe(0x12);
    expect(m.ioAccessLog[0].IsOutput).toBeTruthy();

    m.shouldKeepRegisters();
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(12);
  });

  it("ADC HL,SP", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x7a // ADC HL,SP
    ]);
    m.cpu.getTestSupport().setF(m.cpu.getCpuState().f | FlagsSetMask.C);
    m.cpu.getTestSupport().setHL(0x1111);
    m.cpu.getTestSupport().setSP(0x1234);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.hl).toBe(0x2346);
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeFalsy();
    expect(s.hFlag).toBeFalsy();
    expect(s.pvFlag).toBeFalsy();
    expect(s.cFlag).toBeFalsy();
    expect(s.nFlag).toBeFalsy();

    m.shouldKeepRegisters("HL, F");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(15);
  });

  it("ADC HL,SP sets carry flag", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x7a // ADC HL,SP
    ]);
    m.cpu.getTestSupport().setF(m.cpu.getCpuState().f | FlagsSetMask.C);
    m.cpu.getTestSupport().setHL(0x1111);
    m.cpu.getTestSupport().setSP(0xf234);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.hl).toBe(0x0346);
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeFalsy();
    expect(s.hFlag).toBeFalsy();
    expect(s.pvFlag).toBeFalsy();
    expect(s.cFlag).toBeTruthy();
    expect(s.nFlag).toBeFalsy();

    m.shouldKeepRegisters("HL, F");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(15);
  });

  it("ADC HL,SP sets S flag", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x7a // ADC HL,SP
    ]);
    m.cpu.getTestSupport().setF(m.cpu.getCpuState().f | FlagsSetMask.C);
    m.cpu.getTestSupport().setHL(0x1111);
    m.cpu.getTestSupport().setSP(0x7234);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.hl).toBe(0x8346);
    expect(s.sFlag).toBeTruthy();
    expect(s.zFlag).toBeFalsy();
    expect(s.hFlag).toBeFalsy();
    expect(s.pvFlag).toBeTruthy();
    expect(s.cFlag).toBeFalsy();
    expect(s.nFlag).toBeFalsy();

    m.shouldKeepRegisters("HL, F");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(15);
  });

  it("ADC HL,SP sets Z flag", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x7a // ADC HL,DE
    ]);
    m.cpu.getTestSupport().setF(m.cpu.getCpuState().f | FlagsSetMask.C);
    m.cpu.getTestSupport().setHL(0x0001);
    m.cpu.getTestSupport().setSP(0xfffe);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.hl).toBe(0x0000);
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeTruthy();
    expect(s.hFlag).toBeTruthy();
    expect(s.pvFlag).toBeFalsy();
    expect(s.cFlag).toBeTruthy();
    expect(s.nFlag).toBeFalsy();

    m.shouldKeepRegisters("HL, F");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(15);
  });

  it("LD SP,(NN)", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x7b,
      0x00,
      0x10 // LD BC,(#1000)
    ]);
    m.memory[0x1000] = 0x34;
    m.memory[0x1001] = 0x12;

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.sp).toBe(0x1234);

    m.shouldKeepRegisters("SP");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(20);
  });

  it("NEG #8", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x7c // NEG
    ]);
    m.cpu.getTestSupport().setA(0x03);

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

    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(8);
  });

  it("RETN works with DI #8", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilHalt);
    m.initCode([
      0x3e,
      0x16, // LD A,#16
      0xcd,
      0x06,
      0x00, // CALL #0006
      0x76, // HALT
      0xed,
      0x7d // RETN
    ]);
    const sup = m.cpu.getTestSupport();
    sup.setSP(0x000);
    sup.setIff1(false);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.iff1).toBe(s.iff2);

    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory("FFFE-FFFF");

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(42);
  });

  it("RETN works with EI #8", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilHalt);
    m.initCode([
      0x3e,
      0x16, // LD A,#16
      0xcd,
      0x06,
      0x00, // CALL #0006
      0x76, // HALT
      0xed,
      0x7d // RETN
    ]);
    const sup = m.cpu.getTestSupport();
    sup.setSP(0x000);
    sup.setIff1(false);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.iff1).toBe(s.iff2);

    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory("FFFE-FFFF");

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(42);
  });

  it("IM 2 #2", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xed,
      0x7e // IM 2
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.interruptMode).toBe(2);

    m.shouldKeepRegisters();
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(8);
  });
});
