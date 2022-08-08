<template>
  <div class="bg-diagonal-stripes wrapper">
    <!-- Navbar -->
    <base-nav
      class="navbar-top navbar-horizontal navbar-light bg-white"
      container-classes="px-4 container"
      expand
    >
      <router-link slot="brand" class="navbar-brand" to="/">
        <img :src="defaultLogo" class="custom-logo" />
      </router-link>

      <template v-slot="{ closeMenu }">
        <!-- Collapse header -->
        <div class="navbar-collapse-header d-md-none">
          <div class="row">
            <div class="col-6 collapse-brand">
              <router-link to="/">
                <img :src="defaultLogo" />
              </router-link>
            </div>
            <div class="col-6 collapse-close">
              <button
                type="button"
                class="navbar-toggler"
                aria-label="Toggle sidenav"
                @click="closeMenu"
              >
                <span />
                <span />
              </button>
            </div>
          </div>
        </div>
        <!-- Navbar items -->
        <ul class="navbar-nav ml-auto">
          <li class="nav-item">
            <router-link class="nav-link nav-link-icon" to="/login">
              <i class="fas fa-sign-in-alt" />
              <span class="nav-link-inner--text">Login</span>
            </router-link>
          </li>
        </ul>
      </template>
    </base-nav>
    <!-- Header -->
    <div class="header mt-lg-7 mt-5">
      <div class="container">
        <div class="header-body text-center mb-3">
          <div class="row">
            <div class="col-12">
              <h1 class="text-white">Bem-vindo!</h1>
              <p class="text-lead text-white">
                Página de acesso ao Portal Orquestrando Arte
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Page content -->
    <div class="container main-content">
      <slide-y-up-transition mode="out-in" origin="center top">
        <router-view />
      </slide-y-up-transition>
    </div>
    <footer class="footer px-4 bg-transparent">
      <div class="row align-items-center justify-content-lg-between px-1">
        <div class="col-lg-6 mt-2 mt-lg-0">
          <div class="copyright text-center text-lg-left text-white">
            © {{ year }}
            Powered by
            <a
              href="https://starsaceleradora.com.br/"
              class="font-weight-bold text-orange"
              target="_blank"
              >Stars/Azaz</a
            >
          </div>
        </div>
        <div class="col-lg-6 mt-0">
          <ul
            class="nav nav-footer justify-content-center justify-content-lg-end"
          >
            <li class="nav-item">
              <a
                href="https://www.facebook.com/orquestrandoarte/"
                class="nav-link"
                target="_blank"
                ><i class="fab fa-facebook text-lg text-white"
              /></a>
            </li>
            <li class="nav-item">
              <a
                href="https://www.instagram.com/orquestrandoarte/"
                class="nav-link"
                target="_blank"
                ><i class="fab fa-instagram text-lg text-white"
              /></a>
            </li>
            <li class="nav-item">
              <a
                href="https://www.orquestrandoarte.org/"
                class="nav-link"
                target="_blank"
                ><i class="fas fa-globe text-lg text-white"
              /></a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  </div>
</template>
<script>
import { SlideYUpTransition } from "vue2-transitions";

export default {
  name: "AuthLayout",
  components: {
    SlideYUpTransition,
  },
  data() {
    return {
      year: new Date().getFullYear(),
      showMenu: false,
    };
  },
  computed: {
    defaultLogo() {
      return `/img/brand/${
        window.location.host.includes("cobusiness")
          ? "cobusiness.png"
          : "orquestrando_logo.png"
      }`;
    },
  },
};
</script>
<style scoped>
.footer .nav-link {
  padding: 0 0.75rem;
}

.footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  min-height: 50px;
  padding: 0;
  line-height: 50px;
}
.main-content {
  margin-bottom: 9rem;
}

.wrapper {
  min-height: 100%;
  min-width: 100%;
  position: absolute;
}

.bg-dark-green {
  background-color: seagreen !important;
}

.bg-diagonal-stripes {
  background: repeating-linear-gradient(
    -65deg,
    #01adee,
    #01adee 300px,
    #a4ce3a 300px,
    #a4ce3a 500px,
    #f9a64b 500px,
    #f9a64b 800px,
    #c456a0 800px,
    #c456a0 1000px
  );
}

.navbar-horizontal .navbar-brand img.custom-logo {
  height: 45px;
}
</style>
<style>
html {
  position: relative;
  min-height: 100%;
}
</style>
