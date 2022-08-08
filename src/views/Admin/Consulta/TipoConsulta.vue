<template>
  <div>
    <base-header type="gradient-default" class="pb-6 pb-8 pt-5 pt-md-8">
      <!-- Mask -->
      <span class="bg-gradient-default opacity-8" />
      <!-- Header container -->
      <div class="container-fluid d-flex align-items-center">
        <div class="row">
          <div class="col-12 mt-0 mt-md-4 mt-lg-0 d-block">
            <router-link
              :to="`/diretoria/atendimentos`"
              class="btn-link font-weight-normal text-white"
              title="Voltar para a listagem de atendimentos"
            >
              <i class="fas fa-chevron-left mr-1" />
              Voltar
            </router-link>
          </div>
          <div class="col-lg-8 col-md-10">
            <p class="text-white my-3">
              Aqui você pode gerenciar os tipos de atendimento, o que inclui
              visualizar os tipos cadastrados, cadastrar novos ou excluir tipos
              já cadastrados.
            </p>
          </div>
        </div>
      </div>
    </base-header>
    <div class="container-fluid mt--7">
      <div class="row">
        <div class="col-lg-8">
          <div class="row mb-4">
            <div class="col-12">
              <card shadow type="secondary">
                <div slot="header" class="bg-white border-0">
                  <div class="row align-items-center">
                    <div class="col-8">
                      <h3 class="mb-0">
                        <i class="fas fa-layer-group mr-2" /> Novo
                        <span class="text-warning">tipo de atendimento</span>
                      </h3>
                    </div>
                  </div>
                </div>
                <template>
                  <form role="form">
                    <div class="row ml-1">
                      <h6 class="heading-small text-muted mb-4">
                        Informações básicas
                      </h6>
                    </div>
                    <div class="row ml-lg-2">
                      <div class="col-lg-6">
                        <base-input
                          v-model.trim="model.appointmentType.title"
                          label="Título*"
                          placeholder="Digite o título"
                        />
                      </div>
                      <div class="col-lg-6">
                        <label class="form-control-label d-block">
                          Está ativa?
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
                            @input="switchChangedHandler($event, 'is_visible')"
                          />
                        </base-input>
                      </div>
                    </div>
                    <div class="text-center">
                      <base-button
                        type="primary"
                        class="mt-3"
                        :custom="true"
                        :disabled="!isValidModel"
                        @click="handleOpenModalConfirmation"
                      >
                        Cadastrar
                      </base-button>
                    </div>
                  </form>
                </template>
              </card>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <div class="card shadow flex-grow-1">
                <div ref="secoes_list" class="vld-parent">
                  <div class="card table-container vld-parent">
                    <div class="card-header border-0">
                      <div class="row align-items-center">
                        <div class="col">
                          <h3 class="mb-0">Lista de tipos de atendimento</h3>
                        </div>
                      </div>
                    </div>

                    <div class="table-responsive">
                      <base-table
                        class="table align-items-center table-flush"
                        thead-classes="thead-light"
                        tbody-classes="list"
                        :data="appointmentTypes"
                        type="hover"
                      >
                        <template slot="columns">
                          <th>#</th>
                          <th>Status</th>
                          <th>Título</th>
                          <th>Ações</th>
                        </template>
                        <template slot-scope="{ row, index }">
                          <th scope="row" class="py-4">{{ index + 1 }}</th>
                          <td>
                            <div class="mt-1">
                              <badge
                                v-if="row.is_visible"
                                v-tooltip="
                                  'O tipo de atendimento está visível para a diretoria.'
                                "
                                type="success"
                              >
                                Ativa
                              </badge>
                              <badge
                                v-else
                                v-tooltip="
                                  'O tipo de atendimento está oculta para a diretoria.'
                                "
                                type="warning"
                              >
                                Oculta
                              </badge>
                            </div>
                          </td>
                          <td>
                            <span v-tooltip.bottom="row.title">{{
                              truncate(row.title, 30)
                            }}</span>
                          </td>
                          <td>
                            <base-button
                              v-tooltip.bottom="'Excluir tipo de atendimento'"
                              type="white"
                              size="sm"
                              class="text-danger"
                              @click="handleOpenModalDelete(row)"
                            >
                              <i class="fas fa-trash text-danger" />
                            </base-button>
                            <base-button
                              v-tooltip.bottom="'Editar tipo de atendimento'"
                              type="white"
                              size="sm"
                              class="text-danger"
                              @click="handleOpenModalEdit(row)"
                            >
                              <i class="fas fa-edit text-info" />
                            </base-button>
                          </td>
                        </template>
                      </base-table>
                      <p
                        v-if="!appointmentTypes.length"
                        class="text-center text-warning mt-3"
                      >
                        Não há seções cadastradas na turma até o momento.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
      <div ref="modal_confirmation_create" class="vld-parent">
        <div class="pt-3 text-center">
          <i class="fas fa-layer-group fa-3x" />
          <h4 class="heading mt-4">Confirmar criação</h4>
          <p class="mt-3">
            Você confirma a criação do tipo de atendimento
            <span class="font-weight-bold">
              {{ model.appointmentType.title }}
            </span>
            ?
          </p>
          <base-alert v-if="modalConfirmation.error" type="danger" class="mb-0">
            Ocorreu um erro ao criar o tipo de atendimento. Por favor, tente
            novamente.
          </base-alert>
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
        <base-button type="white text-success" @click="handleSubmitNewSection">
          Confirmar criação
        </base-button>
      </template>
    </modal>
    <modal
      :show.sync="modalRemove.show"
      modal-classes="modal-default modal-dialog-centered"
      body-classes="pb-2"
    >
      <h6 id="modal-title-notification" slot="header" class="modal-title">
        Atenção!
      </h6>
      <div ref="modal_confirmation_remove" class="vld-parent">
        <div class="pt-3 text-center">
          <i class="fas fa-trash fa-3x" />
          <h4 class="heading mt-4">Confirmar remoção</h4>
          <p class="mt-3">
            Você confirma a remoção do tipo de atendimento
            <span class="font-weight-bold">
              {{ modalRemove.appointmentType.title }}
            </span>
            ?
          </p>
          <base-alert v-if="modalRemove.error" type="danger" class="mb-0">
            Ocorreu um erro ao remover o tipo de atendimento. Por favor, tente
            novamente.
          </base-alert>
        </div>
      </div>
      <template slot="footer">
        <base-button
          type="link"
          text-color="white"
          class="ml-auto"
          @click="modalRemove.show = false"
        >
          Voltar
        </base-button>
        <base-button
          type="white text-danger"
          @click="handleRemoveAppointmentType"
        >
          Confirmar exclusão
        </base-button>
      </template>
    </modal>
    <modal
      :show.sync="modalEdit.show"
      modal-classes="modal-dialog-centered"
      body-classes="pb-2"
    >
      <h6 id="modal-title-notification" slot="header" class="modal-title">
        Editar
      </h6>
      <div class="pt-0">
        <div class="col-12 text-center mb-4">
          <i class="fas fa-edit fa-3x" />
          <h4 class="heading mt-4">Editar tipo de atendimento</h4>
        </div>
        <div class="col-lg-12">
          <base-input
            v-model.trim="modalEdit.appointmentType.title"
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
              :value="modalEdit.appointmentType.is_visible"
              @input="switchModalChangedHandler($event)"
            />
          </base-input>
        </div>
        <base-alert
          v-if="modalEdit.error"
          type="danger"
          class="mb-0 text-center"
        >
          Ocorreu um erro ao atualizar o tipo de atendimento. Por favor, tente
          novamente.
        </base-alert>
      </div>
      <template slot="footer">
        <base-button
          type="link"
          text-color="default"
          class="ml-auto"
          @click="modalEdit.show = false"
        >
          Voltar
        </base-button>
        <div class="text-right">
          <base-button
            type="primary"
            :custom="true"
            :disabled="!isValidEditModel"
            @click="handleSubmitUpdate"
          >
            Salvar alterações
          </base-button>
        </div>
      </template>
    </modal>
  </div>
</template>
<script>
import api from "@/services/api.js";
export default {
  name: "SectionForm",
  data() {
    return {
      model: {
        appointmentType: {
          title: "",
          is_visible: true,
        },
      },
      appointmentTypes: [],
      requiredFields: ["title"],
      modalConfirmation: {
        show: false,
        error: "",
      },
      modalRemove: {
        show: false,
        appointmentType: "",
        error: "",
      },
      modalEdit: {
        show: false,
        appointmentType: "",
        error: "",
      },
    };
  },
  computed: {
    isValidModel() {
      const appointmentType = this.model.appointmentType;
      for (const key of this.requiredFields) {
        if (appointmentType[key] === "") return false;
      }
      return true;
    },
    isValidEditModel() {
      const appointmentType = this.modalEdit.appointmentType;
      for (const key of this.requiredFields) {
        if (appointmentType[key] === "") return false;
      }
      return true;
    },
  },
  async mounted() {
    await this.loadAppointmentTypes();
  },
  methods: {
    async loadAppointmentTypes() {
      const loader = this.$loading.show({
        container: this.$refs.secoes_list,
        width: 100,
        height: 100,
      });
      try {
        const { data } = await api.get("/admin/appointments/types");
        this.appointmentTypes = data;
      } catch (e) {
        this.$toasted.error("Ocorreu um erro ao recuperar as informações");
      } finally {
        loader.hide();
      }
    },
    async handleSubmitNewSection() {
      const loader = this.$loading.show({
        container: this.$refs.modal_confirmation_create,
        width: 90,
        height: 90,
        opacity: 0,
        color: "white",
      });
      this.modalConfirmation.error = "";
      try {
        await api.post("/admin/appointments/types", this.model.appointmentType);
        this.$toasted.show("Novo tipo de atendimento cadastrado com sucesso!");
        this.model.appointmentType.is_visible = true;
        this.model.appointmentType.title = "";
        this.modalConfirmation.show = false;
        await this.loadAppointmentTypes();
      } catch (e) {
        this.modalConfirmation.error = true;
        const genericError =
          "Ocorreu um erro ao cadastrar o tipo de atendimento.";
        const hasErrorResponseData = e.response && e.response.data;
        let customError = genericError;
        if (hasErrorResponseData) {
          const data = e.response.data.error
            ? e.response.data.error
            : e.response.data.errors;
          if (data[0] && data[0].message) customError = data[0].message;
          else if (data.message) customError = data.message;
        }
        this.$toasted.error(hasErrorResponseData ? customError : genericError);
      }
      loader.hide();
    },
    async handleSubmitUpdate() {
      const loader = this.$loading.show({
        container: this.$refs.modal_confirmation,
        width: 90,
        height: 90,
        opacity: 0,
        color: "white",
      });
      this.modalEdit.error = "";
      try {
        await api.put(
          `/admin/appointments/types/${this.modalEdit.appointmentType.id}`,
          this.modalEdit.appointmentType
        );
        this.modalEdit.show = false;
        await this.loadAppointmentTypes();
        this.$toasted.show("Tipo de atendimento atualizado com sucesso!");
      } catch (e) {
        this.modalEdit.error = true;
        this.$toasted.error(
          "Ocorreu um erro ao atualizar o tipo de atendimento."
        );
      }
      loader.hide();
    },
    async handleRemoveAppointmentType() {
      const loader = this.$loading.show({
        container: this.$refs.modal_confirmation_remove,
        width: 90,
        height: 90,
        opacity: 0,
        color: "white",
      });
      this.modalRemove.error = "";
      try {
        await api.delete(
          `/admin/appointments/types/${this.modalRemove.appointmentType.id}`
        );
        this.$toasted.show("Tipo de atendimento removido com sucesso!");
        this.modalRemove.show = false;
        await this.loadAppointmentTypes();
      } catch (e) {
        this.modalRemove.error = true;
        this.$toasted.error(
          "Ocorreu um erro ao remover o tipo de atendimento."
        );
      } finally {
        loader.hide();
      }
    },
    handleOpenModalConfirmation() {
      this.modalConfirmation.show = true;
    },
    handleOpenModalEdit(appointmentType) {
      this.modalEdit.error = "";
      this.modalEdit.appointmentType = Object.assign({}, appointmentType);
      this.modalEdit.appointmentType.is_visible = Boolean(
        this.modalEdit.appointmentType.is_visible
      );
      this.modalEdit.show = true;
    },
    handleOpenModalDelete(appointmentType) {
      this.modalRemove.error = "";
      this.modalRemove.appointmentType = appointmentType;
      this.modalRemove.show = true;
    },
    switchChangedHandler(event, obj) {
      if (typeof event === "boolean") this.model.appointmentType[obj] = event;
    },
    switchModalChangedHandler(event) {
      if (typeof event === "boolean")
        this.modalEdit.appointmentType.is_visible = event;
    },
    truncate(text, stop = 30, clamp = "...") {
      if (!text) return "-";
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
