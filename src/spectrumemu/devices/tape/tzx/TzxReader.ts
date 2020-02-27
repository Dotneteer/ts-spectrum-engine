import { BinaryReader } from "../../../utils/BinaryReader";
import { TzxDataBlockBase } from "./TzxDataBlockBase";
import { TzxCswRecordingDataBlock } from "./TzxCswRecordingDataBlock";
import { TzxC64TurboTapeDataBlock } from "./TzxC64TurboTapeDataBlock";
import { TzxC64RomTypeDataBlock } from "./TzxC64RomTypeDataBlock";
import { TzxDirectRecordingDataBlock } from "./TzxDirectRecordingDataBlock";
import { TzxGeneralizedDataBlock } from "./TzxGeneralizedDataBlock";
import { TzxGroupStartDataBlock } from "./TzxGroupStartDataBlock";
import { TzxGroupEndDataBlock } from "./TzxGroupEndDataBlock";
import { TzxJumpDataBlock } from "./TzxJumpDataBlock";
import { TzxLoopStartDataBlock } from "./TzxLoopStartDataBlock";
import { TzxLoopEndDataBlock } from "./TzxLoopEndDataBlock";
import { TzxCallSequenceDataBlock } from "./TzxCallSequenceDataBlock";
import { TzxMessageDataBlock } from "./TzxMessageDataBlock";
import { TzxArchiveInfoDataBlock } from "./TzxArchiveInfoDataBlock";
import { TzxHardwareInfoDataBlock } from "./TzxHardwareInfoDataBlock";
import { TzxEmulationInfoDataBlock } from "./TzxEmulationInfoDataBlock";
import { TzxCustomInfoDataBlock } from "./TzxCustomInfoDataBlock";
import { TzxGlueDataBlock } from "./TzxGlueDataBlock";
import { TzxHeader } from "./TzxHeader";
import { TzxStandardSpeedDataBlock } from "./TzxStandardSpeedDataBlock";
import { TzxTurboSpeedDataBlock } from "./TzxTurboSpeedDataBlock";
import { TzxPureToneDataBlock } from "./TzxPureToneDataBlock";
import { TzxPulseSequenceDataBlock } from "./TzxPulseSequenceDataBlock";
import { TzxPureDataBlock } from "./TzxPureDataBlock";
import { TzxSilenceDataBlock } from "./TzxSilenceDataBlock";
import { TzxReturnFromSequenceDataBlock } from "./TzxReturnFromSequenceDataBlock";
import { TzxSelectDataBlock } from "./TzxSelectDataBlock";
import { TzxStopTheTape48DataBlock } from "./TzxStopTheTape48DataBlock";
import { TzxSetSignalLevelDataBlock } from "./TzxSetSignalLevelDataBlock";
import { TzxTextDescriptionDataBlock } from "./TzxTextDescriptionDataBlock";
import { TzxSnapshotBlock } from "./TzxSnapshotBlock";
import { TzxDeprecatedDataBlockBase } from "./TzxDeprecatedDataBlockBase";

const DataBlockTypes = new Map<number, () => TzxDataBlockBase>(
[
    [0x10, () => new TzxStandardSpeedDataBlock()],
    [0x11, () => new TzxTurboSpeedDataBlock()],
    [0x12, () => new TzxPureToneDataBlock()],
    [0x13, () => new TzxPulseSequenceDataBlock()],
    [0x14, () => new TzxPureDataBlock()],
    [0x15, () => new TzxDirectRecordingDataBlock()],
    [0x16, () => new TzxC64RomTypeDataBlock()],
    [0x17, () => new TzxC64TurboTapeDataBlock()],
    [0x18, () => new TzxCswRecordingDataBlock()],
    [0x19, () => new TzxGeneralizedDataBlock()],
    [0x20, () => new TzxSilenceDataBlock()],
    [0x21, () => new TzxGroupStartDataBlock()],
    [0x22, () => new TzxGroupEndDataBlock()],
    [0x23, () => new TzxJumpDataBlock()],
    [0x24, () => new TzxLoopStartDataBlock()],
    [0x25, () => new TzxLoopEndDataBlock()],
    [0x26, () => new TzxCallSequenceDataBlock()],
    [0x27, () => new TzxReturnFromSequenceDataBlock()],
    [0x28, () => new TzxSelectDataBlock()],
    [0x2A, () => new TzxStopTheTape48DataBlock()],
    [0x2B, () => new TzxSetSignalLevelDataBlock()],
    [0x30, () => new TzxTextDescriptionDataBlock()],
    [0x31, () => new TzxMessageDataBlock()],
    [0x32, () => new TzxArchiveInfoDataBlock()],
    [0x33, () => new TzxHardwareInfoDataBlock()],
    [0x34, () => new TzxEmulationInfoDataBlock()],
    [0x35, () => new TzxCustomInfoDataBlock()],
    [0x40, () => new TzxSnapshotBlock()],
    [0x5A, () => new TzxGlueDataBlock()],
]);

/**
 * This class reads a TZX file
 */
export class TzxReader {
    private readonly _reader: BinaryReader;

    /**
     * Data blocks of this TZX file
     */
    readonly dataBlocks: Array<TzxDataBlockBase>;

    /**
     * Major version number of the file
     */
    majorVersion = 0;

    /**
     * Minor version number of the file
     */
    minorVersion = 0;

    /**
     * Initializes the player from the specified reader
     * @param reader Reader to use with the player
     */
    constructor(reader: BinaryReader) {
        this._reader = reader;
        this.dataBlocks = [];
    }

    /**
     * Reads in the content of the TZX file so that it can be played
     * @returns True, if read was successful; otherwise, false
     */
    readContent(): boolean {
        const header = new TzxHeader();
        try {
            header.readFrom(this._reader);
            if (!header.isValid) {
                throw new Error("Invalid TZX header");
            }
            this.majorVersion = header.majorVersion;
            this.minorVersion = header.minorVersion;

            while (this._reader.Position !== this._reader.Length) {
                const blockType = this._reader.ReadByte();
                const type = DataBlockTypes.get(blockType);
                if (!type) {
                    throw new Error(`Unkonwn TZX block type: ${blockType}`);
                }

                try {
                    const block = type();
                    if (block.isDeprecated()) {
                        (block as TzxDeprecatedDataBlockBase).readThrough(this._reader);
                    } else {
                        block.readFrom(this._reader);
                    }
                    this.dataBlocks.push(block);
                }
                catch (err) {
                    throw new Error(`Cannot read TZX data block ${type}.`);
                }
            }
            return true;
        }
        catch {
            // --- This exception is intentionally ignored
            return false;
        }
    }
}