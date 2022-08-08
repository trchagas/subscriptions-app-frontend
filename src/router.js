import Vue from "vue";
import Router from "vue-router";

import { checkRole, getRoles } from "./services/auth";

import AuthLayout from "@/layout/AuthLayout";
import PublicLayout from "@/layout/public/DashboardLayout";

Vue.use(Router);

const router = new Router({
  linkExactActiveClass: "active",
  mode: "history",
  routes: [
    /* public routes */ {
      path: "/",
      redirect: "/",
      component: PublicLayout,
      children: [
        {
          path: "/",
          alias: "public_dashboard",
          name: "public_dashboard",
          meta: { title: "Publicações" },
          component: () => import("./views/Dashboard.vue"),
        },
        {
          path: "/publicacao/:id/visualizar",
          alias: "public_show_news",
          name: "public_show_news",
          meta: { title: "Publicações" },
          component: () => import("./views/SocialView.vue"),
        },
        {
          path: "matricula",
          alias: "public_matricula",
          name: "public_matricula",
          meta: { title: "Solicitar Matrícula" },
          component: () => import("./views/Matricula.vue"),
        },
        {
          path: "parceria",
          alias: "public_parceria",
          name: "public_parceria",
          meta: { title: "Parceria" },
          component: () => import("./views/Parceria.vue"),
        },
        {
          path: "voluntariado",
          alias: "public_voluntariado",
          name: "public_voluntariado",
          meta: { title: "Voluntariado" },
          component: () => import("./views/Voluntario.vue"),
        },
      ],
    },
    /* base routes */
    {
      path: "/",
      redirect: "login",
      component: AuthLayout,
      children: [
        {
          path: "login",
          name: "login",
          component: () => import("./views/Login.vue"),
        },
        {
          path: "forgot-password",
          name: "forgot_password",
          component: () => import("./views/ForgotPassword.vue"),
        },
        {
          path: "recover-password/:token/:email",
          name: "recover_password",
          component: () => import("./views/RecoverPassword.vue"),
        },
      ],
    },
    /* admin routes */
    {
      path: "/diretoria",
      redirect: { name: "admin_dashboard" },
      component: () => import("@/layout/admin/DashboardLayout"),
      beforeEnter: (to, from, next) => {
        if (!checkRole("admin")) next("/login");
        else next();
      },
      children: [
        {
          path: "/",
          alias: "admin_dashboard",
          name: "admin_dashboard",
          meta: { title: "início" },
          component: () => import("./views/Admin/Dashboard.vue"),
        },
        {
          path: "usuarios",
          alias: "admin_usuarios",
          name: "admin_usuarios",
          meta: { title: "listagem de usuários" },
          component: () => import("./views/Admin/Usuarios.vue"),
        },
        {
          path: "parceiros",
          alias: "admin_parceiros",
          name: "admin_parceiros",
          meta: { title: "vitrine de parceiros" },
          component: () => import("./views/Admin/Vitrine.vue"),
        },
        {
          path: "parceiros/novo",
          alias: "admin_new_parceiros",
          name: "admin_new_parceiros",
          meta: { title: "cadastrar parceiro" },
          component: () => import("./views/Admin/Vitrine/ShowCaseForm.vue"),
        },
        {
          path: "parceiros/:id/editar",
          alias: "admin_edit_parceiros",
          name: "admin_edit_parceiros",
          meta: { title: "editar parceiro" },
          component: () => import("./views/Admin/Vitrine/ShowCaseEdit.vue"),
        },
        {
          path: "usuarios/parceiros",
          alias: "admin_usuarios_parceiros",
          name: "admin_usuarios_parceiros",
          meta: { title: "listagem de parceiros" },
          component: () => import("./views/Admin/Parceiros.vue"),
        },
        {
          path: "usuarios/parceiros/novo",
          alias: "new_admin_usuarios_parceiros",
          name: "new_admin_usuarios_parceiros",
          meta: { title: "cadastrar parceiro" },
          component: () => import("./views/Admin/Parceiros/ParceiroForm.vue"),
        },
        {
          path: "usuarios/parceiros/:id/editar",
          alias: "edit_admin_usuarios_parceiros",
          name: "edit_admin_usuarios_parceiros",
          meta: { title: "edição de parceiros" },
          component: () => import("./views/Admin/Parceiros/ParceiroEdit.vue"),
        },
        {
          path: "usuarios/parceiros/:id/visualizar",
          alias: "show_admin_usuarios_parceiros",
          name: "show_admin_usuarios_parceiros",
          meta: { title: "visualização de parceiros" },
          component: () => import("./views/Admin/Parceiros/ParceiroShow.vue"),
        },
        {
          path: "usuarios/associados",
          alias: "admin_usuarios_associados",
          name: "admin_usuarios_associados",
          meta: { title: "listagem de associados" },
          component: () => import("./views/Admin/Associados.vue"),
        },
        {
          path: "usuarios/associados/novo",
          alias: "new_admin_usuarios_associados",
          name: "new_admin_usuarios_associados",
          meta: { title: "cadastrar parceiro" },
          component: () => import("./views/Admin/Associados/AssociadoForm.vue"),
        },
        {
          path: "usuarios/associados/:id/editar",
          alias: "edit_admin_usuarios_associados",
          name: "edit_admin_usuarios_associados",
          meta: { title: "edição de associados" },
          component: () => import("./views/Admin/Associados/AssociadoEdit.vue"),
        },
        {
          path: "usuarios/associados/:id/visualizar",
          alias: "show_admin_usuarios_associados",
          name: "show_admin_usuarios_associados",
          meta: { title: "visualização de associados" },
          component: () => import("./views/Admin/Associados/AssociadoShow.vue"),
        },
        {
          path: "usuarios/alunos",
          alias: "admin_usuarios_alunos",
          name: "admin_usuarios_alunos",
          meta: { title: "listagem de alunos" },
          component: () => import("./views/Admin/Alunos.vue"),
        },
        {
          path: "usuarios/alunos/novo",
          alias: "new_admin_usuarios_alunos",
          name: "new_admin_usuarios_alunos",
          meta: { title: "cadastro de alunos" },
          component: () => import("./views/Admin/Alunos/AlunoForm.vue"),
        },
        {
          path: "usuarios/alunos/:id/editar",
          alias: "edit_admin_usuarios_alunos",
          name: "edit_admin_usuarios_alunos",
          meta: { title: "edição de alunos" },
          component: () => import("./views/Admin/Alunos/AlunoEdit.vue"),
        },
        {
          path: "usuarios/voluntarios",
          alias: "admin_usuarios_voluntarios",
          name: "admin_usuarios_voluntarios",
          meta: { title: "listagem de voluntários" },
          component: () => import("./views/Admin/Voluntarios.vue"),
        },
        {
          path: "usuarios/voluntarios/novo",
          alias: "new_admin_usuarios_voluntarios",
          name: "new_admin_usuarios_voluntarios",
          meta: { title: "cadastro de voluntários" },
          component: () =>
            import("./views/Admin/Voluntarios/VoluntariosForm.vue"),
        },
        {
          path: "usuarios/voluntarios/:id/editar",
          alias: "edit_admin_usuarios_voluntarios",
          name: "edit_admin_usuarios_voluntarios",
          meta: { title: "edição de voluntários" },
          component: () =>
            import("./views/Admin/Voluntarios/VoluntariosEdit.vue"),
        },
        {
          path: "usuarios/professores",
          alias: "admin_usuarios_professores",
          name: "admin_usuarios_professores",
          meta: { title: "listagem de professores" },
          component: () => import("./views/Admin/Professores.vue"),
        },
        {
          path: "usuarios/professores/novo",
          alias: "new_admin_usuarios_professores",
          name: "new_admin_usuarios_professores",
          meta: { title: "cadastro de professores" },
          component: () =>
            import("./views/Admin/Professores/ProfessorForm.vue"),
        },
        {
          path: "usuarios/professores/:id/editar",
          alias: "edit_admin_usuarios_professores",
          name: "edit_admin_usuarios_professores",
          meta: { title: "edição de professores" },
          component: () =>
            import("./views/Admin/Professores/ProfessorEdit.vue"),
        },

        {
          path: "publicacao/:id/visualizar",
          name: "admin_publicacao_visualizar",
          meta: { title: "Publicação" },
          component: () => import("./views/Admin/Social/SocialView.vue"),
        },
        {
          path: "murais",
          name: "admin_murais",
          meta: { title: "gestão de murais" },
          component: () => import("./views/Admin/Murais.vue"),
        },
        {
          path: "murais/publicacoes/nova",
          name: "admin_murais_publicacoes_new",
          meta: { title: "nova publicação para os murais" },
          component: () => import("./views/Admin/Murais/MuraisForm.vue"),
        },
        {
          path: "murais/publicacoes/:id/editar",
          name: "admin_murais_publicacoes_edit",
          meta: { title: "editar publicação para os murais" },
          component: () => import("./views/Admin/Murais/MuraisEdit.vue"),
        },
        {
          path: "turmas/professores",
          name: "admin_lista_professores",
          meta: { title: "listagem de professores" },
          component: () => import("./views/Admin/Turmas/Professores.vue"),
        },
        {
          path: "turmas/professores/:id",
          name: "admin_turmas",
          meta: { title: "listagem de turmas" },
          component: () => import("./views/Admin/Turmas/Turmas.vue"),
        },
        {
          path: "turmas/:id/ranking",
          name: "admin_turmas_ranking",
          meta: { title: "alunos matriculados" },
          component: () => import("./views/Admin/Turmas/Ranking.vue"),
        },
        {
          path: "turmas/:id/aulas",
          name: "admin_turmas_lessons",
          meta: { title: "aulas lançadas" },
          component: () => import("./views/Admin/Turmas/Aulas.vue"),
        },
        {
          path: "turmas/:class_id/materiais/:id/respostas",
          name: "admin_turmas_materials_answers",
          meta: { title: "visualizar respostas" },
          component: () =>
            import("./views/Admin/Turmas/Materiais/AvaliacaoRespota.vue"),
        },
        {
          path: "turmas/:id/materiais",
          name: "admin_turmas_materials",
          meta: { title: "visualizar materiais" },
          component: () => import("./views/Admin/Turmas/Materiais.vue"),
        },
        {
          path: "mensalidades",
          name: "admin_mensalidades",
          meta: { title: "visualizar mensalidades" },
          component: () => import("./views/Admin/Mensalidades.vue"),
        },
        {
          path: "mensalidades-associado",
          name: "admin_associado_mensalidades",
          meta: { title: "visualizar regras" },
          component: () =>
            import("./views/Admin/Mensalidades/Associado/Mensalidades.vue"),
        },
        {
          path: "mensalidades-parceiro/novo",
          name: "admin_parceiro_mensalidades_new",
          meta: { title: "cadastrar mensalidades" },
          component: () =>
            import("./views/Admin/Mensalidades/Parceiro/MensalidadesForm.vue"),
        },
        {
          path: "mensalidades-parceiro/:id/editar",
          name: "admin_parceiro_mensalidades_edit",
          meta: { title: "editar mensalidades" },
          component: () =>
            import("./views/Admin/Mensalidades/Parceiro/MensalidadesEdit.vue"),
        },
        {
          path: "mensalidades-parceiro/:id/visualizar",
          name: "admin_parceiro_mensalidades_show",
          meta: { title: "visualizar mensalidade" },
          component: () =>
            import("./views/Admin/Mensalidades/Parceiro/MensalidadesShow.vue"),
        },
        {
          path: "configuracoes",
          name: "admin_configuracoes",
          meta: { title: "configurar conta" },
          component: () => import("./views/Admin/Configuracoes.vue"),
        },
        {
          path: "questionarios",
          name: "admin_questionarios",
          meta: { title: "gestão de questionários" },
          component: () => import("./views/Admin/Questionarios.vue"),
        },
        {
          path: "questionarios/nova",
          name: "admin_questionarios_new",
          meta: { title: "novo questionário" },
          component: () =>
            import("./views/Admin/Questionarios/QuestionariosForm.vue"),
        },
        {
          path: "questionarios/:id/editar",
          name: "admin_questionarios_edit",
          meta: { title: "editar questionário" },
          component: () =>
            import("./views/Admin/Questionarios/QuestionariosEdit.vue"),
        },
        {
          path: "questionarios/:id/respostas",
          name: "admin_questionarios_asnwers",
          meta: { title: "respostas recebidas" },
          component: () =>
            import("./views/Admin/Questionarios/QuestionariosAnswers.vue"),
        },
        {
          path: "reunioes",
          name: "admin_reunioes",
          meta: { title: "visualizar reunioes" },
          component: () => import("./views/Admin/Reunioes.vue"),
        },
        {
          path: "reunioes/novo",
          name: "admin_reunioes_new",
          meta: { title: "cadastrar reunião" },
          component: () => import("./views/Admin/Reunioes/ReunioesForm.vue"),
        },
        {
          path: "reunioes/:id/editar",
          name: "admin_reunioes_edit",
          meta: { title: "editar reunião" },
          component: () => import("./views/Admin/Reunioes/ReunioesEdit.vue"),
        },
        {
          path: "usuarios/:id/visualizar",
          name: "admin_view_user",
          meta: { title: "visualizar usuário" },
          component: () => import("./views/Admin/UserView.vue"),
        },
        {
          path: "projetos",
          name: "admin_view_projects",
          meta: { title: "gerenciamento de projetos" },
          component: () => import("./views/Admin/Projetos.vue"),
        },
        {
          path: "projetos/novo",
          name: "admin_new_projects",
          meta: { title: "gerenciamento de projetos" },
          component: () => import("./views/Admin/Projetos/ProjetosForm.vue"),
        },
        {
          path: "projetos/:id/editar",
          name: "admin_projects_edit",
          meta: { title: "editar projeto" },
          component: () => import("./views/Admin/Projetos/ProjetosEdit.vue"),
        },
        {
          path: "projetos/:id/tarefas",
          name: "admin_projects_manage",
          meta: { title: "gerenciar tarefas do projeto" },
          component: () => import("./views/Admin/Projetos/Tarefas/Tarefas.vue"),
        },
        {
          path: "projetos/:id/visualizar-tarefas",
          name: "admin_projects_view",
          meta: { title: "Visualizar tarefas do projeto" },
          component: () =>
            import("./views/Admin/Projetos/Tarefas/TarefasView.vue"),
        },
        {
          path: "projetos/:id/tags",
          name: "admin_projects_tags",
          meta: { title: "gerenciar tags do projeto" },
          component: () => import("./views/Admin/Projetos/Tags/Tags.vue"),
        },
        {
          path: "agenda",
          name: "admin_agenda",
          meta: { title: "agenda da diretoria" },
          component: () => import("./views/Admin/Agenda.vue"),
        },
        {
          path: "atendimentos",
          name: "admin_atendimentos",
          meta: { title: "gerenciar atendimentos" },
          component: () => import("./views/Admin/Consulta.vue"),
        },
        {
          path: "atendimentos/:id/editar",
          name: "admin_atendimentos_editar",
          meta: { title: "editar atendimento" },
          component: () => import("./views/Admin/Consulta/ConsultaEdit.vue"),
        },
        {
          path: "atendimentos/novo",
          name: "admin_atendimentos_new",
          meta: { title: "criar atendimento" },
          component: () => import("./views/Admin/Consulta/ConsultaForm.vue"),
        },
        {
          path: "atendimentos/tipos",
          name: "admin_atendimentos_tipos",
          meta: { title: "Gerenciar tipos de atendimento" },
          component: () => import("./views/Admin/Consulta/TipoConsulta.vue"),
        },
      ],
    },
    /* partner routes */
    {
      path: "/parceiro",
      redirect: { name: "partner_dashboard" },
      component: () => import("@/layout/partner/DashboardLayout"),
      beforeEnter: (to, from, next) => {
        if (!checkRole("partner")) next("/login");
        else next();
      },
      children: [
        {
          path: "/",
          alias: "dashboard",
          name: "partner_dashboard",
          meta: { title: "início" },
          component: () => import("./views/Partner/Dashboard.vue"),
        },
        {
          path: "publicacao/:id/visualizar",
          name: "partner_publicacao_visualizar",
          meta: { title: "Publicação" },
          component: () => import("./views/Partner/Social/SocialView.vue"),
        },
        {
          path: "murais",
          name: "partner_murais",
          meta: { title: "murais" },
          component: () => import("./views/Partner/Murais.vue"),
        },
        {
          path: "murais/publicacoes/nova",
          name: "partner_murais_publicacoes_new",
          meta: { title: "nova publicação para os murais" },
          component: () => import("./views/Partner/Murais/MuraisForm.vue"),
        },
        {
          path: "murais/publicacoes/:id/editar",
          name: "partner_murais_publicacoes_edit",
          meta: { title: "editar publicação para os murais" },
          component: () => import("./views/Partner/Murais/MuraisEdit.vue"),
        },
        {
          path: "reunioes",
          name: "partner_reunioes",
          meta: { title: "visualizar reunioes" },
          component: () => import("./views/Partner/Reunioes.vue"),
        },
        {
          path: "mensalidades",
          name: "partner_mensalities",
          meta: { title: "visualizar mensalidades" },
          component: () => import("./views/Partner/Mensalidades.vue"),
        },
        {
          path: "configuracoes",
          name: "partner_configuracoes",
          meta: { title: "configurar conta" },
          component: () => import("./views/Partner/Configuracoes.vue"),
        },
        {
          path: "questionarios",
          name: "partner_questionarios",
          meta: { title: "questionários" },
          component: () => import("./views/Partner/Questionarios.vue"),
        },
        {
          path: "questionarios/:id/respostas",
          name: "partner_questionarios_respostas",
          meta: { title: "responder questionário" },
          component: () =>
            import("./views/Partner/Questionarios/QuestionariosResponse.vue"),
        },
        {
          path: "usuarios/:id/visualizar",
          name: "partner_view_user",
          meta: { title: "visualizar usuário" },
          component: () => import("./views/Partner/UserView.vue"),
        },
        {
          path: "agenda",
          name: "partner_agenda",
          meta: { title: "agenda pessoal" },
          component: () => import("./views/Partner/Agenda.vue"),
        },
      ],
    },
    /* associate routes */
    {
      path: "/associado",
      redirect: { name: "associate_dashboard" },
      component: () => import("@/layout/associate/DashboardLayout"),
      beforeEnter: (to, from, next) => {
        if (!checkRole("associate")) next("/login");
        else next();
      },
      children: [
        {
          path: "/",
          alias: "dashboard",
          name: "associate_dashboard",
          meta: { title: "início" },
          component: () => import("./views/Associate/Dashboard.vue"),
        },
        {
          path: "publicacao/:id/visualizar",
          name: "associate_publicacao_visualizar",
          meta: { title: "Publicação" },
          component: () => import("./views/Associate/Social/SocialView.vue"),
        },
        {
          path: "murais",
          name: "associate_murais",
          meta: { title: "murais" },
          component: () => import("./views/Associate/Murais.vue"),
        },
        {
          path: "murais/publicacoes/nova",
          name: "associate_murais_publicacoes_new",
          meta: { title: "nova publicação para os murais" },
          component: () => import("./views/Associate/Murais/MuraisForm.vue"),
        },
        {
          path: "murais/publicacoes/:id/editar",
          name: "associate_murais_publicacoes_edit",
          meta: { title: "editar publicação para os murais" },
          component: () => import("./views/Associate/Murais/MuraisEdit.vue"),
        },
        {
          path: "reunioes",
          name: "associate_reunioes",
          meta: { title: "visualizar reunioes" },
          component: () => import("./views/Associate/Reunioes.vue"),
        },
        {
          path: "mensalidades",
          name: "associate_mensalities",
          meta: { title: "visualizar mensalidades" },
          component: () => import("./views/Associate/Mensalidades.vue"),
        },
        {
          path: "configuracoes",
          name: "associate_configuracoes",
          meta: { title: "configurar conta" },
          component: () => import("./views/Associate/Configuracoes.vue"),
        },
        {
          path: "questionarios",
          name: "associate_questionarios",
          meta: { title: "questionários" },
          component: () => import("./views/Associate/Questionarios.vue"),
        },
        {
          path: "questionarios/:id/respostas",
          name: "associate_questionarios_respostas",
          meta: { title: "responder questionário" },
          component: () =>
            import("./views/Associate/Questionarios/QuestionariosResponse.vue"),
        },
        {
          path: "usuarios/:id/visualizar",
          name: "associate_view_user",
          meta: { title: "visualizar usuário" },
          component: () => import("./views/Associate/UserView.vue"),
        },
        {
          path: "agenda",
          name: "associate_agenda",
          meta: { title: "agenda pessoal" },
          component: () => import("./views/Associate/Agenda.vue"),
        },
      ],
    },
    /* student routes */
    {
      path: "/aluno",
      redirect: { name: "student_dashboard" },
      component: () => import("@/layout/student/DashboardLayout"),
      beforeEnter: (to, from, next) => {
        if (!checkRole("student")) next("/login");
        else next();
      },
      children: [
        {
          path: "/",
          alias: "dashboard",
          name: "student_dashboard",
          meta: { title: "início" },
          component: () => import("./views/Student/Dashboard.vue"),
        },
        {
          path: "publicacao/:id/visualizar",
          name: "student_publicacao_visualizar",
          meta: { title: "Publicação" },
          component: () => import("./views/Student/Social/SocialView.vue"),
        },
        {
          path: "murais",
          name: "student_murais",
          meta: { title: "murais" },
          component: () => import("./views/Student/Murais.vue"),
        },
        {
          path: "murais/publicacoes/nova",
          name: "student_murais_publicacoes_new",
          meta: { title: "nova publicação para os murais" },
          component: () => import("./views/Student/Murais/MuraisForm.vue"),
        },
        {
          path: "murais/publicacoes/:id/editar",
          name: "student_murais_publicacoes_edit",
          meta: { title: "editar publicação para os murais" },
          component: () => import("./views/Student/Murais/MuraisEdit.vue"),
        },
        {
          path: "turmas",
          name: "student_turmas",
          meta: { title: "turmas" },
          component: () => import("./views/Student/Turmas.vue"),
        },
        {
          path: "turmas/:id/visualizar",
          name: "student_turmas_visualizar",
          meta: { title: "visualizar turma" },
          component: () => import("./views/Student/Turmas/CursoView.vue"),
        },
        {
          path: "turmas/:id/aulas",
          name: "student_turmas_visualizar_aulas",
          meta: { title: "visualizar presenças" },
          component: () => import("./views/Student/Turmas/Aulas.vue"),
        },
        {
          path: "configuracoes",
          name: "student_configuracoes",
          meta: { title: "configurar conta" },
          component: () => import("./views/Student/Configuracoes.vue"),
        },
        {
          path: "questionarios",
          name: "student_questionarios",
          meta: { title: "questionários" },
          component: () => import("./views/Student/Questionarios.vue"),
        },
        {
          path: "questionarios/:id/respostas",
          name: "student_questionarios_respostas",
          meta: { title: "responder questionário" },
          component: () =>
            import("./views/Student/Questionarios/QuestionariosResponse.vue"),
        },
        {
          path: "usuarios/:id/visualizar",
          name: "student_view_user",
          meta: { title: "visualizar usuário" },
          component: () => import("./views/Student/UserView.vue"),
        },
        {
          path: "agenda",
          name: "student_agenda",
          meta: { title: "agenda pessoal" },
          component: () => import("./views/Student/Agenda.vue"),
        },
      ],
    },
    /* volunteer routes */
    {
      path: "/voluntario",
      redirect: { name: "volunteer_dashboard" },
      component: () => import("@/layout/volunteer/DashboardLayout"),
      beforeEnter: (to, from, next) => {
        if (!checkRole("volunteer")) next("/login");
        else next();
      },
      children: [
        {
          path: "/",
          alias: "dashboard",
          name: "volunteer_dashboard",
          meta: { title: "início" },
          component: () => import("./views/Volunteer/Dashboard.vue"),
        },

        {
          path: "publicacao/:id/visualizar",
          name: "volunteer_publicacao_visualizar",
          meta: { title: "Publicação" },
          component: () => import("./views/Volunteer/Social/SocialView.vue"),
        },
        {
          path: "murais",
          name: "volunteer_murais",
          meta: { title: "murais" },
          component: () => import("./views/Volunteer/Murais.vue"),
        },
        {
          path: "murais/publicacoes/nova",
          name: "volunteer_murais_publicacoes_new",
          meta: { title: "nova publicação para os murais" },
          component: () => import("./views/Volunteer/Murais/MuraisForm.vue"),
        },
        {
          path: "murais/publicacoes/:id/editar",
          name: "volunteer_murais_publicacoes_edit",
          meta: { title: "editar publicação para os murais" },
          component: () => import("./views/Volunteer/Murais/MuraisEdit.vue"),
        },
        {
          path: "reunioes",
          name: "volunteer_reunioes",
          meta: { title: "visualizar reunioes" },
          component: () => import("./views/Volunteer/Reunioes.vue"),
        },
        {
          path: "configuracoes",
          name: "volunteer_configuracoes",
          meta: { title: "configurar conta" },
          component: () => import("./views/Volunteer/Configuracoes.vue"),
        },
        {
          path: "questionarios",
          name: "volunteer_questionarios",
          meta: { title: "questionários" },
          component: () => import("./views/Volunteer/Questionarios.vue"),
        },
        {
          path: "questionarios/:id/respostas",
          name: "volunteer_questionarios_respostas",
          meta: { title: "responder questionário" },
          component: () =>
            import("./views/Volunteer/Questionarios/QuestionariosResponse.vue"),
        },
        {
          path: "usuarios/:id/visualizar",
          name: "volunteer_view_user",
          meta: { title: "visualizar usuário" },
          component: () => import("./views/Volunteer/UserView.vue"),
        },
        {
          path: "agenda",
          name: "volunteer_agenda",
          meta: { title: "agenda pessoal" },
          component: () => import("./views/Volunteer/Agenda.vue"),
        },
        {
          path: "avisos",
          alias: "volunteer_auth_warnings",
          name: "volunteer_auth_warnings",
          meta: { title: "Avisos" },
          component: () => import("./views/Avisos.vue"),
        },
      ],
    },
    /* teacher routes */
    {
      path: "/professor",
      redirect: { name: "teacher_dashboard" },
      component: () => import("@/layout/teacher/DashboardLayout"),
      beforeEnter: (to, from, next) => {
        if (!checkRole("teacher")) next("/login");
        else next();
      },
      children: [
        {
          path: "/",
          alias: "dashboard",
          name: "teacher_dashboard",
          meta: { title: "início" },
          component: () => import("./views/Teacher/Dashboard.vue"),
        },

        {
          path: "publicacao/:id/visualizar",
          name: "teacher_publicacao_visualizar",
          meta: { title: "Publicação" },
          component: () => import("./views/Teacher/Social/SocialView.vue"),
        },
        {
          path: "murais",
          name: "teacher_murais",
          meta: { title: "gestão de murais" },
          component: () => import("./views/Teacher/Murais.vue"),
        },
        {
          path: "murais/publicacoes/nova",
          name: "teacher_murais_publicacoes_new",
          meta: { title: "nova publicação para os murais" },
          component: () => import("./views/Teacher/Murais/MuraisForm.vue"),
        },
        {
          path: "murais/publicacoes/:id/editar",
          name: "teacher_murais_publicacoes_edit",
          meta: { title: "editar publicação para os murais" },
          component: () => import("./views/Teacher/Murais/MuraisEdit.vue"),
        },
        {
          path: "turmas",
          name: "teacher_turmas",
          meta: { title: "listagem de turmas" },
          component: () => import("./views/Teacher/Turmas.vue"),
        },
        {
          path: "turmas/novo",
          name: "teacher_turmas_new",
          meta: { title: "nova turma" },
          component: () => import("./views/Teacher/Turmas/TurmaFrom.vue"),
        },
        {
          path: "turmas/:id/editar",
          name: "teacher_turmas_edit",
          meta: { title: "editar turma" },
          component: () => import("./views/Teacher/Turmas/TurmaEdit.vue"),
        },
        {
          path: "turmas/:id/ranking",
          name: "teacher_turmas_ranking",
          meta: { title: "alunos matriculados" },
          component: () => import("./views/Teacher/Turmas/Ranking.vue"),
        },
        {
          path: "turmas/:id/alunos",
          name: "teacher_turmas_students",
          meta: { title: "alunos matriculados" },
          component: () => import("./views/Teacher/Turmas/Alunos.vue"),
        },
        {
          path: "turmas/:id/aulas",
          name: "teacher_turmas_lessons",
          meta: { title: "aulas lançadas" },
          component: () => import("./views/Teacher/Turmas/Aulas.vue"),
        },
        {
          path: "turmas/:id/materiais",
          name: "teacher_turmas_materials",
          meta: { title: "visualizar materiais" },
          component: () => import("./views/Teacher/Turmas/Materiais.vue"),
        },
        {
          path: "turmas/:class_id/materiais/:id/editar",
          name: "teacher_turmas_materials_edit",
          meta: { title: "visualizar materiais" },
          component: () =>
            import("./views/Teacher/Turmas/Materiais/MateriaisEdit.vue"),
        },
        {
          path: "turmas/:class_id/materiais/:id/respostas",
          name: "teacher_turmas_materials_answers",
          meta: { title: "visualizar respostas" },
          component: () =>
            import("./views/Teacher/Turmas/Materiais/AvaliacaoRespota.vue"),
        },
        {
          path: "turmas/:id/materiais/novo",
          name: "teacher_turmas_materials_new",
          meta: { title: "ordenar materiais" },
          component: () =>
            import("./views/Teacher/Turmas/Materiais/MateriaisForm.vue"),
        },
        {
          path: "turmas/:id/materiais/secoes",
          name: "teacher_turmas_materials_sections",
          meta: { title: "Gerenciar seções" },
          component: () =>
            import("./views/Teacher/Turmas/Materiais/Sections.vue"),
        },
        {
          path: "turmas/:id/materiais/ordenar",
          name: "teacher_turmas_materials_sort",
          meta: { title: "ordenar materiais" },
          component: () =>
            import("./views/Teacher/Turmas/Materiais/MateriaisSort.vue"),
        },
        {
          path: "reunioes",
          name: "teacher_reunioes",
          meta: { title: "visualizar reunioes" },
          component: () => import("./views/Teacher/Reunioes.vue"),
        },
        {
          path: "configuracoes",
          name: "teacher_configuracoes",
          meta: { title: "configurar conta" },
          component: () => import("./views/Teacher/Configuracoes.vue"),
        },
        {
          path: "questionarios",
          name: "teacher_questionarios",
          meta: { title: "questionários" },
          component: () => import("./views/Teacher/Questionarios.vue"),
        },
        {
          path: "questionarios/:id/respostas",
          name: "teacher_questionarios_respostas",
          meta: { title: "responder questionário" },
          component: () =>
            import("./views/Teacher/Questionarios/QuestionariosResponse.vue"),
        },
        {
          path: "usuarios/:id/visualizar",
          name: "teacher_view_user",
          meta: { title: "visualizar usuário" },
          component: () => import("./views/Teacher/UserView.vue"),
        },
        {
          path: "projetos",
          name: "teacher_view_projects",
          meta: { title: "gerenciamento de projetos" },
          component: () => import("./views/Teacher/Projetos.vue"),
        },
        {
          path: "projetos/novo",
          name: "taecher_new_projects",
          meta: { title: "gerenciamento de projetos" },
          component: () => import("./views/Teacher/Projetos/ProjetosForm.vue"),
        },
        {
          path: "projetos/:id/editar",
          name: "teacher_projects_edit",
          meta: { title: "editar projeto" },
          component: () => import("./views/Teacher/Projetos/ProjetosEdit.vue"),
        },
        {
          path: "projetos/:id/tarefas",
          name: "teacher_projects_manage",
          meta: { title: "gerenciar tarefas do projeto" },
          component: () =>
            import("./views/Teacher/Projetos/Tarefas/Tarefas.vue"),
        },
        {
          path: "projetos/:id/visualizar-tarefas",
          name: "teacher_projects_view",
          meta: { title: "Visualizar tarefas do projeto" },
          component: () =>
            import("./views/Teacher/Projetos/Tarefas/TarefasView.vue"),
        },
        {
          path: "projetos/:id/tags",
          name: "teacher_projects_tags",
          meta: { title: "gerenciar tags do projeto" },
          component: () => import("./views/Teacher/Projetos/Tags/Tags.vue"),
        },
        {
          path: "agenda",
          name: "teacher_agenda",
          meta: { title: "agenda pessoal" },
          component: () => import("./views/Teacher/Agenda.vue"),
        },
        {
          path: "avisos",
          alias: "teacher_auth_warnings",
          name: "teacher_auth_warnings",
          meta: { title: "Avisos" },
          component: () => import("./views/Avisos.vue"),
        },
      ],
    },
    /* fallback route (404) */
    { path: "*", redirect: "/" },
  ],
});

router.beforeEach((to, from, next) => {
  const toBaseRoute = ["/", "/login"].includes(to.fullPath);

  const roles = getRoles();
  if (roles) {
    const rolesArray = JSON.parse(roles);
    if (
      rolesArray.length > 1 &&
      (from.path !== "/" || !to.fullPath.includes("/avisos"))
    ) {
      const map = {
        teacher: "/professor/avisos",
        volunteer: "/voluntario/avisos",
      };
      next(map[rolesArray[0]]);
      return;
    }
  }

  // if user is trying to access the login/register page
  if (toBaseRoute) {
    // if user is authenticated redirect to his respective panel (based on user role)
    if (checkRole("admin")) next("/diretoria");
    else if (checkRole("teacher")) next("/professor");
    else if (checkRole("partner")) next("/parceiro");
    else if (checkRole("associate")) next("/associado");
    else if (checkRole("volunteer")) next("/voluntario");
    else if (checkRole("student")) next("/aluno");
    else next();
  }
  // go to next route (will check user role in beforeRoute)
  else next();
});

export default router;
