<template>
  <div>
    <base-header type="gradient-default" class="pb-3 py-5 pt-md-8">
      <div class="container-fluid d-flex align-items-center">
        <div class="row">
          <div class="col-lg-8 col-md-10">
            <p class="text-white mt-3 mb-5">
              Deseja se voluntariar? A nossa busca é por pessoas que
              compartilhem dos mesmos ideais da Orquestrando Arte.
            </p>
          </div>
        </div>
      </div>
    </base-header>
    <div class="container-fluid">
      <div class="row mt--5">
        <div class="row">
          <div class="col-xl-9">
            <card shadow type="secondary">
              <div slot="header" class="bg-white border-0">
                <div class="row align-items-center">
                  <div class="col-8">
                    <h3 class="mb-0">
                      <i class="fas fa-users mr-2" /> Formulário
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
                      <base-input
                        v-model.trim="model.voluntario.name"
                        label="Nome"
                        placeholder="Digite o nome"
                      />
                    </div>
                    <div class="col-lg-6">
                      <label class="form-control-label">Email</label>
                      <base-input
                        v-model.trim="model.user.email"
                        placeholder="Email"
                        addon-left-icon="ni ni-email-83"
                      />
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
                      <base-input label="Área*" placeholder="Área">
                        <select
                          v-model="model.voluntario.working_area"
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
                      <label class="form-control-label">
                        Telefone (com DDD)*
                      </label>
                      <base-input addon-left-icon="fas fa-phone">
                        <the-mask
                          v-model="model.voluntario.phone"
                          :mask="['(##) ####-####', '(##) #####-####']"
                          class="form-control"
                          type="tel"
                          placeholder="Telefone (fixo ou celular)"
                        />
                      </base-input>
                    </div>
                    <div class="col-lg-6">
                      <base-input label="Sexo biológico*">
                        <select
                          v-model="model.voluntario.gender"
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
                      <label class="form-control-label d-block">
                        Data de nascimento
                      </label>
                      <base-input
                        v-model="model.voluntario.birth"
                        addon-left-icon="fas fa-calendar"
                        type="date"
                        placeholder="Data de nascimento"
                      />
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
                      @click="handleSubmitRegister"
                    >
                      Cadastrar
                    </base-button>
                  </div>
                </form>
              </template>
            </card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import api from "../services/api";
export default {
  name: "PublicVoluntario",
  data() {
    return {
      model: {
        user: {
          email: "",
        },
        voluntario: {
          name: "",
          phone: "",
          working_area: "",
          birth: null,
          gender: "",
        },
      },
      error: "",
      requiredFields: ["name", "phone", "working_area", "gender"],
      showComplementarInfo: true,
    };
  },
  computed: {
    isValidModel() {
      const user = this.model.user;
      if (!user.email) return false;
      const voluntario = this.model.voluntario;
      for (const key of this.requiredFields) {
        if (voluntario[key] === "") return false;
      }
      return true;
    },
  },
  methods: {
    async handleSubmitRegister(e) {
      e.preventDefault();
      const loader = this.$loading.show({
        container: this.$refs.modal_confirmation,
        width: 90,
        height: 90,
        opacity: 0,
      });
      this.error = "";
      const voluntario = this.model.voluntario;
      try {
        await api.post("/volunteer/volunteers", {
          ...this.model.user,
          ...voluntario,
        });
        this.$toasted.show("Solicitação de cadastro realizada com sucesso.");
        this.$router.push("/");
      } catch (e) {
        const genericError = "Ocorreu um erro ao solicitar o cadastro.";
        const hasErrorResponseData = e.response && e.response.data;
        let customError = genericError;
        if (hasErrorResponseData) {
          const data = e.response.data;
          if (data[0] && data[0].message) customError = data[0].message;
          else if (data.message) customError = data.message;
        }
        this.error = hasErrorResponseData ? customError : genericError;
        this.$toasted.error(genericError);
      }
      loader.hide();
    },
  },
};
</script>
<style scoped>
.card-icon {
  opacity: 0.5;
  font-size: 1.1rem;
}

.card-link:hover {
  cursor: pointer;
  -webkit-box-shadow: 0 7px 14px rgba(50, 50, 93, 0.1),
    0 3px 6px rgba(0, 0, 0, 0.08);
  box-shadow: 0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08);
  -webkit-transform: translateY(-1px);
  transform: translateY(-1px);
}
</style>
