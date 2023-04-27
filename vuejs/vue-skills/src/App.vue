<script setup>
import { RouterLink, RouterView } from 'vue-router'

</script>

<template>
   <nav>
      <router-link to="/">Home</router-link>
      <router-link to="/about">About</router-link>
      <router-link to="/about/patrick">About With Name</router-link>
    </nav>
    <br>
  <RouterView/>
</template>

<style scoped>
nav a { 
  display: inline-block;
  padding: 10px;
  size: 32pt;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}


</style>
