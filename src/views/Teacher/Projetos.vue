<template>
  <div>
    <base-header class="header pb-8 pt-5 pt-lg-8 d-flex align-items-center">
      <!-- Mask -->
      <span class="mask opacity-8" />
      <!-- Header container -->
    </base-header>

    <div class="container-fluid mt--6">
      <projetos-list endpoint="professor" />
    </div>
  </div>
</template>
<script>
import ProjetosList from "@/components/Projeto/ProjetosList";

export default {
  components: {
    ProjetosList,
  },
};
</script>
