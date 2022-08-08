<template>
  <div>
    <base-header class="header pb-8 pt-5 pt-lg-8 d-flex align-items-center">
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
              <i class="fas fa-chevron-left mr-1" />
              Voltar
            </a>
          </div>
          <div class="col-lg-7 col-md-10">
            <p class="text-white mt-4 mb-2">
              Aqui é possível visualizar as aulas lançadas na turma
              <b> {{ classe.title }} </b>.
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
                class="table align-items-center table-flush"
                thead-classes="thead-light"
                tbody-classes="list"
                :data="orderedLessons"
                type="hover"
              >
                <template slot="columns">
                  <th>#</th>
                  <th class="cursor-pointer" @click="orderLessons('name')">
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
                  <th>Ações</th>
                </template>
                <template slot-scope="{ row, index }">
                  <td class="py-4">{{ index + 1 }}</td>
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
                    <i
                      class="fas fa-eye text-primary cursor-pointer"
                      @click="handleOpenEdit(row)"
                    />
                  </td>
                </template>
              </base-table>
              <p v-if="empty" class="text-center text-warning mt-3">
                Nenhuma aula registrada até o momento.
              </p>
            </div>
          </div>
          <div v-if="!empty" class="col-12 text-muted text-right mt-3">
            <b>{{ lessons.length }}</b> aulas exibidas no total.
          </div>
        </div>
      </div>
    </div>

    <modal
      :show.sync="editModal.show"
      modal-classes="modal-dialog-centered modal-lg"
      body-classes="pb-0"
      header-classes="pb-0"
    >
      <template>
        <form role="form">
          <div class="row mx-1 justify-content-between">
            <h6 class="heading-small text-muted mb-4">Visualizar aula</h6>
            <h6
              class="heading-small mb-4 cursor-pointer"
              @click="editModal.show = false"
            >
              x
            </h6>
          </div>
          <div class="row ml-lg-2">
            <div class="col-lg-6 mb-4">
              <label class="form-control-label d-block"> Data </label>
              <span>{{ formatDisplayDate(editModal.model.date) }}</span>
            </div>
            <div class="col-lg-6 mb-4">
              <label class="form-control-label d-block"> Tipo </label>
              <span>{{ editModal.model.type }}</span>
            </div>
            <div class="col-lg-6 mb-4">
              <label class="form-control-label d-block"> Resumo </label>
              <span>{{ editModal.model.description }}</span>
            </div>
            <div class="col-lg-6 mb-4">
              <label class="form-control-label d-block">
                Material Relacionado
              </label>
              <span v-if="editModal.model.material_title">
                {{ editModal.model.description }}
              </span>
              <span v-else>Nenhum</span>
            </div>
          </div>
          <hr class="mt-2 mb-4" />
          <div v-if="editModal.error" class="row ml-lg-2">
            <div class="col-lg-12 text-center">
              <base-alert type="danger">{{ editModal.error }}</base-alert>
            </div>
          </div>
        </form>
      </template>

      <div ref="students_area">
        <base-table
          class="table align-items-center table-flush"
          thead-classes="thead-light"
          tbody-classes="list"
          :data="orderedStudents"
          type="hover"
        >
          <template slot="columns">
            <th>#</th>
            <th class="cursor-pointer" @click="orderStudents('name')">
              Aluno
              <i
                :class="[
                  'ml-1 text-primary btn-sort fas',
                  sortStudents.asc ? 'fa-caret-down' : 'fa-caret-up',
                ]"
                :title="`Ordenar ${
                  sortStudents.asc ? 'descendente (Z-A)' : 'ascendente (A-Z)'
                }`"
              />
            </th>
            <th>Presença</th>
          </template>
          <template slot-scope="{ row, index }">
            <td class="py-4">{{ index + 1 }}</td>
            <td>
              {{ row.name }}
              <router-link
                class="ml-1"
                title="Abrir aluno"
                :to="`/diretoria/usuarios/alunos/${row.id}/editar`"
              >
                <i class="fas fa-eye" />
              </router-link>
            </td>
            <td>
              <base-checkbox
                v-model="row.present"
                class="mb-2 mr-1"
                :disabled="true"
                :name="String(index)"
              />
            </td>
          </template>
        </base-table>
        <p v-if="emptyStudents" class="text-center text-warning mt-3">
          Nenhum aluno matriculado até o momento.
        </p>
      </div>

      <template slot="footer">
        <base-button
          type="warning"
          text-color="dark"
          class="ml-auto mr-auto text-white"
          @click="editModal.show = false"
        >
          Fechar
        </base-button>
      </template>
    </modal>
  </div>
</template>
<script>
import api from "@/services/api.js";
import BaseCheckbox from "../../../components/BaseCheckbox.vue";

export default {
  name: "AulasProfessor",
  components: { BaseCheckbox },
  data() {
    return {
      classe: {},
      lessons: [],
      sortLessons: {
        currentSort: "date",
        asc: false,
      },
      sortStudents: {
        currentSort: "name",
        asc: false,
      },
      deleteModal: {
        show: false,
        lesson: {},
        index: "",
      },
      editModal: {
        show: false,
        error: "",
        model: {
          id: "",
          type: "",
          description: "",
          date: "",
          material_id: "",
        },
        edited: false,
        students: [],
      },
      newLessonModal: {
        show: false,
        error: "",
        model: {
          type: "",
          description: "",
          date: "",
          material_id: "",
        },
      },
      materials: [],
      empty: false,
      emptyStudents: false,
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
    orderedStudents() {
      const key = this.sortStudents.currentSort;
      const compareFunction = function (a, b) {
        return a[key] > b[key] ? 1 : -1;
      };
      const ranking = [...this.editModal.students].sort(compareFunction);
      return this.sortStudents.asc ? ranking : ranking.reverse();
    },
  },
  async mounted() {
    this.loadLessons();
  },
  methods: {
    async handleOpenEdit(row) {
      this.editModal.show = true;
      for (const key in this.editModal.model)
        this.editModal.model[key] = row[key];
      if (row.students) this.editModal.students = row.students;
      else {
        const loader = this.$loading.show({
          container: this.$refs.students_area,
          width: 90,
          height: 90,
        });
        try {
          const { data } = await api.get(
            `/admin/classes/${this.classe.id}/lessons/${row.id}/presence`
          );
          this.editModal.students = data;
          row.students = data;
        } catch (e) {
          this.$toasted.error(
            "Ocorreu um erro ao recuperar os alunos matriculados"
          );
        }
        loader.hide();
      }
      this.emptyStudents = !this.editModal.students.length;
    },

    formatDate(date) {
      const lenght = date.length;
      return date.substring(0, lenght - 6);
    },
    formatDisplayDate(d) {
      const date = new Date(d);
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      const hours = date.getHours();
      const minutes = date.getMinutes();

      const formatted = `${day}/${month}/${year}, ${hours}:${minutes}`;

      return formatted;
    },
    async loadLessons() {
      const loader = this.$loading.show({
        container: this.$refs.lessons_table,
        width: 90,
        height: 90,
      });
      try {
        const { data } = await api.get(
          `/admin/classes/${this.$route.params.id}/lessons`
        );
        this.classe = data.classe;
        data.classe.lesson.forEach((lesson) => {
          lesson.date = this.formatDate(lesson.date);
          lesson.material_title = 1;
        });
        this.lessons = data.classe.lesson;
        this.empty = !data.classe.lesson.length;
        this.materials = data.materials;
      } catch (e) {
        this.$toasted.error(
          "Ocorreu um erro ao recuperar as aulas desta turma"
        );
      }
      loader.hide();
    },
    orderLessons(key) {
      this.sortLessons.currentSort = key;
      this.sortLessons.asc = !this.sortLessons.asc;
    },
    orderStudents(key) {
      this.sortStudents.currentSort = key;
      this.sortStudents.asc = !this.sortStudents.asc;
    },
  },
};
</script>
<style scoped>
.table-container {
  min-height: 150px;
}
.material-item {
  background: #fff;
  color: #525f7f;
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
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

.text-medium {
  font-size: 95%;
}
</style>
