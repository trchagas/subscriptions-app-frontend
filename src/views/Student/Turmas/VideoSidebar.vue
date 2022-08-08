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
        <i class="fas fa-play fa-3x" />
        <h4 class="mt-3">{{ material.title }}</h4>
        <p class="description text-center mb-0">
          {{ material.description }}
        </p>
        <div ref="video_container" class="mt-4 vld-parent">
          <youtube
            :video-id="getYoutubeVideoId(material.video)"
            :fit-parent="true"
            :resize="true"
            :player-vars="playerVars"
            @ended="handleVideoEnded()"
            @ready="handleVideoReady()"
          />
        </div>
      </div>
    </div>
  </nav>
</template>
<script>
import { getIdFromUrl } from "vue-youtube";

export default {
  props: {
    material: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      video_id: "",
      playerVars: {
        accelerometer: 1,
        autoplay: 0,
        "clipboard-write": 1,
        "encrypted-media": 1,
        gyroscope: 1,
        "picture-in-picture": 1,
        allowfullscreen: 1,
      },
      loader: "",
    };
  },
  mounted() {
    this.loader = this.$loading.show({
      container: this.$refs.video_container,
      width: 100,
      height: 100,
      canCancel: true,
      loader: "spinner",
    });
  },
  methods: {
    handleClose() {
      this.$emit("closeVideo");
    },
    handleVideoEnded() {
      this.$emit("setViewed");
    },
    handleVideoReady() {
      this.loader.hide();
    },
    getYoutubeVideoId(url) {
      return getIdFromUrl(url);
    },
  },
};
</script>
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
