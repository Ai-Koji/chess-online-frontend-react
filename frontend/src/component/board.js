import React from 'react';
import '../styles/chessboard.css';
import '../styles/board.css';
import add from '../media/add.svg';
import { Chessboard } from 'react-chessboard';

class Board extends React.Component {
    constructor(props) {
        super(props);
		const parts = window.location.href.split('/');
        this.state = {
            history: [],
            isNotGetted: true,
            prevFen: null,
            boardId: () => {
                if (parts[parts.length - 1] != "board")
                    return parseInt(parts[parts.length - 1]);
                else return 0;
            },
            trIndex: 1,
            isPreviewMode: true,
            header: "",
            fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
            isOpen: false,
            // JSON-описание партии
            JsonDescription: [],
            savedGames: []
        };
    }

    closeOpen = () => {
        this.state.isOpen = !this.state.isOpen;
    }

    saveGame = () => {
        let formData = {
            id: this.state.boardId,
            header: this.state.header,
            mainFen: this.state.fen,
            game: JSON.stringify(this.state.JsonDescription),
            isOpen: this.state.isOpen
        };

		fetch(`/api/board/update-add/${this.state.boardId()}`, {
			method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
		})
        .then((response) => {
            console.log(response);
        })
        .catch((error) => {
            console.log(error);
        });
    }

    getInfo = () => {
		fetch(`/api/board/${this.state.boardId()}`, {
			method: 'GET'
		})
        .then((response) => response.json())
        .then ((response) => {
            this.setState({
                id: response.game.id,
                header: response.game.header,
                fen: response.game.mainFen,
                JsonDescription: JSON.parse(response.game.game),
                isOpen: response.game.is_open,    
                savedGames: response.savedGames,
                isNotGetted: false
            });
        })
        .catch((error) => {
            console.log(error);
        });
    }

    // Метод для очистки доски
    clearBoard = () => {
        this.setState({
            prevFen: null,
            fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
        });
    };

    deleteGame = () => {
		fetch(`/api/board/${this.state.boardId()}`, {
			method: 'DELETE'
		})
        .then((response) => {
            if (response.status == 200)
                document.location.href = "/board/"; // перевод на другую страницу
            else 
                console.log(response.status)
        })
        .catch ((error) => {
            console.log(error)
        })
    }

    // Метод для загрузки новой позиции на доску
    loadPoss = (fen) => {
        this.setState({ fen: fen });
    };

    // Метод для преобразования JSON в JSX
    fromJsonToJSX = (JSon, indexOfBlocks, indexOfMainMoves) => {
        let body = [];
        for (let index = 0; index < JSon.length; index++) {
            switch (JSon[index].type) {
                case 'index':
                    this.state.JsonDescription[indexOfBlocks].content[indexOfMainMoves].content[0].content = indexOfMainMoves;
                    body.push(<index key={index} onContextMenu={(event) => this.handleContextMenu(event, index, true, false, [indexOfBlocks, indexOfMainMoves])}>{indexOfMainMoves + 1}</index>);
                    break;
                case 'move':
                    if (JSon[index].content === '' && JSon[index].fen === '' && this.state.isPreviewMode)
                        body.push(
                            <move key={index} onClick={() => this.addMoveCell(indexOfBlocks, indexOfMainMoves, index)}>
                                <img src={add}/>
                            </move>
                        );
                    else 
                        body.push(
                            <move key={index} onClick={() => this.loadPoss(JSon[index].fen)} onContextMenu={(event) => this.handleContextMenu(event, index, false, true, [indexOfBlocks, indexOfMainMoves, index])}>
                                <input value={JSon[index].content} className="move-input" onChange={(event) => this.handleMoveChange(indexOfBlocks, indexOfMainMoves, index, event)}/>
                            </move>
                        );
                    break;
                case 'tr':
                    body.push(<tr key={index}>{this.fromJsonToJSX(JSon[index].content, indexOfBlocks, index)}</tr>);
                    this.state.trIndex++;
                    break;
                case 'description':
                    body.push(
                        <div key={index} className="description" >
                            <textarea rows="6" value={JSon[index].content} onContextMenu={(event) => this.handleContextMenu(event, index)} onChange={(event) => this.handleTextChange(index, event)} />
                        </div>
                    );
                    break;
                case 'main-moves':
                    let tbody = this.fromJsonToJSX(JSon[index].content, index);
                    let moveIndex = this.state.trIndex;
                    
                    if (this.state.isPreviewMode)
                        body.push(
                            <table key={index} className="main-moves">
                                <tbody>{tbody}</tbody>
                                <tfoot>
                                    <button className='add-move' onClick={() => this.addMove(index, moveIndex)} onContextMenu={(event) => this.handleContextMenu(event, index)}>
                                        <img src={add} />
                                    </button>
                                </tfoot>
                            </table>
                        );
                    else
                        body.push(
                            <table key={index} className="main-moves">
                                <tbody>{tbody}</tbody>
                            </table>
                        );
                        
                    this.state.trIndex = 1;
                    break;
                default:
                    break;
            }
        }

        return body;
    };

    // Метод для отображения описания партии
    Description = () => {
        return this.fromJsonToJSX(this.state.JsonDescription);
    };

    // Метод для изменения текста описания партии
    handleTextChange = (blockIndex, event) => {
        const updatedJsonDescription = [...this.state.JsonDescription];
        updatedJsonDescription[blockIndex].content = event.target.value;
        this.setState({ JsonDescription: updatedJsonDescription });
    };

    // Метод для изменения текста описания партии
    handleHeaderChange = (event) => {
        this.setState({ header: event.target.value})

    };

    // Метод для обработки изменений в полях ходов
    handleMoveChange = (blockIndex, trIndex, moveIndex, event) => {
        const updatedJsonDescription = this.state.JsonDescription;
        updatedJsonDescription[blockIndex].content[trIndex].content[moveIndex].content = event.target.value;
        this.setState({ JsonDescription: updatedJsonDescription });
    };

    // Метод для добавления блока с текстом описания
    addDescriptionBlock = () => {
        const newBlock = { type: 'description', content: '' };
        const updatedJsonDescription = [...this.state.JsonDescription, newBlock];
        this.setState({ JsonDescription: updatedJsonDescription });
    };

    // Метод для добавления блока с основными ходами
    addMainMovesBlock = () => {
        const newBlock = { type: 'main-moves', content: [] };
        const updatedJsonDescription = [...this.state.JsonDescription, newBlock];
        this.setState({ JsonDescription: updatedJsonDescription });
    };

    // Метод для добавления нового хода в основные ходы
    addMove = (blockIndex, moveIndex) => {
        const newMoveSet = {
            type: 'tr',
            content: [
                { type: 'index', content: `${moveIndex}.` },
                { type: 'move', fen: '', content: '' },
                { type: 'move', fen: '', content: '' }
            ]
        };
        const updatedJsonDescription = [...this.state.JsonDescription];
        updatedJsonDescription[blockIndex].content.push(newMoveSet);
        this.setState({ JsonDescription: updatedJsonDescription });
    };

    // Метод для добавления фен в ход
    addMoveCell = (blockIndex, trIndex, moveIndex) => {
        const updatedJsonDescription = this.state.JsonDescription;
        updatedJsonDescription[blockIndex].content[trIndex].content[moveIndex].fen = this.state.fen;
        this.setState({ JsonDescription: updatedJsonDescription });
    };

    // Метод для преобразования позиции на доске в ФЕН
    positionsToFen = (positions) => {
        // Получаем ФЕН на основе позиции
        const pieceMap = {
            'wP': 'P', 'wN': 'N', 'wB': 'B', 'wR': 'R', 'wQ': 'Q', 'wK': 'K',
            'bP': 'p', 'bN': 'n', 'bB': 'b', 'bR': 'r', 'bQ': 'q', 'bK': 'k',
        };

        let fen = '';
        let emptySquares = 0;

        for (let rank = 8; rank >= 1; rank--) {
            for (let file = 1; file <= 8; file++) {
                const square = String.fromCharCode(96 + file) + rank;
                const piece = positions[square];

                if (piece) {
                    if (emptySquares > 0) {
                        fen += emptySquares;
                        emptySquares = 0;
                    }
                    fen += pieceMap[piece];
                } else {
                    emptySquares++;
                }
            }

            if (emptySquares > 0) {
                fen += emptySquares;
                emptySquares = 0;
            }

            if (rank > 1) {
                fen += '/';
            }
        }

        this.setState({ prevFen: this.state.fen, fen: fen });
    }

    handleContextMenu = (event, index, isTr, isMove, position) => {
        event.preventDefault(); 
        if (isTr){
            let updatedJson = this.state.JsonDescription; 
            updatedJson[position[0]].content.splice([position[1]], 1)
            
            this.setState({JsonDescription: updatedJson})
        } else if (isMove) {
            let updatedJson = this.state.JsonDescription; 

            updatedJson[position[0]].content[position[1]].content[position[2]].content = '';
            updatedJson[position[0]].content[position[1]].content[position[2]].fen = '';
            
            this.setState({JsonDescription: updatedJson})
            
        } else{
            const updatedJsonDescription = this.state.JsonDescription;
            updatedJsonDescription.splice(index, 1);
            this.setState({ JsonDescription: updatedJsonDescription });
        }
    };

    GamesList() {
        let savedGames = this.state.savedGames;
        let elements = [];

        for (let index = 0; index < savedGames.length - 2; index++) {
            elements.push(
                <li className="save-item" key={index}>
                    <a href={savedGames[index].id}>
                        <h2>{savedGames[index].header}</h2>
                        <div className="save-board">
                            <Chessboard position={savedGames[index].mainFen ? savedGames[index].mainFen : "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"} />
                        </div>
                    </a>
                </li>
            );
        }

        return elements;
    }

    componentDidMount = () => {
        if (this.state.isNotGetted) this.getInfo();
    }


    render() {
        document.title = "Доска";
        
        return (
            <div className="container" style={{ display: 'block' }}>
                <section className="board-name">
                    <b>
                        <input value={this.state.header} placeholder="Название партии" type="text" id="board-name" onChange={(event) => this.handleHeaderChange(event)} />
                    </b>
                </section>
                <div className="grid-container">
                    <div className="board chessboard">
                        <Chessboard position={this.state.fen} getPositionObject={this.positionsToFen}/>
                    </div>
                    <div className="about-game">
                        <div className="game">
                            <this.Description />
                        </div>
                        <div className="game-buttons">
                            <button onClick={this.addDescriptionBlock}>TXT</button>
                            <button onClick={this.addMainMovesBlock}>Moves</button>
                            <button onClick={() => {this.setState({isPreviewMode: !this.state.isPreviewMode})}}>Preview</button>
                        </div>
                    </div>
                </div>
                <section className="options">
                    <button id="delete-game" onClick={this.deleteGame}>Удалить</button>
                    <button id="save-game" onClick={this.saveGame}>Сохранить</button>
                    <button id="clear-board" onClick={this.clearBoard}>
                        Очистить доску
                    </button>
                    <button id="open-close-for-share" onClick={this.closeOpen}>
                        Скрыть от всех/Открыть для всех
                    </button>
                </section>
                <section className="save">
                    <h1>Сохраненные партии</h1>
                    <ul className="save-grid">{this.GamesList()}</ul>
                </section>
            </div>
        );
    }
}

export default Board;
