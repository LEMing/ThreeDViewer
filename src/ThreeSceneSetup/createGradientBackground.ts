import * as THREE from 'three';
import {get2DContext} from './get2DContext';

// Константы для настроек градиента, шума и базового цвета
const GRADIENT_CENTER_RADIUS = 10; // Начальный радиус градиента
const GRADIENT_EDGE_RADIUS_FACTOR = 0.75; // Коэффициент для радиуса градиента (80% от высоты)
const NOISE_INTENSITY = 300; // Интенсивность шума (уменьшена для слабого шума)
const NOISE_OPACITY = 250; // Непрозрачность шума (очень легкий шум)
const BLUR_AMOUNT = 1; // Легкое размытие шума
const GRADIENT_COLOR_CENTER = 'rgba(34, 34, 34, 0.95)'; // Светло-серый центр, почти прозрачный
const GRADIENT_COLOR_EDGE = 'rgba(0, 0, 0, 1)';   // Непрозрачный черный для краев градиента
const BASE_COLOR = 'rgba(15, 15, 15, 1)'; // Темный серый базовый цвет

export const createGradientBackground = (scene: THREE.Scene, size: THREE.Vector2) => {
  const canvas = document.createElement('canvas');
  canvas.width = size.x;
  canvas.height = size.y;
  const ctx = get2DContext(canvas);

  // Устанавливаем темный базовый цвет
  ctx.fillStyle = BASE_COLOR; // Используем темный серый базовый цвет
  ctx.fillRect(0, 0, size.x, size.y);

// Добавляем легкий шум поверх фона
  const imageData = ctx.getImageData(0, 0, size.x, size.y);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const noise = Math.random() * NOISE_INTENSITY; // Используем слабый шум
    data[i] += noise;     // R
    data[i + 1] += noise; // G
    data[i + 2] += noise; // B
    data[i + 3] = NOISE_OPACITY; // Прозрачность шума
  }

  ctx.putImageData(imageData, 0, 0);

  // Легкое размытие шума для плавности
  ctx.filter = `blur(${BLUR_AMOUNT}px)`; // Легкое размытие
  ctx.drawImage(canvas, 0, 0);
  ctx.filter = 'none';

   const gradient = ctx.createRadialGradient(
    size.x / 2, size.y / 2, GRADIENT_CENTER_RADIUS,  // Используем небольшой радиус для центра
    size.x / 2, size.y / 2, size.y * GRADIENT_EDGE_RADIUS_FACTOR // Радиус для краев
  );

  // Используем светло-серый в центре и черный по краям
  gradient.addColorStop(0, GRADIENT_COLOR_CENTER);  // Центр - светло-серый, почти прозрачный
  gradient.addColorStop(1, GRADIENT_COLOR_EDGE);    // Края - черный

  // Наносим градиент поверх шума
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size.x, size.y);

  // Создаем текстуру из канваса
  const texture = new THREE.CanvasTexture(canvas);

  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;

  // Устанавливаем текстуру как фон сцены
  scene.background = texture;
};
