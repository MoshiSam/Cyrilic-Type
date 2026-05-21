import type { LetterGroup } from '@/types/cyrillic';

export const cyrillicGroups: LetterGroup[] = [
  {
    id: 'vowels',
    title: 'Vowels',
    titleRu: 'Гласные',
    letters: [
      {
        char: 'А',
        latin: 'a',
        name: 'a',
        nameRu: 'а',
        category: 'vowels',
        audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/Ru-01-%D0%B1%D1%83%D0%BA%D0%B2%D0%B0-%D0%90.ogg'
      },
      {
        char: 'Е',
        latin: 'e',
        name: 'ye',
        nameRu: 'е',
        category: 'vowels',
        audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Ru-06-%D0%B1%D1%83%D0%BA%D0%B2%D0%B0-%D0%95.ogg'
      },
      {
        char: 'Ё',
        latin: 'yo',
        name: 'yo',
        nameRu: 'ё',
        category: 'vowels',
        audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/ed/Ru-07-%D0%B1%D1%83%D0%BA%D0%B2%D0%B0-%D0%81.ogg'
      },
      {
        char: 'И',
        latin: 'i',
        name: 'i',
        nameRu: 'и',
        category: 'vowels',
        audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Ru-10-%D0%B1%D1%83%D0%BA%D0%B2%D0%B0-%D0%98.ogg'
      },
      {
        char: 'О',
        latin: 'o',
        name: 'o',
        nameRu: 'о',
        category: 'vowels',
        audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1d/Ru-16-%D0%B1%D1%83%D0%BA%D0%B2%D0%B0-%D0%9E.ogg'
      },
      {
        char: 'У',
        latin: 'u',
        name: 'u',
        nameRu: 'у',
        category: 'vowels',
        audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Ru-21-%D0%B1%D1%83%D0%BA%D0%B2%D0%B0-%D0%A3.ogg'
      },
      {
        char: 'Ы',
        latin: 'y',
        name: 'y',
        nameRu: 'ы',
        category: 'vowels',
        audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/8d/Ru-29-%D0%B1%D1%83%D0%BA%D0%B2%D0%B0-%D0%AB.ogg'
      },
      {
        char: 'Э',
        latin: 'e',
        name: 'e',
        nameRu: 'э',
        category: 'vowels',
        audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Ru-31-%D0%B1%D1%83%D0%BA%D0%B2%D0%B0-%D0%AD.ogg'
      },
      {
        char: 'Ю',
        latin: 'yu',
        name: 'yu',
        nameRu: 'ю',
        category: 'vowels',
        audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/98/Ru-32-%D0%B1%D1%83%D0%BA%D0%B2%D0%B0-%D0%AE.ogg'
      },
      {
        char: 'Я',
        latin: 'ya',
        name: 'ya',
        nameRu: 'я',
        category: 'vowels',
        audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/5b/Ru-33-%D0%B1%D1%83%D0%BA%D0%B2%D0%B0-%D0%AF.ogg'
      },
    ],
  },
  {
    id: 'basic-consonants',
    title: 'Basic Consonants',
    titleRu: 'Основные согласные',
    letters: [
      {
        char: 'Б',
        latin: 'b',
        name: 'be',
        nameRu: 'бэ',
        category: 'basic-consonants',
        audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/Ru-02-%D0%B1%D1%83%D0%BA%D0%B2%D0%B0-%D0%91.ogg'
      },
      {
        char: 'В',
        latin: 'v',
        name: 've',
        nameRu: 'вэ',
        category: 'basic-consonants',
        audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/46/Ru-03-%D0%B1%D1%83%D0%BA%D0%B2%D0%B0-%D0%92.ogg'
      },
      {
        char: 'Г',
        latin: 'g',
        name: 'ge',
        nameRu: 'гэ',
        category: 'basic-consonants',
        audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/43/Ru-04-%D0%B1%D1%83%D0%BA%D0%B2%D0%B0-%D0%93.ogg'
      },
      {
        char: 'Д',
        latin: 'd',
        name: 'de',
        nameRu: 'дэ',
        category: 'basic-consonants',
        audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/cd/Ru-05-%D0%B1%D1%83%D0%BA%D0%B2%D0%B0-%D0%94.ogg'
      },
      {
        char: 'Ж',
        latin: 'zh',
        name: 'zhe',
        nameRu: 'жэ',
        category: 'basic-consonants',
        audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/6c/Ru-08-%D0%B1%D1%83%D0%BA%D0%B2%D0%B0-%D0%96.ogg'
      },
      {
        char: 'З',
        latin: 'z',
        name: 'ze',
        nameRu: 'зэ',
        category: 'basic-consonants',
        audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/43/Ru-09-%D0%B1%D1%83%D0%BA%D0%B2%D0%B0-%D0%97.ogg'
      },
      {
        char: 'К',
        latin: 'k',
        name: 'ka',
        nameRu: 'ка',
        category: 'basic-consonants',
        audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/97/Ru-12-%D0%B1%D1%83%D0%BA%D0%B2%D0%B0-%D0%9A.ogg'
      },
      {
        char: 'Л',
        latin: 'l',
        name: 'el',
        nameRu: 'эль',
        category: 'basic-consonants',
        audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/36/Ru-13-%D0%B1%D1%83%D0%BA%D0%B2%D0%B0-%D0%9B.ogg'
      },
      {
        char: 'М',
        latin: 'm',
        name: 'em',
        nameRu: 'эм',
        category: 'basic-consonants',
        audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/37/Ru-14-%D0%B1%D1%83%D0%BA%D0%B2%D0%B0-%D0%9C.ogg'
      },
      {
        char: 'Н',
        latin: 'n',
        name: 'en',
        nameRu: 'эн',
        category: 'basic-consonants',
        audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/17/Ru-15-%D0%B1%D1%83%D0%BA%D0%B2%D0%B0-%D0%9D.ogg'
      },
      {
        char: 'П',
        latin: 'p',
        name: 'pe',
        nameRu: 'пэ',
        category: 'basic-consonants',
        audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/11/Ru-17-%D0%B1%D1%83%D0%BA%D0%B2%D0%B0-%D0%9F.ogg'
      },
      {
        char: 'Р',
        latin: 'r',
        name: 'er',
        nameRu: 'эр',
        category: 'basic-consonants',
        audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Ru-18-%D0%B1%D1%83%D0%BA%D0%B2%D0%B0-%D0%A0.ogg'
      },
      {
        char: 'С',
        latin: 's',
        name: 'es',
        nameRu: 'эс',
        category: 'basic-consonants',
        audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/37/Ru-19-%D0%B1%D1%83%D0%BA%D0%B2%D0%B0-%D0%A1.ogg'
      },
      {
        char: 'Т',
        latin: 't',
        name: 'te',
        nameRu: 'тэ',
        category: 'basic-consonants',
        audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/33/Ru-20-%D0%B1%D1%83%D0%BA%D0%B2%D0%B0-%D0%A2.ogg'
      },
      {
        char: 'Ф',
        latin: 'f',
        name: 'ef',
        nameRu: 'эф',
        category: 'basic-consonants',
        audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b4/Ru-22-%D0%B1%D1%83%D0%BA%D0%B2%D0%B0-%D0%A4.ogg'
      },
      {
        char: 'Х',
        latin: 'kh',
        name: 'kha',
        nameRu: 'ха',
        category: 'basic-consonants',
        audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Ru-23-%D0%B1%D1%83%D0%BA%D0%B2%D0%B0-%D0%A5.ogg'
      },
      {
        char: 'Ц',
        latin: 'ts',
        name: 'tse',
        nameRu: 'цэ',
        category: 'basic-consonants',
        audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/40/Ru-24-%D0%B1%D1%83%D0%BA%D0%B2%D0%B0-%D0%A6.ogg'
      },
      {
        char: 'Ч',
        latin: 'ch',
        name: 'che',
        nameRu: 'че',
        category: 'basic-consonants',
        audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Ru-25-%D0%B1%D1%83%D0%BA%D0%B2%D0%B0-%D0%A7.ogg'
      },
      {
        char: 'Ш',
        latin: 'sh',
        name: 'sha',
        nameRu: 'ша',
        category: 'basic-consonants',
        audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Ru-26-%D0%B1%D1%83%D0%BA%D0%B2%D0%B0-%D0%A8.ogg'
      },
      {
        char: 'Щ',
        latin: 'shch',
        name: 'shcha',
        nameRu: 'ща',
        category: 'basic-consonants',
        audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Ru-27-%D0%B1%D1%83%D0%BA%D0%B2%D0%B0-%D0%A9.ogg'
      },
    ],
  },
  {
    id: 'soft-hard-signs',
    title: 'Soft & Hard Signs',
    titleRu: 'Знаки',
    letters: [
      {
        char: 'Ъ',
        latin: '"',
        name: 'tvyordy znak',
        nameRu: 'твёрдый знак',
        category: 'special',
        audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Ru-28-%D0%B1%D1%83%D0%BA%D0%B2%D0%B0-%D0%AA.ogg'
      },
      {
        char: 'Ь',
        latin: "'",
        name: 'myagkiy znak',
        nameRu: 'мягкий знак',
        category: 'special',
        audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Ru-30-%D0%B1%D1%83%D0%BA%D0%B2%D0%B0-%D0%AC.ogg'
      },
    ],
  },
];

export const allLetters = cyrillicGroups.flatMap((g) => g.letters);

export const getGroupLetters = (groupId: string) => {
  return cyrillicGroups.find((g) => g.id === groupId)?.letters || [];
};
