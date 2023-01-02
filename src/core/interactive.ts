import { ELEMENTS } from '../constants';
import { setBGM } from '../utils';
import { app, setMatchTime } from './main';

export const activateInteractives = () => {
  ELEMENTS.startBtn.onclick = () => {
    ELEMENTS.startBtn?.parentElement && (ELEMENTS.startBtn.parentElement.style.display = 'none');

    app.isStart = true;
    setBGM('bgm', 'Funkytown-Cut');

    setMatchTime(30);
  };
};
