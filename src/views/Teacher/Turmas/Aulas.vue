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
              <i class="fas fa-chevron-left mr-1" /> Voltar
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
                <div class="col">
                  <base-button
                    class="float-right"
                    @click="newLessonModal.show = true"
                  >
                    <i class="fas fa-plus mr-2" />Aula
                  </base-button>
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
                      class="fas fa-edit text-info cursor-pointer"
                      @click="handleOpenEdit(row)"
                    />
                    <i
                      class="fas fa-trash text-red mx-2 cursor-pointer"
                      @click="handleOpenDelete(index)"
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
      :show.sync="deleteModal.show"
      modal-classes="modal-default modal-dialog-centered"
    >
      <h6 id="modal-title-notification" slot="header" class="modal-title">
        Atenção!
      </h6>
      <div ref="modal_confirmation_delete" class="vld-parent">
        <div class="py-3 text-center">
          <i class="fa fa-trash fa-3x" />
          <h4 class="heading mt-4">
            Você realmente deseja excluir a aula do dia
            <span class="text-warning">
              {{ deleteModal.lesson.date }}
            </span>
            ?
          </h4>
          <p class="mt-3 mb-0">
            Todas as informações relacionadas a ela serão perdidas.
          </p>
        </div>
      </div>
      <template slot="footer">
        <base-button
          type="link"
          text-color="white"
          class="ml-auto"
          @click="deleteModal.show = false"
        >
          Voltar
        </base-button>
        <base-button type="white text-danger" @click="handleDeleteAula">
          Confirmar exclusão
        </base-button>
      </template>
    </modal>

    <modal
      :show.sync="editModal.show"
      modal-classes="modal-dialog-centered modal-lg"
      body-classes="pb-0"
      header-classes="pb-0"
    >
      <template>
        <form role="form">
          <div class="row mx-1 justify-content-between">
            <h6 class="heading-small text-muted mb-4">Editar aula</h6>
            <h6
              class="heading-small mb-4 cursor-pointer"
              @click="editModal.show = false"
            >
              x
            </h6>
          </div>
          <div class="row ml-lg-2">
            <div class="col-lg-6">
              <label class="form-control-label d-block"> Data </label>
              <base-input
                v-model="editModal.model.date"
                addon-left-icon="fas fa-calendar"
                type="datetime-local"
                placeholder="Data"
              />
            </div>
            <div class="col-lg-6">
              <base-input label="Tipo">
                <select v-model="editModal.model.type" class="form-control">
                  <option value="" selected disabled>
                    Selecione uma opção
                  </option>
                  <option value="Prática">Prática</option>
                  <option value="Teórica">Teórica</option>
                  <option value="Teoria-Prática">Teoria-Prática</option>
                </select>
              </base-input>
            </div>
            <div class="col-lg-6">
              <base-input
                v-model.trim="editModal.model.description"
                label="Resumo"
                placeholder="Ex.: Introdução da disciplina"
              />
            </div>
            <div class="col-lg-6">
              <base-input label="Material Relacionado (opcional)">
                <select
                  v-model="editModal.model.material_id"
                  class="form-control"
                >
                  <option value="" selected disabled>
                    Selecione uma opção
                  </option>
                  <template v-for="material of materials">
                    <option :key="material.id" :value="material.id">
                      {{ material.title }}
                    </option>
                  </template>
                </select>
              </base-input>
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
            <th>
              <div class="d-flex row align-items-center">
                Presença
                <base-checkbox
                  disabled
                  :checked="true"
                  class="ml-2"
                  @click="markAll()"
                />
              </div>
            </th>
          </template>
          <template slot-scope="{ row, index }">
            <td class="py-4">{{ index + 1 }}</td>
            <td>
              {{ row.name }}
              <router-link
                class="ml-1"
                title="Abrir aluno"
                :to="`/professor/usuarios/${row.id}/visualizar`"
              >
                <i class="fas fa-eye" />
              </router-link>
            </td>
            <td>
              <base-checkbox
                v-model="row.present"
                class="mb-2 mr-1"
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
          type="success"
          text-color="dark"
          class="ml-auto mr-auto text-white"
          @click="handleEditLesson"
        >
          Salvar
        </base-button>
      </template>
    </modal>
    <modal
      :show.sync="newLessonModal.show"
      modal-classes="modal-dialog-centered modal-lg"
      body-classes="pb-0"
      header-classes="pb-0"
    >
      <template>
        <form role="form">
          <div class="row mx-1 justify-content-between">
            <h6 class="heading-small text-muted mb-4">Cadastrar aula</h6>
            <h6
              class="heading-small mb-4 cursor-pointer"
              @click="newLessonModal.show = false"
            >
              x
            </h6>
          </div>
          <div class="row ml-lg-2">
            <div class="col-lg-6">
              <label class="form-control-label d-block"> Data </label>
              <base-input
                v-model="newLessonModal.model.date"
                addon-left-icon="fas fa-calendar"
                type="datetime-local"
                placeholder="Data"
              />
            </div>
            <div class="col-lg-6">
              <base-input label="Tipo">
                <select
                  v-model="newLessonModal.model.type"
                  class="form-control"
                >
                  <option value="" selected disabled>
                    Selecione uma opção
                  </option>
                  <option value="Prática">Prática</option>
                  <option value="Teórica">Teórica</option>
                  <option value="Teoria-Prática">Teoria-Prática</option>
                </select>
              </base-input>
            </div>
            <div class="col-lg-6">
              <base-input
                v-model.trim="newLessonModal.model.description"
                label="Resumo"
                placeholder="Ex.: Introdução da disciplina"
              />
            </div>
            <div class="col-lg-6">
              <base-input label="Material Relacionado (opcional)">
                <select
                  v-model="newLessonModal.model.material_id"
                  class="form-control"
                >
                  <option value="" selected disabled>
                    Selecione uma opção
                  </option>
                  <template v-for="material of materials">
                    <option :key="material.id" :value="material.id">
                      {{ material.title }}
                    </option>
                  </template>
                </select>
              </base-input>
            </div>
          </div>
          <hr class="mt-2 mb-4" />
          <div v-if="newLessonModal.error" class="row ml-lg-2">
            <div class="col-lg-12 text-center">
              <base-alert type="danger">{{ newLessonModal.error }}</base-alert>
            </div>
          </div>
        </form>
      </template>
      <template slot="footer">
        <base-button
          type="success"
          text-color="dark"
          class="ml-auto mr-auto text-white"
          @click="handleNewLesson"
        >
          Salvar
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
        currentSort: "name",
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
    async handleEditLesson() {
      const loader = this.$loading.show({
        container: this.$refs.course_image,
        width: 90,
        height: 90,
      });
      try {
        const reqData = this.editModal.model;
        const retStud = { presences: this.editModal.students };
        await api.put(
          `/teacher/classes/${this.$route.params.id}/lessons/${this.editModal.model.id}`,
          reqData
        );
        await api.put(
          `/teacher/classes/${this.$route.params.id}/lessons/${this.editModal.model.id}/presence`,
          retStud
        );

        this.$toasted.success("Aula salva com sucesso");
      } catch (e) {
        this.$toasted.error(
          "Ocorreu um erro ao recuperar as informações da turma"
        );
      }
      loader.hide();
    },
    async handleNewLesson() {
      const loader = this.$loading.show({
        container: this.$refs.course_image,
        width: 90,
        height: 90,
      });
      try {
        const reqData = this.newLessonModal.model;
        const { data } = await api.post(
          `/teacher/classes/${this.$route.params.id}/lessons`,
          reqData
        );
        this.$toasted.success("Aula salva com sucesso");
        this.lessons = [...this.lessons, data];
        this.newLessonModal.show = false;
        this.empty = false;
        for (const key in this.newLessonModal.model)
          this.newLessonModal.model[key] = "";
      } catch (e) {
        this.$toasted.error(
          "Ocorreu um erro ao recuperar as informações da turma"
        );
      }
      loader.hide();
    },
    handleOpenDelete(index) {
      this.deleteModal.lesson = this.lessons[index];
      this.deleteModal.show = true;
      this.deleteModal.index = index;
    },
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
            `/teacher/classes/${this.classe.id}/lessons/${row.id}/presence`
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
    async handleDeleteAula() {
      const loader = this.$loading.show({
        container: this.$refs.lessons_table,
        width: 90,
        height: 90,
      });
      try {
        const lesson = this.deleteModal.lesson;
        await api.delete(
          `/teacher/classes/${this.classe.id}/lessons/${lesson.id}`
        );
        this.$toasted.success("Aula apagada com sucesso");
        this.lessons.splice(this.deleteModal.index, 1);
        this.empty = !this.lessons.length;
        this.deleteModal.show = false;
      } catch (e) {
        this.$toasted.error("Ocorreu um erro ao apagar a aula");
      }
      loader.hide();
    },
    formatDate(date) {
      const lenght = date.length;
      return date.substring(0, lenght - 6);
    },
    async loadLessons() {
      const loader = this.$loading.show({
        container: this.$refs.lessons_table,
        width: 90,
        height: 90,
      });
      try {
        const { data } = await api.get(
          `/teacher/classes/${this.$route.params.id}/lessons`
        );
        this.classe = data.classe;
        data.classe.lesson.forEach(
          (lesson) => (lesson.date = this.formatDate(lesson.date))
        );
        this.lessons = data.classe.lesson;
        this.empty = !data.classe.lesson.length;
        this.materials = data.materials;
      } catch (e) {
        this.$toasted.error(
          "Ocorreu um erro ao recuperar as aulas desta turma"
        );
        this.$router.push("/professor/turmas");
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
    markAll() {
      const oneUnmarked = this.editModal.students.some(
        (student) => !student.present
      );
      if (oneUnmarked)
        this.editModal.students.forEach((student) => (student.present = true));
      else
        this.editModal.students.forEach((student) => (student.present = false));
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
