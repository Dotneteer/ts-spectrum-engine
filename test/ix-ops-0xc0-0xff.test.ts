import "mocha";
import * as expect from "expect";
import { Z80TestMachine, RunMode } from "./Z80TestMachine";
import { FlagsSetMask } from "../src/spectrumemu/cpu/FlagsSetMask";

describe("Z80 CPU - IX-indexed c0-ff", () => {
  it("RET NZ", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilHalt);
    m.initCode([
      0x3e,
      0x16, // LD A,#16
      0xcd,
      0x06,
      0x00, // CALL #0006
      0x76, // HALT
      0xb7, // OR A
      0xdd,
      0xc0, // RET NZ
      0x3e,
      0x24, // LD A,#24
      0xc9 // RET
    ]);
    m.cpu.getTestSupport().setSP(0x0000);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x16);
    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory("FFFE-FFFF");

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(47);
  });

  it("RET NZ does not return when Z", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilHalt);
    m.initCode([
      0x3e,
      0x00, // LD A,#00
      0xcd,
      0x06,
      0x00, // CALL #0006
      0x76, // HALT
      0xb7, // OR A
      0xdd,
      0xc0, // RET NZ
      0x3e,
      0x24, // LD A,#24
      0xc9 // RET
    ]);
    m.cpu.getTestSupport().setSP(0x0000);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x24);
    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory("FFFE-FFFF");

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(58);
  });

  it("POP BC", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x21,
      0x52,
      0x23, // LD HL,#2352
      0xe5, // PUSH HL
      0xdd,
      0xc1 // POP BC
    ]);
    m.cpu.getTestSupport().setSP(0x0000);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.bc).toBe(0x2352);
    m.shouldKeepRegisters("HL, BC");
    m.shouldKeepMemory("FFFE-FFFF");

    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(35);
  });

  it("JP NZ,NN", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilHalt);
    m.initCode([
      0x3e,
      0x16, // LD A,#16
      0xb7, // OR A
      0xdd,
      0xc2,
      0x08,
      0x00, // JP NZ,#0008
      0x76, // HALT
      0x3e,
      0xaa, // LD A,#AA
      0x76 // HALT
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0xaa);
    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x000a);
    expect(s.tacts).toBe(36);
  });

  it("JP NZ,NN does not jump when Z", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilHalt);
    m.initCode([
      0x3e,
      0x00, // LD A,#00
      0xb7, // OR A
      0xdd,
      0xc2,
      0x08,
      0x00, // JP NZ,#0007
      0x76, // HALT
      0x3e,
      0xaa, // LD A,#AA
      0x76 // HALT
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x00);
    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0007);
    expect(s.tacts).toBe(29);
  });

  it("JP NN", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilHalt);
    m.initCode([
      0x3e,
      0x16, // LD A,#16
      0xdd,
      0xc3,
      0x07,
      0x00, // JP #0006
      0x76, // HALT
      0x3e,
      0xaa, // LD A,#AA
      0x76 // HALT
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0xaa);
    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0009);
    expect(s.tacts).toBe(32);
  });

  it("CALL NZ,NN", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilHalt);
    m.initCode([
      0x3e,
      0x16, // LD A,#16
      0xb7, // OR A
      0xdd,
      0xc4,
      0x08,
      0x00, // CALL NZ,#0008
      0x76, // HALT
      0x3e,
      0x24, // LD A,#24
      0xc9 // RET
    ]);
    m.cpu.getTestSupport().setSP(0x0000);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x24);
    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory("FFFE-FFFF");

    expect(s.pc).toBe(0x0007);
    expect(s.tacts).toBe(53);
  });

  it("CALL NZ,NN does not call when Z", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilHalt);
    m.initCode([
      0x3e,
      0x00, // LD A,#00
      0xb7, // OR A
      0xdd,
      0xc4,
      0x08,
      0x00, // CALL NZ,#0008
      0x76, // HALT
      0x3e,
      0x24, // LD A,#24
      0xc9 // RET
    ]);
    m.cpu.getTestSupport().setSP(0x0000);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x00);
    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory("FFFE-FFFF");

    expect(s.pc).toBe(0x0007);
    expect(s.tacts).toBe(29);
  });

  it("PUSH BC", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x01,
      0x52,
      0x23, // LD BC,#2352
      0xdd,
      0xc5, // PUSH BC
      0xe1 // POP HL
    ]);
    m.cpu.getTestSupport().setSP(0x0000);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.hl).toBe(0x2352);
    m.shouldKeepRegisters("HL, BC");
    m.shouldKeepMemory("FFFE-FFFF");

    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(35);
  });

  it("ADD A,N works as expected", () => {
    // --- Arrange
    var m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x12, // LD A,#12
      0xdd,
      0xc6,
      0x24 // ADD,#24
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

    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(18);
  });

  it("RST #00", () => {
    // --- Arrange
    var m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0x3e,
      0x12, // LD A,#12
      0xdd,
      0xc7 // RST #00
    ]);
    m.cpu.getTestSupport().setSP(0x0000);

    // --- Act
    m.run();
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x12);
    expect(s.sp).toBe(0xfffe);
    expect(s.pc).toBe(0);
    expect(m.memory[0xfffe]).toBe(0x04);
    expect(m.memory[0xffff]).toBe(0x00);
    m.shouldKeepRegisters("SP");
    m.shouldKeepMemory("FFFE-FFFF");

    expect(s.tacts).toBe(22);
  });

  it("RET Z", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilHalt);
    m.initCode([
      0x3e,
      0x16, // LD A,#16
      0xcd,
      0x06,
      0x00, // CALL #0006
      0x76, // HALT
      0xaf, // XOR A
      0xdd,
      0xc8, // RET Z
      0x3e,
      0x24, // LD A,#24
      0xc9 // RET
    ]);
    m.cpu.getTestSupport().setSP(0x0000);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x00);
    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory("FFFE-FFFF");

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(47);
  });

  it("RET Z does not return when NZ", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilHalt);
    m.initCode([
      0x3e,
      0x16, // LD A,#16
      0xcd,
      0x06,
      0x00, // CALL #0006
      0x76, // HALT
      0xb7, // OR A
      0xdd,
      0xc8, // RET Z
      0x3e,
      0x24, // LD A,#24
      0xc9 // RET
    ]);
    m.cpu.getTestSupport().setSP(0x0000);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x24);
    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory("FFFE-FFFF");

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(58);
  });

  it("RET", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilHalt);
    m.initCode([
      0x3e,
      0x16, // LD A,#16
      0xcd,
      0x06,
      0x00, // CALL #0006
      0x76, // HALT
      0xdd,
      0xc9 // RET
    ]);
    m.cpu.getTestSupport().setSP(0x0000);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory("FFFE-FFFF");

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(42);
  });

  it("JP Z,NN works as expected", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilHalt);
    m.initCode([
      0x3e,
      0x16, // LD A,#16
      0xaf, // XOR A
      0xdd,
      0xca,
      0x08,
      0x00, // JP Z,#0008
      0x76, // HALT
      0x3e,
      0xaa, // LD A,#AA
      0x76 // HALT
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0xaa);
    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x000a);
    expect(s.tacts).toBe(36);
  });

  it("JP Z,NN does not jump when NZ", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilHalt);
    m.initCode([
      0x3e,
      0x16, // LD A,#16
      0xb7, // OR A
      0xdd,
      0xca,
      0x08,
      0x00, // JP Z,#0008
      0x76, // HALT
      0x3e,
      0xaa, // LD A,#AA
      0x76 // HALT
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x16);
    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0007);
    expect(s.tacts).toBe(29);
  });

  it("CALL Z,NN", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilHalt);
    m.initCode([
      0x3e,
      0x16, // LD A,#16
      0xaf, // XOR A
      0xdd,
      0xcc,
      0x08,
      0x00, // CALL Z,#0007
      0x76, // HALT
      0x3e,
      0x24, // LD A,#24
      0xc9 // RET
    ]);
    m.cpu.getTestSupport().setSP(0x0000);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x24);
    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory("FFFE-FFFF");

    expect(s.pc).toBe(0x0007);
    expect(s.tacts).toBe(53);
  });

  it("CALL Z,NN does not call when NZ", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilHalt);
    m.initCode([
      0x3e,
      0x16, // LD A,#16
      0xb7, // OR A
      0xdd,
      0xcc,
      0x08,
      0x00, // CALL Z,#0008
      0x76, // HALT
      0x3e,
      0x24, // LD A,#24
      0xc9 // RET
    ]);
    m.cpu.getTestSupport().setSP(0x0000);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x16);
    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory("FFFE-FFFF");

    expect(s.pc).toBe(0x0007);
    expect(s.tacts).toBe(29);
  });

  it("CALL NN", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilHalt);
    m.initCode([
      0x3e,
      0x16, // LD A,#16
      0xdd,
      0xcd,
      0x07,
      0x00, // CALL #0007
      0x76, // HALT
      0x3e,
      0xa3, // LD A,#A3
      0xc9 // RET
    ]);
    m.cpu.getTestSupport().setSP(0x0000);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0xa3);
    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory("FFFE-FFFF");

    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(49);
  });

  it("ADC A,N", () => {
    // --- Arrange
    var m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x12, // LD A,#12
      0x37, // SCF
      0xdd,
      0xce,
      0x24 // ADC,#24
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    expect(s.a).toBe(0x37);
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeFalsy();
    expect(s.hFlag).toBeFalsy();
    expect(s.pvFlag).toBeFalsy();
    expect(s.cFlag).toBeFalsy();

    expect(s.nFlag).toBeFalsy();

    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(22);
  });

  it("RST #08", () => {
    // --- Arrange
    var m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0x3e,
      0x12, // LD A,#12
      0xdd,
      0xcf // RST #08
    ]);
    m.cpu.getTestSupport().setSP(0x0000);

    // --- Act
    m.run();
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x12);
    expect(s.sp).toBe(0xfffe);
    expect(s.pc).toBe(8);
    expect(m.memory[0xfffe]).toBe(0x04);
    expect(m.memory[0xffff]).toBe(0x00);
    m.shouldKeepRegisters("SP");
    m.shouldKeepMemory("FFFE-FFFF");

    expect(s.tacts).toBe(22);
  });

  it("RET NC", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilHalt);
    m.initCode([
      0x3e,
      0x16, // LD A,#16
      0xcd,
      0x06,
      0x00, // CALL #0006
      0x76, // HALT
      0xa7, // AND A
      0xdd,
      0xd0, // RET NC
      0x3e,
      0x24, // LD A,#24
      0xc9 // RET
    ]);
    m.cpu.getTestSupport().setSP(0x0000);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x16);
    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory("FFFE-FFFF");

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(47);
  });

  it("RET NC does not return when C", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilHalt);
    m.initCode([
      0x3e,
      0x16, // LD A,#16
      0xcd,
      0x06,
      0x00, // CALL #0006
      0x76, // HALT
      0x37, // SCF
      0xdd,
      0xd0, // RET NC
      0x3e,
      0x24, // LD A,#24
      0xc9 // RET
    ]);
    m.cpu.getTestSupport().setSP(0x0000);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x24);
    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory("FFFE-FFFF");

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(58);
  });

  it("POP DE", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x21,
      0x52,
      0x23, // LD HL,#2352
      0xe5, // PUSH HL
      0xdd,
      0xd1 // POP DE
    ]);
    m.cpu.getTestSupport().setSP(0x0000);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.de).toBe(0x2352);
    m.shouldKeepRegisters("HL, DE");
    m.shouldKeepMemory("FFFE-FFFF");

    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(35);
  });

  it("JP NC,NN", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilHalt);
    m.initCode([
      0x3e,
      0x16, // LD A,#16
      0xa7, // AND A
      0xdd,
      0xd2,
      0x08,
      0x00, // JP NC,#0008
      0x76, // HALT
      0x3e,
      0xaa, // LD A,#AA
      0x76 // HALT
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0xaa);
    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x000a);
    expect(s.tacts).toBe(36);
  });

  it("JP NC,NN does not jump when C", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilHalt);
    m.initCode([
      0x3e,
      0x16, // LD A,#16
      0x37, // SCF
      0xdd,
      0xd2,
      0x08,
      0x00, // JP NC,#0008
      0x76, // HALT
      0x3e,
      0xaa, // LD A,#AA
      0x76 // HALT
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x16);
    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0007);
    expect(s.tacts).toBe(29);
  });

  it("OUT (N),A works as expected", () => {
    // --- Arrange
    var m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x16, // LD A,#16
      0xdd,
      0xd3,
      0x28 // OUT (#28),A
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    expect(m.ioAccessLog.length).toBe(1);
    expect(m.ioAccessLog[0].Address).toBe(0x1628);
    expect(m.ioAccessLog[0].Value).toBe(0x16);
    expect(m.ioAccessLog[0].IsOutput).toBeTruthy();

    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(22);
  });

  it("CALL NC,NN", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilHalt);
    m.initCode([
      0x3e,
      0x16, // LD A,#16
      0xa7, // AND A
      0xdd,
      0xd4,
      0x08,
      0x00, // CALL NC,#0008
      0x76, // HALT
      0x3e,
      0x24, // LD A,#24
      0xc9 // RET
    ]);
    m.cpu.getTestSupport().setSP(0x0000);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x24);
    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory("FFFE-FFFF");

    expect(s.pc).toBe(0x0007);
    expect(s.tacts).toBe(53);
  });

  it("CALL NC,NN does not call when C", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilHalt);
    m.initCode([
      0x3e,
      0x16, // LD A,#16
      0x37, // SCF
      0xdd,
      0xd4,
      0x08,
      0x00, // CALL NC,#0008
      0x76, // HALT
      0x3e,
      0x24, // LD A,#24
      0xc9 // RET
    ]);
    m.cpu.getTestSupport().setSP(0x0000);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x16);
    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory("FFFE-FFFF");

    expect(s.pc).toBe(0x0007);
    expect(s.tacts).toBe(29);
  });

  it("PUSH DE", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x11,
      0x52,
      0x23, // LD DE,#2352
      0xdd,
      0xd5, // PUSH DE
      0xe1 // POP HL
    ]);
    m.cpu.getTestSupport().setSP(0x0000);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.hl).toBe(0x2352);
    m.shouldKeepRegisters("HL, DE");
    m.shouldKeepMemory("FFFE-FFFF");

    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(35);
  });

  it("SUB N", () => {
    // --- Arrange
    var m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x36, // LD A,#36
      0xdd,
      0xd6,
      0x24 // SUB #24
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

    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(18);
  });

  it("RST #10", () => {
    // --- Arrange
    var m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0x3e,
      0x12, // LD A,#12
      0xdd,
      0xd7 // RST #10
    ]);
    m.cpu.getTestSupport().setSP(0x0000);

    // --- Act
    m.run();
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x12);
    expect(s.sp).toBe(0xfffe);
    expect(s.pc).toBe(0x10);
    expect(m.memory[0xfffe]).toBe(0x04);
    expect(m.memory[0xffff]).toBe(0x00);
    m.shouldKeepRegisters("SP");
    m.shouldKeepMemory("FFFE-FFFF");

    expect(s.tacts).toBe(22);
  });

  it("RET C", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilHalt);
    m.initCode([
      0x3e,
      0x16, // LD A,#16
      0xcd,
      0x06,
      0x00, // CALL #0006
      0x76, // HALT
      0x37, // SCF
      0xdd,
      0xd8, // RET C
      0x3e,
      0x24, // LD A,#24
      0xc9 // RET
    ]);
    m.cpu.getTestSupport().setSP(0x0000);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x16);
    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory("FFFE-FFFF");

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(47);
  });

  it("RET C does not return when NC", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilHalt);
    m.initCode([
      0x3e,
      0x16, // LD A,#16
      0xcd,
      0x06,
      0x00, // CALL #0006
      0x76, // HALT
      0xb7, // OR A
      0xdd,
      0xd8, // RET C
      0x3e,
      0x24, // LD A,#24
      0xc9 // RET
    ]);
    m.cpu.getTestSupport().setSP(0x0000);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x24);
    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory("FFFE-FFFF");

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(58);
  });

  it("EXX works as expected", () => {
    // --- Arrange
    var m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xdd,
      0xd9 // EXX
    ]);
    const sup = m.cpu.getTestSupport();
    sup.setBC(0xabcd);
    sup.set_BC_(0x2345);
    sup.setDE(0xbcde);
    sup.set_DE_(0x3456);
    sup.setHL(0xcdef);
    sup.set_HL_(0x4567);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.bc).toBe(0x2345);
    expect(s._bc_).toBe(0xabcd);
    expect(s.de).toBe(0x3456);
    expect(s._de_).toBe(0xbcde);
    expect(s.hl).toBe(0x4567);
    expect(s._hl_).toBe(0xcdef);

    m.shouldKeepMemory();
    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(8);
  });

  it("JP C,NN", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilHalt);
    m.initCode([
      0x3e,
      0x16, // LD A,#16
      0x37, // SCF
      0xdd,
      0xda,
      0x08,
      0x00, // JP C,#0008
      0x76, // HALT
      0x3e,
      0xaa, // LD A,#AA
      0x76 // HALT
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0xaa);
    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x000a);
    expect(s.tacts).toBe(36);
  });

  it("JP C,NN does not jump when NC", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilHalt);
    m.initCode([
      0x3e,
      0x16, // LD A,#16
      0xb7, // OR A
      0xdd,
      0xda,
      0x08,
      0x00, // JP C,#0008
      0x76, // HALT
      0x3e,
      0xaa, // LD A,#AA
      0x76 // HALT
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x16);
    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0007);
    expect(s.tacts).toBe(29);
  });

  it("IN A,(N)", () => {
    // --- Arrange
    var m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x16, // LD A,#16
      0xdd,
      0xdb,
      0x34 // IN A,(#34)
    ]);
    m.ioInputSequence.push(0xd5);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    expect(s.a).toBe(0x00d5);
    expect(m.ioAccessLog.length).toBe(1);
    expect(m.ioAccessLog[0].Address).toBe(0x1634);
    expect(m.ioAccessLog[0].Value).toBe(0xd5);
    expect(m.ioAccessLog[0].IsOutput).toBeFalsy();

    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(22);
  });

  it("CALL C,NN", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilHalt);
    m.initCode([
      0x3e,
      0x16, // LD A,#16
      0x37, // SCF
      0xdd,
      0xdc,
      0x08,
      0x00, // CALL C,#0008
      0x76, // HALT
      0x3e,
      0x24, // LD A,#24
      0xc9 // RET
    ]);
    m.cpu.getTestSupport().setSP(0x0000);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x24);
    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory("FFFE-FFFF");

    expect(s.pc).toBe(0x0007);
    expect(s.tacts).toBe(53);
  });

  it("CALL C,NN does not call when NC", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilHalt);
    m.initCode([
      0x3e,
      0x16, // LD A,#16
      0xb7, // OR A
      0xdd,
      0xdc,
      0x08,
      0x00, // CALL C,#0008
      0x76, // HALT
      0x3e,
      0x24, // LD A,#24
      0xc9 // RET
    ]);
    m.cpu.getTestSupport().setSP(0x0000);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x16);
    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory("FFFE-FFFF");

    expect(s.pc).toBe(0x0007);
    expect(s.tacts).toBe(29);
  });

  it("SBC N", () => {
    // --- Arrange
    var m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x36, // LD A,36H
      0x37, // SCF
      0xdd,
      0xde,
      0x24 // SBC 24H
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

    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(22);
  });

  it("RST #18", () => {
    // --- Arrange
    var m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0x3e,
      0x12, // LD A,#12
      0xdd,
      0xdf // RST #18
    ]);
    m.cpu.getTestSupport().setSP(0x0000);

    // --- Act
    m.run();
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x12);
    expect(s.sp).toBe(0xfffe);
    expect(s.pc).toBe(0x18);
    expect(m.memory[0xfffe]).toBe(0x04);
    expect(m.memory[0xffff]).toBe(0x00);
    m.shouldKeepRegisters("SP");
    m.shouldKeepMemory("FFFE-FFFF");

    expect(s.tacts).toBe(22);
  });

  it("RET PO", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilHalt);
    m.initCode([
      0x3e,
      0x2a, // LD A,#2A
      0xcd,
      0x06,
      0x00, // CALL #0006
      0x76, // HALT
      0x87, // ADD A
      0xdd,
      0xe0, // RET PO
      0x3e,
      0x24, // LD A,#24
      0xc9 // RET
    ]);
    m.cpu.getTestSupport().setSP(0x0000);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x54);
    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory("FFFE-FFFF");

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(47);
  });

  it("RET PO does not return when PE", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilHalt);
    m.initCode([
      0x3e,
      0x88, // LD A,#88
      0xcd,
      0x06,
      0x00, // CALL #0006
      0x76, // HALT
      0x87, // ADD A
      0xdd,
      0xe0, // RET PO
      0x3e,
      0x24, // LD A,#24
      0xc9 // RET
    ]);
    m.cpu.getTestSupport().setSP(0x0000);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x24);
    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory("FFFE-FFFF");

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(58);
  });

  it("POP IX works as expected", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x21,
      0x52,
      0x23, // LD HL,#2352
      0xe5, // PUSH HL
      0xdd,
      0xe1 // POP IX
    ]);
    m.cpu.getTestSupport().setSP(0x0000);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.ix).toBe(0x2352);

    m.shouldKeepRegisters("IX, HL");
    m.shouldKeepMemory("FFFE-FFFF");

    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(35);
  });

  it("JP PO,NN", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilHalt);
    m.initCode([
      0x3e,
      0x2a, // LD A,#2A
      0x87, // ADD A
      0xdd,
      0xe2,
      0x08,
      0x00, // JP PO,#0008
      0x76, // HALT
      0x3e,
      0xaa, // LD A,#AA
      0x76 // HALT
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0xaa);
    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x000a);
    expect(s.tacts).toBe(36);
  });

  it("JP PO,NN does not jump when PE", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilHalt);
    m.initCode([
      0x3e,
      0x88, // LD A,#88
      0x87, // ADD A
      0xdd,
      0xe2,
      0x08,
      0x00, // JP PO,#0008
      0x76, // HALT
      0x3e,
      0xaa, // LD A,#AA
      0x76 // HALT
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x10);
    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0007);
    expect(s.tacts).toBe(29);
  });

  it("EX (SP),IX", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x31,
      0x00,
      0x10, // LD SP, #1000
      0xdd,
      0x21,
      0x34,
      0x12, // LD IX,#1234
      0xdd,
      0xe3 // EX (SP),IX
    ]);
    m.cpu.getTestSupport().setSP(0x000);
    m.memory[0x1000] = 0x78;
    m.memory[0x1001] = 0x56;

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.ix).toBe(0x5678);
    expect(m.memory[0x1000]).toBe(0x34);
    expect(m.memory[0x1001]).toBe(0x12);

    m.shouldKeepRegisters("SP, IX");
    m.shouldKeepMemory("1000-1001");

    expect(s.pc).toBe(0x0009);
    expect(s.tacts).toBe(47);
  });

  it("CALL PO,NN", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilHalt);
    m.initCode([
      0x3e,
      0x2a, // LD A,#2A
      0x87, // ADD A
      0xdd,
      0xe4,
      0x08,
      0x00, // CALL PO,#0008
      0x76, // HALT
      0x3e,
      0x24, // LD A,#24
      0xc9 // RET
    ]);
    m.cpu.getTestSupport().setSP(0x0000);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x24);
    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory("FFFE-FFFF");

    expect(s.pc).toBe(0x0007);
    expect(s.tacts).toBe(53);
  });

  it("CALL PO,NN does not call when PE", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilHalt);
    m.initCode([
      0x3e,
      0x88, // LD A,#88
      0x87, // ADD A
      0xdd,
      0xe4,
      0x08,
      0x00, // CALL PO,#0008
      0x76, // HALT
      0x3e,
      0x24, // LD A,#24
      0xc9 // RET
    ]);
    m.cpu.getTestSupport().setSP(0x0000);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x10);
    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory("FFFE-FFFF");

    expect(s.pc).toBe(0x0007);
    expect(s.tacts).toBe(29);
  });

  it("PUSH IX", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0xdd,
      0x21,
      0x52,
      0x23, // LD IX,#2352
      0xdd,
      0xe5, // PUSH IX
      0xc1 // POP BC
    ]);
    m.cpu.getTestSupport().setSP(0x0000);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.bc).toBe(0x2352);

    m.shouldKeepRegisters("IX, BC");
    m.shouldKeepMemory("FFFE-FFFF");

    expect(s.pc).toBe(0x0007);
    expect(s.tacts).toBe(39);
  });

  it("AND N", () => {
    // --- Arrange
    var m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x12, // LD A,#12
      0xdd,
      0xe6,
      0x23 // AND #23
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    expect(s.a).toBe(0x02);
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeFalsy();
    expect(s.hFlag).toBeTruthy();
    expect(s.pvFlag).toBeFalsy();
    expect(s.cFlag).toBeFalsy();

    expect(s.nFlag).toBeFalsy();

    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(18);
  });

  it("RST #20", () => {
    // --- Arrange
    var m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0x3e,
      0x12, // LD A,#12
      0xdd,
      0xe7 // RST #20
    ]);
    m.cpu.getTestSupport().setSP(0x0000);

    // --- Act
    m.run();
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x12);
    expect(s.sp).toBe(0xfffe);
    expect(s.pc).toBe(0x20);
    expect(m.memory[0xfffe]).toBe(0x04);
    expect(m.memory[0xffff]).toBe(0x00);
    m.shouldKeepRegisters("SP");
    m.shouldKeepMemory("FFFE-FFFF");

    expect(s.tacts).toBe(22);
  });

  it("RET PE", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilHalt);
    m.initCode([
      0x3e,
      0x88, // LD A,#88
      0xcd,
      0x06,
      0x00, // CALL #0006
      0x76, // HALT
      0x87, // ADD A
      0xdd,
      0xe8, // RET PE
      0x3e,
      0x24, // LD A,#24
      0xc9 // RET
    ]);
    m.cpu.getTestSupport().setSP(0x0000);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x10);
    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory("FFFE-FFFF");

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(47);
  });

  it("RET PE does not return when PO", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilHalt);
    m.initCode([
      0x3e,
      0x2a, // LD A,#2A
      0xcd,
      0x06,
      0x00, // CALL #0006
      0x76, // HALT
      0x87, // ADD A
      0xdd,
      0xe8, // RET PE
      0x3e,
      0x24, // LD A,#24
      0xc9 // RET
    ]);
    m.cpu.getTestSupport().setSP(0x0000);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x24);
    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory("FFFE-FFFF");

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(58);
  });

  it("JP (IX)", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0xdd,
      0x21,
      0x00,
      0x10, // LD IX, #1000
      0xdd,
      0xe9 // JP (IX)
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    m.shouldKeepRegisters("IX");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x1000);
    expect(s.tacts).toBe(22);
  });

  it("JP PE,NN", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilHalt);
    m.initCode([
      0x3e,
      0x88, // LD A,#88
      0x87, // ADD A
      0xdd,
      0xea,
      0x08,
      0x00, // JP PE,#0008
      0x76, // HALT
      0x3e,
      0xaa, // LD A,#AA
      0x76 // HALT
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0xaa);
    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x000a);
    expect(s.tacts).toBe(36);
  });

  it("JP PE,NN does not jump when PO", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilHalt);
    m.initCode([
      0x3e,
      0x2a, // LD A,#2A
      0x87, // ADD A
      0xdd,
      0xea,
      0x08,
      0x00, // JP PE,#0008
      0x76, // HALT
      0x3e,
      0xaa, // LD A,#AA
      0x76 // HALT
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x54);
    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0007);
    expect(s.tacts).toBe(29);
  });

  it("EX DE,HL", () => {
    // --- Arrange
    var m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x21,
      0x34,
      0x12, // LD HL,1234H
      0x11,
      0x78,
      0x56, // LD DE,5678H
      0xdd,
      0xeb // EX DE,HL
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    expect(s.de).toBe(0x1234);
    expect(s.hl).toBe(0x5678);

    m.shouldKeepRegisters("HL, DE");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0008);
    expect(s.tacts).toBe(28);
  });

  it("CALL PE,NN", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilHalt);
    m.initCode([
      0x3e,
      0x88, // LD A,#88
      0x87, // ADD A
      0xdd,
      0xec,
      0x08,
      0x00, // CALL PE,#0008
      0x76, // HALT
      0x3e,
      0x24, // LD A,#24
      0xc9 // RET
    ]);
    m.cpu.getTestSupport().setSP(0x0000);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x24);
    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory("FFFE-FFFF");

    expect(s.pc).toBe(0x0007);
    expect(s.tacts).toBe(53);
  });

  it("CALL PE,NN does not call when PO", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilHalt);
    m.initCode([
      0x3e,
      0x2a, // LD A,#2A
      0x87, // ADD A
      0xdd,
      0xec,
      0x08,
      0x00, // CALL PE,#0008
      0x76, // HALT
      0x3e,
      0x24, // LD A,#24
      0xc9 // RET
    ]);
    m.cpu.getTestSupport().setSP(0x0000);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x54);
    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory("FFFE-FFFF");

    expect(s.pc).toBe(0x0007);
    expect(s.tacts).toBe(29);
  });

  it("XOR N", () => {
    // --- Arrange
    var m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x12, // LD A,#12
      0xdd,
      0xee,
      0x23 // XOR #23
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    expect(s.a).toBe(0x31);
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeFalsy();
    expect(s.hFlag).toBeFalsy();
    expect(s.pvFlag).toBeFalsy();
    expect(s.cFlag).toBeFalsy();

    expect(s.nFlag).toBeFalsy();

    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(18);
  });

  it("RST #28 works as expected", () => {
    // --- Arrange
    var m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0x3e,
      0x12, // LD A,#12
      0xdd,
      0xef // RST #28
    ]);
    m.cpu.getTestSupport().setSP(0x0000);

    // --- Act
    m.run();
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x12);
    expect(s.sp).toBe(0xfffe);
    expect(s.pc).toBe(0x28);
    expect(m.memory[0xfffe]).toBe(0x04);
    expect(m.memory[0xffff]).toBe(0x00);
    m.shouldKeepRegisters("SP");
    m.shouldKeepMemory("FFFE-FFFF");

    expect(s.tacts).toBe(22);
  });

  it("RET P", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilHalt);
    m.initCode([
      0x3e,
      0x32, // LD A,#32
      0xcd,
      0x06,
      0x00, // CALL #0006
      0x76, // HALT
      0x87, // ADD A
      0xdd,
      0xf0, // RET P
      0x3e,
      0x24, // LD A,#24
      0xc9 // RET
    ]);
    m.cpu.getTestSupport().setSP(0x0000);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x64);
    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory("FFFE-FFFF");

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(47);
  });

  it("RET P does not return when M", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilHalt);
    m.initCode([
      0x3e,
      0xc0, // LD A,#C0
      0xcd,
      0x06,
      0x00, // CALL #0006
      0x76, // HALT
      0x87, // ADD A
      0xdd,
      0xf0, // RET P
      0x3e,
      0x24, // LD A,#24
      0xc9 // RET
    ]);
    m.cpu.getTestSupport().setSP(0x0000);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x24);
    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory("FFFE-FFFF");

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(58);
  });

  it("POP AF", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x01,
      0x52,
      0x23, // LD BC,#2352
      0xc5, // PUSH BC
      0xdd,
      0xf1 // POP AF
    ]);
    m.cpu.getTestSupport().setSP(0x0000);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.af).toBe(0x2352);
    m.shouldKeepRegisters("AF, BC");
    m.shouldKeepMemory("FFFE-FFFF");

    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(35);
  });

  it("JP P,NN", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilHalt);
    m.initCode([
      0x3e,
      0x32, // LD A,#32
      0x87, // ADD A
      0xdd,
      0xf2,
      0x08,
      0x00, // JP P,#0008
      0x76, // HALT
      0x3e,
      0xaa, // LD A,#AA
      0x76 // HALT
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0xaa);
    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x000a);
    expect(s.tacts).toBe(36);
  });

  it("JP P,NN does not jump when M", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilHalt);
    m.initCode([
      0x3e,
      0xc0, // LD A,#C0
      0x87, // ADD A
      0xdd,
      0xf2,
      0x08,
      0x00, // JP P,#0008
      0x76, // HALT
      0x3e,
      0xaa, // LD A,#AA
      0x76 // HALT
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x80);
    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0007);
    expect(s.tacts).toBe(29);
  });

  it("DI", () => {
    // --- Arrange
    var m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xdd,
      0xf3 // DI
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    expect(s.iff1).toBeFalsy();
    expect(s.iff2).toBeFalsy();

    m.shouldKeepRegisters();
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(8);
  });

  it("CALL P,NN works as expected", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilHalt);
    m.initCode([
      0x3e,
      0x32, // LD A,#32
      0x87, // ADD A
      0xdd,
      0xf4,
      0x08,
      0x00, // CALL P,#0008
      0x76, // HALT
      0x3e,
      0x24, // LD A,#24
      0xc9 // RET
    ]);
    m.cpu.getTestSupport().setSP(0x0000);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x24);
    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory("FFFE-FFFF");

    expect(s.pc).toBe(0x0007);
    expect(s.tacts).toBe(53);
  });

  it("CALL P,NN does not call when M", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilHalt);
    m.initCode([
      0x3e,
      0xc0, // LD A,#C0
      0x87, // ADD A
      0xdd,
      0xf4,
      0x08,
      0x00, // CALL P,#0008
      0x76, // HALT
      0x3e,
      0x24, // LD A,#24
      0xc9 // RET
    ]);
    m.cpu.getTestSupport().setSP(0x0000);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x80);
    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory("FFFE-FFFF");

    expect(s.pc).toBe(0x0007);
    expect(s.tacts).toBe(29);
  });

  it("PUSH AF", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0xdd,
      0xf5, // PUSH AF
      0xc1 // POP BC
    ]);
    const sup = m.cpu.getTestSupport();
    sup.setSP(0x0000);
    sup.setAF(0x3456);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.bc).toBe(0x3456);
    m.shouldKeepRegisters("BC");
    m.shouldKeepMemory("FFFE-FFFF");

    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(25);
  });

  it("OR N", () => {
    // --- Arrange
    var m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0x3e,
      0x12, // LD A,#12
      0xdd,
      0xf6,
      0x23 // OR #23
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    expect(s.a).toBe(0x33);
    expect(s.sFlag).toBeFalsy();
    expect(s.zFlag).toBeFalsy();
    expect(s.hFlag).toBeFalsy();
    expect(s.pvFlag).toBeTruthy();
    expect(s.cFlag).toBeFalsy();

    expect(s.nFlag).toBeFalsy();

    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(18);
  });

  it("RST #30", () => {
    // --- Arrange
    var m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0x3e,
      0x12, // LD A,#12
      0xdd,
      0xf7 // RST #30
    ]);
    m.cpu.getTestSupport().setSP(0x0000);

    // --- Act
    m.run();
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x12);
    expect(s.sp).toBe(0xfffe);
    expect(s.pc).toBe(0x30);
    expect(m.memory[0xfffe]).toBe(0x04);
    expect(m.memory[0xffff]).toBe(0x00);
    m.shouldKeepRegisters("SP");
    m.shouldKeepMemory("FFFE-FFFF");

    expect(s.tacts).toBe(22);
  });

  it("RET M", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilHalt);
    m.initCode([
      0x3e,
      0xc0, // LD A,#C0
      0xcd,
      0x06,
      0x00, // CALL #0006
      0x76, // HALT
      0x87, // ADD A
      0xdd,
      0xf8, // RET M
      0x3e,
      0x24, // LD A,#24
      0xc9 // RET
    ]);
    m.cpu.getTestSupport().setSP(0x0000);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x80);
    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory("FFFE-FFFF");

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(47);
  });

  it("RET M does not return when M", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilHalt);
    m.initCode([
      0x3e,
      0x32, // LD A,#32
      0xcd,
      0x06,
      0x00, // CALL #0006
      0x76, // HALT
      0x87, // ADD A
      0xdd,
      0xf8, // RET M
      0x3e,
      0x24, // LD A,#24
      0xc9 // RET
    ]);
    m.cpu.getTestSupport().setSP(0x0000);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x24);
    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory("FFFE-FFFF");

    expect(s.pc).toBe(0x0005);
    expect(s.tacts).toBe(58);
  });

  it("LD SP, IX works as expected", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0xdd,
      0x21,
      0x00,
      0x10, // LD IX,#1000
      0xdd,
      0xf9 // LD SP,IX
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.sp).toBe(0x1000);

    m.shouldKeepRegisters("IX, SP");
    m.shouldKeepMemory("FFFE-FFFF");

    expect(s.pc).toBe(0x0006);
    expect(s.tacts).toBe(24);
  });

  it("JP M,NN", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilHalt);
    m.initCode([
      0x3e,
      0xc0, // LD A,#C0
      0x87, // ADD A
      0xdd,
      0xfa,
      0x08,
      0x00, // JP M,#0008
      0x76, // HALT
      0x3e,
      0xaa, // LD A,#AA
      0x76 // HALT
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0xaa);
    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x000a);
    expect(s.tacts).toBe(36);
  });

  it("JP M,NN does not jump when P", () => {
    // --- Arrange
    const m = new Z80TestMachine(RunMode.UntilHalt);
    m.initCode([
      0x3e,
      0x32, // LD A,#32
      0x87, // ADD A
      0xdd,
      0xfa,
      0x08,
      0x00, // JP M,#0008
      0x76, // HALT
      0x3e,
      0xaa, // LD A,#AA
      0x76 // HALT
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x64);
    m.shouldKeepRegisters("AF");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0007);
    expect(s.tacts).toBe(29);
  });

  it("EI works as expected", () => {
    // --- Arrange
    var m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0xdd,
      0xfb // EI
    ]);

    // --- Act
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();

    expect(s.iff1).toBeTruthy();
    expect(s.iff2).toBeTruthy();
    expect(s.isInterruptBlocked).toBeTruthy();

    m.shouldKeepRegisters();
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0002);
    expect(s.tacts).toBe(8);
  });

  it("CP N", () => {
    // --- Arrange
    var m = new Z80TestMachine(RunMode.UntilEnd);
    m.initCode([
      0xdd,
      0xfe,
      0x24 // CP 24H
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

    m.shouldKeepRegisters("F");
    m.shouldKeepMemory();

    expect(s.pc).toBe(0x0003);
    expect(s.tacts).toBe(11);
  });

  it("RST #38", () => {
    // --- Arrange
    var m = new Z80TestMachine(RunMode.OneInstruction);
    m.initCode([
      0x3e,
      0x12, // LD A,#12
      0xdd,
      0xff // RST #38
    ]);
    m.cpu.getTestSupport().setSP(0x0000);

    // --- Act
    m.run();
    m.run();

    // --- Assert
    const s = m.cpu.getCpuState();
    expect(s.a).toBe(0x12);
    expect(s.sp).toBe(0xfffe);
    expect(s.pc).toBe(0x38);
    expect(m.memory[0xfffe]).toBe(0x04);
    expect(m.memory[0xffff]).toBe(0x00);
    m.shouldKeepRegisters("SP");
    m.shouldKeepMemory("FFFE-FFFF");

    expect(s.tacts).toBe(22);
  });
});
