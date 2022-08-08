<template>
  <div>
    <base-header class="header pb-8 pt-5 pt-lg-8 d-flex align-items-center">
      <!-- Header container -->
      <div
        ref="questionarios_list"
        class="container-fluid d-flex align-items-center vld-parent"
      >
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
              Aqui você pode conferir todas os questionários aceitando
              respostas.
            </p>
          </div>
        </div>
      </div>
    </base-header>
    <div class="container-fluid mt--6">
      <div v-if="empty" class="row">
        <div class="col-12 mb-3 text-center">
          <badge type="info" class="bg-white">
            Nenhum questionário disponível no momento
          </badge>
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
                    <p class="mt-2 mb-0">
                      Aceitando respostas a partir de
                      <b> {{ formatDate(survey.start_date) || "..." }}</b>
                      <span v-if="survey.end_date">
                        até <b>{{ formatDate(survey.end_date) }}</b
                        >.</span
                      >
                      <span v-else> (sem data limite).</span>
                    </p>
                  </div>
                  <div class="card-footer text-center">
                    <span v-if="survey.responses.responses_count">
                      <router-link
                        v-if="!survey.is_response_restricted"
                        v-tooltip="
                          'Enquete aceita múltiplas respostas. Clique para responder novamente.'
                        "
                        :to="`/voluntario/questionarios/${survey.id}/respostas`"
                        class="text-success"
                        ><i class="fas fa-edit mr-1" />
                        {{ survey.responses.responses_count }}
                        resposta{{
                          survey.responses.responses_count === 1 ? "" : "s"
                        }}
                        enviadas
                      </router-link>
                      <router-link
                        v-else
                        v-tooltip="
                          'Enquete aceita uma única resposta por usuário.'
                        "
                        :to="`/voluntario/questionarios/${survey.id}/respostas`"
                        class="text-success"
                      >
                        <i class="fas fa-edit mr-1" />
                        Enquete já respondida
                      </router-link>
                    </span>
                    <router-link
                      v-else
                      v-tooltip="'Abrir questionário'"
                      :to="`/voluntario/questionarios/${survey.id}/respostas`"
                      ><i class="fas fa-edit mr-1" /> Responder
                      questionário</router-link
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-12 text-muted text-right mt-3">
            <b>{{ surveys.length }}</b> questionários disponíveis ao total
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import api from "@/services/api.js";

export default {
  name: "QuestionariosList",
  components: {},
  data() {
    return {
      surveys: [],
      empty: false,
    };
  },
  async mounted() {
    const loader = this.$loading.show({
      container: this.$refs.questionarios_list,
      width: 150,
      height: 150,
      opacity: 0,
    });
    try {
      const { data } = await api.get("/volunteer/surveys");
      if (data.length) this.surveys = data;
      else this.empty = true;
      loader.hide();
    } catch (e) {
      this.$toasted.error("Ocorreu um erro ao recuperar as questionários");
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
