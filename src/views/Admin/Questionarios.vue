<template>
  <div>
    <base-header class="header pb-8 pt-5 pt-lg-8 d-flex align-items-center">
      <!-- Header container -->
      <div
        ref="enquetes_list"
        class="container-fluid d-flex align-items-center vld-parent"
      >
        <div class="row">
          <div class="col-12 d-block d-md-none">
            <router-link
              :to="'/'"
              class="btn-link font-weight-normal text-white"
              title="Voltar para o início"
            >
              <i class="fas fa-chevron-left mr-1" /> Voltar
            </router-link>
          </div>
          <div class="col-lg-7 col-md-10">
            <p class="text-white my-3">
              Aqui você pode conferir todas os questionários criados e as
              respostas recebidas. Todo novo questionário aparecerá
              automaticamente na listagem abaixo.
            </p>
          </div>
        </div>
      </div>
    </base-header>
    <div class="container-fluid mt--7">
      <div v-if="empty" class="row">
        <div class="col-12 mb-3 text-center">
          <badge type="info" class="bg-white">
            Não existem questionários cadastrados até o momento
          </badge>
        </div>
      </div>
      <div class="row text-center mb-6">
        <div class="col-12">
          <base-button
            v-tooltip="'Clique para cadastrar um novo questionário'"
            :custom="true"
            size="sm"
            type="primary"
            @click="$router.push('/diretoria/questionarios/nova')"
          >
            <i class="fas fa-plus mr-1" /> Novo questionário
          </base-button>
        </div>
      </div>
      <div v-if="!empty">
        <div class="row">
          <div class="col-12">
            <div class="card-deck">
              <div
                v-for="survey in surveys"
                :key="survey.id"
                class="col-lg-4 col-md-6 mb-6 d-flex align-items-stretch"
              >
                <div class="card text-center flex-grow-1">
                  <div class="card-profile-image">
                    <img
                      src="/img/pages/survey.png"
                      class="card-image my-3 rounded-circle"
                      alt="..."
                    />
                  </div>
                  <div class="card-body mt-8 pt-4 pb-2">
                    <h2 class="mb-0 card-title">
                      {{ survey.title }}
                    </h2>
                    <p v-if="!survey.is_active" class="mt-2 mb-0">
                      <badge
                        v-tooltip="'O questionário está oculto'"
                        type="warning"
                      >
                        Oculta
                      </badge>
                    </p>
                    <p class="mt-2 mb-0">
                      Aceitando respostas a partir de
                      <b> {{ formatDate(survey.start_date) || "..." }}</b>
                      <span v-if="survey.end_date">
                        até <b>{{ formatDate(survey.end_date) }}</b>
                        .
                      </span>
                      <span v-else> (sem data limite).</span>
                    </p>
                    <p class="mt-2 mb-1">
                      <badge type="primary">
                        {{ survey.responses_count }} respostas recebidas
                      </badge>
                    </p>
                  </div>
                  <div class="card-footer text-center">
                    <router-link
                      :to="`/diretoria/questionarios/${survey.id}/editar`"
                      class="btn btn-white py-1 px-2"
                      title="Editar questionário"
                    >
                      <i class="fas fa-edit text-info" />
                    </router-link>
                    <router-link
                      :to="`/diretoria/questionarios/${survey.id}/respostas`"
                      class="btn btn-white py-1 px-2"
                      title="Visualizar respostas"
                    >
                      <i class="fas fa-tasks text-primary" />
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-12 text-muted text-right mt-3">
            <b>{{ surveys.length }}</b> questionários cadastrados ao total
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import api from "@/services/api.js";
import Badge from "../../components/Badge.vue";

export default {
  name: "QuestionariosList",
  components: { Badge },
  data() {
    return {
      surveys: [],
      empty: false,
    };
  },
  async mounted() {
    const loader = this.$loading.show({
      container: this.$refs.enquetes_list,
      width: 150,
      height: 150,
      opacity: 0,
    });
    try {
      const { data } = await api.get("/admin/surveys");
      if (data.length) this.surveys = data;
      else this.empty = true;
      loader.hide();
    } catch (e) {
      this.$toasted.error(
        "Ocorreu um erro ao recuperar os questionários cadastrados"
      );
    }
  },
};
</script>
<style scoped>
.card-profile-image img {
  width: 180px;
  height: 180px;
}
</style>
