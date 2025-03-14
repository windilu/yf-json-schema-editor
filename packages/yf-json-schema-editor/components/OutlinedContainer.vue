<template>
  <div
    class="box-border relative p-4 border-black border-opacity-40 hover:border-opacity-100 border-[1px] rounded-md border-t-transparent group border-l-transparent"
  >
    <div
      class="pointer-events-none absolute top-0 left-0 h-full flex w-full z-0 border-black border-opacity-40 group-hover:border-opacity-100"
    >
      <div
        class="border-black border-opacity-40 border-[1px] group-hover:border-opacity-100 w-3 h-full border-r-transparent rounded-l border-b-transparent"
      />

      <div
        class="pl-1 pr-1 mt-[-12px] text-caption opacity-65 whitespace-nowrap"
      >
        {{ label }}
      </div>

      <div
        class="border-black border-opacity-40 group-hover:border-opacity-100 h-full w-full border-t-[1px] rounded-tr"
      />
    </div>

    <slot />
  </div>
</template>

<script setup lang="ts">
const { label = '' } = defineProps<{ label?: string }>();
</script>

<style lang="scss" scoped></style>
