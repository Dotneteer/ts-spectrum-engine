import "mocha";
import * as expect from "expect";
import { Z80TestMachine, RunMode } from "./Z80TestMachine";
import { Z80CpuSignals } from "../src/spectrumemu/cpu/cpu-z80";
describe("Z80 CPU - standard 40-7f", () => {
  it("LD B,B", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0x40 // LD B,B
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

  it("LD B,C", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x0e,
      0xb9, // LD C,#B9
      0x41 // LD B,C
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    expect(s.b).toBe(0xb9);

    m.shouldKeepRegisters("B, C");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("LD B,D", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x16,
      0xb9, // LD D,#B9
      0x42 // LD B,D
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    expect(s.b).toBe(0xb9);

    m.shouldKeepRegisters("B, D");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("LD B,E", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x1e,
      0xb9, // LD E,#B9
      0x43 // LD B,E
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    expect(s.b).toBe(0xb9);

    m.shouldKeepRegisters("B, E");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("LD B,H", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x26,
      0xb9, // LD H,#B9
      0x44 // LD B,H
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    expect(s.b).toBe(0xb9);

    m.shouldKeepRegisters("B, H");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("LD B,L", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x2e,
      0xb9, // LD L,#B9
      0x45 // LD B,L
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    expect(s.b).toBe(0xb9);

    m.shouldKeepRegisters("B, L");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("LD B,(HL)", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x21,
      0x00,
      0x10, // LD HL,#1000
      0x46 // LD B,(HL)
    ]);
    m.memory[0x1000] = 0xb9;

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    expect(s.b).toBe(0xb9);

    m.shouldKeepRegisters("B, HL");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(17);
  });

  it("LD B,A", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0xb9, // LD A,#B9
      0x47 // LD B,A
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    expect(s.b).toBe(0xb9);

    m.shouldKeepRegisters("B, A");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("LD C,B", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x06,
      0xb9, // LD B,#B9
      0x48 // LD C,B
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    expect(s.c).toBe(0xb9);

    m.shouldKeepRegisters("C, B");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("LD C,C", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0x49 // LD C,C
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

  it("LD C,D", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x16,
      0xb9, // LD D,#B9
      0x4a // LD C,D
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    expect(s.c).toBe(0xb9);

    m.shouldKeepRegisters("C, D");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("LD C,E", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x1e,
      0xb9, // LD E,#B9
      0x4b // LD C,E
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    expect(s.c).toBe(0xb9);

    m.shouldKeepRegisters("C, E");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("LD C,H", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x26,
      0xb9, // LD H,#B9
      0x4c // LD C,H
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    expect(s.c).toBe(0xb9);

    m.shouldKeepRegisters("C, H");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("LD C,L", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x2e,
      0xb9, // LD L,#B9
      0x4d // LD C,L
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    expect(s.c).toBe(0xb9);

    m.shouldKeepRegisters("C, L");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("LD C,(HL)", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x21,
      0x00,
      0x10, // LD HL,#1000
      0x4e // LD C,(HL)
    ]);
    m.memory[0x1000] = 0xb9;

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    expect(s.c).toBe(0xb9);

    m.shouldKeepRegisters("C, HL");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(17);
  });

  it("LD C,A works as expected", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0xb9, // LD A,#B9
      0x4f // LD C,A
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    expect(s.c).toBe(0xb9);

    m.shouldKeepRegisters("C, A");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("LD D,B", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x06,
      0xb9, // LD B,#B9
      0x50 // LD D,B
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    expect(s.d).toBe(0xb9);

    m.shouldKeepRegisters("D, B");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("LD D,C", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x0e,
      0xb9, // LD C,#B9
      0x51 // LD D,C
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    expect(s.d).toBe(0xb9);

    m.shouldKeepRegisters("D, C");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("LD D,D", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0x52 // LD D,D
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

  it("LD D,E", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x1e,
      0xb9, // LD E,#B9
      0x53 // LD D,E
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    expect(s.d).toBe(0xb9);

    m.shouldKeepRegisters("D, E");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("LD D,H", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x26,
      0xb9, // LD H,#B9
      0x54 // LD D,H
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    expect(s.d).toBe(0xb9);

    m.shouldKeepRegisters("D, H");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("LD D,L", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x2e,
      0xb9, // LD L,#B9
      0x55 // LD D,L
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    expect(s.d).toBe(0xb9);

    m.shouldKeepRegisters("D, L");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("LD D,(HL)", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x21,
      0x00,
      0x10, // LD HL,#1000
      0x56 // LD D,(HL)
    ]);
    m.memory[0x1000] = 0xb9;

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    expect(s.d).toBe(0xb9);

    m.shouldKeepRegisters("D, HL");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(17);
  });

  it("LD D,A", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0xb9, // LD A,#B9
      0x57 // LD D,A
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    expect(s.d).toBe(0xb9);

    m.shouldKeepRegisters("D, A");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("LD E,B", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x06,
      0xb9, // LD B,#B9
      0x58 // LD E,B
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    expect(s.e).toBe(0xb9);

    m.shouldKeepRegisters("E, B");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("LD E,C", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x0e,
      0xb9, // LD C,#B9
      0x59 // LD E,C
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    expect(s.e).toBe(0xb9);

    m.shouldKeepRegisters("E, C");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("LD E,D", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x16,
      0xb9, // LD D,#B9
      0x5a // LD E,D
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    expect(s.e).toBe(0xb9);

    m.shouldKeepRegisters("E, D");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("LD E,E", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0x5b // LD E,E
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

  it("LD E,H", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x26,
      0xb9, // LD H,#B9
      0x5c // LD E,H
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    expect(s.e).toBe(0xb9);

    m.shouldKeepRegisters("E, H");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("LD E,L", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x2e,
      0xb9, // LD L,#B9
      0x5d // LD E,L
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    expect(s.e).toBe(0xb9);

    m.shouldKeepRegisters("E, L");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("LD E,(HL)", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x21,
      0x00,
      0x10, // LD HL,#1000
      0x5e // LD E,(HL)
    ]);
    m.memory[0x1000] = 0xb9;

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    expect(s.e).toBe(0xb9);

    m.shouldKeepRegisters("E, HL");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(17);
  });

  it("LD E,A", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0xb9, // LD A,#B9
      0x5f // LD E,A
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    expect(s.e).toBe(0xb9);

    m.shouldKeepRegisters("E, A");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("LD H,B", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x06,
      0xb9, // LD B,#B9
      0x60 // LD H,A
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    expect(s.h).toBe(0xb9);

    m.shouldKeepRegisters("H, B");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("LD H,C", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x0e,
      0xb9, // LD C,#B9
      0x61 // LD H,C
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    expect(s.h).toBe(0xb9);

    m.shouldKeepRegisters("H, C");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("LD H,D", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x16,
      0xb9, // LD D,#B9
      0x62 // LD H,D
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    expect(s.h).toBe(0xb9);

    m.shouldKeepRegisters("H, D");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("LD H,E", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x1e,
      0xb9, // LD E,#B9
      0x63 // LD H,E
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    expect(s.h).toBe(0xb9);

    m.shouldKeepRegisters("H, E");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("LD H,H", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0x64 // LD H,H
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

  it("LD H,L", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x2e,
      0xb9, // LD L,#B9
      0x65 // LD H,L
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    expect(s.h).toBe(0xb9);

    m.shouldKeepRegisters("H, L");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("LD H,(HL)", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x21,
      0x00,
      0x10, // LD HL,#1000
      0x66 // LD H,(HL)
    ]);
    m.memory[0x1000] = 0xb9;

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    expect(s.h).toBe(0xb9);

    m.shouldKeepRegisters("H, HL");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(17);
  });

  it("LD H,A", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0xb9, // LD A,#B9
      0x67 // LD H,A
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    expect(s.h).toBe(0xb9);

    m.shouldKeepRegisters("H, A");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("LD L,B", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x06,
      0xb9, // LD B,#B9
      0x68 // LD L,B
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    expect(s.l).toBe(0xb9);

    m.shouldKeepRegisters("L, B");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("LD L,C", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x0e,
      0xb9, // LD C,#B9
      0x69 // LD L,C
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    expect(s.l).toBe(0xb9);

    m.shouldKeepRegisters("L, C");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("LD L,D", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x16,
      0xb9, // LD D,#B9
      0x6a // LD L,D
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    expect(s.l).toBe(0xb9);

    m.shouldKeepRegisters("L, D");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("LD L,E", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x1e,
      0xb9, // LD E,#B9
      0x6b // LD L,E
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    expect(s.l).toBe(0xb9);

    m.shouldKeepRegisters("L, E");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("LD L,H", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x26,
      0xb9, // LD H,#B9
      0x6c // LD L,H
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    expect(s.l).toBe(0xb9);

    m.shouldKeepRegisters("L, H");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("LD L,L", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0x6d // LD L,L
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

  it("LD L,(HL)", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x21,
      0x00,
      0x10, // LD HL,#1000
      0x6e // LD L,(HL)
    ]);
    m.memory[0x1000] = 0xb9;

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    expect(s.l).toBe(0xb9);

    m.shouldKeepRegisters("L, HL");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(17);
  });

  it("LD L,A", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0xb9, // LD A,#B9
      0x6f // LD L,A
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    expect(s.l).toBe(0xb9);

    m.shouldKeepRegisters("L, A");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("LD (HL),B", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x21,
      0x00,
      0x10, // LD HL,#1000
      0x06,
      0xb9, // LD B,#B9
      0x70 // LD (HL),B
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    expect(m.memory[0x1000]).toBe(0xb9);
    m.shouldKeepRegisters("B, HL");
    m.shouldKeepMemory("1000");

    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(24);
  });

  it("LD (HL),C", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x21,
      0x00,
      0x10, // LD HL,#1000
      0x0e,
      0xb9, // LD C,#B9
      0x71 // LD (HL),C
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    expect(m.memory[0x1000]).toBe(0xb9);
    m.shouldKeepRegisters("C, HL");
    m.shouldKeepMemory("1000");

    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(24);
  });

  it("LD (HL),D", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x21,
      0x00,
      0x10, // LD HL,#1000
      0x16,
      0xb9, // LD D,#B9
      0x72 // LD (HL),D
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    expect(m.memory[0x1000]).toBe(0xb9);
    m.shouldKeepRegisters("D, HL");
    m.shouldKeepMemory("1000");

    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(24);
  });

  it("LD (HL),E", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x21,
      0x00,
      0x10, // LD HL,#1000
      0x1e,
      0xb9, // LD E,#B9
      0x73 // LD (HL),E
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    expect(m.memory[0x1000]).toBe(0xb9);
    m.shouldKeepRegisters("E, HL");
    m.shouldKeepMemory("1000");

    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(24);
  });

  it("LD (HL),H", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x21,
      0x10,
      0x22, // LD HL,#2210
      0x74 // LD (HL),H
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    expect(m.memory[0x2210]).toBe(0x22);
    m.shouldKeepRegisters("HL");
    m.shouldKeepMemory("2210");

    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(17);
  });

  it("LD (HL),L", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x21,
      0x22,
      0x10, // LD HL,1022H
      0x75 // LD (HL),L
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    expect(m.memory[0x1022]).toBe(0x22);
    m.shouldKeepRegisters("HL");
    m.shouldKeepMemory("1022");

    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(17);
  });

  it("HALT", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilHalt);
    m.initCode([
      0x76 // HALT
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    expect(s.signals & Z80CpuSignals.Halted).toBe(Z80CpuSignals.Halted);
    m.shouldKeepRegisters();
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0000);
    expect(s.tacts).toBe(4);
  });

  it("LD (HL),A", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x21,
      0x00,
      0x10, // LD HL,#1000
      0x3e,
      0xb9, // LD A,#B9
      0x77 // LD (HL),A
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    expect(m.memory[0x1000]).toBe(0xb9);
    m.shouldKeepRegisters("A, HL");
    m.shouldKeepMemory("1000");

    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(24);
  });

  it("LD A,B", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x06,
      0xb9, // LD B,#B9
      0x78 // LD A,B
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    expect(s.a).toBe(0xb9);

    m.shouldKeepRegisters("A, B");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("LD A,C", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x0e,
      0xb9, // LD C,#B9
      0x79 // LD A,C
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    expect(s.a).toBe(0xb9);

    m.shouldKeepRegisters("A, C");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("LD A,D", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x16,
      0xb9, // LD D,#B9
      0x7a // LD A,D
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    expect(s.a).toBe(0xb9);

    m.shouldKeepRegisters("A, D");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("LD A,E", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x1e,
      0xb9, // LD E,#B9
      0x7b // LD A,E
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    expect(s.a).toBe(0xb9);

    m.shouldKeepRegisters("A, E");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("LD A,H", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x26,
      0xb9, // LD H,#B9
      0x7c // LD A,H
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    expect(s.a).toBe(0xb9);

    m.shouldKeepRegisters("A, H");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("LD A,(HL)", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x21,
      0x00,
      0x10, // LD HL,#1000
      0x7e // LD A,(HL)
    ]);
    m.memory[0x1000] = 0xb9;

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    expect(s.a).toBe(0xb9);

    m.shouldKeepRegisters("A, HL");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(17);
  });

  it("LD A,L", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x2e,
      0xb9, // LD L,#B9
      0x7d // LD A,L
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    expect(s.a).toBe(0xb9);

    m.shouldKeepRegisters("A, L");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });
});
