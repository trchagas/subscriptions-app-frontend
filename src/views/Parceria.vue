<template>
  <div>
    <base-header type="gradient-default" class="pb-3 py-5 pt-md-8">
      <div class="container-fluid d-flex align-items-center">
        <div class="row">
          <div class="col-lg-8 col-md-10">
            <p class="text-white mt-3 mb-5">Deseja firmar uma parceria?</p>
          </div>
        </div>
      </div>
    </base-header>
    <div ref="container" class="container-fluid">
      <div class="offset-xl-2 col-xl-8 col-lg-12 px-2 mt--5">
        <div class="px-3 row my-3 justify-content-between">
          <card shadow type="secondary">
            <div slot="header" class="bg-white border-0">
              <div class="row align-items-center">
                <div class="col-8">
                  <h3 class="mb-0">
                    <i class="fas fa-briefcase mr-2" /> Patrocínio ou Apoio
                  </h3>
                </div>
              </div>
            </div>
            <template>
              <div class="mb-2">
                <span>
                  É muito importante para a Orquestrando Arte que empresas como
                  a sua acreditem e contribuam com um futuro melhor para nossa
                  comunidade. Para firmar essa parceria entre em contato pelo
                  email: <b>orquestrandoarte@gmail.com</b> ou pelo whatsapp (55)
                  98114-9042.
                </span>
              </div>
              <b>
                Aqui a baixo algumas das marcas que acreditam no nosso sonho.
              </b>
            </template>
          </card>
        </div>
      </div>
      <hr />
      <div class="partners-container">
        <h4 class="text-md"><b>Parceiros</b></h4>
        <div class="partners-wrapper">
          <img
            v-for="partner in partners"
            :key="partner.id"
            class="partner-image card-image my-3"
            :src="partner.image_url || '/img/pages/company.png'"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import api from "../services/api";

export default {
  name: "PublicParceria",
  data() {
    return {
      partners: [],
      empty: true,
    };
  },
  async mounted() {
    this.loadData();
  },
  methods: {
    async loadData() {
      const loader = this.$loading.show({
        container: this.$refs.conatiner,
        width: 90,
        height: 90,
      });
      try {
        const { data } = await api.get("/showcases");
        this.partners = data;
        this.empty = !data.length;
        loader.hide();
      } catch (e) {
        this.$toasted.error("Ocorreu um erro ao recuperar os projetos");
      }
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

.partner-image {
  width: 100%;
  height: 100%;
  max-height: 10em;
  max-width: 10em;
  object-fit: cover;
}

.partners-wrapper {
  display: flex;
  flex-direction: row;
  gap: 2em;
  padding: 0 3em;
}
.partners-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
