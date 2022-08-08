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
              :to="'/diretoria/atendimentos'"
              class="btn-link font-weight-normal text-white"
              title="Voltar para a listagem de materiais da turma"
            >
              <i class="fas fa-chevron-left mr-1" />
              Voltar
            </router-link>
          </div>
          <div class="col-lg-7 col-md-10">
            <p class="text-white mt-4 mb-2">
              Aqui é possível editar um atendimento.
            </p>
          </div>
        </div>
      </div>
    </base-header>

    <div class="container-fluid mt--7">
      <div class="row">
        <div class="col-xl-8">
          <card shadow>
            <div slot="header" class="bg-white border-0">
              <div class="row align-items-center">
                <div class="col-12">
                  <h3 class="mb-0">
                    <i class="fas fa-comments mr-2" /> Novo atendimento
                  </h3>
                </div>
              </div>
            </div>
            <template>
              <form role="form">
                <div class="row ml-lg-2">
                  <div class="col-lg-12">
                    <base-input
                      v-model.trim="model.appointment.name"
                      label="Nome do entrevistado*"
                      placeholder="Digite o nome"
                    />
                  </div>
                </div>

                <div class="row ml-lg-2 pb-4">
                  <div
                    ref="appointmentTypes_container"
                    class="col-lg-8 vld-parent"
                  >
                    <label class="form-control-label d-block">
                      Tipo de atendimento*
                    </label>
                    <select
                      v-model="model.appointment.appointmenttype_id"
                      class="form-control"
                    >
                      <option selected value="">Nenhum tipo selecionado</option>
                      <option
                        v-for="appointmentType in appointmentTypes"
                        :key="appointmentType.id"
                        :value="appointmentType.id"
                      >
                        {{ appointmentType.title }}
                      </option>
                    </select>
                  </div>
                  <div class="col-lg-4 text-center text-lg-left">
                    <br />
                    <base-button
                      type="default"
                      class="mt-1"
                      @click="modalNewSection.show = true"
                    >
                      <i class="fas fa-plus mr-1" />
                      Novo tipo de atendimento
                    </base-button>
                  </div>
                </div>

                <div class="row ml-lg-2">
                  <div class="col-lg-12 mt-1">
                    <base-input label="Ação (descrição do atendimento)">
                      <textarea
                        v-model="model.appointment.action"
                        rows="2"
                        class="form-control"
                        placeholder="Escreva aqui..."
                      />
                    </base-input>
                  </div>
                </div>

                <div class="row ml-lg-2">
                  <div class="col-lg-6 mt-1">
                    <label class="form-control-label d-block">
                      Data do atendimento*
                      <base-button
                        size="sm"
                        type="link"
                        class="p-0 m-0 ml-2 float-right"
                        @click="setCurrentDate"
                      >
                        Usar data atual
                      </base-button>
                    </label>
                    <base-input
                      v-model="model.appointment.date"
                      type="date"
                      placeholder="Data do atendimento"
                      input-classes="form-control"
                      addon-left-icon="ni ni-calendar-grid-58"
                    />
                  </div>
                </div>

                <div class="text-center">
                  <hr class="my-4" />
                  <div v-if="error" class="row ml-lg-2">
                    <div class="col-lg-12 text-center">
                      <base-alert type="danger">{{ error }}</base-alert>
                    </div>
                  </div>
                  <base-button
                    type="primary"
                    :custom="true"
                    :disabled="!isValidModel"
                    @click="handleOpenModalConfirmation"
                  >
                    Editar atendimento
                  </base-button>
                </div>
              </form>
            </template>
          </card>
        </div>
      </div>
    </div>
    <modal
      :show.sync="modalConfirmation.show"
      modal-classes="modal-default modal-dialog-centered"
    >
      <h6 id="modal-title-notification" slot="header" class="modal-title">
        Atenção!
      </h6>
      <div ref="modal_confirmation" class="vld-parent">
        <div class="py-3 text-center">
          <i class="fas fa-graduation-cap fa-3x" />
          <h4 class="heading mt-4">Confirmar criação</h4>
          <p class="mt-3 mb-0">
            Você confirma a criação do atendimento
            <span class="font-weight-bold">
              {{ model.appointment.title }}
            </span>
            ?
          </p>
        </div>
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
        <base-button type="white text-success" @click="handleEditAppointment">
          Confirmar criação
        </base-button>
      </template>
    </modal>
    <modal
      :show.sync="modalNewSection.show"
      modal-classes="modal-dialog-centered"
      body-classes="pb-2"
    >
      <h6 id="modal-title-notification" slot="header" class="modal-title">
        Cadastrar novo tipo de atendimento
      </h6>
      <div ref="modal_new_appointmentType" class="vld-parent">
        <div class="pt-0">
          <div class="col-12 text-center mb-4">
            <i class="fas fa-layer-group fa-3x" />
            <h4 class="heading mt-4">Novo tipo de atendimento</h4>
          </div>
          <div class="col-lg-12">
            <base-input
              v-model.trim="model.appointmentType.title"
              label="Título*"
              placeholder="Digite o título"
            />
          </div>
          <div class="col-lg-12">
            <label class="form-control-label d-block">
              Está ativo?
              <i
                v-tooltip="
                  'Os tipos de atendimento <b>ativos</b> ficam visíveis para a diretoria, enquanto um tipo de atendimento <b>inativo</b> fica oculto.'
                "
                class="fas fa-info-circle ml-1"
              />
            </label>
            <base-input>
              <base-switch
                :value="model.appointmentType.is_visible"
                @input="switchChangedSectionHandler($event, 'is_visible')"
              />
            </base-input>
          </div>
          <base-alert
            v-if="modalNewSection.error"
            type="danger"
            class="mb-0 text-center"
          >
            Ocorreu um erro ao cadastrar o novo tipo de atendimento. Tente
            novamente.
          </base-alert>
        </div>
      </div>
      <template slot="footer">
        <base-button
          type="link"
          text-color="default"
          class="ml-auto"
          @click="modalNewSection.show = false"
        >
          Voltar
        </base-button>
        <base-button
          type="primary"
          :custom="true"
          :disabled="!isValidSectionModel"
          @click="handleSubmitNewAppointmentType"
        >
          Cadastrar
        </base-button>
      </template>
    </modal>
  </div>
</template>
<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import api from "@/services/api.js";

export default {
  name: "AppointmentForm",
  components: {},
  data() {
    return {
      model: {
        appointment: {
          name: "",
          appointmenttype_id: "",
          action: "",
          date: "",
        },
        file: null,
        appointmentType: {
          title: "",
          is_visible: true,
        },
      },

      requiredFields: ["name", "date", "appointmenttype_id"],
      appointmentTypeRequiredFields: ["title"],
      modalConfirmation: {
        show: false,
      },
      modalNewSection: {
        show: false,
        error: "",
      },
      appointmentTypes: [],

      error: "",
      editorEdittable: {
        placeholder: "Escreva o texto aqui..",
      },
    };
  },
  computed: {
    isValidModel() {
      const appointment = this.model.appointment;
      for (const key of this.requiredFields) {
        if (appointment[key] === "") return false;
      }
      if (
        appointment.content === "evaluation" &&
        !appointment[appointment.content].length
      )
        return false;
      else if (appointment[appointment.content] === "") return false;
      return true;
    },
    isValidSectionModel() {
      const appointmentType = this.model.appointmentType;
      for (const key of this.appointmentTypeRequiredFields) {
        if (appointmentType[key] === "") return false;
      }
      return true;
    },
  },
  async mounted() {
    const loader = this.$loading.show({
      container: this.$refs.material_form,
      width: 90,
      height: 90,
    });
    try {
      const { data } = await api.get(
        `/admin/appointments/${this.$route.params.id}`
      );
      data.date = this.formatDateYYYYMMDD(data.date);
      this.model.appointment = data;
    } catch (e) {
      this.$toasted.error(
        "Ocorreu um erro ao recuperar as informações do atendimento"
      );
    }
    loader.hide();

    await this.loadAppointmentTypes();
  },
  methods: {
    formatDateYYYYMMDD(date) {
      var data = new Date(date),
        dia = data.getDate().toString().padStart(2, "0"),
        mes = (data.getMonth() + 1).toString().padStart(2, "0"),
        ano = data.getFullYear();
      return ano + "-" + mes + "-" + dia;
    },
    async loadAppointmentTypes() {
      const loader = this.$loading.show({
        container: this.$refs.appointmentTypes_container,
        width: 100,
        height: 100,
      });
      try {
        const { data } = await api.get("/admin/appointments/types");
        if (data.length) this.appointmentTypes = data;
      } catch (e) {
        this.$toasted.error("Ocorreu um erro ao recuperar as informações");
      } finally {
        loader.hide();
      }
    },
    handleOpenModalConfirmation() {
      this.modalConfirmation.show = true;
    },
    async handleEditAppointment(e) {
      e.preventDefault();
      const loader = this.$loading.show({
        container: this.$refs.modal_confirmation,
        width: 90,
        height: 90,
        opacity: 0,
        color: "white",
      });
      this.error = "";
      const model = this.model.appointment;

      try {
        await api.put(`/admin/appointments/${this.$route.params.id}`, model);
        this.$toasted.show("Atendimento editada com sucesso");
        this.$router.push("/diretoria/atendimentos");
      } catch (e) {
        const genericError = "Ocorreu um erro ao cadastrar o atendimento.";
        const hasErrorResponseData = e.response && e.response.data;
        let customError = genericError;
        if (hasErrorResponseData) {
          const data = e.response.data;
          if (data[0] && data[0].message) customError = data[0].message;
          else if (data.message) customError = data.message;
        }
        this.error = hasErrorResponseData ? customError : genericError;
        this.$toasted.error(genericError);
        this.modalConfirmation.show = false;
      }
      loader.hide();
    },
    async handleSubmitNewAppointmentType() {
      this.modalNewSection.error = "";
      const loader = this.$loading.show({
        container: this.$refs.modal_new_appointmentType,
        width: 160,
        height: 160,
        opacity: 0,
      });
      try {
        const { data } = await api.post(
          "/admin/appointments/types",
          this.model.appointmentType
        );
        this.$toasted.show("Nova seção cadastrada com sucesso!");
        this.appointmentTypes = [data, ...this.appointmentTypes];
        if (!this.model.appointment.appointmenttype_id)
          this.model.appointment.appointmenttype_id = data.id;
        this.modalNewSection.show = false;
        this.modalNewSection.error = this.model.appointmentType.title = "";
      } catch (e) {
        this.modalNewSection.error = true;
        const strError = "Ocorreu um erro ao cadastrar a seção.";
        const hasErrorMessage =
          e.response && e.response.data && e.response.data.message;
        this.$toasted.error(
          hasErrorMessage ? e.response.data.message : strError
        );
      }
      loader.hide();
    },

    setCurrentDate() {
      this.model.appointment.date = this.moment().format("YYYY-MM-DD");
    },
  },
};
</script>
<style>
.mf-container-edditable .quill-editor .ql-container,
.mf-container-edditable .quill-editor .ql-container .ql-editor {
  height: 6rem;
  width: 100%;
}
p > strong {
  font-weight: bold !important;
}
</style>
<style scoped>
.cursor {
  cursor: pointer;
}
.appointment-item {
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
</style>
