class NeutronNodeComputeError extends Error {
  public nodeId?: string;

  constructor(message: string, nodeId?: string) {
    super(message);
    this.name = 'NeutronNodeComputeError';
    this.nodeId = nodeId;
  }
}

export default NeutronNodeComputeError;
