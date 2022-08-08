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
        <div class="card-body px-lg-5 py-lg-5">
          <div class="text-center text-muted mb-4">
            <h4>Redifinição de senha</h4>
            <small
              >Aqui você poderá redefinir a senha para a conta
              <b class="font-weight-bold">{{ $route.params.email }}</b></small
            >
          </div>
          <form role="form" @submit="handleSubmit">
            <base-input
              v-model="model.newPassword"
              type="password"
              placeholder="Nova senha"
              addon-left-icon="ni ni-lock-circle-open"
            /><base-input
              v-model="model.newPassword_confirmation"
              type="password"
              placeholder="Confirmar nova senha"
              addon-left-icon="ni ni-lock-circle-open"
            />
            <p
              v-show="
                model.newPassword &&
                model.newPassword_confirmation &&
                !newPasswordInputsMatch()
              "
              class="text-right pt-0 text-sm text-muted"
            >
              Senhas não conferem!
            </p>
            <base-alert v-if="error" type="danger" class="text-center">
              <i class="fas fa-exclamation-circle mr-1" />
              <strong>Erro!</strong> {{ error }}
            </base-alert>
            <div class="text-center">
              <base-button
                native-type="submit"
                type="warning"
                class="mt-1 mb-4"
                :disabled="!newPasswordInputsMatch()"
              >
                Redefinir senha
              </base-button>
            </div>
          </form>
        </div>
      </div>
      <div class="row mt-3">
        <div class="col-6">
          <router-link to="/login" class="text-light">
            <small>Voltar para login</small>
          </router-link>
        </div>
        <div class="col-6 text-right">
          <router-link to="/forgot-password" class="text-light">
            <small>Solicitar novo email de redefinição</small>
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
        newPassword: "",
        newPassword_confirmation: "",
      },
      error: "",
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
      this.error = "";
      let loader = this.$loading.show({
        container: this.$refs.formContainer,
        width: 128,
        height: 128,
      });
      try {
        await api.put(
          `/users/forgot-password/${this.$route.params.token}/${this.$route.params.email}`,
          this.model
        );
        this.$toasted.show("Senha alterada com sucesso!");
        this.$router.push("/");
      } catch (e) {
        const strError = "Ocorreu um errro ao alterar a senha.";
        const hasErrorMessage =
          e.response && e.response.data && e.response.data.message;
        this.error = hasErrorMessage ? e.response.data.message : strError;
        this.$toasted.error(strError);
      } finally {
        loader.hide();
      }
    },
    newPasswordInputsMatch() {
      if (this.model.newPassword && this.model.newPassword_confirmation) {
        return this.model.newPassword === this.model.newPassword_confirmation;
      }
      return false;
    },
  },
};
</script>
<style scoped></style>
