<template>
  <div>
    <base-header class="header pb-3 py-5 pt-md-8 d-flex align-items-center">
      <!-- Header container -->
    </base-header>
    <div class="container-fluid mt--5">
      <div
        ref="news_feed"
        class="col-xl-6 offset-xl-2 col-xl-8 col-lg-12 mb-4 card vld-parent px-2"
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
          <span>{{
            news.author.admin
              ? news.author.admin.name
              : news.author.teacher
              ? news.author.teacher.name
              : news.author.student
              ? news.author.student.name
              : news.author.volunteer
              ? news.author.volunteer.name
              : news.author.partner
              ? news.author.partner.name
              : news.author.associate.name
          }}</span>
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
            class="btn btn-white"
            :title="!news.liked ? 'Curtir' : 'Descurtir'"
            @click="handleLike"
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
              <span>{{
                comment.author_admin
                  ? comment.author_admin.name
                  : comment.author_teacher
                  ? comment.author_teacher.name
                  : comment.author_student
                  ? comment.author_student.name
                  : comment.author_volunteer
                  ? comment.author_volunteer.name
                  : comment.author_partner
                  ? comment.author_partner.name
                  : comment.author_associate.name
              }}</span>
            </p>
            <i class="fas fa-comment ml-1" />
            {{ comment.comment
            }}<i
              v-if="comment.user_id == user_id"
              v-tooltip="'Excluir comentário!'"
              class="far fa-trash-alt float-right ml-1 text-warning"
              @click="handleOpenModalConfirmation(comment.id)"
            />
          </div>
          <div
            v-for="(reply, rindex) in comment.replies"
            :key="rindex"
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
                <span>{{
                  reply.author_admin
                    ? reply.author_admin.name
                    : reply.author_teacher
                    ? reply.author_teacher.name
                    : reply.author_student
                    ? reply.author_student.name
                    : reply.author_volunteer
                    ? reply.author_volunteer.name
                    : reply.author_partner
                    ? reply.author_partner.name
                    : reply.author_associate.name
                }}</span>
              </p>
              <i class="fas fa-comments ml-1" />
              {{ reply.comment
              }}<i
                v-if="reply.user_id == user_id"
                v-tooltip="'Excluir comentário!'"
                class="far fa-trash-alt float-right ml-1 text-warning"
                @click="handleOpenModalConfirmation(reply.id)"
              />
            </div>
          </div>
          <span
            class="mb-3 ml-2 text-blue cursor-pointer"
            @click="handleResponse(comment)"
          >
            Responder
          </span>
          <hr />
        </div>
        <b>Comentar</b>
        <div v-if="commentResponse" class="row">
          <div class="col-10">
            <span>Respondendo a "{{ commentResponse }}"</span>
          </div>
          <div
            v-tooltip="'Remover seleção'"
            class="col-2 text-center text-red"
            @click="handleResponseRemove"
          >
            X
          </div>
        </div>
        <base-input
          v-model="model.newComment"
          placeholder="Escreva seu comentário"
        />
        <div class="text-right mb-3">
          <base-button
            v-if="commentResponse"
            class="btn"
            :disabled="loaderComment"
            @click="handleCommentResponse(commentResponseId)"
          >
            Publicar
          </base-button>
          <base-button
            v-else
            :disabled="loaderComment"
            class="btn"
            @click="handleComment"
          >
            Publicar
          </base-button>
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
    this.user_id = await getUserId();
  },
  methods: {
    handleResponseRemove() {
      this.commentResponse = "";
      this.commentResponseId = "";
    },
    handleResponse(comment) {
      this.commentResponse = comment.comment;
      this.commentResponseId = comment.id;
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
        await api.delete(`/partner/news/${this.news.id}/comment/${id}`);
        this.modal.modalConfirmation = false;
        this.loadNews();
      } catch (error) {
        this.$toasted.error("Ocorreu um erro ao excluir o comentário!");
      }
    },
    async handleCommentResponse(id) {
      this.loaderComment = true;
      try {
        await api.post(`/partner/news/${this.news.id}/comment`, {
          comment: this.model.newComment,
          reply_to: id,
        });
        this.model.newComment = "";
        this.loadNews();
        this.commentResponse = "";
        this.commentResponseId = "";
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
    async handleComment() {
      this.loaderComment = true;
      try {
        await api.post(`/partner/news/${this.news.id}/comment`, {
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
    async handleLike() {
      if (!this.news.liked) {
        this.news.likes += 1;
      } else if (this.news.liked && this.news.likes > 0) {
        this.news.likes -= 1;
      }
      this.news.liked = !this.news.liked;
      try {
        await api.put(`/partner/news/${this.news.id}/like`);
      } catch (error) {
        this.news.likes -= 1;
        this.news.liked = !this.news.liked;
        this.$toasted.error("Falha ao curtir");
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
        const { data } = await api.get(
          `/partner/news/${this.$route.params.id}`
        );

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
