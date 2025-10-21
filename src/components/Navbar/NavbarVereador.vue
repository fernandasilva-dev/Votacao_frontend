<template>
    <aside class="sidebar">

      <nav class="menu">
        <router-link to="/vereador/dashboard" class="menu-item" active-class="active">
          <img src="../../assets/images/votar.png" alt="" class="menu-icon">
          <span>Votações</span>
        </router-link>

        <router-link to="/vereador/cadastrar-projeto" class="menu-item" active-class="active">
          <img src="../../assets/images/projeto.png" alt="" class="menu-icon">
          <span>Cadastrar Projeto</span>
        </router-link>

        <router-link to="/vereador/meus-projetos" class="menu-item" active-class="active">
          <img src="../../assets/images/meuprojeto.png" alt="" class="menu-icon">
          <span>Meus Projetos</span>
        </router-link>
      </nav>

      <div class="profile-section">
        <router-link to="/vereador/perfil" class="menu-item">
          <img src="../../assets/images/perfil.png" alt="" class="menu-icon">
          <span>Perfil</span>
        </router-link>
      </div>
    </aside>
</template>