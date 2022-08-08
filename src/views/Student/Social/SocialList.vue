<template>
  <div>
    <base-header type="gradient-default" class="pb-6 pb-8 pt-5 pt-md-8">
      <div class="container-fluid d-flex align-items-center">
        <div class="row">
          <div class="col-lg-7 col-md-10">
            <p class="text-white mt-3 mb-5">
              Aqui você pode visualizar as publicações criadas no seu feed.
            </p>
          </div>
        </div>
      </div>
    </base-header>

    <div class="container-fluid mt--7">
      <div class="row mt-5">
        <div class="col-lg-12 mb-4">
          <div ref="news_table" class="card shadow vld-parent">
            <div class="card-header border-0">
              <div class="row align-items-center">
                <div class="col">
                  <h5 class="heading-small text-muted mb-0">
                    <i class="fas fa-newspaper mr-1" /> Notícias
                  </h5>
                </div>
                <div class="col text-right">
                  <base-button
                    v-if="news.length === limit"
                    size="sm"
                    type="seagreen"
                    @click="loadNews()"
                  >
                    Ver tudo
                  </base-button>
                </div>
              </div>
            </div>
            <div class="table-responsive">
              <base-table
                class="table align-items-center table-flush"
                thead-classes="thead-light"
                tbody-classes="list"
                :data="news"
                type="hover"
              >
                <template slot="columns">
                  <th>Data</th>
                  <th>Status</th>
                  <th>Ações</th>
                </template>
                <template slot-scope="{ row }">
                  <th slot="row">
                    {{ formatDate(row.date ? row.date : row.created_at, "L") }}
                  </th>
                  <td>
                    <badge
                      v-tooltip="status[row.status].tooltip"
                      :type="status[row.status].type"
                    >
                      {{ status[row.status].name }}
                      <i
                        v-if="row.status === 'hidden'"
                        class="fas fa-exclamation-triangle ml-1"
                      />
                    </badge>
                  </td>
                  <td>
                    <base-button
                      v-tooltip.bottom="'Visualizar publicação'"
                      type="white"
                      size="sm"
                      class="text-primary"
                      @click="handleOpenModalView(row, 'news')"
                    >
                      <i class="fas fa-eye" />
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
              <p v-if="empty.news" class="text-center text-warning mt-3">
                Não há nenhuma notícia até o momento
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
          <img :src="modalView.news.image_url" class="card-image my-3" />
        </div>
      </div>
      <div class="text-center">
        <h3 class="mt-7 pt-2">
          {{ modalView.news.title }}
          <base-button
            v-if="modalView.news.link"
            v-tooltip.bottom="'Abrir <b>link externo</b> da publicação'"
            type="link"
            class="p-0 m-0 ml-1 mt--1"
            @click="openLink(modalView.news.link)"
          >
            <i class="fas fa-link" />
          </base-button>
        </h3>
        <p class="description mt-1 mb-0">
          {{ modalView.news.subtitle }}
        </p>
        <p v-if="modalView.news.author_name" class="description mt-1 mb-0">
          <b>Autor:</b> {{ modalView.news.author_name }}
        </p>
        <badge type="seagreen mt-2">{{ modalView.news.type }}</badge>
        <p class="description mt-1 mb-0">
          <span v-if="modalView.news.date">
            <b>Data: </b> {{ formatDate(modalView.news.date, "LL") }}
          </span>
          <span v-if="modalView.news.start_hour" class="px-2">
            <b>Hora: </b> {{ modalView.news.start_hour }}
          </span>
        </p>
        <p v-if="modalView.news.tags" class="description mt-1 mb-0">
          <b>Tags:</b>
          <badge
            v-for="tag in modalView.news.tags.split(';')"
            :key="`${modalView.news.id}_${tag}`"
            class="mx-1"
            type="primary"
          >
            {{ tag.trim() }}
          </badge>
        </p>
      </div>
      <div class="mt-3">
        <quill-editor
          v-model="modalView.news.body"
          :options="editorReadOnly"
          disabled="disabled"
          class="border rounded"
        />
        <p class="text-right description mt-3 mb-0">
          <i class="far fa-clock mr-1" /> Publicado em
          {{ formatTimestamp(modalView.news.created_at, "lll") }}. Atualizado em
          {{ formatTimestamp(modalView.news.updated_at, "lll") }}.
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
  name: "SocialList",
  components: {
    quillEditor,
  },
  data() {
    return {
      news: [],
      limit: 10,
      empty: {
        news: "",
      },
      status: {
        public: {
          tooltip: "Publicação visível",
          name: "Público",
          type: "success",
        },
        hidden: {
          tooltip: "Publicação oculta pelo aluno",
          name: "Oculto",
          type: "primary",
        },
      },
      editorReadOnly: {
        placeholder: "...",
        readOnly: true,
        theme: "bubble",
      },
      modalView: {
        show: false,
        news: "",
      },
    };
  },
  async mounted() {
    this.loadNews(`&limit=${this.limit}`);
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
        const {
          data: { data },
        } = await api.get(`/student/news/user/${0}?${getParams}`);
        if (data.length) this[targetObjName] = data;
        else this.empty[targetObjName] = true;
        loader.hide();
      } catch (e) {
        this.$toasted.error(`Ocorreu um erro ao recuperar ${errorMsg}`);
      }
    },
    async loadNews(query = "") {
      await this.loadPublications(
        `type=news${query}`,
        "news",
        this.$refs.news_table,
        "as notícias"
      );
    },
    async handleOpenModalView(news, ref) {
      const loader = this.$loading.show({
        container: this.$refs[`${ref}_table`],
        width: 100,
        height: 100,
      });
      try {
        const { data } = await api.get(`/student/news/${news.id}`);
        if (!data.image_url) data.image_url = "/img/pages/news.png";
        this.modalView.news = data;
        this.modalView.show = true;
      } catch (e) {
        this.$toasted.error("Ocorreu um erro ao carregar a publicação");
      } finally {
        loader.hide();
      }
    },
    openPublicacao(id) {
      this.$router.push(`/aluno/murais/publicacoes/${id}/editar`);
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
