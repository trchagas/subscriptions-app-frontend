<template>
  <div>
    <base-header class="header pb-8 pt-5 pt-lg-8 d-flex align-items-center">
      <!-- Mask -->
      <span class="mask opacity-8" />
      <!-- Header container -->
      <div class="container-fluid d-flex align-items-center">
        <div class="row">
          <div class="col-12 mt-0 mt-md-4 mt-lg-0 d-block">
            <router-link
              :to="`/professor/turmas/${class_id}/materiais`"
              class="btn-link font-weight-normal text-white"
              title="Voltar para a listagem de materiais do curso"
            >
              <i class="fas fa-chevron-left mr-1" /> Voltar
            </router-link>
          </div>
          <div class="col-lg-7 col-md-10">
            <p class="text-white mt-4 mb-2">
              Aqui é possível visualizar as respostas a avaliação do curso
              <b>{{ classe.title }} </b>. Toda nova resposta enviada por um
              aluno será exibida na listagem abaixo.
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
                ref="turma_image"
                class="card card-profile shadow vld-parent border-0"
              >
                <div class="card-image">
                  <img
                    class="card-img-top"
                    :src="classe.background_url || placeholderImg"
                    alt="Imagem curso"
                  />
                  <div class="image-overlay" />
                </div>

                <div class="card-body">
                  <h2 class="card-title mb-1">{{ classe.title }}</h2>
                  <p class="description mb-0">{{ classe.description }}</p>
                  <p v-if="!classe.is_visible" class="mt-2 mb-0">
                    <badge v-tooltip="'A turma está oculto'" type="warning">
                      Oculto
                    </badge>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-xl-8">
          <div
            ref="answers_table"
            class="card shadow table-container vld-parent"
          >
            <div class="card-header">
              <div class="row align-items-center">
                <div class="col">
                  <h3 class="mb-0">
                    <i class="fas fa-tasks mr-2" /> Respostas da tarefa
                    <span class="text-primary">
                      {{ material.title }}
                    </span>
                  </h3>
                </div>
              </div>
            </div>
            <div class="card-body">
              <div class="mb-3">
                <i>{{ material.description }}</i>
              </div>
              <div v-if="empty">
                <p class="text-center text-warning mt-3">
                  Não há perguntas definidas na avaliação.
                </p>
              </div>
              <div v-else>
                <div v-for="(question, q_index) in questions" :key="q_index">
                  <h4>Questão {{ q_index + 1 }} - {{ question.title }}</h4>
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
                      <span class="font-weight-bold">
                        <span>Alternativas:</span>
                        <span
                          v-if="question.right_answer !== ''"
                          class="text-success ml-1"
                        >
                          ({{ question.right_answer.length }}
                          {{
                            question.right_answer.length > 1
                              ? "respostas corretas"
                              : "resposta correta"
                          }})
                        </span>
                      </span>
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
                  <div class="card table-container">
                    <div class="card-header border-0 py-3">
                      <div class="row align-items-center">
                        <div class="col-12">
                          <h4 class="my-0">
                            Respostas
                            <badge
                              v-if="question.answers.length"
                              class="float-right"
                              type="primary"
                            >
                              <b>{{ question.answers.length }}</b>
                              {{
                                question.answers.length === 1
                                  ? "resposta recebida"
                                  : "respostas recebidas"
                              }}
                            </badge>
                          </h4>
                        </div>
                      </div>
                    </div>
                    <div class="table-responsive">
                      <base-table
                        class="table align-items-center table-flush"
                        thead-classes="thead-light"
                        tbody-classes="list"
                        :data="question.answers"
                        type="hover"
                      >
                        <template slot="columns">
                          <th>#</th>
                          <th>Data</th>
                          <th>Aluno</th>
                          <th>Resposta</th>
                        </template>
                        <template slot-scope="{ row, index }">
                          <td>{{ index + 1 }}</td>
                          <td>{{ formatTimestamp(row.created_at) }}</td>
                          <td>
                            {{ row.student.name }}
                            <router-link
                              class="ml-1"
                              title="Abrir aluno"
                              :to="`/professor/usuarios/${row.student.user_id}/visualizar`"
                            >
                              <i class="fas fa-eye" />
                            </router-link>
                          </td>
                          <td>
                            <div v-if="!row.answer">Sem resposta</div>
                            <div v-else-if="question.type === 'text'">
                              {{ row.answer }}
                            </div>
                            <div v-else>
                              <ul class="my-0 pl-0 description list-unstyled">
                                <li
                                  v-for="(answer, a_index) in row.answer"
                                  :key="`answer_${row.id}_opt_${a_index}`"
                                >
                                  <div v-if="question.options[answer]">
                                    <i
                                      v-if="question.right_answer === ''"
                                      class="fas fa-angle-right mr-1"
                                    />
                                    <i
                                      v-else-if="
                                        question.right_answer.includes(
                                          String(answer)
                                        )
                                      "
                                      v-tooltip="'Alternativa correta'"
                                      class="fas fa-check text-success mr-1"
                                    />
                                    <i
                                      v-else
                                      v-tooltip="'Alternativa incorreta'"
                                      class="fas fa-times text-danger mr-1"
                                    />
                                    {{ question.options[answer].title }}
                                  </div>
                                  <div v-else>Resposta indefinida</div>
                                </li>
                              </ul>
                            </div>
                          </td>
                        </template>
                      </base-table>
                      <p
                        v-if="!question.answers.length"
                        class="text-center text-warning mt-3"
                      >
                        Não há respostas recebidas para essa questão.
                      </p>
                    </div>
                  </div>
                  <hr class="mt-3 mb-4" />
                </div>
                <div class="text-muted text-right">
                  <b>{{ questions.length }}</b> questões ao total
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
import api from "@/services/api.js";

export default {
  data() {
    return {
      class_id: "",
      material_id: "",
      classe: "",
      placeholderImg: "/img/pages/default_banner_course.jpg",
      questions: [],
      material: {},
      questionTypes: [
        {
          type: "radiobox",
          name: "Múltipla escolha",
        },
        { type: "checkbox", name: "Caixas de seleção" },
        { type: "text", name: "Texto" },
      ],
      empty: false,
    };
  },
  async mounted() {
    this.class_id = this.$route.params.class_id;
    this.material_id = this.$route.params.id;
    this.loadClasse();
    this.loadAnswers();
  },
  methods: {
    async loadClasse() {
      const loader = this.$loading.show({
        container: this.$refs.turma_image,
        width: 90,
        height: 90,
      });
      try {
        const { data } = await api.get(`/teacher/classes/${this.class_id}`);
        this.classe = data;
      } catch (e) {
        this.$toasted.error(
          "Ocorreu um erro ao recuperar as informações da turma"
        );
        this.$router.push(`/professor/turmas/${this.class_id}/materiais`);
      }
      loader.hide();
    },
    async loadAnswers() {
      const loader = this.$loading.show({
        container: this.$refs.answers_table,
        width: 90,
        height: 90,
      });
      try {
        const {
          data: { questions, material },
        } = await api.get(
          `/teacher/classes/${this.class_id}/materials/${this.material_id}/answers`
        );
        if (!questions.length) {
          this.empty = true;
          return;
        }
        this.questions = questions.map(this.formatQuestion);
        this.material = material;
      } catch (e) {
        this.$toasted.error(
          "Ocorreu um erro ao recuperar as respostas da avaliação"
        );
        this.$router.push(`/empresa/trilha/cursos/${this.class_id}/materiais`);
      }
      loader.hide();
    },
    formatQuestion(question) {
      if (question.parsed) return question;
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
        if (question.answers.length)
          question.answers = question.answers.map(this.getParsedAnswer);
      }
      return question;
    },
    getParsedAnswer(answer) {
      try {
        answer.answer = answer.answer
          .split(",")
          .map((option) => parseInt(option));
      } catch (e) {
        answer.answer = ["* Falha ao formatar resposta"];
      }
      return answer;
    },
  },
};
</script>
<style scoped>
.table-container {
  min-height: 150px;
}
.cursor-pointer {
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
</style>
