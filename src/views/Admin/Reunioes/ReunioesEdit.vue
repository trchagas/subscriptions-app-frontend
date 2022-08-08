<template>
  <div>
    <base-header type="gradient-default" class="header pb-8 py-5 pt-md-8">
      <div class="container-fluid d-flex align-items-center">
        <div class="row">
          <div class="col-12 mt-0 mt-md-4 mt-lg-0 d-block">
            <router-link
              :to="'/diretoria/reunioes'"
              class="btn-link font-weight-normal text-white"
              title="Voltar para a listagem de alunos"
            >
              <i class="fas fa-chevron-left mr-1" /> Voltar
            </router-link>
          </div>
          <div class="col-lg-7 col-md-10">
            <p class="text-white mt-4 mb-2">
              Aqui é possível editar uma reunião pré cadastrada no sistema. É
              possível descrever o assunto, uma descrição e a data determinada
              da reunião. Após a reunião, é possível anexar uma ATA à reunião.
            </p>
          </div>
        </div>
      </div>
    </base-header>
    <div class="container-fluid mt--7">
      <div class="row">
        <div class="col-xl-10 col-lg-12">
          <div class="card shadow mb-3">
            <div class="card-header bg-transparent row">
              <div class="col-9">
                <h3 class="mb-0">
                  <i class="far fa-calendar-check mr-2" />
                  Editar reunião
                </h3>
              </div>
              <base-button
                type="danger"
                size="sm"
                class="float-right mt-md--1 mt-sm--1"
                icon="fas fa-trash"
                @click="handleShowModalDelete"
              >
                Excluir Reunião
              </base-button>
            </div>
            <div ref="publicacao_container" class="card-body vld-parent">
              <h6 class="heading-small text-muted mb-4">Informações básicas</h6>
              <div class="row pl-lg-4">
                <div class="col-lg-6">
                  <base-input
                    v-model="model.subject"
                    label="Assunto"
                    placeholder="Assunto da reunião"
                  />
                </div>
                <div class="col-lg-6">
                  <base-input
                    v-model="model.description"
                    label="Descrição (opcional)"
                    placeholder="Descrição da reunião"
                  />
                </div>

                <div class="col-lg-6">
                  <base-input
                    v-model="model.responsible"
                    label="Responsável (opcional)"
                    placeholder="Responsável da reunião"
                  />
                </div>
                <div class="col-lg-6">
                  <base-input
                    v-model="model.local"
                    label="Local (opcional)"
                    placeholder="Local ou link externo da reunião"
                  />
                </div>
                <div class="col-lg-6">
                  <label class="form-control-label">Data</label>
                  <base-input
                    v-model="model.date"
                    type="datetime-local"
                    placeholder="Digite a data"
                    addon-left-icon="far fa-calendar-alt"
                  />
                </div>
                <div class="col-lg-6">
                  <label class="form-control-label">Duração (opcional)</label>
                  <base-input addon-left-icon="far fa-clock">
                    <select v-model="model.duration" class="form-control">
                      <option selected disabled value="">
                        Selecione a duração da reunião
                      </option>
                      <option
                        v-for="duration in durations"
                        :key="duration.key"
                        :value="duration.key"
                      >
                        {{ duration.value }}
                      </option>
                    </select>
                  </base-input>
                </div>
                <div class="col-lg-6">
                  <base-input
                    v-model="model.tags"
                    label="Tags (opcional)"
                    placeholder="Tags - separe-as por ;"
                  />
                </div>
                <div class="col-lg-12">
                  <label class="form-control-label"> ATA da reunião </label>
                  <div class="np-container-edditable">
                    <quill-editor
                      v-model="model.report"
                      :options="editorEdittable"
                    />
                  </div>
                </div>
              </div>
              <hr class="my-4" />
              <h6 class="heading-small text-muted mb-4">Participantes</h6>
              <div class="row pl-lg-4">
                <div class="col-lg-6 mt-3">
                  <div class="d-flex flex-row">
                    <model-select
                      v-model="professor"
                      placeholder="Professores"
                      class="participants_select w-100"
                      :is-disabled="model.teacher"
                      :options="professores"
                    />
                    <div class="d-flex align-items-center ml-1">
                      <base-checkbox
                        v-model="model.teacher"
                        class="p-0 ml-5 mr--4"
                        name="professor"
                      />
                    </div>
                  </div>
                </div>
                <div class="col-lg-6 mt-3">
                  <div class="d-flex flex-row">
                    <model-select
                      v-model="parceiro"
                      placeholder="Parceiros"
                      class="participants_select w-100"
                      :is-disabled="model.partner"
                      :options="parceiros"
                    />
                    <div class="d-flex align-items-center ml-1">
                      <base-checkbox
                        v-model="model.partner"
                        class="p-0 ml-5 mr--4"
                        name="parceiro"
                      />
                    </div>
                  </div>
                </div>
                <div class="col-lg-6 mt-3">
                  <div class="d-flex flex-row">
                    <model-select
                      v-model="associado"
                      placeholder="Associados"
                      class="participants_select w-100"
                      :is-disabled="model.associate"
                      :options="associados"
                    />
                    <div class="d-flex align-items-center ml-1">
                      <base-checkbox
                        v-model="model.associate"
                        class="p-0 ml-5 mr--4"
                        name="associado"
                      />
                    </div>
                  </div>
                </div>
                <div class="col-lg-6 mt-3">
                  <div class="d-flex flex-row">
                    <model-select
                      v-model="voluntario"
                      placeholder="Voluntarios"
                      class="participants_select w-100"
                      :is-disabled="model.volunteer"
                      :options="voluntarios"
                    />
                    <div class="d-flex align-items-center ml-1">
                      <base-checkbox
                        v-model="model.volunteer"
                        class="p-0 ml-5 mr--4"
                        name="voluntario"
                      />
                    </div>
                  </div>
                </div>
                <div class="col-lg-12 mt-4">
                  <label class="form-control-label"> Participantes </label>
                  <div
                    class="ui fluid dropdown selection multiple participants"
                  >
                    <a v-if="!participantes.length" class="text default">
                      Lista de participantes
                    </a>
                    <a
                      v-for="(participante, idx) in participantes"
                      :key="participante.value"
                      class="ui label transition visible"
                    >
                      {{ participante.text }}
                      <i class="delete icon" @click="delParticipante(idx)" />
                    </a>
                  </div>
                </div>
              </div>
              <div v-if="error" class="row mt-4">
                <div class="col-12 text-center">
                  <base-alert type="danger">{{ error }}</base-alert>
                </div>
              </div>
              <div class="row mt-4 text-right">
                <div class="col-12">
                  <base-button
                    type="primary"
                    :disabled="!isValidModel"
                    @click="handleSubmit()"
                  >
                    Salvar reunião
                  </base-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <modal
      :show.sync="showModalDelete"
      modal-classes="modal-default modal-dialog-centered"
    >
      <h6 id="modal-title-notification" slot="header" class="modal-title">
        Atenção!
      </h6>
      <div ref="modal_confirmation_delete" class="vld-parent">
        <div class="py-3 text-center">
          <i class="fa fa-trash fa-3x" />
          <h4 class="heading mt-4">
            Você realmente deseja excluir a reunião referente ao evento
            <span class="text-warning">
              {{ model.subject }}
            </span>
            ?
          </h4>
          <p class="mt-3 mb-0">
            Todas as informações relacionadas a ele serão perdidas.
          </p>
        </div>
      </div>
      <template slot="footer">
        <base-button
          type="link"
          text-color="white"
          class="ml-auto"
          @click="showModalDelete = false"
        >
          Voltar
        </base-button>
        <base-button type="white text-danger" @click="handleDeleteMeeting">
          Confirmar exclusão
        </base-button>
      </template>
    </modal>
  </div>
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";
import { ModelSelect } from "vue-search-select";
import "vue-search-select/dist/VueSearchSelect.css";

import "vue-select/dist/vue-select.css";

import api from "@/services/api";

export default {
  components: {
    ModelSelect,
    quillEditor,
  },
  data() {
    return {
      professor: "",
      parceiro: "",
      associado: "",
      voluntario: "",
      model: {
        id: "",
        subject: "",
        description: "",
        responsible: "",
        duration: "",
        local: "",
        tags: "",
        date: "",
        report: "",
        teacher: false,
        partner: false,
        associate: false,
        volunteer: false,
      },
      participantes: [],
      professores: [],
      associados: [],
      parceiros: [],
      voluntarios: [],
      durations: [
        { value: "15 minutos", key: 15 },
        { value: "30 minutos", key: 30 },
        { value: "45 minutos", key: 45 },
        { value: "1 hora", key: 60 },
        { value: "1 hora e 30 minutos", key: 90 },
        { value: "2 horas", key: 120 },
        { value: "2 horas e 30 minutos", key: 150 },
        { value: "3 horas", key: 180 },
      ],
      requiredFields: ["subject", "date"],
      showModalDelete: false,
      editorEdittable: {
        placeholder:
          "Escreva aqui... (lembre-se, se necessário, você pode linkar arquivos pelo editor)",
      },
      error: "",
    };
  },
  computed: {
    isValidModel() {
      const data = this.model;
      for (const key of this.requiredFields) {
        if (!data[key]) return false;
      }
      return true;
    },
  },
  watch: {
    professor() {
      if (!this.professor) return;

      const newTeacher = this.professores.find(
        (p) => p.value === this.professor
      );
      this.participantes = [...this.participantes, newTeacher];
      this.professores = this.professores.filter(
        (p) => p.value !== newTeacher.value
      );
      this.professor = null;
    },
    parceiro() {
      if (!this.parceiro) return;

      const newTeacher = this.parceiros.find((p) => p.value === this.parceiro);
      this.participantes = [...this.participantes, newTeacher];
      this.parceiros = this.parceiros.filter(
        (p) => p.value !== newTeacher.value
      );
      this.parceiro = null;
    },
    voluntario() {
      if (!this.voluntario) return;

      const newTeacher = this.voluntarios.find(
        (p) => p.value === this.voluntario
      );
      this.participantes = [...this.participantes, newTeacher];
      this.voluntarios = this.voluntarios.filter(
        (p) => p.value !== newTeacher.value
      );
      this.voluntario = null;
    },
  },
  async mounted() {
    const loader = this.$loading.show({
      container: this.$refs.publicacao_container,
      width: 90,
      height: 90,
    });
    try {
      this.model.id = this.$route.params.id;
      const { data: users } = await api.get("/admin/meetings/users");
      const { data } = await api.get(`/admin/meetings/${this.model.id}`);
      data.meeting.teacher = Boolean(data.meeting.teacher);
      data.meeting.volunteer = Boolean(data.meeting.volunteer);
      data.meeting.partner = Boolean(data.meeting.partner);
      data.meeting.associate = Boolean(data.meeting.associate);
      data.meeting.date = this.formatDate(data.meeting.date);
      this.model = data.meeting;
      this.participantes = [
        ...data.teachers.map((t) => ({
          value: t.user_id,
          text: t.name,
          type: "teacher",
        })),
        ...data.volunteers.map((t) => ({
          value: t.user_id,
          text: t.name,
          type: "volunteer",
        })),
        ...data.partners.map((t) => ({
          value: t.user_id,
          text: t.name,
          type: "partner",
        })),
        ...data.associates.map((t) => ({
          value: t.user_id,
          text: t.name,
          type: "associate",
        })),
      ];
      this.professores = users.teachers
        .filter((u) => !this.participantes.find((p) => p.value === u.user_id))
        .map((t) => ({
          value: t.user_id,
          text: t.name,
          type: "teacher",
        }));
      this.voluntarios = users.volunteers
        .filter((u) => !this.participantes.find((p) => p.value === u.user_id))
        .map((t) => ({
          value: t.user_id,
          text: t.name,
          type: "volunteer",
        }));
      this.parceiros = users.partners
        .filter((u) => !this.participantes.find((p) => p.value === u.user_id))
        .map((t) => ({
          value: t.user_id,
          text: t.name,
          type: "partner",
        }));
      this.associados = users.associates
        .filter((u) => !this.participantes.find((p) => p.value === u.user_id))
        .map((t) => ({
          value: t.user_id,
          text: t.name,
          type: "associate",
        }));
    } catch (e) {
      const genericError =
        "Ocorreu um erro ao buscar os usuários. Tente novamente mais tarde.";
      const hasErrorResponseData = e.response && e.response.data;
      let customError = genericError;
      if (hasErrorResponseData) {
        const data = e.response.data.error
          ? e.response.data.error
          : e.response.data.errors;
        if (data[0] && data[0].message) customError = data[0].message;
        else if (data.message) customError = data.message;
      }
      this.error = hasErrorResponseData ? customError : genericError;
      this.$toasted.error(genericError);
    } finally {
      loader.hide();
    }
  },
  methods: {
    formatDate(date) {
      const lenght = date.length;
      return date.substring(0, lenght - 1);
    },
    delParticipante(index) {
      const mapPart = {
        teacher: "professores",
        partner: "parceiros",
        associate: "associados",
        volunteer: "voluntarios",
      };

      const [newParticipante] = this.participantes.splice(index, 1);
      this[mapPart[newParticipante.type]] = [
        ...this[mapPart[newParticipante.type]],
        newParticipante,
      ];
    },
    async handleSubmit() {
      this.error = "";
      const loader = this.$loading.show({
        container: this.$refs.publicacao_container,
        width: 90,
        height: 90,
      });
      try {
        const data = {
          ...this.model,
          participants: this.participantes.map((p) => p.value),
        };
        await api.put(`/admin/meetings/${this.model.id}`, data);
        this.$toasted.show("Reunião salva com sucesso");
        this.$router.push("/diretoria/reunioes");
      } catch (e) {
        const genericError =
          "Ocorreu um erro ao salvar a reunião. Por favor, verifique os campos e tente novamente.";
        const hasErrorResponseData = e.response && e.response.data;
        let customError = genericError;
        if (hasErrorResponseData) {
          const data = e.response.data.error
            ? e.response.data.error
            : e.response.data.errors;
          if (data[0] && data[0].message) customError = data[0].message;
          else if (data.message) customError = data.message;
        }
        this.error = hasErrorResponseData ? customError : genericError;
        this.$toasted.error("Ocorreu um erro ao salvar a reunião");
      } finally {
        loader.hide();
      }
    },
    async handleDeleteMeeting() {
      this.error = "";
      const loader = this.$loading.show({
        container: this.$refs.publicacao_container,
        width: 90,
        height: 90,
      });
      try {
        await api.delete(`/admin/meetings/${this.model.id}`);
        this.$toasted.show("Reunião excluída com sucesso");
        this.$router.push("/diretoria/reunioes");
      } catch (e) {
        const genericError =
          "Ocorreu um erro ao apagar a reunião. Por favor, tente novamente mais tarde.";
        const hasErrorResponseData = e.response && e.response.data;
        let customError = genericError;
        if (hasErrorResponseData) {
          const data = e.response.data.error
            ? e.response.data.error
            : e.response.data.errors;
          if (data[0] && data[0].message) customError = data[0].message;
          else if (data.message) customError = data.message;
        }
        this.error = hasErrorResponseData ? customError : genericError;
        this.$toasted.error("Ocorreu um erro ao apagar a reunião");
      } finally {
        loader.hide();
      }
    },
    handleShowModalDelete() {
      this.showModalDelete = true;
    },
  },
};
</script>
<style>
p > strong {
  font-weight: bold !important;
}

.np-container-edditable .quill-editor .ql-container,
.np-container-edditable .quill-editor .ql-container .ql-editor {
  height: 6rem;
  width: 100%;
}
</style>
<style>
.categories_select.v-select {
  background-color: #fff;
  background-clip: padding-box;
}
.categories_select.v-select .vs__dropdown-toggle {
  padding: 0.5rem 0.1rem;
  min-width: 100%;
}
.categories_select.v-select
  .vs__dropdown-toggle
  .vs__selected-options
  .vs__search {
  color: #8898aa;
  font-weight: 400;
  line-height: 1.5;
  font-size: 0.875rem;
}
</style>
