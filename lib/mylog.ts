var debug_mode = true; // turn this to false on production deployment

export function myErrorLog(errorPlace?: string, message?: any) {
  if (debug_mode) {
    console.log("Error"," ",errorPlace, " ", message);
  }
}
export function myInfoLog(infoPlace: string, info: any) {
  if (debug_mode) {
    console.log("Info"," ", infoPlace, " ", info);
  }
}
