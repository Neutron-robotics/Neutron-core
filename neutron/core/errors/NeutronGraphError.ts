export class NeutronGraphError extends Error {
  public nodeId?: string;

  constructor(message: string, nodeId?: string) {
    super(message);
    this.name = 'NeutronGraphError';
    this.nodeId = nodeId;
  }
}
