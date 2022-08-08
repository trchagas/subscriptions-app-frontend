<template>
  <div>
    <base-header type="gradient-default" class="header pb-8 py-5 pt-md-8">
      <div class="container-fluid d-flex align-items-center">
        <div class="row">
          <div class="col-12 mt-0 mt-md-4 mt-lg-0 d-block">
            <router-link
              :to="'/diretoria/usuarios/parceiros'"
              class="btn-link font-weight-normal text-white"
              title="Voltar para a listagem de parceiros"
            >
              <i class="fas fa-chevron-left mr-1" /> Voltar
            </router-link>
          </div>
          <div class="col-lg-7 col-md-10">
            <p class="text-white mt-4 mb-2">
              Aqui é possível cadastrar um novo parceiro ao sistema. Por
              questões de segurança, certifique-se de inserir as informações
              corretas, pois o usuário criado terá acesso a todas funções do
              perfil de parceiro do portal.
            </p>
          </div>
        </div>
      </div>
    </base-header>
    <div class="container-fluid mt--7">
      <div class="row">
        <div class="col-xl-9">
          <card shadow type="secondary">
            <div slot="header" class="bg-white border-0">
              <div class="row align-items-center">
                <div class="col-8">
                  <h3 class="mb-0">
                    <i class="fas fa-users mr-2" /> Novo parceiro
                  </h3>
                </div>
              </div>
            </div>
            <template>
              <form role="form">
                <div class="row ml-1">
                  <h6 class="heading-small text-muted mb-4">
                    Informações da conta
                  </h6>
                </div>
                <div class="row ml-lg-2">
                  <div class="col-lg-6">
                    <label class="form-control-label">Email do usuário</label>
                    <base-input
                      v-model.trim="model.user.email"
                      placeholder="Email"
                      addon-left-icon="ni ni-email-83"
                    />
                  </div>
                  <div class="col-lg-6">
                    <label class="form-control-label">Senha do usuário</label>
                    <base-input
                      v-model="model.user.password"
                      placeholder="Senha"
                      type="password"
                      addon-left-icon="ni ni-lock-circle-open"
                    />
                  </div>
                  <div
                    v-if="model.user.password.length"
                    class="text-muted font-italic text-right col-12"
                  >
                    <small>
                      segurança da senha:
                      <span
                        class="font-weight-700"
                        :class="passwordStatus.class"
                      >
                        {{ passwordStatus.message }}
                      </span>
                    </small>
                  </div>
                </div>
                <hr class="my-4" />
                <div class="row ml-1">
                  <h6 class="heading-small text-muted mb-4">
                    Informações básicas
                  </h6>
                </div>
                <div class="row ml-lg-2">
                  <div class="col-lg-12">
                    <base-input
                      v-model.trim="model.parceiro.name"
                      label="Nome do parceiro*"
                      placeholder="Digite o nome"
                    />
                  </div>
                  <div class="col-lg-6">
                    <base-input
                      v-model.trim="model.parceiro.partner_id"
                      label="ID (opcional)"
                      type="number"
                      placeholder="Digite o ID único do parceiro"
                    />
                  </div>
                  <div class="col-lg-6">
                    <label class="form-control-label">
                      Telefone (com DDD)*
                    </label>
                    <base-input addon-left-icon="fas fa-phone">
                      <the-mask
                        v-model="model.parceiro.phone"
                        :mask="['(##) ####-####', '(##) #####-####']"
                        class="form-control"
                        type="tel"
                        placeholder="Telefone (fixo ou celular)"
                      />
                    </base-input>
                  </div>
                </div>
                <hr class="mt-2 mb-4" />
                <div class="row ml-1 mb-4">
                  <div class="col-12 pl-0">
                    <h6
                      class="heading-small text-muted"
                      @click="showComplementarInfo = !showComplementarInfo"
                    >
                      Informações complementares (opcional)
                      <i
                        v-if="showComplementarInfo"
                        v-tooltip="'Ocultar campos'"
                        class="fas fa-caret-up float-right mx-1 text-primary cursor-pointer"
                      />
                      <i
                        v-else
                        v-tooltip="'Exibir campos'"
                        class="fas fa-caret-down float-right mx-1 text-primary cursor-pointer"
                      />
                    </h6>
                  </div>
                </div>
                <div
                  v-show="showComplementarInfo"
                  ref="complementar_info_container"
                  class="row ml-lg-2 vld-parent"
                >
                  <div class="col-lg-6">
                    <base-input label="CNPJ">
                      <the-mask
                        v-model="model.parceiro.cnpj"
                        :mask="['##.###.###/####-##']"
                        class="form-control"
                        type="tel"
                        placeholder="00.000.000/0000-00"
                      />
                    </base-input>
                  </div>
                  <div class="col-lg-6">
                    <label class="form-control-label d-block">
                      Data de início
                    </label>
                    <base-input
                      v-model="model.parceiro.start_at"
                      addon-left-icon="fas fa-calendar"
                      type="date"
                      placeholder="Data de início"
                    />
                  </div>
                  <div class="col-lg-12">
                    <hr class="mt-2 mb-4" />
                    <base-input label="Observações">
                      <textarea
                        v-model="model.parceiro.note"
                        rows="2"
                        class="form-control"
                        placeholder="Observações sobre o parceiro"
                      />
                    </base-input>
                  </div>
                </div>
                <hr class="mt-2 mb-4" />
                <div v-if="error" class="row ml-lg-2">
                  <div class="col-lg-12 text-center">
                    <base-alert type="danger">
                      {{ error }}
                    </base-alert>
                  </div>
                </div>
                <div class="text-right">
                  <base-button
                    type="primary"
                    class="mt-4"
                    :custom="true"
                    :disabled="!isValidModel"
                    @click="handleOpenModalConfirmation"
                  >
                    Cadastrar novo parceiro
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
          password: "",
        },
        parceiro: {
          partner_id: "",
          name: "",
          cnpj: "",
          phone: "",
          start_at: null,
          note: null,
        },
      },
      modals: {
        modalConfirmation: false,
        inputConfirmation: "",
      },
      error: "",
      requiredFields: ["name", "phone"],
      showComplementarInfo: true,
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
          message: "forte",
        },
        average: {
          class: "text-warning",
          message: "média",
        },
        weak: {
          class: "text-danger",
          message: "fraca",
        },
      };
      const length = this.model.user.password.length;
      const status_type =
        length < 6 ? status.weak : length < 10 ? status.average : status.strong;
      return status_type;
    },
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
        opacity: 0,
      });
      this.error = "";
      const parceiro = this.model.parceiro;
      try {
        await api.post("/admin/partners", {
          ...this.model.user,
          password_confirmation: this.model.user.password,
          ...parceiro,
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
    },
  },
};
</script>

<style></style>
