<template>
  <div>
    <base-header class="header pb-8 pt-5 pt-lg-8 d-flex align-items-center">
      <!-- Mask -->
      <span class="bg-gradient-default opacity-8" />
      <!-- Header container -->
      <div class="container-fluid d-flex align-items-center">
        <div class="row">
          <div class="col-12 mt-0 mt-md-4 mt-lg-0 d-block">
            <router-link
              :to="'/aluno/turmas'"
              class="btn-link font-weight-normal text-white"
              title="Voltar para listagem de cursos"
            >
              <i class="fas fa-chevron-left mr-1" /> Voltar
            </router-link>
          </div>
          <div class="col-lg-7 col-md-10">
            <p class="text-white mt-4 mb-2">
              Aqui você pode conferir todos os materiais disponibilizados no
              curso
              <b>
                {{ classe.title }}
              </b>
              . Pelo painel você pode assistir os vídeos, responder as
              avaliações e visualizar os materiais complementares.
            </p>
          </div>
        </div>
      </div>
    </base-header>

    <div class="container-fluid mt--7">
      <div class="row">
        <div class="col-xl-4 order-xl-2 mb-5 mb-xl-0">
          <div
            ref="classe_container"
            class="card card-profile shadow vld-parent border-0"
          >
            <div class="card-image">
              <img
                class="card-img-top rounded-top"
                :src="classe.background_url || placeholderImg"
                alt="Imagem curso"
              />
              <div class="image-overlay" />
            </div>
            <div class="card-body py-3 px-3">
              <h2 class="card-title mb-1">
                <span title="Título do curso">{{ classe.title }}</span>
              </h2>
              <h5 v-if="classe.teacher_name" class="font-weight-300 mt-2 mb-1">
                Apresentado por: {{ classe.teacher_name }}
              </h5>
              <div v-if="classe.description">
                <hr class="my-4" />
                <h5 class="font-weight-300">Descrição</h5>
                <p class="description mb-1 pl-2">{{ classe.description }}</p>
              </div>
            </div>
            <div class="card-footer text-center">
              <h5 v-if="classe.updated_at" class="font-weight-300 mt-2 mb-1">
                <i class="far fa-clock mr-1" /> Última atualização:
                {{ formatTimestamp(classe.updated_at) }}.
              </h5>
            </div>
          </div>
        </div>

        <div ref="sections_container" class="col-xl-8 vld-parent">
          <card shadow type="secondary">
            <div slot="header" class="bg-white border-0">
              <div class="row align-items-center">
                <div class="col-6">
                  <h3 class="mb-0">Conteúdo do curso</h3>
                </div>
                <div class="col-6">
                  <base-button
                    class="float-right"
                    @click="$router.push(`/aluno/turmas/${classe.id}/aulas`)"
                  >
                    <i class="fas fa-calendar text-white mr-2" />Presenças
                  </base-button>
                </div>
              </div>
            </div>
            <sections-accordion
              v-if="!empty"
              :open-material="openMaterial"
              :sections="sections"
            />
            <p v-else class="text-center mb-1">
              <badge type="primary">Sem módulos para exibição no momento</badge>
            </p>
          </card>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import api from "@/services/api.js";

import SectionsAccordion from "./SectionsAccordion";

export default {
  components: {
    SectionsAccordion,
  },
  data() {
    return {
      classe: "",
      openMaterial: undefined,
      sections: [],
      empty: false,
      placeholderImg: "/img/pages/default_banner_course.jpg",
    };
  },
  async mounted() {
    const loaderCurso = this.$loading.show({
      container: this.$refs.classe_container,
      width: 90,
      height: 90,
    });
    const loaderSections = this.$loading.show({
      container: this.$refs.sections_container,
      width: 90,
      height: 90,
      opacity: 0,
    });
    if (this.$route.query.material)
      this.openMaterial = Number(this.$route.query.material);
    try {
      const { data } = await api.get(
        `/student/classes/${this.$route.params.id}/materials`
      );
      if (data.classe) this.classe = data.classe;
      if (data.materials) {
        const sections = [];
        if (
          data.materials.without_section &&
          data.materials.without_section.length
        ) {
          sections.push({
            title: "Geral",
            open: false,
            material: data.materials.without_section,
          });
        }
        if (data.materials.with_section && data.materials.with_section.length) {
          sections.push(
            ...data.materials.with_section.map((s) => ({
              ...s,
              open: false,
            }))
          );
        }
        this.sections = sections;
      }
      this.empty = !this.sections.length;
      loaderCurso.hide();
      loaderSections.hide();
    } catch (e) {
      this.$toasted.error(
        "Ocorreu um erro ao recuperar as informações do curso"
      );
      this.$router.push("/aluno/turmas");
    }
  },
  methods: {},
};
</script>
<style scoped>
.card-img-top {
  height: 200px;
  margin: auto;
  object-fit: cover;
}

.card-image {
  position: relative;
  height: 200px;
}

.image-overlay {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  width: 100%;
  opacity: 0.2;
  transition: 0.5s ease;
  background: rgba(0, 0, 0, 0.5);
}

.card:hover .image-overlay {
  opacity: 1;
}
</style>
