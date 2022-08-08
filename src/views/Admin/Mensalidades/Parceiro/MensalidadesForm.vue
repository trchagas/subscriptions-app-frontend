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
              Aqui é possível cadastrar um nova cobrança de mensalidade. É
              possível cadastrar a cobrança para um grupo de usuários e,
              posteriormente, acompanhar o estado do pagamento (efetuado ou
              pendente).
            </p>
          </div>
        </div>
      </div>
    </base-header>

    <div class="container-fluid mt--7">
      <div class="row">
        <div class="col-xl-8">
          <card shadow type="secondary">
            <div slot="header" class="bg-white border-0">
              <div class="row align-items-center">
                <div class="col-8">
                  <h3 class="mb-0">
                    <i class="ni ni-money-coins mr-2" /> Nova Mensalidade
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
                    <base-input label="Mês referente*">
                      <select
                        v-model="model.mensality.month"
                        class="form-control"
                      >
                        <option value="" selected disabled>
                          Selecione uma opção
                        </option>
                        <option
                          v-for="(mes, idx) in meses"
                          :key="idx"
                          :value="idx"
                        >
                          {{ mes }}
                        </option>
                      </select>
                    </base-input>
                  </div>
                  <div class="col-lg-6">
                    <base-input label="Ano referente*">
                      <select
                        v-model="model.mensality.year"
                        class="form-control"
                      >
                        <option value="" selected disabled>
                          Selecione uma opção
                        </option>
                        <option v-for="ano in anos" :key="ano">
                          {{ ano }}
                        </option>
                      </select>
                    </base-input>
                  </div>
                  <div class="col-lg-6">
                    <base-input label="Valor*">
                      <money
                        v-model="model.mensality.value"
                        v-bind="money"
                        class="form-control"
                      />
                    </base-input>
                  </div>
                  <div class="col-lg-6">
                    <label class="form-control-label d-block">
                      Data de validade
                    </label>
                    <base-input
                      v-model="model.mensality.validity"
                      addon-left-icon="fas fa-calendar"
                      type="date"
                      placeholder="Data de vencimento"
                    />
                  </div>
                </div>
                <hr class="mt-2 mb-4" />
                <h6 class="heading-small text-muted mb-4">Participantes</h6>
                <div class="row pl-lg-4">
                  <div class="col-lg-6">
                    <model-select
                      v-model="parceiro"
                      placeholder="Voluntarios"
                      class="participants_select w-100"
                      :options="parceiros"
                    />
                  </div>
                  <div class="col-lg-12 mt-4">
                    <label class="form-control-label"> Participantes </label>
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
                <div v-if="error" class="row ml-lg-2">
                  <div class="col-lg-12 text-center">
                    <base-alert type="danger">{{ error }}</base-alert>
                  </div>
                </div>
                <div class="text-right">
                  <base-button
                    type="primary"
                    class="mt-3"
                    :custom="true"
                    :disabled="!isValidModel"
                    @click="handleOpenModalConfirmation"
                  >
                    Cadastrar mensalidade
                  </base-button>
                </div>
              </form>
            </template>
          </card>
        </div>
      </div>
    </div>
    <modal
      :show.sync="modals.modalConfirmation"
      modal-classes="modal-default modal-dialog-centered"
    >
      <h6 id="modal-title-notification" slot="header" class="modal-title">
        Atenção!
      </h6>
      <div ref="modal_confirmation" class="vld-parent">
        <div class="py-3 text-center">
          <i class="ni ni-money-coins ni-3x" />
          <h4 class="heading mt-4">Confirmar criação</h4>
          <p class="mt-3 mb-0">
            Você confirma a criação da mensalidade com vencimento para o dia
            <span class="font-weight-bold">
              {{ formatDate(model.mensality.validity) }}
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
          @click="modals.modalConfirmation = false"
        >
          Voltar
        </base-button>
        <base-button type="white text-success" @click="handleSubmit">
          Confirmar criação
        </base-button>
      </template>
    </modal>
  </div>
</template>
<script>
import api from "@/services/api.js";
import datas from "../../../../assets/datas.json";

import { Money } from "v-money";
import { ModelSelect } from "vue-search-select";
import "vue-search-select/dist/VueSearchSelect.css";
import BaseInput from "../../../../components/BaseInput.vue";

export default {
  name: "MensalidadeForm",
  components: {
    Money,
    ModelSelect,
  },
  data() {
    BaseInput;
    return {
      model: {
        mensality: {
          validity: "",
          value: 0,
          month: "",
          year: "",
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
      meses: {},
      anos: [],
      parceiros: [],
      parceiro: "",
      participantes: [],
      requiredFields: ["validity", "value", "month", "year"],
      modals: {
        modalConfirmation: false,
      },
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
  watch: {
    parceiro() {
      if (!this.parceiro) return;
      const newPartner = this.parceiros.find((p) => p.value === this.parceiro);
      this.participantes = [...this.participantes, newPartner];
      this.parceiros = this.parceiros.filter(
        (p) => p.value !== newPartner.value
      );
      this.parceiro = null;
    },
  },
  mounted() {
    this.loadPartners();
    this.meses = datas.meses;
    const nextYear = new Date().getFullYear() + 1;
    const anos = [];
    for (let i = nextYear; i >= datas.ano_inicial; i--) {
      anos.push(i);
    }
    this.anos = anos;
  },
  methods: {
    async loadPartners() {
      const loader = this.$loading.show({
        container: this.$refs.mensality_loading,
        width: 90,
        height: 90,
      });
      try {
        const { data: users } = await api.get("admin/partner-payments/users");
        this.parceiros = users.map((t) => ({
          value: t.user_id,
          text: t.name,
        }));
        loader.hide();
      } catch (e) {
        this.$toasted.error("Ocorreu um erro ao buscar os pagamentos");
      }
    },
    delParticipante(index) {
      const [newParticipante] = this.participantes.splice(index, 1);
      this.parceiros = [...this.parceiros, newParticipante];
    },
    handleOpenModalConfirmation() {
      this.modals.modalConfirmation = true;
    },
    async handleSubmit(e) {
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
        const paymentData = {
          ...this.model.mensality,
          participants: this.participantes.map((p) => p.value),
        };
        await api.post("/admin/partner-payments", paymentData);
        this.$toasted.show("Nova mensalidade cadastradra com sucesso");
        this.$router.push("/diretoria/mensalidades");
      } catch (e) {
        const genericError = "Ocorreu um erro ao cadastrar a mensalidade.";
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
      }
      loader.hide();
    },
  },
};
</script>
<style></style>
