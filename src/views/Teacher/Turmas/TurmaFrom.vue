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
              :to="'/professor/turmas'"
              class="btn-link font-weight-normal text-white"
              title="Voltar para listagem de turmas"
            >
              <i class="fas fa-chevron-left mr-1" /> Voltar
            </router-link>
          </div>
          <div class="col-lg-7 col-md-10">
            <p class="text-white mt-4 mb-2">
              Aqui é possível cadastrar um nova turma. Após o cadastro inicial,
              é possível adicionar materiais e atualizar as informações da turma
              a ser disponibilizada aos alunos.
            </p>
          </div>
        </div>
      </div>
    </base-header>

    <div class="container-fluid mt--7">
      <div class="row">
        <div class="col-xl-8">
          <card shadow type="secondary">
            <div slot="header" class="bg-white border-0">
              <div class="row align-items-center">
                <div class="col-8">
                  <h3 class="mb-0">
                    <i class="fas fa-graduation-cap mr-2" /> Nova Turma
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
                      v-model.trim="model.turma.title"
                      label="Título da turma*"
                      placeholder="Digite o título"
                    />
                  </div>
                  <div class="col-lg-6">
                    <base-input
                      v-model.trim="model.turma.description"
                      label="Descrição"
                      placeholder="Ex.: Turma A"
                    />
                  </div>
                  <div class="col-lg-6">
                    <base-input label="Status*">
                      <select v-model="model.turma.status" class="form-control">
                        <option value="" selected disabled>
                          Selecione uma opção
                        </option>
                        <option value="pendent">Não iniciada</option>
                        <option value="in_progress">Em andamento</option>
                        <option value="finished">Finalizada</option>
                      </select>
                    </base-input>
                  </div>
                  <div class="col-lg-6">
                    <label class="form-control-label d-block">
                      Está visível?
                      <i
                        v-tooltip="
                          'Um turma <b>ativa</b> fica visível para os alunos que possuem acesso, enquanto um turma <b>inativa</b> fica oculto para todos alunos.'
                        "
                        class="fas fa-info-circle ml-1"
                      />
                    </label>
                    <base-input>
                      <base-switch
                        :value="model.turma.is_visible"
                        @input="switchChangedHandler($event, 'is_visible')"
                      />
                    </base-input>
                  </div>
                </div>
                <hr class="mt-2 mb-4" />
                <div class="row ml-lg-2">
                  <div class="col-lg-6">
                    <label class="form-control-label d-block">
                      Data de início
                    </label>
                    <base-input
                      v-model="model.turma.start_at"
                      addon-left-icon="fas fa-calendar"
                      type="date"
                      placeholder="Data de início"
                    />
                  </div>
                  <div class="col-lg-6">
                    <label class="form-control-label d-block">
                      Data de validade
                    </label>
                    <base-input
                      v-model="model.turma.end_at"
                      addon-left-icon="fas fa-calendar"
                      type="date"
                      placeholder="Data de validade"
                    />
                  </div>
                </div>
                <hr class="mt-2 mb-4" />
                <div v-if="error" class="row ml-lg-2">
                  <div class="col-lg-12 text-center">
                    <base-alert type="danger">{{ error }}</base-alert>
                  </div>
                </div>
                <div class="text-right">
                  <base-button
                    type="primary"
                    class="mt-3"
                    :custom="true"
                    :disabled="!isValidModel"
                    @click="handleOpenModalConfirmation"
                  >
                    Cadastrar nova turma
                  </base-button>
                </div>
              </form>
            </template>
          </card>
        </div>
      </div>
    </div>
    <modal
      :show.sync="modals.modalConfirmation"
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
            Você confirma a criação da turma
            <span class="font-weight-bold">{{ model.turma.title }} </span>?
          </p>
        </div>
      </div>
      <template slot="footer">
        <base-button
          type="link"
          text-color="white"
          class="ml-auto"
          @click="modals.modalConfirmation = false"
        >
          Voltar
        </base-button>
        <base-button type="white text-success" @click="handleSubmitNewClasse">
          Confirmar criação
        </base-button>
      </template>
    </modal>
  </div>
</template>
<script>
import api from "@/services/api.js";

export default {
  name: "ClasseForm",
  data() {
    return {
      model: {
        turma: {
          title: "",
          is_visible: false,
          description: "",
          status: "pendent",
          start_at: "",
          end_at: "",
        },
      },
      requiredFields: ["title", "status", "is_visible"],
      modals: {
        modalConfirmation: false,
      },
      error: "",
    };
  },
  computed: {
    isValidModel() {
      const turma = this.model.turma;
      for (const key of this.requiredFields) {
        if (turma[key] === "") return false;
      }
      return true;
    },
  },
  methods: {
    handleOpenModalConfirmation() {
      this.modals.modalConfirmation = true;
    },
    async handleSubmitNewClasse(e) {
      e.preventDefault();
      const loader = this.$loading.show({
        container: this.$refs.modal_confirmation,
        width: 90,
        height: 90,
        opacity: 0,
        color: "white",
      });
      this.error = "";
      try {
        const classeData = this.model.turma;
        const { data } = await api.post("/teacher/classes", classeData);
        this.$toasted.show("Nova turma cadastradra com sucesso");
        this.$router.push(`/professor/turmas/${data.id}/editar`);
      } catch (e) {
        const genericError = "Ocorreu um erro ao cadastrar a turma.";
        const hasErrorResponseData = e.response && e.response.data;
        let customError = genericError;
        if (hasErrorResponseData) {
          const data = e.response.data;
          if (data[0] && data[0].message) customError = data[0].message;
          else if (data.message) customError = data.message;
        }
        this.error = hasErrorResponseData ? customError : genericError;
        this.$toasted.error(genericError);
        this.modals.modalConfirmation = false;
      }
      loader.hide();
    },
    switchChangedHandler(event, obj) {
      if (typeof event === "boolean") this.model.turma[obj] = event;
    },
  },
};
</script>
<style></style>
