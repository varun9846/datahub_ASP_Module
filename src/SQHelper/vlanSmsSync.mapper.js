function toNullableString(value) {
  if (value === undefined || value === null) return null;
  return String(value);
}

function toNullableNumber(value) {
  if (value === undefined || value === null || value === "") return null;

  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function toIsoOrNull(value) {
  if (value === undefined || value === null || value === "") return null;

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value.toISOString();
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

export function mapVlanSmsRow(row) {
  return {
    id: toNullableString(row.id),
    vlan_id: toNullableNumber(row.vlan_id),
    phone_number: toNullableString(row.phone_number),
    message: row.message ?? null,
    created_at: toIsoOrNull(row.createdAt),
    updated_at: toIsoOrNull(row.updatedAt),
  };
}