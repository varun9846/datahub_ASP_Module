function toNullableString(value) {
  if (value === undefined || value === null) return null;
  return String(value);
}

function toIsoOrNull(value) {
  if (value === undefined || value === null || value === "") return null;

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value.toISOString();
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

export function mapSQSmsRow(row) {
  return {
    id: toNullableString(row.id),
    vlan_id: toNullableString(row.vlan_id),
    msg_type: toNullableString(row.msg_type),
    created_dtm: toIsoOrNull(row.created_dtm),
    completed_dtm: toIsoOrNull(row.completed_dtm),
    mobile_numb: toNullableString(row.mobile_numb),
    delivery_dtm: toIsoOrNull(row.delivery_dtm),
    delivery_status: toNullableString(row.delivery_status),
    fail_remark: toNullableString(row.fail_remark),
  };
}
