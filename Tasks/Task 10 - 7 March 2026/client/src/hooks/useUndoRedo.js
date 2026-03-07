import { useReducer, useCallback } from "react";

// This hook manages a history of "commands" rather than raw state snapshots.
// Each command knows how to "do" and "undo" itself against the backend and the UI state.

const initialStore = {
  undoStack: [], // array of { undo, redo, description } objects
  redoStack: [],
};

function reducer(store, action) {
  switch (action.type) {
    case "PUSH": {
      return {
        undoStack: [...store.undoStack, action.command],
        redoStack: [], // any new action clears redo history
      };
    }
    case "UNDO": {
      if (store.undoStack.length === 0) return store;
      const last = store.undoStack[store.undoStack.length - 1];
      return {
        undoStack: store.undoStack.slice(0, -1),
        redoStack: [last, ...store.redoStack],
      };
    }
    case "REDO": {
      if (store.redoStack.length === 0) return store;
      const next = store.redoStack[0];
      return {
        undoStack: [...store.undoStack, next],
        redoStack: store.redoStack.slice(1),
      };
    }
    default:
      return store;
  }
}

export const useCommandHistory = () => {
  const [store, dispatch] = useReducer(reducer, initialStore);

  // Register a new command (after it has already been executed)
  const push = useCallback((command) => {
    dispatch({ type: "PUSH", command });
  }, []);

  // Execute the undo of the last command
  const undo = useCallback(async () => {
    if (store.undoStack.length === 0) return;
    const last = store.undoStack[store.undoStack.length - 1];
    await last.undo();
    dispatch({ type: "UNDO" });
  }, [store.undoStack]);

  // Execute the redo of the next command
  const redo = useCallback(async () => {
    if (store.redoStack.length === 0) return;
    const next = store.redoStack[0];
    await next.redo();
    dispatch({ type: "REDO" });
  }, [store.redoStack]);

  const canUndo = store.undoStack.length > 0;
  const canRedo = store.redoStack.length > 0;

  return { push, undo, redo, canUndo, canRedo };
};
