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
              :to="'/voluntario/murais'"
              class="btn-link font-weight-normal text-white"
              title="Voltar para a listagem de publicações"
            >
              <i class="fas fa-chevron-left mr-1" /> Voltar
            </router-link>
          </div>
          <div class="col-lg-7 col-md-10">
            <p class="text-white mt-3 mb-5">
              Aqui você pode cadastrar notícias, eventos, treinamentos ou
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
                Nova publicação
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
                    @click="handleSubmit()"
                  >
                    Salvar publicação
                  </base-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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
        date: "",
        start_hour: "",
        body: "",
      },
      image: null,
      requiredFields: ["title", "type", "status", "body"],
      status: {
        public: {
          name: "Público",
          type: "success",
        },
        hidden: {
          name: "Oculto  (visível somente para o voluntário)",
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
  methods: {
    async handleSubmit() {
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
        await api.post("/volunteer/news", data, config);
        this.$toasted.show("Publicação salva com sucesso");
        this.$router.push("/voluntario/murais");
      } catch (e) {
        const genericError =
          "Ocorreu um erro ao salvar a publicação. Por favor, verifique os campos e tente novamente.";
        const hasErrorResponseData = e.response && e.response.data;
        let customError = genericError;
        if (hasErrorResponseData) {
          const data = e.response.data.error
            ? e.response.data.error
            : e.response.data.errors;
          if (data[0] && data[0].message) customError = data[0].message;
          else if (data.message) customError = data.message;
        }
        this.error = hasErrorResponseData ? customError : genericError;
        this.$toasted.error("Ocorreu um erro ao salvar a publicação");
      } finally {
        loader.hide();
      }
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
