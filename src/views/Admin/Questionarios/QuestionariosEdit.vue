<template>
  <div>
    <base-header class="header pb-8 pt-5 pt-lg-8">
      <!-- Header container -->
      <div class="container-fluid">
        <div class="row">
          <div class="col-12 mt-0 mt-md-4 mt-lg-0 d-block">
            <router-link
              :to="'/diretoria/questionarios'"
              class="btn-link font-weight-normal text-white"
              title="Voltar para a listagem de questionarios"
            >
              <i class="fas fa-chevron-left mr-1" /> Voltar
            </router-link>
          </div>
          <div class="col-lg-7 col-md-10">
            <p class="text-white my-3">
              Aqui você pode gerênciar e atualizar as informações do
              questionário ou pesquisa de opinião. Lembre-se de ficar atento a
              modificações que podem comprometer a visualização de possíveis
              respostas para as perguntas.
            </p>
          </div>
        </div>
      </div>
    </base-header>

    <div class="container-fluid mt--7">
      <div class="row">
        <div class="col-xl-9">
          <card shadow>
            <div slot="header" class="bg-white border-0">
              <div class="row align-items-center">
                <div class="col-12">
                  <h3 class="mb-0">
                    <i class="fas fa-list-alt mr-2" /> Editar enquete
                    <base-button
                      size="sm"
                      type="danger"
                      class="float-right"
                      @click="handleOpenModalRemove()"
                    >
                      <i class="fas fa-trash mr-1" /> Deletar enquete
                    </base-button>
                  </h3>
                </div>
              </div>
            </div>
            <div ref="form_container" class="vld-parent">
              <div class="row ml-1">
                <h6 class="heading-small text-muted mb-4">
                  Informações básicas
                </h6>
              </div>
              <div class="row ml-lg-2">
                <div class="col-lg-6">
                  <base-input
                    v-model="model.title"
                    label="Título do questionário*"
                    placeholder="Digite o título"
                  />
                </div>
                <div class="col-lg-6">
                  <label class="form-control-label d-block mb-3">
                    Enquete ativa?
                    <i
                      v-tooltip="
                        'Questionários <b>ativos</b> são exibidos para os usuários se as <b>datas de ínicio e fim</b> forem respeitadas.'
                      "
                      class="fas fa-info-circle ml-1"
                    />
                  </label>
                  <base-input>
                    <base-switch
                      :value="model.is_active"
                      @input="switchChangedHandler($event, 'is_active')"
                    />
                  </base-input>
                </div>

                <div class="col-lg-6">
                  <label class="form-control-label d-block mb-3">
                    Resposta única
                    <i
                      v-tooltip="
                        'Questionários com <b>resposta única</b> permitem apenas <b>uma resposta por colaborador</b>, que pode ser atualizada por ele até a data de fim do questionário.. Você pode alterar essa configuração mais tarde.'
                      "
                      class="fas fa-info-circle ml-1"
                    />
                  </label>
                  <base-input>
                    <base-switch
                      :value="model.is_response_restricted"
                      @input="
                        switchChangedHandler($event, 'is_response_restricted')
                      "
                    />
                  </base-input>
                </div>
                <div class="col-lg-6">
                  <label class="form-control-label d-block mb-3">
                    Aceita respostas anônimas?
                    <i
                      v-tooltip="
                        'Se selecionado, o colaborador poderá optar por ocultar os <b>dados de identificação</b> ao responder o questionário. Essa opção <b>não</b> pode ser alterada.'
                      "
                      class="fas fa-info-circle ml-1"
                    />
                  </label>
                  <p class="pb-4">
                    {{ model.allow_anonymous_responses ? "Sim" : "Não" }}
                  </p>
                </div>
                <div class="col-lg-6">
                  <label class="form-control-label d-block">
                    Data de ínicio*
                    <base-button
                      size="sm"
                      type="link"
                      class="p-0 m-0 ml-2 float-right"
                      @click="setCurrentDate()"
                    >
                      Usar data atual
                    </base-button>
                  </label>
                  <base-input
                    v-model="model.start_date"
                    addon-left-icon="fas fa-calendar"
                    type="date"
                  />
                </div>
                <div class="col-lg-6">
                  <label class="form-control-label d-block">Data final</label>
                  <base-input
                    v-model="model.end_date"
                    addon-left-icon="fas fa-calendar"
                    type="date"
                  />
                </div>
                <div class="col-lg-12">
                  <base-input label="Descrição do questionário">
                    <textarea
                      v-model="model.description"
                      rows="2"
                      class="form-control"
                      placeholder="Descreva aqui o questionário"
                    />
                  </base-input>
                </div>
              </div>
              <hr class="mt-2 mb-4" />
              <div class="row ml-1">
                <h6 class="heading-small text-muted mb-4">
                  Permissões de acesso
                </h6>
              </div>
              <div class="row pl-lg-4">
                <div class="col-lg-4">
                  <div class="d-flex flex-row">
                    <model-select
                      v-model="professor"
                      placeholder="Professores"
                      class="participants_select w-100"
                      :is-disabled="model.teacher"
                      :options="professores"
                    />
                    <div class="d-flex align-items-center ml-1">
                      <base-checkbox
                        v-model="model.teacher"
                        class="p-0 ml-5 mr--4"
                        name="professor"
                      />
                    </div>
                  </div>
                </div>
                <div class="col-lg-4">
                  <div class="d-flex flex-row">
                    <model-select
                      v-model="parceiro"
                      placeholder="Parceiros"
                      class="participants_select w-100"
                      :is-disabled="model.partner"
                      :options="parceiros"
                    />
                    <div class="d-flex align-items-center ml-1">
                      <base-checkbox
                        v-model="model.partner"
                        class="p-0 ml-5 mr--4"
                        name="parceiro"
                      />
                    </div>
                  </div>
                </div>
                <div class="col-lg-4">
                  <div class="d-flex flex-row">
                    <model-select
                      v-model="associado"
                      placeholder="Associados"
                      class="participants_select w-100"
                      :is-disabled="model.associate"
                      :options="associados"
                    />
                    <div class="d-flex align-items-center ml-1">
                      <base-checkbox
                        v-model="model.associate"
                        class="p-0 ml-5 mr--4"
                        name="associado"
                      />
                    </div>
                  </div>
                </div>
                <div class="col-lg-4">
                  <div class="d-flex flex-row">
                    <model-select
                      v-model="voluntario"
                      placeholder="Voluntarios"
                      class="participants_select w-100"
                      :is-disabled="model.volunteer"
                      :options="voluntarios"
                    />
                    <div class="d-flex align-items-center ml-1">
                      <base-checkbox
                        v-model="model.volunteer"
                        class="p-0 ml-5 mr--4"
                        name="voluntario"
                      />
                    </div>
                  </div>
                </div>
                <div class="col-lg-4 mt-4">
                  <div class="d-flex flex-row">
                    <model-select
                      v-model="aluno"
                      placeholder="Alunos"
                      class="participants_select w-100"
                      :is-disabled="model.student"
                      :options="alunos"
                    />
                    <div class="d-flex align-items-center ml-1">
                      <base-checkbox
                        v-model="model.student"
                        class="p-0 ml-5 mr--4"
                        name="aluno"
                      />
                    </div>
                  </div>
                </div>
                <div class="col-lg-12 mt-4 mb-4">
                  <label class="form-control-label">
                    Usuários com permissão de acesso
                  </label>
                  <div
                    class="ui fluid dropdown selection multiple participants"
                  >
                    <a v-if="!participantes.length" class="text default">
                      Lista de participantes
                    </a>
                    <a
                      v-for="(participante, idx) in participantes"
                      :key="participante.value"
                      class="ui label transition visible"
                    >
                      {{ participante.text }}
                      <i class="delete icon" @click="delParticipante(idx)" />
                    </a>
                  </div>
                </div>
              </div>
              <hr class="mt-0 mb-4" />
              <div class="row ml-1">
                <h6 class="heading-small text-muted mb-0">
                  Perguntas do questionário
                </h6>
              </div>
              <div
                v-for="(question, index) in model.questions"
                :key="'question_' + index"
                class="ml-lg-2"
              >
                <div class="row mb--2 d-flex justify-content-between p-3">
                  <h3 class="pt-2">Pergunta {{ index + 1 }}</h3>
                  <base-button
                    type="link"
                    class="text-danger"
                    :icon-only="true"
                    icon="fas fa-times"
                    @click="handleRemoveQuestion(index)"
                  />
                </div>
                <div class="row">
                  <div class="col-lg-6 qe-container mb-2 mb-lg-0">
                    <label class="form-control-label d-block">
                      Título da pergunta
                    </label>
                    <quill-editor
                      v-model="question.label"
                      class="border rounded ml--1"
                      :options="editorReadOnly"
                      disabled="disabled"
                    />
                  </div>
                  <div class="col-lg-6">
                    <label class="form-control-label">Tipo da pergunta</label>
                    <p>{{ getQuestionType(question.type) }}</p>
                  </div>
                  <div
                    v-if="['selectbox', 'checkbox'].includes(question.type)"
                    class="col-lg-12"
                  >
                    <label class="form-control-label">Opções</label>
                    <ul
                      v-if="question.options && question.options.length"
                      class="ml-3 description list-unstyled"
                    >
                      <li
                        v-for="(option, o_idx) in question.options"
                        :key="`q_${question.id}_op_${o_idx}`"
                      >
                        <i class="fas fa-angle-right mr-1" /> {{ option }}
                      </li>
                    </ul>
                    <p v-else>N/A</p>
                  </div>
                </div>
              </div>
              <hr v-if="model.questions_to_add.length" class="mt-4 mb-3" />
              <div
                v-for="(question, index) in model.questions_to_add"
                :key="'new_question_' + index"
              >
                <div class="row mb--2 d-flex justify-content-between p-3">
                  <h3 class="pt-2">Nova pergunta {{ index + 1 }}</h3>
                  <base-button
                    type="link"
                    class="text-danger"
                    :icon-only="true"
                    icon="fas fa-times"
                    @click="handleRemoveNewQuestion(index)"
                  />
                </div>

                <div class="row">
                  <div class="col-lg-6 qe-container mb-2 mb-lg-0">
                    <quill-editor
                      v-model="question.label"
                      :options="editorEdittable"
                    />
                  </div>
                  <div class="col-lg-6">
                    <label class="form-control-label">Tipo da pergunta</label>
                    <div>
                      <base-input>
                        <select v-model="question.type" class="form-control">
                          <option selected disabled value>
                            Selecione o tipo da pergunta
                          </option>
                          <option
                            v-for="type in questionTypes"
                            :key="'type_' + type.key"
                            :value="type.key"
                          >
                            {{ type.value }}
                          </option>
                        </select>
                      </base-input>
                    </div>
                  </div>
                  <div
                    v-if="['selectbox', 'checkbox'].includes(question.type)"
                    class="col-lg-12"
                  >
                    <div
                      v-for="(option, indexOption) in question.select_options"
                      :key="'option_' + indexOption"
                    >
                      <label class="form-control-label d-block">
                        <i class="fas fa-check-square mr-1" />
                        Opção {{ indexOption + 1 }}
                        <base-button
                          type="link"
                          class="text-danger float-right"
                          :icon-only="true"
                          icon="fas fa-times"
                          @click="handleRemoveSelectOption(index, indexOption)"
                        />
                      </label>
                      <base-input
                        v-model="option.option"
                        placeholder="Digite a opção"
                      />
                    </div>
                    <base-button
                      size="sm"
                      :custom="true"
                      @click="handleAddNewOption(index)"
                    >
                      Adicionar opção
                    </base-button>
                  </div>
                </div>
              </div>
              <div class="pt-2 text-right">
                <base-button
                  type="primary"
                  size="sm"
                  :custom="true"
                  @click="handleAddNewQuestion"
                >
                  <i class="fas fa-plus mr-1" /> Adicionar pergunta
                </base-button>
              </div>
              <hr class="mt-5 mb-3" />
              <div class="row">
                <div v-if="error" class="col-12 text-center mt-3">
                  <base-alert type="danger">{{ error }}</base-alert>
                </div>
                <div class="col-12 text-center mt-3">
                  <span
                    v-tooltip="
                      isValidModel
                        ? 'Clique para atualizar o questionário'
                        : 'Preencha os <b>campos obrigatórios</b> (<b>*</b>) para continuar'
                    "
                  >
                    <base-button
                      type="primary"
                      :disabled="!isValidModel"
                      :custom="true"
                      @click="handleSubmit()"
                    >
                      Salvar alterações
                    </base-button>
                  </span>
                </div>
              </div>
            </div>
          </card>
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
        <div class="pb-3 pt-0 text-center">
          <i class="fa fa-exclamation-circle fa-3x" />
          <h4 class="heading mt-4">
            Você realmente deseja
            <span class="text-danger">excluir o questionário</span>?
          </h4>
          <p class="mt-3 mb-0">
            Ao confirmar, o questionário
            <span class="font-weight-bold">{{ modalRemove.surveyTitle }}</span>
            e todas as possíveis respostas submetidas a ela serão removidas.
          </p>
        </div>
        <div v-if="modalRemove.error" class="col-12 text-center mt-3">
          <base-alert type="danger">
            Ocorreu um erro ao remover o questionário. Tente novamente.
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
        <base-button
          type="white"
          class="text-danger"
          @click="handleRemoveSurvey()"
        >
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
import "vue-select/dist/vue-select.css";

import { quillEditor } from "vue-quill-editor";
import { ModelSelect } from "vue-search-select";
import "vue-search-select/dist/VueSearchSelect.css";

import api from "@/services/api.js";

export default {
  components: {
    ModelSelect,
    quillEditor,
  },
  data() {
    return {
      participantes: [],
      professores: [],
      parceiros: [],
      voluntarios: [],
      associados: [],
      alunos: [],
      professor: "",
      associado: "",
      parceiro: "",
      voluntario: "",
      aluno: "",
      model: {
        id: "",
        teacher: false,
        partner: false,
        associate: false,
        volunteer: false,
        student: false,
        title: "",
        is_active: false,
        is_response_restricted: false,
        allow_anonymous_responses: false,
        description: "",
        start_date: "",
        end_date: "",
        questions: [],
        questions_to_add: [],
        questions_to_remove: [],
        is_public: false,
        categories_ids: [],
      },
      selectedCategories: [],
      categorias: [],
      filterByCategory: (option, search) => {
        const temp = search.toLowerCase();
        let match = false;
        return option.title.toLowerCase().indexOf(temp) > -1 || match;
      },
      questionTypes: [
        { key: "input-text", value: "Textual" },
        { key: "input-tel", value: "Numérica" },
        { key: "textarea", value: "Resposta descritiva" },
        { key: "checkbox", value: "Caixas de seleção (respostas múltiplas)" },
        { key: "selectbox", value: "Múltipla escolha (resposta única)" },
        { key: "radiobox", value: "Caixa de marcação (sim/não)" },
      ],
      error: "",
      modalRemove: {
        show: false,
        error: "",
        surveyTitle: "",
      },
      editorEdittable: {
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"],
            ["blockquote", "code-block"],
            ["link", "image", "video"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ indent: "-1" }, { indent: "+1" }],
            [{ size: ["small", false, "large", "huge"] }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ color: [] }, { background: [] }],
            [{ align: [] }],
          ],
        },
        placeholder: "Digite o título da pergunta",
      },
      editorReadOnly: {
        placeholder: "...",
        readOnly: true,
        theme: "bubble",
      },
    };
  },
  computed: {
    isValidModel() {
      return this.model.title && this.model.start_date;
    },
  },
  watch: {
    professor() {
      if (!this.professor) return;

      const newTeacher = this.professores.find(
        (p) => p.value === this.professor
      );
      this.participantes = [...this.participantes, newTeacher];
      this.professores = this.professores.filter(
        (p) => p.value !== newTeacher.value
      );
      this.professor = null;
    },
    parceiro() {
      if (!this.parceiro) return;

      const newTeacher = this.parceiros.find((p) => p.value === this.parceiro);
      this.participantes = [...this.participantes, newTeacher];
      this.parceiros = this.parceiros.filter(
        (p) => p.value !== newTeacher.value
      );
      this.parceiro = null;
    },
    voluntario() {
      if (!this.voluntario) return;

      const newTeacher = this.voluntarios.find(
        (p) => p.value === this.voluntario
      );
      this.participantes = [...this.participantes, newTeacher];
      this.voluntarios = this.voluntarios.filter(
        (p) => p.value !== newTeacher.value
      );
      this.voluntario = null;
    },
    aluno() {
      if (!this.aluno) return;

      const newTeacher = this.alunos.find((p) => p.value === this.aluno);
      this.participantes = [...this.participantes, newTeacher];
      this.alunos = this.alunos.filter((p) => p.value !== newTeacher.value);
      this.aluno = null;
    },
  },
  async mounted() {
    const loader = this.$loading.show({
      container: this.$refs.form_container,
      width: 90,
      height: 90,
    });
    try {
      this.model.id = this.$route.params.id;
      const { data: users } = await api.get("/admin/surveys/users");
      const { data } = await api.get(`/admin/surveys/${this.$route.params.id}`);

      data.survey.student = Boolean(data.survey.student);
      data.survey.teacher = Boolean(data.survey.teacher);
      data.survey.volunteer = Boolean(data.survey.volunteer);
      data.survey.partner = Boolean(data.survey.partner);
      data.survey.associate = Boolean(data.survey.associate);

      const survey = this.model;
      survey.title = this.modalRemove.surveyTitle = data.survey.title;
      survey.is_active = Boolean(data.survey.is_active);
      survey.is_response_restricted = Boolean(
        data.survey.is_response_restricted
      );
      survey.allow_anonymous_responses = Boolean(
        data.survey.allow_anonymous_responses
      );
      survey.is_public = Boolean(data.survey.is_public);
      survey.description = data.survey.description || "";
      // survey.start_date = this.moment(data.survey.start_date).format(
      //   "YYYY-MM-DD"
      // );
      // survey.end_date = data.survey.end_date
      //   ? this.moment(data.survey.end_date).format("YYYY-MM-DD")
      //   : "";
      data.survey.questions.forEach((question) => {
        if (question.select_options) {
          const select_options = JSON.parse(question.select_options);
          if (select_options.options && select_options.options.length) {
            question.options = select_options.options;
          }
        }
        survey.questions.push(question);
      });
      this.model = {
        ...data.survey,
        questions_to_add: [],
        questions_to_remove: [],
        start_date: this.moment(data.survey.start_date).format("YYYY-MM-DD"),
        end_date: data.survey.end_date
          ? this.moment(data.survey.end_date).format("YYYY-MM-DD")
          : "",
      };

      this.participantes = [
        ...data.teachers.map((t) => ({
          value: t.user_id,
          text: t.name,
          type: "teacher",
        })),
        ...data.volunteers.map((t) => ({
          value: t.user_id,
          text: t.name,
          type: "volunteer",
        })),
        ...data.partners.map((t) => ({
          value: t.user_id,
          text: t.name,
          type: "partner",
        })),
        ...data.associates.map((t) => ({
          value: t.user_id,
          text: t.name,
          type: "associate",
        })),
        ...data.students.map((t) => ({
          value: t.user_id,
          text: t.name,
          type: "student",
        })),
      ];

      this.professores = users.teachers.map((t) => ({
        value: t.user_id,
        text: t.name,
        type: "teacher",
      }));
      this.voluntarios = users.volunteers.map((t) => ({
        value: t.user_id,
        text: t.name,
        type: "volunteer",
      }));
      this.parceiros = users.partners.map((t) => ({
        value: t.user_id,
        text: t.name,
        type: "partner",
      }));
      this.associados = users.associates.map((t) => ({
        value: t.user_id,
        text: t.name,
        type: "associate",
      }));
      this.alunos = users.students.map((t) => ({
        value: t.user_id,
        text: t.name,
        type: "student",
      }));

      loader.hide();
    } catch (e) {
      this.$toasted.error(
        "Ocorreu um erro ao recuperar as informações do questionário"
      );
    }
  },
  methods: {
    delParticipante(index) {
      const mapPart = {
        teacher: "professores",
        partner: "parceiros",
        associate: "associados",
        volunteer: "voluntarios",
        student: "alunos",
      };

      const [newParticipante] = this.participantes.splice(index, 1);
      this[mapPart[newParticipante.type]] = [
        ...this[mapPart[newParticipante.type]],
        newParticipante,
      ];
    },

    async handleSubmit() {
      this.error = "";
      const loader = this.$loading.show({
        container: this.$refs.form_container,
        width: 90,
        height: 90,
      });
      try {
        const survey = this.model;
        const validQuestions = [];
        survey.questions_to_add.forEach((question) => {
          if (question.type && question.label) {
            const validQuestion = {
              type: question.type,
              label: question.label,
              select_options: [],
            };
            const options = question.select_options.map(
              (select_option) => select_option.option
            );
            validQuestion.select_options = ["selectbox", "checkbox"].includes(
              question.type
            )
              ? options
              : [];

            validQuestions.push(validQuestion);
          }
        });

        await api.put(`/admin/surveys/${this.$route.params.id}`, {
          title: survey.title,
          is_active: survey.is_active,
          is_response_restricted: survey.is_response_restricted,
          description: survey.description,
          start_date: survey.start_date,
          end_date: survey.end_date,
          questions_to_add: validQuestions,
          questions_to_remove: survey.questions_to_remove,
          is_public: survey.is_public,
          student: survey.student,
          teacher: survey.teacher,
          volunteer: survey.volunteer,
          partner: survey.partner,
          associate: survey.associate,
          participants: this.participantes.map((p) => p.value),
        });
        this.$toasted.show("Enquete atualizada com sucesso");
        this.$router.push("/diretoria/questionarios");
      } catch (e) {
        this.error =
          "Ocorreu um erro ao atualizar o questionário. Tente novamente.";
        this.$toasted.error("Ocorreu um erro ao salvar as informações");
      }
      loader.hide();
    },
    handleRemoveQuestion(index) {
      const confirmation = confirm(
        "Você realmente deseja excluir a pergunta? Se existirem, as respostas para a pergunta serão perdidas. Ainda será necessário clicar em 'SALVAR ALTERAÇÕES' para efetivar a remoção."
      );
      if (confirmation) {
        const question = this.model.questions.splice(index, 1);
        if (question.length)
          this.model.questions_to_remove.push(question[0].id);
      }
    },
    handleRemoveNewQuestion(index) {
      this.model.questions_to_add.splice(index, 1);
    },
    handleRemoveSelectOption(questionIndex, optionIndex) {
      this.model.questions_to_add[questionIndex].select_options.splice(
        optionIndex,
        1
      );
    },
    handleAddNewOption(index) {
      this.model.questions_to_add[index].select_options.push({ option: "" });
    },
    handleAddNewQuestion() {
      this.model.questions_to_add.push({
        title: "",
        type: "",
        select_options: [{ option: "" }],
      });
    },
    setCurrentDate() {
      this.model.start_date = this.moment().format("YYYY-MM-DD");
    },
    handleOpenModalRemove() {
      this.modalRemove.error = "";
      this.modalRemove.show = true;
    },
    async handleRemoveSurvey() {
      this.modalRemove.error = false;
      const loader = this.$loading.show({
        container: this.$refs.modal_confirmation_delete,
        width: 160,
        height: 160,
        opacity: 0,
      });
      try {
        await api.delete(`/admin/surveys/${this.$route.params.id}`);
        this.$toasted.show("Enquete removida com sucesso");
        this.$router.push("/diretoria/questionarios");
      } catch (e) {
        this.$toasted.error("Ocorreu um erro ao remover o questionário");
        this.modalRemove.error = true;
      } finally {
        loader.hide();
      }
    },
    getQuestionType(typeKey) {
      const questionType = this.questionTypes.find(
        (type) => type.key === typeKey
      );
      return questionType ? questionType.value : "-";
    },
    switchChangedHandler(event, prop) {
      if (typeof event === "boolean") this.model[prop] = event;
    },
  },
};
</script>
<style>
p > strong {
  font-weight: bold !important;
}

.participants {
  min-height: 2.5em !important;
}

.np-container-edditable .quill-editor .ql-container,
.np-container-edditable .quill-editor .ql-container .ql-editor {
  height: 6rem;
  width: 100%;
}
</style>
<style>
.participants_select.v-select {
  background-color: #fff;
  background-clip: padding-box;
}
.participants_select.v-select .vs__dropdown-toggle {
  padding: 0.5rem 0.1rem;
  min-width: 100%;
}
.participants_select.v-select
  .vs__dropdown-toggle
  .vs__selected-options
  .vs__search {
  color: #8898aa;
  font-weight: 400;
  line-height: 1.5;
  font-size: 0.875rem;
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
.qe-container .quill-editor .ql-container,
.qe-container .quill-editor .ql-container .ql-editor {
  min-height: 3rem;
  width: 100%;
}

p > strong {
  font-weight: bold !important;
}
</style>
