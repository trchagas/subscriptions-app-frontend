<template>
  <div class="card text-center flex-grow-1">
    <div class="card-profile-image">
      <img
        :src="student.profile_picture.url"
        class="card-image my-3"
        alt="..."
      />
    </div>
    <div class="card-body mt-8 pt-0 pb-3">
      <h2 class="card-title text-orange mb-2">
        {{ student.name }}
      </h2>
      <div class="h5 font-weight-300 mb-2">
        <badge v-tooltip="'Área de atuação do aluno'" type="info">
          {{ student.working_area }}
        </badge>
      </div>
      <div>
        <div class="h5 font-weight-300 my-1">
          <email-link :email-address="student.user.email" />
        </div>
        <div v-if="student.phone" class="h5 font-weight-300 mb-1">
          <whatsapp-link :phone-number="student.phone" />
        </div>
        <div v-if="student.birth" class="mt-2 h5 font-weight-300">
          <i class="fas fa-birthday-cake mr-2" />{{
            formatDate(student.birth, "DD [de] MMMM")
          }}
        </div>
      </div>
      <div class="col-12 mt-3 mb-2 text-sm">
        <badge
          v-if="student.account_validated"
          type="success"
          title="A conta do aluno está validada."
        >
          <i class="fas fa-info-circle mr-1" />
          Conta validada
        </badge>
        <badge
          v-else
          type="warning"
          title="Enquanto a conta não for validada, o aluno não terá acesso as funcionalidades do portal"
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
          $router.push(`/diretoria/usuarios/alunos/${student.user_id}/editar`)
        "
      >
        <i class="fas fa-eye text-primary" />
      </base-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "StudentCard",
  props: ["student"],
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
