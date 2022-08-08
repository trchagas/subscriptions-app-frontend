<template>
  <div ref="materials_container" class="vld-parent">
    <base-header type="gradient-default" class="pb-6 pb-8 pt-5 pt-md-8">
      <!-- Mask -->
      <span class="bg-gradient-default opacity-8" />
      <!-- Header container -->
      <div class="container-fluid d-flex align-items-center">
        <div class="row">
          <div class="col-12 mt-0 mt-md-4 mt-lg-0 d-block">
            <a
              class="btn-link font-weight-normal text-white cursor-pointer"
              title="Voltar para a listagem de turmas"
              @click="$router.back()"
            >
              <i class="fas fa-chevron-left mr-1" /> Voltar
            </a>
          </div>
          <div class="col-lg-8 col-md-10">
            <p class="text-white my-3">
              Aqui você pode conferir os materiais cadastrados em cada uma das
              seções da turma <b>{{ title }}</b>
              . Todo novo material cadastrado será exibido na listagem abaixo.
            </p>
          </div>
        </div>
      </div>
    </base-header>

    <div class="container-fluid mt--7">
      <div class="row">
        <div class="col-lg-12">
          <div v-if="empty" class="row">
            <div class="col-12 mb-3 text-center">
              <badge type="info" class="bg-white">
                Não existem materiais cadastrados na turma até o momento
              </badge>
            </div>
          </div>

          <div class="row">
            <div class="col-lg-12">
              <div class="row sections">
                <section-card
                  v-if="materials.withoutSection.length"
                  :section="null"
                  :material="materials.withoutSection"
                />
                <section-card
                  v-for="(section, index) in materials.sections"
                  :key="index"
                  :section="section"
                  :material="section.material"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="totalMaterials" class="row">
        <div class="col-12 text-muted text-right">
          <b>{{ totalMaterials }}</b> materiais vinculados à turma ao total
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import api from "../../../services/api";
import SectionCard from "./Materiais/SectionCard.vue";

export default {
  name: "TurmaMateriais",
  components: {
    SectionCard,
  },
  data() {
    return {
      title: "",
      classe: null,
      totalMaterials: 0,
      empty: true,
      materials: {
        sections: [],
        withoutSection: [],
      },
    };
  },
  mounted() {
    this.loadMaterials();
  },
  methods: {
    getTotalMaterials() {
      let totalMaterials = 0;
      totalMaterials += this.materials.withoutSection.length;
      totalMaterials += this.materials.sections.reduce(
        (count, section) => (count += section.material.length),
        0
      );

      this.totalMaterials = totalMaterials;
      if (this.totalMaterials) this.empty = false;
    },
    async loadMaterials() {
      const loader = this.$loading.show({
        container: this.$refs.materials_container,
        width: 110,
        height: 110,
        opacity: 0,
      });
      try {
        const { data } = await api.get(
          `/admin/classes/${this.$route.params.id}/materials`
        );
        this.title = data.classe.title;
        this.classe = data.classe;
        if (data.hasOwnProperty("with_section"))
          if (data.with_section.length)
            this.materials.sections = data.with_section;
        if (data.hasOwnProperty("without_section"))
          this.materials.withoutSection = data.without_section;
        this.getTotalMaterials();
      } catch (e) {
        this.$toasted.error(
          "Ocorreu um erro ao recuperar os materiais da turma"
        );
      } finally {
        loader.hide();
      }
    },
  },
};
</script>

<style scoped>
.sections > div {
  flex: 0 0 50%;
  max-width: 50%;
}
.sections > div:only-child {
  flex: 0 0 100%;
  max-width: 100%;
}

.cursor {
  cursor: pointer;
}

.card-img-top {
  height: 200px;
  margin: auto;
  object-fit: cover;
}

.card-image {
  position: relative;
  height: 200px;
}
</style>

<style>
.ml-container-read-only .quill-editor .ql-container,
.ml-container-read-only .quill-editor .ql-container .ql-editor {
  max-height: 10rem;
  width: 100%;
}

p > strong {
  font-weight: bold !important;
}
</style>
