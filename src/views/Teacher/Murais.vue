<template>
  <div>
    <base-header type="gradient-default" class="pb-6 pb-8 pt-5 pt-md-8">
      <!-- Card stats -->
      <div class="row">
        <div class="col-12 d-block d-md-none mb-4">
          <router-link
            :to="'/'"
            class="btn-link font-weight-normal text-white"
            title="Voltar para o início"
            ><i class="fas fa-chevron-left mr-1" /> Voltar</router-link
          >
        </div>
      </div>
      <div class="row">
        <div class="col-xl-3 col-lg-6 d-flex align-items-stretch">
          <stats-card
            title="Avisos"
            type="gradient-green"
            :sub-title="String(stats['notice'])"
            icon="fas fa-newspaper"
            class="mb-4 mb-xl-0 flex-grow-1"
          >
            <template slot="footer">
              <span class="text-wrap">já publicadas ao total</span>
            </template>
          </stats-card>
        </div>
        <div class="col-xl-3 col-lg-6 d-flex align-items-stretch">
          <stats-card
            title="Eventos"
            type="gradient-red"
            :sub-title="String(stats['event'])"
            icon="fas fa-bullhorn"
            class="mb-4 mb-xl-0 flex-grow-1"
          >
            <template slot="footer">
              <span class="text-wrap">já divulgados ao total</span>
            </template>
          </stats-card>
        </div>
        <div class="col-xl-3 col-lg-6 d-flex align-items-stretch">
          <stats-card
            title="Treinamentos"
            type="gradient-orange"
            :sub-title="String(stats['training'])"
            icon="fas fa-dumbbell"
            class="mb-4 mb-xl-0 flex-grow-1"
          >
            <template slot="footer">
              <span class="text-wrap">já divulgados ao total</span>
            </template>
          </stats-card>
        </div>
        <div class="col-xl-3 col-lg-6 d-flex align-items-stretch">
          <stats-card
            title="Dinâmicas"
            type="gradient-info"
            :sub-title="String(stats['dynamic'])"
            icon="fas fa-users"
            class="mb-4 mb-xl-0 flex-grow-1"
          >
            <template slot="footer">
              <span class="text-wrap">já cadastradas ao total</span>
            </template>
          </stats-card>
        </div>
      </div>
    </base-header>
    <!--Charts-->
    <div class="container-fluid mt--7">
      <div class="row">
        <div class="col-12 text-center">
          <base-button
            size="sm"
            type="primary"
            class="mt--3"
            :custom="true"
            @click="$router.push('/professor/murais/publicacoes/nova')"
            ><i class="fas fa-plus mr-1" /> Nova publicação
          </base-button>
        </div>
      </div>
      <div class="row mt-5">
        <div class="col-lg-6 mb-4">
          <div ref="notices_table" class="card shadow vld-parent">
            <div class="card-header border-0">
              <div class="row align-items-center">
                <div class="col">
                  <h5 class="heading-small text-muted mb-0">
                    <i class="fas fa-newspaper mr-1" /> Avisos
                  </h5>
                </div>
                <div class="col text-right">
                  <base-button
                    v-if="notices.length === limit"
                    size="sm"
                    type="seagreen"
                    @click="loadNotices()"
                    >Ver tudo</base-button
                  >
                </div>
              </div>
            </div>
            <div class="table-responsive">
              <base-table
                class="table align-items-center table-flush"
                thead-classes="thead-light"
                tbody-classes="list"
                :data="notices"
                type="hover"
              >
                <template slot="columns">
                  <th>Data</th>
                  <th>Status</th>
                  <th>Título</th>
                  <th>Ações</th>
                </template>
                <template slot-scope="{ row }">
                  <th slot="row">
                    {{ formatDate(row.date ? row.date : row.created_at, "L") }}
                  </th>
                  <td>
                    <badge :type="status[row.status].type">{{
                      status[row.status].name
                    }}</badge>
                  </td>
                  <td>{{ row.title }}</td>
                  <td>
                    <base-button
                      v-tooltip.bottom="'Visualizar publicação'"
                      type="white"
                      size="sm"
                      class="text-primary"
                      @click="handleOpenModalView(row, 'notices')"
                    >
                      <i class="fas fa-eye" />
                    </base-button>
                    <base-button
                      v-tooltip.bottom="'Editar publicação'"
                      type="white"
                      size="sm"
                      class="text-info"
                      @click="openPublicacao(row.id)"
                    >
                      <i class="fas fa-edit" />
                    </base-button>
                    <base-button
                      v-if="row.link"
                      v-tooltip.bottom="
                        'Abrir <b>link externo</b> da publicação'
                      "
                      type="white"
                      size="sm"
                      class="text-default"
                      @click="openLink(row.link)"
                    >
                      <i class="fas fa-link" />
                    </base-button>
                  </td>
                </template>
              </base-table>
              <p v-if="empty.notices" class="text-center text-warning mt-3">
                Não há nenhum aviso até o momento
              </p>
            </div>
          </div>
        </div>
        <div class="col-lg-6 mb-4">
          <div ref="events_table" class="card shadow vld-parent">
            <div class="card-header border-0">
              <div class="row align-items-center">
                <div class="col">
                  <h5 class="heading-small text-muted mb-0">
                    <i class="fas fa-bullhorn mr-1" /> Eventos
                  </h5>
                </div>
                <div class="col text-right">
                  <base-button
                    v-if="events.length === limit"
                    size="sm"
                    type="seagreen"
                    @click="loadEvents()"
                    >Ver tudo</base-button
                  >
                </div>
              </div>
            </div>
            <div class="table-responsive">
              <base-table
                class="table align-items-center table-flush"
                thead-classes="thead-light"
                tbody-classes="list"
                :data="events"
                type="hover"
              >
                <template slot="columns">
                  <th>Data</th>
                  <th>Status</th>
                  <th>Título</th>
                  <th>Ações</th>
                </template>
                <template slot-scope="{ row }">
                  <th slot="row">
                    {{ formatDate(row.date ? row.date : row.created_at, "L") }}
                  </th>
                  <td>
                    <badge :type="status[row.status].type">{{
                      status[row.status].name
                    }}</badge>
                  </td>
                  <td>{{ row.title }}</td>
                  <td :ref="`container_notices_${row.id}`" class="vld-parent">
                    <base-button
                      v-tooltip.bottom="'Visualizar publicação'"
                      type="white"
                      size="sm"
                      class="text-primary"
                      @click="handleOpenModalView(row, 'events')"
                    >
                      <i class="fas fa-eye" />
                    </base-button>
                    <base-button
                      v-tooltip.bottom="'Editar publicação'"
                      type="white"
                      size="sm"
                      class="text-info"
                      @click="openPublicacao(row.id)"
                    >
                      <i class="fas fa-edit" />
                    </base-button>
                    <base-button
                      v-if="row.link"
                      v-tooltip.bottom="
                        'Abrir <b>link externo</b> da publicação'
                      "
                      type="white"
                      size="sm"
                      class="text-default"
                      @click="openLink(row.link)"
                    >
                      <i class="fas fa-link" />
                    </base-button>
                  </td>
                </template>
              </base-table>
              <p v-if="empty.events" class="text-center text-warning mt-3">
                Não há nenhum evento até o momento
              </p>
            </div>
          </div>
        </div>
        <div class="col-lg-6 mb-4">
          <div ref="treinaments_table" class="card shadow vld-parent">
            <div class="card-header border-0">
              <div class="row align-items-center">
                <div class="col">
                  <h5 class="heading-small text-muted mb-0">
                    <i class="fas fa-dumbbell mr-1" /> Treinamentos
                  </h5>
                </div>
                <div class="col text-right">
                  <base-button
                    v-if="trainings.length === limit"
                    size="sm"
                    type="seagreen"
                    @click="loadTreinaments()"
                    >Ver tudo</base-button
                  >
                </div>
              </div>
            </div>
            <div class="table-responsive">
              <base-table
                class="table align-items-center table-flush"
                thead-classes="thead-light"
                tbody-classes="list"
                :data="trainings"
                type="hover"
              >
                <template slot="columns">
                  <th>Data</th>
                  <th>Status</th>
                  <th>Título</th>
                  <th>Ações</th>
                </template>
                <template slot-scope="{ row }">
                  <th slot="row">
                    {{ formatDate(row.date ? row.date : row.created_at, "L") }}
                  </th>
                  <td>
                    <badge :type="status[row.status].type">{{
                      status[row.status].name
                    }}</badge>
                  </td>
                  <td>{{ row.title }}</td>
                  <td>
                    <base-button
                      v-tooltip.bottom="'Visualizar publicação'"
                      type="white"
                      size="sm"
                      class="text-primary"
                      @click="handleOpenModalView(row, 'trainings')"
                    >
                      <i class="fas fa-eye" />
                    </base-button>
                    <base-button
                      v-tooltip.bottom="'Editar publicação'"
                      type="white"
                      size="sm"
                      class="text-info"
                      @click="openPublicacao(row.id)"
                    >
                      <i class="fas fa-edit" />
                    </base-button>
                    <base-button
                      v-if="row.link"
                      v-tooltip.bottom="
                        'Abrir <b>link externo</b> da publicação'
                      "
                      type="white"
                      size="sm"
                      class="text-default"
                      @click="openLink(row.link)"
                    >
                      <i class="fas fa-link" />
                    </base-button>
                  </td>
                </template>
              </base-table>
              <p v-if="empty.trainings" class="text-center text-warning mt-3">
                Não há nenhum treinamento até o momento
              </p>
            </div>
          </div>
        </div>
        <div class="col-lg-6">
          <div ref="dynamics_table" class="card shadow vld-parent">
            <div class="card-header border-0">
              <div class="row align-items-center">
                <div class="col">
                  <h5 class="heading-small text-muted mb-0">
                    <i class="fas fa-users mr-1" /> Dinâmicas
                  </h5>
                </div>
                <div class="col text-right">
                  <base-button
                    v-if="dynamics.length === limit"
                    size="sm"
                    type="seagreen"
                    @click="loadDynamics()"
                    >Ver tudo</base-button
                  >
                </div>
              </div>
            </div>
            <div class="table-responsive">
              <base-table
                class="table align-items-center table-flush"
                thead-classes="thead-light"
                tbody-classes="list"
                :data="dynamics"
                type="hover"
              >
                <template slot="columns">
                  <th>Data</th>
                  <th>Status</th>
                  <th>Título</th>
                  <th>Ações</th>
                </template>
                <template slot-scope="{ row }">
                  <th slot="row">
                    {{ formatDate(row.date ? row.date : row.created_at, "L") }}
                  </th>
                  <td>
                    <badge :type="status[row.status].type">{{
                      status[row.status].name
                    }}</badge>
                  </td>
                  <td>{{ row.title }}</td>
                  <td>
                    <base-button
                      v-tooltip.bottom="'Visualizar publicação'"
                      type="white"
                      size="sm"
                      class="text-primary"
                      @click="handleOpenModalView(row, 'dynamics')"
                    >
                      <i class="fas fa-eye" />
                    </base-button>
                    <base-button
                      v-tooltip.bottom="'Editar publicação'"
                      type="white"
                      size="sm"
                      class="text-info"
                      @click="openPublicacao(row.id)"
                    >
                      <i class="fas fa-edit" />
                    </base-button>
                    <base-button
                      v-if="row.link"
                      v-tooltip.bottom="
                        'Abrir <b>link externo</b> da publicação'
                      "
                      type="white"
                      size="sm"
                      class="text-default"
                      @click="openLink(row.link)"
                    >
                      <i class="fas fa-link" />
                    </base-button>
                  </td>
                </template>
              </base-table>
              <p v-if="empty.dynamics" class="text-center text-warning mt-3">
                Não há nenhuma dinâmica até o momento
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <modal
      :show.sync="modalView.show"
      modal-classes="modal-dialog-centered modal-xl"
      body-classes="pb-0"
      header-classes="pb-0"
    >
      <h6 id="modal-title-notification" slot="header" class="modal-title">
        Detalhes da notícia
      </h6>
      <div class="text-center">
        <div class="pb-2 card-profile-image">
          <img :src="modalView.notices.image_url" class="card-image my-3" />
        </div>
      </div>
      <div class="text-center">
        <h3 class="mt-7 pt-2">
          {{ modalView.notices.title }}
          <base-button
            v-if="modalView.notices.link"
            v-tooltip.bottom="'Abrir <b>link externo</b> da publicação'"
            type="link"
            class="p-0 m-0 ml-1 mt--1"
            @click="openLink(modalView.notices.link)"
          >
            <i class="fas fa-link" />
          </base-button>
        </h3>
        <p class="description mt-1 mb-0">
          {{ modalView.notices.subtitle }}
        </p>
        <p v-if="modalView.notices.author_name" class="description mt-1 mb-0">
          <b>Autor:</b> {{ modalView.notices.author_name }}
        </p>
        <badge type="seagreen mt-2">{{ modalView.notices.type }}</badge>
        <p class="description mt-1 mb-0">
          <span v-if="modalView.notices.date"
            ><b>Data: </b> {{ formatDate(modalView.notices.date, "LL") }}</span
          >
          <span v-if="modalView.notices.start_hour" class="px-2"
            ><b>Hora: </b> {{ modalView.notices.start_hour }}</span
          >
        </p>
        <p v-if="modalView.notices.tags" class="description mt-1 mb-0">
          <b>Tags:</b>
          <badge
            v-for="tag in modalView.notices.tags.split(';')"
            :key="`${modalView.notices.id}_${tag}`"
            class="mx-1"
            type="primary"
          >
            {{ tag.trim() }}
          </badge>
        </p>
      </div>
      <div class="mt-3">
        <quill-editor
          v-model="modalView.notices.body"
          :options="editorReadOnly"
          disabled="disabled"
          class="border rounded"
        />
        <p class="text-right description mt-3 mb-0">
          <i class="far fa-clock mr-1" /> Publicado em
          {{ formatTimestamp(modalView.notices.created_at, "lll") }}. Atualizado
          em {{ formatTimestamp(modalView.notices.updated_at, "lll") }}.
        </p>
      </div>
      <template slot="footer">
        <base-button
          type="link"
          text-color="dark"
          class="ml-auto"
          @click="modalView.show = false"
        >
          Voltar
        </base-button>
      </template>
    </modal>
  </div>
</template>
<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";

import api from "@/services/api";

export default {
  name: "TeacherMurais",
  components: {
    quillEditor,
  },
  data() {
    return {
      notices: [],
      events: [],
      trainings: [],
      dynamics: [],
      limit: 10,
      empty: {
        notices: "",
        events: "",
        trainings: "",
        dynamics: "",
      },
      status: {
        public: {
          name: "Público",
          type: "success",
        },
        hidden: {
          name: "Oculto",
          type: "primary",
        },
      },
      stats: {
        notice: 0,
        event: 0,
        training: 0,
        dynamic: 0,
      },
      editorReadOnly: {
        placeholder: "...",
        readOnly: true,
        theme: "bubble",
      },
      modalView: {
        show: false,
        notices: "",
      },
    };
  },
  async mounted() {
    this.loadNotices(`&limit=${this.limit}`);
    this.loadEvents(`&limit=${this.limit}`);
    this.loadDynamics(`&limit=${this.limit}`);
    this.loadTreinaments(`&limit=${this.limit}`);
    this.getStats();
  },
  methods: {
    async loadPublications(getParams, targetObjName, loaderRef, errorMsg) {
      this.empty[targetObjName] = false;
      const loader = this.$loading.show({
        container: loaderRef,
        width: 90,
        height: 90,
      });
      try {
        const { data } = await api.get(`/teacher/news?${getParams}`);
        if (data.data.length) this[targetObjName] = data.data;
        else this.empty[targetObjName] = true;
        loader.hide();
      } catch (e) {
        this.$toasted.error(`Ocorreu um erro ao recuperar ${errorMsg}`);
      }
    },
    async loadNotices(query = "") {
      await this.loadPublications(
        `type=notice${query}`,
        "notices",
        this.$refs.notices_table,
        "as Avisos"
      );
    },
    async loadEvents(query = "") {
      await this.loadPublications(
        `type=event${query}`,
        "events",
        this.$refs.events_table,
        "os eventos"
      );
    },
    async loadTreinaments(query = "") {
      await this.loadPublications(
        `type=training${query}`,
        "trainings",
        this.$refs.treinaments_table,
        "os treinamentos"
      );
    },
    async loadDynamics(query = "") {
      await this.loadPublications(
        `type=dynamic${query}`,
        "dynamics",
        this.$refs.dynamics_table,
        "as dinâmicas"
      );
    },
    async getStats() {
      try {
        const { data } = await api.get("/teacher/news-stats");
        data.forEach((stats) => {
          this.stats[stats.type] = stats.count;
        });
      } catch (e) {
        this.$toasted.error("Ocorreu um erro ao recuperar as estatísticas");
      }
    },
    async handleOpenModalView(notices, ref) {
      const loader = this.$loading.show({
        container: this.$refs[`${ref}_table`],
        width: 100,
        height: 100,
      });
      try {
        const { data } = await api.get(`/teacher/news/${notices.id}`);
        if (!data.image_url) data.image_url = "/img/pages/news.png";
        this.modalView.notices = data;
        this.modalView.show = true;
      } catch (e) {
        this.$toasted.error("Ocorreu um erro ao carregar a publicação");
      } finally {
        loader.hide();
      }
    },
    openPublicacao(id) {
      this.$router.push(`/professor/murais/publicacoes/${id}/editar`);
    },
    openLink(link) {
      window.open(link, "file-window", "resizable=1,height=750,width=750");
    },
  },
};
</script>
<style scoped>
.card-image {
  width: 115px;
  height: 115px;
  border-radius: 10%;
  margin: auto;
}
.fab {
  color: #f6f9fc;
}
</style>
<style>
.nv-container-read-only .quill-editor .ql-container,
.nv-container-read-only .quill-editor .ql-container .ql-editor {
  min-height: 5rem;
  max-height: 10rem;
  width: 100%;
}

p > strong {
  font-weight: bold !important;
}
</style>
