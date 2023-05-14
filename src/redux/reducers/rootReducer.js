// ** Redux Imports
import { combineReducers } from 'redux'

// ** Reducers Imports
import auth from './auth'
import navbar from './navbar'
import layout from './layout'
import calendar from '@src/views/schedule/store/reducer'
import bills  from '@src/views/bills/store'
import material  from '@src/views/material_requirment/store'

const rootReducer = combineReducers({
  auth,
  navbar,
  layout,
  calendar,
  bills,
  material
})

export default rootReducer
