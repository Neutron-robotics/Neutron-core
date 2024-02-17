import { IDBObject } from '../common';

export interface IRos2System extends IDBObject {
  name: string;
  topics: IRos2Topic[];
  publishers: IRos2Publisher[];
  subscribers: IRos2Subscriber[];
  actions: IRos2Action[];
  services: IRos2Service[];
  robotId: string;
}

export interface IRos2PartSystem extends IRos2System {
  partId: string;
  messageTypes: IRos2Message[];
  serviceTypes: IRos2ServiceMessage[];
  actionTypes: IRos2ActionMessage[];
}

export interface IRos2Field {
  fieldtype: string;
  fieldname: string;
}

export interface IRos2ServiceMessage extends IDBObject {
  name: string;
  request: IRos2Field[];
  response: IRos2Field[];
}

export interface IRos2Message extends IDBObject {
  name: string;
  fields: IRos2Field[];
}

export interface IRos2ActionMessage extends IDBObject {
  name: string;
  goal: IRos2Field[];
  feedback: IRos2Field[];
  result: IRos2Field[];
}

export interface IRos2Topic extends IDBObject {
  name: string;
  messageType: IRos2Message;
}

export interface IRos2Subscriber extends IDBObject {
  name: string;
  topic: IRos2Topic;
}

export interface IRos2Service extends IDBObject {
  name: string;
  serviceType: IRos2ServiceMessage;
}

export interface IRos2Publisher extends IDBObject {
  name: string;
  topic: IRos2Topic;
  frequency: number;
}

export interface IRos2Action extends IDBObject {
  name: string;
  actionType: IRos2ActionMessage;
}

export interface CreateTopicModel {
  name: string;
  messageTypeId: string;
}

export interface CreatePublisherModel {
  name: string;
  topicId: string;
  frequency: number;
}

export interface CreateSubscriberModel {
  name: string;
  topicId: string;
}

export interface CreateActionModel {
  name: string;
  actionTypeId: string;
}

export interface CreateServiceModel {
  name: string;
  serviceTypeId: string;
}

export interface CreateMessageTypeModel {
  robotId: string;
  partId: string;
}

export interface Ros2SystemModel extends IDBObject {
  name: string;
  topics: string[];
  publishers: string[];
  subscribers: string[];
  actions: string[];
  services: string[];
  robotId: string;
}

export interface Ros2Field {
  fieldtype: string;
  fieldname: string;
}

export interface IMessageType extends IDBObject {
  name: string;
  fields: Ros2Field[];
}
