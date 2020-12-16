import React, {createContext, useReducer, useContext} from 'react';

export interface IRepoRes {
    total_count : number,
    incomplete_results: boolean,
    items: []
}

export interface IAppContext {
    repoData: IRepoRes
}


type Action = {type: 'updateRepoData', value: any}
type Dispatch = (action: Action) => void
type State = {repoData: IRepoRes }
type AppProviderProps = {children: React.ReactNode}

const AppStateContext = createContext<IAppContext | null>(null);
const AppDispatchContext = React.createContext<Dispatch | undefined>(undefined,)

function AppContextReducer( state: State, action: Action){
    switch (action.type){
        case "updateRepoData" : {
            return{repoData: action.value}
        }
        default: {
            throw new Error(`Unhandled action type: ${action.type}`)
        }
    }
}

function AppContextProvider({children} : AppProviderProps) {
    const [state, dispatch] = useReducer(AppContextReducer, {repoData:{
    total_count : 0,
    incomplete_results: false,
    items: []
    }})
    return (
      <AppStateContext.Provider value={state}>
        <AppDispatchContext.Provider value={dispatch}>
          {children}
        </AppDispatchContext.Provider>
      </AppStateContext.Provider>
    )
  }
  
function useAppContext(){
    const context = useContext(AppStateContext)
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppContextProvider')
      }
      return context
}

function useAppDispatch(){
    const context = useContext(AppDispatchContext)
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppContextProvider')
      }
      return context
}


export {AppContextProvider, useAppContext, useAppDispatch}

