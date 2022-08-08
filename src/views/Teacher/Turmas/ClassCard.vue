<template>
  <card-root :title="turma.title" :image-url="turma.background_url">
    <p class="description mb-0">{{ turma.subtitle }}</p>
    <p v-if="turma.description" class="card-text mt-2 mb-0">
      <span :title="turma.description">{{ truncate(turma.description) }}</span>
    </p>
    <p v-if="!turma.is_visible" class="mt-2 mb-0">
      <badge v-tooltip="'A turma está oculta'" type="warning">Oculto</badge>
    </p>
    <template slot="footer">
      <div class="row">
        <div class="col-12">
          <router-link
            v-tooltip="'Editar turma'"
            :to="'/professor/turmas/' + turma.id + '/editar'"
            class="btn btn-white py-1 px-2"
          >
            <i class="fas fa-edit text-info" />
          </router-link>
          <router-link
            v-tooltip="'Gerenciar materiais do turma'"
            :to="'/professor/turmas/' + turma.id + '/materiais'"
            class="btn btn-white py-1 px-2"
          >
            <i class="fas fa-book text-dark-green" />
          </router-link>
          <router-link
            v-tooltip="'Ver aulas registradas'"
            :to="'/professor/turmas/' + turma.id + '/aulas'"
            class="btn btn-white py-1 px-2"
          >
            <i class="fas fa-calendar text-primary" />
          </router-link>
          <router-link
            v-tooltip="'Ver alunos cadastrados nesta turma'"
            :to="'/professor/turmas/' + turma.id + '/ranking'"
            class="btn btn-white py-1 px-2"
          >
            <i class="fas fa-award text-yellow" />
          </router-link>
        </div>
      </div>
    </template>
  </card-root>
</template>

<script>
import CardRoot from "../../../components/CardRoot.vue";

export default {
  name: "TeacherClassCard",
  components: { CardRoot },
  props: {
    turma: {
      type: Object,
      required: true,
    },
  },
  methods: {
    truncate(text, stop = 150, clamp = "...") {
      if (!text) return "N/A";
      return text.slice(0, stop) + (stop < text.length ? clamp : "");
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
