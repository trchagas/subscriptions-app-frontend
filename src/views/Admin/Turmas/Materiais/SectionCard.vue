<template>
  <div class="col-xl-12 mb-4">
    <div>
      <div class="card shadow table-container">
        <div class="card-header border-0">
          <div class="row align-items-center">
            <div class="col-12">
              <h3 v-if="!section" class="mb-0">
                Lista de materiais
                <span class="text-warning">sem seção</span>
                <span v-if="material.length" class="float-right">
                  <span class="font-weight-200 mx-2 small">
                    {{ material.length }}
                    {{ material.length === 1 ? "material" : "materiais" }}
                  </span>
                </span>
              </h3>
              <h3 v-else class="mb-0">
                <span class="text-success">{{ section.order }}. </span>
                <span class="text-default">{{ section.title }}</span>
                <span v-if="material.length" class="float-right">
                  <span class="font-weight-200 mx-2 small">
                    {{ material.length }}
                    {{ material.length === 1 ? "material" : "materiais" }}
                  </span>
                </span>
              </h3>
            </div>
          </div>
        </div>
        <div class="table-responsive">
          <base-table
            class="table align-items-center table-flush"
            thead-classes="thead-light"
            tbody-classes="list"
            :data="material"
            type="hover"
          >
            <template slot="columns">
              <th>#</th>
              <th>Status</th>
              <th>Conteúdo</th>
              <th>Título</th>
              <th>Ações</th>
            </template>
            <template slot-scope="{ row, index }">
              <td class="py-4">{{ index + 1 }}</td>
              <td>
                <div>
                  <badge
                    v-if="section && !section.is_visible"
                    v-tooltip="
                      'A seção a qual o material pertence está oculta.'
                    "
                    type="danger"
                  >
                    Seção oculta
                  </badge>
                  <badge
                    v-if="row.is_active"
                    v-tooltip.bottom="
                      'O material está disponível para os alunos que possuem acesso à turma.'
                    "
                    type="success"
                  >
                    Visível
                  </badge>
                  <badge
                    v-else
                    v-tooltip.bottom="'O material está oculto para os alunos.'"
                    type="warning"
                  >
                    Oculto
                  </badge>
                </div>
              </td>
              <td>{{ contentTypes[row.content].name }}</td>
              <td>
                <span :title="row.title">{{ truncate(row.title, 30) }}</span>
              </td>
              <td>
                <base-button
                  v-tooltip.bottom="'Visualizar material'"
                  type="white"
                  size="sm"
                  class="text-primary"
                  @click="handleOpenModalView(row)"
                >
                  <i class="fas fa-eye" />
                </base-button>
              </td>
            </template>
          </base-table>
          <p
            v-if="!section && !material.length"
            class="text-center text-warning mt-3"
          >
            Não há materiais cadastrados sem seção vinculada.
          </p>
          <p v-else-if="!material.length" class="text-center text-warning mt-3">
            Não há materiais cadastrados nesta seção até o momento.
          </p>
        </div>
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
          class="mt-2"
        >
          <base-button
            v-tooltip.bottom="'Ver respostas dos alunos'"
            class="mb-2"
            size="sm"
            type="primary"
            @click="handleOpenAnswers(modalView.material)"
          >
            Ver respostas <i class="fas fa-user-edit ml-2" />
          </base-button>
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
  </div>
</template>
<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { quillEditor } from "vue-quill-editor";

import { getIdFromUrl } from "vue-youtube";

export default {
  name: "MaterialsCard",
  components: {
    quillEditor,
  },
  props: {
    section: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    material: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      contentTypes: {
        video: { name: "Vídeo do YouTube", icon: "fa-play" },
        file: { name: "Arquivo", icon: "fa-file-alt" },
        link: { name: "Link externo", icon: "fa-external-link-alt" },
        text: { name: "Texto", icon: "fa-paragraph" },
        evaluation: { name: "Avaliação", icon: "fa-tasks" },
      },
      modalView: {
        show: false,
        material: "",
      },
      modalRemove: {
        show: false,
        material: "",
        error: "",
      },
      editorReadOnly: {
        placeholder: "...",
        readOnly: true,
        theme: "bubble",
      },
      questionTypes: [
        {
          type: "radiobox",
          name: "Múltipla escolha",
        },
        { type: "checkbox", name: "Caixas de seleção" },
        { type: "text", name: "Texto" },
      ],
    };
  },
  methods: {
    openLink(link) {
      window.open(link, "file-window", "resizable=1,height=750,width=750");
    },
    async handleOpenModalView(material) {
      if (material.content === "evaluation") {
        this.formatQuestion(material);
      }
      this.modalView.material = material;
      this.modalView.show = true;
    },

    truncate(text, stop = 30, clamp = "...") {
      if (!text) return "-";
      return text.slice(0, stop) + (stop < text.length ? clamp : "");
    },
    formatQuestion(material) {
      for (const question of material.evaluation) {
        if (question.parsed) continue;
        const contentIndex = this.questionTypes.findIndex(
          (item) => item.type === question.type
        );
        Object.assign(question, {
          type: this.questionTypes[contentIndex].type,
          type_name: this.questionTypes[contentIndex].name,
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
    handleOpenAnswers(material) {
      if (material.content === "evaluation") {
        this.$router.push(
          `/diretoria/turmas/${material.class_id}/materiais/${material.id}/respostas`
        );
      }
    },
  },
};
</script>
<style scoped></style>
