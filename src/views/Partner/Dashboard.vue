<template>
  <div>
    <base-header class="header pb-3 py-5 pt-md-8 d-flex align-items-center">
      <!-- Mask -->
      <span class="mask opacity-8" />
      <!-- Header container -->
      <div class="container-fluid d-flex align-items-center">
        <div class="row">
          <div class="col-lg-8 col-md-10">
            <h1 class="text-white">
              Seja bem-vind{{ getArticleGender(user.gender) }},
              {{ user.name ? user.name.split(" ", 1)[0] : "" }} :)
            </h1>
            <p class="text-white mt-3 mb-5">
              Aqui você pode conferir o feed de publicações e impulsionar a
              interação entre usuários. Toda nova publicação aparecerá
              automaticamente na listagem abaixo.
            </p>
          </div>
        </div>
      </div>
    </base-header>

    <div class="container-fluid mt--5">
      <div class="row">
        <div class="col-xl-8 col-lg-8 px-0">
          <div class="col-xl-12 col-lg-12 px-0">
            <new-post
              :profile_picture="profile_picture"
              :user="user"
              endpoint="parceiro"
              @news="loadInitialNews"
            />
          </div>
          <div class="d-md-none col-xl-4 col-lg-4 px-0">
            <div
              ref="news_table"
              class="post-card card shadow vld-parent mb-4 float-center"
            >
              <div class="card-header border-0">
                <h4 class="text-center mb-0">Aniversários</h4>
                <hr class="my-2" />

                <div v-if="birthday.today.length" class="">
                  <span class="mr-4 ml-4">
                    <i class="fas fa-calendar-day mr-1" /> Hoje
                  </span>

                  <div
                    v-for="(b, index) in birthday.today"
                    :key="index"
                    class=""
                  >
                    <div ref="publicacao_container" class="mb-3 mr-4 ml-4">
                      <div class="">
                        <img
                          v-if="b.profile_picture"
                          width="80"
                          height="80"
                          :src="b.profile_picture"
                          class="rounded mr-2 float-left"
                          alt="foto de perfil"
                        />
                        <i
                          v-else
                          class="fas fa-user-circle fa-4x mr-1 float-left"
                        />
                        <p class="text-bold my-1">{{ b.name }}</p>

                        <p>
                          <span class="text-bold my-1">
                            {{ formatDate(b.birth, "DD/MM") }}
                          </span>
                          <span class="text-bold my-1">
                            <i class="fas fa-birthday-cake" />
                            {{ getAge(b.birth) }} anos
                          </span>
                        </p>
                      </div>
                      <div class="row mt-0">
                        <div class="col-12">
                          <base-button
                            class="btn btn-white btn-block secondary-button btn- py-1"
                            @click="
                              $router.push(
                                `/parceiro/usuarios/${b.user_id}/visualizar`
                              )
                            "
                          >
                            Parabenizar colega
                          </base-button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="birthday.thisWeek.length" class="">
                  <span class="mr-4 ml-4">
                    <i class="fas fa-calendar-week mr-1" /> Essa semana
                  </span>

                  <div
                    v-for="(b, index) in birthday.thisWeek"
                    :key="index"
                    class=""
                  >
                    <div ref="publicacao_container" class="mb-3 mr-4 ml-4">
                      <div class="">
                        <img
                          v-if="b.profile_picture"
                          width="80"
                          height="80"
                          :src="b.profile_picture"
                          class="rounded mr-2 float-left"
                          alt="foto de perfil"
                        />
                        <i
                          v-else
                          class="fas fa-user-circle fa-4x mr-1 float-left"
                        />
                        <p class="text-bold my-1">{{ b.name }}</p>
                        <p>
                          <span class="text-bold my-1">
                            {{ formatDate(b.birth, "DD/MM") }}
                          </span>
                          <span class="text-bold my-1">
                            <i class="fas fa-birthday-cake" />
                            {{ getAge(b.birth) }} anos
                          </span>
                        </p>
                      </div>
                      <div class="row mt-0">
                        <div class="col-12">
                          <base-button
                            class="btn btn-white btn-block secondary-button btn- py-1"
                            @click="
                              $router.push(
                                `/parceiro/usuarios/${b.user_id}/visualizar`
                              )
                            "
                          >
                            Parabenizar colega
                          </base-button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  v-if="!birthday.thisWeek.length && !birthday.today.length"
                  class="row"
                >
                  <div class="col-12 text-center">
                    <badge type="info" class="bg-white">
                      Nenhum aniversário próximo!
                    </badge>
                  </div>
                </div>
              </div>
            </div>
            <div
              ref="meet_table"
              class="post-card card shadow vld-parent mb-4 float-center"
            >
              <div class="card-header border-0">
                <h4 class="text-center mb-0">Reuniões</h4>
                <hr class="my-2" />

                <div v-if="meetings.length" class="">
                  <div v-for="(meet, index) in meetings" :key="index" class="">
                    <div ref="publicacao_container" class="mb-3 mr-4 ml-4">
                      <div class="">
                        <h3 class="font-weight-bold my-1">
                          {{ meet.subject }}
                        </h3>
                        <p class="text-bold my-1">
                          Data:
                          {{ formatDate(meet.date, "DD/MM/YYYY") }}
                        </p>
                      </div>
                      <div class="row mt-0">
                        <div class="col-12">
                          <base-button
                            type="block btn-primary"
                            class="py-1"
                            @click="showMeetModal(meet)"
                          >
                            <i class="far fa-calendar" /> Detalhes
                          </base-button>
                        </div>
                      </div>
                    </div>
                    <hr class="my-2" />
                  </div>
                  <div class="row">
                    <div class="col-12">
                      <router-link class="float-right" to="/professor/reunioes">
                        Ver todos as reuniões
                      </router-link>
                    </div>
                  </div>
                </div>
                <div v-else class="row">
                  <div class="col-12 text-center">
                    <badge type="info" class="bg-white">
                      Nenhuma reunião próxima!
                    </badge>
                  </div>
                </div>
              </div>
            </div>
            <div
              ref="news_table"
              class="post-card card shadow vld-parent mb-4 float-center"
            >
              <div class="card-header border-0">
                <h4 class="text-center mb-0">Questionários ativos</h4>
                <hr class="my-2" />

                <div v-if="surveys.length" class="">
                  <div v-for="(s, index) in surveys" :key="index" class="">
                    <div ref="publicacao_container" class="mb-3 mr-4 ml-4">
                      <div class="">
                        <h3 class="font-weight-bold my-1">{{ s.title }}</h3>
                        <p v-if="s.start_date" class="text-bold my-1">
                          Aceitando respostas desde
                          {{ formatDate(s.start_date, "DD/MM/YYYY") }}
                        </p>
                        <p v-if="s.end_date" class="text-bold my-1">
                          Disponível até
                          {{ formatDate(s.end_date, "DD/MM/YYYY") }}
                        </p>
                      </div>
                      <div class="row mt-0">
                        <div class="col-12">
                          <div v-if="s.responses.responses_count" class="">
                            <base-button
                              v-if="!s.is_response_restricted"
                              class="btn btn-white btn-block secondary-button btn- py-1"
                              @click="
                                $router.push(
                                  `/parceiro/questionarios/${s.id}/respostas`
                                )
                              "
                            >
                              <i class="fas fa-redo" /> Enviar outra resposta
                            </base-button>
                            <base-button
                              v-else
                              class="btn btn-white btn-block green-button btn- py-1"
                              @click="
                                $router.push(
                                  `/parceiro/questionarios/${s.id}/respostas`
                                )
                              "
                            >
                              <i class="fas fa-check" /> Resposta enviada
                            </base-button>
                          </div>
                          <base-button
                            v-else
                            class="btn btn-white btn-block red-button btn- py-1"
                            @click="
                              $router.push(
                                `/parceiro/questionarios/${s.id}/respostas`
                              )
                            "
                          >
                            <i class="far fa-newspaper" /> Ainda não respondida
                          </base-button>
                        </div>
                      </div>
                    </div>
                    <hr class="my-2" />
                  </div>
                  <div class="row">
                    <div class="col-12">
                      <router-link
                        class="float-right"
                        to="/parceiro/questionarios"
                      >
                        Ver todos os questionários
                      </router-link>
                    </div>
                  </div>
                </div>

                <div
                  v-if="!surveys.length && !satisfactionSurveys.length"
                  class="row"
                >
                  <div class="col-12 text-center">
                    <badge type="info" class="bg-white">
                      Nenhuma pesquisa ativa!
                    </badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-for="(event, index) in news" :key="event.id">
            <div class="post-card shadow col-xl-12 col-lg-12 mb-4 card px-2">
              <p class="mb-2 mt-2">
                <a class="click-name" @click="handleViewUser(event)">
                  <img
                    v-if="event.profile_picture"
                    width="30"
                    height="30"
                    :src="event.profile_picture"
                    class="rounded-circle mr-2"
                    alt="foto de perfil"
                  />
                  <i v-else class="fas fa-user-circle fa-2x mr-1" />
                  <span>{{ event.author_name }}</span>
                </a>
                <i
                  v-if="event.user_id == user_id"
                  v-tooltip="'Excluir comentário!'"
                  class="far fa-trash-alt float-right ml-1 text-warning mt-2 mr-2"
                  @click="handleOpenModalConfirmation(event.id)"
                />
              </p>
              <img
                v-if="event.image_url"
                class="image-feed rounded mx-auto d-block col-12 px-0"
                :src="event.image_url"
                alt="..."
              />

              <quill-editor
                v-model="event.body"
                :options="editorReadOnly"
                disabled="disabled"
              />

              <div class="btn-group mb-3 d-flex border-group">
                <base-button
                  class="btn btn-white py-1"
                  :title="!event.liked ? 'Curtir' : 'Descurtir'"
                  @click="handleLike(index)"
                >
                  <div v-if="!event.liked" class="">
                    <i class="far fa-heart fa-sm" />
                    {{ event.likes_count }}
                  </div>
                  <div v-else class="">
                    <i class="fas fa-heart fa-sm text-primary" />
                    {{ event.likes_count }}
                  </div>
                </base-button>
                <base-button
                  class="btn btn-white py-1"
                  type=""
                  @click="
                    $router.push(`parceiro/publicacao/${event.id}/visualizar`)
                  "
                >
                  <i class="far fa-comment fa-sm" /> {{ event.comments_count }}
                </base-button>
              </div>
            </div>
          </div>
        </div>
        <div class="d-md-block d-none col-xl-4 col-lg-4">
          <div
            ref="news_table"
            class="post-card card shadow vld-parent mb-4 float-center"
          >
            <div class="card-header border-0">
              <h4 class="text-center mb-0">Aniversários</h4>
              <hr class="my-2" />

              <div v-if="birthday.today.length" class="">
                <span class="mr-4 ml-4">
                  <i class="fas fa-calendar-day mr-1" /> Hoje
                </span>

                <div v-for="(b, index) in birthday.today" :key="index" class="">
                  <div ref="publicacao_container" class="mb-3 mr-4 ml-4">
                    <div class="">
                      <img
                        v-if="b.profile_picture"
                        width="80"
                        height="80"
                        :src="b.profile_picture"
                        class="rounded mr-2 float-left"
                        alt="foto de perfil"
                      />
                      <i
                        v-else
                        class="fas fa-user-circle fa-4x mr-1 float-left"
                      />
                      <p class="text-bold my-1">{{ b.name }}</p>

                      <p>
                        <span class="text-bold my-1">
                          {{ formatDate(b.birth, "DD/MM") }}
                        </span>
                        <span class="text-bold my-1">
                          <i class="fas fa-birthday-cake" />
                          {{ getAge(b.birth) }} anos
                        </span>
                      </p>
                    </div>
                    <div class="row mt-0">
                      <div class="col-12">
                        <base-button
                          class="btn btn-white btn-block secondary-button btn- py-1"
                          @click="
                            $router.push(
                              `/parceiro/usuarios/${b.user_id}/visualizar`
                            )
                          "
                        >
                          Parabenizar colega
                        </base-button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="birthday.thisWeek.length" class="">
                <span class="mr-4 ml-4">
                  <i class="fas fa-calendar-week mr-1" /> Essa semana
                </span>

                <div
                  v-for="(b, index) in birthday.thisWeek"
                  :key="index"
                  class=""
                >
                  <div ref="publicacao_container" class="mb-3 mr-4 ml-4">
                    <div class="">
                      <img
                        v-if="b.profile_picture"
                        width="80"
                        height="80"
                        :src="b.profile_picture"
                        class="rounded mr-2 float-left"
                        alt="foto de perfil"
                      />
                      <i
                        v-else
                        class="fas fa-user-circle fa-4x mr-1 float-left"
                      />
                      <p class="text-bold my-1">{{ b.name }}</p>
                      <p>
                        <span class="text-bold my-1">
                          {{ formatDate(b.birth, "DD/MM") }}
                        </span>
                        <span class="text-bold my-1">
                          <i class="fas fa-birthday-cake" />
                          {{ getAge(b.birth) }} anos
                        </span>
                      </p>
                    </div>
                    <div class="row mt-0">
                      <div class="col-12">
                        <base-button
                          class="btn btn-white btn-block secondary-button btn- py-1"
                          @click="
                            $router.push(
                              `/parceiro/usuarios/${b.user_id}/visualizar`
                            )
                          "
                        >
                          Parabenizar colega
                        </base-button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                v-if="!birthday.thisWeek.length && !birthday.today.length"
                class="row"
              >
                <div class="col-12 text-center">
                  <badge type="info" class="bg-white">
                    Nenhum aniversário próximo!
                  </badge>
                </div>
              </div>
            </div>
          </div>
          <div
            ref="meet_table"
            class="post-card card shadow vld-parent mb-4 float-center"
          >
            <div class="card-header border-0">
              <h4 class="text-center mb-0">Reuniões</h4>
              <hr class="my-2" />

              <div v-if="meetings.length" class="">
                <div v-for="(meet, index) in meetings" :key="index" class="">
                  <div ref="publicacao_container" class="mb-3 mr-4 ml-4">
                    <div class="">
                      <h3 class="font-weight-bold my-1">
                        {{ meet.subject }}
                      </h3>
                      <p class="text-bold my-1">
                        Data:
                        {{ formatDate(meet.date, "DD/MM/YYYY") }}
                      </p>
                    </div>
                    <div class="row mt-0">
                      <div class="col-12">
                        <base-button
                          type="block btn-primary"
                          class="py-1"
                          @click="showMeetModal(meet)"
                        >
                          <i class="far fa-calendar" /> Detalhes
                        </base-button>
                      </div>
                    </div>
                  </div>
                  <hr class="my-2" />
                </div>
                <div class="row">
                  <div class="col-12">
                    <router-link class="float-right" to="/professor/reunioes">
                      Ver todos as reuniões
                    </router-link>
                  </div>
                </div>
              </div>
              <div v-else class="row">
                <div class="col-12 text-center">
                  <badge type="info" class="bg-white">
                    Nenhuma reunião próxima!
                  </badge>
                </div>
              </div>
            </div>
          </div>
          <div
            ref="news_table"
            class="post-card card shadow vld-parent mb-4 float-center"
          >
            <div class="card-header border-0">
              <h4 class="text-center mb-0">Questionários ativos</h4>
              <hr class="my-2" />

              <div v-if="surveys.length" class="">
                <div v-for="(s, index) in surveys" :key="index" class="">
                  <div ref="publicacao_container" class="mb-3 mr-4 ml-4">
                    <div class="">
                      <h3 class="font-weight-bold my-1">{{ s.title }}</h3>
                      <p v-if="s.start_date" class="text-bold my-1">
                        Aceitando respostas desde
                        {{ formatDate(s.start_date, "DD/MM/YYYY") }}
                      </p>
                      <p v-if="s.end_date" class="text-bold my-1">
                        Disponível até
                        {{ formatDate(s.end_date, "DD/MM/YYYY") }}
                      </p>
                    </div>
                    <div class="row mt-0">
                      <div class="col-12">
                        <div v-if="s.responses.responses_count" class="">
                          <base-button
                            v-if="!s.is_response_restricted"
                            class="btn btn-white btn-block secondary-button btn- py-1"
                            @click="
                              $router.push(
                                `/parceiro/questionarios/${s.id}/respostas`
                              )
                            "
                          >
                            <i class="fas fa-redo" /> Enviar outra resposta
                          </base-button>
                          <base-button
                            v-else
                            class="btn btn-white btn-block green-button btn- py-1"
                            @click="
                              $router.push(
                                `/parceiro/questionarios/${s.id}/respostas`
                              )
                            "
                          >
                            <i class="fas fa-check" /> Resposta enviada
                          </base-button>
                        </div>
                        <base-button
                          v-else
                          class="btn btn-white btn-block red-button btn- py-1"
                          @click="
                            $router.push(
                              `/parceiro/questionarios/${s.id}/respostas`
                            )
                          "
                        >
                          <i class="far fa-newspaper" /> Ainda não respondida
                        </base-button>
                      </div>
                    </div>
                  </div>
                  <hr class="my-2" />
                </div>
                <div class="row">
                  <div class="col-12">
                    <router-link
                      class="float-right"
                      to="/parceiro/questionarios"
                    >
                      Ver todos os questionários
                    </router-link>
                  </div>
                </div>
              </div>

              <div
                v-if="!surveys.length && !satisfactionSurveys.length"
                class="row"
              >
                <div class="col-12 text-center">
                  <badge type="info" class="bg-white">
                    Nenhuma pesquisa ativa!
                  </badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div ref="scroll" class="" />
    </div>
    <modal
      :show.sync="modal.modalConfirmation"
      modal-classes="modal-default modal-dialog-centered"
      body-classes="pb-0"
    >
      <h6 id="modal-title-notification" slot="header" class="modal-title">
        Atenção!
      </h6>
      <div ref="modal_confirmation_delete" class="vld-parent">
        <div class="py-3 text-center">
          <i class="fa fa-trash fa-3x" />
          <h4 class="heading mt-4">
            Você realmente deseja excluir esta publicação?
          </h4>
        </div>
      </div>
      <template slot="footer">
        <base-button
          type="link"
          text-color="white"
          class="ml-auto"
          @click="modal.modalConfirmation = false"
        >
          Voltar
        </base-button>
        <base-button
          type="white text-danger"
          @click="handleDeleteComment(idDelete)"
        >
          Confirmar exclusão
        </base-button>
      </template>
    </modal>
    <modal
      :show.sync="modalMeet.show"
      modal-classes="modal-dialog-centered modal-xl"
      body-classes="pb-0"
      header-classes="pb-0"
    >
      <h6
        id="modal-title-notification"
        slot="header"
        class="modal-title-notification"
      >
        Detalhes da reunião
      </h6>
      <div class="text-center">
        <div class="pb-2 card-profile-image">
          <img width="150" src="/img/pages/meet.png" class="card-image my-3" />
        </div>
      </div>
      <div class="text-center">
        <h3 class="pt-2 mt-7">
          {{ modalMeet.meeting.subject }}
        </h3>
        <p class="description mt-1 mb-0">
          {{ modalMeet.meeting.description }}
        </p>
        <p v-if="modalMeet.meeting.responsible" class="description mt-1 mb-0">
          <b>Responsável:</b> {{ modalMeet.meeting.responsible }}
        </p>
        <p class="description mt-1 mb-0">
          <span v-if="modalMeet.meeting.date">
            <b>Data: </b> {{ formatDate(modalMeet.meeting.date, "LL") }}
          </span>
          <span v-if="modalMeet.meeting.duration" class="px-2">
            <b>Duração: </b> {{ formatMinutes(modalMeet.meeting.duration) }}
          </span>
        </p>
        <p v-if="modalMeet.meeting.local" class="description mt-1 mb-0">
          <a
            v-if="isValidHttpUrl(modalMeet.meeting.local)"
            :href="modalMeet.meeting.local"
            target="_blank"
          >
            <i class="fas fa-link" /> {{ modalMeet.meeting.local }}
          </a>
          <template v-else>
            <b>Local: {{ modalMeet.meeting.local }}</b>
          </template>
        </p>
        <p v-if="modalMeet.meeting.tags" class="description mt-1 mb-0">
          <b>Tags:</b>
          <badge
            v-for="tag in modalMeet.meeting.tags.split(';')"
            :key="`${modalMeet.meeting.id}_${tag}`"
            class="mx-1"
            type="primary"
          >
            {{ tag.trim() }}
          </badge>
        </p>
      </div>
      <div class="mt-3">
        <quill-editor
          v-model="modalMeet.meeting.report"
          :options="editorReadOnly"
          disabled="disabled"
          class="border rounded"
        />
        <p class="text-right description mt-3 mb-0">
          <i class="far fa-clock mr-1" /> Publicado em
          {{ formatTimestamp(modalMeet.meeting.created_at, "lll") }}. Atualizado
          em {{ formatTimestamp(modalMeet.meeting.updated_at, "lll") }}.
        </p>
      </div>
      <template slot="footer">
        <base-button
          type="link"
          text-color="dark"
          class="ml-auto"
          @click="modalMeet.show = false"
        >
          Voltar
        </base-button>
      </template>
    </modal>
  </div>
</template>
<script>
import NewPost from "@/components/PostNew.vue";

import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";
import { getUserId } from "@/services/auth";
import api from "@/services/api";

export default {
  name: "PartnerDashboard",
  components: {
    NewPost,
    quillEditor,
  },
  data() {
    return {
      news: [],
      user: {},
      profile_picture: "",
      user_id: getUserId(),
      birthday: { today: [], thisWeek: [] },
      satisfactionSurveys: [],
      surveys: [],
      meetings: [],
      meta: {},
      events: [],
      treinaments: [],
      dynamics: [],
      limit: 10,
      empty: {
        news: "",
        events: "",
        treinaments: "",
        dynamics: "",
      },
      editorReadOnly: {
        placeholder: "...",
        readOnly: true,
        theme: "bubble",
      },
      modal: {
        modalConfirmation: false,
      },
      modalMeet: {
        meeting: {},
        show: false,
      },
      idDelete: 0,
    };
  },
  async mounted() {
    await this.loadNews();
    await Promise.all([
      await this.loadInitialNews(),
      this.loadUser(),
      this.loadMeetings(),
      this.loadBirthday(),
      this.loadSurveys(),
    ]);
    this.user_id = await getUserId();
  },
  methods: {
    async loadMeetings() {
      const loader = this.$loading.show({
        container: this.$refs.meet_table,
        width: 90,
        height: 90,
        opacity: 0,
      });
      try {
        const { data } = await api.get("/partner/meetings/next");
        this.meetings = data;
      } catch (e) {
        this.$toasted.error("Ocorreu um erro ao recuperar as reuniões");
      } finally {
        loader.hide();
      }
    },
    async showMeetModal(meet) {
      const loader = this.$loading.show({
        container: this.$refs.meet_table,
        width: 90,
        height: 90,
        opacity: 0,
      });
      try {
        if (!meet.description) {
          const { data } = await api.get("/partner/meetings/" + meet.id);
          const index = this.meetings.findIndex((item) => item.id === meet.id);
          this.meetings[index] = data.meeting;
          this.modalMeet.meeting = data.meeting;
        } else this.modalMeet.meeting = meet;
        this.modalMeet.show = true;
      } catch (e) {
        this.$toasted.error("Ocorreu um erro ao recuperar a reunião");
      } finally {
        loader.hide();
      }
    },
    handleOpenModalConfirmation(id) {
      this.modal.modalConfirmation = true;
      this.idDelete = id;
    },
    async handleDeleteComment(id) {
      try {
        await api.delete(`/partner/news/${id}/`);
        this.modal.modalConfirmation = false;
        this.loadPublications();
      } catch (error) {
        this.$toasted.error("Ocorreu um erro ao excluir o comentário!");
      }
    },
    getArticleGender(gender) {
      if (gender === "male") {
        return "o";
      } else if (gender === "female") {
        return "a";
      } else {
        return "o(a)";
      }
    },
    getAge(birth) {
      return (
        this.moment().year() -
        parseInt(this.moment(birth, "YYYY-MM-DD").format("YYYY"))
      );
    },
    formatMinutes(minutes) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      let text = "";
      const houresTxt = hours === 2 ? "Duas" : hours;
      if (hours) text += hours > 1 ? `${houresTxt} horas` : "Uma hora";
      if (mins) {
        if (hours) text += " e ";
        text += mins > 1 ? `${mins} minutos` : "1 minuto";
      }
      return text;
    },
    openLink(link) {
      window.open(link, "file-window", "resizable=1,height=750,width=750");
    },
    isValidHttpUrl(string) {
      let url;
      try {
        url = new URL(string);
      } catch (_) {
        return false;
      }

      return url.protocol === "http:" || url.protocol === "https:";
    },
    async loadSurveys() {
      try {
        const {
          data: { satisfactionSurveys, surveys },
        } = await api.get("/partner/home-surveys");
        if (satisfactionSurveys) {
          this.satisfactionSurveys = satisfactionSurveys;
        }
        if (surveys) {
          this.surveys = surveys;
        }
      } catch (error) {
        this.$toasted.error("Falha ao recuperar as pesquisas");
      }
    },
    async loadBirthday() {
      try {
        const { data } = await api.get("/partner/users-birthday-stats");
        if (data) {
          this.birthday = data;
        }
      } catch (error) {
        this.$toasted.error("Falha ao recuperar aniversários");
      }
    },
    async loadUser() {
      try {
        const { data } = await api.get("/partner/partners/");
        if (data) {
          this.user = data;
          this.profile_picture = data.profile_picture
            ? data.profile_picture.url
            : "";
        }
      } catch (error) {
        this.$toasted.error("Falha ao recuperar usuário");
      }
    },
    loadNews() {
      window.onscroll = async () => {
        let bottomOfWindow =
          document.documentElement.scrollTop + window.innerHeight ===
          document.documentElement.offsetHeight;
        if (bottomOfWindow && this.meta.current_page < this.meta.last_page) {
          const loader = this.$loading.show({
            container: this.$refs.scroll,
            loader: "dots",
            width: 90,
            height: 90,
            opacity: 0,
          });
          try {
            const {
              data: { data, meta },
            } = await api.get(
              `/partner/news/?page=${this.meta.current_page + 1}`
            );
            if (data.length) {
              this.news = this.news.concat(data);
              this.meta = meta;
            } else this.empty.news = true;
            loader.hide();
          } catch (e) {
            this.$toasted.error("Ocorreu um erro ao carregar as publicações");
          }
        }
      };
    },
    async handleSetStatus(index) {
      let oldStatus = this.news[index].status;
      this.news[index].status =
        this.news[index].status === "public" ? "hidden" : "public";
      try {
        await api.patch(`/partner/news/${this.news[index].id}/set-status`, {
          status: this.news[index].status,
        });
      } catch (error) {
        this.news[index].status = oldStatus;
        this.$toasted.error("Falha ao ocultar a publicação");
      }
    },

    async handleLike(index) {
      if (!this.news[index].liked) {
        this.news[index].likes_count += 1;
      } else if (this.news[index].liked && this.news[index].likes_count > 0) {
        this.news[index].likes_count -= 1;
      }
      this.news[index].liked = !this.news[index].liked;
      try {
        await api.put(`/partner/news/${this.news[index].id}/like`);
      } catch (error) {
        this.news[index].likes_count -= 1;
        this.news[index].liked = !this.news[index].liked;
        this.$toasted.error("Falha ao curtir");
      }
    },
    handleViewUser(news) {
      this.$router.push(`/parceiro/usuarios/${news.user_id}/visualizar`);
    },
    truncate(text, stop = 150, clamp = "...") {
      if (!text) return "N/A";
      return text.slice(0, stop) + (stop < text.length ? clamp : "");
    },
    async loadPublications(targetObjName, loaderRef, errorMsg) {
      this.empty[targetObjName] = false;
      const loader = this.$loading.show({
        container: loaderRef,
        loader: "dots",
        width: 90,
        height: 90,
        opacity: 0,
      });
      try {
        const {
          data: { data, meta },
        } = await api.get("/partner/news");
        if (data.length) {
          this.news = data;
          this.meta = meta;
        } else this.empty[targetObjName] = true;
        loader.hide();
      } catch (e) {
        this.$toasted.error(`Ocorreu um erro ao recuperar ${errorMsg}`);
      }
    },
    async loadInitialNews() {
      await this.loadPublications("news", this.$refs.news_table, "as notícias");
    },
  },
};
</script>
<style scoped>
.border-group {
  border-radius: 10px;
  border: 2px solid #eaeaea;
}

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

.post-card {
  border-radius: 10px;
  border: 1px solid #e8e8e8;
}
.secondary-button {
  border-radius: 10px;
  color: #c95fa7;
  border: 1px solid #c95fa7;
}
.green-button {
  border-radius: 10px;
  color: #349740;
  border: 1px solid #349740;
}
.red-button {
  border-radius: 10px;
  color: white;
  background-color: #c03434;
  border: 1px solid #c03434;
}
.cursor-pointer {
  cursor: pointer;
}
.click-name {
  cursor: pointer;
}
</style>
