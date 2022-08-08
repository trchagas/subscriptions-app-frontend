<template>
  <div>
    <base-header type="gradient-default" class="header pb-8 py-5 pt-md-8">
      <div class="container-fluid d-flex align-items-center">
        <div class="row">
          <div class="col-12 mt-0 mt-md-4 mt-lg-0 d-block">
            <router-link
              :to="'/diretoria/usuarios/professores'"
              class="btn-link font-weight-normal text-white"
              title="Voltar para a listagem de professores"
            >
              <i class="fas fa-chevron-left mr-1" /> Voltar
            </router-link>
          </div>
          <div class="col-lg-7 col-md-10">
            <p class="text-white mt-4 mb-2">
              Aqui é possível cadastrar um novo professor ao sistema. Por
              questões de segurança, certifique-se de inserir as informações
              corretas, pois o usuário criado terá acesso a todas funções do
              perfil de professor do portal.
            </p>
          </div>
        </div>
      </div>
    </base-header>
    <div ref="main_container" class="container-fluid mt--7">
      <div class="row">
        <div class="col-xl-9">
          <card shadow type="secondary">
            <div slot="header" class="bg-white border-0">
              <div class="row align-items-center">
                <div class="col-8">
                  <h3 class="mb-0">
                    <i class="fas fa-users mr-2" /> Novo professor
                  </h3>
                </div>
              </div>
            </div>
            <template>
              <form role="form">
                <div class="row ml-1 justify-content-between">
                  <h6 class="heading-small text-muted mb-4">
                    Informações da conta
                  </h6>
                  <div class="mr-4">
                    <label class="form-control-label d-block mb-0">
                      Existente
                    </label>
                    <base-switch
                      :value="model.exists"
                      class="mb-0"
                      @input="switchChangedHandler($event, 'exists')"
                    />
                  </div>
                </div>
                <div v-if="!model.exists" class="row ml-lg-2">
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
                <div v-else class="row ml-lg-2">
                  <div class="col-lg-12">
                    <base-input label="Email do usuário">
                      <select v-model="selectUser" class="form-control">
                        <option value="" selected disabled>
                          Selecione uma opção
                        </option>
                        <option
                          v-for="user of existentUsers"
                          :key="user.user_id"
                          :value="user"
                        >
                          {{ user.email }}
                        </option>
                      </select>
                    </base-input>
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
                      v-model.trim="model.professor.name"
                      label="Nome do professor*"
                      placeholder="Digite o nome"
                    />
                  </div>

                  <div class="col-lg-6">
                    <base-input placeholder="Digite a atuação">
                      <label
                        class="form-control-label d-flex align-items-center"
                      >
                        Área*
                        <base-checkbox
                          v-model="other"
                          :checked="true"
                          class="ml-4 mr--4"
                        />
                        Outro
                      </label>
                      <select
                        v-if="!other"
                        v-model="model.professor.working_area"
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
                        v-model="model.professor.working_area"
                        placeholder="Digite a opção"
                      />
                    </base-input>
                  </div>
                  <div class="col-lg-6">
                    <base-input label="Sexo biológico*">
                      <select
                        v-model="model.professor.gender"
                        class="form-control"
                      >
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
                    <label class="form-control-label">
                      Telefone (com DDD)*
                    </label>
                    <base-input addon-left-icon="fas fa-phone">
                      <the-mask
                        v-model="model.professor.phone"
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
                    <base-input label="CPF">
                      <the-mask
                        v-model="model.professor.cpf"
                        :mask="['###.###.###-##']"
                        class="form-control"
                        type="tel"
                        placeholder="000.000.000-00"
                      />
                    </base-input>
                  </div>
                  <div class="col-lg-6">
                    <base-input label="Identidade">
                      <the-mask
                        v-model="model.professor.rg"
                        :mask="['XXX.XXX.XXX-X']"
                        class="form-control"
                        type="tel"
                        placeholder="Identidade"
                      />
                    </base-input>
                  </div>
                  <div class="col-lg-6">
                    <base-input label="CNPJ">
                      <the-mask
                        v-model="model.professor.cnpj"
                        :mask="['##.###.###/####-##']"
                        class="form-control"
                        type="tel"
                        placeholder="00.000.000/0000-00"
                      />
                    </base-input>
                  </div>
                  <div class="col-lg-6">
                    <label class="form-control-label d-block">
                      Especialidade
                    </label>
                    <base-input
                      v-model="model.professor.specialty"
                      placeholder="Especialidade"
                    />
                  </div>
                  <div class="col-lg-6">
                    <label class="form-control-label d-block">
                      Data de nascimento
                    </label>
                    <base-input
                      v-model="model.professor.birth"
                      addon-left-icon="fas fa-calendar"
                      type="date"
                      placeholder="Data de nascimento"
                    />
                  </div>
                  <div class="col-lg-6">
                    <label class="form-control-label d-block">
                      Data de início
                    </label>
                    <base-input
                      v-model="model.professor.start_at"
                      addon-left-icon="fas fa-calendar"
                      type="date"
                      placeholder="Data de início"
                    />
                  </div>
                  <div class="col-lg-12">
                    <base-input label="Biografia">
                      <textarea
                        v-model="model.professor.short_bio"
                        rows="2"
                        class="form-control"
                        placeholder="Breve biografia do professor"
                      />
                    </base-input>
                  </div>
                  <div class="col-lg-12">
                    <hr class="mt-2 mb-4" />
                    <base-input label="Observações">
                      <textarea
                        v-model="model.professor.note"
                        rows="2"
                        class="form-control"
                        placeholder="Observações sobre o professor"
                      />
                    </base-input>
                  </div>
                </div>
                <hr class="mt-2 mb-4" />
                <div class="row ml-1 mb-4">
                  <div class="col-12 pl-0">
                    <h6
                      class="heading-small text-muted"
                      @click="showBankInfo = !showBankInfo"
                    >
                      Informações bancárias
                      <i
                        v-if="showBankInfo"
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
                  v-show="showBankInfo"
                  ref="bank_info_container"
                  class="row ml-lg-2 vld-parent"
                >
                  <div class="col-lg-6">
                    <base-input label="Agência">
                      <the-mask
                        v-model="model.professor.bank_branch"
                        :mask="['####', '####-#', '####-##']"
                        class="form-control"
                        type="tel"
                        placeholder="Agência"
                      />
                    </base-input>
                  </div>
                  <div class="col-lg-6">
                    <base-input label="Conta corrente">
                      <the-mask
                        v-model="model.professor.checking_account"
                        :mask="[
                          '#####-#',
                          '######-#',
                          '#######-#',
                          '########-#',
                          '#########-#',
                          '###########-#',
                        ]"
                        class="form-control"
                        type="tel"
                        placeholder="Conta corrente"
                      />
                    </base-input>
                  </div>
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
                    Cadastrar novo professor
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
            <span class="font-weight-bold">professor</span> do portal.
          </p>
          <p class="mt-3">
            Por favor, digite
            <span class="font-weight-bold">{{ validEmail() }}</span>
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
          @click="handleSubmitNewProfessor"
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
  name: "AdminCriarProfessores",
  data() {
    return {
      model: {
        user: {
          email: "",
          password: "",
          user_id: "",
        },
        professor: {
          name: "",
          cpf: "",
          rg: "",
          cnpj: "",
          phone: "",
          working_area: "",
          specialty: null,
          birth: null,
          start_at: null,
          gender: "",
          note: null,
          short_bio: null,
          bank_branch: "",
          checking_account: "",
        },
        exists: false,
      },
      other: false,
      modals: {
        modalConfirmation: false,
        inputConfirmation: "",
      },
      selectUser: "",
      existentUsers: [],
      error: "",
      registeredTypes: [
        "Apoio Pedagógico",
        "Dança",
        "Luteria",
        "Música",
        "Teatro",
      ],
      extraType: "",
      requiredFields: ["name", "phone", "working_area", "gender"],
      showComplementarInfo: true,
      showBankInfo: true,
    };
  },
  computed: {
    isValidModel() {
      const user = this.model.user;
      if (
        (!this.model.exists && (!user.email || !user.password)) ||
        (this.model.exists && !this.selectUser)
      )
        return false;
      const professor = this.model.professor;
      for (const key of this.requiredFields) {
        if (professor[key] === "") return false;
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
  watch: {
    other() {
      if (!this.registeredTypes.includes(this.model.professor.working_area))
        this.extraType = this.model.professor.working_area;
      else this.extraType = "";
    },
  },
  async mounted() {
    await this.loadUsers();

    if (this.$route.query.user_id) this.loadVolunteer();
  },
  methods: {
    validEmail() {
      if (!this.model.exists) return this.model.user.email;
      else return this.selectUser.email;
    },
    async loadVolunteer() {
      const id = Number(this.$route.query.user_id);
      const loader = this.$loading.show({
        container: this.$refs.main_container,
        width: 90,
        height: 90,
        opacity: 0,
      });
      try {
        const { data } = await api.get(`/admin/volunteers/${id}`);
        Object.assign(this.model.user, data.user);
        Object.assign(this.model.professor, data);
        this.selectUser = this.existentUsers.find((u) => u.user_id === id);
        if (!this.registeredTypes.includes(this.model.professor.working_area)) {
          this.other = true;
          this.extraType = this.model.professor.working_area;
        }
        this.model.exists = true;
      } catch (e) {
        const genericError =
          "Ocorreu um erro ao buscar o voluntário desejado. Por favor, tente novamente.";
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
      } finally {
        loader.hide();
      }
    },
    async loadUsers() {
      const loader = this.$loading.show({
        container: this.$refs.main_container,
        width: 90,
        height: 90,
        opacity: 0,
      });
      try {
        const { data } = await api.get(
          "admin/users?table=volunteers&except=teachers"
        );
        this.existentUsers = data;
      } catch (e) {
        const genericError =
          "Ocorreu um erro ao buscar os usuários cadastrados.";
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
      } finally {
        loader.hide();
      }
    },
    inputConfirmationTextIsValid() {
      return this.modals.inputConfirmation === this.validEmail();
    },
    handleOpenModalConfirmation() {
      this.modals.inputConfirmation = "";
      this.modals.modalConfirmation = true;
    },
    async handleSubmitNewProfessor(e) {
      e.preventDefault();
      const loader = this.$loading.show({
        container: this.$refs.modal_confirmation,
        width: 90,
        height: 90,
        opacity: 0,
      });
      this.error = "";
      const professor = this.model.professor;
      const userData = !this.model.exists
        ? this.model.user
        : { user_id: this.selectUser.user_id };
      try {
        await api.post("/admin/teachers", {
          ...userData,
          password_confirmation: this.model.user.password,
          ...professor,
        });
        this.$toasted.show("Novo professor cadastradro com sucesso");
        this.$router.push("/diretoria/usuarios/professores");
      } catch (e) {
        const genericError = "Ocorreu um erro ao cadastrar o professor.";
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
    switchChangedHandler(event, prop) {
      if (typeof event === "boolean") this.model[prop] = event;
    },
  },
};
</script>

<style></style>
