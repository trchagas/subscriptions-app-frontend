<template>
  <div>
    <base-header type="gradient-default" class="header pb-8 py-5 pt-md-8">
      <div class="container-fluid d-flex align-items-center">
        <div class="row">
          <div class="col-12 mt-0 mt-md-4 mt-lg-0 d-block">
            <router-link
              :to="`/diretoria/usuarios/associados?status=${$route.query.status}`"
              class="btn-link font-weight-normal text-white"
              title="Voltar para a listagem de associados"
            >
              <i class="fas fa-chevron-left mr-1" /> Voltar
            </router-link>
          </div>
          <div class="col-lg-7 col-md-10">
            <h1 class="display-2 text-white font-size-20">
              <span class="text-white">
                Olá,
                <span class="text-warning d-inline">
                  {{ model.associado.name }}
                </span>
                ! :)
              </span>
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
            ref="associado_profile_picture"
            class="card card-profile shadow vld-parent"
          >
            <div class="row justify-content-center">
              <div class="card-profile-image">
                <img :src="getAssociadoProfilePicturePath" />
              </div>
            </div>
            <div class="card-body pt-6 pb-1">
              <div class="row">
                <div class="col">
                  <div class="text-center mt-6">
                    <h2 class="mb-2 card-title text-orange">
                      {{ model.associado.name }}
                    </h2>
                    <div v-if="model.associado.email">
                      <div class="h5 font-weight-300 mb-1">
                        <email-link :email-address="model.associado.email" />
                      </div>
                      <div class="h5 font-weight-300 mb-1">
                        <whatsapp-link :phone-number="model.associado.phone" />
                      </div>
                    </div>
                    <hr class="mt-3 mb-4" />
                    <div class="row">
                      <div class="col">
                        <file-select
                          v-model="model.profile_picture"
                          title="Selecione sua foto de perfil"
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
                <div class="col-12">
                  <h3 class="mb-0">
                    Perfil do associado
                    <span class="text-warning">{{
                      model.associado.name.split(" ")[0]
                    }}</span>
                    <span
                      v-if="model.associado.associate_id"
                      class="float-right"
                    >
                      #{{
                        model.associado.associate_id.toString().padStart(4, "0")
                      }}
                    </span>
                  </h3>
                </div>
              </div>
            </div>
            <template>
              <form ref="associado_form" role="form" class="vld-parent">
                <div class="row ml-1">
                  <h6 class="heading-small text-muted mb-4">Dados pessoais</h6>
                </div>
                <div class="row ml-lg-2">
                  <div class="col-lg-12">
                    <base-input
                      label="Nome do associado"
                      placeholder="Digite o nome"
                    >
                      <p>{{ model.associado.name }}</p>
                    </base-input>
                  </div>
                  <div class="col-lg-4">
                    <base-input label="Data de nascimento">
                      <p v-if="model.associado.birth">
                        {{ formatDate(model.associado.birth) }}
                      </p>
                      <p v-else>Não informada</p>
                    </base-input>
                  </div>
                  <div class="col-lg-4">
                    <base-input
                      label="Cidade natal"
                      placeholder="Digite o nome"
                    >
                      <p v-if="model.associado.hometown">
                        {{ model.associado.hometown }}
                      </p>
                      <p v-else>Não informada</p>
                    </base-input>
                  </div>
                  <div class="col-lg-4">
                    <base-input label="UF" placeholder="Digite o nome">
                      <p v-if="model.associado.hometown_state">
                        {{ model.associado.hometown_state }}
                      </p>
                      <p v-else>Não informado</p>
                    </base-input>
                  </div>
                  <div class="col-lg-4">
                    <base-input label="Identidade">
                      <p v-if="model.associado.rg">
                        {{ model.associado.rg }}
                      </p>
                      <p v-else>Não informada</p>
                    </base-input>
                  </div>
                  <div class="col-lg-4">
                    <base-input label="País (se estrangeiro)">
                      <p v-if="model.associado.home_country">
                        {{ model.associado.home_country }}
                      </p>
                      <p v-else>Não informado</p>
                    </base-input>
                  </div>
                  <div class="col-lg-4">
                    <base-input label="Documento">
                      <p v-if="model.associado.document">
                        {{ model.associado.document }}
                      </p>
                      <p v-else>Não informado</p>
                    </base-input>
                  </div>
                  <div class="col-lg-4">
                    <base-input label="Estado civil">
                      <p v-if="model.associado.marital_status">
                        {{ model.associado.marital_status }}
                      </p>
                      <p v-else>Não informado</p>
                    </base-input>
                  </div>
                  <div class="col-lg-4">
                    <base-input label="Nome do Pai">
                      <p v-if="model.associado.father_name">
                        {{ model.associado.father_name }}
                      </p>
                      <p v-else>Não informado</p>
                    </base-input>
                  </div>
                  <div class="col-lg-4">
                    <base-input label="Nome da Mãe">
                      <p v-if="model.associado.mother_name">
                        {{ model.associado.mother_name }}
                      </p>
                      <p v-else>Não informado</p>
                    </base-input>
                  </div>
                  <div class="col-lg-6">
                    <label class="form-control-label">
                      Telefone residencial (com DDD)*
                    </label>
                    <base-input addon-left-icon="fas fa-phone">
                      <the-mask
                        v-model="model.associado.home_phone"
                        :mask="['(##) ####-####', '(##) #####-####']"
                        class="form-control"
                        type="tel"
                        placeholder="Telefone residencial"
                      />
                    </base-input>
                  </div>
                  <div class="col-lg-6">
                    <label class="form-control-label">
                      Celular (com DDD)*
                    </label>
                    <base-input addon-left-icon="fas fa-phone">
                      <the-mask
                        v-model="model.associado.phone"
                        :mask="['(##) ####-####', '(##) #####-####']"
                        class="form-control"
                        type="tel"
                        placeholder="Celular"
                      />
                    </base-input>
                  </div>
                </div>
                <hr class="mt-2 mb-4" />
                <div class="row ml-1">
                  <h6 class="heading-small text-muted mb-4">
                    Informações de endereço
                  </h6>
                </div>
                <div class="row ml-lg-2">
                  <div class="col-lg-3">
                    <base-input label="CEP">
                      <p v-if="model.associado.cep">
                        {{ model.associado.cep }}
                      </p>
                      <p v-else>Não informado</p>
                    </base-input>
                  </div>
                  <div class="col-lg-6">
                    <base-input label="Nome da Rua">
                      <p v-if="model.associado.street">
                        {{ model.associado.street }}
                      </p>
                      <p v-else>Não informado</p>
                    </base-input>
                  </div>
                  <div class="col-lg-3">
                    <base-input label="Número">
                      <p v-if="model.associado.street_number">
                        {{ model.associado.street_number }}
                      </p>
                      <p v-else>Não informado</p>
                    </base-input>
                  </div>
                  <div class="col-lg-6">
                    <base-input label="Complemento">
                      <p v-if="model.associado.complement">
                        {{ model.associado.complement }}
                      </p>
                      <p v-else>Não informado</p>
                    </base-input>
                  </div>
                  <div class="col-lg-6">
                    <base-input label="Bairro">
                      <p v-if="model.associado.neighborhood">
                        {{ model.associado.neighborhood }}
                      </p>
                      <p v-else>Não informado</p>
                    </base-input>
                  </div>
                  <div class="col-lg-6">
                    <base-input label="Cidade">
                      <p v-if="model.associado.city">
                        {{ model.associado.city }}
                      </p>
                      <p v-else>Não informada</p>
                    </base-input>
                  </div>
                  <div class="col-lg-6">
                    <base-input label="UF">
                      <p v-if="model.associado.state">
                        {{ model.associado.state }}
                      </p>
                      <p v-else>Não informado</p>
                    </base-input>
                  </div>
                </div>
                <hr class="mt-2 mb-4" />
                <div class="row ml-1">
                  <h6 class="heading-small text-muted mb-4">
                    Dados profissionais
                  </h6>
                </div>
                <div class="row ml-lg-2">
                  <div class="col-lg-3">
                    <base-input label="Profissão">
                      <p v-if="model.associado.profession">
                        {{ model.associado.profession }}
                      </p>
                      <p v-else>Não informada</p>
                    </base-input>
                  </div>
                  <div class="col-lg-6">
                    <base-input label="Nome da Rua do Trabalho">
                      <p v-if="model.associado.work_street">
                        {{ model.associado.work_street }}
                      </p>
                      <p v-else>Não informado</p>
                    </base-input>
                  </div>
                  <div class="col-lg-3">
                    <base-input label="Número">
                      <p v-if="model.associado.work_street_number">
                        {{ model.associado.work_street_number }}
                      </p>
                      <p v-else>Não informado</p>
                    </base-input>
                  </div>
                  <div class="col-lg-6">
                    <base-input label="Bairro">
                      <p v-if="model.associado.work_neighborhood">
                        {{ model.associado.work_neighborhood }}
                      </p>
                      <p v-else>Não informado</p>
                    </base-input>
                  </div>
                  <div class="col-lg-6">
                    <base-input label="Cidade">
                      <p v-if="model.associado.work_city">
                        {{ model.associado.work_city }}
                      </p>
                      <p v-else>Não informada</p>
                    </base-input>
                  </div>
                  <div class="col-lg-6">
                    <base-input label="Email">
                      <p v-if="model.associado.work_email">
                        {{ model.associado.work_email }}
                      </p>
                      <p v-else>Não informado</p>
                    </base-input>
                  </div>
                  <div class="col-lg-6">
                    <base-input label="Telefone">
                      <p v-if="model.associado.work_phone">
                        {{ model.associado.work_phone }}
                      </p>
                      <p v-else>Não informado</p>
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
                      Informações complementares
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
                    <base-input label="Começou em">
                      <p v-if="model.associado.start_at">
                        {{ formatDate(model.associado.start_at) }}
                      </p>
                      <p v-else>Não informado</p>
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
  </div>
</template>

<script>
import api from "../../services/api";

export default {
  name: "AssociateProfile",
  data() {
    return {
      model: {
        user: {
          newPassword: "",
          newPassword_confirmation: "",
        },
        associado: {
          user_id: "",
          email: "",
          associate_id: "",
          name: "",
          phone: "",
          birth: "",
          hometown: "",
          hometown_state: "",
          rg: "",
          home_country: "",
          document: "",
          marital_status: "",
          father_name: "",
          mother_name: "",
          home_phone: "",
          cep: "",
          city: "",
          state: "",
          neighborhood: "",
          street: "",
          street_number: "",
          complement: "",
          profession: "",
          work_street: "",
          work_street_number: "",
          work_neighborhood: "",
          work_city: "",
          work_phone: "",
          work_email: "",
          start_at: null,
          profile_picture: {},
          account_validated: false,
        },
        profile_picture: null,
      },
      modals: {
        modalChangePassword: false,
        modalError: "",
        modalDelete: false,
        modalConfirmation: false,
      },
      success: "",
      error: "",
      requiredFields: ["name", "phone"],
      showComplementarInfo: true,
    };
  },
  computed: {
    getAssociadoProfilePicturePath() {
      const defaultProfilePicturePath =
        "/img/pages/default_profile_picture.png";
      const profilePicture = this.model.associado.profile_picture;
      if (!profilePicture) return defaultProfilePicturePath;
      return profilePicture.url;
    },
  },
  async mounted() {
    const loaderForm = this.$loading.show({
      container: this.$refs.associado_form,
      width: 90,
      height: 90,
    });
    const loaderProfilePicture = this.$loading.show({
      container: this.$refs.associado_profile_picture,
      opacity: 0,
      width: 130,
      height: 130,
    });
    try {
      this.model.associado.user_id = this.$route.params.id;
      const { data } = await api.get("/associate/associates/");
      Object.assign(this.model.associado, data);
      this.model.associado.email = data.user.email;
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
      const associadoData = this.model.associado;
      for (const key in associadoData) {
        if (this.requiredFields.includes(key) && !associadoData[key]) {
          this.error =
            "Por favor, preencha todos os campos obrigatórios antes de continuar.";
          return;
        }
      }
      const loader = this.$loading.show({
        container: this.$refs.associado_form,
        width: 90,
        height: 90,
      });
      try {
        const { data } = await api.put(
          `/associate/associates/${this.model.associado.user_id}`,
          associadoData
        );
        Object.assign(this.model.associado, data);
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
        container: this.$refs.associado_profile_picture,
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
          `/associate/users/${this.model.associado.user_id}/profile-pictures`,
          data,
          config
        );
        this.$toasted.show("Foto de perfil salva com sucesso");
        const { data: profile_pictureData } = await api.get(
          `/associate/users/${this.model.associado.user_id}/profile-pictures`
        );
        if (profile_pictureData)
          this.model.associado.profile_picture = profile_pictureData;
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

    async handleSubmitChangePassword() {
      this.modals.modalError = "";
      const loader = this.$loading.show({
        container: this.$refs.modal_change_password,
        width: 90,
        height: 90,
      });
      try {
        await api.put(
          `/associate/users/${this.model.associado.user_id}/change-password`,
          this.model.user
        );
        this.$toasted.show("Senha atualizada com sucesso");
        this.success = "Alteração de senha realizada com sucesso.";
        this.modals.modalChangePassword = false;
      } catch (e) {
        const genericError =
          "Ocorreu um erro ao atualizar a senha do associado.";
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
