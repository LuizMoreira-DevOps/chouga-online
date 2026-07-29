import camisetaUnissexGuideImage from "../assets/images/guias/camiseta-unissex.png";
import camisetaMangaLongaGuideImage from "../assets/images/guias/camiseta-manga-longa-unissex.png";
import babyLookGuideImage from "../assets/images/guias/camiseta-babylook.png";
import moletomUnissexGuideImage from "../assets/images/guias/moletom-unissex.png";

export const sizeGuides = {
  camiseta_unissex: {
    label: "Camiseta unissex",
    title: "Guia de medidas — Camiseta unissex",
    description:
      "Compare as medidas da tabela com uma peça semelhante que vista bem em você. Faça as medições com a roupa apoiada sobre uma superfície plana.",

    image: camisetaUnissexGuideImage,
    imageAlt: "Ilustração de como medir uma camiseta unissex",

    columns: [
      { key: "size", label: "Tamanho" },
      { key: "width", label: "Largura" },
      { key: "height", label: "Altura" },
      { key: "sleeve", label: "Manga" },
    ],
    measurements: [
      { size: "PP", width: 47, height: 65, sleeve: 21 },
      { size: "P", width: 50, height: 67, sleeve: 22 },
      { size: "M", width: 52, height: 69, sleeve: 22 },
      { size: "G", width: 54, height: 70, sleeve: 23 },
      { size: "GG", width: 56, height: 72, sleeve: 23 },
      { size: "XG", width: 60, height: 77, sleeve: 25 },
      { size: "XGG", width: 65, height: 79, sleeve: 25 },
      { size: "XGGG", width: 69, height: 81, sleeve: 25 },
    ],
    instructions: [
      {
        label: "Largura",
        text: "meça a peça de uma axila à outra.",
      },
      {
        label: "Altura",
        text: "meça do ponto mais alto do ombro até a barra.",
      },
      {
        label: "Manga",
        text: "meça da costura do ombro até a extremidade da manga.",
      },
    ],
    tolerance:
      "As medidas podem variar de 1 cm a 3 cm devido ao processo de confecção.",
  },

  camiseta_manga_longa: {
    label: "Camiseta de manga longa",
    title: "Guia de medidas — Camiseta de manga longa",
    description:
      "Compare as medidas da tabela com uma peça semelhante que vista bem em você. Faça as medições com a roupa apoiada sobre uma superfície plana.",

    image: camisetaMangaLongaGuideImage,
    imageAlt:
      "Ilustração de como medir uma camiseta de manga longa pela largura e altura.",

    columns: [
      { key: "size", label: "Tamanho" },
      { key: "width", label: "Largura" },
      { key: "height", label: "Altura" },
    ],

    measurements: [
      { size: "PP", width: 47, height: 65 },
      { size: "P", width: 50, height: 67 },
      { size: "M", width: 52, height: 69 },
      { size: "G", width: 54, height: 70 },
      { size: "GG", width: 56, height: 72 },
      { size: "XG", width: 60, height: 77 },
      { size: "XGG", width: 65, height: 79 },
      { size: "XGGG", width: 69, height: 81 },
    ],

    instructions: [
      {
        label: "Largura",
        text: "meça a peça de uma axila à outra.",
      },
      {
        label: "Altura",
        text: "meça do ponto mais alto do ombro até a barra.",
      },
    ],

    tolerance:
      "As medidas podem variar de 1 cm a 3 cm devido ao processo de confecção.",
  },

  baby_look: {
    label: "Baby look",
    title: "Guia de medidas — Baby look",
    description:
      "Compare as medidas da tabela com uma peça semelhante que vista bem em você. Faça as medições com a roupa apoiada sobre uma superfície plana.",
    image: babyLookGuideImage,
    imageAlt: "Ilustração de como medir uma baby look",

    columns: [
      { key: "size", label: "Tamanho" },
      { key: "width", label: "Largura" },
      { key: "height", label: "Altura" },
      { key: "sleeve", label: "Manga" },
    ],
    measurements: [
      { size: "P", width: 40, height: 60, sleeve: 13 },
      { size: "M", width: 42, height: 62, sleeve: 13 },
      { size: "G", width: 45, height: 64, sleeve: 14 },
      { size: "GG", width: 49, height: 65, sleeve: 14 },
      { size: "XG", width: 52, height: 67, sleeve: 15 },
      { size: "XGG", width: 55, height: 69, sleeve: 17 },
      { size: "XGGG", width: 58, height: 71, sleeve: 18 },
    ],
    instructions: [
      {
        label: "Largura",
        text: "meça a peça de uma axila à outra.",
      },
      {
        label: "Altura",
        text: "meça do ponto mais alto do ombro até a barra.",
      },
      {
        label: "Manga",
        text: "meça da costura do ombro até a extremidade da manga.",
      },
    ],
    tolerance:
      "As medidas podem variar de 1 cm a 3 cm devido ao processo de confecção.",
  },

  camiseta_infantil: {
    label: "Camiseta infantil",
    title: "Guia de medidas — Camiseta infantil",
    description:
      "Compare as medidas da tabela com uma peça semelhante que vista bem na criança. Faça as medições com a roupa apoiada sobre uma superfície plana.",

    image: camisetaUnissexGuideImage,
    imageAlt:
      "Ilustração de como medir uma camiseta infantil pela largura, altura e manga.",

    columns: [
      { key: "size", label: "Tamanho" },
      { key: "width", label: "Largura" },
      { key: "height", label: "Altura" },
      { key: "sleeve", label: "Manga" },
    ],
    measurements: [
      { size: "1", width: 31, height: 37, sleeve: 10 },
      { size: "2", width: 33, height: 41, sleeve: 11 },
      { size: "4", width: 35, height: 45, sleeve: 13 },
      { size: "6", width: 37, height: 48, sleeve: 13 },
      { size: "8", width: 39, height: 52, sleeve: 15 },
      { size: "10", width: 42, height: 54, sleeve: 17 },
      { size: "12", width: 44, height: 57, sleeve: 18 },
      { size: "14", width: 45, height: 60, sleeve: 20 },
    ],
    instructions: [
      {
        label: "Largura",
        text: "meça a peça de uma axila à outra.",
      },
      {
        label: "Altura",
        text: "meça do ponto mais alto do ombro até a barra.",
      },
      {
        label: "Manga",
        text: "meça da costura do ombro até a extremidade da manga.",
      },
    ],
    tolerance:
      "As medidas podem variar de 1 cm a 3 cm devido ao processo de confecção.",
  },

  moletom_unissex: {
    label: "Moletom unissex",
    title: "Guia de medidas — Moletom unissex",
    description:
      "Compare as medidas da tabela com um moletom que vista bem em você. Faça as medições com a peça apoiada sobre uma superfície plana.",

    image: moletomUnissexGuideImage,
    imageAlt:
      "Ilustração de como medir um moletom unissex pela altura e largura.",

    columns: [
      { key: "size", label: "Tamanho" },
      { key: "height", label: "Altura" },
      { key: "width", label: "Largura" },
    ],
    measurements: [
      { size: "P", height: 66, width: 53 },
      { size: "M", height: 69, width: 57 },
      { size: "G", height: 70, width: 60 },
      { size: "GG", height: 74, width: 64 },
    ],
    instructions: [
      {
        label: "Largura",
        text: "meça a peça de uma axila à outra.",
      },
      {
        label: "Altura",
        text: "meça do ponto mais alto do ombro até a barra.",
      },
    ],
    tolerance:
      "Devido ao processo manual de costura, as medidas podem variar em até 2 cm.",
  },
};
