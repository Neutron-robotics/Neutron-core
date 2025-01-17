import { IRos2Action } from '../../../../../models/ros2/ros2';
import { INodeBuilder, NodeMessage } from '../../../INeutronNode';
import { RosNode } from './RosNode';

export interface ActionNodeSpecifics {
  action: IRos2Action;
}

export class ActionNode extends RosNode {
  public isInput: boolean = false;

  public readonly type = 'action';

  private readonly specifics: ActionNodeSpecifics;

  constructor(builder: INodeBuilder<ActionNodeSpecifics>) {
    super(builder);
    this.specifics = builder.specifics;
  }

  protected process = async (message: NodeMessage) =>
    // Not implemented
    message;

  protected verifyInput = (_: NodeMessage) => {};

  public override onContextMount = () => {};
}
