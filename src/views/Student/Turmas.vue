<template>
  <div>
    <base-header class="header pb-8 pt-5 pt-lg-8 d-flex align-items-center">
      <!-- Mask -->
      <span class="bg-gradient-default opacity-8" />
      <!-- Header container -->
      <div
        ref="cursos_list"
        class="container-fluid d-flex align-items-center vld-parent"
      >
        <div class="row">
          <div class="col-12 d-block d-md-none">
            <router-link
              :to="'/'"
              class="btn-link font-weight-normal text-white"
              title="Voltar para o início"
            >
              <i class="fas fa-chevron-left mr-1" /> Voltar
            </router-link>
          </div>
          <div class="col-lg-7 col-md-10">
            <p class="text-white mt-3 mb-5">
              Aqui você encontra os turmas aos quais você está matriculado.
            </p>
          </div>
        </div>
      </div>
    </base-header>
    <div class="container-fluid mt--7">
      <div v-if="empty" class="row">
        <div class="col-12 text-center">
          <badge type="info" class="bg-white">
            Você não está matriculado em nenhuma turma no momento.
          </badge>
        </div>
      </div>
      <div v-else>
        <div class="row">
          <div class="col-12">
            <div class="card-deck">
              <div
                v-for="turma in turmas"
                :key="turma.user_id"
                class="col-lg-4 col-md-6 mb-5 d-flex align-items-stretch"
              >
                <class-card :turma="turma" />
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-12 text-muted text-right mt-3">
            <b>{{ turmas.length }}</b> turmas disponíveis
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import api from "@/services/api";
import ClassCard from "./Turmas/ClassCard.vue";

export default {
  name: "EstudanteTurmas",
  components: { ClassCard },
  data() {
    return {
      turmas: [],
      empty: false,
    };
  },
  async mounted() {
    let loader = this.$loading.show({
      container: this.$refs.cursos_list,
      width: 150,
      height: 150,
      opacity: 0,
    });
    try {
      const { data } = await api.get("/student/classes");
      if (data.length) {
        this.turmas = data;
        this.turmas.forEach((course) => {
          course.completation = this.getCompletationPercetange(course);
        });
      } else this.empty = true;
      loader.hide();
    } catch (e) {
      this.$toasted.error("Ocorreu um erro ao recuperar as turmas");
    }
  },
  methods: {
    truncate(text, stop = 150, clamp = "...") {
      if (!text) return "N/A";
      return text.slice(0, stop) + (stop < text.length ? clamp : "");
    },
    getCompletationPercetange(course) {
      if (!course.material_count || !course.viewed) return 0;
      return Number(((course.viewed / course.material_count) * 100).toFixed(2));
    },
    getProgressType(completation) {
      if (completation <= 15.0) return "danger";
      if (completation <= 30.0) return "warning";
      if (completation <= 45.0) return "default";
      if (completation <= 60.0) return "info";
      if (completation < 100.0) return "primary";
      return "success";
    },
  },
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
