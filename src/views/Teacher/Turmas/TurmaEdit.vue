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
              :to="'/professor/turmas'"
              class="btn-link font-weight-normal text-white"
              title="Voltar para listagem de turmas"
            >
              <i class="fas fa-chevron-left mr-1" /> Voltar
            </router-link>
          </div>
          <div class="col-lg-7 col-md-10">
            <p class="text-white mt-4 mb-2">
              Aqui você poderá atualizar as informações da turma, o que inclui
              modificar a sua visibilidade para os alunos e outras informações.
            </p>
          </div>
        </div>
      </div>
    </base-header>

    <div class="container-fluid mt--7">
      <div class="row">
        <div class="col-xl-4 order-xl-2 mb-5 mb-xl-0">
          <div
            ref="course_image"
            class="card card-profile shadow vld-parent border-0"
          >
            <div ref="card_image" class="card-image">
              <img
                class="card-img-top rounded-top"
                :src="model.turma.background_url || placeholderImg"
                alt="Imagem turma"
              />
              <div class="image-overlay" />
            </div>
            <div class="card-body py-3">
              <h2 class="card-title mb-1">{{ model.turma.title }}</h2>
              <p class="description mb-0">{{ model.turma.subtitle }}</p>
              <p v-if="model.turma.description" class="card-text mt-2 mb-0">
                <span :title="model.turma.description">{{
                  truncate(model.turma.description)
                }}</span>
              </p>
              <p v-if="!model.turma.is_visible" class="mt-2 mb-0">
                <badge v-tooltip="'A turma está oculto'" type="warning">
                  Oculto
                </badge>
              </p>
              <hr class="mt-3 mb-4" />
              <base-button size="sm" type="primary" @click="updateImage">
                <i class="fas fa-sync text-white" /> Trocar foto
              </base-button>
            </div>
          </div>
          <div class="col-12 text-center mt-3">
            <router-link
              v-tooltip="'Gerenciar materiais da turma'"
              :to="'/professor/turmas/' + model.turma.id + '/materiais'"
              class="btn btn-white opt-btn"
            >
              <i class="fas fa-book text-dark-green mr-2" /> Gerenciar materiais
            </router-link>
          </div>
          <div class="col-12 text-center mt-3">
            <router-link
              v-tooltip="'Ver aulas registradas'"
              :to="'/professor/turmas/' + model.turma.id + '/aulas'"
              class="btn btn-white opt-btn"
            >
              <i class="fas fa-calendar text-primary" /> Aulas registradas
            </router-link>
          </div>
          <div class="col-12 text-center mt-3">
            <router-link
              v-tooltip="'Gerenciar ranking da turma'"
              :to="'/professor/turmas/' + model.turma.id + '/ranking'"
              class="btn btn-white opt-btn"
            >
              <i class="fas fa-award text-yellow mr-2" /> Ranking de alunos
            </router-link>
          </div>
        </div>

        <div class="col-xl-8">
          <card shadow type="secondary">
            <div slot="header" class="bg-white border-0">
              <div class="row align-items-center">
                <div class="col-12">
                  <h3 class="mb-0">
                    Turma
                    <span class="text-danger">{{ model.turma.title }}</span>
                    <base-button
                      size="sm"
                      type="danger"
                      class="float-right"
                      @click="handleOpenModalRemove()"
                    >
                      <i class="fas fa-trash mr-1" /> Deletar turma
                    </base-button>
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
                      v-model.trim="model.turma.title"
                      label="Título da turma*"
                      placeholder="Digite o título"
                    />
                  </div>
                  <div class="col-lg-6">
                    <base-input
                      v-model.trim="model.turma.description"
                      label="Descrição"
                      placeholder="Ex.: Turma A"
                    />
                  </div>
                  <div class="col-lg-6">
                    <base-input label="Status*">
                      <select v-model="model.turma.status" class="form-control">
                        <option value="" selected disabled>
                          Selecione uma opção
                        </option>
                        <option value="pendent">Não iniciada</option>
                        <option value="in_progress">Em andamento</option>
                        <option value="finished">Finalizada</option>
                      </select>
                    </base-input>
                  </div>
                  <div class="col-lg-6">
                    <label class="form-control-label d-block">
                      Está visível?
                      <i
                        v-tooltip="
                          'Um turma <b>ativa</b> fica visível para os alunos que possuem acesso, enquanto um turma <b>inativa</b> fica oculto para todos alunos.'
                        "
                        class="fas fa-info-circle ml-1"
                      />
                    </label>
                    <base-input>
                      <base-switch
                        :value="model.turma.is_visible"
                        @input="switchChangedHandler($event, 'is_visible')"
                      />
                    </base-input>
                  </div>
                </div>
                <hr class="mt-2 mb-4" />
                <div class="row ml-lg-2">
                  <div class="col-lg-6">
                    <label class="form-control-label d-block">
                      Data de início
                    </label>
                    <base-input
                      v-model="model.turma.start_at"
                      addon-left-icon="fas fa-calendar"
                      type="date"
                      placeholder="Data de início"
                    />
                  </div>
                  <div class="col-lg-6">
                    <label class="form-control-label d-block">
                      Data de validade
                    </label>
                    <base-input
                      v-model="model.turma.end_at"
                      addon-left-icon="fas fa-calendar"
                      type="date"
                      placeholder="Data de validade"
                    />
                  </div>
                </div>
                <hr class="mt-2 mb-4" />
                <div class="row ml-lg-2">
                  <div v-if="error" class="col-12 text-center">
                    <base-alert type="danger">{{ error }}</base-alert>
                  </div>
                  <div v-if="success" class="col-12 text-center">
                    <base-alert type="success">{{ success }}</base-alert>
                  </div>
                </div>
                <div class="text-right">
                  <base-button
                    type="primary"
                    class="mt-3"
                    :custom="true"
                    :disabled="!isValidModel"
                    @click="handleSubmitForm"
                  >
                    Salvar alterações
                  </base-button>
                </div>
              </form>
            </template>
          </card>
        </div>
      </div>
    </div>
    <modal
      :show.sync="modalRemove.show"
      modal-classes="modal-default modal-dialog-centered"
      body-classes="pb-0"
    >
      <h6 id="modal-title-notification" slot="header" class="modal-title">
        Atenção!
      </h6>
      <div ref="modal_confirmation_delete" class="vld-parent">
        <div class="text-center">
          <i class="fa fa-trash fa-3x" />
          <h4 class="heading mt-4">
            Você realmente deseja
            <span class="text-danger">excluir a turma</span>?
          </h4>
          <p class="my-3">
            Ao confirmar, a turma "<b>{{ model.turma.title }} </b>" será
            removida e todos os possíveis materiais e avaliações vinculadas a
            ela serão perdidas.
          </p>
        </div>
        <div v-if="modalRemove.error" class="col-12 text-center mt-3">
          <base-alert type="danger">
            Ocorreu um erro ao remover a turma. Tente novamente.
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
        <base-button type="white" class="text-danger" @click="handleRemove()">
          Confirmar exclusão
        </base-button>
      </template>
    </modal>
  </div>
</template>
<script>
import api from "@/services/api.js";

export default {
  name: "CursoForm",
  data() {
    return {
      model: {
        turma: {
          id: "",
          title: "",
          is_visible: false,
          description: "",
          status: "pendent",
          background_url: "",
          background_key: "",
          start_at: "",
          end_at: "",
        },
        selectedCategories: [],
      },
      categorias: [],
      filterByCategory: (option, search) => {
        const temp = search.toLowerCase();
        let match = false;
        return option.title.toLowerCase().indexOf(temp) > -1 || match;
      },
      requiredFields: ["title", "status", "is_visible"],
      placeholderImg: "/img/pages/default_banner_course.jpg",
      success: "",
      error: "",
      modalRemove: {
        show: false,
        error: "",
      },
    };
  },
  computed: {
    isValidModel() {
      const turma = this.model.turma;
      for (const key of this.requiredFields) {
        if (turma[key] === "") return false;
      }
      return true;
    },
  },
  async mounted() {
    const loader = this.$loading.show({
      container: this.$refs.curso_form,
      width: 90,
      height: 90,
    });
    try {
      this.model.turma.id = this.$route.params.id;
      const { data } = await api.get(`/teacher/classes/${this.model.turma.id}`);
      data.is_visible = Boolean(data.is_visible);
      data.start_at = data.start_at
        ? this.moment(data.start_at).format("YYYY-MM-DD")
        : "";
      data.end_at = data.end_at
        ? this.moment(data.end_at).format("YYYY-MM-DD")
        : "";
      this.model.turma = data;
      loader.hide();
    } catch (e) {
      this.$toasted.error(
        "Ocorreu um erro ao recuperar as informações da turma"
      );
      this.$router.push("/professor/turmas");
    }
  },
  methods: {
    async handleSubmitForm(e) {
      e.preventDefault();
      this.error = this.success = "";
      const loader = this.$loading.show({
        container: this.$refs.curso_form,
        width: 90,
        height: 90,
      });
      try {
        const courseData = this.model.turma;
        const { data } = await api.put(
          `/teacher/classes/${courseData.id}`,
          courseData
        );
        Object.assign(this.model.turma, data);
        this.$toasted.show("Informações atualizadas com sucesso");
        this.success = "Turma atualizada com sucesso!";
      } catch (e) {
        const genericError = "Ocorreu um erro ao salvar as informações";
        const hasErrorResponseData = e.response && e.response.data;
        let customError = genericError;
        if (hasErrorResponseData) {
          const data = e.response.data;
          if (data[0] && data[0].message) customError = data[0].message;
          else if (data.message) customError = data.message;
        }
        this.error = hasErrorResponseData
          ? customError
          : "Não foi possível salvar as informações. Por favor, tente novamente em alguns instantes.";
        this.$toasted.error(genericError);
      }
      loader.hide();
    },
    switchChangedHandler(event, obj) {
      if (typeof event === "boolean") this.model.turma[obj] = event;
    },
    truncate(text, stop = 150, clamp = "...") {
      if (!text) return "N/A";
      return text.slice(0, stop) + (stop < text.length ? clamp : "");
    },
    handleOpenModalRemove() {
      this.modalRemove.error = "";
      this.modalRemove.show = true;
    },
    async handleRemove() {
      this.modalRemove.error = false;
      const loader = this.$loading.show({
        container: this.$refs.modal_confirmation_delete,
        width: 160,
        height: 160,
        opacity: 0,
      });
      try {
        await api.delete(`/teacher/classes/${this.$route.params.id}`);
        this.$toasted.show("Turma removida com sucesso");
        this.modalRemove.show = false;
        this.$router.push("/professor/turmas");
      } catch (e) {
        this.$toasted.error("Ocorreu um erro ao remover a turma");
        this.modalRemove.error = true;
      } finally {
        loader.hide();
      }
    },
    async updateImage() {
      const loader = this.$loading.show({
        container: this.$refs.card_image,
        width: 90,
        height: 90,
      });
      try {
        const { data } = await api.put(
          `/teacher/classes/${this.model.turma.id}/image`
        );
        this.model.turma.background_url = data.background_url;
        this.model.turma.background_key = data.background_key;
        this.$toasted.show("Imagem atualizada com sucesso");
      } catch (e) {
        this.$toasted.error("Ocorreu um erro ao atualizar a imagem");
      } finally {
        loader.hide();
      }
    },
  },
};
</script>

<style scoped>
.opt-btn {
  width: 100% !important;
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
.jump {
  animation: jump 1.5s 0s forwards cubic-bezier(0.84, -0.54, 0.31, 1.19)
    infinite;
}

@keyframes jump {
  0% {
    transform: none;
  }
  50% {
    transform: translateY(-2em);
  }
}
</style>
