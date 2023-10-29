import { IRos2System } from "../../neutron/models/ros2/ros2";

const mockRosSystem: IRos2System = {
  _id: "randomId",
  name: "test system",
  topics: [
    {
      _id: "qiehiehi",
      name: "test topic",
      messageType: {
        _id: "dddidi",
        name: "std/position",
        fields: [
          {
            fieldname: "x",
            fieldtype: "number",
          },
          {
            fieldname: "y",
            fieldtype: "number",
          },
        ],
      },
    },
  ],
  publishers: [],
  subscribers: [],
  actions: [],
  services: [],
  robotId: "sooososos",
};

export { mockRosSystem };
