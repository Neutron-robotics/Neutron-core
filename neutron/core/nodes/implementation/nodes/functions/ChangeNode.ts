import { NeutronNodeComputeError } from '../../../../errors/NeutronNodeError';
import { BaseNode } from '../../../BaseNode';
import { INodeBuilder, NodeMessage, OutputNodeMessage } from '../../../INeutronNode';

export interface ChangeField {
  id: string;
  mode: 'define' | 'remove' | 'move';
  inputField: string;
  targetField?: string;
}

export interface ChangeNodeSpecifics {
  fields: ChangeField[];
}

export class ChangeNode extends BaseNode {
  public isInput: boolean = false;

  public readonly type = 'Change';

  private readonly specifics: ChangeNodeSpecifics;

  constructor(builder: INodeBuilder<ChangeNodeSpecifics>) {
    super(builder);
    this.specifics = builder.specifics;
  }

  protected process = async (message: NodeMessage): Promise<OutputNodeMessage> => {
    const modifiedPayload = { ...message.payload };

    for (const field of this.specifics.fields) {
      switch (field.mode) {
        case 'define':
          if (!field.targetField) break;
          modifiedPayload[field.targetField] = modifiedPayload[field.inputField];
          break;
        case 'remove':
          delete modifiedPayload[field.inputField];
          break;
        case 'move':
          if (
            field.targetField
            && modifiedPayload.hasOwnProperty(field.inputField)
          ) {
            modifiedPayload[field.targetField] = modifiedPayload[field.inputField];
            delete modifiedPayload[field.inputField];
          }
          break;
        default:
          throw new NeutronNodeComputeError(
            `Mode ${field.mode} is not supported`
          );
      }
    }

    return Promise.resolve({ payload: modifiedPayload });
  };

  protected verifyInput = (_: NodeMessage) => {};
}
