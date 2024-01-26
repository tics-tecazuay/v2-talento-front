export const fileConverter = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function () {
      const base64data = reader.result as string;
      resolve(base64data);
    };
    reader.onerror = reject;
  });
};
