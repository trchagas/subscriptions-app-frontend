<template>
  <div>
    <base-header class="header pb-8 pt-5 pt-lg-8 d-flex align-items-center">
      <!-- Mask -->
      <span class="mask opacity-8" />
      <!-- Header container -->
      <div class="container-fluid align-items-center">
        <div class="row">
          <div class="col-12 d-block d-md-none">
            <router-link
              :to="'/'"
              class="btn-link font-weight-normal text-white"
              title="Voltar para o início"
              ><i class="fas fa-chevron-left mr-1" /> Voltar</router-link
            >
          </div>
          <div class="col-lg-7 col-md-10">
            <p class="text-white my-3">
              Aqui você pode criar eventos para serem adicionados em sua agenda.
              Os eventos podem ser compartilhados com outros usuários.
            </p>
          </div>
        </div>
      </div>
    </base-header>
    <agenda-view />
  </div>
</template>

<script>
import AgendaView from "@/components/Agenda/AgendaView";

export default {
  components: {
    AgendaView,
  },
};
</script>
