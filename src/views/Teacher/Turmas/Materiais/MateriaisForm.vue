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
              :to="'/professor/turmas/' + $route.params.id + '/materiais'"
              class="btn-link font-weight-normal text-white"
              title="Voltar para a listagem de materiais da turma"
            >
              <i class="fas fa-chevron-left mr-1" />
              Voltar
            </router-link>
          </div>
          <div class="col-lg-7 col-md-10">
            <p class="text-white mt-4 mb-2">
              Aqui é possível cadastrar um novo material à turma
              <b> {{ classe.title }} </b>. Após o cadastro inicial, é possível
              atualizar as informações do material a ser disponibilizado aos
              colaboradores. Para alterar a ordem de exibição dos materiais na
              turma, acesse a página de materiais da turma.
            </p>
          </div>
        </div>
      </div>
    </base-header>

    <div class="container-fluid mt--7">
      <div class="row">
        <div class="col-xl-4 order-xl-2 mb-5 mb-xl-0">
          <div class="row">
            <div class="col-12 mb-3">
              <div
                ref="course_image"
                class="card card-profile shadow vld-parent border-0"
              >
                <div class="card-image">
                  <img
                    class="card-img-top"
                    :src="classe.background_url || placeholderImg"
                    alt="Imagem turma"
                  />
                  <div class="image-overlay" />
                </div>

                <div class="card-body">
                  <h2 class="card-title mb-1">{{ classe.title }}</h2>
                  <p class="description mb-0">{{ classe.subtitle }}</p>
                  <p v-if="!classe.is_visible" class="mt-2 mb-0">
                    <badge v-tooltip="'A turma está oculta'" type="warning">
                      Oculto
                    </badge>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-xl-8">
          <card shadow>
            <div slot="header" class="bg-white border-0">
              <div class="row align-items-center">
                <div class="col-12">
                  <h3 class="mb-0">
                    <i class="fas fa-book mr-2" /> Novo material
                  </h3>
                </div>
              </div>
            </div>
            <template>
              <form role="form">
                <div class="row ml-1">
                  <h6 class="heading-small text-muted mb-4">
                    Informações básicas
                  </h6>
                </div>
                <div class="row ml-lg-2">
                  <div class="col-lg-6">
                    <base-input
                      v-model.trim="model.material.title"
                      label="Título*"
                      placeholder="Digite o título"
                    />
                  </div>
                  <div class="col-lg-6">
                    <label class="form-control-label d-block">
                      Está ativo?
                      <i
                        v-tooltip="
                          'Um material <b>ativo</b> fica visível para os alunos que possuem acesso, enquanto um material <b>inativo</b> fica oculto para todos colaboradores.'
                        "
                        class="fas fa-info-circle ml-1"
                      />
                    </label>
                    <base-input>
                      <base-switch
                        :value="model.material.is_active"
                        @input="switchChangedHandler($event, 'is_active')"
                      />
                    </base-input>
                  </div>
                  <div class="col-lg-12">
                    <base-input label="Descrição (opcional)">
                      <textarea
                        v-model="model.material.description"
                        rows="2"
                        class="form-control"
                        placeholder="Escreva aqui..."
                      />
                    </base-input>
                  </div>
                </div>
                <hr class="mt-3 mb-4" />
                <div class="row ml-1">
                  <h6 class="heading-small text-muted mb-4">Seção</h6>
                </div>
                <div class="row ml-lg-2 pb-4">
                  <div ref="sections_container" class="col-lg-8 vld-parent">
                    <label class="form-control-label d-block">
                      Seção do material na turma
                      <i
                        v-tooltip="
                          'Ao selecionar a opção <b>sem seção</b>, o material será adicionado a uma seção geral dentro da turma.'
                        "
                        class="fa fa-info-circle ml-1"
                      />
                    </label>
                    <select
                      v-model="model.material.section_id"
                      class="form-control"
                    >
                      <option selected value="">Sem seção</option>
                      <option
                        v-for="section in sections"
                        :key="section.id"
                        :value="section.id"
                      >
                        {{ section.title }}
                      </option>
                    </select>
                  </div>
                  <div class="col-lg-4 text-center text-lg-left">
                    <br />
                    <base-button
                      type="default"
                      class="mt-1"
                      @click="modalNewSection.show = true"
                    >
                      <i class="fas fa-plus mr-1" />
                      Nova seção
                    </base-button>
                  </div>
                </div>
                <hr class="mt-3 mb-4" />
                <div class="row ml-1">
                  <h6 class="heading-small text-muted mb-4">
                    Conteúdo
                    <i
                      v-tooltip="
                        'O tipo do conteúdo <b>não poderá ser alterado</b> após a criação do material.'
                      "
                      class="fas fa-info-circle ml-1"
                    />
                  </h6>
                </div>
                <div class="row ml-lg-2">
                  <div class="col-lg-12">
                    <base-input>
                      <div class="row ml-lg-2">
                        <div
                          v-for="(type, index) in materialTypes"
                          :key="index"
                          class="col-lg-4"
                        >
                          <base-radio
                            v-model="model.material.content"
                            :name="type.type"
                            class="mb-3"
                            :inline="true"
                          >
                            {{ type.name }}
                          </base-radio>
                        </div>
                      </div>
                    </base-input>
                  </div>
                  <div
                    v-if="model.material.content === 'video'"
                    class="col-lg-12"
                  >
                    <div class="row">
                      <div class="col-lg-7">
                        <label class="form-control-label d-block">
                          Link do vídeo no YouTube*
                        </label>
                        <base-input
                          v-model="model.material.video"
                          addon-left-icon="fab fa-youtube"
                          type="text"
                          placeholder="Digite a url"
                        />
                      </div>
                      <div
                        v-show="model.material.video"
                        class="col-lg-5 pt-0 pt-lg-4 mt--1 mt-lg-2 text-center text-lg-left"
                      >
                        <span
                          v-if="getYoutubeVideoId()"
                          v-tooltip="
                            'Verifique se o vídeo está abrindo corretamente.'
                          "
                          class="btn btn-default btn-sm"
                          @click="
                            openLink(
                              'https://www.youtube.com/watch?v=' +
                                getYoutubeVideoId()
                            )
                          "
                        >
                          verificar link
                        </span>
                        <span
                          v-else
                          v-tooltip="
                            `Uma URL válida possuí um formato do tipo <em>https://www.youtube.com/watch?v=<b>ID</b></em>, onde <em><b>ID</b></em> é o indentificador do vídeo.`
                          "
                          class="text-sm text-danger"
                        >
                          <i class="fas fa-info-circle mr-1" /> A URL ainda não
                          está em um formato válido.
                        </span>
                      </div>
                    </div>
                  </div>
                  <div
                    v-else-if="model.material.content === 'file'"
                    class="col-lg-12"
                  >
                    <label class="form-control-label d-block">
                      Arquivo*
                      <i
                        v-tooltip="
                          'O arquivo deve possuir tamanho máximo de 25MB.'
                        "
                        class="fas fa-info-circle ml-1"
                      />
                    </label>
                    <file-select
                      v-model="model.file"
                      title="Selecione o arquivo"
                      :mb-size="25"
                      type="warning"
                    />
                    <p class="text-sm text-muted d-inline-block mx-3">
                      <i class="fas fa-info-circle mr-1" />
                      <span v-if="!model.file">
                        Deve possuir tamanho máximo de <b>25MB</b>.
                      </span>
                      <span v-else>
                        Arquivo selecionado. Tamanho:
                        <b>{{ getMbSize(model.file.size) }}</b>
                        . Extensão:
                        <b>.{{ model.file.name.split(".").pop() }} </b>.
                      </span>
                    </p>
                  </div>
                  <div
                    v-else-if="model.material.content === 'link'"
                    class="col-lg-12"
                  >
                    <label class="form-control-label d-block">
                      Link externo do material*
                    </label>
                    <base-input
                      v-model="model.material.link"
                      addon-left-icon="fas fa-external-link-alt"
                      type="text"
                      placeholder="Digite a url"
                    />
                  </div>
                  <div
                    v-else-if="model.material.content === 'text'"
                    class="col-lg-12 mb-3 pb-3"
                  >
                    <label class="form-control-label">
                      Texto do material*
                    </label>
                    <div class="mf-container-edditable">
                      <quill-editor
                        v-model="model.material.text"
                        :options="editorEdittable"
                      />
                    </div>
                  </div>
                  <div
                    v-else-if="model.material.content === 'evaluation'"
                    class="col-lg-12 pb-3"
                  >
                    <avaliacao-form :material="model.material" />
                  </div>
                </div>
                <div class="text-center">
                  <hr class="my-4" />
                  <div v-if="error" class="row ml-lg-2">
                    <div class="col-lg-12 text-center">
                      <base-alert type="danger">{{ error }}</base-alert>
                    </div>
                  </div>
                  <base-button
                    type="primary"
                    :custom="true"
                    :disabled="!isValidModel"
                    @click="handleOpenModalConfirmation"
                  >
                    Cadastrar novo material
                  </base-button>
                </div>
              </form>
            </template>
          </card>
        </div>
      </div>
    </div>
    <modal
      :show.sync="modalConfirmation.show"
      modal-classes="modal-default modal-dialog-centered"
    >
      <h6 id="modal-title-notification" slot="header" class="modal-title">
        Atenção!
      </h6>
      <div ref="modal_confirmation" class="vld-parent">
        <div class="py-3 text-center">
          <i class="fas fa-graduation-cap fa-3x" />
          <h4 class="heading mt-4">Confirmar criação</h4>
          <p class="mt-3 mb-0">
            Você confirma a criação do material
            <span class="font-weight-bold">
              {{ model.material.title }}
            </span>
            ?
          </p>
        </div>
      </div>
      <template slot="footer">
        <base-button
          type="link"
          text-color="white"
          class="ml-auto"
          @click="modalConfirmation.show = false"
        >
          Voltar
        </base-button>
        <base-button type="white text-success" @click="handleSubmitNewMaterial">
          Confirmar criação
        </base-button>
      </template>
    </modal>
    <modal
      :show.sync="modalNewSection.show"
      modal-classes="modal-dialog-centered"
      body-classes="pb-2"
    >
      <h6 id="modal-title-notification" slot="header" class="modal-title">
        Cadastrar nova seção
      </h6>
      <div ref="modal_new_section" class="vld-parent">
        <div class="pt-0">
          <div class="col-12 text-center mb-4">
            <i class="fas fa-layer-group fa-3x" />
            <h4 class="heading mt-4">Nova seção</h4>
          </div>
          <div class="col-lg-12">
            <base-input
              v-model.trim="model.section.title"
              label="Título*"
              placeholder="Digite o título da seção"
            />
          </div>
          <div class="col-lg-12">
            <label class="form-control-label d-block">
              Está ativa?
              <i
                v-tooltip="
                  'Os materias de uma seção <b>ativa</b> ficam visíveis para os colaboradores que possuem acesso, enquanto uma seção <b>inativa</b> fica oculta para todos colaboradores.'
                "
                class="fas fa-info-circle ml-1"
              />
            </label>
            <base-input>
              <base-switch
                :value="model.section.is_visible"
                @input="switchChangedSectionHandler($event, 'is_visible')"
              />
            </base-input>
          </div>
          <base-alert
            v-if="modalNewSection.error"
            type="danger"
            class="mb-0 text-center"
          >
            Ocorreu um erro ao cadastrar a nova seção. Tente novamente.
          </base-alert>
        </div>
      </div>
      <template slot="footer">
        <base-button
          type="link"
          text-color="default"
          class="ml-auto"
          @click="modalNewSection.show = false"
        >
          Voltar
        </base-button>
        <base-button
          type="primary"
          :custom="true"
          :disabled="!isValidSectionModel"
          @click="handleSubmitNewSection"
        >
          Cadastrar nova seção
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

import { getIdFromUrl } from "vue-youtube";

import api from "@/services/api.js";

import AvaliacaoForm from "@/components/Materiais/AvaliacaoForm";

export default {
  name: "MaterialForm",
  components: {
    quillEditor,
    AvaliacaoForm,
  },
  data() {
    return {
      model: {
        material: {
          title: "",
          is_active: true,
          section_id: "",
          content: "",
          description: "",
          video: "",
          link: "",
          text: "",
          evaluation: [],
        },
        file: null,
        section: {
          title: "",
          is_visible: true,
        },
      },
      classe: "",
      placeholderImg: "/img/pages/default_banner_course.jpg",
      requiredFields: ["title", "content"],
      sectionRequiredFields: ["title"],
      modalConfirmation: {
        show: false,
      },
      modalNewSection: {
        show: false,
        error: "",
      },
      sections: [],
      materialTypes: [
        {
          type: "video",
          name: "Vídeo do YouTube",
        },
        { type: "file", name: "Arquivo" },
        { type: "link", name: "Link externo" },
        { type: "text", name: "Texto" },
        { type: "evaluation", name: "Avaliação" },
      ],
      error: "",
      editorEdittable: {
        placeholder: "Escreva o texto aqui..",
      },
    };
  },
  computed: {
    isValidModel() {
      const material = this.model.material;
      for (const key of this.requiredFields) {
        if (material[key] === "") return false;
      }
      if (
        material.content === "evaluation" &&
        !material[material.content].length
      )
        return false;
      else if (material[material.content] === "") return false;
      return true;
    },
    isValidSectionModel() {
      const section = this.model.section;
      for (const key of this.sectionRequiredFields) {
        if (section[key] === "") return false;
      }
      return true;
    },
  },
  async mounted() {
    const loader = this.$loading.show({
      container: this.$refs.course_image,
      width: 90,
      height: 90,
    });
    try {
      const { data } = await api.get(
        `/teacher/classes/${this.$route.params.id}`
      );
      this.classe = data;
    } catch (e) {
      this.$toasted.error(
        "Ocorreu um erro ao recuperar as informações da turma"
      );
      this.$router.push(`/professor/turmas/${this.$route.params.id}/materiais`);
    }
    loader.hide();
    await this.loadSections();
  },
  methods: {
    async loadSections() {
      const loader = this.$loading.show({
        container: this.$refs.sections_container,
        width: 100,
        height: 100,
      });
      try {
        const { data } = await api.get(
          `/teacher/classes/${this.$route.params.id}/sections`
        );
        if (data.length) this.sections = data;
      } catch (e) {
        this.$toasted.error("Ocorreu um erro ao recuperar as informações");
      } finally {
        loader.hide();
      }
    },
    handleOpenModalConfirmation() {
      this.modalConfirmation.show = true;
    },
    async handleSubmitNewMaterial(e) {
      e.preventDefault();
      const loader = this.$loading.show({
        container: this.$refs.modal_confirmation,
        width: 90,
        height: 90,
        opacity: 0,
        color: "white",
      });
      this.error = "";
      const model = this.model.material;
      for (const evals of model.evaluation)
        for (const opt in evals.options) evals.options[opt].id = Number(opt);
      try {
        const config = {
          headers: {
            "content-type":
              model.content === "file"
                ? "multipart/form-data"
                : "application/json",
          },
        };
        const materialData = model.content === "file" ? new FormData() : {};
        if (model.content === "file") {
          for (const key in model) materialData.append(key, model[key]);
          if (this.model.file)
            materialData.append("file", this.model.file, this.model.file.name);
        } else
          for (const key in model) {
            if (key === "evaluation") {
              for (const newEval of model[key])
                if (newEval.type === "checkbox") {
                  const newAnswers = new Set();
                  for (const pos in newEval.right_answer) {
                    if (newEval.right_answer[pos]) {
                      newAnswers.add(pos);
                    }
                  }
                  newEval.right_answer = [...newAnswers];
                }
            }
            materialData[key] = model[key];
          }

        await api.post(
          `/teacher/classes/${this.$route.params.id}/materials`,
          materialData,
          config
        );
        this.$toasted.show("Novo material cadastradro com sucesso");
        this.$router.push(
          `/professor/turmas/${this.$route.params.id}/materiais`
        );
      } catch (e) {
        const genericError = "Ocorreu um erro ao cadastrar o material.";
        const hasErrorResponseData = e.response && e.response.data;
        let customError = genericError;
        if (hasErrorResponseData) {
          const data = e.response.data;
          if (data[0] && data[0].message) customError = data[0].message;
          else if (data.message) customError = data.message;
        }
        this.error = hasErrorResponseData ? customError : genericError;
        this.$toasted.error(genericError);
        this.modalConfirmation.show = false;
      }
      loader.hide();
    },
    async handleSubmitNewSection() {
      this.modalNewSection.error = "";
      const loader = this.$loading.show({
        container: this.$refs.modal_new_section,
        width: 160,
        height: 160,
        opacity: 0,
      });
      try {
        const { data } = await api.post(
          `/teacher/classes/${this.$route.params.id}/sections`,
          this.model.section
        );
        this.$toasted.show("Nova seção cadastrada com sucesso!");
        this.sections = [data, ...this.sections];
        if (!this.model.material.section_id)
          this.model.material.section_id = data.id;
        this.modalNewSection.show = false;
        this.modalNewSection.error = this.model.section.title = "";
      } catch (e) {
        this.modalNewSection.error = true;
        const strError = "Ocorreu um erro ao cadastrar a seção.";
        const hasErrorMessage =
          e.response && e.response.data && e.response.data.message;
        this.$toasted.error(
          hasErrorMessage ? e.response.data.message : strError
        );
      }
      loader.hide();
    },
    switchChangedHandler(event, obj) {
      if (typeof event === "boolean") this.model.material[obj] = event;
    },
    switchChangedSectionHandler(event, obj) {
      if (typeof event === "boolean") this.model.section[obj] = event;
    },
    truncate(text, stop = 30, clamp = "...") {
      if (!text) return "N/A";
      return text.slice(0, stop) + (stop < text.length ? clamp : "");
    },
    getYoutubeVideoId() {
      return getIdFromUrl(this.model.material.video);
    },
    openLink(link) {
      window.open(link, "file-window", "resizable=1,height=750,width=750");
    },
    getMbSize(bytes) {
      if (bytes < 1000) return `${bytes} bytes`;
      if (bytes < 1000 * 1000) return `${(bytes / 1000).toFixed(2)} KB`;
      return `${(bytes / 1000 / 1000).toFixed(2)} MB`;
    },
  },
};
</script>
<style>
.mf-container-edditable .quill-editor .ql-container,
.mf-container-edditable .quill-editor .ql-container .ql-editor {
  height: 6rem;
  width: 100%;
}
p > strong {
  font-weight: bold !important;
}
</style>
<style scoped>
.cursor {
  cursor: pointer;
}
.material-item {
  background: #fff;
  color: #525f7f;
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
}
.card-img-top {
  height: 200px;
  margin: auto;
  object-fit: cover;
}

.card-image {
  position: relative;
  height: 200px;
}

.image-overlay {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  width: 100%;
  opacity: 0.2;
  transition: 0.5s ease;
  background: rgba(0, 0, 0, 0.5);
}

.card:hover .image-overlay {
  opacity: 1;
}
</style>
