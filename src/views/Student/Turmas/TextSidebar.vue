<template>
  <nav
    id="sidenav-filters"
    v-click-outside="handleClose"
    class="fixed-right navbar navbar-vertical navbar-expand-xs navbar-light bg-white"
  >
    <div class="row">
      <div class="col-12">
        <i
          class="fas fa-times fa-close p-1 text-primary"
          title="Fechar"
          @click="handleClose()"
        />
      </div>
      <div class="col-12 mt-4 text-center">
        <i class="fas fa-align-left fa-3x" />
        <h4 class="mt-3">{{ material.title }}</h4>
        <p class="description text-center mb-0">
          {{ material.description }}
        </p>
        <div class="mt-4 ts-container-read-only">
          <quill-editor
            v-model="material.text"
            :options="editorReadOnly"
            disabled="disabled"
            class="border rounded"
          />
        </div>
      </div>
    </div>
  </nav>
</template>
<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";

export default {
  components: {
    quillEditor,
  },
  props: {
    material: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      editorReadOnly: {
        placeholder: "...",
        readOnly: true,
        theme: "bubble",
      },
    };
  },
  methods: {
    handleClose() {
      this.$emit("closeText");
    },
  },
};
</script>
<style>
.ts-container-read-only .quill-editor .ql-container,
.ts-container-read-only .quill-editor .ql-container .ql-editor {
  max-height: 40rem;
  width: 100%;
}

p > strong {
  font-weight: bold !important;
}
</style>
<style scoped>
.navbar {
  z-index: 1000 !important;
}
.navbar-vertical.navbar-expand-xs {
  width: 100%;
  max-width: 750px !important;
}
.fa-close {
  font-size: 1.5em;
  cursor: pointer;
}
</style>
