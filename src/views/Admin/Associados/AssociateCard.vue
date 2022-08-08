<template>
  <div class="card text-center flex-grow-1">
    <div class="card-profile-image">
      <img
        :src="associate.profile_picture.url"
        class="card-image my-3"
        alt="..."
      />
    </div>
    <div class="card-body mt-8 pt-0 pb-3">
      <h2 class="card-title text-orange mb-2">
        {{ associate.name }}
      </h2>
      <div>
        <div class="h5 font-weight-300 my-1">
          <email-link :email-address="associate.user.email" />
        </div>
        <div v-if="associate.phone" class="h5 font-weight-300 mb-1">
          <whatsapp-link :phone-number="associate.phone" />
        </div>
        <div v-if="associate.birth" class="mt-2 h5 font-weight-300">
          <i class="fas fa-birthday-cake mr-2" />{{
            formatDate(associate.birth, "DD [de] MMMM")
          }}
        </div>
      </div>
      <div class="col-12 mt-3 mb-2 text-sm">
        <badge
          v-if="associate.account_validated"
          type="success"
          title="A conta do voluntário está validada."
        >
          <i class="fas fa-info-circle mr-1" />
          Conta validada
        </badge>
        <badge
          v-else
          type="warning"
          title="Enquanto a conta não for validada, o voluntário não terá acesso as funcionalidades do portal"
        >
          <i class="fas fa-info-circle mr-1" />
          Conta não validada
        </badge>
      </div>
    </div>
    <div class="card-footer text-center">
      <base-button
        v-tooltip="'Visualizar usuário'"
        class="btn btn-white py-1 px-2"
        @click="
          $router.push(
            `/diretoria/usuarios/associados/${
              associate.user_id
            }/editar?status=${$route.query.status || 'active'}`
          )
        "
      >
        <i class="fas fa-eye text-primary" />
      </base-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "AssociateCard",
  props: { associate: { type: Object, required: true } },
};
</script>

<style scoped>
.card-image {
  width: 145px;
  height: 145px;
  border-radius: 10%;
  margin: auto;
}
</style>
