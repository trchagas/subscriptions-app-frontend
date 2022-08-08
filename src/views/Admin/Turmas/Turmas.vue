<template>
  <div>
    <base-header type="gradient-default" class="pb-3 py-5 pt-md-8">
      <div class="container-fluid d-flex align-items-center">
        <div class="row">
          <div class="col-12 mt-0 mt-md-4 mt-lg-0 d-block">
            <router-link
              :to="'/diretoria/turmas/professores'"
              class="btn-link font-weight-normal text-white"
              title="Voltar para a listagem de usuários"
            >
              <i class="fas fa-chevron-left mr-1" /> Voltar
            </router-link>
          </div>
          <div class="col-lg-8 col-md-10">
            <p class="text-white mt-3 mb-5">
              Aqui você pode visualizar as turmas cadastradas.
            </p>
          </div>
        </div>
      </div>
    </base-header>
    <div class="container-fluid mt--7">
      <div v-if="empty" class="row mt-3">
        <div class="col-12 mb-3 text-center">
          <badge type="info" class="bg-white">
            Não existem professores cadastrados até o momento
          </badge>
        </div>
      </div>
      <div class="row text-center mt-1 mb-6" />
      <div v-if="!empty">
        <div class="row">
          <div class="col-12">
            <base-button
              v-tooltip="
                showFiltersSection
                  ? 'Ocultar <b>filtros</b>'
                  : '<b>Filtrar turmas</b>'
              "
              class="mb-5 float-right"
              :type="showFiltersSection ? 'default' : 'white'"
              @click.stop="showFiltersSection = true"
            >
              <i class="fas fa-filter mr-2" />Filtrar turmas
            </base-button>
          </div>
          <div class="col-12">
            <div class="card-deck">
              <div
                v-for="classObj in classes"
                :key="classObj.user_id"
                class="col-lg-4 col-md-6 mb-5 d-flex align-items-stretch"
              >
                <class-card :turma="classObj" />
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-12 text-muted text-right mt-3">
            exibindo <b>{{ classes.length }}</b> Turmas
          </div>
        </div>
      </div>
    </div>
    <right-sidebar
      v-if="showFiltersSection === true"
      icon="fas fa-filter fa-2x"
      title="Filtrar turmas"
      @close="showFiltersSection = false"
    >
      <div class="row">
        <div class="col-lg-12">
          <base-input
            v-model.trim="query.title"
            label="Filtro por nome"
            placeholder="Digite o nome"
          />
        </div>
        <div class="col-lg-12">
          <base-input label="Filtro por mês de criação">
            <select v-model="query.month" class="form-control">
              <option disabled>Selecione o mês de criação</option>
              <option selected value="">Todos</option>
              <option value="1">Janeiro</option>
              <option value="2">Fevereiro</option>
              <option value="3">Março</option>
              <option value="4">Abril</option>
              <option value="5">Maio</option>
              <option value="6">Junho</option>
              <option value="7">Julho</option>
              <option value="8">Agosto</option>
              <option value="9">Setembro</option>
              <option value="10">Outubro</option>
              <option value="11">Novembro</option>
              <option value="12">Dezembro</option>
            </select>
          </base-input>
        </div>
        <div class="col-lg-12">
          <base-input label="Filtro por ano de criação">
            <select v-model="query.year" class="form-control">
              <option disabled>Selecione o ano de criação</option>
              <option selected value="">Todos</option>
              <option v-for="year in yearList" :key="year" :value="year">
                {{ year }}
              </option>
            </select>
          </base-input>
        </div>
        <div class="col-12 mb-3 mt-2 text-right d-flex justify-content-between">
          <base-button type="outline-primary" size="sm" @click="cleanFilters()"
            >Limpar filtros</base-button
          >
          <base-button type="primary" size="sm" @click="loadClasses()"
            >Aplicar</base-button
          >
        </div>
        <hr class="my-4" />
      </div>
    </right-sidebar>
  </div>
</template>
<script>
import api from "../../../services/api";
import ClassCard from "./ClassCard";
import RightSidebar from "@/components/RightSidebar";

export default {
  name: "TeacherClasses",
  components: {
    ClassCard,
    RightSidebar,
  },
  data() {
    return {
      showFiltersSection: false,
      isCleaningFilters: false,
      filtersHaveChanged: false,
      admin_createdAt: "",
      query: {
        offset: 0,
        title: "",
        month: "",
        year: "",
      },
      empty: false,
      classes: [],
    };
  },
  computed: {
    yearList() {
      const companyYear = new Date(this.admin_createdAt).getFullYear();
      const currentYear = new Date().getFullYear();
      if (companyYear == currentYear) return [companyYear];

      let yearList = [];
      for (let i = companyYear; i <= currentYear; i++) yearList.push(i);
      return yearList;
    },
  },
  async mounted() {
    await this.loadClasses();
    const { data } = await api.get("admin/admins");
    this.admin_createdAt = data.createdAt;
  },
  methods: {
    async cleanFilters() {
      this.query.title = "";
      this.query.month = "";
      this.query.year = "";
      await this.loadClasses();
    },

    async loadClasses() {
      const loader = this.$loading.show({
        container: this.$refs.categorias_form,
        width: 90,
        height: 90,
      });
      try {
        const { data } = await api.get(
          `/admin/teacher-classes/${this.$route.params.id}?title=${this.query.title}&month=${this.query.month}&year=${this.query.year}`
        );
        if (data.length) this.classes = data;
        loader.hide();
      } catch (e) {
        this.$toasted.error("Ocorreu um erro ao recuperar as turmas");
      }
    },
  },
};
</script>
<style scoped>
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
</style>
