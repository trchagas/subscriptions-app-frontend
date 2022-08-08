<template>
  <div class="vld-parent">
    <base-header class="header pb-8 pt-5 pt-lg-8 d-flex align-items-center">
      <!-- Header container -->
      <div
        ref="meetings_container"
        class="container-fluid align-items-center vld-parent"
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
            <p class="text-white mt-3 mb-5">
              Aqui você pode conferir todas as reuniões marcadas e finalizadas.
              Clique em mais detalhes para ver as informações completas.
            </p>
          </div>
        </div>
      </div>
      <div class="row" />
    </base-header>
    <div class="container-fluid mt--6">
      <div v-if="control.empty" class="row">
        <div class="col-12 mb-1 text-center mt--3">
          <badge type="info" class="bg-white">
            Não existem reuniões até o momento
          </badge>
        </div>
      </div>
      <div v-else class="row">
        <div class="col-12">
          <div class="card-deck">
            <div
              v-for="meetingsData in meetings"
              :key="meetingsData.id"
              class="col-lg-4 col-md-6 mb-5 d-flex align-items-stretch"
            >
              <meetings-card role="partner" :meeting="meetingsData" />
            </div>
          </div>
        </div>
      </div>
      <div v-if="!control.empty" class="row">
        <div class="col-lg-12 mb-3 text-right">
          <p class="text-muted">
            Exibindo
            <span class="font-weight-bold">{{ meetings.length }}</span> de um
            total de
            <span class="font-weight-bold">{{ control.total }}</span>
            reuniões.
          </p>
        </div>
        <div class="col-lg-12">
          <base-pagination
            :page-count="control.lastPage"
            :per-page="control.limit"
            :value="control.page"
            size="md"
            align="center"
            @input="handlePageInput"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../../services/api";
import MeetingsCard from "../../components/MeetingsCard.vue";

export default {
  name: "ListReunioes",
  components: {
    MeetingsCard,
  },
  data() {
    return {
      meetings: [],
      control: {
        page: 1,
        limit: 10,
        lastPage: 0,
        total: 0,
        empty: "",
      },
    };
  },
  async mounted() {
    await this.loadMeetings(this.control.page);
  },
  methods: {
    async loadMeetings(page) {
      const loader = this.$loading.show({
        container: this.$refs.meetings_container,
        width: 150,
        height: 150,
        opacity: 0,
      });
      try {
        const { data } = await api.get(
          `/partner/meetings?page=${page}&limit=${this.control.limit}`
        );
        this.control.lastPage = data.meta.lastPage;
        this.control.total = data.meta.total;
        this.control.page = data.meta.page;
        this.meetings = data.data;
        this.control.empty = data.meta.total <= 0;
        loader.hide();
      } catch (e) {
        this.$toasted.error("Ocorreu um erro ao recuperar as reuniões");
      }
    },
    async handlePageInput(page) {
      await this.loadMeetings(page);
    },
  },
};
</script>
