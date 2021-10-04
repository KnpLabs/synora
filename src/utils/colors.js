const hexcolorToArray = color => color
  .substring(1)
  .match(new RegExp('.{2}', 'g'))
  .map(v => parseInt(v, 16))

const arrayToHexcolor = array => array
  .map(v => v.toString(16).padStart(2, '0'))
  .join('')
  .padStart(7, '#')

export const mergeColors = (color1, color2, cursor) => {
  const values = [color1, color2].map(hexcolorToArray)

  return arrayToHexcolor([
    Math.round(values[0][0] * (1 - cursor) + values[1][0] * cursor),
    Math.round(values[0][1] * (1 - cursor) + values[1][1] * cursor),
    Math.round(values[0][2] * (1 - cursor) + values[1][2] * cursor),
  ])
}
