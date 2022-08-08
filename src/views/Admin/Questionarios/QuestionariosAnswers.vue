<template>
  <div>
    <base-header class="header pb-8 pt-5 pt-lg-8">
      <!-- Header container -->
      <div class="container-fluid">
        <div class="row">
          <div class="col-12 mt-0 mt-md-4 mt-lg-0 d-block">
            <router-link
              :to="'/diretoria/enquetes'"
              class="btn-link font-weight-normal text-white"
              title="Voltar para a listagem de enquetes"
              ><i class="fas fa-chevron-left mr-1" /> Voltar</router-link
            >
          </div>
          <div class="col-lg-7 col-md-10">
            <p class="text-white my-3">
              Aqui você visualizar as respostas dos usuários recebidas na
              enquete. Toda nova resposta aparecerá automaticamente na listagem
              abaixo.
            </p>
          </div>
        </div>
      </div>
    </base-header>

    <div class="container-fluid mt--7">
      <div class="row">
        <div class="col-12">
          <div ref="responses_list" class="card vld-parent shadow">
            <div class="card-header">
              <div class="row align-items-center">
                <div class="col-12">
                  <h3 class="mb-0">
                    <i class="fas fa-tasks mr-1" /> Respostas enquete
                    <span class="text-success">{{ survey.title }}</span>
                    <base-button
                      type="link"
                      size="sm"
                      class="ml-1"
                      @click="
                        $router.push(`/diretoria/enquetes/${survey.id}/editar`)
                      "
                      ><i class="fas fa-eye"
                    /></base-button>
                    <badge type="success" class="float-right bg-white"
                      >{{ countResponses }} respostas ao total</badge
                    >
                  </h3>
                </div>
              </div>
            </div>
            <div class="card-body">
              <div
                v-for="(question, index) in survey.questions"
                :key="'question_' + question.id"
                class="mb-4"
              >
                <card
                  type="white"
                  header-classes="bg-transparent py-3"
                  body-classes="p-0 m-0"
                >
                  <div slot="header" class="row align-items-center">
                    <div class="col-12">
                      <h2 class="mb-0 h4 card-title">
                        <i class="fas fa-angle-right mr-1" /> Pergunta
                        {{ index + 1 }}
                        <badge type="primary" class="float-right"
                          >{{
                            question.answers ? question.answers.length : "0"
                          }}
                          respostas</badge
                        >
                      </h2>
                      <div class="qa-container mb--2">
                        <quill-editor
                          v-model="question.label"
                          :options="editorReadOnly"
                          disabled="disabled"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="table-responsive">
                    <base-table
                      v-if="question.answers && question.answers.length"
                      class="table align-items-center table-flush"
                      thead-classes="thead-light"
                      tbody-classes="list"
                      :data="question.answers"
                      type="hover"
                    >
                      <template slot="columns">
                        <th>Data da reposta</th>
                        <th>Usuário</th>
                        <th>Resposta</th>
                      </template>
                      <template slot-scope="{ row }">
                        <td class="py-4">
                          <span
                            :title="getTitle(row.created_at, row.updated_at)"
                            >{{
                              formatTimestamp(
                                row.created_at,
                                "DD/MM/YYYY [às] HH:mm"
                              )
                            }}</span
                          >
                        </td>
                        <th scope="row">
                          <span v-if="row.is_anonymous">Anônimo</span>
                          <span v-else-if="row.user">
                            {{ row.name }}
                            <router-link
                              v-if="row.user_id"
                              class="ml-1"
                              title="Abrir usuário"
                              :to="`/diretoria/usuarios/${roleObj[row.role]}/${
                                row.user_id
                              }/editar`"
                              ><i class="fas fa-eye"
                            /></router-link>
                          </span>
                          <span v-else>Usuário não encontrado</span>
                        </th>
                        <td>
                          <span
                            v-if="
                              ['checkbox', 'selectbox'].includes(question.type)
                            "
                          >
                            <ul class="my-0 pl-0 description list-unstyled">
                              <li
                                v-for="(answer, index) in row.answer"
                                :key="`answer_${row.id}_opt_${index}`"
                              >
                                <div v-if="question.options[answer]">
                                  <i
                                    v-if="question.type === 'checkbox'"
                                    class="fas fa-angle-right mr-1"
                                  />
                                  {{ question.options[answer] }}
                                </div>
                                <div v-else>Sem resposta</div>
                              </li>
                            </ul></span
                          >
                          <span v-else-if="question.type === 'radiobox'">
                            {{ row.answer }}</span
                          >
                          <span
                            v-else
                            :title="row.answer"
                            class="cursor-pointer"
                            @click="
                              showAnswer(
                                row.answer,
                                question.label,
                                row.is_anonymous ? 'Anônimo' : row.user
                              )
                            "
                            >{{ truncate(row.answer) || "Sem resposta" }}</span
                          >
                        </td></template
                      >
                    </base-table>
                    <p v-else class="text-center text-warning mt-3">
                      Não há respostas para essa pergunta até o momento
                    </p>
                  </div>
                </card>
              </div>
              <p v-if="empty" class="text-center text-warning mb-0">
                A enquete não possui perguntas cadastradas
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <modal
      :show.sync="modalShowAnswer.show"
      modal-classes="modal-dialog-centered"
      body-classes="pb-0"
    >
      <h6 id="modal-title-notification" slot="header" class="modal-title">
        Visualizar resposta
      </h6>
      <div>
        <div class="text-center">
          <i class="fas fa-tasks fa-3x" />
        </div>
        <div class="text-left">
          <p class="mt-4 mb-0">
            <i class="fas fa-angle-right mr-1" /> Pergunta:
          </p>
          <div class="qa-container">
            <quill-editor
              v-model="modalShowAnswer.question"
              :options="editorReadOnly"
              disabled="disabled"
            />
          </div>
          <p class="mt-2 mb-2">
            <i class="fas fa-angle-right mr-1" /> Resposta:
          </p>
          <p class="pl-3">
            {{ modalShowAnswer.answer }}
          </p>
        </div>
        <div v-if="modalShowAnswer.user">
          <p class="text-right mb-0 description">
            <b>Respondido por: </b> {{ modalShowAnswer.user }}
          </p>
        </div>
      </div>
      <template slot="footer">
        <base-button
          type="link"
          text-color="default"
          class="l-auto"
          @click="modalShowAnswer.show = false"
        >
          Fechar
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

import api from "@/services/api.js";

export default {
  components: {
    quillEditor,
  },
  data() {
    return {
      survey: {
        id: "",
        title: "",
        questions: [],
      },
      empty: "",
      countResponses: 0,
      modalShowAnswer: {
        show: false,
        answer: "",
        question: "",
        user: "",
      },
      editorReadOnly: {
        placeholder: "...",
        readOnly: true,
        theme: "bubble",
      },
      roleObj: {
        student: "alunos",
        teacher: "professores",
        volunteer: "voluntarios",
        partner: "parceiros",
        associate: "associados",
      },
    };
  },
  async mounted() {
    const loader = this.$loading.show({
      container: this.$refs.responses_list,
      width: 90,
      height: 90,
    });
    try {
      const { data } = await api.get(
        `/admin/surveys/${this.$route.params.id}/responses`
      );
      if (!data.survey.questions.length) this.empty = true;
      data.survey.questions.forEach((question) => {
        if (question.select_options) {
          const select_options = JSON.parse(question.select_options);
          if (select_options.options && select_options.options.length) {
            question.options = select_options.options;
          }
        }
      });
      this.survey = data.survey;
      this.countResponses = data.responses.length;
      this.formatResponses(data.responses);
      loader.hide();
    } catch (e) {
      this.$toasted.error(
        "Ocorreu um erro ao recuperar as respostas da enquete"
      );
      this.$router.push("/diretoria/enquetes");
    }
  },
  methods: {
    formatResponses(responses) {
      responses.forEach((response) => {
        this.formatAnswers(response);
      });
    },
    formatAnswers(response) {
      if (!response.answers) return;
      response.answers.forEach((responseAnswer) => {
        this.addAnswerInQuestion(
          {
            answer: responseAnswer.answer,
            is_anonymous: response.is_anonymous,
            user_id: response.user_id,
            user: response.user,
            created_at: response.created_at,
            updated_at: response.updated_at,
            name: response.name,
            role: response.role,
          },
          responseAnswer.question_id
        );
      });
    },
    addAnswerInQuestion(answer, questionId) {
      const question = this.survey.questions.find(
        (question) => question.id === questionId
      );
      if (question) {
        if (question.answers)
          question.answers.push(this.getParsedAnswer(answer, question.type));
        else question.answers = [this.getParsedAnswer(answer, question.type)];
      }
    },
    getParsedAnswer(answer, type) {
      if (["selectbox", "checkbox"].includes(type)) {
        try {
          answer.answer = answer.answer
            .split(",")
            .map((option) => parseInt(option));
        } catch (e) {
          answer.answer = ["* Falha ao formatar resposta"];
        }
      } else if (type === "radiobox")
        answer.answer = answer.answer === "true" ? "Sim" : "Não";

      return answer;
    },
    truncate(text, stop = 50, clamp = "...") {
      if (!text) return "N/A";
      return text.slice(0, stop) + (stop < text.length ? clamp : "");
    },
    showAnswer(answer, question, user) {
      this.modalShowAnswer.answer = answer;
      this.modalShowAnswer.question = question;
      if (user) this.modalShowAnswer.user = user.name;
      else this.modalShowAnswer.user = "Usuário não encontrado";
      this.modalShowAnswer.show = true;
    },
    getTitle(created_at, updated_at) {
      return `Resposta enviada em: ${this.formatTimestamp(
        created_at,
        "lll"
      )}. Última atualização em ${this.formatTimestamp(updated_at, "lll")}.`;
    },
  },
};
</script>
<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>

<style>
.qa-container .quill-editor .ql-container,
.qa-container .quill-editor .ql-container .ql-editor {
  width: 100%;
}

p > strong {
  font-weight: bold !important;
}
</style>
