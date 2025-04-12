import axios from 'axios';

export const translateToEnglish = async (text: string): Promise<string> => {
  try {
    const translationResponse = await axios.post(
      'https://translation.googleapis.com/language/translate/v2',
      {
        q: text,
        target: 'en', // Traducción a inglés
      }
    );

    if (translationResponse.data && translationResponse.data.data.translations[0]) {
      return translationResponse.data.data.translations[0].translatedText;
    } else {
      throw new Error('Error al traducir el texto');
    }
  } catch (error) {
    console.error('Error en la traducción:', error);
    throw new Error('No se pudo traducir el nombre de la planta');
  }
};