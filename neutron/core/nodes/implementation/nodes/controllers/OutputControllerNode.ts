import { BaseNode } from '../../../BaseNode';
import { NodeMessage } from '../../../INeutronNode';

export abstract class OutputControllerNode extends BaseNode {
  public isInput: boolean = false;

    public abstract readonly type: string;

    public isControllerNode = true;

    protected process = async (message: NodeMessage) => message;

    protected verifyInput = (_: NodeMessage) => {};
}
