import { BaseNode } from '../../../BaseNode';
import { INodeBuilder, NodeMessage } from '../../../INeutronNode';

export interface TemplateNodeSpecifics {
  propertyName: string;
  template: string;
}

export class TemplateNode extends BaseNode {
  public isInput: boolean = false;

  public readonly type = 'template';

  private readonly specifics: TemplateNodeSpecifics;

  constructor(builder: INodeBuilder<TemplateNodeSpecifics>) {
    super(builder);
    this.specifics = builder.specifics;
  }

  protected process = async (message: NodeMessage) => {
    let replaced = this.specifics.template.toString();

    for (const propertie in message.payload) {
      replaced = replaced.replaceAll(
        `{{${propertie}}}`,
        message.payload[propertie]
      );
    }

    return {
      payload: {
        ...message.payload,
        [this.specifics.propertyName]: replaced
      }
    };
  };

  protected verifyInput = (_: NodeMessage) => {};
}
