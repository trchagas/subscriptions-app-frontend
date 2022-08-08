<template>
  <div>
    <base-header type="gradient-default" class="pb-3 py-5 pt-md-8">
      <div class="container-fluid d-flex align-items-center">
        <div class="row">
          <div class="col-lg-8 col-md-10">
            <p class="text-white mt-3 mb-5">
              Aqui você pode acessar as turmas de um dos professores
              cadastrados.
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
                  : '<b>Filtrar professores</b>'
              "
              class="mb-5 float-right"
              :type="showFiltersSection ? 'default' : 'white'"
              @click.stop="showFiltersSection = true"
            >
              <i class="fas fa-filter mr-2" />Filtrar usuários
            </base-button>
          </div>
          <div class="col-12">
            <div class="card-deck">
              <div
                v-for="user in users"
                :key="user.user_id"
                class="col-lg-4 col-md-6 mb-5 d-flex align-items-stretch"
              >
                <teacher-card :teacher="user" />
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-12 text-muted text-right mt-3">
            exibindo <b>{{ users.length }}</b> Usuários
          </div>
        </div>
      </div>
    </div>
    <right-sidebar
      v-if="showFiltersSection === true"
      icon="fas fa-filter fa-2x"
      title="Filtrar professores"
      @close="showFiltersSection = false"
    >
      <div class="row">
        <div class="col-lg-12">
          <base-input
            v-model.trim="query.name"
            label="Filtro por nome"
            placeholder="Digite o nome"
          />
        </div>
        <div class="col-lg-12">
          <base-input label="Filtro por mês de cadastro">
            <select v-model="query.month" class="form-control">
              <option disabled>Selecione o mês de cadastro</option>
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
          <base-input label="Filtro por ano de cadastro">
            <select v-model="query.year" class="form-control">
              <option disabled>Selecione o ano de cadastro</option>
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
          <base-button type="primary" size="sm" @click="loadTeachers()"
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
import TeacherCard from "./TeacherCard";
import RightSidebar from "@/components/RightSidebar";

export default {
  name: "AdminProfessores",
  components: {
    TeacherCard,
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
        name: "",
        month: "",
        year: "",
      },
      users: [],
      empty: false,
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
    await this.loadTeachers();
    const { data } = await api.get("admin/admins");
    this.admin_createdAt = data.createdAt;
  },
  methods: {
    async cleanFilters() {
      this.query.name = "";
      this.query.month = "";
      this.query.year = "";
      await this.loadTeachers();
    },

    async loadTeachers() {
      const loaderOpenTasks = this.$loading.show({
        container: this.$refs.list_open_tasks,
        width: 90,
        height: 90,
      });
      try {
        const { data } = await api.get(
          `admin/teachers?profile_picture=true&name=${this.query.name}&month=${this.query.month}&year=${this.query.year}`
        );
        const defaultProfilePicture = "/img/pages/default_profile_picture.png";
        data.forEach((e) => {
          if (!e.profile_picture)
            e.profile_picture = { url: defaultProfilePicture };
        });
        this.users = data;
        loaderOpenTasks.hide();
      } catch (e) {
        this.$toasted.error("Ocorreu um erro ao buscar os professores");
      }
    },
  },
};
</script>

<style scoped></style>
