<template>
  <div>
    <base-header type="gradient-default" class="pb-3 py-5 pt-md-8">
      <div class="container-fluid d-flex align-items-center">
        <div class="row">
          <div class="col-lg-8 col-md-10">
            <p class="text-white mt-3 mb-5">
              Seja bem-vindo(a) ao Portal Orquestrando Arte!
            </p>
          </div>
        </div>
      </div>
    </base-header>
    <modal
      :show="error === 'multiple_roles'"
      modal-classes="modal-dialog-centered "
      body-classes="pb-0"
      header-classes="pb-0"
    >
      <h6 id="modal-title-notification" slot="header" class="modal-title">
        Login
      </h6>
      <div ref="modal_edit_tag" class="vld-parent">
        <div class="py-3 text-center">
          <i class="fas fa-user fa-3x" />
          <h4 class="heading mt-4">Selecionar Conta</h4>
          <p>
            Você possui mais de um perfil cadastrado a este e-mail, selecione o
            perfil que deseja utilizar.
          </p>
        </div>
      </div>
      <template>
        <form role="form">
          <div class="row">
            <div class="col-lg-12">
              <label class="form-control-label"> Papel </label>
              <div>
                <base-input>
                  <select v-model="selectRole" class="form-control">
                    <option selected disabled value="">
                      Selecione o perfil
                    </option>
                    <option
                      v-for="(role, index) in roles"
                      :key="index"
                      :value="role"
                    >
                      {{ convertRole(role) }}
                    </option>
                  </select>
                </base-input>
              </div>
            </div>
          </div>
        </form>
      </template>
      <template slot="footer">
        <div class="w-100 d-flex justify-content-around">
          <base-button type="link" text-color="dark" @click="handleLogout()">
            Sair
          </base-button>
          <base-button
            type="primary"
            :disabled="!selectRole"
            @click="handleSubmit()"
          >
            Alterar
          </base-button>
        </div>
      </template>
    </modal>
  </div>
</template>
<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { logout, getRoles, setRole } from "../services/auth";

export default {
  name: "Avisos",
  components: {},
  data() {
    return {
      roles: [],
      error: "",
      validErrors: ["not_valid", "multiple_roles"],
      selectRole: "",
    };
  },
  mounted() {
    this.recognizeWarning();
  },
  methods: {
    recognizeWarning() {
      const roles = getRoles();
      if (roles) {
        this.roles = JSON.parse(roles);
        if (this.roles.length > 1) this.error = this.validErrors[1];
      }
    },
    convertRole(role) {
      const roleMap = {
        teacher: "Professor",
        student: "Aluno",
        volunteer: "Voluntário",
        partner: "Parceiro",
        associate: "Associado",
        admin: "Administrador",
      };
      return roleMap[role];
    },
    handleLogout() {
      logout();
      this.$toasted.show("Até breve! :)");
      this.$router.push("/");
    },
    handleSubmit() {
      setRole(this.selectRole);
      this.$router.push("/");
    },
  },
};
</script>
<style scoped>
.border-group {
  border-radius: 10px;
  border: 2px solid #eaeaea;
}

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

.post-card {
  border-radius: 10px;
  border: 1px solid #e8e8e8;
}
.secondary-button {
  border-radius: 10px;
  color: #c95fa7;
  border: 1px solid #c95fa7;
}
.green-button {
  border-radius: 10px;
  color: #349740;
  border: 1px solid #349740;
}
.red-button {
  border-radius: 10px;
  color: white;
  background-color: #c03434;
  border: 1px solid #c03434;
}
.cursor-pointer {
  cursor: pointer;
}
.click-name {
  cursor: pointer;
}
</style>
