<template>
  <div ref="materials_container" class="vld-parent">
    <base-header type="gradient-default" class="pb-6 pb-8 pt-5 pt-md-8">
      <!-- Mask -->
      <span class="bg-gradient-default opacity-8" />
      <!-- Header container -->
      <div class="container-fluid d-flex align-items-center">
        <div class="row">
          <div class="col-lg-8 col-md-10">
            <p class="text-white my-3">
              Aqui você pode conferir as atendimentos registradas. Toda nova
              atendimento registrada será exibida na listagem abaixo.
            </p>
          </div>
        </div>
      </div>
    </base-header>

    <div class="container-fluid mt--7">
      <div class="row">
        <div class="col-lg-12">
          <div v-if="empty" class="row">
            <div class="col-12 mb-3 text-center">
              <badge type="info" class="bg-white">
                Não existem atendimentos registradas até o momento
              </badge>
            </div>
          </div>
          <div class="text-center mb-4">
            <base-button
              v-tooltip="'Clique para registrar uma novo atendimento'"
              :custom="true"
              size="sm"
              type="primary"
              class="mb-3"
              @click="$router.push('/diretoria/atendimentos/novo')"
            >
              <i class="fas fa-plus mr-1" /> Registrar novo atendimento
            </base-button>
          </div>
          <div class="row">
            <div class="col-lg-12">
              <div class="float-right">
                <base-button
                  v-tooltip.bottom="'Gerenciar tipos de atendimento'"
                  type="btn btn-white"
                  class="mb-3 text-default"
                  @click="$router.push(`/diretoria/atendimentos/tipos`)"
                >
                  <i class="fas fa-layer-group fa-lg mr-2" /> Tipos de
                  atendimento
                </base-button>
              </div>
            </div>
            <div class="col-lg-12">
              <div class="row sections">
                <tipo-consulta-card
                  v-if="appointments.length"
                  :appointments="appointments"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="totalAppointments" class="row">
        <div class="col-12 text-muted text-right">
          <b>{{ totalAppointments }}</b> atendimentos registradas ao total
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import api from "../../services/api";
import TipoConsultaCard from "./Consulta/TipoConsultaCard.vue";

export default {
  name: "Atendimentos",
  components: {
    TipoConsultaCard,
  },
  data() {
    return {
      totalAppointments: 0,
      empty: true,
      appointments: [],
    };
  },
  mounted() {
    this.loadAppointments();
  },
  methods: {
    getTotalAppointments() {
      let totalAppointments = 0;
      totalAppointments += this.appointments.length;

      this.totalAppointments = totalAppointments;
      if (this.totalAppointments) this.empty = false;
    },
    async loadAppointments() {
      const loader = this.$loading.show({
        container: this.$refs.materials_container,
        width: 110,
        height: 110,
        opacity: 0,
      });
      try {
        const { data } = await api.get("/admin/appointments");
        this.appointments = data;

        this.getTotalAppointments();
      } catch (e) {
        this.$toasted.error("Ocorreu um erro ao recuperar as atendimentos");
      } finally {
        loader.hide();
      }
    },
  },
};
</script>

<style scoped>
.sections > div {
  flex: 0 0 50%;
  max-width: 50%;
}
.sections > div:only-child {
  flex: 0 0 100%;
  max-width: 100%;
}

.cursor {
  cursor: pointer;
}

.card-img-top {
  height: 200px;
  margin: auto;
  object-fit: cover;
}

.card-image {
  position: relative;
  height: 200px;
}
</style>

<style>
.ml-container-read-only .quill-editor .ql-container,
.ml-container-read-only .quill-editor .ql-container .ql-editor {
  max-height: 10rem;
  width: 100%;
}

p > strong {
  font-weight: bold !important;
}
</style>
