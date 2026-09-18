<script setup lang="ts">
import type { Field, RecordItem } from "./station";

defineProps<{
  record: RecordItem;
  fields: readonly Field[];
}>();

const emit = defineEmits<{
  flow: [record: RecordItem];
  remove: [id: string];
}>();

function primaryText(record: RecordItem, fields: readonly Field[]) {
  const first = fields[0];
  const second = fields[1];
  return [record[first.key], record[second.key]].filter(Boolean).join(" / ") || "油站";
}
</script>

<template>
  <article class="record" :class="{ 'record-warning': record.warned }">
    <div class="record-head">
      <p class="record-title">{{ primaryText(record, fields) }}</p>
      <span class="status">{{ record.status }}</span>
    </div>
    <div class="details">
      <span v-for="field in fields" :key="field.key">{{ field.label }}: {{ record[field.key] }}</span>
    </div>
    <p class="note">{{ record.notes }}</p>
    <div class="actions">
      <button type="button" @click="emit('flow', record)">流转状态</button>
      <button class="secondary" type="button" @click="navigator.clipboard?.writeText(primaryText(record, fields))">复制摘要</button>
      <button class="danger" type="button" @click="emit('remove', record.id)">删除</button>
    </div>
  </article>
</template>
