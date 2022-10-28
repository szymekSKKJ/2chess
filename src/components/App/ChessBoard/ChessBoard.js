import { useEffect, useRef, useState } from "react";
import "./ChessBoard.css";
import { pieces as piecesToCopy } from "./pieces";
import pgnMarks from "./pgnMarks";
import piecesMoves from "./piecesMoves";
import timeTypes from "./timeTypes";
import pieceDefauldSong from "../../../assets/sounds/piece_default.mp3";

// NOTE!

// For security and better fluent of ChessBoard, this component is STATIC
// This means it doesnt use a lot of react fueaters (onClick in jsx, useState etc.)
// Thats because to make ChessBoard work static and dont get buggy with another reredner
// It all works using piecs.js file and doesnt use DOM to calculate

const ChessBoard = ({ timeType }) => {
  const chessBoardRef = useRef();
  const pieces = JSON.parse(JSON.stringify(piecesToCopy)); // For multiboard
  const [generatedFields, setGeneratedFields] = useState(null);
  const [pgnMoves, setPgnMoves] = useState([]);
  const [piecesForJSX, setPiecesForJSX] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const myColorPieces = "white";

  const gameTimeType = timeTypes.find((timeTypeLocal) => timeTypeLocal.type === timeType);
  const [whiteTime, setWhiteTime] = useState(gameTimeType.miliSeconds);
  const [blackTime, setBlackTime] = useState(gameTimeType.miliSeconds);

  let currentMove = "white";
  let areWhitePiecesDownSide = false;
  let isGameStarted = false;

  const generatePiece = (row, column) => {
    const foundPiece = pieces.find((piece) => {
      const { position } = piece;
      if (position.row === row && position.column === column) {
        return piece;
      }
    });

    if (foundPiece !== undefined) {
      return <div className="piece" style={{ backgroundImage: `url(${foundPiece.src})` }}></div>;
    }
  };

  const generateBoard = () => {
    const generatedFields = [];
    for (let row = 1; row < 9; row++) {
      for (let column = 1; column < 9; column++) {
        generatedFields.push(<div className="field">{generatePiece(row, column)}</div>);
      }
    }
    setGeneratedFields(generatedFields);
    return generatedFields;
  };

  const findFieldIndexByPosition = (position) => {
    const { column, row } = position;
    const index = (row - 1) * 8 + column - 1;
    return index;
  };

  const findPieceByPosition = (position) => {
    const { column, row } = position;
    const foundPieceWithGivenPosition = pieces.find((piece) => piece.isOnBoard && piece.position.row === row && piece.position.column === column);
    return foundPieceWithGivenPosition;
  };

  const findPositionByFieldIndex = (index) => {
    const position = {
      row: Math.ceil((index + 1) / 8),
      column: (index % 8) + 1,
    };

    return position;
  };

  const findKing = (color) => {
    const foundKing = pieces.find((piece) => {
      const { color: colorLocal, type } = piece;

      if (type === "king" && colorLocal === color) {
        return piece;
      }
    });

    return {
      foundKing: foundKing,
      fieldElementIndex: findFieldIndexByPosition(foundKing.position),
    };
  };

  const validationForPieceType = (pieceType, positionForCurrentMove, move, isPieceMoved, pieceColor) => {
    if (pieceType === "pawn") {
      const { mustBeNotMoved, mustTake } = move;
      const ifIsPieceInThisMove = findPieceByPosition(positionForCurrentMove);
      if (mustBeNotMoved === undefined && mustTake === undefined) {
        if (ifIsPieceInThisMove === undefined) {
          return {
            canAddThisMove: true,
            moveType: "normall",
          };
        } else {
          return {
            canAddThisMove: false,
          };
        }
      }
      if (mustBeNotMoved) {
        if (isPieceMoved === false) {
          const positionForOneRowEarlier = {
            row: pieceColor === "white" ? positionForCurrentMove.row - 1 : positionForCurrentMove.row + 1,
            column: positionForCurrentMove.column,
          };
          const ifIsPieceInOneRowEarlier = findPieceByPosition(positionForOneRowEarlier);

          if (ifIsPieceInOneRowEarlier === undefined && ifIsPieceInThisMove === undefined) {
            return {
              canAddThisMove: true,
              moveType: "normall",
            };
          } else {
            return {
              canAddThisMove: false,
            };
          }
        } else {
          return {
            canAddThisMove: false,
          };
        }
      }
      if (mustTake) {
        if (ifIsPieceInThisMove !== undefined && ifIsPieceInThisMove.color !== pieceColor) {
          return {
            canAddThisMove: true,
            moveType: "take",
          };
        } else {
          return {
            canAddThisMove: false,
          };
        }
      }
    }
    if (pieceType === "knight") {
      const pieceForThisPosition = findPieceByPosition(positionForCurrentMove);
      if (pieceForThisPosition !== undefined) {
        if (pieceForThisPosition.color === pieceColor) {
          return {
            canAddThisMove: false,
          };
        } else {
          return {
            canAddThisMove: true,
            moveType: "take",
          };
        }
      } else {
        return {
          canAddThisMove: true,
          moveType: "normall",
        };
      }
    }
    if (pieceType === "king") {
      const { type } = move;
      const pieceForThisPosition = findPieceByPosition(positionForCurrentMove);
      if (type === undefined) {
        if (pieceForThisPosition !== undefined) {
          if (pieceForThisPosition.color === pieceColor) {
            return {
              canAddThisMove: false,
            };
          } else {
            return {
              canAddThisMove: true,
              moveType: "take",
            };
          }
        } else {
          return {
            canAddThisMove: true,
            moveType: "normall",
          };
        }
      } else {
        const positionForOneColumFurther = {
          row: positionForCurrentMove.row,
          column: positionForCurrentMove.column + 1,
        };
        const positionForOneColumnEarlier = {
          row: positionForCurrentMove.row,
          column: positionForCurrentMove.column - 1,
        };
        const ifIsPieceInOneMoreColumnFurther = findPieceByPosition(positionForOneColumFurther);
        const ifIsPieceInOneMoreColumnEarlier = type === "long-castle" ? findPieceByPosition(positionForOneColumnEarlier) : null;
        const pieceForThisPosition = findPieceByPosition(positionForCurrentMove);
        const ifRookIsMoved = findPieceByPosition({
          row: positionForCurrentMove.row,
          column: type === "short-castle" ? positionForCurrentMove.column - 1 : positionForCurrentMove.column + 2,
        });

        if (ifRookIsMoved !== undefined && ifRookIsMoved.moved === false) {
          if (
            ifIsPieceInOneMoreColumnFurther !== undefined ||
            (ifIsPieceInOneMoreColumnEarlier !== undefined && ifIsPieceInOneMoreColumnEarlier !== null) ||
            pieceForThisPosition !== undefined
          ) {
            return {
              canAddThisMove: false,
            };
          } else if (
            ifIsPieceInOneMoreColumnFurther === undefined &&
            (ifIsPieceInOneMoreColumnEarlier === undefined || ifIsPieceInOneMoreColumnEarlier === null) &&
            pieceForThisPosition === undefined
          ) {
            return {
              canAddThisMove: true,
              moveType: type,
            };
          }
        } else {
          return {
            canAddThisMove: false,
          };
        }
      }
    }
    if (pieceType === "rook") {
      const pieceForThisPosition = findPieceByPosition(positionForCurrentMove);
      if (pieceForThisPosition !== undefined) {
        if (pieceForThisPosition.color === pieceColor) {
          return {
            canAddThisMove: false,
          };
        } else {
          return {
            canAddThisMove: true,
            moveType: "take",
          };
        }
      } else {
        return {
          canAddThisMove: true,
          moveType: "normall",
        };
      }
    }
    if (pieceType === "queen") {
      const pieceForThisPosition = findPieceByPosition(positionForCurrentMove);
      if (pieceForThisPosition !== undefined) {
        if (pieceForThisPosition.color === pieceColor) {
          return {
            canAddThisMove: false,
          };
        } else {
          return {
            canAddThisMove: true,
            moveType: "take",
          };
        }
      } else {
        return {
          canAddThisMove: true,
          moveType: "normall",
        };
      }
    }
    if (pieceType === "bishop") {
      const pieceForThisPosition = findPieceByPosition(positionForCurrentMove);
      if (pieceForThisPosition !== undefined) {
        if (pieceForThisPosition.color === pieceColor) {
          return {
            canAddThisMove: false,
          };
        } else {
          return {
            canAddThisMove: true,
            moveType: "take",
          };
        }
      } else {
        return {
          canAddThisMove: true,
          moveType: "normall",
        };
      }
    }
  };

  const checkIfKingIsInCheckForCurrentMove = (piecesArray) => {
    const kingFieldIndex = findFieldIndexByPosition(pieces.find((piece) => piece.type === "king" && piece.color === currentMove).position);
    let isKingInCheck = false;
    const dangerousFields = [];

    piecesArray.forEach((piece) => {
      const { color, isOnBoard } = piece;

      if (isOnBoard && currentMove !== color) {
        const availableMovesForPiece = findAvailableFieldsForPiece(piece);

        availableMovesForPiece.forEach((move) => {
          const { fieldIndex } = move;

          dangerousFields.push(move);
          if (kingFieldIndex === fieldIndex) {
            isKingInCheck = true;
          }
        });
      }
    });

    return {
      isKingInCheck: isKingInCheck,
      dangerousFields: dangerousFields,
      kingFieldIndex: kingFieldIndex,
    };
  };

  const findAvailableFieldsForPiece = (piece, checkMovesForIsKingInCheck = false) => {
    const { position: piecePosition, type: pieceType, isOnBoard, color: pieceColor, moved: isPieceMoved } = piece;
    const availableMoves = [];
    if (isOnBoard) {
      const { moves: movesForPiece } = piecesMoves.find((move) => move.type === pieceType);

      movesForPiece.forEach((move) => {
        const { columnAdder, rowAdder, infinity } = move;

        if (infinity) {
          for (let i = 1; i < 9; i++) {
            const positionForCurrentMove = {
              row: pieceColor === "white" ? piecePosition.row + rowAdder + (i - 1) * rowAdder : piecePosition.row - rowAdder - (i - 1) * rowAdder,
              column: piecePosition.column + columnAdder + (i - 1) * columnAdder,
            };

            const ifPositionForCurrentMoveIsPossible =
              positionForCurrentMove.row > 0 && positionForCurrentMove.row < 9 && positionForCurrentMove.column > 0 && positionForCurrentMove.column < 9;

            if (ifPositionForCurrentMoveIsPossible) {
              const fieldIndex = findFieldIndexByPosition(positionForCurrentMove);

              const { canAddThisMove, moveType } = validationForPieceType(pieceType, positionForCurrentMove, move, isPieceMoved, pieceColor);

              if (canAddThisMove) {
                availableMoves.push({
                  fieldIndex: fieldIndex,
                  moveType: moveType,
                  movePosition: positionForCurrentMove,
                });

                if (moveType === "take") {
                  break;
                }
              } else {
                break;
              }
            } else {
              break;
            }
          }
        } else {
          const positionForCurrentMove = {
            row: pieceColor === "white" ? piecePosition.row + rowAdder : piecePosition.row - rowAdder,
            column: piecePosition.column + columnAdder,
          };

          const ifPositionForCurrentMoveIsPossible =
            positionForCurrentMove.row > 0 && positionForCurrentMove.row < 9 && positionForCurrentMove.column > 0 && positionForCurrentMove.column < 9;

          if (ifPositionForCurrentMoveIsPossible) {
            const fieldIndex = findFieldIndexByPosition(positionForCurrentMove);

            const { canAddThisMove, moveType } = validationForPieceType(pieceType, positionForCurrentMove, move, isPieceMoved, pieceColor);

            if (canAddThisMove) {
              availableMoves.push({
                fieldIndex: fieldIndex,
                moveType: moveType,
                movePosition: positionForCurrentMove,
              });
            }
          }
        }
      });
    }

    const availableMovesAfterCheckingCheksForKing = [];

    if (checkMovesForIsKingInCheck) {
      let wasKingInCheckInPreviousMove = false;
      availableMoves.forEach((move, index, array) => {
        const { movePosition, moveType } = move;
        const enemyPieceInThisPosition = findPieceByPosition(movePosition);
        const positionBefore = piece.position;

        if (enemyPieceInThisPosition !== undefined) {
          enemyPieceInThisPosition.isOnBoard = false;
        }

        piece.position = movePosition;

        const { isKingInCheck: isMyKingInCheck } = checkIfKingIsInCheckForCurrentMove(pieces);

        if (!isMyKingInCheck) {
          if (!((moveType === "short-castle" || moveType === "long-castle") && wasKingInCheckInPreviousMove)) {
            availableMovesAfterCheckingCheksForKing.push(move);
          }
          wasKingInCheckInPreviousMove = false;
        } else {
          wasKingInCheckInPreviousMove = true;
        }
        piece.position = positionBefore;
        if (enemyPieceInThisPosition !== undefined) {
          enemyPieceInThisPosition.isOnBoard = true;
        }
      });
    }

    if (!checkMovesForIsKingInCheck) {
      return availableMoves;
    } else {
      return availableMovesAfterCheckingCheksForKing;
    }
  };

  const changePiecePosition = (piece, newPosition, moveType, fieldElement) => {
    if (moveType === "take") {
      const enemyTakenPiece = findPieceByPosition(newPosition);
      enemyTakenPiece.isOnBoard = false;
      fieldElement.firstChild.remove();
    }

    if (moveType === "short-castle") {
      const fieldElements = chessBoardRef.current.querySelectorAll(".field");
      const rookPiece = findPieceByPosition(currentMove !== "white" ? { row: 1, column: 1 } : { row: 8, column: 1 });
      const rookPieceElement = fieldElements[findFieldIndexByPosition(rookPiece.position)].firstChild;
      const newPositionForRookPiece = {
        row: newPosition.row,
        column: newPosition.column + 1,
      };
      fieldElements[findFieldIndexByPosition(newPositionForRookPiece)].appendChild(rookPieceElement);

      rookPiece.position = newPositionForRookPiece;
    } else if (moveType === "long-castle") {
      const fieldElements = chessBoardRef.current.querySelectorAll(".field");
      const rookPiece = findPieceByPosition(currentMove !== "white" ? { row: 1, column: 8 } : { row: 8, column: 8 });
      const rookPieceElement = fieldElements[findFieldIndexByPosition(rookPiece.position)].firstChild;
      const newPositionForRookPiece = {
        row: newPosition.row,
        column: newPosition.column - 1,
      };
      fieldElements[findFieldIndexByPosition(newPositionForRookPiece)].appendChild(rookPieceElement);

      rookPiece.position = newPositionForRookPiece;
    }
    piece.position = newPosition;
    piece.moved = true;
  };

  const convertPgnFormatToPgnMovesArray = (pgnString) => {
    const cutString = pgnString
      .replace(/\s\s+/g, " ")
      .split(" ")
      .filter((character, index) => index % 3 !== 0);
    const pgnMoves = [];
    cutString.forEach((move, index) => {
      if (index % 2 === 0) {
        pgnMoves.push([move]);
      } else {
        pgnMoves[pgnMoves.length - 1].push(move);
      }
    });

    setPgnMoves([...pgnMoves]);
    return pgnMoves;
  };

  const findMoveType = (pgnMoveString) => {
    if (pgnMoveString === "O-O-O") {
      return "long-castle";
    } else if (pgnMoveString === "O-O") {
      return "short-castle";
    } else if (pgnMoveString.includes("x")) {
      return "take";
    } else {
      return "normall";
    }
  };

  const makeMoveFromPgn = (pgnMoveString) => {
    currentMove = currentMove === "white" ? "black" : "white";

    const fieldElements = chessBoardRef.current.querySelectorAll(".field");
    const columnSignLetter = ["h", "g", "f", "e", "d", "c", "b", "a"];
    const rowSignNumbers = [1, 2, 3, 4, 5, 6, 7, 8];
    const pgnMoveArrayFromString = pgnMoveString.split("");
    const ifIsCheckMove =
      pgnMoveArrayFromString[pgnMoveArrayFromString.length - 1] === "+" ? pgnMoveArrayFromString.splice(pgnMoveArrayFromString.length - 1, 1)[0] : false;

    const ifIsCheckMateMove =
      pgnMoveArrayFromString[pgnMoveArrayFromString.length - 1] === "#" ? pgnMoveArrayFromString.splice(pgnMoveArrayFromString.length - 1, 1)[0] : false;

    const foundMoveType = findMoveType(pgnMoveString);

    const { foundKing, fieldElementIndex } = findKing(currentMove);

    const { foundKing: enemyKing, fieldElementIndex: fieldElementIndexEnemy } = findKing(currentMove === "white" ? "black" : "white");

    fieldElements[fieldElementIndex].firstChild.classList.remove("check");
    fieldElements[fieldElementIndexEnemy].firstChild.classList.remove("check");

    if (ifIsCheckMove !== false) {
      fieldElements[fieldElementIndex].firstChild.classList.add("check");
    }

    const foundPieceType =
      foundMoveType === "short-castle" || foundMoveType === "long-castle"
        ? "king"
        : pgnMoveArrayFromString[0] === pgnMoveArrayFromString[0].toLowerCase()
        ? "pawn"
        : pgnMarks.find((pgnMark) => pgnMark.mark === pgnMoveArrayFromString[0] && pgnMoveArrayFromString[0]).type;

    const foundMovePosition =
      foundMoveType === "short-castle"
        ? {
            column: 2,
            row: currentMove !== "white" ? 1 : 8,
          }
        : foundMoveType === "long-castle"
        ? {
            column: 6,
            row: currentMove !== "white" ? 1 : 8,
          }
        : {
            column: columnSignLetter.findIndex((letter) => letter === pgnMoveArrayFromString[pgnMoveArrayFromString.length - 2]) + 1,
            row: parseInt(pgnMoveArrayFromString[pgnMoveArrayFromString.length - 1]),
          };

    // This: pgnMoveArrayFromString[pgnMoveArrayFromString.length - 3] because ALWAYES when two pieces can make this same move is asigned to 3rd sign from end (except castles and taking piece)

    const foundRookRowIfCanMakeThisSameMoveRow = foundPieceType === "rook" ? rowSignNumbers.find((number) => number == pgnMoveArrayFromString[1]) : undefined;

    const foundPieceColumnIfTwoPiecesCanMakeThisSameMove =
      foundRookRowIfCanMakeThisSameMoveRow === undefined &&
      pgnMoveArrayFromString[pgnMoveArrayFromString.length - 3] &&
      pgnMoveArrayFromString[pgnMoveArrayFromString.length - 3] === pgnMoveArrayFromString[pgnMoveArrayFromString.length - 3].toLowerCase() &&
      pgnMoveArrayFromString[pgnMoveArrayFromString.length - 3] !== "o" &&
      pgnMoveArrayFromString[pgnMoveArrayFromString.length - 3] !== "x"
        ? columnSignLetter.indexOf(pgnMoveArrayFromString[pgnMoveArrayFromString.length - 3]) + 1
        : pgnMoveArrayFromString[pgnMoveArrayFromString.length - 3] === "x" && foundPieceType === "pawn"
        ? columnSignLetter.indexOf(pgnMoveArrayFromString[0]) + 1
        : pgnMoveArrayFromString[pgnMoveArrayFromString.length - 3] === "x" && foundPieceType !== "pawn" && pgnMoveArrayFromString.length > 4
        ? columnSignLetter.indexOf(pgnMoveArrayFromString[1]) + 1
        : undefined;

    console.log(foundPieceColumnIfTwoPiecesCanMakeThisSameMove);

    const foundPiece = pieces.find((piece) => {
      const { type, color, position: piecePosition } = piece;

      if (type === foundPieceType && currentMove !== color) {
        const foundAvailableMovesForPiece = findAvailableFieldsForPiece(piece);

        const foundAvailableMoveForPiece = foundAvailableMovesForPiece.find((move) => {
          const { movePosition } = move;

          if (foundPieceColumnIfTwoPiecesCanMakeThisSameMove !== undefined) {
            if (
              movePosition.row === foundMovePosition.row &&
              movePosition.column === foundMovePosition.column &&
              piecePosition.column === foundPieceColumnIfTwoPiecesCanMakeThisSameMove
            ) {
              return move;
            }
          } else if (foundRookRowIfCanMakeThisSameMoveRow !== undefined) {
            if (
              movePosition.row === foundMovePosition.row &&
              movePosition.column === foundMovePosition.column &&
              piecePosition.row === foundRookRowIfCanMakeThisSameMoveRow
            ) {
              return move;
            }
          } else {
            if (movePosition.row === foundMovePosition.row && movePosition.column === foundMovePosition.column) {
              return move;
            }
          }
        });

        if (foundAvailableMoveForPiece !== undefined) {
          return piece;
        }
      }
    });

    const foundFieldElement = fieldElements[findFieldIndexByPosition(foundMovePosition)];

    const foundPieceElement = fieldElements[findFieldIndexByPosition(foundPiece.position)].firstChild;

    changePiecePosition(foundPiece, foundMovePosition, foundMoveType, foundFieldElement);

    foundFieldElement.appendChild(foundPieceElement);
  };

  const checkIfSecondThisSamePieceCanMakeThisSameMove = (madeMove, moveBefore) => {
    const foundFirstPiece = findPieceByPosition(madeMove);
    foundFirstPiece.position = moveBefore;

    const availableMovesForFirstPiece = findAvailableFieldsForPiece(foundFirstPiece, true);

    const foundSecondPiece = pieces.find((piece) => {
      const { position, type, color } = piece;
      if (foundFirstPiece.type === type && color === foundFirstPiece.color) {
        if (position.row !== foundFirstPiece.position.row || position.column !== foundFirstPiece.position.column) {
          return piece;
        }
      }
    });

    const availableMovesForSecondPiece = findAvailableFieldsForPiece(foundSecondPiece, true);

    const foundThisSameMovesForBothPieces = availableMovesForFirstPiece.filter((moveForFirst) => {
      return availableMovesForSecondPiece.find((moveForSecond) => moveForFirst.fieldIndex === moveForSecond.fieldIndex);
    });

    foundFirstPiece.position = madeMove;

    const fieldIndexOfCurrentMadeMove = findFieldIndexByPosition(madeMove);

    return foundThisSameMovesForBothPieces !== undefined
      ? foundThisSameMovesForBothPieces.find((move) => move.fieldIndex === fieldIndexOfCurrentMadeMove)
      : false;
  };

  const convertPgnMovesToPgnFormat = (pgnMoves) => {
    let PGNString = "";
    pgnMoves.forEach((moves, index) => {
      PGNString = `${PGNString} ${index + 1}. ${moves[0]} ${moves[1] !== undefined ? moves[1] : ""}`;
    });
    return PGNString;
  };

  const updatePgnMoves = (madeMove, moveBefore, pieceType, moveType, isCheckMate, isMyKingInCheck) => {
    const columnSignLetter = ["h", "g", "f", "e", "d", "c", "b", "a"];
    const pgnMarkPiece = pgnMarks.find((pgnMark) => pgnMark.type === pieceType).mark;
    const pgnPosition = `${columnSignLetter[madeMove.column - 1]}${madeMove.row}`;

    const ifSecondThisSamePieceCanMakeThisSameMove =
      pieceType === "knight" || pieceType === "rook" ? checkIfSecondThisSamePieceCanMakeThisSameMove(madeMove, moveBefore) : null;

    const pgnString = `${
      moveType === "short-castle"
        ? "O-O"
        : moveType === "long-castle"
        ? "O-O-O"
        : `${
            moveType === "take" && pieceType === "pawn"
              ? columnSignLetter[moveBefore.column - 1]
              : ifSecondThisSamePieceCanMakeThisSameMove
              ? `${pgnMarkPiece}${columnSignLetter[moveBefore.column - 1]}`
              : pgnMarkPiece
          }${moveType === "take" ? "x" : moveType === "normall" ? "" : ""}${pgnPosition}${isCheckMate ? "#" : isMyKingInCheck ? "+" : ""}`
    }`;

    if (currentMove !== "white") {
      pgnMoves.push([pgnString]);
    } else {
      pgnMoves[pgnMoves.length - 1].push(pgnString);
    }
    setPgnMoves([...pgnMoves]);
    console.log(convertPgnMovesToPgnFormat(pgnMoves));
  };

  const setTimerForPlayers = () => {
    const myinterval = setInterval(() => {
      if (currentMove === "white") {
        setWhiteTime((currentValue) => {
          if (currentValue > 0) {
            return currentValue - 100;
          } else {
            clearInterval(myinterval);
            setGameOver({
              status: true,
              description: `${myColorPieces === "white" ? "Black" : "White"} wins by timeout`,
            });
            return 0;
          }
        });
      } else {
        setBlackTime((currentValue) => {
          if (currentValue > 0) {
            return currentValue - 100;
          } else {
            clearInterval(myinterval);
            setGameOver({
              status: true,
              description: `${myColorPieces.charAt(0).toUpperCase() + myColorPieces.slice(1)} wins by timeout`,
            });
            return 0;
          }
        });
      }
    }, 100);
  };

  const checkIfIsEnemyKingInCheckMate = () => {
    const allAvailableMoves = [];

    pieces.forEach((piece) => {
      const { color, isOnBoard } = piece;

      if (isOnBoard && color === currentMove) {
        const availableMoves = findAvailableFieldsForPiece(piece, true);
        availableMoves.forEach((move) => {
          allAvailableMoves.push(move);
        });
      }
    });

    return allAvailableMoves.length === 0 ? true : false;
  };

  const addDragAndDropToPieces = () => {
    const pieceElements = chessBoardRef.current.querySelectorAll(".piece");
    const fieldElements = chessBoardRef.current.querySelectorAll(".field");

    const whiteTimeParagraphElement = chessBoardRef.current.parentElement.querySelector(".down-side .white-time p");
    const blackTimeParagraphElement = chessBoardRef.current.parentElement.querySelector(".upper-side .black-time p");
    let isGrabbingPiece = false;
    // ?
    let currentGrabbingPiecePiece = null;
    let currentGrabbingPieceElement = null;
    let currentGrabbingPieceBoundingClientRect = null;
    let currentGrabbingPieceFieldElement = null;
    let availableMovesForPiece = null;
    let isMouseUpDone = false;

    fieldElements.forEach((fieldElement, fieldIndex) => {
      fieldElement.addEventListener("mouseover", (event) => {
        // If cursor is over board on mouseup
        if (isGrabbingPiece && isMouseUpDone) {
          isGrabbingPiece = false;
          isMouseUpDone = false;
          currentGrabbingPieceElement.style.zIndex = "unset";

          const isThisMovePossible = availableMovesForPiece.find((move) => {
            const { fieldIndex: fieldIndexLocal } = move;
            return fieldIndexLocal === fieldIndex;
          });

          if (isThisMovePossible !== undefined) {
            const { movePosition, moveType } = isThisMovePossible;
            const moveBefore = currentGrabbingPiecePiece.position;

            // Very important when currentMove change ! ! !

            const { foundKing, fieldElementIndex } = findKing(currentMove);

            fieldElements[fieldElementIndex].firstChild.classList.remove("check");

            currentMove = currentMove === "white" ? "black" : "white";

            changePiecePosition(currentGrabbingPiecePiece, movePosition, moveType, fieldElement);

            const isCheckMate = checkIfIsEnemyKingInCheckMate();

            if (isCheckMate) {
              setGameOver({
                status: true,
                description: `${currentMove} wins by checkmate`,
              });
            }

            // It is after done move so it check enemy king

            const { isKingInCheck: isEnemyKingChecked, kingFieldIndex: enemyKingFieldIndex } = checkIfKingIsInCheckForCurrentMove(pieces);

            updatePgnMoves(movePosition, moveBefore, currentGrabbingPiecePiece.type, moveType, isCheckMate, isEnemyKingChecked);

            fieldElement.appendChild(currentGrabbingPieceElement);

            if (isEnemyKingChecked) {
              fieldElements[enemyKingFieldIndex].firstChild.classList.add("check");
            }

            // CurentMove is not equal to myColorPieces because we change currentMove before setting time

            if (currentMove !== "white") {
              setWhiteTime((currentValue) => currentValue + gameTimeType.additionalMilisecondsPerMove);
              setTimeout(() => {
                whiteTimeParagraphElement.classList.add("stopped");
                blackTimeParagraphElement.classList.remove("stopped");
              }, 10);
            } else {
              setBlackTime((currentValue) => currentValue + gameTimeType.additionalMilisecondsPerMove);
              setTimeout(() => {
                blackTimeParagraphElement.classList.add("stopped");
                whiteTimeParagraphElement.classList.remove("stopped");
              }, 10);
            }

            const pieceDefauldAudio = new Audio(pieceDefauldSong);
            pieceDefauldAudio.play();
          }

          currentGrabbingPiecePiece = null;
          currentGrabbingPieceElement = null;
          currentGrabbingPieceBoundingClientRect = null;
          currentGrabbingPieceFieldElement = null;
          availableMovesForPiece = null;

          if (!isGameStarted) {
            setTimerForPlayers();
            blackTimeParagraphElement.classList.add("stopped");
            whiteTimeParagraphElement.classList.remove("stopped");
            isGameStarted = true;
          }
          setPiecesForJSX(pieces);
        }
      });
    });

    pieceElements.forEach((pieceElement, index) => {
      pieceElement.addEventListener("mousedown", (event) => {
        event.preventDefault();

        // It is a tricky part becase React dosnt rerender component if the state has this same value after setting new one
        // But adding event listener to elements made them independent and dont folow with lifecycle
        // BUT variables created with first render are MUTABLE and DOESNT CHANGE STATE after rerender of component to a given scope by addEventListener
        // (That's why currentMove can change value and save them although rerender component (currentMove remember when is white or black although rerender))
        // And I'm not able to useState because addEventListener scope remember only values from first render
        // But actually they have acces to the method of useState and GET the current value from them

        // If the game is not over, able to drag pieces

        setGameOver((currentValue) => {
          if (currentValue === false) {
            if (currentMove === pieces[index].color) {
              currentGrabbingPieceFieldElement = pieceElement.parentElement;
              currentGrabbingPieceElement = pieceElement;
              currentGrabbingPiecePiece = pieces[index];
              currentGrabbingPieceBoundingClientRect = currentGrabbingPieceElement.getBoundingClientRect();
              const { width, left, top } = currentGrabbingPieceBoundingClientRect;

              isGrabbingPiece = true;

              availableMovesForPiece = findAvailableFieldsForPiece(pieces[index], true);

              availableMovesForPiece.forEach((move) => {
                const { fieldIndex, moveType } = move;
                if (moveType === "take") {
                  fieldElements[fieldIndex].classList.add("take");
                } else {
                  fieldElements[fieldIndex].classList.add("available");
                }
              });

              currentGrabbingPieceFieldElement.style.zIndex = "1000000";
              if (areWhitePiecesDownSide) {
                currentGrabbingPieceElement.style.transform = `translate(${(event.clientX - left - width / 2) * -1}px, ${
                  (event.clientY - top - width / 2) * -1
                }px) rotate(180deg)`;
              } else {
                currentGrabbingPieceElement.style.transform = `translate(${event.clientX - left - width / 2}px, ${event.clientY - top - width / 2}px)`;
              }
              currentGrabbingPieceElement.style.cursor = "grabbing";
            }
          }
          return currentValue;
        });
      });
    });

    window.addEventListener("mousemove", (event) => {
      event.preventDefault();
      if (isGrabbingPiece) {
        const { width, left, top } = currentGrabbingPieceBoundingClientRect;
        if (areWhitePiecesDownSide) {
          currentGrabbingPieceElement.style.transform = `translate(${(event.clientX - left - width / 2) * -1}px, ${
            (event.clientY - top - width / 2) * -1
          }px) rotate(180deg)`;
        } else {
          currentGrabbingPieceElement.style.transform = `translate(${event.clientX - left - width / 2}px, ${event.clientY - top - width / 2}px)`;
        }
        currentGrabbingPieceElement.style.cursor = "grabbing";
      }
    });

    window.addEventListener("mouseup", (event) => {
      if (isGrabbingPiece) {
        const boardElementBoundingRect = chessBoardRef.current.getBoundingClientRect();
        const ifMouseIsOverTheBoard =
          event.clientX <= boardElementBoundingRect.width + boardElementBoundingRect.left &&
          event.clientX >= boardElementBoundingRect.left &&
          event.clientY <= boardElementBoundingRect.height + boardElementBoundingRect.top &&
          event.clientY >= boardElementBoundingRect.top;

        currentGrabbingPieceElement.style.cursor = "grab";

        if (areWhitePiecesDownSide) {
          currentGrabbingPieceElement.style.transform = "rotate(180deg)";
        } else {
          currentGrabbingPieceElement.style.transform = "unset";
        }

        currentGrabbingPieceFieldElement.style.zIndex = "unset";
        currentGrabbingPieceElement.style.zIndex = "-1";

        availableMovesForPiece.forEach((move) => {
          const { fieldIndex } = move;
          fieldElements[fieldIndex].classList.remove("available");
          fieldElements[fieldIndex].classList.remove("take");
        });

        if (!ifMouseIsOverTheBoard) {
          isGrabbingPiece = false;
          currentGrabbingPieceElement.style.zIndex = "unset";
          currentGrabbingPiecePiece = null;
        }
        isMouseUpDone = true;
      }
    });
  };

  const rotateBoard = () => {
    const pieceElements = chessBoardRef.current.querySelectorAll(".piece");
    const upperSideElement = chessBoardRef.current.parentElement.querySelector(".down-side");
    const downSideElement = chessBoardRef.current.parentElement.querySelector(".upper-side");
    const whiteTakenPiecesElement = chessBoardRef.current.parentElement.parentElement.querySelector(".right-side .white-taken-pieces");
    const blackTakenPiecesElement = chessBoardRef.current.parentElement.parentElement.querySelector(".right-side .black-taken-pieces");
    if (!areWhitePiecesDownSide) {
      chessBoardRef.current.style.transform = "rotate(180deg)";

      downSideElement.style.order = "1";
      upperSideElement.style.order = "3";
      whiteTakenPiecesElement.style.order = "3";
      blackTakenPiecesElement.style.order = "1";

      pieceElements.forEach((piece) => (piece.style.transform = "rotate(180deg)"));

      areWhitePiecesDownSide = true;
    } else {
      chessBoardRef.current.style.transform = "unset";

      downSideElement.style.order = "3";
      upperSideElement.style.order = "1";

      whiteTakenPiecesElement.style.order = "1";
      blackTakenPiecesElement.style.order = "3";

      pieceElements.forEach((piece) => (piece.style.transform = "unset"));

      areWhitePiecesDownSide = false;
    }
  };

  useEffect(() => {
    // const rotateBoardButton = document.querySelector(".rotate-board-button");
    // rotateBoardButton.addEventListener("click", () => rotateBoard());
    rotateBoard();
  }, []);

  const convertSecndsToTimeFormat = (miliSeconds) => {
    const minutes = Math.floor(miliSeconds / 1000 / 60);
    const secondsDivided = Math.floor((miliSeconds / 1000) % 60);
    const miliSecondsDividedBy10 = Math.round(((miliSeconds / 1000) % 1) * 1000) / 100;

    return `${minutes.toString().length === 1 ? `0${minutes}` : minutes}:${secondsDivided.toString().length === 1 ? `0${secondsDivided}` : secondsDivided}${
      secondsDivided < 10 && minutes < 1 ? `:${miliSecondsDividedBy10}` : ""
    }`;
  };

  useEffect(() => {
    addDragAndDropToPieces();
  }, []);

  useEffect(() => {}, []);

  return (
    <>
      <div className="chess-board-wrapper">
        <div className="left-side">
          <div className="chat">
            <div className="chat-content">
              <p className="from">
                <span className="nickname">okingik123:</span> Hello there qwq wq wq wq wq wq wqwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww!
              </p>
              <p className="to">
                <span className="nickname">koksikSKKJ:</span> Hello there too!
              </p>
            </div>
            <div className="input-wrapper">
              <input spellCheck="false" placeholder="Be nice to others!"></input>
            </div>
          </div>
        </div>
        <div className="middle-side">
          <div className="upper-side">
            <p className="username">koksikSKKJ</p>
            <div className="black-time">
              <p className={blackTime < 10 * 1000 ? "lower-then-10-seconds" : ""}>{convertSecndsToTimeFormat(blackTime)}</p>
            </div>
          </div>
          <div ref={chessBoardRef} className={`chess-board ${gameOver !== false ? "check-mate" : ""}`}>
            {generatedFields === null ? generateBoard() : generatedFields}
            {gameOver !== false ? (
              <div className="check-mate-content-wrapper">
                <div className="content">
                  <p>{gameOver.description}</p>
                </div>
                <div className="buttons">
                  <button className="main-button-dark">Play again</button>
                  <button className="main-button-dark">Copy PGN</button>
                </div>
              </div>
            ) : null}
          </div>
          <div className="down-side">
            <p className="username">koksikSKKJ</p>
            <div className="white-time">
              <p className={whiteTime < 10 * 1000 ? "lower-then-10-seconds" : ""}>{convertSecndsToTimeFormat(whiteTime)}</p>
            </div>
          </div>
        </div>
        <div className="right-side">
          <div className="black-taken-pieces">
            {piecesForJSX.map((piece) => {
              const { color, isOnBoard, src } = piece;

              if (!isOnBoard && myColorPieces === color) {
                return (
                  <div className="taken-piece">
                    <img src={src}></img>
                  </div>
                );
              }
            })}
          </div>
          <div className="done-moves">
            {pgnMoves.map((move, index) => {
              return (
                <div className="moves-row">
                  <p className="move-index">{index + 1}.</p>
                  <div className="move">
                    <p>{move[0]}</p>
                  </div>
                  {move[1] !== undefined ? (
                    <div className="move">
                      <p>{move[1]}</p>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
          <div className="white-taken-pieces">
            {piecesForJSX.map((piece) => {
              const { color, isOnBoard, src } = piece;

              if (!isOnBoard && myColorPieces !== color) {
                return (
                  <div className="taken-piece">
                    <img src={src}></img>
                  </div>
                );
              }
            })}
          </div>
        </div>
      </div>
      {/* <button className="rotate-board-button">ROTATE</button> */}
    </>
  );
};

export default ChessBoard;
