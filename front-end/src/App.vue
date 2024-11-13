<template>
  <Toast />
  <ConfirmDialog />
  <div id="background"></div>
  <div class="container-fluid">
    <!-- <BotConfig></BotConfig> -->
    <router-view />
  </div>

</template>

<script setup lang="ts">
import Toast from 'primevue/toast';
import ConfirmDialog from 'primevue/confirmdialog';
</script>
