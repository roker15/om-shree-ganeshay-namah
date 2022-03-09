var debug_mode = true; // turn this to false on production deployment

export function elog(errorPlace: string, message: any) {
  if (debug_mode) {
    console.log("Error Place: ", errorPlace + "," + "Error message is ->" + message);
    alert(message);
  }
}
export function ilog(infoPlace: string, info: any) {
  if (debug_mode) {
    console.log("Info Place: ", infoPlace + "," + "Info is ->" + info);
  }
}
