import "mocha";
import * as expect from "expect";
import { Z80TestMachine, RunMode } from "./Z80TestMachine";
import { Z80CpuSignals } from "../src/spectrumemu/cpu/cpu-z80";

describe("Z80 CPU - IY-indexed 40-7f", () => {
  it("LD B,B", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xfd,
      0x40 // LD B,B
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

  it("LD B,C", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x0e,
      0xb9, // LD C,#B9
      0xfd,
      0x41 // LD B,C
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    expect(s.b).toBe(0xb9);

    m.shouldKeepRegisters("B, C");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(15);
  });

  it("LD B,D", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x16,
      0xb9, // LD D,#B9
      0xfd,
      0x42 // LD B,D
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    expect(s.b).toBe(0xb9);

    m.shouldKeepRegisters("B, D");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(15);
  });

  it("LD B,E", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x1e,
      0xb9, // LD E,#B9
      0xfd,
      0x43 // LD B,E
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    expect(s.b).toBe(0xb9);

    m.shouldKeepRegisters("B, E");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(15);
  });

  it("LD B,YH", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0xfd,
      0x21,
      0x9a,
      0x78, // LD IY,#789A
      0xfd,
      0x44 // LD B,YH
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.b).toBe(0x78);

    m.shouldKeepRegisters("IY, B");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(22);
  });

  it("LD B,XL", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0xfd,
      0x21,
      0x9a,
      0x78, // LD IY,#789A
      0xfd,
      0x45 // LD B,XL
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.b).toBe(0x9a);

    m.shouldKeepRegisters("IY, B");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(22);
  });

  it("LD B,(IY+D)", () => {
    // --- Arrange
    const OFFS = 0x54;
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0xfd,
      0x46,
      OFFS // LD B,(IY+#54)
    ]);
    m.cpu.getTestSupport().setIY(0x1000);
    m.memory[0x1000 + OFFS] = 0x7c;

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.b).toBe(0x7c);

    m.shouldKeepRegisters("B");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(19);
  });

  it("LD B,A", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0xb9, // LD A,#B9
      0xfd,
      0x47 // LD B,A
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    expect(s.b).toBe(0xb9);

    m.shouldKeepRegisters("B, A");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(15);
  });

  it("LD C,B", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x06,
      0xb9, // LD B,#B9
      0xfd,
      0x48 // LD C,B
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    expect(s.c).toBe(0xb9);

    m.shouldKeepRegisters("C, B");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(15);
  });

  it("LD C,C", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xfd,
      0x49 // LD C,C
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

  it("LD C,D", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x16,
      0xb9, // LD D,#B9
      0xfd,
      0x4a // LD C,D
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    expect(s.c).toBe(0xb9);

    m.shouldKeepRegisters("C, D");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(15);
  });

  it("LD C,E", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x1e,
      0xb9, // LD E,#B9
      0xfd,
      0x4b // LD C,E
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    expect(s.c).toBe(0xb9);

    m.shouldKeepRegisters("C, E");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(15);
  });

  it("LD C,YH", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0xfd,
      0x21,
      0x9a,
      0x78, // LD IY,#789A
      0xfd,
      0x4c // LD C,YH
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.c).toBe(0x78);

    m.shouldKeepRegisters("IY, C");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(22);
  });

  it("LD C,XL", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0xfd,
      0x21,
      0x9a,
      0x78, // LD IY,#789A
      0xfd,
      0x4d // LD C,XL
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.c).toBe(0x9a);

    m.shouldKeepRegisters("IY, C");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(22);
  });

  it("LD C,(IY+D)", () => {
    // --- Arrange
    const OFFS = 0x54;
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0xfd,
      0x4e,
      0x54 // LD C,(IY+#54)
    ]);
    m.cpu.getTestSupport().setIY(0x1000);
    m.memory[0x1000 + OFFS] = 0x7c;

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.c).toBe(0x7c);

    m.shouldKeepRegisters("C");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(19);
  });

  it("LD C,A", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0xb9, // LD A,#B9
      0xfd,
      0x4f // LD C,A
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    expect(s.c).toBe(0xb9);

    m.shouldKeepRegisters("C, A");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(15);
  });

  it("LD D,B", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x06,
      0xb9, // LD B,#B9
      0xfd,
      0x50 // LD D,B
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    expect(s.d).toBe(0xb9);

    m.shouldKeepRegisters("D, B");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(15);
  });

  it("LD D,C", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x0e,
      0xb9, // LD C,#B9
      0xfd,
      0x51 // LD D,C
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    expect(s.d).toBe(0xb9);

    m.shouldKeepRegisters("D, C");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(15);
  });

  it("LD D,D", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xfd,
      0x52 // LD D,D
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

  it("LD D,E", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x1e,
      0xb9, // LD E,#B9
      0xfd,
      0x53 // LD D,E
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    expect(s.d).toBe(0xb9);

    m.shouldKeepRegisters("D, E");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(15);
  });

  it("LD D,YH", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0xfd,
      0x21,
      0x9a,
      0x78, // LD IY,#789A
      0xfd,
      0x54 // LD D,YH
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.d).toBe(0x78);

    m.shouldKeepRegisters("IY, D");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(22);
  });

  it("LD D,XL", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0xfd,
      0x21,
      0x9a,
      0x78, // LD IY,#789A
      0xfd,
      0x55 // LD D,XL
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.d).toBe(0x9a);

    m.shouldKeepRegisters("IY, D");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(22);
  });

  it("LD D,(IY+d)", () => {
    // --- Arrange
    const OFFS = 0x54;
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0xfd,
      0x56,
      0x54 // LD D,(IY+#54)
    ]);
    m.cpu.getTestSupport().setIY(0x1000);
    m.memory[0x1000 + OFFS] = 0x7c;

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.d).toBe(0x7c);

    m.shouldKeepRegisters("D");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(19);
  });

  it("LD D,A", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0xb9, // LD A,#B9
      0xfd,
      0x57 // LD D,A
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    expect(s.d).toBe(0xb9);

    m.shouldKeepRegisters("D, A");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(15);
  });

  it("LD E,B", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x06,
      0xb9, // LD B,#B9
      0xfd,
      0x58 // LD E,B
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    expect(s.e).toBe(0xb9);

    m.shouldKeepRegisters("E, B");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(15);
  });

  it("LD E,C", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x0e,
      0xb9, // LD C,#B9
      0xfd,
      0x59 // LD E,C
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    expect(s.e).toBe(0xb9);

    m.shouldKeepRegisters("E, C");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(15);
  });

  it("LD E,D", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x16,
      0xb9, // LD D,#B9
      0xfd,
      0x5a // LD E,D
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    expect(s.e).toBe(0xb9);

    m.shouldKeepRegisters("E, D");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(15);
  });

  it("LD E,E", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xfd,
      0x5b // LD E,E
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

  it("LD E,YH", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0xfd,
      0x21,
      0x9a,
      0x78, // LD IY,#789A
      0xfd,
      0x5c // LD E,YH
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.e).toBe(0x78);

    m.shouldKeepRegisters("IY, E");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(22);
  });

  it("LD E,XL", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0xfd,
      0x21,
      0x9a,
      0x78, // LD IY,#789A
      0xfd,
      0x5d // LD E,XL
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.e).toBe(0x9a);

    m.shouldKeepRegisters("IY, E");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(22);
  });

  it("LD E,(IY+d)", () => {
    // --- Arrange
    const OFFS = 0x54;
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0xfd,
      0x5e,
      0x54 // LD E,(IY+#54)
    ]);
    m.cpu.getTestSupport().setIY(0x1000);
    m.memory[0x1000 + OFFS] = 0x7c;

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.e).toBe(0x7c);

    m.shouldKeepRegisters("E");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(19);
  });

  it("LD E,A", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0xb9, // LD A,#B9
      0xfd,
      0x5f // LD E,A
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    expect(s.e).toBe(0xb9);

    m.shouldKeepRegisters("E, A");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(15);
  });

  it("LD YH,B", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0xfd,
      0x60 // LD YH,B
    ]);
    let s = m.cpu.getCpuState();
    let sup = m.cpu.getTestSupport();
    sup.setIY(0xaaaa);
    sup.setB(0x55);

    // --- Act
    m.run();

    // --- Assert
    s = m.cpu.getCpuState();
    expect(s.yh).toBe(0x55);

    m.shouldKeepRegisters("IY");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(8);
  });

  it("LD YH,C", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0xfd,
      0x61 // LD YH,C
    ]);
    let s = m.cpu.getCpuState();
    let sup = m.cpu.getTestSupport();
    sup.setIY(0xaaaa);
    sup.setC(0x55);

    // --- Act
    m.run();

    // --- Assert
    s = m.cpu.getCpuState();
    expect(s.yh).toBe(0x55);

    m.shouldKeepRegisters("IY");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(8);
  });

  it("LD YH,D", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0xfd,
      0x62 // LD YH,D
    ]);
    let s = m.cpu.getCpuState();
    let sup = m.cpu.getTestSupport();
    sup.setIY(0xaaaa);
    sup.setD(0x55);

    // --- Act
    m.run();

    // --- Assert
    s = m.cpu.getCpuState();
    expect(s.yh).toBe(0x55);

    m.shouldKeepRegisters("IY");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(8);
  });

  it("LD YH,E", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0xfd,
      0x63 // LD YH,B
    ]);
    let s = m.cpu.getCpuState();
    let sup = m.cpu.getTestSupport();
    sup.setIY(0xaaaa);
    sup.setE(0x55);

    // --- Act
    m.run();

    // --- Assert
    s = m.cpu.getCpuState();
    expect(s.yh).toBe(0x55);

    m.shouldKeepRegisters("IY");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(8);
  });

  it("LD YH,YH", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xfd,
      0x54 // LD YH,YH
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

  it("LD YH,XL", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0xfd,
      0x65 // LD YH,XL
    ]);
    let s = m.cpu.getCpuState();
    let sup = m.cpu.getTestSupport();
    sup.setIY(0xaabb);

    // --- Act
    m.run();

    // --- Assert
    s = m.cpu.getCpuState();
    expect(s.iy).toBe(0xbbbb);

    m.shouldKeepRegisters("IY");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(8);
  });

  it("LD H,(IY+d)", () => {
    // --- Arrange
    const OFFS = 0x54;
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0xfd,
      0x66,
      0x54 // LD H,(IY+#54)
    ]);
    m.cpu.getTestSupport().setIY(0x1000);
    m.memory[0x1000 + OFFS] = 0x7c;

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.h).toBe(0x7c);

    m.shouldKeepRegisters("H");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(19);
  });

  it("LD YH,A", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0xfd,
      0x67 // LD YH,A
    ]);
    let s = m.cpu.getCpuState();
    let sup = m.cpu.getTestSupport();
    sup.setIY(0xaaaa);
    sup.setA(0x55);

    // --- Act
    m.run();

    // --- Assert
    s = m.cpu.getCpuState();
    expect(s.yh).toBe(0x55);

    m.shouldKeepRegisters("IY");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(8);
  });

  it("LD XL,B", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0xfd,
      0x68 // LD XL,B
    ]);
    let s = m.cpu.getCpuState();
    let sup = m.cpu.getTestSupport();
    sup.setIY(0xaaaa);
    sup.setB(0x55);

    // --- Act
    m.run();

    // --- Assert
    s = m.cpu.getCpuState();
    expect(s.yl).toBe(0x55);

    m.shouldKeepRegisters("IY");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(8);
  });

  it("LD XL,C", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0xfd,
      0x69 // LD XL,C
    ]);
    let s = m.cpu.getCpuState();
    let sup = m.cpu.getTestSupport();
    sup.setIY(0xaaaa);
    sup.setC(0x55);

    // --- Act
    m.run();

    // --- Assert
    s = m.cpu.getCpuState();
    expect(s.yl).toBe(0x55);

    m.shouldKeepRegisters("IY");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(8);
  });

  it("LD XL,D", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0xfd,
      0x6a // LD XL,D
    ]);
    let s = m.cpu.getCpuState();
    let sup = m.cpu.getTestSupport();
    sup.setIY(0xaaaa);
    sup.setD(0x55);

    // --- Act
    m.run();

    // --- Assert
    s = m.cpu.getCpuState();
    expect(s.yl).toBe(0x55);

    m.shouldKeepRegisters("IY");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(8);
  });

  it("LD XL,E", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0xfd,
      0x6b // LD XL,E
    ]);
    let s = m.cpu.getCpuState();
    let sup = m.cpu.getTestSupport();
    sup.setIY(0xaaaa);
    sup.setE(0x55);

    // --- Act
    m.run();

    // --- Assert
    s = m.cpu.getCpuState();
    expect(s.yl).toBe(0x55);

    m.shouldKeepRegisters("IY");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(8);
  });

  it("LD XL,YH", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0xfd,
      0x6c // LD XL,YH
    ]);
    let s = m.cpu.getCpuState();
    let sup = m.cpu.getTestSupport();
    sup.setIY(0xaabb);

    // --- Act
    m.run();

    // --- Assert
    s = m.cpu.getCpuState();
    expect(s.iy).toBe(0xaaaa);

    m.shouldKeepRegisters("IY");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(8);
  });

  it("LD XL,XL", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xfd,
      0x5d // LD XL,XL
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

  it("LD L,(IY+d)", () => {
    // --- Arrange
    const OFFS = 0x54;
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0xfd,
      0x6e,
      OFFS // LD L,(IY+#54)
    ]);
    m.cpu.getTestSupport().setIY(0x1000);
    m.memory[0x1000 + OFFS] = 0x7c;

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.l).toBe(0x7c);

    m.shouldKeepRegisters("L");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(19);
  });

  it("LD XL,A", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0xfd,
      0x6f // LD XL,A
    ]);
    let s = m.cpu.getCpuState();
    let sup = m.cpu.getTestSupport();
    sup.setIY(0xaaaa);
    sup.setA(0x55);

    // --- Act
    m.run();

    // --- Assert
    s = m.cpu.getCpuState();
    expect(s.yl).toBe(0x55);

    m.shouldKeepRegisters("IY");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(8);
  });

  it("LD (IY+d),B", () => {
    // --- Arrange
    const OFFS = 0x52;
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0xfd,
      0x70,
      0x52 // LD (IY+#52),B
    ]);
    let s = m.cpu.getCpuState();
    let sup = m.cpu.getTestSupport();
    sup.setIY(0x1000);
    sup.setB(0xa5);

    // --- Act
    m.run();

    // --- Assert
    s = m.cpu.getCpuState();
    expect(m.memory[s.iy + OFFS]).toBe(0xa5);

    m.shouldKeepRegisters();
    m.shouldKeepMemory("1052");

    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(19);
  });

  it("LD (IY+d),C", () => {
    // --- Arrange
    const OFFS = 0x52;
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0xfd,
      0x71,
      0x52 // LD (IY+#52),C
    ]);
    let s = m.cpu.getCpuState();
    let sup = m.cpu.getTestSupport();
    sup.setIY(0x1000);
    sup.setC(0xa5);

    // --- Act
    m.run();

    // --- Assert
    s = m.cpu.getCpuState();
    expect(m.memory[s.iy + OFFS]).toBe(0xa5);

    m.shouldKeepRegisters();
    m.shouldKeepMemory("1052");

    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(19);
  });

  it("LD (IY+d),D", () => {
    // --- Arrange
    const OFFS = 0x52;
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0xfd,
      0x72,
      0x52 // LD (IY+#52),D
    ]);
    let s = m.cpu.getCpuState();
    let sup = m.cpu.getTestSupport();
    sup.setIY(0x1000);
    sup.setD(0xa5);

    // --- Act
    m.run();

    // --- Assert
    s = m.cpu.getCpuState();
    expect(m.memory[s.iy + OFFS]).toBe(0xa5);

    m.shouldKeepRegisters();
    m.shouldKeepMemory("1052");

    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(19);
  });

  it("LD (IY+d),E", () => {
    // --- Arrange
    const OFFS = 0x52;
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0xfd,
      0x73,
      0x52 // LD (IY+#52),E
    ]);
    let s = m.cpu.getCpuState();
    let sup = m.cpu.getTestSupport();
    sup.setIY(0x1000);
    sup.setE(0xa5);

    // --- Act
    m.run();

    // --- Assert
    s = m.cpu.getCpuState();
    expect(m.memory[s.iy + OFFS]).toBe(0xa5);

    m.shouldKeepRegisters();
    m.shouldKeepMemory("1052");

    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(19);
  });

  it("LD (IY+d),H", () => {
    // --- Arrange
    const OFFS = 0x52;
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0xfd,
      0x74,
      0x52 // LD (IY+#52),H
    ]);
    let s = m.cpu.getCpuState();
    let sup = m.cpu.getTestSupport();
    sup.setIY(0x1000);
    sup.setH(0xa5);

    // --- Act
    m.run();

    // --- Assert
    s = m.cpu.getCpuState();
    expect(m.memory[s.iy + OFFS]).toBe(0xa5);

    m.shouldKeepRegisters();
    m.shouldKeepMemory("1052");

    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(19);
  });

  it("LD (IY+d),L", () => {
    // --- Arrange
    const OFFS = 0x52;
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0xfd,
      0x75,
      0x52 // LD (IY+#52),L
    ]);
    let s = m.cpu.getCpuState();
    let sup = m.cpu.getTestSupport();
    sup.setIY(0x1000);
    sup.setL(0xa5);

    // --- Act
    m.run();

    // --- Assert
    s = m.cpu.getCpuState();
    expect(m.memory[s.iy + OFFS]).toBe(0xa5);

    m.shouldKeepRegisters();
    m.shouldKeepMemory("1052");

    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(19);
  });

  it("HALT", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilHalt);
    m.initCode([
      0xfd,
      0x76 // HALT
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    expect(s.signals & Z80CpuSignals.Halted).toBe(Z80CpuSignals.Halted);
    m.shouldKeepRegisters();
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0001);
    expect(s.tacts).toBe(8);
  });

  it("LD (IY+d),A", () => {
    // --- Arrange
    const OFFS = 0x52;
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0xfd,
      0x77,
      0x52 // LD (IY+#52),E
    ]);
    let s = m.cpu.getCpuState();
    let sup = m.cpu.getTestSupport();
    sup.setIY(0x1000);
    sup.setA(0xa5);

    // --- Act
    m.run();

    // --- Assert
    s = m.cpu.getCpuState();
    expect(m.memory[s.iy + OFFS]).toBe(0xa5);

    m.shouldKeepRegisters();
    m.shouldKeepMemory("1052");

    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(19);
  });

  it("LD A,B", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x06,
      0xb9, // LD B,#B9
      0xfd,
      0x78 // LD A,B
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    expect(s.a).toBe(0xb9);

    m.shouldKeepRegisters("A, B");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(15);
  });

  it("LD A,C", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x0e,
      0xb9, // LD C,#B9
      0xfd,
      0x79 // LD A,C
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    expect(s.a).toBe(0xb9);

    m.shouldKeepRegisters("A, C");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(15);
  });

  it("LD A,D", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x16,
      0xb9, // LD D,#B9
      0xfd,
      0x7a // LD A,D
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    expect(s.a).toBe(0xb9);

    m.shouldKeepRegisters("A, D");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(15);
  });

  it("LD A,E", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x1e,
      0xb9, // LD E,#B9
      0xfd,
      0x7b // LD A,E
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    expect(s.a).toBe(0xb9);

    m.shouldKeepRegisters("A, E");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0004);
    expect(s.tacts).toBe(15);
  });

  it("LD A,YH", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0xfd,
      0x21,
      0x9a,
      0x78, // LD IY,#789A
      0xfd,
      0x7c // LD A,YH
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x78);

    m.shouldKeepRegisters("IY, A");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(22);
  });

  it("LD A,XL", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0xfd,
      0x21,
      0x9a,
      0x78, // LD IY,#789A
      0xfd,
      0x7d // LD A,XL
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x9a);

    m.shouldKeepRegisters("IY, A");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(22);
  });

  it("LD A,(IY+d)", () => {
    // --- Arrange
    const OFFS = 0x54;
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0xfd,
      0x7e,
      0x54 // LD A,(IY+#54)
    ]);
    m.cpu.getTestSupport().setIY(0x1000);
    m.memory[0x1000 + OFFS] = 0x7c;

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x7c);

    m.shouldKeepRegisters("A");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(19);
  });

  it("LD A,A", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0xfd,
      0x7f // LD A,A
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
});
