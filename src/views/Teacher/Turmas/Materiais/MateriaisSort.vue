<template>
  <div>
    <base-header type="gradient-default" class="pb-6 pb-8 pt-5 pt-md-8">
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
              <i class="fas fa-chevron-left mr-1 mb-4" />
              Voltar
            </router-link>
          </div>
          <div class="col-lg-8 col-md-10">
            <p class="text-white my-3">
              Aqui você definir a ordem de exibição e as seções dos materiais da
              classe. Ao estruturar os materiais de acordo com a ordem desejada,
              lembre-se de salvar as alterações.
            </p>
          </div>
        </div>
      </div>
    </base-header>
    <div class="container-fluid">
      <div class="col-lg-12">
        <card shadow type="secondary mt--7">
          <div slot="header" class="bg-white border-0">
            <div class="row align-items-center">
              <div class="col-12">
                <h3 class="mb-0">
                  <i class="fas fa-arrows-alt-v mr-2" /> Ordenar materiais da
                  classe <span class="text-warning">{{ classe.title }}</span>
                </h3>
              </div>
            </div>
          </div>
          <div class="col-lg-12">
            <div ref="materiais_table" class="row">
              <div
                :class="{
                  'col-xl-6 mb-4': materials.sections.length !== 1,
                  'col-xl-12 mb-4': materials.sections.length === 1,
                }"
              >
                <card type="secondary">
                  <div slot="header" class="bg-white border-0">
                    <div class="row align-items-center">
                      <div class="col">
                        <h3 class="mb-0">
                          Lista de materiais
                          <span class="text-warning">sem seção</span>
                        </h3>
                      </div>
                    </div>
                  </div>
                  <Container
                    group-name="material"
                    :get-child-payload="getChildPayload"
                    @drop="onDrop(withoutSectionId, $event)"
                    @drag-start="dragStart(withoutSectionId, $event)"
                  >
                    <Draggable
                      v-for="(material, index) in materials.withoutSection"
                      :key="index"
                    >
                      <div class="draggable-item">
                        <span class="column-drag-handle cursor pr-4 float-left">
                          <i class="fas fa-bars text-gray" />
                        </span>
                        <b>{{ material.order }}º</b>.
                        {{ truncate(material.title, 50) }}
                        <span class="float-right">
                          <base-button
                            v-tooltip.bottom="'Visualizar conteúdo'"
                            type="white"
                            size="sm"
                            class="text-primary"
                            @click="handleOpenModalView(material)"
                          >
                            <i class="fas fa-eye" />
                          </base-button>
                        </span>
                      </div>
                    </Draggable>
                  </Container>
                </card>
              </div>
              <div
                v-for="(section, index) in materials.sections"
                :key="index"
                class="col-xl-6 mb-4"
              >
                <card v-if="index !== withoutSectionId" type="secondary">
                  <div slot="header" class="bg-white border-0">
                    <div class="row align-items-center">
                      <div class="col">
                        <h3 class="mb-0">
                          <span class="text-success">{{ index + 1 }}. </span>
                          <span class="text-default">{{ section.title }}</span>
                        </h3>
                      </div>
                    </div>
                  </div>
                  <Container
                    group-name="material"
                    :get-child-payload="getChildPayload"
                    @drop="onDrop(index, $event)"
                    @drag-start="dragStart(index, $event)"
                  >
                    <Draggable
                      v-for="(material, mIndex) in section.material"
                      :key="mIndex"
                    >
                      <div class="draggable-item">
                        <span class="column-drag-handle cursor pr-4 float-left">
                          <i class="fas fa-bars text-gray" />
                        </span>
                        <b>{{ material.order }}º.</b>
                        {{ truncate(material.title, 50) }}
                        <span class="float-right">
                          <base-button
                            v-tooltip.bottom="'Visualizar conteúdo'"
                            type="white"
                            size="sm"
                            class="text-primary"
                            @click="handleOpenModalView(material)"
                          >
                            <i class="fas fa-eye" />
                          </base-button>
                        </span>
                      </div>
                    </Draggable>
                  </Container>
                </card>
              </div>
            </div>
          </div>
          <div class="text-center">
            <base-button
              type="warning"
              class="mt-3"
              :custom="true"
              @click="loadMaterials"
            >
              Cancelar alterações
            </base-button>
            <base-button
              type="success"
              class="mt-3"
              :custom="true"
              @click="modalConfirmation.show = true"
            >
              Salvar alterações
            </base-button>
          </div>
        </card>
      </div>
    </div>
    <modal
      :show.sync="modalView.show"
      modal-classes="modal-dialog-centered modal-lg"
      body-classes="pb-0"
      header-classes="pb-0"
    >
      <h6 id="modal-title-notification" slot="header" class="modal-title">
        Detalhes do material
      </h6>
      <div class="text-center">
        <i
          v-if="modalView.material"
          :class="['fas fa-3x', contentTypes[modalView.material.content].icon]"
        />
        <h3 class="mt-3">
          {{ modalView.material.title }}
        </h3>
        <p class="description mt-1 mb-0">
          {{ modalView.material.description }}
        </p>
        <p v-if="!modalView.material.is_active" class="mt-2">
          <badge v-tooltip="'O material está oculto'" type="warning">
            Oculto
          </badge>
        </p>
        <div v-if="modalView.material.content === 'file'" class="mt-4">
          <base-button
            type="primary"
            @click="openLink(modalView.material.file_url)"
          >
            Visualizar arquivo
          </base-button>
        </div>
        <div v-else-if="modalView.material.content === 'link'" class="mt-4">
          <p v-if="modalView.material.link" class="mb-0">
            {{ modalView.material.link }}
          </p>
          <base-button
            type="primary mt-2"
            @click="openLink(modalView.material.link)"
          >
            Abrir link externo do material
          </base-button>
        </div>
        <div v-else-if="modalView.material.content === 'text'" class="mt-4">
          <div class="ml-container-read-only">
            <quill-editor
              v-if="modalView.material.text"
              v-model="modalView.material.text"
              :options="editorReadOnly"
              disabled="disabled"
              class="border rounded"
            />
          </div>
        </div>
        <div
          v-else-if="modalView.material.content === 'evaluation'"
          class="mt-4"
        >
          <div
            v-for="(question, index) in modalView.material.evaluation"
            :key="index"
            class="text-left"
          >
            <h4>Questão {{ index + 1 }} - {{ question.title }}</h4>
            <p v-if="question.description" class="description ml-2">
              <span class="font-weight-bold">Descrição: </span>
              {{ question.description || "-" }}
            </p>
            <p class="description ml-2">
              <span class="font-weight-bold">Tipo de questão: </span>
              {{ question.type_name }}
            </p>
            <div v-if="question.type !== 'text'" class="ml-2">
              <p class="description mb-0">
                <span class="font-weight-bold">Alternativas: </span>
              </p>
              <ul class="ml-3 description list-unstyled">
                <li
                  v-for="(option, opt_index) in question.options"
                  :key="'op_' + opt_index"
                >
                  <i
                    v-if="question.right_answer === ''"
                    class="fas fa-angle-right mr-1"
                  />
                  <i
                    v-else-if="
                      question.right_answer.includes(String(opt_index))
                    "
                    v-tooltip="'Alternativa correta'"
                    class="fas fa-check text-success mr-1"
                  />
                  <i
                    v-else
                    v-tooltip="'Alternativa incorreta'"
                    class="fas fa-times text-danger mr-1"
                  />
                  {{ option.title }}
                </li>
              </ul>
            </div>
            <hr class="mt-3 mb-4" />
          </div>
        </div>
        <div v-else-if="modalView.material.content === 'video'" class="mt-4">
          <iframe
            width="100%"
            height="350"
            :src="`https://www.youtube.com/embed/${getYoutubeVideoId(
              modalView.material.video
            )}`"
            frameborder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; clipboard-write"
            allowfullscreen
          />
        </div>
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
    <modal
      :show.sync="modalConfirmation.show"
      modal-classes="modal-default modal-dialog-centered"
      body-classes="pb-2"
    >
      <h6 id="modal-title-notification" slot="header" class="modal-title">
        Atenção!
      </h6>
      <div ref="modal_sort" class="vld-parent">
        <div class="text-center">
          <i class="fas fa-arrows-alt-v fa-3x mr-3" />
          <i class="fas fa-book fa-3x" />
          <h4 class="heading mt-4">Confirmar alterações</h4>
          <p class="mt-3">
            Você confirma a alteração da
            <span class="font-weight-bold">ordem de exibição</span> dos
            materiais?
          </p>
        </div>
        <base-alert
          v-if="modalConfirmation.error"
          type="danger"
          class="text-center mb-2"
        >
          Ocorreu um erro ao ordenar os materiais. Por favor, tente novamente.
        </base-alert>
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
        <base-button type="white text-success" @click="handleSubmitSort">
          Confirmar alterações
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

import { Draggable, Container } from "vue-smooth-dnd";

import api from "@/services/api";

export default {
  name: "MateriaisSort",
  components: {
    quillEditor,
    Draggable,
    Container,
  },
  data() {
    return {
      materials: {
        sections: [],
        withoutSection: [],
      },
      classe: "",
      modalView: {
        show: false,
        material: "",
      },
      modalConfirmation: {
        show: false,
        error: "",
      },
      contentTypes: {
        video: { title: "Vídeo do YouTube", icon: "fa-play" },
        file: { title: "Arquivo", icon: "fa-file-alt" },
        link: { title: "Link externo", icon: "fa-external-link-alt" },
        text: { title: "Texto", icon: "fa-paragraph" },
        evaluation: { title: "Avaliação", icon: "fa-tasks" },
      },
      questionTypes: [
        {
          type: "radiobox",
          name: "Múltipla escolha",
        },
        { type: "checkbox", name: "Caixas de seleção" },
        { type: "text", name: "Texto" },
      ],
      editorReadOnly: {
        placeholder: "...",
        readOnly: true,
        theme: "bubble",
      },
      draggingMaterial: "",
      draggingCard: {
        section: "",
        index: -1,
        data: {},
      },
      withoutSectionId: -1,
    };
  },
  async mounted() {
    await this.loadMaterials();
  },
  methods: {
    openLink(link) {
      window.open(link, "file-window", "resizable=1,height=750,width=750");
    },
    getAllMaterials() {
      let allMaterials = [];
      if (this.materials.sections) {
        this.materials.sections.forEach((section) => {
          section.material.forEach((material) => {
            allMaterials.push({
              material_id: material.id,
              section_id: material.section_id || null,
              order: material.order,
            });
          });
        });
        return allMaterials;
      }
    },
    setOrder() {
      for (let section of this.materials.sections) {
        let i = 1;
        for (let material of section.material) {
          material.order = i;
          i++;
        }
      }
    },
    async handleOpenModalView(material) {
      if (material.content === "evaluation") {
        this.formatQuestion(material);
      }
      this.modalView.material = material;
      this.modalView.show = true;
    },
    async handleSubmitSort() {
      const loader = this.$loading.show({
        container: this.$refs.modal_sort,
        width: 90,
        height: 90,
        opacity: 0,
      });
      this.modalConfirmation.error = "";
      try {
        let materialsData = {
          materials: [],
        };
        materialsData.materials = this.getAllMaterials();
        const { data } = await api.put(
          `/teacher/classes/${this.$route.params.id}/order`,
          materialsData
        );
        this.tableData = data;
        this.$toasted.success("Materiais ordenados com sucesso!");
        this.modalConfirmation.show = false;
      } catch (e) {
        this.modalConfirmation.error = true;
        this.$toasted.error("Ocorreu um erro ao ordenar os materiais");
      } finally {
        loader.hide();
      }
    },
    async loadMaterials() {
      const loader = this.$loading.show({
        container: this.$refs.materiais_table,
        width: 110,
        height: 110,
        opacity: 0,
      });
      try {
        const { data } = await api.get(
          `/teacher/classes/${this.$route.params.id}/materials`
        );
        this.classe = data.classe;

        this.materials.sections = data.with_section;
        this.withoutSectionId = data.with_section.length;

        const withoutSection = {
          title: "Sem seção",
          material: [],
        };
        this.materials.withoutSection = data.without_section;
        withoutSection.material = data.without_section;
        this.materials.sections.push(withoutSection);
        this.withoutSectionId = this.materials.sections.length - 1;

        this.setOrder();
        loader.hide();
      } catch (e) {
        this.$toasted.error(
          "Ocorreu um erro ao recuperar os materiais da turma"
        );
      }
    },
    truncate(text, stop = 30, clamp = "...") {
      if (!text) return "N/A";
      return text.slice(0, stop) + (stop < text.length ? clamp : "");
    },
    onDrop(section, dropResult) {
      const { removedIndex, addedIndex } = dropResult;
      if (
        section === this.draggingCard.section &&
        removedIndex === addedIndex
      ) {
        return;
      }
      if (removedIndex !== null) {
        this.materials.sections[section].material.splice(removedIndex, 1);
      }
      if (addedIndex !== null) {
        this.materials.sections[section].material.splice(
          addedIndex,
          0,
          this.draggingCard.data
        );
      }
      this.materials.sections.map(function (section) {
        section.material.map(function (m, mIndex) {
          m.section_id = section.id;
          m.order = mIndex + 1;
          return m;
        });
      });
    },
    dragStart(section, dragResult) {
      const { payload, isSource } = dragResult;
      if (isSource) {
        this.draggingCard = {
          section,
          index: payload,
          data: {
            ...this.materials.sections[section].material[payload],
          },
        };
      }
    },
    getChildPayload(index) {
      return index;
    },
    formatQuestion(material) {
      for (const question of material.evaluation) {
        if (question.parsed) continue;
        const contentIndex = this.questionTypes.findIndex(
          (item) => item.type === question.type
        );
        Object.assign(question, {
          type: this.questionTypes[contentIndex].type,
          type_name: this.questionTypes[contentIndex].title,
          parsed: true,
        });
        if (["radiobox", "checkbox"].includes(question.type)) {
          question.options = JSON.parse(question.options);
          if (question.right_answer !== "")
            question.right_answer = question.right_answer.split(",");
        }
      }
    },
    getYoutubeVideoId(url) {
      return getIdFromUrl(url);
    },
  },
};
</script>
<style scoped>
.cursor {
  cursor: pointer;
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

.draggable-item {
  background: #fff;
  color: #8e919b;
  padding: 1.5rem;
  border-bottom: 1px solid #dee2e6;
  border-radius: 10px;
  margin: 0.3rem;
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
