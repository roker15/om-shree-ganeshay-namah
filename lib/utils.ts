export function toJson(data: any) {
    if (data !== undefined) {
      return JSON.stringify(data, (_, v) => (typeof v === "bigint" ? `${v}#bigint` : v)).replace(
        /"(-?\d+)#bigint"/g,
        (_, a) => a
      );
    }
  }