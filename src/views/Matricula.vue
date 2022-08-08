<template>
  <div>
    <base-header type="gradient-default" class="pb-3 py-5 pt-md-8">
      <div class="container-fluid d-flex align-items-center">
        <div class="row">
          <div class="col-lg-8 col-md-10">
            <p class="text-white mt-3 mb-5">
              Deseja se matricular em uma das turmas? Basta ir até a sede da
              Orquestrando Arte (Antiga Reitoria - UFSM) com os seguintes
              documentos:
            </p>
          </div>
        </div>
      </div>
    </base-header>
    <div class="container-fluid">
      <div class="offset-xl-2 col-xl-8 col-lg-12 mb-4 px-2">
        <div class="px-3 row my-3 justify-content-between">
          <div class="btn-group d-flex w-50">
            <base-button
              class="flex-grow-1 d-inline-block"
              :class="{
                'bg-success': type === 'registry',
                'border-success': type === 'registry',
                'bg-dark': type === 'coral',
                'border-dark': type === 'coral',
              }"
              @click="type = 'registry'"
            >
              Matrícula
            </base-button>
            <base-button
              class="flex-grow-1 d-inline-block"
              :class="{
                'bg-success': type === 'coral',
                'border-success': type === 'coral',
                'bg-dark': type === 'registry',
                'border-dark': type === 'registry',
              }"
              @click="type = 'coral'"
            >
              Coral
            </base-button>
          </div>
          <div
            type="button"
            class="btn btn-default bg-info border-info"
            @click="
              openWindow(
                'https://www.google.com/maps/place/Predio+Antiga+Reitoria+UFSM/data=!3m1!4b1!4m5!3m4!1s0x0:0xda9bf4016775ed83!8m2!3d-29.6880466!4d-53.8086842'
              )
            "
          >
            Localização
          </div>
        </div>
        <card shadow type="secondary">
          <div slot="header" class="bg-white border-0">
            <div class="row align-items-center">
              <div class="col-12">
                <h3 class="mb-0">Documentos</h3>
              </div>
            </div>
          </div>
          <ul class="list-group list-group-flush">
            <li class="list-group-item">Foto 3x4</li>
            <div v-if="type === 'registry'">
              <li class="d-none" />
              <li class="list-group-item">
                Cópia do documento do aluno (identidade ou certidão de
                nascimento)
              </li>
              <li class="list-group-item">
                Cópia da identidade do responsável legal (quando menor de idade)
              </li>
              <li class="list-group-item">
                Cópia do atestado de matrícula ou o atestado de frequência
                escolar
              </li>
              <li class="list-group-item">Cópia do comprovante de endereço</li>
              <li class="list-group-item">
                Apresentar NIS (Número de Identificação Social) - cadastro único
                (quando for o caso).
              </li>
              <li class="list-group-item">
                Ficha de Inscrição
                <div
                  type="button"
                  class="btn btn-default ml-2"
                  @click="openWindow('/docs/FichaInscricao.doc')"
                >
                  Download
                </div>
              </li>
            </div>
            <div v-else>
              <li class="d-none" />
              <li class="list-group-item">Cópia da identidade</li>
              <li class="list-group-item">Cópia do comprovante de endereço</li>
              <li class="list-group-item">
                Ficha de Inscrição
                <div
                  type="button"
                  class="btn btn-default ml-2"
                  @click="openWindow('/docs/FichaCoral.pdf')"
                >
                  Download
                </div>
              </li>
            </div>
          </ul>
        </card>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "PublicMatricula",
  data() {
    return {
      type: "registry",
    };
  },
  methods: {
    openWindow(file) {
      window.open(file, "_blank");
    },
  },
};
</script>
<style scoped>
.card-icon {
  opacity: 0.5;
  font-size: 1.1rem;
}

.card-link:hover {
  cursor: pointer;
  -webkit-box-shadow: 0 7px 14px rgba(50, 50, 93, 0.1),
    0 3px 6px rgba(0, 0, 0, 0.08);
  box-shadow: 0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08);
  -webkit-transform: translateY(-1px);
  transform: translateY(-1px);
}
</style>
