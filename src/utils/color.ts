// Determine if color is rgb or rgba
export function isRgbOrRgba(color: string) {
  return color.includes('rgb') || color.includes('rgba')
}

// Determine if it's in hex format
export function isHex(color: string) {
  return color.includes('#')
}

// Convert hex color to rgb numeric type
export function hexToRgba(hex: string) {
  const r = Number.parseInt(hex.slice(1, 3), 16)
  const g = Number.parseInt(hex.slice(3, 5), 16)
  const b = Number.parseInt(hex.slice(5, 7), 16)

  return { r, g, b }
}
// Convert rgb array to r g b values
export function rgbToRgba(rgb: string) {
  const rgbArr = rgb.split('(')[1].split(')')[0].split(',')

  return { r: rgbArr[0], g: rgbArr[1], b: rgbArr[2] }
}

// Compose rgb color with transparency
export function rgba(color: string, opacity: number) {
  opacity = opacity || 1
  let rgbaStr = ''
  // Determine if it's a hex color
  if (isHex(color)) {
    const { r, g, b } = hexToRgba(color)
    rgbaStr = `rgba(${r},${g},${b},${opacity})`
  }
  else {
    const { r, g, b } = rgbToRgba(color)
    rgbaStr = `rgba(${r},${g},${b},${opacity})`
  }

  return rgbaStr
}

export function rgbToHex(color:string) {
   // Remove spaces from string
   color = color.replace(/\s+/g, '');

   // Match rgba or rgb format strings
   const rgbaMatch = color.match(/^rgba?\((\d+),(\d+),(\d+),?(\d*\.?\d+)?\)$/i);
   if (!rgbaMatch) {
       throw new Error('Invalid color format');
   }

   const r = parseInt(rgbaMatch[1], 10);
   const g = parseInt(rgbaMatch[2], 10);
   const b = parseInt(rgbaMatch[3], 10);
   const a = rgbaMatch[4] !== undefined ? parseFloat(rgbaMatch[4]) : undefined;

   // Convert RGB values to hexadecimal
   let hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();

   // If alpha value is provided, convert it to hexadecimal and append to result
   if (a !== undefined) {
       let alphaHex = Math.round(a * 255).toString(16).toUpperCase();
       if (alphaHex.length === 1) {
           alphaHex = "0" + alphaHex; // Ensure alpha value is two digits
       }
       hex += alphaHex;
   }

   return hex;
}