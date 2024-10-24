import React, { createContext, useReducer } from "react";
import SubjectsReducer from "./SubjectsReducer";  // Assuming you have this file

const INITIAL_STATE = {
  subjects: [],
  isFetching: false,
  error: false,
};

export const SubjectsContext = createContext(INITIAL_STATE);

export const SubjectsContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(SubjectsReducer, INITIAL_STATE);

  return (
    <SubjectsContext.Provider
      value={{
        subjects: state.subjects,
        isFetching: state.isFetching,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </SubjectsContext.Provider>
  );
};

// Add this line at the end

