<template>
  <div>
    <base-header class="header pb-8 pt-5 pt-lg-8 d-flex align-items-center">
      <!-- Mask -->
      <span class="mask opacity-8" />
      <!-- Header container -->
    </base-header>

    <div class="container-fluid mt--8">
      <div class="row">
        <div class="col-12">
          <div
            ref="projects_table"
            class="card shadow table-container vld-parent"
          >
            <div class="card-header border-0">
              <div class="row align-items-center">
                <div class="col-12">
                  <h3 class="mb-0">
                    <i class="fas fa-project-diagram mr-2" /> Lista de
                    <span class="text-warning">parceiros</span>
                    <base-button
                      :custom="true"
                      size="sm"
                      class="float-right"
                      type="primary"
                      @click="$router.push(`/diretoria/parceiros/novo`)"
                    >
                      <i class="fas fa-plus mr-1" /> Cadastrar novo parceiro
                    </base-button>
                  </h3>
                </div>
              </div>
            </div>

            <div class="table-responsive">
              <base-table
                class="table align-items-center table-flush"
                thead-classes="thead-light"
                tbody-classes="list"
                :data="tableData"
                type="hover"
              >
                <template slot="columns">
                  <th>#</th>
                  <th>Nome</th>
                  <th>Ativo</th>
                  <th>Ações</th>
                </template>
                <template slot-scope="{ row, index }">
                  <td class="py-4">{{ index + 1 }}</td>
                  <th scope="row">
                    {{ row.name }}
                  </th>
                  <td>
                    <badge :type="row.is_active ? 'success' : 'danger'">
                      {{ row.is_active ? "Sim" : "Não" }}
                    </badge>
                  </td>
                  <td>
                    <base-button
                      v-tooltip.bottom="'Visualizar'"
                      class="btn btn-white py-1 px-2"
                      @click="showModal(row)"
                    >
                      <i class="fas fa-eye text-success" />
                    </base-button>
                    <base-button
                      v-tooltip.bottom="'Editar'"
                      class="btn btn-white py-1 px-2"
                      @click="
                        $router.push(`/diretoria/parceiros/${row.id}/editar`)
                      "
                    >
                      <i class="fas fa-edit text-info" />
                    </base-button>
                    <base-button
                      v-tooltip.bottom="'Apagar'"
                      class="btn btn-white py-1 px-2"
                      @click="openDeleteModal(row)"
                    >
                      <i class="fas fa-trash text-danger" />
                    </base-button>
                  </td>
                </template>
              </base-table>
              <p v-if="empty" class="text-center text-warning mt-3">
                Não há projetos cadastrados até o momento
              </p>
            </div>
          </div>
        </div>
      </div>
      <div v-if="!empty" class="row">
        <div class="col-12 text-muted text-right mt-4">
          <b>{{ tableData.length }}</b> projetos cadastrados ao total
        </div>
      </div>
    </div>
    <modal
      :show.sync="modals.show.show"
      modal-classes="modal-dialog-centered"
      body-classes="pb-2 position-static"
      header-classes="pb-0"
    >
      <h6
        id="modal-title-notification"
        slot="header"
        class="modal-title-notification"
      >
        Visualizar parceiro
      </h6>
      <div class="text-center">
        <div>
          <img
            class="partner-image card-image my-3"
            :src="modals.show.image_url || '/img/pages/company.png'"
          />
        </div>
        <h4 class="text-lg">{{ modals.show.name }}</h4>
      </div>
    </modal>
    <modal
      :show.sync="modals.delete.show"
      modal-classes="modal-default modal-dialog-centered"
      body-classes="pb-0"
    >
      <h6 id="modal-title-notification" slot="header" class="modal-title">
        Atenção!
      </h6>
      <div ref="modal_confirmation_delete" class="vld-parent">
        <div class="py-3 text-center">
          <i class="fa fa-trash fa-3x" />
          <h4 class="heading mt-4">
            Você realmente deseja excluir o projeto
            <span class="text-warning">
              {{ modals.delete.name }}
            </span>
            ?
          </h4>
          <p class="mt-3 mb-0">
            Todas as informações relacionadas a ele serão perdidas.
          </p>
        </div>
      </div>
      <template slot="footer">
        <base-button
          type="link"
          text-color="white"
          class="ml-auto"
          @click="modals.delete.show = false"
        >
          Voltar
        </base-button>
        <base-button
          type="white text-danger"
          @click="handleSubmitRemovePartner()"
        >
          Confirmar exclusão
        </base-button>
      </template>
    </modal>
  </div>
</template>
<script>
import api from "@/services/api";

export default {
  name: "PartnersShowcase",
  data() {
    return {
      tableData: [],
      empty: false,
      modals: {
        show: {
          show: false,
          name: "",
          image_url: "",
        },
        delete: {
          show: false,
          id: "",
          name: "",
        },
      },
    };
  },
  async mounted() {
    const loader = this.$loading.show({
      container: this.$refs.projects_table,
      width: 90,
      height: 90,
    });
    try {
      const { data } = await api.get("/admin/showcases");
      if (data.length) {
        this.tableData = data;
      }
      this.empty = !data.length;
      loader.hide();
    } catch (e) {
      this.$toasted.error("Ocorreu um erro ao recuperar os projetos");
    }
  },
  methods: {
    truncate(text, stop = 150, clamp = "...") {
      if (!text) return "N/A";
      return text.slice(0, stop) + (stop < text.length ? clamp : "");
    },
    showModal(row) {
      this.modals.show.show = true;
      this.modals.show.image_url = row.image_url;
      this.modals.show.name = row.name;
    },
    openDeleteModal(row) {
      this.modals.delete.show = true;
      this.modals.delete.id = row.id;
      this.modals.delete.name = row.name;
    },
    async handleSubmitRemovePartner() {
      const loader = this.$loading.show({
        container: this.$refs.projects_table,
        width: 90,
        height: 90,
      });
      try {
        const id = this.modals.delete.id;
        await api.delete(`/admin/showcases/${id}`);
        const index = this.tableData.findIndex((item) => item.id === id);
        this.tableData.splice(index, 1);

        this.modals.delete.show = false;
        this.empty = !this.tableData.length;
        loader.hide();
      } catch (e) {
        this.$toasted.error("Ocorreu um erro ao recuperar os projetos");
      }
    },
  },
};
</script>
<style scoped>
.table-container {
  min-height: 150px;
}

.partner-image {
  width: 100%;
  height: 100%;
  max-height: 15em;
  max-width: 15em;
  object-fit: cover;
}
</style>
