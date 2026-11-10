function loadImage(file) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const url = URL.createObjectURL(file);
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('无法读取这张照片'));
    };
    image.src = url;
  });
}

export function choosePhoto() {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.style.position = 'fixed';
    input.style.left = '-9999px';
    document.body.append(input);
    let settled = false;
    const finish = (file) => {
      if (settled) return;
      settled = true;
      input.remove();
      resolve(file);
    };
    input.addEventListener('change', () => {
      const file = input.files?.[0] || null;
      finish(file);
    }, { once: true });
    input.addEventListener('cancel', () => finish(null), { once: true });
    window.addEventListener('focus', () => {
      setTimeout(() => {
        if (!input.files?.length) finish(null);
      }, 600);
    }, { once: true });
    input.click();
  });
}

export async function compressPhoto(file, options = {}) {
  if (!file) throw new Error('没有选择照片');
  if (!file.type.startsWith('image/')) throw new Error('请选择图片文件');
  const maxDimension = options.maxDimension || 1280;
  const quality = options.quality || 0.76;
  const image = await loadImage(file);
  const scale = Math.min(1, maxDimension / Math.max(image.naturalWidth, image.naturalHeight));
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d', { alpha: false });
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, width, height);
  context.drawImage(image, 0, 0, width, height);
  return canvas.toDataURL('image/jpeg', quality);
}
