import router from "next/router";

export function toJson(data: any) {
    if (data !== undefined) {
      return JSON.stringify(data, (_, v) => (typeof v === "bigint" ? `${v}#bigint` : v)).replace(
        /"(-?\d+)#bigint"/g,
        (_, a) => a
      );
    }
}

export const navigateTo = (path: string) => {
  router.push({
    pathname: path,
  });
};
  