declare const __APP_VERSION__: string;
declare const __GIT_SHA__: string;

interface Window {
  __APP_VERSION__: string;
  __WORKFLOW_MARKER__: string;
  __TETRIS__: {
    game: unknown;
    draw: () => void;
    action: (name: string) => boolean;
    getBoard: () => (string | null)[][];
    getState: () => { score: number; lines: number; level: number; status: string };
    reset: () => void;
  };
}
