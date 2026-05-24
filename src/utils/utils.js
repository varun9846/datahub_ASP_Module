import moment from "moment";

function getWindow10MinBack1Day(nowUtc = moment.utc()) {
  const shifted = nowUtc.clone().subtract(1, "day"); // 24hrs old so that ASP can sync with vsg's (False sync control)
  const from = shifted.clone().subtract(10, "minutes");
  const toExclusive = shifted.clone();

  return {
    from: from.format("YYYY-MM-DD HH:mm:ss"),
    to: toExclusive.format("YYYY-MM-DD HH:mm:ss"), // exclusive
  };
}

export {getWindow10MinBack1Day};