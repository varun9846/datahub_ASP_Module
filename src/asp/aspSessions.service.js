import { getSessions } from "../ASPHelper/Apis.js";

export function extractSessions(resp) {
  return resp?.data?.session ?? [];
}

export async function fetchSessionsByWindow(dateTimeRange, baseParams) {
  const startParams = {
    ...baseParams,
    sessionStartDateTimeStart: dateTimeRange.from,
    sessionStartDateTimeEnd: dateTimeRange.to,
  };

  const endParams = {
    ...baseParams,
    sessionStopDateTimeStart: dateTimeRange.from,
    sessionStopDateTimeEnd: dateTimeRange.to,
  };

  const [startResp, endResp] = await Promise.all([
    getSessions(startParams, "all"),
    getSessions(endParams, "all"),
  ]);

  return {
    startResp,
    endResp,
    startArr: extractSessions(startResp),
    endArr: extractSessions(endResp),
  };
}
