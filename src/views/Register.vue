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
            width="50%"
            :src="defaultLogo"
          />
        </div>
        <div class="card-body px-lg-5 py-lg-5">
          <div class="text-center text-muted mb-4">
            <small>Entre com suas credenciais</small>
          </div>
          <form role="form" @submit="handleSignIn">
            <base-input
              v-model="model.email"
              class="input-group-alternative mb-3"
              placeholder="Email"
              addon-left-icon="ni ni-email-83"
            />

            <base-input
              v-model="model.password"
              class="input-group-alternative"
              placeholder="Senha"
              type="password"
              addon-left-icon="ni ni-lock-circle-open"
            />

            <base-checkbox class="custom-control-alternative text-right mr-1">
              <span class="text-muted ml--3">Lembrar-me</span>
            </base-checkbox>
            <base-alert
              v-if="error"
              type="danger"
              class="text-center mt-4 mb-0"
            >
              <i class="fas fa-exclamation-circle mr-1" />
              {{ error }}
            </base-alert>

            <div class="text-center">
              <base-button
                native-type="submit"
                class="mt-4 px-5"
                type="default"
                title="Entrar no portal"
              >
                Entrar
              </base-button>
            </div>
          </form>
        </div>
      </div>
      <div class="row mt-3">
        <div class="col-12">
          <router-link to="/forgot-password" class="text-light float-right">
            <small> Esqueceu sua senha? </small>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import api from "../services/api";
import { login } from "../services/auth";

export default {
  name: "Login",
  data() {
    return {
      model: {
        email: "",
        password: ""
      },
      error: ""
    };
  },
  computed: {
    defaultLogo() {
      return `/img/brand/${
        window.location.host.includes("cobusiness")
          ? "cobusiness.png"
          : "orquestrando_logo.png"
      }`;
    }
  },
  methods: {
    async handleSignIn(e) {
      e.preventDefault();
      const user = this.model;
      user.email = user.email.trim();
      if (!user.email || !user.password) {
        this.error = "Preencha seu email e senha para continuar.";
      } else {
        let loader = this.$loading.show({
          container: this.$refs.formContainer,
          width: 128,
          height: 128
        });
        try {
          const { data } = await api.post("/sessions", user);
          login(data.auth.token, data.roles);
          const rolesMap = {
            admin: "diretoria",
            student: "aluno",
            teacher: "professor",
            partner: "parceiro",
            associate: "associado",
            volunteer: "voluntario"
          };
          this.$router.push(`/${rolesMap[data.roles[0]]}`);
          this.$toasted.show("Bem-vindo! :)");
        } catch (err) {
          this.error =
            "Houve um problema com o login, verifique suas credenciais.";
          this.$toasted.error("Ocorreu um erro com com o login");
        } finally {
          loader.hide();
        }
      }
    }
  }
};
</script>
<style scoped></style>
