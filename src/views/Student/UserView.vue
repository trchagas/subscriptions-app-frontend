<template>
  <div>
    <base-header class="header pt-5 pt-lg-8 d-flex align-items-center bg-color">
      <!-- Mask -->
      <span class="opacity-8" />
      <!-- Header container -->
      <div class="container-fluid d-flex align-items-center">
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
        </div>
      </div>
      <div
        ref="loader_collaborator"
        class="col-xl-10 offset-xl-1 col-xl-10 col-lg-12 mb-5"
        shadow
        footerClasses="py-2 text-center"
        bodyClasses="p-1"
      >
        <template>
          <div class="row text-center">
            <div class="col-md-4 mt-2">
              <img
                v-if="user.profile_picture"
                :src="user.profile_picture"
                width="200"
                height="200"
                class="rounded-circle"
                alt="..."
              />
              <img
                v-else
                src="/img/pages/default_profile_picture.png"
                width="200"
                height="200"
                class="rounded-circle"
                alt="..."
              />
            </div>
            <div class="col-md-8 text-left">
              <h1 class="mt-3 text-white">{{ user.name }}</h1>
              <div class="text-white font-weight-400 font-size-18 mb-1">
                <i class="fas fa-briefcase text-white" />
                {{ formatRole(user.role) }}
              </div>
              <div class="text-white font-weight-400 font-size-18 mb-1">
                {{ user.short_bio }}
              </div>
            </div>
          </div>
        </template>
      </div>
    </base-header>
    <div class="container-fluid mt-2">
      <div class="row">
        <div class="col-xl-4 col-lg-4">
          <div class="shadow mb-4 card">
            <div slot="header">
              <h3 class="mb-0 text-center mt-3">
                Sobre {{ user.name ? user.name.split(" ", 1)[0] : "" }}
              </h3>
            </div>
            <hr class="my-2" />
            <div class="mx-3">
              <div v-if="user.birth">
                <div class="h5 font-weight-300 mb-1">
                  <span>
                    <i class="fas fa-birthday-cake mr-2" />
                    {{ formatDate(user.birth, "DD/MM/YYYY") }}
                  </span>
                </div>
              </div>
              <div v-if="user.working_area">
                <div class="h5 font-weight-300 mb-1">
                  <span>
                    <i class="fas fa-palette mr-2" />
                    {{ user.working_area }}
                  </span>
                </div>
              </div>
              <div v-if="user.specialty">
                <div class="h5 font-weight-300 mb-1">
                  <span>
                    <i class="fas fa-music mr-2" />
                    {{ user.specialty }}
                  </span>
                </div>
              </div>
              <div>
                <div class="h5 font-weight-300 mb-1">
                  <email-link :email-address="user.email" />
                </div>
              </div>
              <div>
                <div class="h5 font-weight-300 mb-1">
                  <whatsapp-link :phone-number="user.phone" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-xl-8 col-lg-8">
          <div class="px-0">
            <new-post
              v-if="user.user_id === Number(user_id)"
              :profile_picture="
                userSelf.profile_picture ? userSelf.profile_picture.url : ''
              "
              :user="userSelf"
              endpoint="aluno"
              @news="loadPublications"
            />
          </div>
          <div v-for="(event, index) in news" ref="news_feed" :key="event.id">
            <div class="shadow mb-4 card px-2">
              <p class="mb-2 mt-2">
                <a class="click-name" @click="handleViewUser(event)">
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
                <base-button
                  class="btn btn-white py-1"
                  :title="!event.liked ? 'Curtir' : 'Descurtir'"
                  @click="handleLike(index)"
                >
                  <div v-if="!event.liked" class="">
                    <i class="far fa-heart fa-sm" />
                    {{ event.likes_count }}
                  </div>
                  <div v-else class="">
                    <i class="fas fa-heart fa-sm text-primary" />
                    {{ event.likes_count }}
                  </div>
                </base-button>
                <base-button
                  class="btn btn-white py-1"
                  type=""
                  @click="
                    $router.push(`/aluno/publicacao/${event.id}/visualizar`)
                  "
                >
                  <i class="far fa-comment fa-sm" /> {{ event.comments_count }}
                </base-button>
              </div>
            </div>
          </div>
          <div v-if="meta.total === 0" class="col-12 text-center">
            <badge type="info">
              O usuário não realizou nenhuma postagem ainda
            </badge>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import NewPost from "@/components/PostNew.vue";

import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";
import api from "@/services/api";
export default {
  name: "CallCard",
  components: { quillEditor, NewPost },
  data() {
    return {
      user: {
        email: "",
        phone: "",
      },
      userSelf: {},
      user_id: "",
      news: [],
      meta: {},
      editorReadOnly: {
        placeholder: "...",
        readOnly: true,
        theme: "bubble",
      },
    };
  },
  watch: {
    "$route.params.id": async function () {
      await this.loadUser();
      await this.loadPublications();
    },
  },
  async mounted() {
    await this.loadUser();
    await this.loadUserSelf();
    await this.loadPublications();
  },
  methods: {
    formatRole(role) {
      const map = {
        admin: "Diretoria",
        student: "Estudante",
        partner: "Parceiro",
        associate: "Associado",
        volunteer: "Voluntário",
        teacher: "Professor",
      };

      return map[role];
    },
    handleViewUser(news) {
      this.$router.push(`/aluno/usuarios/${news.user_id}/visualizar`);
    },
    getAge(birth) {
      return (
        this.moment().year() -
        parseInt(this.moment(birth, "YYYY-MM-DD").format("YYYY"))
      );
    },
    async handleLike(index) {
      if (!this.news[index].liked) {
        this.news[index].likes_count += 1;
      } else if (this.news[index].liked && this.news[index].likes_count > 0) {
        this.news[index].likes_count -= 1;
      }
      this.news[index].liked = !this.news[index].liked;
      try {
        await api.put(`/student/news/${this.news[index].id}/like`);
      } catch (error) {
        this.news[index].likes_count -= 1;
        this.news[index].liked = !this.news[index].liked;
        this.$toasted.error("Falha ao curtir");
      }
    },
    async loadUser() {
      const loader = this.$loading.show({
        container: this.$refs.loader_collaborator,
        loader: "dots",
        width: 90,
        height: 90,
        opacity: 0,
      });
      try {
        const { data } = await api.get(`/users/${this.$route.params.id}`);
        if (data) {
          this.user = data;
        }
        loader.hide();
      } catch (e) {
        this.$toasted.error("Ocorreu um erro ao recuperar o perfil");
      }
    },
    async loadUserSelf() {
      const loader = this.$loading.show({
        container: this.$refs.loader_collaborator,
        loader: "dots",
        width: 90,
        height: 90,
        opacity: 0,
      });
      try {
        const { data } = await api.get("/student/students");
        if (data) {
          this.userSelf = data;
          this.user_id = data.user_id;
        }
        loader.hide();
      } catch (e) {
        this.$toasted.error("Ocorreu um erro ao recuperar o perfil");
      }
    },
    async loadPublications(errorMsg) {
      const loader = this.$loading.show({
        container: this.$refs.news_feed,
        loader: "dots",
        width: 90,
        height: 90,
        opacity: 0,
      });
      try {
        const {
          data: { data, meta },
        } = await api.get(`/student/news/user/${this.$route.params.id}`);
        this.news = data;
        this.meta = meta;
        loader.hide();
      } catch (e) {
        this.$toasted.error(`Ocorreu um erro ao recuperar ${errorMsg}`);
      }
    },
    tasksSubmissions() {
      let submissionCount = 0;
      this.tasks.forEach((task) => {
        if (task.submission.length) {
          submissionCount += 1;
        }
      });
      return submissionCount;
    },
  },
};
</script>
<style scoped>
.card-profile-stats > div .heading {
  font-size: 1rem;
}
.card {
  border-radius: 15px;
}

.border-group {
  border-radius: 10px;
  border: 2px solid #eaeaea;
}
.click-name {
  cursor: pointer;
}
.bg-color {
  background-color: #01adee !important;
}
</style>
