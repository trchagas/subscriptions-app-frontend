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
              :to="'/professor/turmas/' + $route.params.class_id + '/materiais'"
              class="btn-link font-weight-normal text-white"
              title="Voltar para a listagem de materiais da turma"
            >
              <i class="fas fa-chevron-left mr-1" />
              Voltar
            </router-link>
          </div>
          <div class="col-lg-7 col-md-10">
            <p class="text-white mt-4 mb-2">
              Aqui é possível editar o material da turma
              <b>{{ course.title }}</b>
              . Para alterar a ordem de exibição dos materiais da turma, acesse
              a página de materiais da turma.
            </p>
          </div>
        </div>
      </div>
    </base-header>

    <div class="container-fluid mt--7">
      <div class="row">
        <div ref="course_card" class="col-xl-4 order-xl-2 mb-5 mb-xl-0">
          <div class="row">
            <div class="col-12 mb-3">
              <div
                ref="course_image"
                class="card card-profile shadow vld-parent border-0"
              >
                <div class="card-image">
                  <img
                    class="card-img-top"
                    :src="course.image_url || placeholderImg"
                    alt="Imagem turma"
                  />
                  <div class="image-overlay" />
                </div>

                <div class="card-body">
                  <h2 class="card-title mb-1">{{ course.title }}</h2>
                  <p class="description mb-0">{{ course.subtitle }}</p>
                  <p v-if="!course.is_visible" class="mt-2 mb-0">
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
                    <i class="fas fa-book mr-2" /> Editar material
                    <span class="text-warning">
                      {{ model.material.title }}
                    </span>
                    <base-button
                      size="sm"
                      type="danger"
                      class="float-right"
                      @click="handleOpenModalRemove()"
                    >
                      <i class="fas fa-trash mr-1" /> Deletar material
                    </base-button>
                  </h3>
                </div>
              </div>
            </div>
            <template>
              <form ref="material_form" role="form vld-parent">
                <div class="row ml-1">
                  <h6 class="heading-small text-muted mb-4">
                    Informações básicas
                  </h6>
                </div>
                <div class="row ml-lg-2">
                  <div class="col-lg-6">
                    <base-input
                      v-model.trim="model.material.title"
                      label="Título do material*"
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
                    <base-input label="Descrição do material (opcional)">
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
                  <h6 class="heading-small text-muted mb-4">Conteúdo</h6>
                </div>
                <div v-if="model.material.content" class="row ml-lg-2">
                  <div class="col-lg-12">
                    <label class="form-control-label d-block">
                      Tipo de material
                    </label>
                    <p>
                      {{ materialTypes[model.material.content] }}
                    </p>
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
                    <base-button
                      v-tooltip="'Abrir arquivo'"
                      type="default"
                      class="mb-3"
                      @click="openLink(model.material.file_url)"
                    >
                      Abrir arquivo
                      <i class="fas fa-external-link-alt ml-1" />
                    </base-button>
                    <br />
                    <file-select
                      v-model="model.file"
                      title="Deseja substituir o arquivo?"
                      :mb-size="25"
                      type="link p-0 ml-1"
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
                        <b>.{{ model.file.name.split(".").pop() }}</b>
                        .
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
                    <div class="me-container-edditable">
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
                    <avaliacao-edit :material="model.material" />
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
                    @click="handleUpdateForm"
                  >
                    Salvar Alterações
                  </base-button>
                </div>
              </form>
            </template>
          </card>
        </div>
      </div>
    </div>
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
    <modal
      :show.sync="modalRemove.show"
      modal-classes="modal-default modal-dialog-centered"
      body-classes="pb-2"
    >
      <h6 id="modal-title-notification" slot="header" class="modal-title">
        Atenção!
      </h6>
      <div ref="modal_remove" class="vld-parent">
        <div class="text-center">
          <i class="fas fa-trash fa-3x" />
          <h4 class="heading mt-4">Confirmar exclusão</h4>
          <p class="mt-3">
            Você confirma a remoção do material
            <span class="font-weight-bold"> {{ model.material.title }} </span>
            ?
          </p>
        </div>
        <base-alert
          v-if="modalRemove.error"
          type="danger"
          class="text-center mb-2"
        >
          Ocorreu um erro ao remover o material. Por favor, tente novamente.
        </base-alert>
      </div>
      <template slot="footer">
        <base-button
          type="link"
          text-color="white"
          class="ml-auto"
          @click="modalRemove.show = false"
        >
          Voltar
        </base-button>
        <base-button type="white text-danger" @click="handleRemoveMaterial">
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

import { getIdFromUrl } from "vue-youtube";

import AvaliacaoEdit from "@/components/Materiais/AvaliacaoEdit";

import api from "@/services/api.js";

export default {
  name: "MaterialEdit",
  components: {
    quillEditor,
    AvaliacaoEdit,
  },
  data() {
    return {
      model: {
        material: {
          title: "",
          is_active: false,
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
      course: "",
      placeholderImg: "/img/pages/default_banner_course.jpg",
      requiredFields: ["title", "content"],
      sectionRequiredFields: ["title"],
      modalNewSection: {
        show: false,
        error: "",
      },
      sections: [],
      materialTypes: {
        video: "Vídeo do YouTube",
        file: "Arquivo",
        link: "Link externo",
        text: "Texto",
        evaluation: "Avaliação",
      },
      error: "",
      editorEdittable: {
        placeholder: "Escreva o texto aqui..",
      },
      modalRemove: {
        show: false,
        error: "",
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
    this.loadCourse();
    const loader = this.$loading.show({
      container: this.$refs.material_form,
      width: 90,
      height: 90,
    });
    try {
      const { data } = await api.get(
        `/teacher/classes/${this.$route.params.class_id}/materials/${this.$route.params.id}`
      );
      data.is_active = Boolean(data.is_active);
      if (data.section_id === null) data.section_id = "";
      this.model.material = data;
    } catch (e) {
      this.$toasted.error(
        "Ocorreu um erro ao recuperar as informações da turma"
      );
      this.$toasted.error("Ocorreu um erro ao recuperar o material");
    }
    loader.hide();
    await this.loadSections();
  },
  methods: {
    async loadCourse() {
      const loader = this.$loading.show({
        container: this.$refs.course_image,
        width: 90,
        height: 90,
      });
      try {
        const { data } = await api.get(
          `/teacher/classes/${this.$route.params.class_id}`
        );
        this.course = data;
      } catch (e) {
        this.$toasted.error(
          "Ocorreu um erro ao recuperar as informações da turma"
        );
        this.$router.push(
          `/professor/turmas/${this.$route.params.class_id}/materiais`
        );
      }
      loader.hide();
    },
    async loadSections() {
      const loader = this.$loading.show({
        container: this.$refs.sections_container,
        width: 100,
        height: 100,
      });
      try {
        const { data } = await api.get(
          `/teacher/classes/${this.$route.params.class_id}/sections`
        );
        if (data.length) this.sections = data;
      } catch (e) {
        this.$toasted.error("Ocorreu um erro ao recuperar as informações");
      } finally {
        loader.hide();
      }
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
          `/teacher/classes/${this.$route.params.class_id}/sections`,
          this.model.section
        );
        this.sections = [data, ...this.sections];
        if (!this.model.material.section_id)
          this.model.material.section_id = data.id;
        this.modalNewSection.show = false;
        this.$toasted.show("Nova seção cadastrada com sucesso!");
        this.modalNewSection.error = this.model.section.title = "";
        this.modalNewSection.is_active = true;
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
    async handleUpdateForm(e) {
      e.preventDefault();
      const loader = this.$loading.show({
        container: this.$refs.material_form,
        width: 90,
        height: 90,
      });
      this.error = "";
      const model = this.model.material;
      if (model.content === "evaluation")
        for (const evals of model.evaluation) {
          if (typeof evals.options === "string")
            evals.options = JSON.parse(evals.options);
          for (const opt in evals.options)
            if (!evals.options[opt].id) evals.options[opt].id = opt + 1;
        }
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
        await api.put(
          `/teacher/classes/${this.$route.params.class_id}/materials/${this.$route.params.id}`,
          materialData,
          config
        );
        this.$toasted.show("Alterações realizadas com sucesso");
        this.$router.push(
          `/professor/turmas/${this.$route.params.class_id}/materiais`
        );
      } catch (e) {
        const genericError = "Ocorreu um erro ao atualizar o material.";
        const hasErrorResponseData = e.response && e.response.data;
        let customError = genericError;
        if (hasErrorResponseData) {
          const data = e.response.data;
          if (data[0] && data[0].message) customError = data[0].message;
          else if (data.message) customError = data.message;
        }
        this.error = hasErrorResponseData ? customError : genericError;
        this.$toasted.error(genericError);
      } finally {
        loader.hide();
      }
    },
    async handleRemoveMaterial() {
      const loader = this.$loading.show({
        container: this.$refs.modal_remove,
        width: 90,
        height: 90,
        opacity: 0,
      });
      this.modalRemove.error = "";
      try {
        await api.delete(
          `/teacher/classes/${this.$route.params.class_id}/materials/${this.model.material.id}`
        );
        this.$toasted.show("Material removido da turma com sucesso!");
        this.modalRemove.show = false;
        this.$router.push(
          `/professor/turmas/${this.$route.params.class_id}/materiais`
        );
      } catch (e) {
        this.modalRemove.error = true;
        this.$toasted.error("Ocorreu um erro ao remover o material.");
      } finally {
        loader.hide();
      }
    },
    switchChangedHandler(event, obj) {
      if (typeof event === "boolean") this.model.material[obj] = event;
    },
    switchChangedSectionHandler(event) {
      if (typeof event === "boolean") this.model.section.is_visible = event;
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
    handleOpenModalRemove() {
      this.modalRemove.error = "";
      this.modalRemove.show = true;
    },
  },
};
</script>
<style>
.me-container-edditable .quill-editor .ql-container,
.me-container-edditable .quill-editor .ql-container .ql-editor {
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
