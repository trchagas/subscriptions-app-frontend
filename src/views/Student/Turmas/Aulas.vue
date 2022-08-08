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
              Aqui você pode conferir todas as aulas disponibilizadas no curso
              <b>
                {{ classe.title }}
              </b>
              . É possível conferir as presenças e faltas lançadas pelo
              professor na determinada aula.
            </p>
          </div>
        </div>
      </div>
    </base-header>

    <div class="container-fluid mt--7">
      <div class="row">
        <div class="col-xl-12">
          <div
            ref="lessons_table"
            class="card shadow table-container vld-parent"
          >
            <div class="card-header border-0">
              <div class="row align-items-center">
                <div class="col">
                  <h3 class="mb-0">Lista de aulas cadastradas</h3>
                </div>
              </div>
            </div>
            <div class="table-responsive">
              <base-table
                v-if="!empty"
                class="table align-items-center table-flush"
                thead-classes="thead-light"
                tbody-classes="list"
                :data="orderedLessons"
                type="hover"
              >
                <template slot="columns">
                  <th class="cursor-pointer" @click="orderLessons('date')">
                    Data
                    <i
                      :class="[
                        'ml-1 text-primary btn-sort fas',
                        sortLessons.asc ? 'fa-caret-down' : 'fa-caret-up',
                      ]"
                      :title="`Ordenar ${
                        sortLessons.asc
                          ? 'descendente (Z-A)'
                          : 'ascendente (A-Z)'
                      }`"
                    />
                  </th>
                  <th class="cursor-pointer" @click="orderLessons('type')">
                    Tipo de aula
                    <i
                      :class="[
                        'ml-1 text-primary btn-sort fas',
                        sortLessons.asc ? 'fa-caret-down' : 'fa-caret-up',
                      ]"
                      :title="`Ordenar ${
                        sortLessons.asc
                          ? 'descendente (Z-A)'
                          : 'ascendente (A-Z)'
                      }`"
                    />
                  </th>
                  <th
                    class="cursor-pointer"
                    @click="orderLessons('description')"
                  >
                    Resumo
                    <i
                      :class="[
                        'ml-1 text-primary btn-sort fas',
                        sortLessons.asc ? 'fa-caret-down' : 'fa-caret-up',
                      ]"
                      :title="`Ordenar ${
                        sortLessons.asc
                          ? 'descendente (Z-A)'
                          : 'ascendente (A-Z)'
                      }`"
                    />
                  </th>
                  <th>Material</th>
                  <th class="cursor-pointer" @click="orderLessons('present')">
                    Presença
                    <i
                      :class="[
                        'ml-1 text-primary btn-sort fas',
                        sortLessons.asc ? 'fa-caret-down' : 'fa-caret-up',
                      ]"
                      :title="`Ordenar ${
                        sortLessons.asc
                          ? 'descendente (Z-A)'
                          : 'ascendente (A-Z)'
                      }`"
                    />
                  </th>
                </template>
                <template slot-scope="{ row }">
                  <td>
                    {{ formatTimestamp(row.date) }}
                  </td>
                  <td>
                    {{ row.type }}
                  </td>
                  <td>
                    {{ row.description }}
                  </td>
                  <td>
                    <a
                      v-if="row.material_id"
                      :href="`/aluno/turmas/${classe.id}/visualizar?material=${row.material_id}`"
                    >
                      {{ row.material_title }}
                    </a>
                    <i v-else>Não Informado</i>
                  </td>
                  <td>
                    <i
                      :class="
                        ('cursor-pointer ',
                        row.present
                          ? 'fas fa-check-circle text-success'
                          : 'fas fa-times-circle text-danger')
                      "
                    />
                  </td>
                </template>
              </base-table>
              <p v-else class="text-center mb-3">
                <badge type="primary">
                  Sem aulas para exibição no momento
                </badge>
              </p>
            </div>
          </div>
          <div v-if="!empty" class="col-12 text-muted text-right mt-3">
            <b>{{ lessons.length }}</b> aulas exibidas no total.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import api from "@/services/api.js";

export default {
  components: {},
  data() {
    return {
      classe: "",
      lessons: [],
      sortLessons: {
        currentSort: "date",
        asc: false,
      },
      empty: false,
      placeholderImg: "/img/pages/default_banner_course.jpg",
    };
  },
  computed: {
    orderedLessons() {
      const key = this.sortLessons.currentSort;
      const compareFunction = function (a, b) {
        return a[key] > b[key] ? 1 : -1;
      };
      const ranking = [...this.lessons].sort(compareFunction);
      return this.sortLessons.asc ? ranking : ranking.reverse();
    },
  },
  async mounted() {
    const loaderCurso = this.$loading.show({
      container: this.$refs.classe_container,
      width: 90,
      height: 90,
    });
    try {
      const { data } = await api.get(
        `/student/classes/${this.$route.params.id}/lessons`
      );
      if (data.classe) this.classe = data.classe;
      if (data.lessons) {
        data.lessons.forEach((lesson) => {
          lesson.date = this.formatDate(lesson.date);
          lesson.material_title = 1;
        });
        this.lessons = data.lessons;
      }

      this.empty = !this.lessons.length;
      loaderCurso.hide();
    } catch (e) {
      this.$toasted.error(
        "Ocorreu um erro ao recuperar as informações do curso"
      );
      this.$router.push("/aluno/turmas");
    }
  },
  methods: {
    orderLessons(key) {
      this.sortLessons.currentSort = key;
      this.sortLessons.asc = !this.sortLessons.asc;
    },
    formatDate(date) {
      const hours = parseInt(date.substring(11, 13)) - 3;
      return date.substring(0, 11) + hours + date.substring(13, date.length);
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
