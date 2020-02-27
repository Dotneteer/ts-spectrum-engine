/**
 * This class represents the states of the virtual machine as 
 * managed by the SpectrumVmController
 */
export enum VmState {
    /**
     * The virtual machine has just been created, but has not run yet
     */
    None = 0,

    /**
     * The virtual machine is successfully started
     */
    Running = 1,

    /**
     * The pause request has been sent to the virtual machine, 
     * now it prepares to get paused
     */
    Pausing = 2,

    /**
     * The virtual machine has been paused
     */
    Paused = 3,

    /**
     * The stop request has been sent to the virtual machine, 
     * now it prepares to get stopped
     */
    Stopping = 4,

    /**
     * The virtual machine has been stopped
     */
    Stopped = 5
}