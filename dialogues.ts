/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface DialogueQuestion {
  id: number;
  es: {
    coach: string;
    player: string;
    question: string;
    options: string[];
  };
  hy: {
    coach: string;
    player: string;
    question: string;
    options: string[];
  };
  correctAnswer: number; // 0=A, 1=B, 2=C, 3=D
}

export const SECRET_WORD = 'ASISTENCIA';

export const DIALOGUES: DialogueQuestion[] = [
  {
    id: 1,
    es: {
      question: 'Lee el diálogo entre el entrenador y el jugador. ¿De qué hablan? Elige la respuesta correcta.',
      coach: 'No intentes hacerlo todo solo. Busca a un compañero libre.',
      player: 'Vale, la próxima vez le paso el balón.',
      options: [
        'De los pases.',
        'De una sustitución.',
        'Del horario del partido.',
        'De la camiseta.'
      ]
    },
    hy: {
      question: 'Կարդա մարզչի և խաղացողի երկխոսությունը։ Ինչի՞ մասին է խոսքը։ Ընտրիր ճիշտ պատասխանը։',
      coach: 'Մի՛ փորձիր ամեն ինչ մենակ անել։ Փնտրի՛ր ազատ թիմակցի։',
      player: 'Լավ, հաջորդ անգամ գնդակը նրան կփոխանցեմ։',
      options: [
        'Փոխանցումների մասին։',
        'Փոխարինման մասին։',
        'Խաղի ժամի մասին։',
        'Մարզաշապիկի մասին։'
      ]
    },
    correctAnswer: 0 // A
  },
  {
    id: 2,
    es: {
      question: 'Lee el diálogo entre el entrenador y el jugador. ¿De qué hablan? Elige la respuesta correcta.',
      coach: 'Antes de empezar, corre un poco y mueve los brazos y las piernas.',
      player: 'Vale. Quiero preparar bien el cuerpo.',
      options: [
        'Del descanso.',
        'Del calentamiento.',
        'De celebrar un gol.',
        'De un viaje.'
      ]
    },
    hy: {
      question: 'Կարդա մարզչի և խաղացողի երկխոսությունը։ Ինչի՞ մասին է խոսքը։ Ընտրիր ճիշտ պատասխանը։',
      coach: 'Սկսելուց առաջ մի քիչ վազի՛ր և շարժի՛ր ձեռքերդ ու ոտքերդ։',
      player: 'Լավ։ Ուզում եմ մարմինս լավ պատրաստել։',
      options: [
        'Հանգստի մասին։',
        'Նախավարժանքի մասին։',
        'Գոլ տոնելու մասին։',
        'Ուղևորության մասին։'
      ]
    },
    correctAnswer: 1 // B
  },
  {
    id: 3,
    es: {
      question: 'Lee el diálogo entre el entrenador y el jugador. ¿De qué hablan? Elige la respuesta correcta.',
      coach: '¿Puedes seguir o necesitas salir?',
      player: 'Estoy muy cansado. Prefiero que entre otro compañero.',
      options: [
        'De un córner.',
        'De un entrenador nuevo.',
        'De una sustitución.',
        'De un pase.'
      ]
    },
    hy: {
      question: 'Կարդա մարզչի և խաղացողի երկխոսությունը։ Ինչի՞ մասին է խոսքը։ Ընտրիր ճիշտ պատասխանը։',
      coach: 'Կարո՞ղ ես շարունակել, թե՞ պետք է դուրս գաս։',
      player: 'Շատ հոգնած եմ։ Նախընտրում եմ, որ ուրիշ թիմակից մտնի։',
      options: [
        'Անկյունայինի մասին։',
        'Նոր մարզչի մասին։',
        'Փոխարինման մասին։',
        'Փոխանցման մասին։'
      ]
    },
    correctAnswer: 2 // C
  },
  {
    id: 4,
    es: {
      question: 'Lee el diálogo entre el entrenador y el jugador. ¿De qué hablan? Elige la respuesta correcta.',
      coach: 'El número nueve está solo. No dejes que reciba tan fácilmente.',
      player: 'Voy a quedarme cerca de él.',
      options: [
        'De tirar a portería.',
        'De un saque de banda.',
        'De descansar después del partido.',
        'De marcar a un rival.'
      ]
    },
    hy: {
      question: 'Կարդա մարզչի և խաղացողի երկխոսությունը։ Ինչի՞ մասին է խոսքը։ Ընտրիր ճիշտ պատասխանը։',
      coach: 'Իններորդ համարն ազատ է։ Թույլ մի՛ տուր, որ այդքան հեշտ գնդակ ստանա։',
      player: 'Կմնամ նրա մոտ։',
      options: [
        'Դարպասին հարվածելու մասին։',
        'Գնդակը եզրից խաղի մեջ մտցնելու մասին։',
        'Խաղից հետո հանգստանալու մասին։',
        'Մրցակցին հսկելու մասին։'
      ]
    },
    correctAnswer: 3 // D
  },
  {
    id: 5,
    es: {
      question: 'Lee el diálogo entre el entrenador y el jugador. ¿De qué hablan? Elige la respuesta correcta.',
      coach: 'Tienes espacio y estás cerca de la portería. ¡Prueba!',
      player: 'Vale, voy a intentar marcar.',
      options: [
        'De un tiro a portería.',
        'De volver a defender.',
        'De cambiar al portero.',
        'De salir del campo.'
      ]
    },
    hy: {
      question: 'Կարդա մարզչի և խաղացողի երկխոսությունը։ Ինչի՞ մասին է խոսքը։ Ընտրիր ճիշտ պատասխանը։',
      coach: 'Ազատ տարածք ունես և դարպասին մոտ ես։ Փորձի՛ր։',
      player: 'Լավ, կփորձեմ գոլ խփել։',
      options: [
        'Դարպասին հարվածելու մասին։',
        'Պաշտպանություն վերադառնալու մասին։',
        'Դարպասապահին փոխելու մասին։',
        'Խաղադաշտից դուրս գալու մասին։'
      ]
    },
    correctAnswer: 0 // A
  },
  {
    id: 6,
    es: {
      question: 'Lee el diálogo entre el entrenador y el jugador. ¿De qué hablan? Elige la respuesta correcta.',
      coach: 'No te quedes detrás del defensa. Muévete hacia un espacio libre.',
      player: 'Así mi compañero puede verme y pasarme el balón.',
      options: [
        'De una falta.',
        'De un desmarque.',
        'Del vestuario.',
        'Del resultado.'
      ]
    },
    hy: {
      question: 'Կարդա մարզչի և խաղացողի երկխոսությունը։ Ինչի՞ մասին է խոսքը։ Ընտրիր ճիշտ պատասխանը։',
      coach: 'Մի՛ մնա պաշտպանի հետևում։ Շարժվի՛ր դեպի ազատ տարածք։',
      player: 'Այդպես թիմակիցս կարող է ինձ տեսնել և գնդակը փոխանցել։',
      options: [
        'Կանոնների խախտման մասին։',
        'Մրցակցի հսկողությունից ազատվելու մասին։',
        'Հանդերձարանի մասին։',
        'Խաղի արդյունքի մասին։'
      ]
    },
    correctAnswer: 1 // B
  },
  {
    id: 7,
    es: {
      question: 'Lee el diálogo entre el entrenador y el jugador. ¿De qué hablan? Elige la respuesta correcta.',
      coach: 'Hemos perdido el balón. ¡Todos hacia nuestra portería!',
      player: 'Voy a ayudar a los defensas.',
      options: [
        'De celebrar un gol.',
        'De elegir un asiento.',
        'De volver a defender.',
        'De lanzar una falta.'
      ]
    },
    hy: {
      question: 'Կարդա մարզչի և խաղացողի երկխոսությունը։ Ինչի՞ մասին է խոսքը։ Ընտրիր ճիշտ պատասխանը։',
      coach: 'Գնդակը կորցրել ենք։ Բոլորդ դեպի մեր դարպա՛սը։',
      player: 'Գնում եմ պաշտպաններին օգնելու։',
      options: [
        'Գոլը տոնելու մասին։',
        'Նստատեղ ընտրելու մասին։',
        'Պաշտպանություն վերադառնալու մասին։',
        'Տուգանային հարված կատարելու մասին։'
      ]
    },
    correctAnswer: 2 // C
  },
  {
    id: 8,
    es: {
      question: 'Lee el diálogo entre el entrenador y el jugador. ¿De qué hablan? Elige la respuesta correcta.',
      coach: 'El balón viene por arriba. Salta en el momento adecuado.',
      player: 'Intentaré enviarlo a la portería con la cabeza.',
      options: [
        'De un pase con el pie.',
        'De atrapar el balón con las manos.',
        'De controlar con el pecho.',
        'De un remate de cabeza.'
      ]
    },
    hy: {
      question: 'Կարդա մարզչի և խաղացողի երկխոսությունը։ Ինչի՞ մասին է խոսքը։ Ընտրիր ճիշտ պատասխանը։',
      coach: 'Գնդակը վերևից է գալիս։ Ճիշտ պահին ցատկի՛ր։',
      player: 'Կփորձեմ գլխով այն ուղարկել դեպի դարպասը։',
      options: [
        'Ոտքով փոխանցման մասին։',
        'Գնդակը ձեռքերով բռնելու մասին։',
        'Գնդակը կրծքով կանգնեցնելու մասին։',
        'Գլխով հարվածի մասին։'
      ]
    },
    correctAnswer: 3 // D
  },
  {
    id: 9,
    es: {
      question: 'Lee el diálogo entre el entrenador y el jugador. ¿De qué hablan? Elige la respuesta correcta.',
      coach: 'No pasa nada por ese error. Sigue intentándolo.',
      player: 'Gracias. La próxima jugada puede salir mejor.',
      options: [
        'De dar ánimo después de un error.',
        'De castigar a un jugador.',
        'De cancelar el partido.',
        'De cambiar la hora del entrenamiento.'
      ]
    },
    hy: {
      question: 'Կարդա մարզչի և խաղացողի երկխոսությունը։ Ինչի՞ մասին է խոսքը։ Ընտրիր ճիշտ պատասխանը։',
      coach: 'Այդ սխալի համար ոչինչ։ Շարունակի՛ր փորձել։',
      player: 'Շնորհակալություն։ Հաջորդ խաղային դրվագը կարող է ավելի լավ ստացվել։',
      options: [
        'Սխալից հետո քաջալերելու մասին։',
        'Խաղացողին պատժելու մասին։',
        'Խաղը չեղարկելու մասին։',
        'Մարզման ժամը փոխելու մասին։'
      ]
    },
    correctAnswer: 0 // A
  },
  {
    id: 10,
    es: {
      question: 'Lee el diálogo entre el entrenador y el jugador. ¿De qué hablan? Elige la respuesta correcta.',
      coach: 'No discutas más. Ya te ha mostrado una amarilla.',
      player: 'Vale, voy a calmarme y seguir jugando.',
      options: [
        'De celebrar con los compañeros.',
        'De dejar de discutir con el árbitro.',
        'De saludar a los aficionados.',
        'De pedir un pase al entrenador.'
      ]
    },
    hy: {
      question: 'Կարդա մարզչի և խաղացողի երկխոսությունը։ Ինչի՞ մասին է խոսքը։ Ընտրիր ճիշտ պատասխանը։',
      coach: 'Այլևս մի՛ վիճիր։ Քեզ արդեն դեղին քարտ է ցույց տվել։',
      player: 'Լավ, կհանգստանամ և կշարունակեմ խաղալ։',
      options: [
        'Թիմակիցների հետ գոլ տոնելու մասին։',
        'Մրցավարի հետ չվիճելու մասին։',
        'Երկրպագուներին ողջունելու մասին։',
        'Մարզչից փոխանցում խնդրելու մասին։'
      ]
    },
    correctAnswer: 1 // B
  },
  {
    id: 11,
    es: {
      question: 'Lee el diálogo entre el entrenador y el jugador. ¿De qué hablan? Elige la respuesta correcta.',
      coach: 'Vamos dos a dos y queda un minuto.',
      player: 'Todavía podemos marcar y ganar.',
      options: [
        'De una derrota del equipo.',
        'Del comienzo del entrenamiento.',
        'De un empate y la posibilidad de ganar.',
        'De un partido que ya ha terminado.'
      ]
    },
    hy: {
      question: 'Կարդա մարզչի և խաղացողի երկխոսությունը։ Ինչի՞ մասին է խոսքը։ Ընտրիր ճիշտ պատասխանը։',
      coach: 'Հաշիվը երկու-երկու է, և մեկ րոպե է մնացել։',
      player: 'Դեռ կարող ենք գոլ խփել և հաղթել։',
      options: [
        'Թիմի պարտության մասին։',
        'Մարզման սկզբի մասին։',
        'Հավասար հաշվի և հաղթելու հնարավորության մասին։',
        'Արդեն ավարտված խաղի մասին։'
      ]
    },
    correctAnswer: 2 // C
  },
  {
    id: 12,
    es: {
      question: 'Lee el diálogo entre el entrenador y el jugador. ¿De qué hablan? Elige la respuesta correcta.',
      coach: 'Hay demasiados jugadores en el centro. Busca a Pablo por la derecha.',
      player: 'Vale, voy a enviar el balón hacia esa banda.',
      options: [
        'De quedarse en el centro.',
        'De sacar el balón fuera del campo.',
        'De acercarse al portero.',
        'De llevar el ataque hacia la banda.'
      ]
    },
    hy: {
      question: 'Կարդա մարզչի և խաղացողի երկխոսությունը։ Ինչի՞ մասին է խոսքը։ Ընտրիր ճիշտ պատասխանը։',
      coach: 'Կենտրոնում չափազանց շատ խաղացողներ կան։ Աջ կողմում փնտրի՛ր Պաբլոյին։',
      player: 'Լավ, գնդակը կուղարկեմ այդ եզրը։',
      options: [
        'Կենտրոնում մնալու մասին։',
        'Գնդակը դաշտից դուրս հանելու մասին։',
        'Դարպասապահին մոտենալու մասին։',
        'Գրոհը դեպի եզր տեղափոխելու մասին։'
      ]
    },
    correctAnswer: 3 // D
  },
  {
    id: 13,
    es: {
      question: 'Lee el diálogo entre el entrenador y el jugador. ¿De qué hablan? Elige la respuesta correcta.',
      coach: 'Mañana salimos a las siete. El conductor no puede esperar.',
      player: 'Estaré junto al autobús diez minutos antes.',
      options: [
        'De la hora de salida del equipo.',
        'Del resultado del partido.',
        'Del desayuno del hotel.',
        'De la duración del entrenamiento.'
      ]
    },
    hy: {
      question: 'Կարդա մարզչի և խաղացողի երկխոսությունը։ Ինչի՞ մասին է խոսքը։ Ընտրիր ճիշտ պատասխանը։',
      coach: 'Վաղը մեկնում ենք ժամը յոթին։ Վարորդը չի կարող սպասել։',
      player: 'Ավտոբուսի մոտ կլինեմ տասը րոպե շուտ։',
      options: [
        'Թիմի մեկնելու ժամի մասին։',
        'Խաղի հաշվի մասին։',
        'Հյուրանոցի նախաճաշի մասին։',
        'Մարզման տևողության մասին։'
      ]
    },
    correctAnswer: 0 // A
  },
  {
    id: 14,
    es: {
      question: 'Lee el diálogo entre el entrenador y el jugador. ¿De qué hablan? Elige la respuesta correcta.',
      coach: '¿Has metido las botas y las espinilleras?',
      player: 'Sí, solo me falta guardar la camiseta.',
      options: [
        'De comprar una equipación nueva.',
        'De preparar la bolsa de deporte.',
        'De lavar la ropa.',
        'De una maleta perdida.'
      ]
    },
    hy: {
      question: 'Կարդա մարզչի և խաղացողի երկխոսությունը։ Ինչի՞ մասին է խոսքը։ Ընտրիր ճիշտ պատասխանը։',
      coach: 'Խաղակոշիկներն ու սրունքապաշտպանները դրե՞լ ես։',
      player: 'Այո, միայն մարզաշապիկը դնելն է մնացել։',
      options: [
        'Նոր համազգեստ գնելու մասին։',
        'Մարզական պայուսակը պատրաստելու մասին։',
        'Հագուստը լվանալու մասին։',
        'Կորած ճամպրուկի մասին։'
      ]
    },
    correctAnswer: 1 // B
  },
  {
    id: 15,
    es: {
      question: 'Lee el diálogo entre el entrenador y el jugador. ¿De qué hablan? Elige la respuesta correcta.',
      coach: 'Ten tu pasaporte preparado. Nos lo van a pedir en el control.',
      player: 'Lo llevo aquí, en el bolsillo de la mochila.',
      options: [
        'De las entradas del partido.',
        'De la llave del hotel.',
        'De los documentos de viaje.',
        'De las fotos del equipo.'
      ]
    },
    hy: {
      question: 'Կարդա մարզչի և խաղացողի երկխոսությունը։ Ինչի՞ մասին է խոսքը։ Ընտրիր ճիշտ պատասխանը։',
      coach: 'Անձնագիրդ պատրաստ պահի՛ր։ Ստուգման ժամանակ այն կպահանջեն։',
      player: 'Այն այստեղ է՝ ուսապարկիս գրպանում։',
      options: [
        'Խաղի տոմսերի մասին։',
        'Հյուրանոցի բանալու մասին։',
        'Ճանապարհորդության փաստաթղթերի մասին։',
        'Թիմի լուսանկարների մասին։'
      ]
    },
    correctAnswer: 2 // C
  },
  {
    id: 16,
    es: {
      question: 'Lee el diálogo entre el entrenador y el jugador. ¿De qué hablan? Elige la respuesta correcta.',
      coach: 'Ahora pone que salimos a las doce, no a las diez.',
      player: 'Entonces tenemos que esperar dos horas más en el aeropuerto.',
      options: [
        'De la cancelación del vuelo.',
        'De salir antes de lo previsto.',
        'De un pago por llegar tarde al hotel.',
        'De un retraso del vuelo.'
      ]
    },
    hy: {
      question: 'Կարդա մարզչի և խաղացողի երկխոսությունը։ Ինչի՞ մասին է խոսքը։ Ընտրիր ճիշտ պատասխանը։',
      coach: 'Հիմա գրված է, որ մեկնում ենք ժամը տասներկուսին, ոչ թե տասին։',
      player: 'Ուրեմն օդանավակայանում պետք է ևս երկու ժամ սպասենք։',
      options: [
        'Թռիչքի չեղարկման մասին։',
        'Ավելի շուտ մեկնելու մասին։',
        'Հյուրանոց ուշ հասնելու համար վճարի մասին։',
        'Թռիչքի ուշացման մասին։'
      ]
    },
    correctAnswer: 3 // D
  },
  {
    id: 17,
    es: {
      question: 'Lee el diálogo entre el entrenador y el jugador. ¿De qué hablan? Elige la respuesta correcta.',
      coach: 'Tú y Marcos vais a dormir en la 204. Aquí tenéis las dos llaves.',
      player: 'Perfecto. Vamos a dejar las maletas.',
      options: [
        'Del reparto de habitaciones en el hotel.',
        'De los números de los jugadores.',
        'De los asientos del autobús.',
        'De las entradas al estadio.'
      ]
    },
    hy: {
      question: 'Կարդա մարզչի և խաղացողի երկխոսությունը։ Ինչի՞ մասին է խոսքը։ Ընտրիր ճիշտ պատասխանը։',
      coach: 'Դու և Մարկոսը քնելու եք 204 սենյակում։ Ահա ձեր երկու բանալիները։',
      player: 'Հիանալի է։ Գնում ենք ճամպրուկները թողնելու։',
      options: [
        'Հյուրանոցում սենյակների բաշխման մասին։',
        'Խաղացողների համարների մասին։',
        'Ավտոբուսի նստատեղերի մասին։',
        'Մարզադաշտի մուտքերի մասին։'
      ]
    },
    correctAnswer: 0 // A
  },
  {
    id: 18,
    es: {
      question: 'Lee el diálogo entre el entrenador y el jugador. ¿De qué hablan? Elige la respuesta correcta.',
      coach: 'Comemos a la una en el restaurante del hotel.',
      player: '¿Tenemos que bajar todos juntos? \n— Entrenador: Sí, nos vemos antes en recepción.',
      options: [
        'Del entrenamiento de la tarde.',
        'De la comida del equipo.',
        'Del vuelo de la mañana.',
        'De la limpieza de las habitaciones.'
      ]
    },
    hy: {
      question: 'Կարդա մարզչի և խաղացողի երկխոսությունը։ Ինչի՞ մասին է խոսքը։ Ընտրիր ճիշտ պատասխանը։',
      coach: 'Ժամը մեկին ճաշում ենք հյուրանոցի ռեստորանում։',
      player: 'Բոլորս միասի՞ն պետք է իջնենք։ \n— Մարզիչ․ Այո, դրանից առաջ կհանդիպենք ընդունարանում։',
      options: [
        'Երեկոյան մարզման մասին։',
        'Թիմի ընդհանուր ճաշի մասին։',
        'Առավոտյան թռիչքի մասին։',
        'Սենյակների մաքրման մասին։'
      ]
    },
    correctAnswer: 1 // B
  },
  {
    id: 19,
    es: {
      question: 'Lee el diálogo entre el entrenador y el jugador. ¿De qué hablan? Elige la respuesta correcta.',
      coach: 'Después del partido tenemos una hora para pasear por el centro.',
      player: '¡Qué bien! Quiero ver la plaza y hacer algunas fotos.',
      options: [
        'Del próximo rival.',
        'De entrenar en el estadio.',
        'De visitar la ciudad.',
        'De subir al avión.'
      ]
    },
    hy: {
      question: 'Կարդա մարզչի և խաղացողի երկխոսությունը։ Ինչի՞ մասին է խոսքը։ Ընտրիր ճիշտ պատասխանը։',
      coach: 'Խաղից հետո մեկ ժամ ունենք քաղաքի կենտրոնում զբոսնելու համար։',
      player: 'Ի՜նչ լավ է։ Ուզում եմ տեսնել հրապարակը և մի քանի լուսանկար անել։',
      options: [
        'Հաջորդ մրցակցի մասին։',
        'Մարզադաշտում մարզվելու մասին։',
        'Քաղաքն այցելելու մասին։',
        'Ինքնաթիռ նստելու մասին։'
      ]
    },
    correctAnswer: 2 // C
  },
  {
    id: 20,
    es: {
      question: 'Lee el diálogo entre el entrenador y el jugador. ¿De qué hablan? Elige la respuesta correcta.',
      coach: 'Ya hemos terminado el torneo. Mañana cogemos el avión para volver a casa.',
      player: 'Tengo ganas de ver a mi familia y contarle todo.',
      options: [
        'Del inicio de otro torneo.',
        'De quedarse otra semana en el hotel.',
        'De la llegada de la familia al estadio.',
        'De volver a casa después del torneo.'
      ]
    },
    hy: {
      question: 'Կարդա մարզչի և խաղացողի երկխոսությունը։ Ինչի՞ մասին է խոսքը։ Ընտրիր ճիշտ պատասխանը։',
      coach: 'Մրցաշարն արդեն ավարտել ենք։ Վաղը ինքնաթիռով տուն ենք վերադառնում։',
      player: 'Ուզում եմ տեսնել ընտանիքիս և ամեն ինչ պատմել։',
      options: [
        'Նոր մրցաշարի սկզբի մասին։',
        'Հյուրանոցում ևս մեկ շաբաթ մնալու մասին։',
        'Ընտանիքի՝ մարզադաշտ գալու մասին։',
        'Մրցաշարից հետո տուն վերադառնալու մասին։'
      ]
    },
    correctAnswer: 3 // D
  }
];

export const SPANISH_ALPHABET = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
  'N', 'Ñ', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
];
