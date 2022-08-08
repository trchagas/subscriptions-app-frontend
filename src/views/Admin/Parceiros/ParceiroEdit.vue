<template>
  <div>
    <base-header type="gradient-default" class="header pb-8 py-5 pt-md-8">
      <div class="container-fluid d-flex align-items-center">
        <div class="row">
          <div class="col-12 mt-0 mt-md-4 mt-lg-0 d-block">
            <router-link
              :to="`/diretoria/usuarios/parceiros?status=${$route.query.status}`"
              class="btn-link font-weight-normal text-white"
              title="Voltar para a listagem de parceiros"
            >
              <i class="fas fa-chevron-left mr-1" /> Voltar
            </router-link>
          </div>
          <div class="col-lg-7 col-md-10">
            <p class="text-white mt-4 mb-2">
              Aqui você poderá gerenciar e atualizar as informações de usuário
              do parceiro, o que inclui modificar a foto de perfil e a senha,
              além de controlar a validade da conta do parceiro.
            </p>
          </div>
        </div>
      </div>
    </base-header>
    <div class="container-fluid mt--6">
      <div class="row">
        <div class="col-xl-4 order-xl-2 mb-5 mb-xl-0">
          <div
            ref="parceiro_profile_picture"
            class="card card-profile shadow vld-parent"
          >
            <div class="row justify-content-center">
              <div class="card-profile-image">
                <img :src="getParceiroProfilePicturePath" />
              </div>
            </div>
            <div class="card-body pt-6 pb-1">
              <div class="row">
                <div class="col">
                  <div class="text-center mt-6">
                    <h2 class="mb-2 card-title text-orange">
                      {{ model.parceiro.name }}
                    </h2>
                    <div v-if="model.parceiro.email">
                      <div class="h5 font-weight-300 mb-1">
                        <email-link :email-address="model.parceiro.email" />
                      </div>
                      <div class="h5 font-weight-300 mb-1">
                        <whatsapp-link :phone-number="model.parceiro.phone" />
                      </div>
                    </div>
                    <hr class="mt-3 mb-4" />
                    <div class="row">
                      <div class="col">
                        <file-select
                          v-model="model.profile_picture"
                          title="Selecione a foto de perfil do parceiro"
                          accept="image/*"
                          :mb-size="2"
                        />
                        <br />
                        <button
                          v-if="model.profile_picture"
                          class="btn btn-primary my-2 jump"
                          @click="handleSubmitProfilePicture"
                        >
                          Salvar arquivo
                        </button>
                      </div>
                    </div>
                    <p class="text-sm text-muted">
                      <i class="fas fa-info-circle mr-1" /> A foto de perfil
                      deve possuir tamanho máximo de 2MB e, prefrencialmente,
                      ser do formato <b>PNG</b> ou <b>JPG</b> com dimensão de
                      <b>500x500 pixels</b>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-xl-8 order-xl-1">
          <card shadow type="secondary">
            <div slot="header" class="bg-white border-0">
              <div class="row align-items-center">
                <div class="col-8">
                  <h3 class="mb-0">
                    Perfil do parceiro
                    <span class="text-warning">{{
                      model.parceiro.name.split(" ")[0]
                    }}</span>
                  </h3>
                </div>
                <div class="col">
                  <base-button
                    class="float-right"
                    @click="
                      $router.push(
                        `/diretoria/usuarios/parceiros/${model.parceiro.user_id}/visualizar`
                      )
                    "
                  >
                    <i class="fas fa-eye mr-2" />Visualizar
                  </base-button>
                </div>
              </div>
            </div>
            <template>
              <form ref="parceiro_form" role="form" class="vld-parent">
                <div class="row ml-1">
                  <h6 class="heading-small text-muted mb-4">Status da conta</h6>
                </div>
                <div class="row ml-2">
                  <div class="col-12">
                    <div>
                      <badge
                        v-if="model.parceiro.account_validated"
                        type="success"
                        title="A conta do parceiro está validada."
                      >
                        <i class="fas fa-info-circle mr-1" /> Conta validada
                      </badge>
                      <badge
                        v-else
                        type="warning"
                        title="Enquanto a conta não for validada o parceiro não terá acesso as funcionalidades do portal."
                      >
                        <i class="fas fa-info-circle mr-1" /> Conta não validada
                      </badge>
                      <base-button
                        :type="
                          model.parceiro.account_validated ? 'danger' : 'info'
                        "
                        class="float-right"
                        size="sm"
                        @click="handleSubmitToggleStatus()"
                      >
                        <div v-if="model.parceiro.account_validated">
                          <i class="fas fa-lock mr-1" />
                          Invalidar conta
                        </div>
                        <div v-else>
                          <i class="fas fa-unlock-alt mr-1" />
                          Validar conta
                        </div>
                      </base-button>
                    </div>
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
                <div class="row ml-2">
                  <div v-if="error" class="col-12 text-center">
                    <base-alert type="danger">
                      {{ error }}
                    </base-alert>
                  </div>
                  <div v-if="success" class="col-12 text-center">
                    <base-alert type="success">
                      {{ success }}
                    </base-alert>
                  </div>
                </div>
                <div class="text-right">
                  <base-button
                    type="primary"
                    :custom="true"
                    @click="handleSubmitForm"
                  >
                    Salvar alterações
                  </base-button>
                </div>
                <hr class="my-4" />
                <div class="col-12 ml-1">
                  <h6 class="heading-small text-muted">
                    Detalhes da conta - Segurança
                    <base-button
                      type="dark"
                      size="sm"
                      class="float-right mt-4 mt-md--1 mt-sm--1"
                      @click="handleOpenModalChangePassword"
                    >
                      <i class="fas fa-lock mr-2" /> Modificar
                    </base-button>
                  </h6>
                </div>
                <hr class="my-4" />
                <div class="row">
                  <div class="col ml-1 text-center">
                    <h6 class="heading-small text-muted">
                      <base-button
                        type="danger"
                        size="sm"
                        class="mt-4 mt-md--1 mt-sm--1"
                        icon="fas fa-trash"
                        @click="modals.modalDelete = true"
                      >
                        Excluir parceiro
                      </base-button>
                    </h6>
                  </div>
                </div>
              </form>
            </template>
          </card>
        </div>
      </div>
    </div>
    <modal
      :show.sync="modals.modalChangePassword"
      modal-classes="modal-dialog-centered"
      body-classes="pb-0"
    >
      <h6 id="modal-title-notification" slot="header" class="modal-title">
        Atenção!
      </h6>
      <div ref="modal_change_password" class="vld-parent">
        <div class="py-3 text-center">
          <i class="fas fa-key fa-3x" />
          <h4 class="heading mt-4">Modificar senha</h4>
        </div>
        <div class="py-3 text-center">
          <base-input
            v-model="model.user.newPassword"
            type="password"
            placeholder="Nova senha"
            addon-left-icon="ni ni-lock-circle-open"
          /><base-input
            v-model="model.user.newPassword_confirmation"
            type="password"
            placeholder="Confirmar nova senha"
            addon-left-icon="ni ni-lock-circle-open"
          />
          <p
            v-show="
              model.user.newPassword &&
              model.user.newPassword_confirmation &&
              !newPasswordInputsMatch()
            "
            class="text-right mb-0"
          >
            <small>As senhas não conferem!</small>
          </p>
        </div>
        <div v-if="modals.modalError" class="text-center">
          <base-alert type="danger">
            {{ modals.modalError }}
          </base-alert>
        </div>
      </div>
      <template slot="footer">
        <base-button
          type="link"
          text-color="dark"
          class="ml-auto"
          @click="modals.modalChangePassword = false"
        >
          Voltar
        </base-button>
        <base-button
          type="default"
          :disabled="!newPasswordInputsMatch()"
          @click="handleSubmitChangePassword()"
        >
          Alterar senha
        </base-button>
      </template>
    </modal>
    <modal
      :show.sync="modals.modalDelete"
      modal-classes="modal-default modal-dialog-centered"
    >
      <h6 id="modal-title-notification" slot="header" class="modal-title">
        Atenção!
      </h6>
      <div ref="modal_confirmation_delete" class="vld-parent">
        <div class="py-3 text-center">
          <i class="fa fa-trash fa-3x" />
          <h4 class="heading mt-4">
            Você realmente deseja excluir o parceiro
            <span class="text-warning">
              {{ model.parceiro.name }}
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
          @click="modals.modalDelete = false"
        >
          Voltar
        </base-button>
        <base-button
          type="white text-danger"
          @click="handleSubmitRemoveParceiro"
        >
          Confirmar exclusão
        </base-button>
      </template>
    </modal>
  </div>
</template>

<script>
import api from "../../../services/api";

export default {
  name: "AdminEditarParceiros",
  data() {
    return {
      model: {
        user: {
          newPassword: "",
          newPassword_confirmation: "",
        },
        parceiro: {
          partner_id: "",
          name: "",
          cnpj: "",
          phone: "",
          start_at: null,
          note: null,
          profile_picture: {},
          account_validated: "",
        },
        profile_picture: null,
      },
      modals: {
        modalChangePassword: false,
        modalError: "",
        modalDelete: false,
      },
      success: "",
      error: "",
      requiredFields: ["name", "phone"],
      showComplementarInfo: true,
    };
  },
  computed: {
    getParceiroProfilePicturePath() {
      const defaultProfilePicturePath =
        "/img/pages/default_profile_picture.png";
      const profilePicture = this.model.parceiro.profile_picture;
      if (!profilePicture) return defaultProfilePicturePath;
      return profilePicture.url;
    },
  },
  async mounted() {
    const loaderForm = this.$loading.show({
      container: this.$refs.parceiro_form,
      width: 90,
      height: 90,
    });
    const loaderProfilePicture = this.$loading.show({
      container: this.$refs.parceiro_profile_picture,
      opacity: 0,
      width: 130,
      height: 130,
    });
    try {
      this.model.parceiro.user_id = this.$route.params.id;
      const { data } = await api.get(
        `/admin/partners/${this.model.parceiro.user_id}`
      );
      Object.assign(this.model.parceiro, data);
      this.model.parceiro.email = data.user.email;
      loaderForm.hide();
      loaderProfilePicture.hide();
    } catch (e) {
      this.error =
        "Ocorreu um erro ao recuperar as informações de perfil do usuário.";
      this.$toasted.error("Erro ao recuperar as informações");
    }
  },
  methods: {
    async handleSubmitForm(e) {
      e.preventDefault();
      this.error = this.success = "";
      const parceiroData = this.model.parceiro;
      for (const key in parceiroData) {
        if (this.requiredFields.includes(key) && !parceiroData[key]) {
          this.error =
            "Por favor, preencha todos os campos obrigatórios antes de continuar.";
          return;
        }
      }
      const loader = this.$loading.show({
        container: this.$refs.parceiro_form,
        width: 90,
        height: 90,
      });
      try {
        const { data } = await api.put(
          `/admin/partners/${this.model.parceiro.user_id}`,
          parceiroData
        );
        Object.assign(this.model.parceiro, data);
        this.$toasted.show("Informações atualizadas com sucesso");
        this.success = "Perfil atualizado com sucesso!";
      } catch (e) {
        const genericError =
          "Não foi possível salvar as informações. Por favor, tente novamente em alguns instantes.";
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
        this.$toasted.error("Ocorreu um erro ao salvar as informações");
      } finally {
        loader.hide();
      }
    },
    async handleSubmitProfilePicture() {
      this.error = this.success = "";
      const loader = this.$loading.show({
        container: this.$refs.parceiro_profile_picture,
        width: 130,
        height: 130,
      });
      const profile_picture = this.model.profile_picture;
      if (!profile_picture) return;
      const data = new FormData();
      data.append("profile_picture", profile_picture, profile_picture.name);
      const config = {
        headers: {
          "content-type": "multipart/form-data",
        },
      };
      try {
        await api.post(
          `/admin/users/${this.model.parceiro.user_id}/profile-pictures`,
          data,
          config
        );
        this.$toasted.show("Foto de perfil salva com sucesso");
        const { data: profile_pictureData } = await api.get(
          `/admin/users/${this.model.parceiro.user_id}/profile-pictures`
        );
        if (profile_pictureData)
          this.model.parceiro.profile_picture = profile_pictureData;
        this.model.profile_picture = null;
        this.success = "Foto de perfil atualizada com sucesso!";
      } catch (e) {
        const strError =
          "Não foi possível alterar a foto de perfil. Por favor, tente novamente em alguns instantes.";
        const hasErrorMessage =
          e.response && e.response.data && e.response.data.message;
        this.error = hasErrorMessage ? e.response.data.message : strError;
        this.$toasted.error("Ocorreu um erro ao salvar a foto de perfil");
      }
      loader.hide();
    },
    newPasswordInputsMatch() {
      if (
        this.model.user.newPassword &&
        this.model.user.newPassword_confirmation
      ) {
        return (
          this.model.user.newPassword ===
          this.model.user.newPassword_confirmation
        );
      }
      return false;
    },
    handleOpenModalChangePassword() {
      this.model.user.newPassword = "";
      this.model.user.newPassword_confirmation = "";
      this.modals.modalChangePassword = true;
      this.modals.modalError = "";
    },
    async handleSubmitRemoveParceiro() {
      const loader = this.$loading.show({
        container: this.$refs.modal_confirmation_delete,
        width: 160,
        height: 160,
        opacity: 0,
      });
      try {
        await api.delete(`/admin/partners/${this.model.parceiro.user_id}`);
        this.$toasted.show("Parceiro removido com sucesso");
        this.$router.back();
      } catch (e) {
        this.$toasted.error("Ocorreu um erro ao remover o parceiro");
      } finally {
        loader.hide();
      }
    },
    async handleSubmitChangePassword() {
      this.modals.modalError = "";
      const loader = this.$loading.show({
        container: this.$refs.modal_change_password,
        width: 90,
        height: 90,
      });
      try {
        await api.put(
          `/admin/users/${this.model.parceiro.user_id}/change-password`,
          this.model.user
        );
        this.$toasted.show("Senha atualizada com sucesso");
        this.success = "Alteração de senha realizada com sucesso.";
        this.modals.modalChangePassword = false;
      } catch (e) {
        const genericError =
          "Ocorreu um erro ao atualizar a senha do parceiro.";
        const hasErrorResponseData = e.response && e.response.data;
        let customError = genericError;
        if (hasErrorResponseData) {
          const data = e.response.data;
          if (data[0] && data[0].message) customError = data[0].message;
          else if (data.message) customError = data.message;
        }
        this.modals.modalError = hasErrorResponseData
          ? customError
          : genericError;
        this.$toasted.error(genericError);
      }
      loader.hide();
    },
    async handleSubmitToggleStatus() {
      const loader = this.$loading.show({
        container: this.$refs.parceiro_form,
        width: 140,
        height: 140,
      });
      try {
        const status = {
          account_validated: !this.model.parceiro.account_validated,
        };
        const {
          data: { account_validated },
        } = await api.put(
          `/admin/partners/${this.model.parceiro.user_id}/update-status`,
          status
        );
        this.model.parceiro.account_validated = account_validated;
        this.$toasted.success("Alteração salva com sucesso");
      } catch (e) {
        this.$toasted.error("Ocorreu um erro ao salvar a alteração");
      }
      loader.hide();
    },
  },
};
</script>

<style scoped>
.card-profile-image img {
  width: 180px;
  height: 180px;
  border-radius: 10%;
}

.jump {
  animation: jump 1.5s 0s forwards cubic-bezier(0.84, -0.54, 0.31, 1.19)
    infinite;
}

@keyframes jump {
  0% {
    transform: none;
  }
  50% {
    transform: translateY(-2em);
  }
}
</style>
