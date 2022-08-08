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
            <p class="text-white mt-4 mb-2">
              Aqui você poderá gerenciar e atualizar as informações de usuário
              do associado, o que inclui modificar a foto de perfil e a senha,
              além de controlar a validade da conta do associado.
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
                          title="Selecione a foto de perfil do associado"
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
                    Perfil do associado
                    <span class="text-warning">{{
                      model.associado.name.split(" ")[0]
                    }}</span>
                  </h3>
                </div>
                <div class="col">
                  <base-button
                    class="float-right"
                    @click="
                      $router.push(
                        `/diretoria/usuarios/associados/${model.associado.user_id}/visualizar`
                      )
                    "
                  >
                    <i class="fas fa-eye mr-2" />Visualizar
                  </base-button>
                </div>
              </div>
            </div>
            <template>
              <form ref="associado_form" role="form" class="vld-parent">
                <div class="row ml-1">
                  <h6 class="heading-small text-muted mb-4">Status da conta</h6>
                </div>
                <div class="row ml-2">
                  <div class="col-12">
                    <div>
                      <badge
                        v-if="model.associado.account_validated"
                        type="success"
                        title="A conta do associado está validada."
                      >
                        <i class="fas fa-info-circle mr-1" /> Conta validada
                      </badge>
                      <badge
                        v-else
                        type="warning"
                        title="Enquanto a conta não for validada o associado não terá acesso as funcionalidades do portal."
                      >
                        <i class="fas fa-info-circle mr-1" /> Conta não validada
                      </badge>
                      <base-button
                        :type="
                          model.associado.account_validated ? 'danger' : 'info'
                        "
                        class="float-right"
                        size="sm"
                        @click="handleSubmitToggleStatus()"
                      >
                        <div v-if="model.associado.account_validated">
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
                  <h6 class="heading-small text-muted mb-4">Dados pessoais</h6>
                </div>
                <div class="row ml-lg-2">
                  <div class="col-lg-12">
                    <base-input
                      v-model.trim="model.associado.name"
                      label="Nome do associado*"
                      placeholder="Digite o nome"
                    />
                  </div>
                  <div class="col-lg-4">
                    <label class="form-control-label d-block">
                      Data de nascimento
                    </label>
                    <base-input
                      v-model="model.associado.birth"
                      addon-left-icon="fas fa-calendar"
                      type="date"
                      placeholder="Data de nascimento"
                    />
                  </div>
                  <div class="col-lg-5">
                    <base-input
                      v-model.trim="model.associado.hometown"
                      label="Cidade natal"
                      placeholder="Digite a cidade natal"
                    />
                  </div>
                  <div class="col-lg-3">
                    <base-input
                      v-model.trim="model.associado.hometown_state"
                      label="UF"
                      placeholder="Digite a UF"
                    />
                  </div>
                  <div class="col-lg-4">
                    <base-input label="RG">
                      <the-mask
                        v-model="model.associado.rg"
                        :mask="['XXX.XXX.XXX-X']"
                        class="form-control"
                        placeholder="000.000.000-0"
                      />
                    </base-input>
                  </div>
                  <div class="col-lg-4">
                    <base-input
                      v-model.trim="model.associado.home_country"
                      label="País (se estrangeiro)"
                      placeholder="Digite o país"
                    />
                  </div>
                  <div class="col-lg-4">
                    <base-input
                      v-model.trim="model.associado.document"
                      label="Documento (ex: CPF)"
                      placeholder="Digite o documento"
                    />
                  </div>
                  <div class="col-lg-4">
                    <base-input placeholder="Digite o estado civil">
                      <label
                        class="form-control-label d-flex align-items-center"
                      >
                        Estado civil
                        <base-checkbox
                          v-model="other"
                          :checked="true"
                          class="ml-4 mr--4"
                        />
                        Outro
                      </label>
                      <select
                        v-if="!other"
                        v-model="model.associado.marital_status"
                        class="form-control"
                      >
                        <option value="" selected disabled>
                          Selecione uma opção
                        </option>
                        <option
                          v-for="(type, index) of registeredTypes"
                          :key="index"
                          :value="type"
                        >
                          {{ type }}
                        </option>
                        <option v-if="extraType" :value="extraType">
                          {{ extraType }}
                        </option>
                      </select>
                      <base-input
                        v-else
                        v-model="model.associado.marital_status"
                        placeholder="Digite a opção"
                      />
                    </base-input>
                  </div>
                  <div class="col-lg-4">
                    <base-input
                      v-model.trim="model.associado.father_name"
                      label="Nome do Pai"
                      placeholder="Digite o nome"
                    />
                  </div>
                  <div class="col-lg-4">
                    <base-input
                      v-model.trim="model.associado.mother_name"
                      label="Nome da Mãe"
                      placeholder="Digite o nome"
                    />
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
                    <base-input
                      v-model.trim="model.associado.cep"
                      label="CEP"
                      placeholder="Digite o CEP"
                    />
                  </div>
                  <div class="col-lg-6">
                    <base-input
                      v-model.trim="model.associado.street"
                      label="Nome da Rua"
                      placeholder="Digite a Rua"
                    />
                  </div>
                  <div class="col-lg-3">
                    <base-input
                      v-model.trim="model.associado.street_number"
                      label="Número"
                      placeholder="Digite o número"
                    />
                  </div>
                  <div class="col-lg-6">
                    <base-input
                      v-model.trim="model.associado.complement"
                      label="Complemento"
                      placeholder="Digite o complemento"
                    />
                  </div>
                  <div class="col-lg-6">
                    <base-input
                      v-model.trim="model.associado.neighborhood"
                      label="Bairro"
                      placeholder="Digite o bairro"
                    />
                  </div>
                  <div class="col-lg-5">
                    <base-input
                      v-model.trim="model.associado.city"
                      label="Cidade"
                      placeholder="Digite o cidade"
                    />
                  </div>
                  <div class="col-lg-3">
                    <base-input
                      v-model.trim="model.associado.state"
                      label="UF"
                      placeholder="Digite a UF"
                    />
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
                    <base-input
                      v-model.trim="model.associado.profession"
                      label="Profissão"
                      placeholder="Digite a profissão"
                    />
                  </div>
                  <div class="col-lg-6">
                    <base-input
                      v-model.trim="model.associado.work_street"
                      label="Nome da Rua do Trabalho"
                      placeholder="Digite a Rua"
                    />
                  </div>
                  <div class="col-lg-3">
                    <base-input
                      v-model.trim="model.associado.work_street_number"
                      label="Número"
                      placeholder="Digite o número"
                    />
                  </div>
                  <div class="col-lg-6">
                    <base-input
                      v-model.trim="model.associado.work_neighborhood"
                      label="Bairro"
                      placeholder="Digite o bairro"
                    />
                  </div>
                  <div class="col-lg-6">
                    <base-input
                      v-model.trim="model.associado.work_city"
                      label="Cidade"
                      placeholder="Digite a cidade"
                    />
                  </div>
                  <div class="col-lg-6">
                    <label class="form-control-label">Email</label>
                    <base-input
                      v-model.trim="model.associado.work_email"
                      placeholder="Email"
                      addon-left-icon="ni ni-email-83"
                    />
                  </div>
                  <div class="col-lg-6">
                    <label class="form-control-label"> Telefone </label>
                    <base-input addon-left-icon="fas fa-phone">
                      <the-mask
                        v-model="model.associado.work_phone"
                        :mask="['(##) ####-####', '(##) #####-####']"
                        class="form-control"
                        type="tel"
                        placeholder="Telefone"
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
                    <label class="form-control-label d-block">
                      Data de início
                    </label>
                    <base-input
                      v-model="model.associado.start_at"
                      addon-left-icon="fas fa-calendar"
                      type="date"
                      placeholder="Data de início"
                    />
                  </div>
                  <div class="col-lg-12">
                    <hr class="mt-2 mb-4" />
                    <base-input label="Observações">
                      <textarea
                        v-model="model.associado.note"
                        rows="2"
                        class="form-control"
                        placeholder="Observações sobre o associado"
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
                        Excluir associado
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
            Você realmente deseja excluir o associado
            <span class="text-warning">
              {{ model.associado.name }}
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
          @click="handleSubmitRemoveAssociado"
        >
          Confirmar exclusão
        </base-button>
      </template>
    </modal>
  </div>
</template>

<script>
import api from "../../../services/api";
import cep from "cep-promise";

export default {
  name: "AdminEditarAssociados",
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
      registeredTypes: [
        "Solteiro(a)",
        "Casado(a)",
        "Viúvo(a)",
        "Divorciado(a)",
        "União Estável",
      ],
      extraType: "",
      other: false,
      cepPromise: "",
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
    cep() {
      return this.model.associado.cep;
    },
  },
  watch: {
    other() {
      if (!this.registeredTypes.includes(this.model.associado.marital_status))
        this.extraType = this.model.associado.marital_status;
      else this.extraType = "";
    },
    async cep() {
      if (this.model.associado.cep.length === 8) {
        const addressData = await cep(this.model.associado.cep);
        this.model.associado.city = addressData.city;
        this.model.associado.neighborhood = addressData.neighborhood;
        this.model.associado.state = addressData.state;
        this.model.associado.street = addressData.street;
      }
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
      const { data } = await api.get(
        `/admin/associates/${this.model.associado.user_id}`
      );

      this.other = !this.registeredTypes.includes(data.marital_status);
      data.birth = data.birth
        ? this.moment(data.birth).format("YYYY-MM-DD")
        : "";
      data.start_at = data.start_at
        ? this.moment(data.start_at).format("YYYY-MM-DD")
        : "";
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
          `/admin/associates/${this.model.associado.user_id}`,
          associadoData
        );
        data.birth = data.birth
          ? this.moment(data.birth).format("YYYY-MM-DD")
          : "";
        data.start_at = data.start_at
          ? this.moment(data.start_at).format("YYYY-MM-DD")
          : "";
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
          `/admin/users/${this.model.associado.user_id}/profile-pictures`,
          data,
          config
        );
        this.$toasted.show("Foto de perfil salva com sucesso");
        const { data: profile_pictureData } = await api.get(
          `/admin/users/${this.model.associado.user_id}/profile-pictures`
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
    async handleSubmitRemoveAssociado() {
      const loader = this.$loading.show({
        container: this.$refs.modal_confirmation_delete,
        width: 160,
        height: 160,
        opacity: 0,
      });
      try {
        await api.delete(`/admin/associates/${this.model.associado.user_id}`);
        this.$toasted.show("Associado removido com sucesso");
        this.$router.back();
      } catch (e) {
        this.$toasted.error("Ocorreu um erro ao remover o associado");
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
          `/admin/users/${this.model.associado.user_id}/change-password`,
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
    async handleSubmitToggleStatus() {
      const loader = this.$loading.show({
        container: this.$refs.associado_form,
        width: 140,
        height: 140,
      });
      try {
        const status = {
          account_validated: !this.model.associado.account_validated,
        };
        const {
          data: { account_validated },
        } = await api.put(
          `/admin/associates/${this.model.associado.user_id}/update-status`,
          status
        );
        this.model.associado.account_validated = account_validated;
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
