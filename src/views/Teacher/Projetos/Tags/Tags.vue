<template>
  <div>
    <base-header class="header pb-8 pt-5 pt-lg-8 d-flex align-items-center">
      <!-- Mask -->
      <span class="mask opacity-8" />
      <!-- Header container -->
      <div class="container-fluid d-flex align-items-center">
        <div class="row">
          <div class="col-12 mt-0 mt-md-4 mt-lg-0 d-block">
            <router-link
              :to="
                returnToProject
                  ? `/professor/projetos/${$route.params.id}/tarefas`
                  : '/professor/projetos'
              "
              class="btn-link font-weight-normal text-white"
              :title="
                returnToProject
                  ? 'Voltar para visualização do projeto'
                  : 'Voltar para a listagem de projetos'
              "
            >
              <i class="fas fa-chevron-left mr-1" /> Voltar
            </router-link>
          </div>
          <div class="col-lg-7 col-md-10">
            <p class="text-white mt-4 mb-2">
              Aqui você pode gerenciar as tags do projeto, o que inclui
              visualizar e cadastrar novas tags ou excluir tags já cadastradas.
              As tags podem ser usadas para melhor visualização das tarefas de
              acordo com a sua preferência.
            </p>
          </div>
        </div>
      </div>
    </base-header>

    <div class="container-fluid mt--7">
      <tags endpoint="professor" @returnToProject="returnToProject = true" />
    </div>
  </div>
</template>
<script>
import Tags from "@/components/Projeto/Tags/Tags";

export default {
  components: {
    Tags,
  },
  data() {
    return {
      returnToProject: false,
    };
  },
};
</script>
