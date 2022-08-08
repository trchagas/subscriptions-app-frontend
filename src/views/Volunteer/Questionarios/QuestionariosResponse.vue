<template>
  <div>
    <base-header class="header pb-8 pt-5 pt-lg-8">
      <!-- Header container -->
      <div class="container-fluid">
        <div class="row">
          <div class="col-12 mt-0 mt-md-4 mt-lg-0 d-block">
            <router-link
              :to="'/voluntario/questionarios'"
              class="btn-link font-weight-normal text-white"
              title="Voltar para listagem de questionários"
              ><i class="fas fa-chevron-left mr-1" /> Voltar</router-link
            >
          </div>
          <div class="col-lg-7 col-md-10">
            <p class="text-white my-3">
              Aqui você pode responder o questionário disponibilizado pela
              diretoria.
            </p>
          </div>
        </div>
      </div>
    </base-header>
    <div class="container-fluid mt--6">
      <div class="row">
        <div class="col-xl-9">
          <div ref="questionario_container" class="card shadow vld-parent">
            <div class="card-header bg-white border-0">
              <div class="row align-items-center">
                <div class="col-12">
                  <h3 class="mb-0">
                    <i class="fas fa-clipboard mr-2" />
                    {{ survey.title || "Questionário" }}
                  </h3>
                </div>
              </div>
            </div>
            <div class="card-body pb-2">
              <div class="row">
                <div class="col-12">
                  <p v-if="survey.description">
                    <i class="far fa-comment-dots mr-1" />
                    {{ survey.description }}
                  </p>
                </div>
              </div>
              <div v-if="success" class="row">
                <div class="col-12 text-center">
                  <base-alert type="success">
                    Resposta enviada com sucesso!
                    <br />
                    <base-button
                      type="primary"
                      class="mt-2"
                      size="sm"
                      @click="$router.push('/voluntario/questionarios')"
                      >Voltar para a listagem de questionários
                    </base-button>
                  </base-alert>
                </div>
              </div>
              <div v-else-if="survey">
                <div class="row">
                  <div class="col-12">
                    <div
                      v-if="survey.allow_anonymous_responses"
                      class="text-center"
                    >
                      <p class="description">
                        <span
                          v-tooltip="
                            'Esse questionário aceita respostas anônimas.'
                          "
                          ><i class="fas fa-user-secret mr-2" /> Esse
                          questionário aceita respostas anônimas </span
                        >. Você deseja enviar sua resposta de forma
                        <badge type="info">anônima</badge>?
                      </p>
                      <base-input class="mb-0">
                        <base-switch
                          :value="model.is_anonymous"
                          @input="isAnonymousChangedHandler($event)"
                        />
                      </base-input>
                      <badge
                        v-if="model.is_anonymous"
                        class="bg-warning text-white mb-2"
                        >Sua resposta será anonimizada.</badge
                      >
                    </div>
                  </div>
                </div>
                <div class="row ml-1 mt-2">
                  <h6 class="heading-small text-muted mb-2">Perguntas</h6>
                </div>
                <div
                  v-for="(question, index) in questions"
                  :key="'question_' + index"
                  class="row ml-lg-2"
                >
                  <div class="qr-container mb--2">
                    <quill-editor
                      v-model="question.label"
                      :options="editorReadOnly"
                      disabled="disabled"
                    />
                  </div>
                  <div v-if="question.type === 'input-text'" class="col-lg-12">
                    <base-input
                      v-model="model.question_answers[question.id]"
                      type="text"
                      placeholder="Digite aqui (resposta textual)"
                    />
                  </div>
                  <div
                    v-else-if="question.type === 'input-tel'"
                    class="col-lg-12"
                  >
                    <base-input
                      v-model="model.question_answers[question.id]"
                      type="tel"
                      placeholder="Digite aqui (resposta numérica)"
                    />
                  </div>
                  <div
                    v-else-if="question.type === 'textarea'"
                    class="col-lg-12"
                  >
                    <base-input>
                      <textarea
                        v-model="model.question_answers[question.id]"
                        rows="2"
                        class="form-control"
                        placeholder="Escreva aqui..."
                      />
                    </base-input>
                  </div>
                  <div
                    v-else-if="question.type === 'checkbox'"
                    class="col-lg-12"
                  >
                    <base-input v-if="question.options.length">
                      <base-checkbox
                        v-for="(type, indexOpt) in question.options"
                        :key="'question_' + index + '_opt_' + indexOpt"
                        :checked="
                          model.question_answers[question.id]
                            ? model.question_answers[question.id].includes(
                              indexOpt
                            )
                            : false
                        "
                        :inline="false"
                        class="mb-1 ml-2"
                        @input="
                          handleCheckboxSelected(question.id, indexOpt, $event)
                        "
                      >
                        <span class="ml--2">{{ type }} </span>
                      </base-checkbox>
                    </base-input>
                    <p v-else>Sem alternativas definidas</p>
                  </div>
                  <div
                    v-else-if="question.type === 'selectbox'"
                    class="col-lg-12"
                  >
                    <base-input v-if="question.options.length">
                      <select
                        v-model="model.question_answers[question.id]"
                        class="form-control"
                      >
                        <option selected disabled value="">
                          Selecione uma opção
                        </option>
                        <option
                          v-for="(type, indexOpt) in question.options"
                          :key="'question_' + index + '_opt_' + indexOpt"
                          :value="indexOpt"
                        >
                          {{ type }}
                        </option>
                      </select>
                    </base-input>
                    <p v-else>Sem alternativas definidas</p>
                  </div>
                  <div
                    v-else-if="question.type == 'radiobox'"
                    class="col-lg-12 mb--2 text-center text-md-left"
                  >
                    <base-input>
                      <base-switch
                        :value="model.question_answers[question.id]"
                        @input="switchChangedHandler($event, question.id)"
                      />
                    </base-input>
                  </div>
                </div>
                <div v-if="empty" class="row">
                  <div class="col-12 text-center mb-4">
                    <badge type="primary"
                      >Nenhuma pergunta específica definida</badge
                    >
                  </div>
                </div>
                <div v-if="survey.response" class="row">
                  <div class="col-12">
                    <p class="description text-right mb-0">
                      <i class="far fa-clock mr-1" /> Resposta enviada em
                      {{ formatTimestamp(survey.response.created_at, "lll") }}.
                      Última atualização em
                      {{ formatTimestamp(survey.response.updated_at, "lll") }}.
                    </p>
                  </div>
                </div>
              </div>

              <div v-if="error" class="row">
                <div class="col-12 text-center mt-3 ml-lg-2">
                  <base-alert type="danger">{{ error }}</base-alert>
                </div>
              </div>
            </div>
            <div
              v-if="!success && survey && questions.length"
              class="card-footer"
            >
              <div class="row">
                <div class="col-12 text-center">
                  <span
                    v-tooltip="
                      isValidModel
                        ? 'Clique para enviar a resposta'
                        : 'Responda as perguntas antes de prosseguir'
                    "
                  >
                    <base-button
                      type="seagreen"
                      :disabled="!isValidModel"
                      @click="handleSubmit()"
                      >{{ survey.response ? "Atualizar" : "Enviar" }} resposta
                    </base-button>
                  </span>
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

import api from "@/services/api.js";

export default {
  components: {
    quillEditor,
  },
  data() {
    return {
      model: {
        is_anonymous: false,

        question_answers: {},
      },
      survey: "",
      questions: {},
      empty: "",
      error: "",
      success: "",
      editorReadOnly: {
        placeholder: "...",
        readOnly: true,
        theme: "bubble",
      },
    };
  },
  computed: {
    isValidModel() {
      for (const [questionId, answer] of Object.entries(
        this.model.question_answers
      )) {
        if (answer === "") {
          const question = this.questions.find(
            (question) => question.id === Number(questionId)
          );
          if (question) {
            if (
              ["input-text", "input-tel", "textarea"].includes(question.type)
            ) {
              return false;
            }
          }
        }
      }
      return true;
    },
  },
  async mounted() {
    const loader = this.$loading.show({
      container: this.$refs.questionario_container,
      width: 90,
      height: 90,
    });
    try {
      await this.loadSurvey();
    } catch (e) {
      const genericError =
        "Ocorreu um erro ao recuperar as informações do questionário";
      const hasErrorResponseData = e.response && e.response.data;
      let customError = genericError;
      if (hasErrorResponseData) {
        const data = e.response.data;
        if (data[0] && data[0].message) customError = data[0].message;
        else if (data.message) customError = data.message;
      }
      this.error = hasErrorResponseData ? customError : genericError;
      this.$toasted.error(genericError);
      this.survey = "";
    } finally {
      loader.hide();
    }
  },
  methods: {
    async loadSurvey() {
      const { data } = await api.get(
        `/volunteer/surveys/${this.$route.params.id}`
      );
      this.survey = data.survey;
      if (data.survey.response) {
        this.model.is_anonymous = Boolean(data.survey.response.is_anonymous);
      }
      const answers = data.survey.response ? data.survey.response.answers : [];
      if (data.questions.length) {
        data.questions.forEach((question) => {
          if (["selectbox", "checkbox"].includes(question.type)) {
            if (question.select_options) {
              const select_options = JSON.parse(question.select_options);
              if (select_options.options && select_options.options.length) {
                question.options = select_options.options;
              }
            }
          }
          let questionAnswer = question.type === "radiobox" ? false : "";

          const answer = answers.find(
            (answer) => answer.question_id === question.id
          );
          if (answer) {
            questionAnswer = this.getFormattedAnswer(answer, question.type);
          }

          this.$set(this.model.question_answers, question.id, questionAnswer);
        });
        this.questions = data.questions;
      } else this.empty = true;
    },
    async handleSubmit() {
      this.error = "";
      const loader = this.$loading.show({
        container: this.$refs.questionario_container,
        width: 90,
        height: 90,
      });
      try {
        const model = this.model;
        const formattedAnswers = [];
        Object.keys(model.question_answers).forEach((key) => {
          formattedAnswers.push({
            question_id: key,
            answer: model.question_answers[key],
          });
        });

        if (!this.survey.response) {
          await api.post(`/volunteer/surveys/${this.survey.id}`, {
            answers: formattedAnswers,
            is_anonymous: model.is_anonymous,
          });
        } else {
          await api.put(
            `/volunteer/surveys/${this.survey.id}/responses/${this.survey.response.id}`,
            {
              answers: formattedAnswers,
              is_anonymous: model.is_anonymous,
            }
          );
        }

        this.$toasted.show("Questionário respondido com sucesso");
        this.success = true;
      } catch (e) {
        const genericError =
          "Ocorreu um erro ao salvar as informações. Por favor, tente novamente em alguns instantes.";
        const hasErrorResponseData = e.response && e.response.data;
        let customError = genericError;
        if (hasErrorResponseData) {
          const data = e.response.data;
          if (data[0] && data[0].message) customError = data[0].message;
          else if (data.message) customError = data.message;
        }
        this.error = hasErrorResponseData ? customError : genericError;
        this.$toasted.error("Ocorreu um erro ao salvar as informações");
      }
      loader.hide();
    },
    switchChangedHandler(event, index) {
      if (typeof event === "boolean")
        this.model.question_answers[index] = event;
    },
    isAnonymousChangedHandler(event) {
      if (typeof event === "boolean") this.model.is_anonymous = event;
    },
    handleCheckboxSelected(questionId, checkboxIndex, event) {
      let answer = this.model.question_answers[questionId] || [];
      if (event) {
        if (!answer.includes(checkboxIndex)) {
          answer.push(checkboxIndex);
        }
      } else {
        answer = answer.filter((idx) => idx !== checkboxIndex);
      }
      this.$set(this.model.question_answers, questionId, answer);
    },
    getFormattedAnswer(answer, type) {
      if (!answer) return "";
      if (type === "radiobox") return answer.answer === "true";
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
  },
};
</script>
<style scoped>
.text-seagreen {
  color: #248352;
}
</style>
<style>
.qr-container .quill-editor .ql-container,
.qr-container .quill-editor .ql-container .ql-editor {
  width: 100%;
}

p > strong {
  font-weight: bold !important;
}
</style>
