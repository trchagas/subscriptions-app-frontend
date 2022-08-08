<template>
  <div>
    <base-header type="gradient-default" class="header pb-8 py-5 pt-md-8">
      <div class="container-fluid d-flex align-items-center">
        <div class="row">
          <div class="col-12 mt-0 mt-md-4 mt-lg-0 d-block">
            <router-link
              :to="'/cliente'"
              class="btn-link font-weight-normal text-white"
              title="Voltar para a listagem de parceiros"
            >
              <i class="fas fa-chevron-left mr-1" /> Voltar
            </router-link>
          </div>
        </div>
      </div>
    </base-header>
    <div class="container-fluid mt--7">
      <div class="row">
        <div class="col-xl-12 d-flex justify-content-center">
          <card shadow type="secondary" class="col-sm-12 col-xl-5">
            <div slot="header" class="bg-white border-0">
              <div class="row align-items-center">
                <div class="col-12">
                  <h3 class="mb-0 text-center">
                    <i class="fas fa-edit mr-2" /> Nova inscrição
                  </h3>
                </div>
              </div>
            </div>
            <template>
              <form role="form">
                <div class="ml-lg-2">
                  <div
                    class="col-12 d-flex flex-row align-items-center justify-content-between"
                  >
                    <label class="form-control-label">Nome</label>
                    <base-input
                      v-model.trim="model.user.email"
                      placeholder="Insira o nome"
                    />
                  </div>
                  <hr class="mt--3 mb-2" />
                  <div
                    class="col-12 d-flex flex-row align-items-center justify-content-between"
                  >
                    <label class="form-control-label">Descrição</label>
                    <base-input
                      v-model="model.user.description"
                      placeholder="Insira a descrição"
                    />
                  </div>
                  <hr class="mt--3 mb-2" />
                  <div
                    class="col-12 d-flex flex-row align-items-center justify-content-between"
                  >
                    <label class="form-control-label">Preço</label>

                    <base-input
                      v-model="model.user.price"
                      placeholder="Insira o preço"
                      v-mask="[
                        'R$##.##',
                        'R$###.##',
                        'R$####.##',
                        'R$#####.##'
                      ]"
                    />
                  </div>
                  <hr class="mt--3 mb-2" />
                  <div
                    class="col-12 d-flex flex-row align-items-center justify-content-between"
                  >
                    <label class="form-control-label">Próxima cobrança</label>
                    <base-input
                      v-model="model.user.next_bill"
                      placeholder="Insira a data de cobrança"
                    />
                  </div>
                  <hr class="mt--3 mb-2" />
                  <div
                    class="col-12 d-flex flex-row align-items-center justify-content-between"
                  >
                    <label class="form-control-label">Ciclo (meses)</label>
                    <base-input
                      v-model="model.user.billing_cycle"
                      placeholder="Insira o ciclo em meses"
                      type="number"
                    />
                  </div>
                  <hr class="mt--3 mb-2" />
                  <div
                    class="col-12 d-flex flex-row align-items-center justify-content-between"
                  >
                    <label class="form-control-label">É contínua?</label>
                    <base-switch
                      class="mb-switch"
                      v-bind:value="model.user.is_continuous"
                      @input="switchChangedHandler($event, 'is_continuous')"
                    />
                  </div>
                  <hr class="mt--3 mb-2" />
                  <div
                    class="col-12 d-flex flex-row align-items-center justify-content-between"
                  >
                    <label class="form-control-label">Está ativa?</label>

                    <base-switch
                      class="mb-switch"
                      v-bind:value="model.user.is_active"
                      @input="switchChangedHandler($event, 'is_active')"
                    />
                  </div>
                  <hr class="mt--3 mb-2" />
                </div>

                <div v-if="error" class="row ml-lg-2">
                  <div class="col-lg-12 text-center">
                    <base-alert type="danger">
                      {{ error }}
                    </base-alert>
                  </div>
                </div>
                <div class="text-right">
                  <base-button
                    type="default"
                    class="mt-4"
                    :custom="true"
                    :disabled="!isValidModel"
                    @click="handleOpenModalConfirmation"
                  >
                    Salvar
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
          <i class="fa fa-user-shield fa-3x" />
          <h4 class="heading mt-4">Confirmar criação</h4>
          <p class="mt-3 mb-0">
            O usuário terá acesso a todas as funcionalidades do perfil de
            <span class="font-weight-bold">parceiro</span> do portal.
          </p>
          <p class="mt-3">
            Por favor, digite
            <span class="font-weight-bold">{{ model.user.email }}</span>
            para prosseguir
          </p>
          <base-input
            v-model="modals.inputConfirmation"
            placeholder="Digite aqui"
            input-classes="form-control"
            addon-left-icon="fas fa-envelope"
          />
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
        <base-button
          type="white text-success"
          :disabled="!inputConfirmationTextIsValid()"
          @click="handleSubmitNewParceiro"
        >
          Confirmar criação
        </base-button>
      </template>
    </modal>
  </div>
</template>

<script>
import api from "../../../services/api";

export default {
  name: "AdminCriarParceiroes",
  data() {
    return {
      model: {
        user: {
          email: "",
          password: ""
        },
        parceiro: {
          partner_id: "",
          name: "",
          cnpj: "",
          phone: "",
          start_at: null,
          note: null
        }
      },
      modals: {
        modalConfirmation: false,
        inputConfirmation: ""
      },
      error: "",
      requiredFields: ["name", "phone"],
      showComplementarInfo: true
    };
  },
  computed: {
    isValidModel() {
      const user = this.model.user;
      if (!user.email || !user.password) return false;
      const parceiro = this.model.parceiro;
      for (const key of this.requiredFields) {
        if (parceiro[key] === "") return false;
      }
      return true;
    },
    passwordStatus() {
      const status = {
        strong: {
          class: "text-success",
          message: "forte"
        },
        average: {
          class: "text-warning",
          message: "média"
        },
        weak: {
          class: "text-danger",
          message: "fraca"
        }
      };
      const length = this.model.user.password.length;
      const status_type =
        length < 6 ? status.weak : length < 10 ? status.average : status.strong;
      return status_type;
    }
  },
  methods: {
    inputConfirmationTextIsValid() {
      return this.modals.inputConfirmation === this.model.user.email;
    },
    handleOpenModalConfirmation() {
      this.modals.inputConfirmation = "";
      this.modals.modalConfirmation = true;
    },
    async handleSubmitNewParceiro(e) {
      e.preventDefault();
      const loader = this.$loading.show({
        container: this.$refs.modal_confirmation,
        width: 90,
        height: 90,
        opacity: 0
      });
      this.error = "";
      const parceiro = this.model.parceiro;
      try {
        await api.post("/admin/partners", {
          ...this.model.user,
          password_confirmation: this.model.user.password,
          ...parceiro
        });
        this.$toasted.show("Novo parceiro cadastradro com sucesso");
        this.$router.push("/diretoria/usuarios/parceiros");
      } catch (e) {
        const genericError = "Ocorreu um erro ao cadastrar o parceiro.";
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
    }
  }
};
</script>

<style>
.mb-switch {
  margin-top: 10px;
  margin-bottom: 30px;
}
</style>
