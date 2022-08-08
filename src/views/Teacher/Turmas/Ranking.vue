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
              Aqui é possível visualizar o ranking de presença da turma
              <b> {{ classe.title }} </b>.
            </p>
          </div>
        </div>
      </div>
    </base-header>

    <div class="container-fluid mt--7">
      <div class="row">
        <div class="col-xl-4 order-xl-2 mb-5 mb-xl-0">
          <div
            ref="course_image"
            class="card card-profile shadow vld-parent border-0"
          >
            <div class="card-image">
              <img
                class="card-img-top rounded-top"
                :src="classe.background_url || placeholderImg"
                alt="Imagem turma"
              />
              <div class="image-overlay" />
            </div>
            <div class="card-body py-3">
              <h2 class="card-title mb-1">{{ classe.title }}</h2>
              <p class="description mb-0">{{ classe.subtitle }}</p>
              <p v-if="classe.description" class="card-text mt-2 mb-0">
                <span :title="classe.description">{{
                  truncate(classe.description)
                }}</span>
              </p>
              <p v-if="!classe.is_visible" class="mt-2 mb-0">
                <badge v-tooltip="'A turma está oculto'" type="warning">
                  Oculto
                </badge>
              </p>
            </div>
          </div>
        </div>

        <div class="col-xl-8">
          <div
            ref="ranking_table"
            class="card shadow table-container vld-parent"
          >
            <div class="card-header border-0">
              <div class="row align-items-center">
                <div class="col">
                  <h3 class="mb-0">
                    <i class="fas fa-award mr-2" /> Ranking de frequência da
                    turma
                  </h3>
                </div>
                <div class="col">
                  <base-button
                    class="float-right"
                    @click="
                      $router.push(`/professor/turmas/${classe.id}/alunos`)
                    "
                  >
                    <i class="fas fa-edit mr-2" />Alunos
                  </base-button>
                  <base-button
                    class="float-right mr-2"
                    @click="showReportModal = true"
                  >
                    <i class="fas fa-print mr-2" />Relatório
                  </base-button>
                </div>
              </div>
            </div>
            <div class="table-responsive">
              <base-table
                class="table align-items-center table-flush"
                thead-classes="thead-light"
                tbody-classes="list"
                :data="orderedRanking"
                type="hover"
              >
                <template slot="columns">
                  <th>#</th>
                  <th class="cursor-pointer" @click="sort('nane')">
                    Aluno
                    <i
                      :class="[
                        'ml-1 text-primary btn-sort fas',
                        sortControl.asc ? 'fa-caret-down' : 'fa-caret-up',
                      ]"
                      :title="`Ordenar ${
                        sortControl.asc
                          ? 'descendente (Z-A)'
                          : 'ascendente (A-Z)'
                      }`"
                    />
                  </th>
                  <th class="cursor-pointer" @click="sort('completion')">
                    % de presença
                    <i
                      :class="[
                        'ml-1 text-primary btn-sort fas',
                        sortControl.asc ? 'fa-caret-down' : 'fa-caret-up',
                      ]"
                      :title="`Ordenar ${
                        sortControl.asc ? 'decrescente' : 'crescente'
                      }`"
                    />
                  </th>
                </template>
                <template slot-scope="{ row, index }">
                  <td class="py-4">{{ index + 1 }}</td>
                  <td>
                    {{ row.name }}
                    <router-link
                      class="ml-1"
                      title="Abrir aluno"
                      :to="`/professor/usuarios/${row.student_id}/visualizar`"
                    >
                      <i class="fas fa-eye" />
                    </router-link>
                  </td>
                  <td>
                    <div class="d-flex align-items-center">
                      <span class="completion mr-2">{{ row.completion }}%</span>
                      <div>
                        <base-progress
                          :type="getProgressType(row.completion)"
                          :show-percentage="false"
                          :striped="true"
                          :animated="true"
                          class="pt-0"
                          :value="row.completion"
                        />
                      </div>
                      <span class="description text-medium ml-2">
                        {{ row.attendance }} de {{ lessons_count }} aulas
                        presenciadas
                      </span>
                    </div>
                  </td>
                </template>
              </base-table>
              <p v-if="empty" class="text-center text-warning mt-3">
                Nenhum aluno matriculado até o momento.
              </p>
            </div>
          </div>
          <div v-if="!empty" class="col-12 text-muted text-right mt-3">
            <b>{{ ranking.length }}</b> alunos exibidos no total.
          </div>
        </div>
      </div>
    </div>
    <modal
      :show.sync="showReportModal"
      modal-classes="modal-dialog-centered modal-lg"
      body-classes="pb-0"
      header-classes="pb-0"
    >
      <template>
        <form role="form">
          <div class="row mx-1 justify-content-between">
            <h6 class="heading-small text-muted mb-4">Gerar relatório</h6>
            <h6
              class="heading-small mb-4 cursor-pointer"
              @click="showReportModal = false"
            >
              x
            </h6>
          </div>
          <div class="row ml-lg-2">
            <div class="col-lg-12">
              <base-checkbox
                v-model="usePeriod"
                class="custom-control-alternative text-left mr-1 mb-4"
              >
                <span class="ml--3"> Selecionar período </span>
                <i
                  v-tooltip="
                    'Padrão: ' +
                    formatDate(classe.start_at) +
                    ' até ' +
                    formatDate(classe.end_at)
                  "
                  class="fas fa-info-circle ml-1"
                />
              </base-checkbox>
            </div>
          </div>
          <div class="row ml-lg-2">
            <div class="col-lg-6">
              <label class="form-control-label d-block"> Data de início </label>
              <base-input
                v-model="startDate"
                addon-left-icon="fas fa-calendar"
                type="date"
                placeholder="Data"
                :disabled="!usePeriod"
              />
            </div>
            <div class="col-lg-6">
              <label class="form-control-label d-block"> Data de fim </label>
              <base-input
                v-model="endDate"
                addon-left-icon="fas fa-calendar"
                type="date"
                placeholder="Data"
                :disabled="!usePeriod"
              />
            </div>
          </div>
          <hr class="mt-2 mb-4" />
          <div v-if="error" class="row ml-lg-2">
            <div class="col-lg-12 text-center">
              <base-alert type="danger">{{ error }}</base-alert>
            </div>
          </div>
        </form>
      </template>

      <template slot="footer">
        <base-button
          type="success"
          text-color="dark"
          class="ml-auto mr-auto text-white"
          :disabled="usePeriod && (!startDate || !endDate)"
          @click="generateAttendanceReport"
        >
          Gerar
        </base-button>
      </template>
    </modal>
  </div>
</template>
<script>
import api from "@/services/api.js";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default {
  name: "RankingProfessor",
  data() {
    return {
      classe: {},
      ranking: [],
      placeholderImg: "/img/pages/default_banner_course.jpg",
      sortControl: {
        currentSort: "completion",
        asc: false,
      },
      lessons_count: 0,
      empty: false,
      showReportModal: false,
      startDate: "",
      endDate: "",
      error: "",
      usePeriod: false,
    };
  },
  computed: {
    orderedRanking() {
      const key = this.sortControl.currentSort;
      const compareFunction = function (a, b) {
        return a[key] > b[key] ? 1 : -1;
      };
      const ranking = [...this.ranking].sort(compareFunction);
      return this.sortControl.asc ? ranking : ranking.reverse();
    },
  },
  watch: {
    usePeriod() {
      this.startDate = "";
      this.endDate = "";
      this.error = "";
    },
    showReportModal() {
      this.startDate = "";
      this.endDate = "";
      this.error = "";
    },
  },
  async mounted() {
    this.loadCourse();
    this.loadRanking();
  },
  methods: {
    formatDate(date) {
      date = date ? new Date(date) : new Date();
      return (
        date.getDate().toLocaleString("en-US", {
          minimumIntegerDigits: 2,
          useGrouping: false,
        }) +
        "/" +
        (date.getMonth() + 1).toLocaleString("en-US", {
          minimumIntegerDigits: 2,
          useGrouping: false,
        }) +
        "/" +
        date.getFullYear()
      );
    },
    async generateAttendanceReport() {
      try {
        const { data } = await api.get(
          `/teacher/classes/${this.$route.params.id}/attendance-report?startDate=${this.startDate}&endDate=${this.endDate}`
        );

        const currentDate = this.formatDate();
        this.startDate = this.formatDate(data.startDate);
        this.endDate = this.formatDate(data.endDate);

        const doc = new jsPDF("landscape");

        const classDates = data.lessonTimestamps.map((d) =>
          d.replace(" ", "\n")
        );

        let rows = [];
        for (const [i, student] of data.students.entries()) {
          let newStudent = [
            i + 1,
            student.name,
            ...student.student_attendance.map((a) => (a.present ? "P" : "A")),
            parseFloat((student.attendance_percentage * 100).toFixed(2)) + "%",
          ];
          rows.push(newStudent);
        }

        const logoPath = "/img/brand/orquestrando_logo.png";

        doc.addImage(logoPath, "PNG", 10, 5, 50, 15.325);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);

        doc.text(70, 10, "Relatório de presenças".toUpperCase());
        doc.setFont("helvetica", "normal");
        doc.setFontSize("13");
        doc.text(70, 17, "Professor(a): " + data.teacherName);
        doc.text(70, 22, "Turma: " + data.className);
        doc.text(10, 32, "Data de emissão: " + currentDate);
        doc.text(10, 37, "Período: " + this.startDate + " até " + this.endDate);

        autoTable(doc, {
          headStyles: { fillColor: [24, 44, 76] },
          styles: { halign: "center" },
          startY: 45,
          head: [["#", "ALUNO", ...classDates, "% DE PRESENÇA"]],
          body: rows,
        });

        //doc.save(this.classe.title + " - Relatório de frequência.pdf");
        doc.setProperties({
          title: this.classe.title + " - Relatório de frequência.pdf",
        });
        window.open(doc.output("bloburl"));

        this.showReportModal = false;
      } catch (err) {
        this.error = "Ocorreu um erro ao gerar o relatório";
      }
    },
    truncate(text, stop = 150, clamp = "...") {
      if (!text) return "N/A";
      return text.slice(0, stop) + (stop < text.length ? clamp : "");
    },
    async loadCourse() {
      const loader = this.$loading.show({
        container: this.$refs.course_image,
        width: 90,
        height: 90,
      });
      try {
        const { data: classe } = await api.get(
          `/teacher/classes/${this.$route.params.id}`
        );
        this.classe = classe;
      } catch (e) {
        this.$toasted.error(
          "Ocorreu um erro ao recuperar as informações da turma"
        );
        this.$router.push("/professor/turmas");
      }
      loader.hide();
    },
    async loadRanking() {
      const loader = this.$loading.show({
        container: this.$refs.ranking_table,
        width: 90,
        height: 90,
      });
      try {
        const {
          data: { lessons_count, attendance_ranking },
        } = await api.get(`/teacher/classes/${this.$route.params.id}/ranking`);
        this.lessons_count = lessons_count;
        if (!attendance_ranking.length) {
          this.empty = true;
        } else {
          attendance_ranking.forEach((user) => {
            if (!lessons_count) user.completion = 0;
            else
              user.completion = Number(
                ((user.attendance / lessons_count) * 100).toFixed(2)
              );
          });
          this.ranking = attendance_ranking;
        }
      } catch (e) {
        this.$toasted.error(
          "Ocorreu um erro ao recuperar as informações de acesso da turma"
        );
        this.$router.push("/professor/turmas");
      }
      loader.hide();
    },
    sort(key) {
      this.sortControl.currentSort = key;
      this.sortControl.asc = !this.sortControl.asc;
    },
    getProgressType(completion) {
      if (completion <= 15.0) return "danger";
      if (completion <= 30.0) return "warning";
      if (completion <= 45.0) return "default";
      if (completion <= 60.0) return "info";
      if (completion < 100.0) return "primary";
      return "success";
    },
  },
};
</script>
<style scoped>
.opt-btn {
  width: 100% !important;
}

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
