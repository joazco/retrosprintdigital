import { Theme } from "./sprint";

export const _defaultModel: Theme[] = [
  {
    id: 0,
    type: "is-success",
    title: "Liked – Qu’avez vous aimé lors de ce sprint ?"
  },
  {
    id: 1,
    type: "is-valid",
    title: "Learned – Qu’avez-vous appris lors de ce sprint ?"
  },
  {
    id: 2,
    type: "is-danger",
    title: "Lacked – De quoi avez-vous manqué lors de ce sprint ?"
  },
  {
    id: 3,
    type: "is-warning",
    title: "Longed for – Que désirez-vous pour le prochain sprint ?"
  }
];

export const _startstopModel: Theme[] = [
  {
    id: 0,
    type: "is-valid",
    title: "Start"
  },
  {
    id: 1,
    type: "is-danger",
    title: "Stop"
  },
  {
    id: 2,
    type: "is-warning",
    title: "Continue"
  }
];

export const _anchorsenginesModel: Theme[] = [
  {
    id: 0,
    type: "is-danger",
    title: "Anchors"
  },
  {
    id: 1,
    type: "is-valid",
    title: "Engines"
  }
];

export const _starfishModel: Theme[] = [
  {
    id: 0,
    type: "is-valid",
    title: "Start"
  },
  {
    id: 1,
    type: "is-valid",
    title: "More of"
  },
  {
    id: 2,
    type: "is-warning",
    title: "Continue"
  },
  {
    id: 3,
    type: "is-warning",
    title: "Less of"
  },
  {
    id: 4,
    type: "is-danger",
    title: "Stop"
  }
];
