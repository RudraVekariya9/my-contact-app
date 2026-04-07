export const combineText = (results) => {
  let finalText = "";

  for (let i = 0; i < results.length; i++) {
    finalText += `\n--- Page ${i + 1} ---\n${results[i]}\n`;
  }

  return finalText;
};