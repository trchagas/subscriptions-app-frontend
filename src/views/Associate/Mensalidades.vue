<template>
  <div>
    <base-header type="gradient-default" class="pb-3 py-5 pt-md-8">
      <div class="container-fluid d-flex align-items-center">
        <div class="row">
          <div class="col-lg-8 col-md-10">
            <p class="text-white mt-3 mb-5">
              Aqui você pode visualizar as mensalidades cadastradas.
            </p>
          </div>
        </div>
      </div>
    </base-header>
    <div ref="mensality_loading" class="container-fluid mt--5">
      <div ref="lessons_table" class="card shadow table-container vld-parent">
        <div class="table-responsive">
          <template>
            <div class="card shadow table-container vld-parent w-100">
              <div class="card-header border-0">
                <div class="row align-items-center">
                  <div class="col">
                    <h3 class="mb-0">Lista de mensalidades cadastradas</h3>
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
                          <th>Data</th>
                          <th>Vencimento</th>
                          <th>Valor</th>
                          <th>Status</th>
                          <th>Pago</th>
                          <th>Ações</th>
                        </slot>
                      </tr>
                    </thead>
                    <tbody class="list">
                      <template v-for="(row, index) in payments">
                        <tr :key="index">
                          <td>
                            {{ formatDate(row.created_at) }}
                          </td>
                          <td>
                            {{ formatDate(row.validity) }}
                          </td>
                          <td>
                            {{ formatMoney(row.value) }}
                          </td>
                          <td>
                            <badge :type="statusType(row.status)">
                              {{ formatStatus(row.status) }}
                            </badge>
                          </td>
                          <td>
                            {{ row.has_paid ? "Sim" : "Não" }}
                          </td>
                          <td>
                            <i
                              class="cursor-pointer ml-2 fas fa-pen text-primary"
                              @click="handleOpenModalEdit(row)"
                            />
                          </td>
                        </tr>
                      </template>
                    </tbody>
                  </table>
                </template>
              </div>
            </div>
          </template>
          <p v-if="empty" class="text-center text-warning mt-3">
            Nenhuma mensalidade registrada até o momento.
          </p>
        </div>
      </div>
      <div v-if="!control.empty" class="row">
        <div class="col-lg-12 mb-3 text-right">
          <p class="text-muted">
            Exibindo
            <span class="font-weight-bold">{{ payments.length }}</span> de um
            total de
            <span class="font-weight-bold">{{ control.total }}</span>
            mensalidades.
          </p>
        </div>
        <div class="col-lg-12">
          <base-pagination
            :page-count="control.lastPage"
            :per-page="control.limit"
            :value="control.page"
            size="md"
            align="center"
            @input="handlePageInput"
          />
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
          <div class="row ml-lg-2 pb-3">
            <div class="col-lg-6">
              <label class="form-control-label d-block">
                Anexar arquivo (opcional)
              </label>
              <div class="d-flex align-items-center">
                <file-select
                  v-model="modalEdit.file"
                  :title="
                    modalEdit.file_url ? 'Alterar arquivo' : 'Anexar arquivo'
                  "
                  type="info"
                  accept="application/pdf"
                  class="m-0"
                />
                <a
                  v-if="modalEdit.file_url"
                  class="cursor-pointer"
                  :href="modalEdit.file_url"
                  target="_blank"
                >
                  <i class="fas fa-eye ml-2" />
                  Visualizar
                </a>
              </div>
            </div>
            <div class="col-lg-6">
              <label class="form-control-label d-block">
                Marcar como pago
              </label>
              <base-checkbox v-model="modalEdit.newPaid" />
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
  </div>
</template>

<script>
import api from "../../services/api";
import datas from "../../assets/datas.json";
import Badge from "../../components/Badge.vue";

export default {
  name: "ListMensalidadesAssociate",
  components: { Badge },
  data() {
    return {
      empty: true,
      payments: [],
      money: {
        decimal: ",",
        thousands: ".",
        prefix: "R$ ",
        suffix: "",
        precision: 2,
        masked: false,
      },
      control: {
        page: 1,
        limit: 10,
        lastPage: 0,
        total: 0,
        empty: "",
      },
      modals: {
        modalEdit: false,
      },
      modalEdit: {
        id: 0,
        name: "",
        has_paid: false,
        newPaid: false,
        newStatus: "",
        file_url: "",
        error: "",
        file: null,
      },
      meses: [],
    };
  },
  computed: {},
  async mounted() {
    this.meses = datas.meses;
    this.loadPayments(this.control.page);
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
      const formattedValue = value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
      return formattedValue;
    },
    handleOpenModalEdit(row) {
      this.modalEdit = row;
      this.modalEdit.newPaid = row.has_paid;
      this.modals.modalEdit = true;
    },
    async handleEditPayment() {
      const loader = this.$loading.show({
        container: this.$refs.edit_payment,
        width: 90,
        height: 90,
      });
      try {
        const config = {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };
        const formData = new FormData();
        formData.append("has_paid", this.modalEdit.newPaid);
        if (this.modalEdit.file)
          formData.append("file_receipt", this.modalEdit.file);

        const { data } = await api.put(
          `associate/payments/${this.modalEdit.id}`,
          formData,
          config
        );
        this.modalEdit.has_paid = this.modalEdit.newPaid;
        this.modalEdit.file_url = data.file_url;
        this.modals.modalEdit = false;
        this.$toasted.success("Pagamento atualizado com sucesso!");
      } catch (e) {
        this.$toasted.error("Ocorreu um erro ao buscar os pagamentos");
      } finally {
        loader.hide();
      }
    },
    async loadPayments(page) {
      const loader = this.$loading.show({
        container: this.$refs.mensality_loading,
        width: 90,
        height: 90,
      });
      try {
        const { data: mensalidades } = await api.get(
          `associate/payments?page=${page}&limit=${this.control.limit}`
        );
        this.payments = mensalidades.data.map((d) => ({ ...d, expand: false }));
        this.empty = !mensalidades.data.length;
        this.control = mensalidades.meta;
        loader.hide();
      } catch (e) {
        this.$toasted.error("Ocorreu um erro ao buscar os pagamentos");
      }
    },
    async handlePageInput(page) {
      if (this.control.page === page) return;
      await this.loadMeetings(page);
    },
  },
};
</script>

<style scoped></style>
