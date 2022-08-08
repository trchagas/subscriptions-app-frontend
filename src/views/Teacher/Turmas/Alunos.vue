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
              Aqui é possível visualizar todos os alunos matriculados na turma
              <b> {{ classe.title }} </b> e adicionar novos outros.
            </p>
          </div>
        </div>
      </div>
    </base-header>

    <div class="container-fluid mt--7">
      <div class="row">
        <div class="col-xl-12">
          <div
            ref="ranking_table"
            class="card shadow table-container vld-parent"
          >
            <div class="card-header border-0">
              <div class="row align-items-center">
                <div class="col">
                  <h3 class="mb-0">
                    <i class="fa fa-book-reader mr-2" /> Alunos matriculados na
                    turma
                  </h3>
                </div>
              </div>
            </div>
            <div class="table-responsive">
              <base-table
                class="table align-items-center table-flush"
                thead-classes="thead-light"
                tbody-classes="list"
                :data="orderRegistered"
                type="hover"
              >
                <template slot="columns">
                  <th>#</th>
                  <th class="cursor-pointer" @click="sortRegistered('nane')">
                    Aluno
                    <i
                      :class="[
                        'ml-1 text-primary btn-sort fas',
                        sortRegisteredControl.asc
                          ? 'fa-caret-down'
                          : 'fa-caret-up',
                      ]"
                      :title="`Ordenar ${
                        sortRegisteredControl.asc
                          ? 'descendente (Z-A)'
                          : 'ascendente (A-Z)'
                      }`"
                    />
                  </th>
                  <th
                    class="cursor-pointer"
                    @click="sortRegistered('working_area')"
                  >
                    Área de estudo
                    <i
                      :class="[
                        'ml-1 text-primary btn-sort fas',
                        sortRegisteredControl.asc
                          ? 'fa-caret-down'
                          : 'fa-caret-up',
                      ]"
                      :title="`Ordenar ${
                        sortRegisteredControl.asc
                          ? 'descendente (Z-A)'
                          : 'ascendente (A-Z)'
                      }`"
                    />
                  </th>
                  <th
                    class="cursor-pointer"
                    @click="sortRegistered('specialty')"
                  >
                    Especialidade
                    <i
                      :class="[
                        'ml-1 text-primary btn-sort fas',
                        sortRegisteredControl.asc
                          ? 'fa-caret-down'
                          : 'fa-caret-up',
                      ]"
                      :title="`Ordenar ${
                        sortRegisteredControl.asc
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
                    {{ row.name }}
                  </td>
                  <td>
                    {{ row.working_area }}
                  </td>
                  <td>
                    {{ row.specialty || "Não Informado" }}
                  </td>
                  <td>
                    <router-link
                      class="mx-1"
                      title="Abrir aluno"
                      :to="`/professor/usuarios/${row.user_id}/visualizar`"
                    >
                      <i class="fas fa-eye" />
                    </router-link>
                    <i
                      class="fas fa-trash text-red mx-2 cursor-pointer"
                      @click="handleRemove(row)"
                    />
                  </td>
                </template>
              </base-table>
              <p v-if="registeredEmpty" class="text-center text-warning mt-3">
                Nenhum aluno matriculado até o momento.
              </p>
            </div>
          </div>
        </div>
        <div class="col-xl-12 mt-4">
          <div
            ref="ranking_table"
            class="card shadow table-container vld-parent"
          >
            <div class="card-header border-0">
              <div class="row align-items-center">
                <div class="col">
                  <h3 class="mb-0">
                    <i class="fas fa-plus mr-2" /> Alunos disponíveis
                  </h3>
                </div>
              </div>
            </div>
            <div class="table-responsive">
              <base-table
                class="table align-items-center table-flush"
                thead-classes="thead-light"
                tbody-classes="list"
                :data="orderStudents"
                type="hover"
              >
                <template slot="columns">
                  <th>#</th>
                  <th class="cursor-pointer" @click="sortStudents('nane')">
                    Aluno
                    <i
                      :class="[
                        'ml-1 text-primary btn-sort fas',
                        sortStudentsControl.asc
                          ? 'fa-caret-down'
                          : 'fa-caret-up',
                      ]"
                      :title="`Ordenar ${
                        sortStudentsControl.asc
                          ? 'descendente (Z-A)'
                          : 'ascendente (A-Z)'
                      }`"
                    />
                  </th>
                  <th
                    class="cursor-pointer"
                    @click="sortStudents('working_area')"
                  >
                    Área de estudo
                    <i
                      :class="[
                        'ml-1 text-primary btn-sort fas',
                        sortStudentsControl.asc
                          ? 'fa-caret-down'
                          : 'fa-caret-up',
                      ]"
                      :title="`Ordenar ${
                        sortStudentsControl.asc
                          ? 'descendente (Z-A)'
                          : 'ascendente (A-Z)'
                      }`"
                    />
                  </th>
                  <th class="cursor-pointer" @click="sortStudents('specialty')">
                    Especialidade
                    <i
                      :class="[
                        'ml-1 text-primary btn-sort fas',
                        sortStudentsControl.asc
                          ? 'fa-caret-down'
                          : 'fa-caret-up',
                      ]"
                      :title="`Ordenar ${
                        sortStudentsControl.asc
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
                    {{ row.name }}
                  </td>
                  <td>
                    {{ row.working_area }}
                  </td>
                  <td>
                    {{ row.specialty || "Não Informado" }}
                  </td>
                  <td>
                    <router-link
                      class="mx-1"
                      title="Abrir aluno"
                      :to="`/professor/usuarios/${row.user_id}/visualizar`"
                    >
                      <i class="fas fa-eye" />
                    </router-link>
                    <i
                      class="fas fa-plus text-green mx-2 cursor-pointer"
                      @click="handleAdd(row)"
                    />
                  </td>
                </template>
              </base-table>
              <p v-if="studentsEmpty" class="text-center text-warning mt-3">
                Nenhum aluno disponível até o momento.
              </p>
            </div>
          </div>
        </div>
        <div class="col-xl-12 d-flex justify-content-md-center">
          <base-button
            type="success"
            class="mt-3"
            :custom="true"
            @click="modalConfirmation.show = true"
          >
            Salvar alterações
          </base-button>
        </div>
      </div>
    </div>
    <modal
      :show.sync="modalConfirmation.show"
      modal-classes="modal-default modal-dialog-centered"
      body-classes="pb-2"
    >
      <h6 id="modal-title-notification" slot="header" class="modal-title">
        Atenção!
      </h6>
      <div ref="modal_sort" class="vld-parent">
        <div class="text-center">
          <i class="fas fa-arrows-alt-v fa-3x mr-3" />
          <i class="fas fa-book fa-3x" />
          <h4 class="heading mt-4">Confirmar alterações</h4>
          <p class="mt-3">
            Você confirma a alteração dos
            <span class="font-weight-bold">alunos matriculados</span> na turma?
          </p>
        </div>
        <base-alert
          v-if="modalConfirmation.error"
          type="danger"
          class="text-center mb-2"
        >
          Ocorreu um erro ao salvar as alterações. Por favor, tente novamente.
        </base-alert>
      </div>
      <template slot="footer">
        <base-button
          type="link"
          text-color="white"
          class="ml-auto"
          @click="modalConfirmation.show = false"
        >
          Voltar
        </base-button>
        <base-button type="white text-success" @click="handleSubmit">
          Confirmar alterações
        </base-button>
      </template>
    </modal>
  </div>
</template>
<script>
import api from "@/services/api.js";

export default {
  data() {
    return {
      classe: {},
      registered: [],
      students: [],
      sortRegisteredControl: {
        currentSort: "name",
        asc: false,
      },
      sortStudentsControl: {
        currentSort: "name",
        asc: false,
      },
      registeredEmpty: false,
      studentsEmpty: false,
      modalConfirmation: { show: false },
    };
  },
  computed: {
    orderRegistered() {
      return this.orderList(this.sortRegisteredControl, this.registered);
    },
    orderStudents() {
      return this.orderList(this.sortStudentsControl, this.students);
    },
  },
  async mounted() {
    this.loadCourse();
  },
  methods: {
    async handleSubmit() {
      const loader = this.$loading.show({
        container: this.$refs.course_image,
        width: 90,
        height: 90,
      });
      try {
        const data = { students_ids: this.registered.map((s) => s.user_id) };
        await api.post(
          `/teacher/classes/${this.$route.params.id}/students`,
          data
        );
        this.$toasted.success("Lista de matriculados atualizada com sucesso");
        this.modalConfirmation.show = false;
      } catch (e) {
        this.$toasted.error(
          "Ocorreu um erro ao recuperar as informações da turma"
        );
        this.$router.push("/professor/turmas");
      }
      loader.hide();
    },
    orderList(obj, lst) {
      const key = obj.currentSort;
      const compareFunction = function (a, b) {
        return a[key] > b[key] ? 1 : -1;
      };
      const ranking = [...lst].sort(compareFunction);
      return obj.asc ? ranking : ranking.reverse();
    },
    handleRemove(row) {
      const index = this.registered.findIndex((s) => s.user_id === row.user_id);
      const [toRemove] = this.registered.splice(index, 1);
      this.students = [...this.students, toRemove];
      this.studentsEmpty = !this.students.length;
      this.registeredEmpty = !this.registered.length;
    },
    handleAdd(row) {
      const index = this.students.findIndex((s) => s.user_id === row.user_id);
      const [toRemove] = this.students.splice(index, 1);
      this.registered = [...this.registered, toRemove];
      this.studentsEmpty = !this.students.length;
      this.registeredEmpty = !this.registered.length;
    },
    async loadCourse() {
      const loader = this.$loading.show({
        container: this.$refs.course_image,
        width: 90,
        height: 90,
      });
      try {
        const { data } = await api.get(
          `/teacher/classes/${this.$route.params.id}/students`
        );
        this.classe = data.classe;
        this.registered = data.classe.student;
        this.registeredEmpty = !data.classe.student.length;
        this.students = data.students;
        this.studentsEmpty = !data.students.length;
      } catch (e) {
        this.$toasted.error(
          "Ocorreu um erro ao recuperar as informações da turma"
        );
        this.$router.push("/professor/turmas");
      }
      loader.hide();
    },
    sortRegistered(key) {
      this.sortRegisteredControl.currentSort = key;
      this.sortRegisteredControl.asc = !this.sortRegisteredControl.asc;
    },
    sortStudents(key) {
      this.sortStudentsControl.currentSort = key;
      this.sortStudentsControl.asc = !this.sortStudentsControl.asc;
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
