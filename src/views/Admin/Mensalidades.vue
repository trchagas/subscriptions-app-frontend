<template>
  <div>
    <base-header type="gradient-default" class="pb-3 py-5 pt-md-8">
      <div class="container-fluid d-flex align-items-center">
        <div class="row">
          <div class="col-lg-8 col-md-10">
            <p class="text-white mt-3 mb-5">
              Aqui você pode gerenciar as mensalidades cadastradas.
            </p>
          </div>
        </div>
      </div>
    </base-header>
    <div ref="mensality_loading" class="container-fluid mt--4">
      <div class="btn-group d-grid">
        <base-button
          class="mb-4"
          :class="{
            'bg-success': type === 'partners',
            'border-success': type === 'partners',
            'bg-dark': type === 'associates',
            'border-dark': type === 'associates',
          }"
          @click="handleType('partners')"
        >
          Parceiros
        </base-button>
        <base-button
          class="mb-4"
          :class="{
            'bg-success': type === 'associates',
            'border-success': type === 'associates',
            'bg-dark': type === 'partners',
            'border-dark': type === 'partners',
          }"
          @click="handleType('associates')"
        >
          Associados
        </base-button>
      </div>
      <div ref="lessons_table" class="card shadow table-container vld-parent">
        <div class="card-header border-0">
          <div class="row align-items-center">
            <div class="col">
              <h3 class="mb-0">Lista de mensalidades cadastradas</h3>
            </div>
            <div class="row text-center">
              <div class="col-12">
                <base-button
                  :custom="true"
                  size="sm"
                  type="primary"
                  @click="handleNewMensality"
                >
                  <i class="fas fa-plus mr-1" />
                  Cadastrar {{ type === "partners" ? "mensalidade" : "regra" }}
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
                    <th>Ano</th>
                    <th>Mês</th>
                    <th>Expandir</th>
                  </slot>
                </tr>
              </thead>
              <tbody class="list">
                <template v-for="(row, index) in payments">
                  <tr
                    :key="index"
                    data-toggle="collapse"
                    :data-target="'#demo1'"
                    class="accordion-toggle"
                  >
                    <td class="py-4">{{ index + 1 }}</td>
                    <td>
                      {{ row.year }}
                    </td>
                    <td>
                      {{ formatMonth(row.month) }}
                    </td>
                    <td>
                      <i
                        :class="[
                          'ml-1 text-primary btn-sort fas cursor-pointer',
                          row.expand ? 'fa-caret-down' : 'fa-caret-up',
                        ]"
                        :title="`Ordenar ${
                          row.expand ? 'descendente (Z-A)' : 'ascendente (A-Z)'
                        }`"
                        @click="row.expand = !row.expand"
                      />
                    </td>
                  </tr>
                  <tr
                    :key="index + 'expand'"
                    :class="[
                      'accordian-body collapse',
                      row.expand ? 'show' : '',
                    ]"
                  >
                    <td colspan="12">
                      <table
                        :id="'collpase' + index"
                        class="table tablesorter table align-items-center table-flush table-striped"
                      >
                        <thead>
                          <tr class="info">
                            <th>Vencimento</th>
                            <th>Valor</th>
                            <th>
                              {{
                                type === "partners" ? "Parceiros" : "Associado"
                              }}
                            </th>
                            <th>Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            v-for="(payment, idx) in row.payments"
                            :key="idx"
                            data-toggle="collapse"
                            class="accordion-toggle"
                            data-target="#demo10"
                          >
                            <td>{{ formatDate(payment.validity) }}</td>
                            <td>
                              {{ formatMoney(payment.value) }}
                            </td>
                            <td>
                              {{
                                type === "partners"
                                  ? payment.partner_count
                                  : payment.name
                              }}
                            </td>
                            <td>
                              <i
                                v-if="type === 'partners'"
                                class="cursor-pointer ml-2 fas fa-eye text-primary"
                                @click="
                                  $router.push(
                                    `/diretoria/mensalidades-parceiro/${payment.id}/visualizar`
                                  )
                                "
                              />
                              <i
                                v-else
                                class="cursor-pointer ml-2 fas fa-eye text-primary"
                                @click="
                                  $router.push(
                                    `usuarios/associados/${payment.associate_id}/visualizar`
                                  )
                                "
                              />
                              <i
                                v-if="type === 'partners'"
                                class="cursor-pointer ml-2 fas fa-pen text-primary"
                                @click="
                                  $router.push(
                                    `/diretoria/mensalidades-parceiro/${payment.id}/editar`
                                  )
                                "
                              />
                              <i
                                class="cursor-pointer ml-2 fas fa-trash text-primary"
                                @click="handleOpenModalDelete(row, payment)"
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
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
      :show.sync="modal.show"
      modal-classes="modal-default modal-dialog-centered"
    >
      <h6 id="modal-title-notification" slot="header" class="modal-title">
        Atenção!
      </h6>
      <div ref="modal_confirmation" class="vld-parent">
        <div class="py-3 text-center">
          <i class="ni ni-money-coins ni-3x" />
          <h4 class="heading mt-4">Confirmar exclusão</h4>
          <p class="mt-3 mb-0">
            Você confirma a exclusão da mensalidade com vencimento para o dia
            <span class="font-weight-bold">
              {{ formatDate(modal.validity) }}
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
          @click="modal.show = false"
        >
          Voltar
        </base-button>
        <base-button type="white text-success" @click="handleDelete">
          Excluir
        </base-button>
      </template>
    </modal>
  </div>
</template>

<script>
import api from "../../services/api";
import datas from "../../assets/datas.json";

export default {
  name: "ListMensalidades",
  data() {
    return {
      type: "partners",
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
      modal: {
        show: false,
        id: "",
        validity: "",
        row: "",
      },
    };
  },
  computed: {},
  mounted() {
    this.loadPartnerPayments(this.control.page);
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
    formatMonth(month) {
      return datas.meses[month];
    },
    handleOpenModalDelete(payments, mensality) {
      this.modal.show = true;
      this.modal.validity = mensality.validity;
      this.modal.id = mensality.id;
      this.modal.row = payments;
    },
    async loadAssociatePayments(page) {
      const loader = this.$loading.show({
        container: this.$refs.mensality_loading,
        width: 90,
        height: 90,
      });
      try {
        const { data: payments } = await api.get(
          `admin/associate-payments?page=${page}&limit=${this.control.limit}`
        );
        this.payments = payments.data.map((d) => ({ ...d, expand: false }));
        this.empty = !payments.data.length;
        this.control = payments.meta;
        loader.hide();
      } catch (e) {
        this.$toasted.error("Ocorreu um erro ao buscar os parceiros");
      }
    },
    async loadPartnerPayments(page) {
      const loader = this.$loading.show({
        container: this.$refs.mensality_loading,
        width: 90,
        height: 90,
      });
      try {
        const { data: payments } = await api.get(
          `admin/partner-payments?page=${page}&limit=${this.control.limit}`
        );
        this.payments = payments.data.map((d) => ({ ...d, expand: false }));
        this.empty = !payments.data.length;
        this.control = payments.meta;
        loader.hide();
      } catch (e) {
        this.$toasted.error("Ocorreu um erro ao buscar os pagamentos");
      }
    },

    async handleDelete(e) {
      e.preventDefault();
      const loader = this.$loading.show({
        container: this.$refs.modal_confirmation,
        width: 90,
        height: 90,
        opacity: 0,
        color: "white",
      });
      this.error = "";
      try {
        const route = this.type === "partners" ? "partner" : "associate";
        await api.delete(`admin/${route}-payments/${this.modal.id}`);

        this.$toasted.show("Mensalidade excluída com sucesso");
        this.modal.show = false;
        this.modal.row.payments = this.modal.row.payments.filter(
          (p) => p.id !== this.modal.id
        );
      } catch (e) {
        const genericError = "Ocorreu um erro ao excluir a mensalidade.";
        const hasErrorResponseData = e.response && e.response.data;
        let customError = genericError;
        if (hasErrorResponseData) {
          const data = e.response.data;
          if (data[0] && data[0].message) customError = data[0].message;
          else if (data.message) customError = data.message;
        }
        this.error = hasErrorResponseData ? customError : genericError;
        this.$toasted.error(genericError);
        this.modals.modalConfirmation = false;
      } finally {
        loader.hide();
      }
    },
    orderLessons(field) {
      this.payments = this.payments.sort((a, b) => {
        if (a[field] < b[field]) return -1;
        if (a[field] > b[field]) return 1;
        return 0;
      });
    },
    handleOpenEdit(payments) {
      this.$router.push({
        name: "admin_mensalidades_edit",
        params: {
          id: payments.id,
        },
      });
    },
    handleNewMensality() {
      if (this.type === "partners")
        this.$router.push("/diretoria/mensalidades-parceiro/novo");
      else this.$router.push("/diretoria/mensalidades-associado");
    },
    handleType(type) {
      if (this.type === type) return;
      this.type = type;
      this.control.page = 1;
      if (type === "partners") this.loadPartnerPayments(this.control.page);
      else this.loadAssociatePayments(this.control.page);
    },
    async handlePageInput(page) {
      if (this.control.page === page) return;
      if (this.type === "partners") this.loadPartnerPayments(page);
      else this.loadAssociatePayments(page);
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
