<template>
  <div>
    <base-header class="header pb-8 pt-5 pt-lg-8 d-flex align-items-center">
      <!-- Header container -->
      <div class="container-fluid d-flex align-items-center">
        <div class="row">
          <div class="col-12 d-block d-md-none">
            <router-link
              :to="'/'"
              class="btn-link font-weight-normal text-white"
              title="Voltar para o início"
              ><i class="fas fa-chevron-left mr-1" /> Voltar</router-link
            >
          </div>
          <div class="col-lg-7 col-md-10">
            <h1 class="display-2 text-white font-size-20">
              <span class="text-white"
                >Olá,
                <span class="text-warning d-inline">{{ model.admin.name }}</span
                >! :)</span
              >
            </h1>
            <p class="text-white mt-4 mb-2">
              Aqui você pode conferir e atualizar as informações básicas de sua
              conta. Além disso, você também pode modificar sua foto de perfil e
              alterar sua senha de usuário.
            </p>
          </div>
        </div>
      </div>
    </base-header>

    <div class="container-fluid mt--6">
      <div class="row">
        <div class="col-xl-4 order-xl-2 mb-5 mb-xl-0">
          <div
            ref="admin_profile_picture"
            class="card card-profile shadow vld-parent"
          >
            <div class="row justify-content-center">
              <div class="col-lg-3 order-lg-2">
                <div class="card-profile-image">
                  <img :src="getProfilePicturePath" />
                </div>
              </div>
            </div>
            <div class="card-body pt-6 pb-1">
              <div class="row">
                <div class="col">
                  <div class="text-center mt-6">
                    <h2 class="mb-2 card-title text-orange">
                      {{ model.admin.name }}
                    </h2>
                    <div>
                      <div class="h5 font-weight-300 mb-1">
                        <i class="fas fa-envelope mr-2" />
                        {{ model.admin.email }}
                      </div>
                    </div>
                    <hr class="mt-3 mb-4" />
                    <div class="row">
                      <div class="col">
                        <file-select
                          v-model="model.profilePicture"
                          title="Selecione sua foto de perfil"
                          accept="image/*"
                          :mb-size="2"
                        />
                        <br />
                        <button
                          v-if="model.profilePicture"
                          class="btn btn-primary my-2 jump"
                          @click="handleSubmitProfilePicture"
                        >
                          Salvar arquivo
                        </button>
                      </div>
                    </div>
                    <p class="text-sm text-muted">
                      <i class="fas fa-info-circle mr-1" /> A foto de perfil
                      deve possuir tamanho máximo de 2MB e, preferencialmente,
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
                  <h3 class="mb-0">Meu perfil</h3>
                </div>
                <div class="col-4 text-right">
                  <span class="btn btn-sm btn-primary">Edição</span>
                </div>
              </div>
            </div>
            <template>
              <form ref="admin_form" role="form" class="vld-parent">
                <div class="row ml-1">
                  <h6 class="heading-small text-muted mb-4">
                    Informações básicas
                  </h6>
                </div>
                <div class="row ml-2">
                  <div class="col-lg-6">
                    <base-input
                      v-model="model.admin.name"
                      label="Nome*"
                      placeholder="Nome da admin"
                    />
                  </div>
                </div>
                <div class="row ml-2">
                  <div v-if="error" class="col-12 text-center">
                    <base-alert type="danger">{{ error }}</base-alert>
                  </div>
                  <div v-if="success" class="col-12 text-center">
                    <base-alert type="success">{{ success }}</base-alert>
                  </div>
                </div>
                <div class="text-right">
                  <base-button
                    type="primary"
                    :custom="true"
                    @click="handleSubmitForm"
                    >Salvar alterações</base-button
                  >
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
                      ><i class="fas fa-lock mr-2" /> Modificar
                      senha</base-button
                    >
                  </h6>
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
            v-model="model.user.oldPassword"
            type="password"
            placeholder="Senha antiga"
            addon-left-icon="ni ni-lock-circle-open"
          /><base-input
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
        <base-alert v-if="modals.modalError" type="danger" class="text-center">
          {{ modals.modalError }}
        </base-alert>
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
  </div>
</template>
<script>
import api from "@/services/api.js";

export default {
  name: "AdminProfile",
  data() {
    return {
      model: {
        admin: {
          name: "",
          profile_picture: null,
        },
        profilePicture: null,
        user: {
          oldPassword: "",
          newPassword: "",
          newPassword_confirmation: "",
        },
      },
      error: "",
      success: "",
      modals: {
        modalChangePassword: false,
        modalError: "",
      },
    };
  },
  computed: {
    getProfilePicturePath() {
      const defaultLogoPath = "/img/pages/default_profile_picture.png";
      const profilePicture = this.model.admin.profile_picture;
      if (!profilePicture) return defaultLogoPath;
      return profilePicture.url;
    },
  },
  async mounted() {
    const loaderForm = this.$loading.show({
      container: this.$refs.admin_form,
      width: 90,
      height: 90,
    });
    const loaderProfilePicture = this.$loading.show({
      container: this.$refs.admin_profile_picture,
      opacity: 0,
      width: 130,
      height: 130,
    });
    try {
      const { data } = await api.get("/admin/admins");
      Object.assign(this.model.admin, data);
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
      const adminData = this.model.admin;
      if (adminData.name === "") {
        this.error =
          "Por favor, preencha todos os campos obrigatórios antes de continuar.";
        return;
      }
      const loader = this.$loading.show({
        container: this.$refs.admin_form,
        width: 90,
        height: 90,
      });
      try {
        const { data } = await api.put(
          `/admin/admins/${this.model.admin.user_id}`,
          adminData
        );
        Object.assign(this.model.admin, data);
        this.$toasted.show("Informações atualizadas com sucesso");
        this.success = "Perfil atualizado com sucesso!";
      } catch (e) {
        this.error =
          "Não foi possível salvar as informações. Por favor, tente novamente em alguns instantes.";
        this.$toasted.error("Ocorreu um erro ao salvar as informações");
      }
      loader.hide();
    },
    async handleSubmitProfilePicture() {
      this.error = this.success = "";
      const loader = this.$loading.show({
        container: this.$refs.admin_profile_picture,
        opacity: 0,
        width: 130,
        height: 130,
      });
      const profilePicture = this.model.profilePicture;
      if (!profilePicture) return;
      const data = new FormData();
      data.append("profile_picture", profilePicture, profilePicture.name);
      const config = {
        headers: {
          "content-type": "multipart/form-data",
        },
      };
      try {
        await api.post(
          `/users/${this.model.admin.user_id}/profile-pictures`,
          data,
          config
        );
        this.$toasted.show("Foto de prefil salva com sucesso");
        const { data: profilePictureData } = await api.get(
          `/users/${this.model.admin.user_id}/profile-pictures`
        );
        if (profilePictureData)
          this.model.admin.profile_picture = profilePictureData;
        this.model.profilePicture = null;
        this.success = "Foto de perfil atualizada com sucesso!";
      } catch (e) {
        const genericError =
          "Não foi possível alterar a foto de perfil. Por favor, tente novamente em alguns instantes.";
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
        this.$toasted.error("Ocorreu um erro ao salvar a foto de perfil");
      }
      loader.hide();
    },
    handleOpenModalChangePassword() {
      this.model.user.oldPassword = "";
      this.model.user.newPassword = "";
      this.model.user.newPassword_confirmation = "";
      this.modals.modalChangePassword = true;
      this.modals.modalError = "";
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
    async handleSubmitChangePassword() {
      this.modals.modalError = "";
      const loader = this.$loading.show({
        container: this.$refs.modal_change_password,
        width: 90,
        height: 90,
      });
      try {
        await api.put(
          `/users/${this.model.admin.user_id}/change-password`,
          this.model.user
        );
        this.$toasted.show("Senha atualizada com sucesso");
        this.success = "Alteração de senha realizada com sucesso.";
        this.modals.modalChangePassword = false;
      } catch (e) {
        const genericError = "Ocorreu um erro ao atualizar a senha.";
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
