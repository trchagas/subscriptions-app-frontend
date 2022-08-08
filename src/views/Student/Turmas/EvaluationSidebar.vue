<template>
  <nav
    id="sidenav-filters"
    v-click-outside="handleClose"
    class="fixed-right navbar navbar-vertical navbar-expand-xs navbar-light bg-white"
  >
    <div class="row">
      <div class="col-12">
        <i
          class="fas fa-times fa-close p-1 text-primary"
          title="Fechar"
          @click="handleClose()"
        />
      </div>
      <div
        ref="evaluation_container"
        class="col-12 mt-4 text-center vld-parent"
      >
        <i class="fas fa-tasks fa-3x" />
        <h4 class="mt-3">{{ material.title }}</h4>
        <p class="description text-center mb-0">
          {{ material.description }}
        </p>
        <div class="mt-4 text-left">
          <h6 class="heading-small text-muted mb-3">Perguntas</h6>
          <div v-for="question in questions" :key="question.id" class="ml-1">
            <label class="form-control-label d-block">
              {{ question.title }}</label
            >
            <p class="description ml-2">{{ question.description }}</p>
            <base-input v-if="question.type === 'text'">
              <textarea
                v-model="model.answers[question.id]"
                class="form-control"
                placeholder="Escreva sua resposta aqui..."
                rows="2"
                :disabled="!!question.answer"
              />
            </base-input>
            <div v-if="question.type === 'radiobox'">
              <base-input>
                <base-radio
                  v-for="(option, index) in question.options"
                  :key="`question_${question.id}_radiobox_${index}`"
                  v-model="model.answers[question.id]"
                  :name="String(index)"
                  :inline="false"
                  :disabled="!!question.answer"
                  class="mb-2 ml-2"
                >
                  <span class="ml--2"
                    >{{ option.title }}
                    <span
                      v-if="
                        question.answer && question.answer.right_answer !== ''
                      "
                      class="mx-2"
                      ><i
                        v-if="
                          String(question.answer.right_answer) === String(index)
                        "
                        class="fas fa-check text-success"
                      />
                      <i
                        v-else-if="
                          String(model.answers[question.id]) === String(index)
                        "
                        class="fas fa-times text-danger"
                      />
                    </span>
                  </span>
                </base-radio>
              </base-input>
            </div>
            <div v-if="question.type === 'checkbox'">
              <base-input>
                <base-checkbox
                  v-for="(option, index) in question.options"
                  :key="`question_${question.id}_checkbox_${index}`"
                  :inline="false"
                  class="mb-2 ml-2"
                  :checked="
                    model.answers[question.id]
                      ? model.answers[question.id].includes(index)
                      : false
                  "
                  :disabled="!!question.answer"
                  @input="handleCheckboxSelected(question.id, index, $event)"
                >
                  <span class="ml--2"
                    >{{ option.title }}
                    <span
                      v-if="
                        question.answer && question.answer.right_answer !== ''
                      "
                      class="mx-2"
                      ><i
                        v-if="question.answer.right_answer.includes(index)"
                        class="fas fa-check text-success"
                      />
                      <i
                        v-else-if="model.answers[question.id].includes(index)"
                        class="fas fa-times text-danger"
                      />
                    </span>
                  </span>
                </base-checkbox>
              </base-input>
            </div>
            <hr class="my-4" />
          </div>
        </div>
        <div v-if="!hasAnswer" class="text-center">
          <base-button
            type="primary"
            :custom="true"
            :disabled="!isValidModel()"
            @click="handleOpenModalConfirmation"
            >Enviar respostas</base-button
          >
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
          <i class="fa fa-tasks fa-3x" />
          <h4 class="heading mt-4">Confirmar envio</h4>
          <p class="mt-3 mb-0">
            Você realmente deseja enviar sua resposta? Uma vez submetido, sua
            resposta não poderá ser alterada. Certifique-se de ter respondido
            corretamente todas as questões.
          </p>
        </div>
        <base-alert
          v-if="modalConfirmation.error"
          type="danger"
          class="text-center mb-0"
          >{{ modalConfirmation.error }}</base-alert
        >
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
        <base-button
          type="white text-success"
          :disabled="!isValidModel()"
          @click="handleSubmitResponse"
        >
          Confirmar envio
        </base-button>
      </template>
    </modal>
  </nav>
</template>
<script>
import api from "@/services/api";

export default {
  props: {
    material: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      model: {
        answers: {},
      },
      questions: [],
      hasAnswer: false,
      modalConfirmation: {
        show: false,
        error: "",
      },
    };
  },
  watch: {
    material: async function () {
      await this.handleMaterialChanged();
    },
  },
  async mounted() {
    await this.handleMaterialChanged();
  },
  methods: {
    async handleMaterialChanged() {
      const loader = this.$loading.show({
        container: this.$refs.evaluation_container,
        width: 100,
        height: 100,
      });
      try {
        const { data } = await api.get(
          `/student/classes/${this.material.class_id}/answers/${this.material.id}`
        );
        const questions = [];
        this.material.evaluation.forEach((evaluation) => {
          if (
            (typeof evaluation.options === "string" ||
              evaluation.options instanceof String) &&
            ["radiobox", "checkbox"].includes(evaluation.type)
          ) {
            evaluation.options = JSON.parse(evaluation.options);
          }
          const answer = data.find(
            (answer) => answer.evaluation_id === evaluation.id
          );
          if (answer) {
            this.hasAnswer = true;
            answer.rigth_answer = this.getFormattedAnswer(
              answer,
              evaluation.type
            );
            evaluation.answer = answer;
            this.model.answers[answer.evaluation_id] = this.getFormattedAnswer(
              answer,
              evaluation.type
            );
          }
          questions.push(evaluation);
        });
        this.questions = questions;
        loader.hide();
      } catch (e) {
        this.$toasted.error("Ocorreu um erro ao recuperar as informações!");
      }
    },
    handleClose() {
      this.$emit("closeEvaluation");
    },
    handleCheckboxSelected(questionId, checkboxIndex, event) {
      let answer = this.model.answers[questionId] || [];
      if (event) {
        if (!answer.includes(checkboxIndex)) {
          answer.push(checkboxIndex);
        }
      } else {
        answer = answer.filter((idx) => idx !== checkboxIndex);
      }
      this.$set(this.model.answers, questionId, answer);
    },
    handleOpenModalConfirmation() {
      this.modalConfirmation.show = true;
    },
    async handleSubmitResponse() {
      this.modalConfirmation.error = "";
      const loader = this.$loading.show({
        container: this.$refs.modal_confirmation,
        width: 90,
        height: 90,
        opacity: 0,
        color: "white",
      });
      try {
        const { data } = await api.post(
          `/student/classes/${this.material.class_id}/answers/${this.material.id}`,
          { answers: this.model.answers }
        );
        this.material.evaluation.forEach((evaluation) => {
          const answer = data.find(
            (answer) => answer.evaluation_id === evaluation.id
          );
          if (answer) {
            this.hasAnswer = true;
            answer.rigth_answer = this.getFormattedAnswer(
              answer,
              evaluation.type
            );
            evaluation.answer = answer;
          }
        });
        this.$toasted.show("Resposta enviada com sucesso.");
        this.modalConfirmation.show = false;
      } catch (e) {
        const genericError =
          "Ocorreu um erro ao submeter a resposta. Por favor, tente novamente em alguns instantes";
        const hasErrorResponseData = e.response && e.response.data;
        let customError = genericError;
        if (hasErrorResponseData) {
          const data = e.response.data.error
            ? e.response.data.error
            : e.response.data.errors;
          if (data[0] && data[0].message) customError = data[0].message;
          else if (data.message) customError = data.message;
        }
        this.modalConfirmation.error = hasErrorResponseData
          ? customError
          : genericError;
        this.$toasted.error("Ocorreu um erro ao submeter a resposta.");
      }
      loader.hide();
    },
    async setViewed() {
      if (this.material.studentMaterial) return;
      try {
        const { data } = await api.put(
          `/student/classes/${this.material.class_id}/materials/${this.material.id}/set-viewed`
        );
        this.material.studentMaterial = data;
      } catch (e) {
        this.$toasted.error("Progesso não pode ser salvo.");
      }
    },
    getFormattedAnswer(answer, type) {
      if (!answer) return;
      let content = answer.answer;
      if (type === "checkbox") {
        try {
          content = content.split(",").map((option) => parseInt(option));
        } catch (e) {
          content = "";
        }
      }
      return content;
    },
    isValidModel() {
      if (this.questions.length !== Object.keys(this.model.answers).length)
        return false;
      for (const key of Object.keys(this.model.answers)) {
        if (this.model.answers[key] === "" || !this.model.answers[key].length) {
          return false;
        }
      }
      return true;
    },
  },
};
</script>
<style scoped>
.navbar {
  z-index: 1000 !important;
}
.navbar-vertical.navbar-expand-xs {
  width: 100%;
  max-width: 750px !important;
}
.fa-close {
  font-size: 1.5em;
  cursor: pointer;
}
</style>
