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
export function sentenseCase(text: string) {
  var string = "hi all, this is derp. thank you all to answer my query.";
  var n = text.split(".");
  var vfinal = "";
  for (let i = 0; i < n.length; i++) {
    var spaceput = "";
    var spaceCount = n[i].replace(/^(\s*).*$/, "$1").length;
    n[i] = n[i].replace(/^\s+/, "");
    var newstring = n[i].charAt(+n[i]).toUpperCase() + n[i].slice(1);
    for (let j = 0; j < spaceCount; j++) spaceput = spaceput + " ";
    vfinal = vfinal + spaceput + newstring + ".";
  }
  vfinal = vfinal.substring(0, vfinal.length - 1);
  return vfinal;
  // alert(vfinal);
}