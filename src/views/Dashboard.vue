<template>
  <div>
    <base-header type="gradient-default" class="pb-3 py-5 pt-md-8">
      <div class="container-fluid d-flex align-items-center">
        <div class="row">
          <div class="col-lg-8 col-md-10">
            <p class="text-white mt-3 mb-5">
              Seja bem-vindo(a) ao Portal Orquestrando Arte!
            </p>
          </div>
        </div>
      </div>
    </base-header>

    <div class="container-fluid mt--5">
      <div v-for="event of news" :key="event.id">
        <div class="post-card shadow col-xl-8 col-lg-8 mb-4 card px-2">
          <p class="mb-2 mt-2">
            <a>
              <img
                v-if="event.profile_picture"
                width="30"
                height="30"
                :src="event.profile_picture"
                class="rounded-circle mr-2"
                alt="foto de perfil"
              />
              <i v-else class="fas fa-user-circle fa-2x mr-1" />
              <span>{{ event.author_name }}</span>
            </a>
          </p>
          <img
            v-if="event.image_url"
            class="image-feed rounded mx-auto d-block col-12 px-0"
            :src="event.image_url"
            alt="..."
          />

          <quill-editor
            v-model="event.body"
            :options="editorReadOnly"
            disabled="disabled"
          />

          <div class="btn-group mb-3 d-flex border-group">
            <base-button class="btn btn-white py-1" disabled>
              <div class="">
                <i class="far fa-heart fa-sm" />
                {{ event.likes_count }}
              </div>
            </base-button>
            <base-button
              class="btn btn-white py-1"
              type=""
              @click="$router.push(`/publicacao/${event.id}/visualizar`)"
            >
              <i class="far fa-comment fa-sm" /> {{ event.comments_count }}
            </base-button>
          </div>
        </div>
      </div>
      <div ref="scroll" class="" />
    </div>
  </div>
</template>
<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";
import api from "@/services/api";

export default {
  name: "PublicDashboard",
  components: {
    quillEditor,
  },
  data() {
    return {
      news: [],
      meta: {},
      events: [],
      treinaments: [],
      dynamics: [],
      limit: 10,
      empty: {
        news: "",
        events: "",
        treinaments: "",
        dynamics: "",
      },
      editorReadOnly: {
        placeholder: "...",
        readOnly: true,
        theme: "bubble",
      },
      modal: {
        modalConfirmation: false,
      },
      idDelete: 0,
    };
  },
  async mounted() {
    await this.loadInitialNews();
    await this.loadNews();
  },
  methods: {
    handleOpenModalConfirmation(id) {
      this.modal.modalConfirmation = true;
      this.idDelete = id;
    },
    getArticleGender(gender) {
      if (gender === "male") {
        return "o";
      } else if (gender === "female") {
        return "a";
      } else {
        return "o(a)";
      }
    },
    getAge(birth) {
      return (
        this.moment().year() -
        parseInt(this.moment(birth, "YYYY-MM-DD").format("YYYY"))
      );
    },
    async loadNews() {
      window.onscroll = async () => {
        let bottomOfWindow =
          document.documentElement.scrollTop + window.innerHeight ===
          document.documentElement.offsetHeight;
        if (bottomOfWindow && this.meta.current_page < this.meta.last_page) {
          const loader = this.$loading.show({
            container: this.$refs.scroll,
            loader: "dots",
            width: 90,
            height: 90,
            opacity: 0,
          });
          try {
            const {
              data: { data, meta },
            } = await api.get(`/news/?page=${this.meta.current_page + 1}`);
            if (data.length) {
              this.news = this.news.concat(data);
              this.meta = meta;
            } else this.empty.news = true;
            loader.hide();
          } catch (e) {
            this.$toasted.error("Ocorreu um erro ao carregar as publicações");
          }
        }
      };
    },
    truncate(text, stop = 150, clamp = "...") {
      if (!text) return "N/A";
      return text.slice(0, stop) + (stop < text.length ? clamp : "");
    },
    async loadPublications(targetObjName, loaderRef, errorMsg) {
      this.empty[targetObjName] = false;
      const loader = this.$loading.show({
        container: loaderRef,
        loader: "dots",
        width: 90,
        height: 90,
        opacity: 0,
      });
      try {
        const {
          data: { data, meta },
        } = await api.get("/news");
        if (data.length) {
          this.news = data;
          this.meta = meta;
        } else this.empty[targetObjName] = true;
        loader.hide();
      } catch (e) {
        this.$toasted.error(`Ocorreu um erro ao recuperar ${errorMsg}`);
      }
    },
    async loadInitialNews() {
      await this.loadPublications("news", this.$refs.news_table, "as notícias");
    },
  },
};
</script>
<style scoped>
.border-group {
  border-radius: 10px;
  border: 2px solid #eaeaea;
}

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

.post-card {
  border-radius: 10px;
  border: 1px solid #e8e8e8;
}
.secondary-button {
  border-radius: 10px;
  color: #c95fa7;
  border: 1px solid #c95fa7;
}
.green-button {
  border-radius: 10px;
  color: #349740;
  border: 1px solid #349740;
}
.red-button {
  border-radius: 10px;
  color: white;
  background-color: #c03434;
  border: 1px solid #c03434;
}
.cursor-pointer {
  cursor: pointer;
}
.click-name {
  cursor: pointer;
}
</style>
