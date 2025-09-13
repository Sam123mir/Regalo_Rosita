# 🏀 Rosita Básquetbol - Juego Interactivo Móvil

Una experiencia web interactiva optimizada para dispositivos móviles, diseñada específicamente para Rosita con temática de básquetbol.

## 📱 Características Principales

### 🎯 Experiencia Móvil Optimizada
- **Viewport objetivo**: 320px - 480px de ancho
- **Orientación**: Vertical (portrait)
- **Compatibilidad**: Chrome Mobile 90+, Safari iOS 14+, Firefox Mobile 88+
- **Rendimiento**: Tiempo de carga < 3 segundos

### 🎨 Diseño Visual
- **Paleta cromática**:
  - Primario: Naranja #FF8C42
  - Secundario: Lila #B19CD9
  - Base: Blanco #FFFFFF
  - Texto: #333333
- **Tipografía**: Poppins (Google Fonts)
- **Animaciones**: Transiciones CSS suaves (300ms)
- **Touch Targets**: Mínimo 44x44px para óptima experiencia táctil

## 🎮 Flujo del Juego

### Pantalla 1: Bienvenida
- Mensaje personalizado para Rosita
- Animación de pelotas de básquet rebotando
- Botón "Comenzar" que aparece después de 3 segundos

### Pantalla 2: Puzzle 4x4 Interactivo
- Grid 4x4 con imagen de básquet fragmentada
- Mecánica drag & drop táctil
- Barra de progreso visual
- Validación automática y snap de piezas
- Efectos de celebración al completar

### Pantalla 3: Mini-juego de Básquet (Phaser.js)
- Juego de física realista con Phaser.js 3.x
- Mecánica de arrastre para lanzar la pelota
- Sistema de puntuación y intentos limitados
- Efectos visuales y feedback inmediato

### Pantalla 4: Resumen y Cierre
- Estadísticas del juego completado
- Opción para volver a jugar
- Función de compartir resultados

## 🛠️ Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: Estilos con Flexbox/Grid, animaciones
- **JavaScript ES6+**: Lógica de la aplicación
- **Phaser.js 3.x**: Motor de juego para el mini-juego de básquet

## 📁 Estructura del Proyecto

```
/
├── index.html          # Estructura principal de la aplicación
├── styles.css          # Estilos organizados por componentes
├── script.js           # Lógica principal y navegación
├── phaser-game.js      # Configuración del juego de básquet
└── README.md          # Este archivo
```

## 🚀 Instalación y Uso

### Opción 1: Servidor Local Simple
```bash
# Con Python 3
python -m http.server 8000

# Con Node.js (usando npx)
npx serve .

# Con PHP
php -S localhost:8000
```

### Opción 2: Abriendo directamente
Simplemente abre `index.html` en tu navegador web moderno.

### 📱 Prueba en Móvil
1. Asegúrate de que tu dispositivo móvil esté en la misma red
2. Accede desde el móvil a: `http://[tu-ip-local]:8000`
3. Agrega la página como acceso directo en tu pantalla de inicio para una experiencia de app nativa

## 🎯 Características Técnicas

### Optimizaciones Móviles
- Prevención de zoom accidental
- Gestos táctiles optimizados
- Navegación sin scroll horizontal
- Loading states para mejor UX
- Meta tags viewport configurados

### Accesibilidad
- Contraste de color 4.5:1 mínimo
- Navegación por teclado funcional
- Textos alternativos en imágenes
- Soporte para `prefers-reduced-motion`

### Rendimiento
- Imágenes optimizadas
- CSS y JS minificado en producción
- Lazy loading cuando corresponde
- Animaciones GPU-aceleradas

## 🎨 Personalización

### Modificar Colores
Edita las variables CSS en `styles.css`:
```css
:root {
    --primary-color: #FF8C42;    /* Naranja */
    --secondary-color: #B19CD9;  /* Lila */
    --white: #FFFFFF;
    --text-color: #333333;
}
```

### Ajustar Dificultad del Juego
En `phaser-game.js`, modifica:
```javascript
const GameConfig = {
    maxAttempts: 5,        // Número de intentos
    gravity: 800,          // Gravedad del juego
    ballSize: 40,          // Tamaño de la pelota
    hoopWidth: 120         // Ancho del aro
};
```

## 🐛 Resolución de Problemas

### El juego no carga en móvil
- Verifica que estés usando HTTPS o localhost
- Asegúrate de que JavaScript esté habilitado
- Prueba en modo incógnito para evitar caché

### El puzzle no responde al toque
- Verifica que los touch events estén habilitados
- Prueba con diferentes dedos/stylus
- Recarga la página si persiste el problema

### El juego Phaser no aparece
- Revisa la consola del desarrollador por errores
- Verifica que Phaser.js se haya cargado correctamente
- Asegúrate de que el contenedor tenga dimensiones válidas

## 📄 Licencia

Este proyecto es una demostración educativa creada específicamente para Rosita. 

## 🤝 Contribuciones

Si encuentras algún error o tienes sugerencias de mejora:
1. Abre un issue describiendo el problema
2. Proporciona pasos para reproducir el error
3. Incluye capturas de pantalla si es relevante

## 📱 Compatibilidad Probada

| Dispositivo | Chrome | Safari | Firefox | Edge |
|-------------|--------|--------|---------|------|
| iOS 14+     | ✅     | ✅     | ✅      | ✅   |
| Android 9+  | ✅     | N/A    | ✅      | ✅   |

---

¡Disfruta jugando! 🏀✨