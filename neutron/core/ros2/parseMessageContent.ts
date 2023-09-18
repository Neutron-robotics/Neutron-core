import { IRos2Field } from "../../models/ros2/ros2";

export function parseRos2MessageContent(fileContent: string): IRos2Field[] {
  const lines = fileContent.split("\n");
  const fields: IRos2Field[] = [];

  // Ignore the first line, which is the message name.

  for (const line of lines) {
    if (!line.replaceAll(" ", "").length) continue;
    const [fieldName, fieldType] = line.split(" ");
    // The field type can be either a basic type or a message type.
    if (!fieldName || !fieldType) throw new Error("Inconsistent type or param");
    fields.push({
      fieldname: fieldName,
      fieldtype: fieldType,
    });
  }

  return fields;
}
