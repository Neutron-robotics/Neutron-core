import { IRos2Service } from "../../../../../models/ros2/ros2";
import NeutronNodeComputeError from "../../../../errors/NeutronNodeError";
import { INodeBuilder, NodeMessage } from "../../../INeutronNode";
import RosNode from "./RosNode";

export interface ServiceNodeSpecifics {
  service: IRos2Service;
}

class ServiceNode extends RosNode {
  public isInput: boolean = false;
  public readonly type = "service";
  private readonly specifics: ServiceNodeSpecifics;

  constructor(builder: INodeBuilder<ServiceNodeSpecifics>) {
    super(builder);
    this.specifics = builder.specifics;
  }

  protected process = async (message: NodeMessage) => {
    const result = await this.rosContext?.request({
      methodType: this.specifics.service.name,
      format: this.specifics.service.serviceType.name,
      payload: message.payload,
    });

    if (!result)
      throw new NeutronNodeComputeError(
        `Service node ${this.id} did not send a response`
      );

    return {
      payload: result.result,
    };
  };

  protected verifyInput = (_: NodeMessage) => {};

  public override onContextMount = () => {};
}

export default ServiceNode;
