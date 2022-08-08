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
              :to="'/professor/projetos'"
              class="btn-link font-weight-normal text-white"
              title="Voltar para a listagem de projetos"
            >
              <i class="fas fa-chevron-left mr-1" /> Voltar
            </router-link>
          </div>
          <div class="col-lg-7 col-md-10">
            <p class="text-white mt-4 mb-2">
              Aqui você pode conferir todas as tarefas associadas ao projeto.
              Toda coluna e tarefa adicionadas serão exibidas abaixo. Clique e
              arraste para a posição desejada as colunas ou tarefas para
              ordená-las de acordo com a sua preferência.
            </p>
          </div>
        </div>
      </div>
    </base-header>

    <div class="container-fluid mt--7">
      <tarefas endpoint="professor" />
    </div>
  </div>
</template>
<script>
import Tarefas from "@/components/Projeto/Tarefas/Tarefas";

export default {
  name: "ProjetoTable",
  components: {
    Tarefas,
  },
};
</script>
