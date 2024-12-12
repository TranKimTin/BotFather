<template>
    <span class="input-codemirror" v-if="isVisible">
        <Codemirror v-model="code" placeholder="Nhập biểu thức" :extensions="extensions" :options="editorOptions" />
    </span>
</template>

<script lang="ts" src="./ExprInput.ts"></script>

<style scoped>
.input-codemirror {
    display: inline-block;
    width: 100%;
    padding: 0.375rem 0.75rem;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    color: #495057;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid #ced4da;
    border-radius: 0.5rem;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.input-codemirror:hover {
    cursor: text;
    color: #495057;
    background-color: #fff;
    border-color: #80bdff;
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.input-codemirror::placeholder {
  color: #6c757d;
  opacity: 1;
}

.input-codemirror:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
    cursor: text;
}
</style>