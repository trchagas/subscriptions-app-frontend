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
              :to="'/diretoria/parceiros'"
              class="btn-link font-weight-normal text-white"
              title="Voltar para a listagem de publicações"
            >
              <i class="fas fa-chevron-left mr-1" />
              Voltar
            </router-link>
          </div>
          <div class="col-lg-7 col-md-10">
            <p class="text-white mt-3 mb-5">
              Aqui você pode cadastrar um novo parceiro a ser exibido na página
              inicial da plataforma.
            </p>
          </div>
        </div>
      </div>
    </base-header>

    <!--Charts-->
    <div class="container-fluid mt--8">
      <div class="row">
        <div class="col-xl-10 col-lg-12">
          <div class="card shadow mb-3">
            <div class="card-header bg-transparent">
              <h3 class="mb-0">
                <i class="fas fa-newspaper mr-2" />
                Novo parceiro
              </h3>
            </div>
            <div ref="publicacao_container" class="card-body vld-parent">
              <h6 class="heading-small text-muted mr-0 mb-4">
                Informações básicas
              </h6>

              <div class="row pl-lg-4">
                <div class="col-lg-6">
                  <base-input
                    v-model="model.name"
                    label="Nome"
                    placeholder="Nome"
                  />
                </div>
                <div class="col-lg-6">
                  <label class="form-control-label d-block">
                    Imagem
                    <i
                      v-tooltip="
                        'A imagem deve possuir tamanho máximo de 2MB e, preferencialmente, ser do formato <b>PNG</b> ou <b>JPG</b> com dimensão de <b>500x500 pixels</b>.'
                      "
                      class="fas fa-info-circle ml-1"
                    />
                  </label>
                  <base-input>
                    <file-select
                      v-model="image"
                      title="Selecione a imagem do parceiro"
                      accept="image/*"
                      :mb-size="2"
                      type="warning"
                    />
                  </base-input>
                </div>
                <div class="col-lg-6">
                  <label class="form-control-label d-block"> Ativo </label>
                  <base-switch
                    :value="model.is_active"
                    class="mb-0"
                    @input="switchChangedHandler($event, 'is_active')"
                  />
                </div>
              </div>
              <div v-if="error" class="row mt-4">
                <div class="col-12 text-center">
                  <base-alert type="danger">{{ error }}</base-alert>
                </div>
              </div>
              <div class="row mt-4 text-right">
                <div class="col-12">
                  <base-button
                    type="primary"
                    :disabled="!isValidModel"
                    @click="handleSubmit()"
                  >
                    Salvar parceiro
                  </base-button>
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

import "vue-select/dist/vue-select.css";

import api from "@/services/api";

export default {
  data() {
    return {
      model: {
        name: "",
        is_active: true,
      },
      image: null,
      requiredFields: ["name"],
      error: "",
    };
  },
  computed: {
    isValidModel() {
      const data = this.model;
      for (const key of this.requiredFields) {
        if (!data[key]) return false;
      }
      if (!this.image) return false;
      return true;
    },
  },
  methods: {
    async handleSubmit() {
      this.error = "";
      const loader = this.$loading.show({
        container: this.$refs.publicacao_container,
        width: 90,
        height: 90,
      });
      try {
        const config = {
          headers: {
            "content-type": "multipart/form-data",
          },
        };
        const data = new FormData();
        if (this.image) {
          data.append("image", this.image, this.image.name);
        }

        Object.entries(this.model).forEach((entry) => {
          data.append(entry[0], entry[1]);
        });
        await api.post("/admin/showcases", data, config);
        this.$toasted.show("Parceiro salvo com sucesso");
        this.$router.push("/diretoria/parceiros");
      } catch (e) {
        const genericError =
          "Ocorreu um erro ao salvar o parceiro. Por favor, verifique os campos e tente novamente.";
        const hasErrorResponseData = e.response && e.response.data;
        let customError = genericError;
        if (hasErrorResponseData) {
          const data = e.response.data.error
            ? e.response.data.error
            : e.response.data.errors;
          if (data[0] && data[0].message) customError = data[0].message;
          else if (data.message) customError = data.message;
        }
        this.error = hasErrorResponseData ? customError : genericError;
        this.$toasted.error("Ocorreu um erro ao salvar o parceiro");
      } finally {
        loader.hide();
      }
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

.np-container-edditable .quill-editor .ql-container,
.np-container-edditable .quill-editor .ql-container .ql-editor {
  height: 6rem;
  width: 100%;
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
</style>
