<template>
    <div class="modern-card">
      <slot></slot>
    </div>
  </template>
  
  <script>
  </script>
  
  <style scoped>
  .modern-card {
    background-color: white; /* Oder eine andere helle Hintergrundfarbe */
    border-radius: 8px; /* Sanfte abgerundete Ecken */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08); /* Subtiler Schatten */
    padding: 20px; /* Innenabstand für den Inhalt */
    margin: 10px; /* Außenabstand zwischen Karten */
    /* Optional: */
    /* border: 1px solid transparent; /* Verhindert Layout-Verschiebungen bei Hover */
    /* transition: box-shadow 0.3s ease-in-out; /* Sanfte Schattenanimation bei Interaktion */
    
  }
  
  </style>