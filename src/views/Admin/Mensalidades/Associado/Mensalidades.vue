<template>
  <div>
    <base-header type="gradient-default" class="pb-3 py-5 pt-md-8">
      <div class="container-fluid d-flex align-items-center">
        <div class="row">
          <div class="col-lg-8 col-md-10">
            <p class="text-white mt-3 mb-5">
              Aqui você pode gerenciar as regras de mensalidade cadastradas.
            </p>
          </div>
        </div>
      </div>
    </base-header>
    <div ref="mensality_loading" class="container-fluid mt--3">
      <div ref="lessons_table" class="card shadow table-container vld-parent">
        <div class="card-header border-0">
          <div class="row align-items-center">
            <div class="col">
              <h3 class="mb-0">Lista de regras cadastradas</h3>
            </div>
            <div class="row text-center">
              <div class="col-12">
                <base-button
                  :custom="true"
                  size="sm"
                  type="primary"
                  @click="handleOpenNewMensality"
                >
                  <i class="fas fa-plus mr-1" />
                  Cadastrar regra
                </base-button>
              </div>
            </div>
          </div>
        </div>
        <div class="table-responsive">
          <template>
            <table
              class="table tablesorter table align-items-center table-flush table-hover"
            >
              <thead class="thead-light">
                <tr>
                  <slot name="columns">
                    <th>#</th>
                    <th>Valor</th>
                    <th>Quantia de associados</th>
                    <th>Ações</th>
                  </slot>
                </tr>
              </thead>
              <tbody class="list">
                <template v-for="(row, index) in rules">
                  <tr
                    :key="index"
                    data-toggle="collapse"
                    :data-target="'#demo1'"
                    class="accordion-toggle"
                  >
                    <td class="py-4">{{ index + 1 }}</td>
                    <td>
                      {{ formatMoney(row.value) }}
                    </td>
                    <td>{{ row.ids.length }}</td>
                    <td>
                      <base-button
                        v-tooltip.bottom="'Gerar cobrança'"
                        type="white"
                        size="sm"
                        class="text-danger"
                        @click="handleOpenBilling(row)"
                      >
                        <i class="fa fa-university text-success" />
                      </base-button>
                      <base-button
                        v-tooltip.bottom="'Editar regra'"
                        type="white"
                        size="sm"
                        class="text-danger"
                        @click="handleOpenEditMensality(row)"
                      >
                        <i class="fas fa-edit text-info" />
                      </base-button>
                      <base-button
                        v-tooltip.bottom="'Excluir regra'"
                        type="white"
                        size="sm"
                        class="text-danger"
                        @click="handleDeleteMensality(row.id)"
                      >
                        <i class="fas fa-trash text-danger" />
                      </base-button>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </template>
        </div>
        <p v-if="empty" class="text-center text-warning mt-3">
          Nenhuma mensalidade registrada até o momento.
        </p>
      </div>
    </div>
    <modal
      :show.sync="modals.create.show"
      modal-classes="modal-dialog-centered modal-lg"
      body-classes="pb-0"
      header-classes="pb-0"
    >
      <template>
        <form ref="new_rule_form" role="form">
          <div class="row mx-1 justify-content-between">
            <h6 class="heading-small text-muted mb-4">Cadastrar regra</h6>
            <h6
              class="heading-small mb-4 cursor-pointer"
              @click="modals.create.show = false"
            >
              x
            </h6>
          </div>
          <div class="row justify-content-center">
            <div class="col-lg-6">
              <base-input label="Valor*">
                <money
                  v-model="modals.create.value"
                  v-bind="money"
                  class="form-control"
                />
              </base-input>
            </div>
            <div class="col-lg-12">
              <multi-select
                :options="modals.create.listIds"
                :selected-options="modals.create.selectedIds"
                placeholder="select item"
                @select="(e) => onSelect('create', e)"
              />
            </div>
          </div>
          <hr class="mt-2 mb-4" />
          <div v-if="modals.create.error" class="row ml-lg-2">
            <div class="col-lg-12 text-center">
              <base-alert type="danger">{{ modals.create.error }}</base-alert>
            </div>
          </div>
        </form>
      </template>
      <template slot="footer">
        <base-button
          type="success"
          text-color="dark"
          class="ml-auto mr-auto text-white"
          @click="handleNewRule"
        >
          Salvar
        </base-button>
      </template>
    </modal>
    <modal
      :show.sync="modals.edit.show"
      modal-classes="modal-dialog-centered modal-lg"
      body-classes="pb-0"
      header-classes="pb-0"
    >
      <template>
        <form ref="edit_rule_form" role="form">
          <div class="row mx-1 justify-content-between">
            <h6 class="heading-small text-muted mb-4">Cadastrar regra</h6>
            <h6
              class="heading-small mb-4 cursor-pointer"
              @click="modals.edit.show = false"
            >
              x
            </h6>
          </div>
          <div class="row justify-content-center">
            <div class="col-lg-6">
              <base-input label="Valor*">
                <money
                  v-model="modals.edit.value"
                  v-bind="money"
                  class="form-control"
                />
              </base-input>
            </div>
            <div class="col-lg-12">
              <multi-select
                :options="modals.edit.listIds"
                :selected-options="modals.edit.selectedIds"
                placeholder="select item"
                @select="(e) => onSelect('edit', e)"
              />
            </div>
          </div>
          <hr class="mt-2 mb-4" />
          <div v-if="modals.edit.error" class="row ml-lg-2">
            <div class="col-lg-12 text-center">
              <base-alert type="danger">{{ modals.edit.error }}</base-alert>
            </div>
          </div>
        </form>
      </template>
      <template slot="footer">
        <base-button
          type="success"
          text-color="dark"
          class="ml-auto mr-auto text-white"
          @click="handleEditRule"
        >
          Salvar
        </base-button>
      </template>
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
            Você realmente deseja excluir esta regra?
          </h4>
          <div class="d-flex flex-column">
            <h3 class="text-white font-weight-bold">
              Excluir cobranças relacionadas
            </h3>
            <base-switch
              :value="modals.delete.cascade"
              class="mb-0 mx-auto"
              @input="switchChangedHandler($event, 'delete', 'cascade')"
            />
          </div>
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
        <base-button type="white text-danger" @click="handleDelete">
          Confirmar exclusão
        </base-button>
      </template>
    </modal>
    <modal
      :show.sync="modals.generate.show"
      modal-classes="modal-dialog-centered modal-lg"
      body-classes="pb-0"
      header-classes="pb-0"
    >
      <h6 id="modal-title-notification" slot="header" class="modal-title">
        Atenção!
      </h6>
      <div ref="modal_confirmation_generate" class="vld-parent">
        <div class="py-3 text-center">
          <i class="fa fa-university fa-3x" />
          <h4 class="heading mt-4">
            Gerar as cobranças para
            {{ modals.generate.data.ids.length }} usuários
          </h4>
          <div class="d-flex flex-column">
            <h3 class="text-white font-weight-bold">
              Excluir cobranças pendentes relacionadas
            </h3>
            <base-input
              v-model="modals.generate.validity"
              label="Data de Validade*"
              class="mb-0 mx-auto"
              type="date"
            />
          </div>
        </div>
      </div>
      <template slot="footer">
        <base-button
          type="success"
          text-color="dark"
          class="ml-auto mr-auto text-white"
          :disabled="!modals.generate.validity"
          @click="handleGenerate"
        >
          Salvar
        </base-button>
      </template>
    </modal>
  </div>
</template>

<script>
import api from "../../../../services/api";
import { Money } from "v-money";
import { MultiSelect } from "vue-search-select";
import "vue-search-select/dist/VueSearchSelect.css";

export default {
  name: "ListMensalidades",
  components: {
    Money,
    MultiSelect,
  },
  data() {
    return {
      empty: true,
      rules: [],
      associates: [],
      modals: {
        create: {
          show: false,
          value: "",
          listIds: [],
          selectedIds: [],
          error: "",
        },
        edit: {
          data: {
            id: "",
            value: "",
            ids: "",
          },
          value: "",
          listIds: [],
          selectedIds: [],
          show: false,
          error: "",
        },
        delete: {
          show: false,
          id: "",
          cascade: false,
        },
        generate: {
          id: "",
          show: false,
          validity: "",
          data: {
            id: "",
            value: "",
            ids: "",
          },
        },
      },
      money: {
        decimal: ",",
        thousands: ".",
        prefix: "R$ ",
        suffix: "",
        precision: 2,
        masked: false,
      },
    };
  },
  computed: {},
  mounted() {
    this.getRules();
    this.getAssociates();
  },
  methods: {
    async handleNewRule() {
      const loader = this.$loading.show({
        container: this.$refs.new_rule_form,
        width: 90,
        height: 90,
      });
      try {
        const req = {
          value: this.modals.create.value,
          ids: this.modals.create.selectedIds.map((i) => i.value),
        };
        const { data } = await api.post("admin/associate-payments/rules", req);
        data.ids = JSON.parse(data.ids);
        this.rules = [...this.rules, data];
        this.empty = false;
        this.modals.create.show = false;
        this.$toasted.success("Regra cadastrada com sucesso!");
      } catch (e) {
        this.$toasted.error("Ocorreu um erro ao registrar a regra");
      } finally {
        loader.hide();
      }
    },
    async handleEditRule() {
      const loader = this.$loading.show({
        container: this.$refs.edit_rule_form,
        width: 90,
        height: 90,
      });
      try {
        const req = {
          value: this.modals.edit.value,
          ids: this.modals.edit.selectedIds.map((i) => i.value),
        };
        const id = this.modals.edit.data.id;
        const { data } = await api.put(
          `admin/associate-payments/rules/${id}`,
          req
        );
        data.ids = JSON.parse(data.ids);
        this.modals.edit.data.value = data.value;
        this.modals.edit.data.ids = data.ids;
        this.empty = false;
        this.modals.edit.show = false;
        this.$toasted.success("Regra editada com sucesso!");
      } catch (e) {
        this.$toasted.error("Ocorreu um erro ao editar a regra");
      } finally {
        loader.hide();
      }
    },
    async getRules() {
      const loader = this.$loading.show({
        container: this.$refs.mensality_loading,
        width: 90,
        height: 90,
      });
      try {
        const { data } = await api.get("admin/associate-payments/rules");
        data.forEach((i) => (i.ids = JSON.parse(i.ids)));
        this.rules = data;
        this.empty = !data.length;
      } catch (e) {
        this.$toasted.error("Ocorreu um erro ao buscar as regras");
      } finally {
        loader.hide();
      }
    },
    async getAssociates() {
      const loader = this.$loading.show({
        container: this.$refs.mensality_loading,
        width: 90,
        height: 90,
      });
      try {
        const { data } = await api.get("admin/associate-payments/users");
        this.associates = data.map((i) => ({ value: i.user_id, text: i.name }));
      } catch (e) {
        this.$toasted.error("Ocorreu um erro ao buscar as regras");
      } finally {
        loader.hide();
      }
    },
    async handleDelete() {
      const loader = this.$loading.show({
        container: this.$refs.mensality_loading,
        width: 90,
        height: 90,
      });
      try {
        await api.delete(
          `admin/associate-payments/rules/${this.modals.delete.id}`,
          {
            cascade: this.modals.delete.cascade,
          }
        );
        this.rules = this.rules.filter((i) => i.id !== this.modals.delete.id);
        this.modals.delete.show = false;
        this.empty = !this.rules.length;
        this.$toasted.success("Regra excluída com sucesso!");
      } catch (e) {
        this.$toasted.error("Ocorreu um erro ao deletar a regra");
      } finally {
        loader.hide();
      }
    },
    async handleGenerate() {
      const loader = this.$loading.show({
        container: this.$refs.modal_confirmation_generate,
        width: 90,
        height: 90,
      });
      try {
        const data = {
          payment_id: this.modals.generate.id,
          validity: this.modals.generate.validity,
        };
        await api.post("admin/associate-payments", data);
        this.modals.generate.show = false;
        this.$toasted.success("Cobranças geradas com sucesso!");
      } catch (e) {
        this.$toasted.error("Ocorreu um erro ao gerar as cobranças");
      } finally {
        loader.hide();
      }
    },
    onSelect(obj, list) {
      this.modals[obj].selectedIds = list;
    },
    switchChangedHandler(event, obj, prop) {
      if (typeof event === "boolean") this.modals[obj][prop] = event;
    },
    formatMoney(value) {
      return value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
    },
    handleOpenBilling(row) {
      this.modals.generate.id = row.id;
      this.modals.generate.show = true;
      this.modals.generate.validity = "";
      this.modals.data = row;
    },
    handleDeleteMensality(id) {
      this.modals.delete.id = id;
      this.modals.delete.show = true;
      this.modals.delete.cascade = false;
    },
    handleOpenNewMensality() {
      this.modals.create.show = true;
      this.modals.create.value = 0.0;
      this.modals.create.error = "";
      this.modals.create.listIds = [...this.associates];
      this.modals.create.selectedIds = [];
    },
    handleOpenEditMensality(row) {
      this.modals.edit.data = row;
      this.modals.edit.show = true;
      this.modals.edit.value = row.value;
      this.modals.edit.error = "";
      this.modals.edit.selectedIds = this.associates.filter((i) =>
        row.ids.includes(i.value)
      );
      this.modals.edit.listIds = [...this.associates];
    },
  },
};
</script>

<style scoped>
.d-grid {
  display: grid;
  grid-template-columns: 8em 8em;
}
</style>
