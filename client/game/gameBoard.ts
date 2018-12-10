import SVG from 'svg.js';
import http from 'http';

import { BoardCoord, GameTileData } from '../../shared/types';
import GameTile from './gameTile';
import { BoardSize } from '../../shared/consts';

export default class GameBoard {
    socket: SocketIOClient.Socket

    private gameId: ID;
    private draw: SVG.Container;
    private tileMap: Map<BoardCoord, GameTile>;
    private size: BoardSize;
    private tileLoaded: boolean;

    constructor(gameId: ID, socket: SocketIOClient.Socket, draw: SVG.Container,
                width: number, height: number, size: BoardSize) {
        this.socket = socket;
        this.draw = draw;
        this.gameId = gameId;
        this.size = size;
        this.tileMap = new Map<BoardCoord, GameTile>();

        this.tileLoaded = false;

        this.socket.on('initBoard', (data: Array<GameTileData>) => {
            if (this.tileLoaded) {
                return;
            }
            this.tileLoaded = true;
            
            const tileWidth = Math.max(width, height) /
            (size === BoardSize.SMALL ? 10 : 12);
            
            data.forEach((gtd: GameTileData) => {
                this.tileMap.set(gtd.coord, new GameTile(draw, gtd, tileWidth));
            });
        });
        

        this.socket.emit('getTileData', gameId, size);
    }
}
