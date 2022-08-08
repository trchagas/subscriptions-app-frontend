<template>
  <div>
    <base-header type="gradient-default" class="header pb-8 py-5 pt-md-8">
      <div class="container-fluid d-flex align-items-center">
        <div class="row">
          <div class="col-12 mt-0 mt-md-4 mt-lg-0 d-block">
            <router-link
              :to="`/diretoria/usuarios/associados?status=${$route.query.status}`"
              class="btn-link font-weight-normal text-white"
              title="Voltar para a listagem de associados"
            >
              <i class="fas fa-chevron-left mr-1" /> Voltar
            </router-link>
          </div>
          <div class="col-lg-7 col-md-10">
            <p class="text-white mt-4 mb-2">
              Aqui você poderá visualizar as informações de usuário do
              associado, o que inclui ver dados de usuário, foto de perfil e
              histórico de mensalidades.
            </p>
          </div>
        </div>
      </div>
    </base-header>
    <div class="container-fluid mt--6">
      <div class="row">
        <div class="col-xl-4 order-xl-2 mb-5 mb-xl-0">
          <div
            ref="associado_profile_picture"
            class="card card-profile shadow vld-parent"
          >
            <div class="row justify-content-center">
              <div class="card-profile-image">
                <img :src="getAssociadoProfilePicturePath" />
              </div>
            </div>
            <div class="card-body pt-6 pb-4">
              <div class="row">
                <div class="col">
                  <div class="text-center mt-6">
                    <h2 class="mb-2 card-title text-orange">
                      {{ model.associado.name }}
                    </h2>
                    <div v-if="model.associado.email">
                      <div class="h5 font-weight-300 mb-1">
                        <email-link :email-address="model.associado.email" />
                      </div>
                      <div class="h5 font-weight-300 mb-1">
                        <whatsapp-link :phone-number="model.associado.phone" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-xl-8 order-xl-1">
          <card shadow type="secondary">
            <div slot="header" class="bg-white border-0">
              <div class="row align-items-center">
                <div class="col-8">
                  <h3 class="mb-0">
                    Perfil do associado
                    <span class="text-warning">{{
                      model.associado.name.split(" ")[0]
                    }}</span>
                  </h3>
                </div>
                <div class="col">
                  <base-button
                    class="float-right"
                    @click="
                      $router.push(
                        `/diretoria/usuarios/associados/${model.associado.user_id}/editar`
                      )
                    "
                  >
                    <i class="fas fa-pen mr-2" />Editar
                  </base-button>
                </div>
              </div>
            </div>
            <template>
              <form ref="associado_form" role="form" class="vld-parent">
                <div class="row ml-1">
                  <h6 class="heading-small text-muted mb-4">Status da conta</h6>
                </div>
                <div class="row ml-2">
                  <div class="col-12">
                    <div>
                      <badge
                        v-if="model.associado.account_validated"
                        type="success"
                        title="A conta do associado está validada."
                      >
                        <i class="fas fa-info-circle mr-1" /> Conta validada
                      </badge>
                      <badge
                        v-else
                        type="warning"
                        title="Enquanto a conta não for validada o associado não terá acesso as funcionalidades do portal."
                      >
                        <i class="fas fa-info-circle mr-1" /> Conta não validada
                      </badge>
                    </div>
                  </div>
                </div>
                <hr class="my-4" />
                <div class="row ml-1">
                  <h6 class="heading-small text-muted mb-4">
                    Informações básicas
                  </h6>
                </div>
                <div class="row ml-lg-2">
                  <div class="col-lg-6">
                    <label class="form-control-label" for="name"> Nome </label>
                    <p>
                      {{ model.associado.name }}
                    </p>
                  </div>
                  <div class="col-lg-6">
                    <label class="form-control-label" for="name">
                      Telefone (com DDD)*
                    </label>
                    <p>
                      {{ formatPhone(model.associado.phone) }}
                    </p>
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
                          <h3 class="mb-0">Mensalidades do usuário</h3>
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
                                <th>Ações</th>
                              </slot>
                            </tr>
                          </thead>
                          <tbody class="list">
                            <template
                              v-for="(row, index) in model.mensalidades.data"
                            >
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
                        <p
                          v-if="model.mensalidades.empty"
                          class="text-center text-warning mt-3"
                        >
                          Nenhuma mensalidade registrada até o momento.
                        </p>
                      </template>
                    </div>
                    <div
                      v-if="!model.mensalidades.control.empty"
                      class="row mt-3"
                    >
                      <div class="col-lg-12">
                        <base-pagination
                          :page-count="model.mensalidades.control.lastPage"
                          :per-page="model.mensalidades.control.limit"
                          :value="model.mensalidades.control.page"
                          size="md"
                          align="center"
                          @input="handlePageInput"
                        />
                      </div>
                    </div>
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
                Associado Pagou?
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
                  <option value="pending">Pendente</option>
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
            Você confirma a exclusão da cobrança da mensalidade referente a data
            de validade de
            <span class="font-weight-bold">
              {{ formatDate(modalRemove.validity) }}
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
import api from "../../../services/api";
import datas from "../../../assets/datas.json";

export default {
  name: "AdminEditarAssociados",
  data() {
    return {
      model: {
        user: {
          newPassword: "",
          newPassword_confirmation: "",
        },
        associado: {
          user_id: "",
          email: "",
          password: "",
          name: "",
          phone: "",
          profile_picture: {},
          account_validated: false,
        },
        mensalidades: {
          data: [],
          empty: true,
          control: {
            page: 1,
            limit: 10,
            lastPage: 0,
            total: 0,
            empty: "",
          },
        },
        meses: [],
        profile_picture: null,
      },
      modals: {
        modalRemove: false,
        modalEdit: false,
      },
      modalRemove: {},
      modalEdit: {},
      showComplementarInfo: true,
    };
  },
  computed: {
    getAssociadoProfilePicturePath() {
      const defaultProfilePicturePath =
        "/img/pages/default_profile_picture.png";
      const profilePicture = this.model.associado.profile_picture;
      if (!profilePicture) return defaultProfilePicturePath;
      return profilePicture.url;
    },
  },
  async mounted() {
    this.meses = datas.meses;
    this.model.mensalidades.control.page = 1;
    this.loadAssociado();
    this.loadMensalidades(this.model.mensalidades.control.page);
  },
  methods: {
    handlePageInput(page) {
      if (this.model.mensalidades.control.page === page) return;
      this.loadMensalidades(page);
    },
    formatMoney(value) {
      return value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
    },
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
    async handleEditPayment() {
      const loader = this.$loading.show({
        container: this.$refs.edit_payment,
        width: 90,
        height: 90,
      });
      try {
        await api.put(`admin/associate-payments/${this.modalEdit.id}`, {
          status: this.modalEdit.newStatus,
        });
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
        await api.delete(`admin/associate-payments/${this.modalRemove.id}`);
        this.model.mensalidades.data = this.model.mensalidades.data.filter(
          (row) => row.id !== this.modalRemove.id
        );
        this.modalRemove = {};
        this.modals.modalRemove = false;
        this.model.mensalidades.empty = !this.model.mensalidades.data.length;
        this.model.mensalidades.control.empty =
          !this.model.mensalidades.data.length;
        if (this.model.mensalidades.empty) this.loadMensalidades(1);
        this.$toasted.success("Cobrança excluída com sucesso");
      } catch (e) {
        this.$toasted.error("Ocorreu um erro ao deletar o pagamento");
      } finally {
        loader.hide();
      }
    },
    async loadMensalidades(page) {
      const loader = this.$loading.show({
        container: this.$refs.lessons_table,
        width: 90,
        height: 90,
      });
      try {
        const limit = this.model.mensalidades.control.limit;
        const { data } = await api.get(
          `/admin/associates/${this.model.associado.user_id}/payments?page=${page}&limit=${limit}`
        );
        this.model.mensalidades.data = data.data;
        this.model.mensalidades.control = data.meta;
        this.model.mensalidades.empty = !data.data.length;
        loader.hide();
      } catch (e) {
        this.error =
          "Ocorreu um erro ao recuperar as informações de mensalidades do usuário.";
        this.$toasted.error("Erro ao recuperar as informações");
      }
    },
    async loadAssociado() {
      const loaderForm = this.$loading.show({
        container: this.$refs.associado_form,
        width: 90,
        height: 90,
      });
      const loaderProfilePicture = this.$loading.show({
        container: this.$refs.associado_profile_picture,
        opacity: 0,
        width: 130,
        height: 130,
      });
      try {
        this.model.associado.user_id = this.$route.params.id;
        const { data } = await api.get(
          `/admin/associates/${this.model.associado.user_id}`
        );
        Object.assign(this.model.associado, data);
        this.model.associado.email = data.user.email;
        loaderForm.hide();
        loaderProfilePicture.hide();
      } catch (e) {
        this.error =
          "Ocorreu um erro ao recuperar as informações de perfil do usuário.";
        this.$toasted.error("Erro ao recuperar as informações");
      }
    },
    formatPhone(phone) {
      let format = phone;

      format = format.replace(/\D/g, "");
      if (format.length <= 7) {
        format = format.replace(/^(\d{2})(\d)/, "($1) $2");
      } else if (format.length <= 10) {
        format = format.replace(/(\d{2})(\d{4})(\d)/g, "($1) $2-$3");
      } else if (format.length <= 11) {
        format = format.replace(/(\d{2})(\d{5})(\d)/g, "($1) $2-$3");
      } else {
        format = format
          .substr(0, 11)
          .replace(/(\d{2})(\d{5})(\d)/g, "($1) $2-$3");
      }

      return format;
    },
  },
};
</script>

<style scoped>
.card-profile-image img {
  width: 180px;
  height: 180px;
  border-radius: 10%;
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
