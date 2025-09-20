import { ACTION_TYPES, PREVIEW_MODES } from '../../constants';

const initialState = {
  components: [],
  selectedComponentId: null,
  previewMode: PREVIEW_MODES.DESKTOP,
  isPreviewVisible: false,
};

const editorReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_TYPES.ADD_COMPONENT:
      return {
        ...state,
        components: [...state.components, action.payload],
        selectedComponentId: action.payload.id
      };

    case ACTION_TYPES.UPDATE_COMPONENT:
      return {
        ...state,
        components: state.components.map(component =>
          component.id === action.payload.id
            ? { ...component, ...action.payload.properties }
            : component
        )
      };

    case ACTION_TYPES.DELETE_COMPONENT:
      return {
        ...state,
        components: state.components.filter(component => component.id !== action.payload),
        selectedComponentId: state.selectedComponentId === action.payload ? null : state.selectedComponentId
      };

    case ACTION_TYPES.MOVE_COMPONENT:
      return {
        ...state,
        components: state.components.map(component =>
          component.id === action.payload.id
            ? { ...component, position: action.payload.position }
            : component
        )
      };

    case ACTION_TYPES.SELECT_COMPONENT:
      return {
        ...state,
        selectedComponentId: action.payload
      };

    case ACTION_TYPES.CLEAR_SELECTION:
      return {
        ...state,
        selectedComponentId: null
      };

    case ACTION_TYPES.SET_PREVIEW_MODE:
      return {
        ...state,
        previewMode: action.payload
      };

    case ACTION_TYPES.TOGGLE_PREVIEW:
      return {
        ...state,
        isPreviewVisible: action.payload
      };

    case ACTION_TYPES.LOAD_STATE:
      return {
        ...action.payload
      };

    case ACTION_TYPES.RESET_STATE:
      return initialState;

    default:
      return state;
  }
};

export default editorReducer;