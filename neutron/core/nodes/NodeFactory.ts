import { NeutronGraphError } from '../errors/NeutronGraphError';
import { BaseNode } from './BaseNode';
import { INodeBuilder, NeutronNodeDB } from './INeutronNode';
import {
  BaseControllerNode,
  CameraControllerNode,
  CameraFrameNode,
  MJPEGCameraNode
} from './implementation/nodes/controllers';
import {
  ChangeNode,
  DebugNode,
  DelayNode,
  ErrorNode,
  FilterNode,
  FunctionNode,
  InfoNode,
  InjectNode,
  RangeNode,
  SuccessNode,
  SwitchNode,
  TemplateNode,
  WarningNode,
  ActionNode,
  PublisherNode
} from './implementation/nodes';

import ServiceNode from './implementation/nodes/ros2/ServiceNode';
import SubscriberNode from './implementation/nodes/ros2/SubscribeNode';

export const inputNodesSet = new Set(['inject', 'subscriber', 'basecontroller', 'cameracontroller']);

export class NodeFactory {
  static nodeFactory: Record<string, (builder: INodeBuilder<any>) => BaseNode> = {
    inject: (builder: INodeBuilder<any>) => new InjectNode(builder),
    change: (builder: INodeBuilder<any>) => new ChangeNode(builder),
    debug: (builder: INodeBuilder<any>) => new DebugNode(builder),
    info: (builder: INodeBuilder<any>) => new InfoNode(builder),
    warning: (builder: INodeBuilder<any>) => new WarningNode(builder),
    error: (builder: INodeBuilder<any>) => new ErrorNode(builder),
    success: (builder: INodeBuilder<any>) => new SuccessNode(builder),
    function: (builder: INodeBuilder<any>) => new FunctionNode(builder),
    switch: (builder: INodeBuilder<any>) => new SwitchNode(builder),
    delay: (builder: INodeBuilder<any>) => new DelayNode(builder),
    filter: (builder: INodeBuilder<any>) => new FilterNode(builder),
    range: (builder: INodeBuilder<any>) => new RangeNode(builder),
    template: (builder: INodeBuilder<any>) => new TemplateNode(builder),
    mjpegcamera: (builder: INodeBuilder<any>) => new MJPEGCameraNode(builder),
    basecontroller: (builder: INodeBuilder<any>) => new BaseControllerNode(builder),
    publisher: (builder: INodeBuilder<any>) => new PublisherNode(builder),
    action: (builder: INodeBuilder<any>) => new ActionNode(builder),
    subscriber: (builder: INodeBuilder<any>) => new SubscriberNode(builder),
    service: (builder: INodeBuilder<any>) => new ServiceNode(builder),
    cameracontroller: (builder: INodeBuilder<any>) => new CameraControllerNode(builder),
    cameraframe: (builder: INodeBuilder<any>) => new CameraFrameNode(builder)
  };

  static createNode(nodeDb: NeutronNodeDB): BaseNode {
    const key = nodeDb.data.name.toLowerCase().replaceAll(' ', '');
    const factory = NodeFactory.nodeFactory[key];

    const builder: INodeBuilder<any> = {
      id: nodeDb.id,
      type: nodeDb.data.name,
      position: nodeDb.position,
      specifics: nodeDb.data.specifics
    };

    if (factory) {
      return factory(builder);
    }
    throw new NeutronGraphError(
      `Failed to build the graph, unknown node ${builder.type}`
    );
  }
}
