// Tests for historyReducer.js
import historyReducer from '../historyReducer';
import { ACTION_TYPES } from '../../../constants';

describe('historyReducer', () => {
  const initialState = {
    past: [],
    future: []
  };

  // Mock editor state for testing
  const mockEditorState = { components: [{ id: 'component1', type: 'button' }] };
  const mockUpdatedState = { components: [{ id: 'component1', type: 'button', updated: true }] };

  it('should return the initial state when no action is provided', () => {
    const state = historyReducer(undefined, {}, {});
    expect(state).toEqual(initialState);
  });

  describe('UNDO action', () => {
    it('should not change state when past is empty', () => {
      const state = historyReducer(initialState, { type: ACTION_TYPES.UNDO }, mockEditorState);
      expect(state).toEqual(initialState);
    });

    it('should handle UNDO action correctly with past states', () => {
      const state = {
        past: [{ state: 1 }, { state: 2 }],
        future: []
      };

      const newState = historyReducer(state, { type: ACTION_TYPES.UNDO }, mockEditorState);
      
      expect(newState).toEqual({
        past: [{ state: 1 }],
        future: [mockEditorState]
      });
    });
  });

  describe('REDO action', () => {
    it('should not change state when future is empty', () => {
      const state = historyReducer(initialState, { type: ACTION_TYPES.REDO }, mockEditorState);
      expect(state).toEqual(initialState);
    });

    it('should handle REDO action correctly with future states', () => {
      const state = {
        past: [],
        future: [{ state: 1 }, { state: 2 }]
      };

      const newState = historyReducer(state, { type: ACTION_TYPES.REDO }, mockEditorState);
      
      expect(newState).toEqual({
        past: [mockEditorState],
        future: [{ state: 2 }]
      });
    });
  });

  describe('Trackable actions', () => {
    it('should track ADD_COMPONENT action', () => {
      const action = { type: ACTION_TYPES.ADD_COMPONENT, payload: { component: { id: 'new' } } };
      
      const newState = historyReducer(initialState, action, mockEditorState);
      
      expect(newState.past).toContainEqual(mockEditorState);
      expect(newState.future).toEqual([]);
    });

    it('should track UPDATE_COMPONENT action', () => {
      const action = { 
        type: ACTION_TYPES.UPDATE_COMPONENT, 
        payload: { id: 'component1', updates: { updated: true } } 
      };
      
      const newState = historyReducer(initialState, action, mockEditorState);
      
      expect(newState.past).toContainEqual(mockEditorState);
      expect(newState.future).toEqual([]);
    });

    it('should track DELETE_COMPONENT action', () => {
      const action = { type: ACTION_TYPES.DELETE_COMPONENT, payload: { id: 'component1' } };
      
      const newState = historyReducer(initialState, action, mockEditorState);
      
      expect(newState.past).toContainEqual(mockEditorState);
      expect(newState.future).toEqual([]);
    });

    it('should track MOVE_COMPONENT action', () => {
      const action = { 
        type: ACTION_TYPES.MOVE_COMPONENT, 
        payload: { id: 'component1', position: { x: 10, y: 20 } } 
      };
      
      const newState = historyReducer(initialState, action, mockEditorState);
      
      expect(newState.past).toContainEqual(mockEditorState);
      expect(newState.future).toEqual([]);
    });
  });

  describe('Non-trackable actions', () => {
    it('should not track LOAD_STATE action', () => {
      const action = { type: ACTION_TYPES.LOAD_STATE, payload: mockEditorState };
      
      const newState = historyReducer(initialState, action, mockEditorState);
      
      expect(newState).toEqual(initialState);
    });

    it('should not track RESET_STATE action', () => {
      const action = { type: ACTION_TYPES.RESET_STATE };
      
      const newState = historyReducer(initialState, action, mockEditorState);
      
      expect(newState).toEqual(initialState);
    });

    it('should not track unknown actions', () => {
      const action = { type: 'UNKNOWN_ACTION' };
      
      const newState = historyReducer(initialState, action, mockEditorState);
      
      expect(newState).toEqual(initialState);
    });
  });

  it('should limit history to MAX_HISTORY steps', () => {
    // Create a state with many past items
    const manyPastItems = Array(60).fill(null).map((_, i) => ({ state: i }));
    const stateWithManyPast = {
      past: manyPastItems,
      future: []
    };
    
    const action = { type: ACTION_TYPES.ADD_COMPONENT, payload: { component: { id: 'new' } } };
    
    const newState = historyReducer(stateWithManyPast, action, mockEditorState);
    
    // Should be limited to 50 items (MAX_HISTORY constant in the reducer)
    expect(newState.past.length).toBeLessThanOrEqual(50);
    // The newest item (current editor state) should be added
    expect(newState.past).toContainEqual(mockEditorState);
  });
});