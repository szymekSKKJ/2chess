const piecesMoves = [
  {
    type: "pawn",
    moves: [
      {
        columnAdder: 0,
        rowAdder: 1,
      },
      {
        columnAdder: 0,
        rowAdder: 2,
        mustBeNotMoved: true,
      },
      {
        columnAdder: 1,
        rowAdder: 1,
        mustTake: true,
      },
      {
        columnAdder: -1,
        rowAdder: 1,
        mustTake: true,
      },
    ],
  },
  {
    type: "knight",
    moves: [
      {
        rowAdder: 2,
        columnAdder: -1,
      },
      {
        rowAdder: 2,
        columnAdder: 1,
      },
      {
        rowAdder: 1,
        columnAdder: 2,
      },
      {
        rowAdder: 1,
        columnAdder: -2,
      },
      {
        rowAdder: -2,
        columnAdder: 1,
      },
      {
        rowAdder: -2,
        columnAdder: -1,
      },
      {
        rowAdder: -1,
        columnAdder: -2,
      },
      {
        rowAdder: -1,
        columnAdder: 2,
      },
    ],
  },
  {
    type: "bishop",
    moves: [
      {
        rowAdder: 1,
        columnAdder: 1,
        infinity: true,
      },
      {
        rowAdder: 1,
        columnAdder: -1,
        infinity: true,
      },
      {
        rowAdder: -1,
        columnAdder: 1,
        infinity: true,
      },
      {
        rowAdder: -1,
        columnAdder: -1,
        infinity: true,
      },
    ],
  },
  {
    type: "rook",
    moves: [
      {
        rowAdder: 1,
        columnAdder: 0,
        infinity: true,
      },
      {
        rowAdder: -1,
        columnAdder: -0,
        infinity: true,
      },
      {
        rowAdder: 0,
        columnAdder: 1,
        infinity: true,
      },
      {
        rowAdder: 0,
        columnAdder: -1,
        infinity: true,
      },
    ],
  },
  {
    type: "queen",
    moves: [
      {
        rowAdder: 1,
        columnAdder: 1,
        infinity: true,
      },
      {
        rowAdder: 1,
        columnAdder: -1,
        infinity: true,
      },
      {
        rowAdder: -1,
        columnAdder: 1,
        infinity: true,
      },
      {
        rowAdder: -1,
        columnAdder: -1,
        infinity: true,
      },
      {
        rowAdder: 0,
        columnAdder: 1,
        infinity: true,
      },
      {
        rowAdder: 0,
        columnAdder: -1,
        infinity: true,
      },
      {
        rowAdder: 1,
        columnAdder: 0,
        infinity: true,
      },
      {
        rowAdder: -1,
        columnAdder: 0,
        infinity: true,
      },
    ],
  },
  {
    type: "king",
    moves: [
      {
        rowAdder: 1,
        columnAdder: 0,
      },
      {
        rowAdder: -1,
        columnAdder: 0,
      },
      {
        rowAdder: 0,
        columnAdder: -1,
      },
      {
        rowAdder: 0,
        columnAdder: 1,
      },
      {
        rowAdder: -1,
        columnAdder: -1,
      },
      {
        rowAdder: 1,
        columnAdder: 1,
      },
      {
        rowAdder: -1,
        columnAdder: 1,
      },
      {
        rowAdder: 1,
        columnAdder: -1,
      },
      {
        type: "short-castle",
        rowAdder: 0,
        columnAdder: -2,
        mustBeNotMoved: true,
      },
      {
        type: "long-castle",
        rowAdder: 0,
        columnAdder: 2,
        mustBeNotMoved: true,
      },
    ],
  },
];

export default piecesMoves;
