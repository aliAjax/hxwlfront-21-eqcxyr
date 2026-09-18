export type Field = {
  key: string;
  label: string;
  type?: "number" | "date" | "select";
  options?: readonly string[];
};

export type RecordItem = {
  id: string;
  status: string;
  notes: string;
  createdAt: string;
  /** 是否处于补货预警区（进入时打上，离开营业中时清除） */
  warned?: boolean;
  [key: string]: string | number | boolean | undefined;
};

/** 库存低于该阈值（升）的营业中新站进入补货预警区 */
export const WARN_STOCK_THRESHOLD = 10000;
export const OPEN_STATUS = "营业中";

/** 判断新保存的站点是否进入补货预警区：营业中且库存低于 10000 升 */
export function isRestockWarning(record: Pick<RecordItem, "status" | "stock">): boolean {
  return record.status === OPEN_STATUS && Number(record.stock ?? 0) < WARN_STOCK_THRESHOLD;
}

/** 站点是否仍满足预警条件（用于状态流转时判断撤出时机） */
export function canStayInWarning(record: RecordItem): boolean {
  return !!record.warned && record.status === OPEN_STATUS;
}

/** 预警区站点：按库存升序排列；同库存保持保存先后顺序（稳定排序） */
export function sortedWarningRecords(records: RecordItem[]): RecordItem[] {
  return records
    .filter((record) => record.warned)
    .map((record, index) => ({ record, index }))
    .sort((a, b) => {
      const diff = Number(a.record.stock ?? 0) - Number(b.record.stock ?? 0);
      return diff !== 0 ? diff : a.index - b.index;
    })
    .map((item) => item.record);
}

/** 普通列表：预警区站点撤出，其余保持原位置 */
export function normalRecords(records: RecordItem[]): RecordItem[] {
  return records.filter((record) => !record.warned);
}
