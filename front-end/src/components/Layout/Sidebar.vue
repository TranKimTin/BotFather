<template>
    <Toast />
    <ConfirmDialog />

    <div class="layout">
        <!-- Sidebar -->
        <aside class="sidebar bg-gray-800" :class="{ 'sidebar-collapsed': !r_sidebarVisible }">
            <div class="sidebar-header">
                <span v-if="r_sidebarVisible">{{ r_email }}</span>
                <i class="pi pi-bars toggle-button" @click="toggleSidebar"></i>
            </div>
            <ul class="menu">
                <li v-for="item in r_menuItems" :key="item.label" :class="{ active: r_activeItem === item.label }">
                    <span v-if="!item.hide" class="menu-link" @click.native="setActive(item)">
                        <i :class="item.icon"></i>
                        <span v-if="r_sidebarVisible">
                            {{ item.label }}
                        </span>
                    </span>
                </li>
            </ul>
        </aside>
    </div>
</template>

<script lang="ts" src="./Sidebar.ts"></script>

<style>
* {
    box-sizing: border-box;
}

.layout {
    display: flex;
    height: 100vh;
    overflow: hidden;
}

/* Sidebar */
.sidebar {
    color: white;
    width: 250px;
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
    cursor: pointer;
}

.menu-link:hover,
.menu li.active .menu-link {
    background-color: #34495e;
}

.menu-link i {
    font-size: 1.2rem;
}

.menu span {
    padding-left: 1rem;
    padding-right: 1rem;
}
</style>
