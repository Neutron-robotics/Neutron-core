import { v4 } from "uuid";
import { IRobotPart } from "../../models/robot";
import {
  IRos2ActionMessage,
  IRos2Message,
  IRos2PartSystem,
  IRos2ServiceMessage,
  IRos2System,
} from "../../models/ros2/ros2";

export const toPartSystem = (part: IRobotPart, system: IRos2System) => {
  const partSystem: IRos2PartSystem = {
    name: "",
    robotId: system.robotId,
    _id: v4(),
    topics: system.topics.filter(
      (e) => part.publishers.includes(e._id) || part.subscribers.includes(e._id)
    ),
    publishers: system.publishers.filter((e) =>
      part.publishers.includes(e._id)
    ),
    subscribers: system.subscribers.filter((e) =>
      part.subscribers.includes(e._id)
    ),
    services: system.services.filter((e) => part.services.includes(e._id)),
    actions: system.actions.filter((e) => part.actions.includes(e._id)),
    partId: part._id,
    actionTypes: [],
    messageTypes: [],
    serviceTypes: [],
  };
  partSystem.actionTypes = partSystem.actions.reduce<IRos2ActionMessage[]>(
    (acc, cur) => {
      if (!acc.includes(cur.actionType)) {
        acc.push(cur.actionType);
      }
      return acc;
    },
    []
  );

  partSystem.messageTypes = partSystem.topics.reduce<IRos2Message[]>(
    (acc, cur) => {
      if (!acc.includes(cur.messageType)) {
        acc.push(cur.messageType);
      }
      return acc;
    },
    []
  );

  partSystem.serviceTypes = partSystem.services.reduce<IRos2ServiceMessage[]>(
    (acc, cur) => {
      if (!acc.includes(cur.serviceType)) {
        acc.push(cur.serviceType);
      }
      return acc;
    },
    []
  );

  return partSystem;
};
