<template>
    <span class="input-codemirror">
        <Codemirror v-model="code" placeholder="Nhập biểu thức" :extensions="extensions" :options="editorOptions" />
    </span>
</template>

<script lang="ts" src="./CodeMirror.ts"></script>

<style>
.input-codemirror {
    display: inline-block;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #fff;
    font-size: 1rem;
    line-height: 1.5;
    color: #333;
    width: 100%;
    box-sizing: border-box;
}

.input-codemirror:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
    cursor: text;
}

.cm-focused {
    outline: none !important;
}
</style>