<template>
  <div>
    <base-header type="gradient-default" class="pb-3 py-5 pt-md-8">
      <div class="container-fluid d-flex align-items-center">
        <div class="row">
          <div class="col-lg-8 col-md-10">
            <p class="text-white mt-3 mb-5">
              Aqui você pode gerenciar os usuários cadastrados.
            </p>
          </div>
        </div>
      </div>
    </base-header>
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <h6 class="heading-small text-muted mb-4">
            Que tipo de usuário deseja visualizar?
          </h6>
        </div>
        <div class="w-100 d-grid justify-content-center px-6">
          <base-button
            type="primary"
            class="d-flex flex-column text-center p-4 w-100"
            :custom="true"
            @click="handleUserType('student')"
          >
            <i class="fas fa-book fa-6x mb-4 w-100" />
            <span class="w-100">Alunos</span>
          </base-button>

          <base-button
            type="primary"
            class="d-flex flex-column text-center p-4 w-100"
            :custom="true"
            @click="handleUserType('teacher')"
          >
            <i class="fas fa-chalkboard-teacher fa-6x mb-4 w-100" />
            <span class="w-100">Professores</span>
          </base-button>

          <base-button
            type="primary"
            class="d-flex flex-column text-center p-4 w-100"
            :custom="true"
            @click="handleUserType('volunteer')"
          >
            <i class="fas fa-hands-helping fa-6x mb-4 w-100" />
            <span class="w-100">Voluntários</span>
          </base-button>

          <base-button
            type="primary"
            class="d-flex flex-column text-center p-4 w-100"
            :custom="true"
            @click="handleUserType('partner')"
          >
            <i class="fas fa-user-tie fa-6x mb-4 w-100" />
            <span class="w-100">Parceiros</span>
          </base-button>

          <base-button
            type="primary"
            class="d-flex flex-column text-center p-4 w-100"
            :custom="true"
            @click="handleUserType('associate')"
          >
            <i class="fas fa-hand-holding-usd fa-6x mb-4 w-100" />
            <span class="w-100">Associados</span>
          </base-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const mapRoutes = {
  student: "alunos",
  partner: "parceiros",
  associate: "associados",
  volunteer: "voluntarios",
  teacher: "professores",
};

export default {
  name: "AdminUsuarios",
  components: {},
  data() {
    return {};
  },

  methods: {
    handleUserType(role) {
      this.$router.push(`/diretoria/usuarios/${mapRoutes[role]}`);
    },
  },
};
</script>
<style scoped>
.d-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  grid-gap: 0.5em;
}
</style>
