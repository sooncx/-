<template>
  <div>
    <slot :childData=data>
      我是child组件,我替换了father中的slot
    </slot>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: "我来自child组件模板"
    };
  }
};
</script>