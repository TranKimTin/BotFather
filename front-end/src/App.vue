<template>
  <Toast />
  <ConfirmDialog />

  <div class="layout">
    <!-- Sidebar -->
    <aside class="sidebar" :class="{ 'sidebar-collapsed': !sidebarVisible }">
      <div class="sidebar-header">
        <span v-if="sidebarVisible">Bot father</span>
        <i class="pi pi-bars toggle-button" @click="toggleSidebar"></i>
      </div>
      <ul class="menu">
        <li v-for="item in menuItems" :key="item.label" :class="{ active: activeItem === item.label }">
          <router-link
            :to="item.route"
            class="menu-link"
            @click.native="setActive(item.label)"
          >
            <i :class="item.icon"></i>
            <span v-if="sidebarVisible">{{ item.label }}</span>
          </router-link>
        </li>
      </ul>
      <div class="sidebar-footer" >
        <i class="pi pi-sign-in"></i>
        <span v-if="sidebarVisible">Đăng xuất</span>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<script lang="ts" src="./App.ts"></script>

<style scoped>
/* Layout */
.layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

/* Sidebar */
.sidebar {
  background-color: #2c3e50;
  color: white;
  width: 250px;
  transition: width 0.3s ease;
  display: flex;
  flex-direction: column;
}

.sidebar-collapsed {
  width: auto;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
}

.toggle-button {
  cursor: pointer;
  margin-right: 1rem;
}

.menu {
  list-style: none;
  padding: 0;
  margin: 0;
  margin-top: 0.5rem;
}

.menu li {
  display: flex;
  align-items: center;
}

.menu-link {
  display: flex;
  align-items: center;
  padding: 1rem;
  text-decoration: none;
  color: white;
  transition: background 0.3s ease;
  width: 100%;
}

.menu-link:hover,
.menu li.active .menu-link {
  background-color: #34495e;
}

.menu-link i {
  font-size: 1.2rem;
  margin-right: 1rem;
}

.sidebar-footer {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-top: 1px solid #34495e;
  margin-top: auto; 
}

.sidebar-footer span {
  padding: 1rem;
}

/* Main Content */
.content {
  flex: 1;
  padding: 2rem;
  background-color: #ecf0f1;
  overflow-y: auto;
}
</style>
