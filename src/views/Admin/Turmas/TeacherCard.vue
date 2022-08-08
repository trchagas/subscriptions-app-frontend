<template>
  <div class="card text-center flex-grow-1">
    <div class="card-profile-image">
      <img
        :src="teacher.profile_picture.url"
        class="card-image my-3"
        alt="..."
      />
    </div>
    <div class="card-body mt-8 pt-0 pb-3">
      <h2 class="card-title text-orange mb-2">
        {{ teacher.name }}
      </h2>
      <div class="h5 font-weight-300 mb-2">
        <badge v-tooltip="'Área de atuação do professor'" type="info">
          {{ teacher.working_area }}
        </badge>
      </div>
      <div>
        <div class="h5 font-weight-300 my-1">
          <email-link :email-address="teacher.user.email" />
        </div>
        <div v-if="teacher.phone" class="h5 font-weight-300 mb-1">
          <whatsapp-link :phone-number="teacher.phone" />
        </div>
        <div v-if="teacher.birth" class="mt-2 h5 font-weight-300">
          <i class="fas fa-birthday-cake mr-2" />{{
            formatDate(teacher.birth, "DD [de] MMMM")
          }}
        </div>
      </div>
    </div>
    <div class="card-footer text-center">
      <base-button
        v-tooltip="'Visualizar turmas'"
        class="btn btn-white py-1 px-2"
        @click="
          $router.push(`/diretoria/turmas/professores/${teacher.user_id}`)
        "
      >
        <i class="fas fa-eye text-primary" />
      </base-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "TeacherCard",
  props: ["teacher"],
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
