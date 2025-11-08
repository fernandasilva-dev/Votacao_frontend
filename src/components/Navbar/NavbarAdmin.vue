<template>
    <aside class="sidebar">

      <nav class="menu">
        <router-link to="/admin/dashboard" class="menu-item" active-class="active">
          <img src="../../assets/images/votar.png" alt="" class="menu-icon">
          <span>Votações</span>
        </router-link>

        <router-link to="/admin/cadastrar-partido" class="menu-item" active-class="active">
          <img src="../../assets/images/meuprojeto.png" alt="" class="menu-icon">
          <span>Cadastrar Partido</span>
        </router-link>
      </nav>

      <div class="profile-section">
        <router-link to="/admin/perfil" class="menu-item">
          <img src="../../assets/images/perfil.png" alt="" class="menu-icon">
          <span>Perfil Administrador</span>
        </router-link>
      </div>
    </aside>
</template>