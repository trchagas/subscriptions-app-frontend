<template>
  <div>
    <base-header class="header pb-3 py-5 pt-md-8 d-flex align-items-center">
      <!-- Header container -->
    </base-header>
    <div class="container-fluid mt--5">
      <div
        ref="news_feed"
        class="col-xl-6 offset-xl-2 col-xl-8 col-lg-12 mb-4 card vld-parent px-2 pb-2"
      >
        <p class="mb-1 mt-2">
          <img
            v-if="profile_picture"
            width="30"
            height="30"
            :src="profile_picture"
            class="rounded-circle mr-2"
            alt="foto de perfil"
          />
          <i v-else class="fas fa-user-circle fa-2x mr-1" />
          <span>{{ objectName(news.author) }}</span>
        </p>
        <img
          v-if="news.image_url"
          class="image-feed rounded"
          :src="news.image_url"
          alt="..."
        />
        <quill-editor
          v-model="news.body"
          :options="editorReadOnly"
          disabled="disabled"
        />
        <div class="m-3 d-flex">
          <base-button
            disabled
            class="btn btn-white"
            :title="!news.liked ? 'Curtir' : 'Descurtir'"
          >
            <div v-if="!news.liked" class="">
              <i class="far fa-heart fa-sm" />
              {{ news.likes }}
            </div>
            <div v-else class="">
              <i class="fas fa-heart fa-sm" />
              {{ news.likes }}
            </div>
          </base-button>
          <base-button class="btn btn-white">
            <i class="far fa-comment fa-sm" />
            {{ news.comments.length }}
          </base-button>
        </div>
        <hr />

        <h2>Comentários</h2>
        <div v-if="!news.comments.length" class="text-warning">
          Ninguém comentou ainda! Seja o primeiro a comentar.
        </div>
        <div
          v-for="(comment, index) in news.comments"
          ref="news_table"
          :key="index"
        >
          <div class="mb-0">
            <p class="mb-1 mt-2">
              <img
                v-if="validImageComments(comment)"
                width="20"
                height="20"
                :src="imageComments(comment)"
                class="rounded-circle mr-2"
                alt="foto de perfil"
              />
              <i v-else class="fas fa-user-circle fa-1x mr-1" />
              <span>{{ objectName(comment) }}</span>
            </p>
            <i class="fas fa-comment ml-1" />
            {{ comment.comment }}
          </div>
          <div
            v-for="(reply, r_index) in comment.replies"
            :key="r_index"
            class="mx-3"
          >
            <div class="mb-0">
              <p class="mb-1 mt-2">
                <img
                  v-if="validImageComments(reply)"
                  width="20"
                  height="20"
                  :src="imageComments(reply)"
                  class="rounded-circle mr-2"
                  alt="foto de perfil"
                />
                <i v-else class="fas fa-user-circle fa-1x mr-1" />
                <span>{{ objectName(reply) }}</span>
              </p>
              <i class="fas fa-comments ml-1" />
              {{ reply.comment }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <modal
      :show.sync="modal.modalConfirmation"
      modal-classes="modal-default modal-dialog-centered"
      body-classes="pb-0"
    >
      <h6 id="modal-title-notification" slot="header" class="modal-title">
        Atenção!
      </h6>
      <div ref="modal_confirmation_delete" class="vld-parent">
        <div class="py-3 text-center">
          <i class="fa fa-trash fa-3x" />
          <h4 class="heading mt-4">
            Você realmente deseja excluir o comentário?
          </h4>
        </div>
      </div>
      <template slot="footer">
        <base-button
          type="link"
          text-color="white"
          class="ml-auto"
          @click="modal.modalConfirmation = false"
        >
          Voltar
        </base-button>
        <base-button
          type="white text-danger"
          @click="handleDeleteComment(idDelete)"
        >
          Confirmar exclusão
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
import { getUserId } from "@/services/auth";
import api from "@/services/api";

export default {
  name: "PostCard",
  components: {
    quillEditor,
  },
  data() {
    return {
      news: {
        author: {
          admin: {
            name: "",
            profile_picture: {
              url: "",
            },
          },
          teacher: {
            name: "",
            profile_picture: {
              url: "",
            },
          },
          student: {
            name: "",
            profile_picture: {
              url: "",
            },
          },
          volunteer: {
            brand_name: "",
            profile_picture: {
              url: "",
            },
          },
          partner: {
            name: "",
            profile_picture: {
              url: "",
            },
          },
          associate: {
            name: "",
            profile_picture: {
              url: "",
            },
          },
        },
        comments: [],
        body: "",
      },
      user_id: getUserId(),
      loaderComment: false,
      limit: 10,
      empty: {
        news: "",
      },
      profile_picture: "",
      commentResponse: "",
      commentResponseId: "",
      model: { newComment: "" },
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
    this.loadNews(`&limit=${this.limit}`);
  },
  methods: {
    objectName(obj) {
      for (const entry in obj)
        if (obj[entry] && obj[entry].name) return obj[entry].name;

      return "Não informado";
    },
    validImageComments(comment) {
      if (comment.author_admin) {
        return comment.author_admin.profile_picture ? true : false;
      } else if (comment.author_teacher) {
        return comment.author_teacher.profile_picture ? true : false;
      } else if (comment.author_student) {
        return comment.author_student.profile_picture ? true : false;
      } else if (comment.author_volunteer) {
        return comment.author_volunteer.profile_picture ? true : false;
      } else if (comment.author_partner) {
        return comment.author_partner.profile_picture ? true : false;
      } else if (comment.author_associate) {
        return comment.author_associate.profile_picture ? true : false;
      }
    },
    imageComments(comment) {
      if (comment.author_admin) {
        return comment.author_admin.profile_picture.url
          ? comment.author_admin.profile_picture.url
          : "";
      } else if (comment.author_teacher) {
        return comment.author_teacher.profile_picture.url
          ? comment.author_teacher.profile_picture.url
          : "";
      } else if (comment.author_student) {
        return comment.author_student.profile_picture.url
          ? comment.author_student.profile_picture.url
          : "";
      } else if (comment.author_volunteer) {
        return comment.author_volunteer.profile_picture.url
          ? comment.author_volunteer.profile_picture.url
          : "";
      } else if (comment.author_partner) {
        return comment.author_partner.profile_picture.url
          ? comment.author_partner.profile_picture.url
          : "";
      } else if (comment.author_associate) {
        return comment.author_associate.profile_picture.url
          ? comment.author_associate.profile_picture.url
          : "";
      }
    },
    handleOpenModalConfirmation(id) {
      this.modal.modalConfirmation = true;
      this.idDelete = id;
    },
    async handleDeleteComment(id) {
      try {
        await api.delete(`/news/${this.news.id}/comment/${id}`);
        this.modal.modalConfirmation = false;
        this.loadNews();
      } catch (error) {
        this.$toasted.error("Ocorreu um erro ao excluir o comentário!");
      }
    },
    async handleComment() {
      this.loaderComment = true;
      try {
        await api.post(`/news/${this.news.id}/comment`, {
          comment: this.model.newComment,
        });
        this.model.newComment = "";
        this.loadNews();
        this.loaderComment = false;
        this.$toasted.show("Comentário realizado com sucesso");
      } catch (e) {
        this.loaderComment = false;
        const genericError = "Ocorreu um erro ao comentar!";
        const hasErrorResponseData = e.response && e.response.data;
        let customError = genericError;
        if (hasErrorResponseData) {
          const data = e.response.data.error
            ? e.response.data.error
            : e.response.data.errors;
          if (data[0] && data[0].message) customError = data[0].message;
          else if (data.message) customError = data.message;
        }
        this.$toasted.error(hasErrorResponseData ? customError : genericError);
      }
    },
    truncate(text, stop = 150, clamp = "...") {
      if (!text) return "N/A";
      return text.slice(0, stop) + (stop < text.length ? clamp : "");
    },
    async loadPublications(targetObjName, loaderRef, errorMsg) {
      this.empty[targetObjName] = false;
      const loader = this.$loading.show({
        container: loaderRef,
        width: 90,
        height: 90,
      });
      try {
        const { data } = await api.get(`/news/${this.$route.params.id}`);

        if (data) {
          this.news = data;

          if (this.news.author.admin) {
            this.profile_picture = this.news.author.admin.profile_picture
              ? this.news.author.admin.profile_picture.url
              : "";
          } else if (this.news.author.teacher) {
            this.profile_picture = this.news.author.teacher.profile_picture
              ? this.news.author.teacher.profile_picture.url
              : "";
          } else if (this.news.author.student) {
            this.profile_picture = this.news.author.student.profile_picture
              ? this.news.author.student.profile_picture.url
              : "";
          } else if (this.news.author.partner) {
            this.profile_picture = this.news.author.partner.profile_picture
              ? this.news.author.partner.profile_picture.url
              : "";
          } else if (this.news.author.associate) {
            this.profile_picture = this.news.author.associate.profile_picture
              ? this.news.author.associate.profile_picture.url
              : "";
          } else if (this.news.author.volunteer) {
            this.profile_picture = this.news.author.volunteer.profile_picture
              ? this.news.author.volunteer.profile_picture.url
              : "";
          }
        } else this.empty[targetObjName] = true;
        loader.hide();
      } catch (e) {
        this.$toasted.error(`Ocorreu um erro ao recuperar ${errorMsg}`);
      }
    },
    async loadNews() {
      await this.loadPublications(
        "news",
        this.$refs.news_table,
        "as publicações"
      );
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
<style scoped>
.image-feed {
  max-width: 500;
  max-height: 500;
}
</style>
