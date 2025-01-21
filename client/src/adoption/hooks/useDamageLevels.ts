import { DamageLevel } from "../../types";
import { useAirtableRecords } from "../../hooks/useAirtableRecords";

function parseDamageLevelDescription(airtableRecord: any): DamageLevel {
  return {
    level: airtableRecord.fields.damage_level,
    description: airtableRecord.fields.description,
  };
}

export function useDamageLevels(): DamageLevel[]|'error'|'loading' {
  return useAirtableRecords(
    'damage_level_descriptions',
    parseDamageLevelDescription,
  );
}