export interface StoryFragment {
  ru: string;
  es: string;
}

export interface Story {
  id: string;
  titleRu: string;
  titleEs: string;
  fragments: StoryFragment[];
}

export const stories: Story[] = [
  {
    id: 'repka',
    titleRu: 'Репка',
    titleEs: 'El Nabo Gigante',
    fragments: [
      {
        ru: 'Посадил дед репку. Выросла репка большая-пребольшая.',
        es: 'El abuelo plantó un nabo. El nabo creció enorme.'
      },
      {
        ru: 'Стал дед репку из земли тянуть. Тянет-потянет, вытянуть не может.',
        es: 'El abuelo empezó a tirar del nabo para sacarlo de la tierra. Tira y tira, pero no puede sacarlo.'
      },
      {
        ru: 'Позвал дед бабку. Бабка за дедку, дедка за репку — тянут-потянут, вытянуть не могут.',
        es: 'El abuelo llamó a la abuela. La abuela tira del abuelo, el abuelo del nabo. Tiran y tiran, pero no pueden sacarlo.'
      },
      {
        ru: 'Позвала бабка внучку. Внучка за бабку, бабка за дедку, дедка за репку — тянут-потянут, вытянуть не могут.',
        es: 'La abuela llamó a la nieta. La nieta de la abuela, la abuela del abuelo, el abuelo del nabo. Tiran y tiran, pero no pueden sacarlo.'
      },
      {
        ru: 'Позвала внучка Жучку. Жучка за внучку, внучка за бабку, бабка за дедку, дедка за репку — тянут-потянут, вытянуть не могут.',
        es: 'La nieta llamó a la perrita Zhuchka. Zhuchka de la nieta, la nieta de la abuela, la abuela del abuelo, el abuelo del nabo. Tiran y tiran, pero no pueden.'
      },
      {
        ru: 'Позвала Жучка кошку. Кошка за Жучку, Жучка за внучку, внучка за бабку, бабка за дедку, дедка за репку — тянут-потянут, вытянуть не могут.',
        es: 'Zhuchka llamó a la gatita. La gatita de Zhuchka, Zhuchka de la nieta, la nieta de la abuela, la abuela del abuelo, el abuelo del nabo. Tiran y tiran, pero no pueden.'
      },
      {
        ru: 'Позвала кошка мышку. Мышка за кошку, кошка за Жучку, Жучка за внучку, внучка за бабку, бабка за дедку, дедка за репку — тянут-потянут — вытянули репку!',
        es: 'La gatita llamó al ratón. El ratón de la gatita, la gatita de Zhuchka, Zhuchka de la nieta, la nieta de la abuela, la abuela del abuelo, el abuelo del nabo. ¡Tiran y tiran y sacaron el nabo!'
      }
    ]
  },
  {
    id: 'kolobok',
    titleRu: 'Колобок',
    titleEs: 'El Bollo Redondo',
    fragments: [
      {
        ru: 'Жили-были старик со старухой. Вот и говорит старик старухе: — Пойди-ка, старуха, по коробу поскреби, по сусеку помети, не наскребешь ли муки на колобок.',
        es: 'Había una vez un anciano y una anciana. El anciano le dijo a la anciana: "Ve, anciana, raspa el cajón, barre el granero, ¿no podrías conseguir algo de harina para hacer un bollo redondo?"'
      },
      {
        ru: 'Взяла старуха крылышко, по коробу поскребла, по сусеку помела и наскребла муки пригоршни две.',
        es: 'La anciana tomó un ala de plumas, raspó el cajón, barrió el granero y juntó unos dos puñados de harina.'
      },
      {
        ru: 'Замесила муку на сметане, состряпала колобок, изжарила в масле и положила на окошко простынуть.',
        es: 'Amasó la harina con crema agria, preparó un bollo, lo frió en aceite y lo puso en la ventana para que se enfriara.'
      },
      {
        ru: 'Колобок лежал, лежал, взял да и покатился — с окна на завалинку, с завалинки на травку, с травки на дорожку — и покатился по дороге.',
        es: 'El bollo estuvo acostado un rato, luego se dio la vuelta y rodó: de la ventana al banco, del banco a la hierba, de la hierba al sendero, y rodó por el camino.'
      },
      {
        ru: 'Катится колобок по дороге, навстречу ему заяц: — Колобок, колобок, я тебя съем! — Не ешь меня, косой заяц, я тебе песенку спою!',
        es: 'El bollo rodaba por el camino cuando se encontró con una liebre: "¡Bollo, bollo, te voy a comer!" "¡No me comas, liebre orejona, te cantaré una canción!"'
      },
      {
        ru: 'И покатился колобок дальше — только заяц его и видел!',
        es: '¡Y el bollo siguió rodando, y la liebre no lo volvió a ver!'
      }
    ]
  },
  {
    id: 'teremok',
    titleRu: 'Теремок',
    titleEs: 'La Casita en el Campo',
    fragments: [
      {
        ru: 'Стоит в поле теремок. Он не низок, не высок. Бежит мимо мышка-норушка.',
        es: 'Hay una casita en el campo. No es baja ni alta. Pasa corriendo un ratoncito excavador.'
      },
      {
        ru: 'Увидела теремок, остановилась и спрашивает: — Терем-теремок! Кто в тереме живет? Никто не отзывается.',
        es: 'Vio la casita, se detuvo y preguntó: "¡Casita, casita! ¿Quién vive en la casita?" Nadie responde.'
      },
      {
        ru: 'Вошла мышка в теремок и стала в нем жить.',
        es: 'El ratoncito entró en la casita y comenzó a vivir en ella.'
      },
      {
        ru: 'Прискакала лягушка-квакушка: — Терем-теремок! Кто в тереме живет? — Я, мышка-норушка! А ты кто? — А я лягушка-квакушка. — Ступай ко мне жить!',
        es: 'Saltó una ranita croadora: "¡Casita, casita! ¿Quién vive aquí?" "¡Yo, el ratoncito! ¿Y tú quién eres?" "Yo soy la ranita croadora". "¡Ven a vivir conmigo!"'
      },
      {
        ru: 'Стали они вдвоем жить. Прибежал зайчик-побегайчик, постучал и тоже стал жить с ними.',
        es: 'Empezaron a vivir los dos. Llegó corriendo el conejito saltarín, tocó y también empezó a vivir con ellos.'
      },
      {
        ru: 'Затем пришла лисичка-сестричка и волчок-серый бочок. Стали они жить все вместе.',
        es: 'Luego llegó la zorrita hermana y el lobito gris. Empezaron a vivir todos juntos.'
      },
      {
        ru: 'Но вдруг пришел косолапый медведь. Не поместился в теремок и залез на крышу — теремок и развалился!',
        es: 'Pero de repente llegó el oso patoso. No cabía en la casita y se subió al tejado. ¡Y la casita se derrumbó!'
      },
      {
        ru: 'Но звери не унывали: принялись они бревна носить, доски пилить — и построили новый теремок, лучше прежнего!',
        es: 'Pero los animales no se desanimaron: se pusieron a cargar troncos, serrar tablas, ¡y construyeron una casita nueva, mejor que la anterior!'
      }
    ]
  }
];
