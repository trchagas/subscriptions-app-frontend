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
              :to="'/diretoria/mensalidades'"
              class="btn-link font-weight-normal text-white"
              title="Voltar para listagem de turmas"
            >
              <i class="fas fa-chevron-left mr-1" /> Voltar
            </router-link>
          </div>
          <div class="col-lg-7 col-md-10">
            <p class="text-white mt-4 mb-2">
              Aqui é possível visualizar a mensalidade cadastrada e acompanhar o
              estado do pagamento (efetuado ou pendente) de cada parceiro
              registrado.
            </p>
          </div>
        </div>
      </div>
    </base-header>

    <div ref="mensality_loading" class="container-fluid mt--7">
      <div class="row">
        <div class="col-xl-8">
          <card shadow type="secondary">
            <div slot="header" class="bg-white border-0">
              <div class="row align-items-center">
                <div class="col-8">
                  <h3 class="mb-0">
                    <i class="ni ni-money-coins mr-2" /> Visualizar Mensalidade
                  </h3>
                </div>
                <div class="col">
                  <base-button
                    class="float-right"
                    @click="
                      $router.push(
                        `/diretoria/mensalidades-parceiro/${model.id}/editar`
                      )
                    "
                  >
                    <i class="fas fa-pen mr-2" />Editar
                  </base-button>
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
                    <label class="form-control-label"> Mês </label>
                    <p>{{ formatMes(model.mensality.month) }}</p>
                  </div>
                  <div class="col-lg-6">
                    <label class="form-control-label"> Ano referente </label>
                    <p>{{ model.mensality.year }}</p>
                  </div>
                  <div class="col-lg-6">
                    <label class="form-control-label"> Valor </label>
                    <p>{{ formatMoney(model.mensality.value) }}</p>
                  </div>
                  <div class="col-lg-6">
                    <label class="form-control-label"> Data de validade </label>
                    <p>{{ formatDate(model.mensality.validity) }}</p>
                  </div>
                </div>
                <hr class="mt-2 mb-4" />
                <div class="row px-lg-2">
                  <div
                    ref="lessons_table"
                    class="card shadow table-container vld-parent w-100"
                  >
                    <div class="card-header border-0">
                      <div class="row align-items-center">
                        <div class="col">
                          <h3 class="mb-0">Lista de parceiros cadastrados</h3>
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
                                <th>Nome</th>
                                <th>Status</th>
                                <th>Ações</th>
                              </slot>
                            </tr>
                          </thead>
                          <tbody class="list">
                            <template v-for="(row, index) in participantes">
                              <tr :key="index">
                                <td class="py-4">{{ index + 1 }}</td>
                                <td>
                                  {{ row.name }}
                                </td>
                                <td>
                                  <badge :type="statusType(row.status)">
                                    {{ formatStatus(row.status) }}
                                  </badge>
                                </td>
                                <td>
                                  <i
                                    class="cursor-pointer fas fa-eye text-primary"
                                    @click="
                                      $router.push(
                                        `/diretoria/usuarios/parceiros/${row.user_id}/visualizar`
                                      )
                                    "
                                  />
                                  <i
                                    class="cursor-pointer ml-2 fas fa-pen text-primary"
                                    @click="handleOpenModalEdit(row)"
                                  />
                                  <i
                                    class="cursor-pointer ml-2 fas fa-trash text-primary"
                                    @click="handleOpenModalRemove(row)"
                                  />
                                </td>
                              </tr>
                            </template>
                          </tbody>
                        </table>
                        <p v-if="empty" class="text-center text-warning mt-3">
                          Nenhum usuário registrado até o momento.
                        </p>
                      </template>
                    </div>
                  </div>
                </div>
                <div v-if="error" class="row ml-lg-2">
                  <div class="col-lg-12 text-center">
                    <base-alert type="danger">{{ error }}</base-alert>
                  </div>
                </div>
              </form>
            </template>
          </card>
        </div>
      </div>
    </div>
    <modal
      :show.sync="modals.modalEdit"
      modal-classes="modal-dialog-centered modal-lg"
      body-classes="pb-0"
      header-classes="pb-0"
    >
      <template>
        <form ref="edit_payment" role="form">
          <div class="row mx-1 justify-content-between">
            <h6 class="heading-small text-muted mb-4">Status de pagamento</h6>
            <h6
              class="heading-small mb-4 cursor-pointer"
              @click="modals.modalEdit = false"
            >
              x
            </h6>
          </div>
          <div class="row ml-lg-2">
            <div class="col-lg-6">
              <label class="form-control-label d-block"> Usuário </label>
              <p>
                {{ modalEdit.name }}
              </p>
            </div>
            <div class="col-lg-6">
              <label class="form-control-label d-block">
                Parceiro Pagou?
              </label>
              <div class="position-relative">
                <base-checkbox
                  v-model="modalEdit.has_paid"
                  class="position-absolute"
                  disabled
                />
                <a
                  v-if="modalEdit.file_url"
                  :href="modalEdit.file_url"
                  target="_blank"
                  class="ml-5"
                >
                  Comprovante
                </a>
              </div>
            </div>
            <!-- payment status select box -->
            <div class="col-lg-5">
              <base-input label="Status">
                <select v-model="modalEdit.newStatus" class="form-control">
                  <option value="failed">Falha</option>
                  <option value="pending">Pendent</option>
                  <option value="paid">Pago</option>
                </select>
              </base-input>
            </div>
          </div>
          <hr class="mt-2 mb-4" />
          <div v-if="modalEdit.error" class="row ml-lg-2">
            <div class="col-lg-12 text-center">
              <base-alert type="danger">{{ modalEdit.error }}</base-alert>
            </div>
          </div>
        </form>
      </template>
      <template slot="footer">
        <base-button
          type="success"
          text-color="dark"
          class="ml-auto mr-auto text-white"
          @click="handleEditPayment"
        >
          Salvar
        </base-button>
      </template>
    </modal>
    <modal
      :show.sync="modals.modalRemove"
      modal-classes="modal-default modal-dialog-centered"
    >
      <h6 id="modal-title-notification" slot="header" class="modal-title">
        Atenção!
      </h6>
      <div ref="remove_payment" class="vld-parent">
        <div class="py-3 text-center">
          <i class="ni ni-money-coins ni-3x" />
          <h4 class="heading mt-4">Confirmar exclusão</h4>
          <p class="mt-3 mb-0">
            Você confirma a exclusão da cobrança da mensalidade referente ao
            parceiro(a)
            <span class="font-weight-bold">
              {{ modalRemove.name }}
            </span>
            ?
          </p>
        </div>
      </div>
      <template slot="footer">
        <base-button
          type="link"
          text-color="white"
          class="ml-auto"
          @click="modals.modalRemove = false"
        >
          Voltar
        </base-button>
        <base-button type="white text-success" @click="handleSubmitRemove">
          Confirmar criação
        </base-button>
      </template>
    </modal>
  </div>
</template>
<script>
import api from "@/services/api.js";
import datas from "../../../../assets/datas.json";

import "vue-search-select/dist/VueSearchSelect.css";
import BaseInput from "../../../../components/BaseInput.vue";
import Badge from "../../../../components/Badge.vue";

export default {
  name: "MensalidadeForm",
  components: { Badge },
  data() {
    BaseInput;
    return {
      model: {
        mensality: {
          id: "",
          validity: "",
          value: 0,
          month: "",
          year: "",
        },
      },
      empty: false,
      meses: {},
      participantes: [],
      modals: {
        modalRemove: false,
        modalEdit: false,
      },
      modalRemove: {},
      modalEdit: {},
      error: "",
    };
  },
  computed: {
    isValidModel() {
      const mensality = this.model.mensality;
      for (const key of this.requiredFields) {
        if (mensality[key] === "") return false;
      }
      return true;
    },
  },
  mounted() {
    this.model.id = this.$route.params.id;
    this.loadMensality();
    this.meses = datas.meses;
  },
  methods: {
    statusType(status) {
      const mapStatus = {
        pending: "warning",
        paid: "success",
        failed: "warning",
      };
      if (mapStatus[status]) return mapStatus[status];
      return "info";
    },
    formatStatus(status) {
      const mapStatus = {
        pending: "pendente",
        paid: "pago",
        failed: "falha",
      };
      if (mapStatus[status]) return mapStatus[status];
      return "";
    },
    formatMoney(value) {
      return value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
    },
    formatMes(mes) {
      return this.meses[mes];
    },
    async handleEditPayment() {
      const loader = this.$loading.show({
        container: this.$refs.edit_payment,
        width: 90,
        height: 90,
      });
      try {
        await api.put(
          `admin/partner-payments/${this.model.id}/partners/${this.modalEdit.user_id}`,
          { status: this.modalEdit.newStatus }
        );
        this.modalEdit.status = this.modalEdit.newStatus;
        this.modalEdit = {};
        this.modals.modalEdit = false;
        this.$toasted.success("Cobrança editada com sucesso");
      } catch (e) {
        this.$toasted.error("Ocorreu um erro ao editar a cobrança");
      } finally {
        loader.hide();
      }
    },
    async loadMensality() {
      const loader = this.$loading.show({
        container: this.$refs.mensality_loading,
        width: 90,
        height: 90,
      });
      try {
        const { data: mensalidade } = await api.get(
          `admin/partner-payments/${this.model.id}`
        );
        this.model.mensality = mensalidade.mensality;
        this.model.mensality.validity =
          this.model.mensality.validity.split("T")[0];
        this.participantes = mensalidade.participants;
        this.empty = !this.participantes.length;
        loader.hide();
      } catch (e) {
        this.$toasted.error("Ocorreu um erro ao buscar os pagamentos");
      }
    },
    handleOpenModalRemove(row) {
      this.modals.modalRemove = true;
      this.modalRemove = row;
    },
    handleOpenModalEdit(row) {
      this.modals.modalEdit = true;
      this.modalEdit = row;
      this.modalEdit.newStatus = this.modalEdit.status;
    },
    async handleSubmitRemove() {
      const loader = this.$loading.show({
        container: this.$refs.remove_payment,
        width: 90,
        height: 90,
      });
      try {
        await api.delete(
          `admin/partner-payments/${this.model.id}/partners/${this.modalRemove.user_id}`
        );
        this.participantes = this.participantes.filter(
          (participante) => participante.user_id !== this.modalRemove.user_id
        );
        this.modalRemove = {};
        this.modals.modalRemove = false;
        this.empty = !this.participantes.length;
        this.$toasted.success("Cobrança excluída com sucesso");
      } catch (e) {
        this.$toasted.error("Ocorreu um erro ao deletar o pagamento");
      } finally {
        loader.hide();
      }
    },
  },
};
</script>
<style scoped></style>
