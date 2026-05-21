<p align="center">
  <img src="logo.png" alt="Cyrilic Type Logo" width="120" height="120" style="border-radius: 24px; float: right; margin-left: 20px;" />
</p>

# Cyrilic Type

Una aplicación web interactiva diseñada para aprender, practicar y memorizar el abecedario cirílico ruso de forma dinámica, visual y auditiva.

Si quieres jugar y practicar directamente en tu navegador, la versión web en vivo está disponible aquí:  
👉 **[Despliegue en Vivo en GitHub Pages](https://MoshiSam.github.io/Cyrilic-Type/)** *(Asegúrate de configurar tu rama y enlace en las opciones de tu repositorio)*

---

## ✨ Características Principales

* 📖 **Dictados Interactivos (Quiz)**: Escribe la transcripción al alfabeto latino de cada carácter cirílico. Cuenta con atajos de teclado (`Ctrl + Espacio` para reproducir sonido, `Enter` para verificar/continuar rápido).
* 🔊 **Audios Humanos Nativos**: Pronunciación real en ruso grabada por hablantes nativos obtenida desde Wikimedia Commons con fallback automático a síntesis de voz (Google TTS y Web Speech API offline).
* 📚 **Sala de Lectura con Cuentos Infantiles**: Lee cuentos tradicionales rusos como *Masha y el Oso*. Incluye transliterador instantáneo para pasar cualquier fragmento cirílico a caracteres latinos y escuchar fragmentos individuales.
* 📕 **Diccionario Ruso Offline**: Más de 500 palabras rusas comunes organizadas por categorías de uso cotidiano, buscador reactivo inteligente y traductor online de respaldo integrado.
* 🎨 **Temas Personalizados**: Interfaz estética premium con soporte para múltiples paletas de colores (`Oscuro`, `Claro premium`, `Flor de Cerezo / Sakura`, `Bosque / Forest`).
* 🍪 **Persistencia de Preferencias**: Tus estadísticas de juego, volumen de audio y temas se guardan de forma local en tu navegador mediante cookies y LocalStorage (sin requerir base de datos externa).

---

## ⚡ Inicio Rápido (Desarrollo Local)

Asegúrate de tener instalado **[Node.js](https://nodejs.org/)** (versión 20 o superior recomendado).

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Iniciar servidor de desarrollo**:
   ```bash
   npm run dev
   ```
   *Esto iniciará la aplicación localmente en http://localhost:3000.*

---

## 📦 Compilación y Producción

Para compilar el código de producción optimizado para la web:

```bash
npm run build
```

La build generada se creará en la carpeta `dist/`. Gracias al archivo de configuración de Vite, las rutas son relativas (`./`), lo que hace que los archivos de la carpeta `dist/` se puedan alojar directamente en cualquier servicio estático como GitHub Pages.

---

## 🤝 Agradecimientos e Inspiración

* **[Kenney.nl](https://kenney.nl)** y **Wikimedia Commons** por la obtención y almacenamiento libre de recursos de audio nativos en ruso.
* **Type Kana** y **Real Kana** por la excelente inspiración de diseño e idea interactiva de práctica rápida.
