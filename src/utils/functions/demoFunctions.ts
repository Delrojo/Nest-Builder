const lightenColor = (hex: string, amount: number): string => {
  // Convert hex to RGB
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  // Lighten each color component
  const lighten = (component: number) => Math.round(component + (255 - component) * amount);

  // Calculate the lightened color components
  const newR = lighten(r);
  const newG = lighten(g);
  const newB = lighten(b);

  // Convert the RGB values back to hex
  const toHex = (component: number) => component.toString(16).padStart(2, '0');

  return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`;
};

export default lightenColor;