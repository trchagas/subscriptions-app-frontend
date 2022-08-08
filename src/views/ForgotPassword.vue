<template>
  <div class="row justify-content-center">
    <div class="col-lg-5 col-md-7">
      <div
        ref="formContainer"
        class="card bg-secondary shadow border-0 vld-parent"
      >
        <div class="card-header bg-transparent pb-4 pt-4">
          <img
            class="mx-auto d-block img-fluid"
            width="30%"
            :src="defaultLogo"
          />
        </div>
        <div class="card-body px-lg-5 py-lg-4">
          <div class="text-center text-muted mb-4">
            <h4>Esqueceu sua senha?</h4>
            <small>
              Digite o endereço de email de sua conta e nós enviaremos um link
              para resetar sua senha.
            </small>
          </div>
          <form role="form" @submit="handleSubmit">
            <base-input
              v-model="model.email"
              class="input-group-alternative mb-3"
              placeholder="Email da conta"
              addon-left-icon="ni ni-email-83"
            />

            <base-alert v-if="error" type="danger" class="text-center">
              <i class="fas fa-exclamation-circle mr-1" />
              <strong>Erro!</strong> {{ error }}
            </base-alert>
            <base-alert v-if="success" type="success" class="text-center">
              <i class="fas fa-mail mr-1" /> <strong>Sucesso!</strong>
              {{ success }}
            </base-alert>
            <div class="text-center">
              <base-button
                v-if="showButton"
                native-type="submit"
                type="warning"
                class="mt-3 mb-4"
              >
                Enviar email de redefinição
              </base-button>
              <span v-else class="text-sm text-muted mt-1 mb-4">
                Não recebeu o email?
                <base-button
                  native-type="submit"
                  type="link"
                  class="p-0 mb-1 m-0"
                >
                  Enviar novamente
                </base-button>
              </span>
            </div>
          </form>
        </div>
      </div>
      <div class="row mt-3">
        <div class="col-6">
          <router-link to="/login" class="text-light">
            <small> Voltar para login </small>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import api from "../services/api";

export default {
  name: "ForgotPassword",
  data() {
    return {
      model: {
        email: "",
      },
      success: "",
      error: "",
      showButton: true,
    };
  },
  computed: {
    defaultLogo() {
      return `/img/brand/${
        window.location.host.includes("cobusiness")
          ? "cobusiness.png"
          : "orquestrando_logo.png"
      }`;
    },
  },
  methods: {
    async handleSubmit(e) {
      e.preventDefault();
      this.error = this.success = "";
      this.model.email = this.model.email.trim();
      if (!this.model.email) {
        this.error = "Preencha seu e-mail para continuar.";
      } else {
        let loader = this.$loading.show({
          container: this.$refs.formContainer,
          width: 128,
          height: 128,
        });
        try {
          await api.post("/users/forgot-password", this.model);
          this.showButton = false;
          this.success =
            "Verifique pelo email de redefinição de senha em sua caixa de entrada.";
          this.$toasted.show("Email de redefinição enviado com sucesso");
        } catch (e) {
          const strError = "Não foi possível enviar o email de redefinição.";
          const hasErrorMessage =
            e.response && e.response.data && e.response.data.message;
          this.error = hasErrorMessage ? e.response.data.message : strError;
          this.$toasted.error(this.error);
        } finally {
          loader.hide();
        }
      }
    },
  },
};
</script>
<style scoped></style>
