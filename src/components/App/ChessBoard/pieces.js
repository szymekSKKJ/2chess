import Bb from "../../../assets/pieces_svg/bb.svg";
import Bw from "../../../assets/pieces_svg/bw.svg";
import Kb from "../../../assets/pieces_svg/kb.svg";
import Kw from "../../../assets/pieces_svg/kw.svg";
import Nb from "../../../assets/pieces_svg/nb.svg";
import Nw from "../../../assets/pieces_svg/nw.svg";
import Pb from "../../../assets/pieces_svg/pb.svg";
import Pw from "../../../assets/pieces_svg/pw.svg";
import Rb from "../../../assets/pieces_svg/rb.svg";
import Rw from "../../../assets/pieces_svg/rw.svg";
import Qb from "../../../assets/pieces_svg/qb.svg";
import Qw from "../../../assets/pieces_svg/qw.svg";

// Important order

const pieces = [
  {
    type: "rook",
    position: {
      row: 1,
      column: 1,
    },
    moved: false,
    isOnBoard: true,
    color: "white",
    src: Rw,
  },
  {
    type: "knight",
    position: {
      row: 1,
      column: 2,
    },
    moved: false,
    isOnBoard: true,
    color: "white",
    src: Nw,
  },
  {
    type: "bishop",
    position: {
      row: 1,
      column: 3,
    },
    moved: false,
    isOnBoard: true,
    color: "white",
    src: Bw,
  },
  {
    type: "king",
    position: {
      row: 1,
      column: 4,
    },
    moved: false,
    isOnBoard: true,
    color: "white",
    src: Kw,
  },
  {
    type: "queen",
    position: {
      row: 1,
      column: 5,
    },
    moved: false,
    isOnBoard: true,
    color: "white",
    src: Qw,
  },
  {
    type: "bishop",
    position: {
      row: 1,
      column: 6,
    },
    moved: false,
    isOnBoard: true,
    color: "white",
    src: Bw,
  },
  {
    type: "knight",
    position: {
      row: 1,
      column: 7,
    },
    moved: false,
    isOnBoard: true,
    color: "white",
    src: Nw,
  },
  {
    type: "rook",
    position: {
      row: 1,
      column: 8,
    },
    moved: false,
    isOnBoard: true,
    color: "white",
    src: Rw,
  },
  {
    type: "pawn",
    position: {
      row: 2,
      column: 1,
    },
    moved: false,
    isOnBoard: true,
    color: "white",
    src: Pw,
  },
  {
    type: "pawn",
    position: {
      row: 2,
      column: 2,
    },
    moved: false,
    isOnBoard: true,
    color: "white",
    src: Pw,
  },
  {
    type: "pawn",
    position: {
      row: 2,
      column: 3,
    },
    moved: false,
    isOnBoard: true,
    color: "white",
    src: Pw,
  },
  {
    type: "pawn",
    position: {
      row: 2,
      column: 4,
    },
    moved: false,
    isOnBoard: true,
    color: "white",
    src: Pw,
  },
  {
    type: "pawn",
    position: {
      row: 2,
      column: 5,
    },
    moved: false,
    isOnBoard: true,
    color: "white",
    src: Pw,
  },
  {
    type: "pawn",
    position: {
      row: 2,
      column: 6,
    },
    moved: false,
    isOnBoard: true,
    color: "white",
    src: Pw,
  },
  {
    type: "pawn",
    position: {
      row: 2,
      column: 7,
    },
    moved: false,
    isOnBoard: true,
    color: "white",
    src: Pw,
  },
  {
    type: "pawn",
    position: {
      row: 2,
      column: 8,
    },
    moved: false,
    isOnBoard: true,
    color: "white",
    src: Pw,
  },
  {
    type: "pawn",
    position: {
      row: 7,
      column: 1,
    },
    moved: false,
    isOnBoard: true,
    color: "black",
    src: Pb,
  },
  {
    type: "pawn",
    position: {
      row: 7,
      column: 2,
    },
    moved: false,
    isOnBoard: true,
    color: "black",
    src: Pb,
  },
  {
    type: "pawn",
    position: {
      row: 7,
      column: 3,
    },
    moved: false,
    isOnBoard: true,
    color: "black",
    src: Pb,
  },
  {
    type: "pawn",
    position: {
      row: 7,
      column: 4,
    },
    moved: false,
    isOnBoard: true,
    color: "black",
    src: Pb,
  },
  {
    type: "pawn",
    position: {
      row: 7,
      column: 5,
    },
    moved: false,
    isOnBoard: true,
    color: "black",
    src: Pb,
  },
  {
    type: "pawn",
    position: {
      row: 7,
      column: 6,
    },
    moved: false,
    isOnBoard: true,
    color: "black",
    src: Pb,
  },
  {
    type: "pawn",
    position: {
      row: 7,
      column: 7,
    },
    moved: false,
    isOnBoard: true,
    color: "black",
    src: Pb,
  },
  {
    type: "pawn",
    position: {
      row: 7,
      column: 8,
    },
    moved: false,
    isOnBoard: true,
    color: "black",
    src: Pb,
  },
  {
    type: "rook",
    position: {
      row: 8,
      column: 1,
    },
    moved: false,
    isOnBoard: true,
    color: "black",
    src: Rb,
  },
  {
    type: "knight",
    position: {
      row: 8,
      column: 2,
    },
    moved: false,
    isOnBoard: true,
    color: "black",
    src: Nb,
  },
  {
    type: "bishop",
    position: {
      row: 8,
      column: 3,
    },
    moved: false,
    isOnBoard: true,
    color: "black",
    src: Bb,
  },
  {
    type: "king",
    position: {
      row: 8,
      column: 4,
    },
    moved: false,
    isOnBoard: true,
    color: "black",
    src: Kb,
  },
  {
    type: "queen",
    position: {
      row: 8,
      column: 5,
    },
    moved: false,
    isOnBoard: true,
    color: "black",
    src: Qb,
  },
  {
    type: "bishop",
    position: {
      row: 8,
      column: 6,
    },
    moved: false,
    isOnBoard: true,
    color: "black",
    src: Bb,
  },
  {
    type: "knight",
    position: {
      row: 8,
      column: 7,
    },
    moved: false,
    isOnBoard: true,
    color: "black",
    src: Nb,
  },
  {
    type: "rook",
    position: {
      row: 8,
      column: 8,
    },
    isOnBoard: true,
    moved: false,
    color: "black",
    src: Rb,
  },
];

export { pieces };
