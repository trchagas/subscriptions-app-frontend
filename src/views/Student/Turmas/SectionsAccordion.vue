<template>
  <div class="accordion">
    <div
      v-for="section in sections"
      :key="`section_${section.id}`"
      class="card"
    >
      <div
        class="card-header section-header cursor-pointer p-3"
        title="Clique para abrir a seção"
        @click="section.open = !section.open"
      >
        <h4 class="mb-0 font-weight-600">
          <span class="section-title text-default">
            {{ section.title }}
          </span>
          <span class="float-right">
            <span class="font-weight-200 mx-3 small">
              <badge
                v-tooltip="
                  `Você já abriu <b>${getCountViewdMaterials(
                    section
                  )}</b> dos <b>${
                    section.material.length
                  }</b> materiais desta seção`
                "
                :type="getBadgeType(getPercentage(section))"
              >
                {{ getPercentage(section) }}%
              </badge>
            </span>
            <i
              :class="['fas', section.open ? 'fa-angle-up' : 'fa-angle-down']"
            />
          </span>
        </h4>
      </div>
      <fade-transition :duration="100" origin="center top" mode="out-in">
        <div v-if="section.open" class="card-body shadow section-body pb-1">
          <div v-if="!section.material.length" class="text-center pb-4">
            <badge type="primary">
              Sem materiais para exibição nesta seção
            </badge>
          </div>
          <div
            v-for="material in section.material"
            v-else
            :key="`material_${material.id}`"
          >
            <p>
              <span class="cursor-pointer">
                <span
                  v-tooltip="'Clique para abrir'"
                  @click.stop="handleOpenMaterial(material)"
                >
                  <i
                    :class="[
                      getMaterialIcon(material.content),
                      'mr-2 btn-link',
                      { 'text-success': material.studentMaterial },
                    ]"
                  />
                  {{ material.title }}
                </span>
                <span
                  v-if="material.description && !material.showDescription"
                  v-tooltip="'Clique para ver descrição'"
                  class="ml-2"
                  @click="showMaterialDescription(material)"
                >
                  <i class="fas fa-angle-down material-angle-down" />
                </span>
              </span>
            </p>
            <p v-if="material.showDescription" class="description ml-3 mt--2">
              {{ material.description }}
            </p>
          </div>
        </div>
      </fade-transition>
    </div>
    <text-sidebar
      v-if="modals.text.show"
      :material="modals.text.material"
      @closeText="modals.text.show = false"
    />
    <video-sidebar
      v-if="modals.video.show"
      :material="modals.video.material"
      @closeVideo="modals.video.show = false"
      @setViewed="setViewed(modals.video.material)"
    />
    <evaluation-sidebar
      v-if="modals.evaluation.show"
      :material="modals.evaluation.material"
      @closeEvaluation="modals.evaluation.show = false"
    />
  </div>
</template>
<script>
import { FadeTransition } from "vue2-transitions";

import TextSidebar from "./TextSidebar";
import VideoSidebar from "./VideoSidebar";
import EvaluationSidebar from "./EvaluationSidebar";

import api from "@/services/api";

export default {
  components: {
    FadeTransition,
    TextSidebar,
    VideoSidebar,
    EvaluationSidebar,
  },
  props: {
    sections: {
      type: Array,
      required: true,
    },
    openMaterial: {
      type: Number,
      required: false,
      default: undefined,
    },
  },
  data() {
    return {
      materialIcons: {
        text: "align-left",
        video: "play",
        link: "link",
        file: "file-alt",
        evaluation: "tasks",
      },
      materialOpenHandlers: {
        text: this.openText,
        video: this.openVideo,
        link: this.openLink,
        file: this.openFile,
        evaluation: this.openEvaluation,
      },
      modals: {
        text: {
          show: false,
          material: "",
        },
        video: {
          show: false,
          material: "",
        },
        evaluation: {
          show: false,
          material: "",
        },
      },
    };
  },
  watch: {
    sections: function () {
      if (this.openMaterial)
        for (const section of this.sections)
          for (const material of section.material)
            if (material.id === this.openMaterial) {
              section.open = true;
              if (material.content === "file")
                this.showMaterialDescription(material);
              else this.handleOpenMaterial(material);
              return;
            }
      for (const section of this.sections) {
        for (const material of section.material) {
          if (!material.studentMaterial) {
            section.open = true;
            return;
          }
        }
      }
      if (this.sections.length)
        this.sections[this.sections.length - 1].open = true;
    },
  },
  methods: {
    getMaterialIcon(type) {
      return `fas fa-${this.materialIcons[type]}`;
    },
    showMaterialDescription(material) {
      this.$set(material, "showDescription", true);
    },
    openText(material) {
      this.modals.video.show = this.modals.evaluation.show = false;
      this.modals.text.material = material;
      this.modals.text.show = true;
    },
    openVideo(material) {
      this.modals.text.show = this.modals.evaluation.show = false;
      this.modals.video.material = material;
      this.modals.video.show = true;
    },
    openLink({ link }) {
      window.open(link, "_blank", "noreferrer noopener");
    },
    openFile({ file_url }) {
      window.open(file_url, "file-window", "resizable=1,height=750,width=750");
    },
    openEvaluation(material) {
      this.modals.text.show = this.modals.video.show = false;
      this.modals.evaluation.material = material;
      this.modals.evaluation.show = true;
    },
    async handleOpenMaterial(material) {
      const openHandler = this.materialOpenHandlers[material.content];
      openHandler(material);
      if (material.content !== "evaluation" && material.content !== "video")
        await this.setViewed(material);
    },
    async setViewed(material) {
      if (material.studentMaterial) return;
      try {
        const { data } = await api.put(
          `/student/classes/${material.course_id}/materials/${material.id}/set-viewed`
        );
        material.studentMaterial = data;
      } catch (e) {
        this.$toasted.error("Progesso não pode ser salvo.");
      }
    },
    getCountViewdMaterials(section) {
      return section.material.filter((material) => material.studentMaterial)
        .length;
    },
    getPercentage(section) {
      const totalMaterials = section.material.length;
      const totalViewed = this.getCountViewdMaterials(section);
      if (!totalMaterials) return 100;
      return Math.round((totalViewed / totalMaterials) * 100);
    },
    getBadgeType(percentage) {
      if (!percentage === "") return;
      if (percentage === 0) return "gray";
      if (percentage === 100) return "success";
      if (percentage < 15) return "danger";
      if (percentage < 30) return "warning";
      if (percentage < 45.0) return "default";
      if (percentage < 60.0) return "info";
      return "primary";
    },
  },
};
</script>
<style scoped>
.section-body {
  background-color: #fbfbf8;
}
.section-header .section-title:hover,
.section-header .section-title:focus,
.section-header .section-title:active {
  color: rgba(0, 0, 0, 0.7) !important;
}

.material-angle-down {
  font-size: 12px;
  color: blue;
}
</style>
