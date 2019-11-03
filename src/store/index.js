import { configureStore, getDefaultMiddleware } from 'redux-starter-kit'
import rootReducer from './reducers/rootReducer'
import walletMiddleware from './middlewares/walletMiddleware'

export default () => {
  const store = configureStore({
    reducer: rootReducer,
    middleware: [...getDefaultMiddleware(), walletMiddleware],
  })

  return store
}
