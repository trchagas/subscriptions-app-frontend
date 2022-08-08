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
              :to="`/professor/turmas/${model.classe.id}/materiais`"
              class="btn-link font-weight-normal text-white"
              title="Voltar para a listagem de turmas"
            >
              <i class="fas fa-chevron-left mr-1" />
              Voltar
            </router-link>
          </div>
          <div class="col-lg-8 col-md-10">
            <p class="text-white my-3">
              Aqui você pode gerenciar as seções da turma, o que inclui
              visualizar as seções cadastradas, cadastrar novas ou excluir
              seções já cadastradas.
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
            <div class="card-image">
              <img
                class="card-img-top rounded-top"
                :src="model.classe.background_url || placeholderImg"
                alt="Imagem turma"
              />
              <div class="image-overlay" />
            </div>
            <div class="card-body py-3">
              <h2 class="card-title mb-1">{{ model.classe.title }}</h2>
              <p class="description mb-0">{{ model.classe.subtitle }}</p>
              <p v-if="model.classe.description" class="card-text mt-2 mb-0">
                <span :title="model.classe.description">{{
                  truncate(model.classe.description)
                }}</span>
              </p>
              <p v-if="!model.classe.is_visible" class="mt-2 mb-0">
                <badge v-tooltip="'A turma está oculto'" type="warning">
                  Oculto
                </badge>
              </p>
            </div>
          </div>
        </div>
        <div class="col-lg-8">
          <div class="row mb-4">
            <div class="col-12">
              <card shadow type="secondary">
                <div slot="header" class="bg-white border-0">
                  <div class="row align-items-center">
                    <div class="col-8">
                      <h3 class="mb-0">
                        <i class="fas fa-layer-group mr-2" /> Nova
                        <span class="text-warning">seção</span>
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
                          v-model.trim="model.section.title"
                          label="Título*"
                          placeholder="Digite o título"
                        />
                      </div>
                      <div class="col-lg-6">
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
                            @input="switchChangedHandler($event, 'is_visible')"
                          />
                        </base-input>
                      </div>
                    </div>
                    <div class="text-center">
                      <base-button
                        type="primary"
                        class="mt-3"
                        :custom="true"
                        :disabled="!isValidModel"
                        @click="handleOpenModalConfirmation"
                      >
                        Cadastrar nova seção
                      </base-button>
                    </div>
                  </form>
                </template>
              </card>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <div class="card shadow flex-grow-1">
                <div ref="secoes_list" class="vld-parent">
                  <div class="card table-container vld-parent">
                    <div class="card-header border-0">
                      <div class="row align-items-center">
                        <div class="col">
                          <h3 class="mb-0">Lista de seções</h3>
                        </div>
                      </div>
                    </div>

                    <div class="table-responsive">
                      <base-table
                        class="table align-items-center table-flush"
                        thead-classes="thead-light"
                        tbody-classes="list"
                        :data="sections"
                        type="hover"
                      >
                        <template slot="columns">
                          <th>#</th>
                          <th>Status</th>
                          <th>Seção</th>
                          <th>Ações</th>
                        </template>
                        <template slot-scope="{ row, index }">
                          <th scope="row" class="py-4">{{ index + 1 }}</th>
                          <td>
                            <div class="mt-1">
                              <badge
                                v-if="row.is_visible"
                                v-tooltip="
                                  'A seção e seus materiais estão visíveis para os colaboradores que possuem acesso a turma.'
                                "
                                type="success"
                              >
                                Ativa
                              </badge>
                              <badge
                                v-else
                                v-tooltip="
                                  'A seção e seus materiais estão ocultos para todos os colaboradores.'
                                "
                                type="warning"
                              >
                                Oculta
                              </badge>
                            </div>
                          </td>
                          <td>
                            <span v-tooltip.bottom="row.title">{{
                              truncate(row.title, 30)
                            }}</span>
                          </td>
                          <td>
                            <base-button
                              v-tooltip.bottom="'Excluir seção'"
                              type="white"
                              size="sm"
                              class="text-danger"
                              @click="handleOpenModalDelete(row)"
                            >
                              <i class="fas fa-trash text-danger" />
                            </base-button>
                            <base-button
                              v-tooltip.bottom="'Editar seção'"
                              type="white"
                              size="sm"
                              class="text-danger"
                              @click="handleOpenModalEdit(row)"
                            >
                              <i class="fas fa-edit text-info" />
                            </base-button>
                          </td>
                        </template>
                      </base-table>
                      <p
                        v-if="!sections.length"
                        class="text-center text-warning mt-3"
                      >
                        Não há seções cadastradas na turma até o momento.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <modal
      :show.sync="modalConfirmation.show"
      modal-classes="modal-default modal-dialog-centered"
      body-classes="pb-2"
    >
      <h6 id="modal-title-notification" slot="header" class="modal-title">
        Atenção!
      </h6>
      <div ref="modal_confirmation_create" class="vld-parent">
        <div class="pt-3 text-center">
          <i class="fas fa-layer-group fa-3x" />
          <h4 class="heading mt-4">Confirmar criação</h4>
          <p class="mt-3">
            Você confirma a criação da seção
            <span class="font-weight-bold">
              {{ model.section.title }}
            </span>
            ?
          </p>
          <base-alert v-if="modalConfirmation.error" type="danger" class="mb-0">
            Ocorreu um erro ao criar a seção. Por favor, tente novamente.
          </base-alert>
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
        <base-button type="white text-success" @click="handleSubmitNewSection">
          Confirmar criação
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
      <div ref="modal_confirmation_remove" class="vld-parent">
        <div class="pt-3 text-center">
          <i class="fas fa-trash fa-3x" />
          <h4 class="heading mt-4">Confirmar remoção</h4>
          <p class="mt-3">
            Você confirma a remoção da seção
            <span class="font-weight-bold">
              {{ modalRemove.section.title }}
            </span>
            ?
          </p>
          <base-alert v-if="modalRemove.error" type="danger" class="mb-0">
            Ocorreu um erro ao remover a seção. Por favor, tente novamente.
          </base-alert>
        </div>
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
        <base-button type="white text-danger" @click="handleRemoveSection">
          Confirmar exclusão
        </base-button>
      </template>
    </modal>
    <modal
      :show.sync="modalEdit.show"
      modal-classes="modal-dialog-centered"
      body-classes="pb-2"
    >
      <h6 id="modal-title-notification" slot="header" class="modal-title">
        Atenção!
      </h6>
      <div class="pt-0">
        <div class="col-12 text-center mb-4">
          <i class="fas fa-edit fa-3x" />
          <h4 class="heading mt-4">Editar seção</h4>
        </div>
        <div class="col-lg-12">
          <base-input
            v-model.trim="modalEdit.section.title"
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
              :value="modalEdit.section.is_visible"
              @input="switchModalChangedHandler($event)"
            />
          </base-input>
        </div>
        <base-alert
          v-if="modalEdit.error"
          type="danger"
          class="mb-0 text-center"
        >
          Ocorreu um erro ao atualizar a seção. Por favor, tente novamente.
        </base-alert>
      </div>
      <template slot="footer">
        <base-button
          type="link"
          text-color="default"
          class="ml-auto"
          @click="modalEdit.show = false"
        >
          Voltar
        </base-button>
        <div class="text-right">
          <base-button
            type="primary"
            :custom="true"
            :disabled="!isValidEditModel"
            @click="handleSubmitUpdate"
          >
            Salvar alterações
          </base-button>
        </div>
      </template>
    </modal>
  </div>
</template>
<script>
import api from "@/services/api.js";
export default {
  name: "SectionForm",
  data() {
    return {
      model: {
        section: {
          title: "",
          is_visible: true,
        },
        classe: "",
      },
      sections: [],
      placeholderImg: "/img/pages/default_banner_course.jpg",
      requiredFields: ["title"],
      modalConfirmation: {
        show: false,
        error: "",
      },
      modalRemove: {
        show: false,
        section: "",
        error: "",
      },
      modalEdit: {
        show: false,
        section: "",
        error: "",
      },
    };
  },
  computed: {
    isValidModel() {
      const section = this.model.section;
      for (const key of this.requiredFields) {
        if (section[key] === "") return false;
      }
      return true;
    },
    isValidEditModel() {
      const section = this.modalEdit.section;
      for (const key of this.requiredFields) {
        if (section[key] === "") return false;
      }
      return true;
    },
  },
  async mounted() {
    await this.loadSections();
    await this.loadCurso();
  },
  methods: {
    async loadCurso() {
      const loader = this.$loading.show({
        container: this.$refs.course_container,
        width: 90,
        height: 90,
      });
      try {
        const { data } = await api.get(
          `/teacher/classes/${this.$route.params.id}`
        );
        this.model.classe = data;
        loader.hide();
      } catch (e) {
        this.$toasted.error(
          "Ocorreu um erro ao recuperar as informações  da turma"
        );
      }
    },
    async loadSections() {
      const loader = this.$loading.show({
        container: this.$refs.secoes_list,
        width: 100,
        height: 100,
      });
      try {
        const { data } = await api.get(
          `/teacher/classes/${this.$route.params.id}/sections`
        );
        this.sections = data;
      } catch (e) {
        this.$toasted.error("Ocorreu um erro ao recuperar as informações");
      } finally {
        loader.hide();
      }
    },
    async handleSubmitNewSection() {
      const loader = this.$loading.show({
        container: this.$refs.modal_confirmation_create,
        width: 90,
        height: 90,
        opacity: 0,
        color: "white",
      });
      this.modalConfirmation.error = "";
      try {
        await api.post(
          `/teacher/classes/${this.$route.params.id}/sections`,
          this.model.section
        );
        this.$toasted.show("Nova seção cadastradra com sucesso!");
        this.model.section.is_visible = true;
        this.model.section.title = "";
        this.modalConfirmation.show = false;
        await this.loadSections();
      } catch (e) {
        this.modalConfirmation.error = true;
        const genericError = "Ocorreu um erro ao cadastrar a seção.";
        const hasErrorResponseData = e.response && e.response.data;
        let customError = genericError;
        if (hasErrorResponseData) {
          const data = e.response.data.error
            ? e.response.data.error
            : e.response.data.errors;
          if (data[0] && data[0].message) customError = data[0].message;
          else if (data.message) customError = data.message;
        }
        this.$toasted.error(hasErrorResponseData ? customError : genericError);
      }
      loader.hide();
    },
    async handleSubmitUpdate() {
      const loader = this.$loading.show({
        container: this.$refs.modal_confirmation,
        width: 90,
        height: 90,
        opacity: 0,
        color: "white",
      });
      this.modalEdit.error = "";
      try {
        await api.put(
          `/teacher/classes/${this.$route.params.id}/sections/${this.modalEdit.section.id}`,
          this.modalEdit.section
        );
        this.modalEdit.show = false;
        await this.loadSections();
        this.$toasted.show("Seção atualizada com sucesso!");
      } catch (e) {
        this.modalEdit.error = true;
        this.$toasted.error("Ocorreu um erro ao atualizar a seção.");
      }
      loader.hide();
    },
    async handleRemoveSection() {
      const loader = this.$loading.show({
        container: this.$refs.modal_confirmation_remove,
        width: 90,
        height: 90,
        opacity: 0,
        color: "white",
      });
      this.modalRemove.error = "";
      try {
        await api.delete(
          `/teacher/classes/${this.$route.params.id}/sections/${this.modalRemove.section.id}`
        );
        this.$toasted.show("Seção removida  da turma com sucesso!");
        this.modalRemove.show = false;
        await this.loadSections();
      } catch (e) {
        this.modalRemove.error = true;
        this.$toasted.error("Ocorreu um erro ao remover a seção.");
      } finally {
        loader.hide();
      }
    },
    handleOpenModalConfirmation() {
      this.modalConfirmation.show = true;
    },
    handleOpenModalEdit(section) {
      this.modalEdit.error = "";
      this.modalEdit.section = Object.assign({}, section);
      this.modalEdit.section.is_visible = Boolean(
        this.modalEdit.section.is_visible
      );
      this.modalEdit.show = true;
    },
    handleOpenModalDelete(section) {
      this.modalRemove.error = "";
      this.modalRemove.section = section;
      this.modalRemove.show = true;
    },
    switchChangedHandler(event, obj) {
      if (typeof event === "boolean") this.model.section[obj] = event;
    },
    switchModalChangedHandler(event) {
      if (typeof event === "boolean") this.modalEdit.section.is_visible = event;
    },
    truncate(text, stop = 30, clamp = "...") {
      if (!text) return "-";
      return text.slice(0, stop) + (stop < text.length ? clamp : "");
    },
  },
};
</script>
<style scoped>
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
