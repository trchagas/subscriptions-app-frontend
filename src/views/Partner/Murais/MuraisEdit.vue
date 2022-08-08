<template>
  <div>
    <base-header class="header pb-8 pt-5 pt-lg-8 d-flex align-items-center">
      <!-- Mask -->
      <span class="bg-gradient-default opacity-8" />
      <!-- Header container -->
      <div class="container-fluid d-flex align-items-center">
        <div class="row">
          <div class="col-12 mt-0 mt-md-4 mt-lg-0 d-block">
            <router-link
              :to="'/parceiro/comunidade'"
              class="btn-link font-weight-normal text-white"
              title="Voltar para a listagem de publicações"
            >
              <i class="fas fa-chevron-left mr-1" /> Voltar
            </router-link>
          </div>
          <div class="col-lg-7 col-md-10">
            <p class="text-white mt-3 mb-5">
              Aqui você pode gerênciar as notícias, eventos, treinamentos ou
              dinâmicas para os usuários, controlando a visibilidade e o status
              da publicação. Para tal, preencha as informações abaixo.
            </p>
          </div>
        </div>
      </div>
    </base-header>

    <!--Charts-->
    <div class="container-fluid mt--8">
      <div class="row">
        <div class="col-xl-10 col-lg-12">
          <div class="card shadow mb-3">
            <div class="card-header bg-transparent">
              <h3 class="mb-0">
                <i class="fas fa-newspaper mr-2" />
                Editar publicação
                <base-button
                  size="sm"
                  type="danger"
                  class="float-right"
                  @click="handleOpenModalRemove()"
                >
                  <i class="fas fa-trash mr-1" /> Deletar publicação
                </base-button>
              </h3>
            </div>
            <div ref="publicacao_container" class="card-body vld-parent">
              <h6 class="heading-small text-muted mb-4">Informações básicas</h6>
              <div class="row pl-lg-4">
                <div class="col-lg-6">
                  <base-input
                    v-model="model.title"
                    label="Título"
                    placeholder="Título da notícia"
                  />
                </div>
                <div class="col-lg-6">
                  <base-input
                    v-model="model.subtitle"
                    label="Subtítulo (opcional)"
                    placeholder="Subtítulo da publicação"
                  />
                </div>
                <div class="col-lg-6">
                  <label class="form-control-label d-block"> Tipo </label>
                  <base-input>
                    <select v-model="model.type" class="form-control">
                      <option selected disabled value="">
                        Selecione o tipo da publicação
                      </option>
                      <option
                        v-for="type in types"
                        :key="type.key"
                        :value="type.key"
                      >
                        {{ type.value }}
                      </option>
                    </select>
                  </base-input>
                </div>
                <div class="col-lg-6">
                  <label class="form-control-label d-block"> Status </label>
                  <base-input>
                    <select v-model="model.status" class="form-control">
                      <option selected disabled value="">
                        Selecione o status
                      </option>
                      <option
                        v-for="key in Object.keys(status)"
                        :key="key"
                        :value="key"
                      >
                        {{ status[key].name }}
                      </option>
                    </select>
                  </base-input>
                </div>
                <div class="col-lg-6">
                  <base-input
                    v-model="model.author_name"
                    label="Autor (opcional)"
                    placeholder="Autor da publicação"
                  />
                </div>
                <div class="col-lg-6">
                  <base-input
                    v-model="model.link"
                    label="Link (opcional)"
                    placeholder="Link externo da publicação"
                  />
                </div>
                <div class="col-lg-6">
                  <base-input
                    v-model="model.tags"
                    label="Tags (opcional)"
                    placeholder="Tags - separe-as por ;"
                  />
                </div>
                <div class="col-lg-6">
                  <label class="form-control-label d-block">
                    Imagem (opcional)
                    <i
                      v-tooltip="
                        'A imagem deve possuir tamanho máximo de 2MB e, preferencialmente, ser do formato <b>PNG</b> ou <b>JPG</b> com dimensão de <b>500x500 pixels</b>.'
                      "
                      class="fas fa-info-circle ml-1"
                    />
                  </label>
                  <base-input>
                    <file-select
                      v-model="image"
                      title="Selecione a imagem da publicação"
                      accept="image/*"
                      :mb-size="2"
                      type="warning"
                    />
                  </base-input>
                  <p v-if="image_url" class="mt--3 description">
                    <i class="fas fa-info-circle mr-2" /> Se desejar você pode
                    substituir a
                    <base-button
                      v-tooltip="'Abrir arquivo'"
                      type="link"
                      class="p-0 mt--1"
                      @click="openLink(image_url)"
                    >
                      imagem atual
                      <i class="fas fa-link ml-1" />
                    </base-button>
                  </p>
                </div>
                <div class="col-lg-6">
                  <label class="form-control-label">Data (se aplicável)</label>
                  <base-input
                    v-model="model.date"
                    type="date"
                    placeholder="Digite a data"
                    addon-left-icon="far fa-calendar-alt"
                  />
                </div>
                <div class="col-lg-6">
                  <label class="form-control-label">Hora (se aplicável)</label>
                  <base-input
                    v-model="model.start_hour"
                    type="time"
                    placeholder="Digite a hora"
                    addon-left-icon="far fa-clock"
                  />
                </div>
                <div class="col-lg-12">
                  <label class="form-control-label">
                    Corpo da publicação
                  </label>
                  <div class="np-container-edditable">
                    <quill-editor
                      v-model="model.body"
                      :options="editorEdittable"
                    />
                  </div>
                </div>
              </div>
              <div v-if="error" class="row mt-4">
                <div class="col-12 text-center">
                  <base-alert type="danger">{{ error }}</base-alert>
                </div>
              </div>
              <div class="row mt-4 text-right">
                <div class="col-12">
                  <base-button
                    type="primary"
                    :disabled="!isValidModel"
                    @click="handleUpdate()"
                  >
                    Atualizar publicação
                  </base-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <modal
      :show.sync="modalRemove.show"
      modal-classes="modal-default modal-dialog-centered"
    >
      <h6 id="modal-title-notification" slot="header" class="modal-title">
        Atenção!
      </h6>
      <div ref="modal_confirmation_delete" class="vld-parent">
        <div class="text-center">
          <i class="fa fa-trash fa-3x" />
          <h4 class="heading mt-4">
            Você realmente deseja
            <span class="text-danger">excluir a publicação</span>?
          </h4>
          <p class="mt-3 mb-0">
            Ao confirmar, a publicação "{{ model.title }}" será removida.
          </p>
        </div>
        <div v-if="modalRemove.error" class="col-12 text-center">
          <base-alert type="danger">
            Ocorreu um erro ao remover o lançamento. Tente novamente.
          </base-alert>
        </div>
      </div>
      <template slot="footer">
        <base-button
          type="link"
          text-color="white"
          class="l-auto"
          @click="modalRemove.show = false"
        >
          Voltar
        </base-button>
        <base-button type="white" class="text-danger" @click="handleRemove()">
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

import "vue-select/dist/vue-select.css";

import api from "@/services/api";

export default {
  components: {
    quillEditor,
  },
  data() {
    return {
      model: {
        title: "",
        subtitle: "",
        type: "",
        status: "public",
        author_name: "",
        link: "",
        tags: "",
        body: "",
        date: "",
        start_hour: "",
      },
      image: null,
      image_url: null,
      requiredFields: ["title", "type", "status", "body"],
      status: {
        public: {
          name: "Público",
          type: "success",
        },
        hidden: {
          name: "Oculto  (visível somente para o parceiro)",
          type: "primary",
        },
      },
      types: [
        {
          key: "notice",
          value: "Aviso",
        },
        {
          key: "event",
          value: "Evento",
        },
        {
          key: "training",
          value: "Treinamento",
        },
        {
          key: "dynamic",
          value: "Dinâmica",
        },
      ],
      editorEdittable: {
        placeholder:
          "Escreva aqui... (lembre-se, se necessário, você pode linkar arquivos pelo editor)",
      },
      modalRemove: {
        show: false,
        error: "",
      },
      error: "",
    };
  },
  computed: {
    isValidModel() {
      const data = this.model;
      for (const key of this.requiredFields) {
        if (!data[key]) return false;
      }
      return true;
    },
  },
  async mounted() {
    const loader = this.$loading.show({
      container: this.$refs.publicacao_container,
      width: 90,
      height: 90,
    });
    try {
      const { data } = await api.get(`/partner/news/${this.$route.params.id}`);
      this.image_url = data.image_url;
      delete data.image_url;
      delete data.image_key;
      if (data) {
        this.model.title = data.title ? data.title : "";
        this.model.subtitle = data.subtitle ? data.subtitle : "";
        this.model.type = data.type ? data.type : "";
        this.model.status = data.status ? data.status : "";
        this.model.author_name = data.author_name ? data.author_name : "";
        this.model.link = data.link ? data.link : "";
        this.model.tags = data.tags ? data.tags : "";
        this.model.body = data.body ? data.body : "";
        this.model.date = data.date
          ? this.moment(data.date).format("YYYY-MM-DD")
          : "";
        this.model.start_hour = data.start_hour ? data.start_hour : "";
        this.model.id = data.id ? data.id : "";
      }
    } catch (e) {
      this.$toasted.error("Ocorreu um erro ao recuperar as informações");
      this.$router.push("/parceiro/comunidade");
    } finally {
      loader.hide();
    }
  },
  methods: {
    async handleUpdate() {
      this.error = "";
      const loader = this.$loading.show({
        container: this.$refs.publicacao_container,
        width: 90,
        height: 90,
      });
      try {
        const config = {
          headers: {
            "content-type": "multipart/form-data",
          },
        };
        const data = new FormData();
        if (this.image) {
          data.append("image", this.image, this.image.name);
        }
        Object.entries(this.model).forEach((entry) => {
          data.append(entry[0], entry[1]);
        });
        await api.put(`/partner/news/${this.model.id}`, data, config);
        this.$toasted.show("Publicação atualizada com sucesso");
        this.$router.push("/parceiro/comunidade");
      } catch (e) {
        this.$toasted.error("Ocorreu um erro ao atualizar a publicação");
        this.error =
          "Ocorreu um erro ao atualizar a publicação. Por favor, verifique os campos e tente novamente.";
      } finally {
        loader.hide();
      }
    },
    async handleRemove() {
      this.modalRemove.error = false;
      const loader = this.$loading.show({
        container: this.$refs.modal_confirmation_delete,
        width: 160,
        height: 160,
        opacity: 0,
      });
      try {
        await api.delete(`/partner/news/${this.$route.params.id}`);
        this.$toasted.show("Publicação removida com sucesso");
        this.$router.push("/parceiro/comunidade");
      } catch (e) {
        this.$toasted.error("Ocorreu um erro ao remover a publicação");
        this.modalRemove.error = true;
      } finally {
        loader.hide();
      }
    },
    openLink(link) {
      window.open(link, "file-window", "resizable=1,height=750,width=750");
    },
    handleOpenModalRemove() {
      this.modalRemove.error = "";
      this.modalRemove.show = true;
    },
  },
};
</script>
<style>
p > strong {
  font-weight: bold !important;
}

.np-container-edditable .quill-editor .ql-container,
.np-container-edditable .quill-editor .ql-container .ql-editor {
  height: 6rem;
  width: 100%;
}
</style>
<style>
.categories_select.v-select {
  background-color: #fff;
  background-clip: padding-box;
}
.categories_select.v-select .vs__dropdown-toggle {
  padding: 0.5rem 0.1rem;
  min-width: 100%;
}
.categories_select.v-select
  .vs__dropdown-toggle
  .vs__selected-options
  .vs__search {
  color: #8898aa;
  font-weight: 400;
  line-height: 1.5;
  font-size: 0.875rem;
}
</style>
