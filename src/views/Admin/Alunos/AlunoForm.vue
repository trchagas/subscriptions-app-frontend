<template>
  <div>
    <base-header type="gradient-default" class="header pb-8 py-5 pt-md-8">
      <div class="container-fluid d-flex align-items-center">
        <div class="row">
          <div class="col-12 mt-0 mt-md-4 mt-lg-0 d-block">
            <router-link
              :to="'/diretoria/usuarios/alunos'"
              class="btn-link font-weight-normal text-white"
              title="Voltar para a listagem de alunos"
            >
              <i class="fas fa-chevron-left mr-1" /> Voltar
            </router-link>
          </div>
          <div class="col-lg-7 col-md-10">
            <p class="text-white mt-4 mb-2">
              Aqui é possível cadastrar um novo aluno ao sistema. Por questões
              de segurança, certifique-se de inserir as informações corretas,
              pois o usuário criado terá acesso a todas funções do perfil de
              aluno do portal.
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
              <div class="row align-items-center w-100">
                <div class="col-6">
                  <h3 class="mb-0">
                    <i class="fas fa-users mr-2" /> Novo aluno
                  </h3>
                </div>
                <div class="col-6 d-flex justify-content-end">
                  <div class="btn-group">
                    <base-button
                      :class="{
                        'bg-success': type === 'default',
                        'border-success': type === 'default',
                        'bg-dark': type === 'coral',
                        'border-dark': type === 'coral',
                      }"
                      @click="type = 'default'"
                    >
                      Padrão
                    </base-button>
                    <base-button
                      :class="{
                        'bg-success': type === 'coral',
                        'border-success': type === 'coral',
                        'bg-dark': type === 'default',
                        'border-dark': type === 'default',
                      }"
                      @click="type = 'coral'"
                    >
                      Coral
                    </base-button>
                  </div>
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
                  <div class="col-lg-6">
                    <base-input
                      v-model.trim="model.aluno.name"
                      label="Nome do aluno*"
                      placeholder="Digite o nome"
                    />
                  </div>
                  <div class="col-lg-6">
                    <base-input label="Sexo biológico*">
                      <select v-model="model.aluno.gender" class="form-control">
                        <option value="" selected disabled>
                          Selecione uma opção
                        </option>
                        <option key="male" value="male">Masculino</option>
                        <option key="female" value="female">Feminino</option>
                        <option value="other">Não informar</option>
                      </select>
                    </base-input>
                  </div>
                  <div class="col-lg-6">
                    <base-input label="Área*" placeholder="Digite a atuação">
                      <select
                        v-model="model.aluno.working_area"
                        class="form-control"
                      >
                        <option value="" selected disabled>
                          Selecione uma opção
                        </option>
                        <option key="Dança" value="Dança">Dança</option>
                        <option key="Teatro" value="Teatro">Teatro</option>
                        <option key="Música" value="Música">Música</option>
                        <option key="Luteria" value="Luteria">Luteria</option>
                      </select>
                    </base-input>
                  </div>
                  <div class="col-lg-6">
                    <base-input
                      v-model.trim="model.aluno.specialty"
                      label="Especialidade"
                      placeholder="Ex.: instrumento"
                    />
                  </div>
                  <div class="col-lg-6">
                    <label class="form-control-label">
                      Telefone (com DDD)*
                    </label>
                    <base-input addon-left-icon="fas fa-phone">
                      <the-mask
                        v-model="model.aluno.phone"
                        :mask="['(##) ####-####', '(##) #####-####']"
                        class="form-control"
                        type="tel"
                        placeholder="Telefone (fixo ou celular)"
                      />
                    </base-input>
                  </div>
                  <div class="col-lg-6">
                    <base-input label="Identidade (RG/CPF)">
                      <the-mask
                        v-model="model.aluno.rg_cpf"
                        :mask="['XXX.XXX.XXX-XX', 'XXX.XXX.XXX-X']"
                        class="form-control"
                        placeholder="000.000.000-00"
                      />
                    </base-input>
                  </div>
                  <div class="col-lg-6">
                    <base-input label="Número de Identificação Social">
                      <the-mask
                        v-model="model.aluno.social_identification_number"
                        :mask="['###.#####.##-#']"
                        class="form-control"
                        placeholder="000.00000.00-0"
                      />
                    </base-input>
                  </div>
                  <div class="col-lg-6">
                    <label class="form-control-label d-block">
                      Data de nascimento
                    </label>
                    <base-input
                      v-model="model.aluno.birth"
                      addon-left-icon="fas fa-calendar"
                      type="date"
                      placeholder="Data de nascimento"
                    />
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
                  <div v-if="type === 'default'" class="col-lg-6">
                    <base-input
                      v-model.trim="model.aluno.responsible_name"
                      label="Nome do responsável"
                      placeholder="Digite o nome"
                    />
                  </div>
                  <div v-if="type === 'default'" class="col-lg-6">
                    <base-input label="Identidade do responsável (RG/CPF)">
                      <the-mask
                        v-model="model.aluno.responsible_rg_cpf"
                        :mask="['XXX.XXX.XXX-XX', 'XXX.XXX.XXX-X']"
                        class="form-control"
                        placeholder="000.000.000-00"
                      />
                    </base-input>
                  </div>
                  <div class="col-lg-12">
                    <base-input label="Biografia">
                      <textarea
                        v-model="model.aluno.short_bio"
                        rows="2"
                        class="form-control"
                        placeholder="Breve biografia do aluno"
                      />
                    </base-input>
                  </div>
                  <div class="col-lg-12">
                    <hr class="mt-2 mb-4" />
                    <base-input label="Observações">
                      <textarea
                        v-model="model.aluno.note"
                        rows="2"
                        class="form-control"
                        placeholder="Observações sobre o aluno"
                      />
                    </base-input>
                  </div>
                </div>
                <hr class="mt-2 mb-4" />
                <div class="row ml-1 mb-4">
                  <div class="col-12 pl-0">
                    <h6 class="heading-small text-muted">Documentos</h6>
                  </div>
                </div>
                <div ref="complementar_info_container" class="col-lg-12">
                  <ul class="list-group list-group-flush">
                    <li
                      class="d-flex list-group-item justify-content-between align-items-center"
                    >
                      <span>Identidade do aluno*</span>
                      <file-select
                        v-model="files.identity"
                        title="Upload"
                        type="primary"
                        accept="application/pdf"
                        :mb-size="2"
                      />
                    </li>
                    <li
                      class="d-flex list-group-item justify-content-between align-items-center"
                    >
                      <span>Comprovante de endereço*</span>
                      <file-select
                        v-model="files.address"
                        title="Upload"
                        type="primary"
                        accept="application/pdf"
                        :mb-size="2"
                      />
                    </li>
                    <li
                      class="d-flex list-group-item justify-content-between align-items-center"
                    >
                      <span>Ficha de inscrição*</span>
                      <file-select
                        v-model="files.application_form"
                        title="Upload"
                        accept="application/pdf"
                        type="primary"
                        :mb-size="2"
                      />
                    </li>
                    <li
                      v-if="type === 'default'"
                      class="d-flex list-group-item justify-content-between align-items-center"
                    >
                      <span>Identidade do responsável</span>
                      <file-select
                        v-model="files.responsible_identity"
                        title="Upload"
                        type="primary"
                        accept="application/pdf"
                        :mb-size="2"
                      />
                    </li>
                    <li
                      v-if="type === 'default'"
                      class="d-flex list-group-item justify-content-between align-items-center"
                    >
                      <span>Atestado de frequência/matrícula</span>
                      <file-select
                        v-model="files.school_attendance"
                        title="Upload"
                        type="primary"
                        accept="application/pdf"
                        :mb-size="2"
                      />
                    </li>
                  </ul>
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
                    type="primary"
                    class="mt-4"
                    :custom="true"
                    :disabled="!isValidModel"
                    @click="handleOpenModalConfirmation"
                  >
                    Cadastrar novo aluno
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
            <span class="font-weight-bold">aluno</span> do portal.
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
          @click="handleSubmitNewAluno"
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
  name: "AdminCriarAlunoes",
  data() {
    return {
      model: {
        user: {
          email: "",
          password: "",
        },
        aluno: {
          name: "",
          rg_cpf: "",
          social_identification_number: "",
          phone: "",
          working_area: "",
          specialty: "",
          birth: "",
          nis: "",
          gender: "",
          note: "",
          short_bio: "",
          responsible_name: "",
          responsible_rg_cpf: "",
        },
      },
      files: {
        identity: null,
        responsible_identity: null,
        address: null,
        school_attendance: null,
        application_form: null,
      },
      type: "default",
      modals: {
        modalConfirmation: false,
        inputConfirmation: "",
      },
      error: "",
      requiredFields: ["name", "phone", "working_area", "gender"],
      requiredFiles: ["identity", "address", "application_form"],
      showComplementarInfo: true,
    };
  },
  computed: {
    isValidModel() {
      const user = this.model.user;
      if (!user.email || !user.password) return false;
      const aluno = this.model.aluno;
      for (const key of this.requiredFields) {
        if (aluno[key] === "") return false;
      }
      for (const key of this.requiredFiles) {
        if (!this.files[key]) return false;
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
    async handleSubmitNewAluno(e) {
      e.preventDefault();
      const loader = this.$loading.show({
        container: this.$refs.modal_confirmation,
        width: 90,
        height: 90,
        opacity: 0,
      });
      this.error = "";
      try {
        const files = this.files;
        const data = new FormData();
        data.append("identity_file", files.identity, files.identity.name);
        data.append("address_file", files.address, files.address.name);
        data.append(
          "application_form_file",
          files.application_form,
          files.application_form.name
        );
        if (files.school_attendance)
          data.append(
            "school_attendance_file",
            files.school_attendance,
            files.school_attendance.name
          );
        if (files.responsible_identity)
          data.append(
            "responsible_identity_file",
            files.responsible_identity,
            files.responsible_identity.name
          );
        const aluno = this.model.aluno;
        const config = {
          headers: {
            "content-type": "multipart/form-data",
          },
        };
        const info = {
          ...aluno,
          ...this.model.user,
          type: this.type,
          password_confirmation: this.model.user.password,
        };
        for (const key in info) data.append(key, info[key]);
        await api.post("/admin/students", data, config);
        this.$toasted.show("Novo aluno cadastradro com sucesso");
        this.$router.push("/diretoria/usuarios/alunos");
      } catch (e) {
        const genericError = "Ocorreu um erro ao cadastrar o aluno.";
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
