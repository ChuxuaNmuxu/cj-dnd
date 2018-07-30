import {createSourceConnector} from '../createSourceConnector';

const options = {
    resizeNorth: {direction: 'n'},
    resizeSouth: {direction: 's'},
    resizeEast: {direction: 'e'},
    resizeWest: {direction: 'w'},
    resizeNW: {direction: 'nw'},
    resizeNE: {direction: 'ne'},
    resizeSW: {direction: 'sw'},
    resizeSE: {direction: 'se'}
}

export default createSourceConnector(options);
