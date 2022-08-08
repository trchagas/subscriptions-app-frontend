<template>
  <div class="col-xl-12 mb-4">
    <div>
      <div class="card shadow table-container">
        <div class="card-header border-0">
          <div class="row align-items-center">
            <div class="col-12">
              <h3 class="mb-0">
                Lista de atendimentos
                <span v-if="appointments.length" class="float-right">
                  <span class="font-weight-200 mx-2 small">
                    {{ appointments.length }}
                    {{
                      appointments.length === 1 ? "atendimento" : "atendimentos"
                    }}
                  </span>
                </span>
              </h3>
            </div>
          </div>
        </div>
        <div class="table-responsive">
          <base-table
            class="table align-items-center table-flush"
            thead-classes="thead-light"
            tbody-classes="list"
            :data="appointments"
            type="hover"
          >
            <template slot="columns">
              <th>#</th>
              <th>Tipo</th>
              <th>Nome</th>
              <th>Data</th>
              <th>Ação</th>
            </template>
            <template slot-scope="{ row, index }">
              <td class="py-4">{{ index + 1 }}</td>
              <td>{{ row.type ? row.type.title : "Sem tipo" }}</td>
              <td>{{ row.name }}</td>
              <td>{{ formatDate(row.date) }}</td>
              <td>
                <base-button
                  v-tooltip.bottom="'Excluir atendimento'"
                  type="white"
                  size="sm"
                  class="text-danger"
                  @click="handleOpenModalRemove(row)"
                >
                  <i class="fas fa-trash text-danger" />
                </base-button>
                <router-link
                  v-tooltip.bottom="'Editar atendimento'"
                  :to="`/diretoria/atendimentos/${row.id}/editar`"
                  class="btn btn-white py-1 px-2"
                >
                  <i class="fas fa-edit text-info" />
                </router-link>
              </td>
            </template>
          </base-table>
          <p v-if="!appointments.length" class="text-center text-warning mt-3">
            Não há atendimentos cadastradas.
          </p>
        </div>
      </div>
    </div>

    <modal
      :show.sync="modalRemove.show"
      modal-classes="modal-default modal-dialog-centered"
      body-classes="pb-2"
    >
      <h6 id="modal-title-notification" slot="header" class="modal-title">
        Atenção!
      </h6>
      <div ref="modal_remove" class="vld-parent">
        <div class="text-center">
          <i class="fas fa-trash fa-3x" />
          <h4 class="heading mt-4">Confirmar exclusão</h4>
          <p class="mt-3">
            Você confirma a remoção do atendimento
            <span class="font-weight-bold">
              {{ modalRemove.appointment.title }}
            </span>
            ?
          </p>
        </div>
        <base-alert
          v-if="modalRemove.error"
          type="danger"
          class="text-center mb-2"
        >
          Ocorreu um erro ao remover o atendimento. Por favor, tente novamente.
        </base-alert>
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
        <base-button type="white text-danger" @click="handleRemoveAppointment">
          Confirmar exclusão
        </base-button>
      </template>
    </modal>
  </div>
</template>
<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import api from "@/services/api";

export default {
  name: "TipoAtendimentoCard",
  components: {},
  props: {
    appointments: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      modalView: {
        show: false,
        appointment: "",
      },
      modalRemove: {
        show: false,
        appointment: "",
        error: "",
      },
      editorReadOnly: {
        placeholder: "...",
        readOnly: true,
        theme: "bubble",
      },
    };
  },
  methods: {
    async handleOpenModalView(appointment) {
      this.modalView.appointment = appointment;
      this.modalView.show = true;
    },
    async handleRemoveAppointment() {
      const loader = this.$loading.show({
        container: this.$refs.modal_remove,
        width: 90,
        height: 90,
        opacity: 0,
      });
      this.modalRemove.error = "";
      try {
        const removeId = this.modalRemove.appointment.id;
        await api.delete(`/admin/appointments/${removeId}`);
        this.$toasted.show("Atendimento removida com sucesso!");
        this.modalRemove.show = false;
        const index = this.appointments.findIndex((m) => m.id === removeId);
        this.appointments.splice(index, 1);
      } catch (e) {
        this.modalRemove.error = true;
        this.$toasted.error("Ocorreu um erro ao remover o atendimento.");
      } finally {
        loader.hide();
      }
    },
    handleOpenModalRemove(appointment) {
      this.modalRemove.error = "";
      this.modalRemove.appointment = appointment;
      this.modalRemove.show = true;
    },
    truncate(text, stop = 30, clamp = "...") {
      if (!text) return "-";
      return text.slice(0, stop) + (stop < text.length ? clamp : "");
    },
    formatDate(date) {
      var data = new Date(date),
        dia = data.getDate().toString().padStart(2, "0"),
        mes = (data.getMonth() + 1).toString().padStart(2, "0"),
        ano = data.getFullYear();
      return dia + "/" + mes + "/" + ano;
    },
  },
};
</script>
<style scoped></style>
