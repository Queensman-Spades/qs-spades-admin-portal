// ** Redux Imports
import { createSlice } from "@reduxjs/toolkit"

export const billSlice = createSlice({
  name: "bills",
  initialState: {
    data: [],
    modal: false,
    selectableRows: false,
    selectedRows: false,
    modalEdit: false,
    modalAlert: false,
    newData: [],
    files: [],
    project: null,
    projectOptions: []
  },
  reducers: {
    setData: (state, action) => {
      state.data = action.payload
    },
    setSelectableRows: (state, action) => {
      state.selectableRows = action.payload
    },
    setSelectedRows: (state, action) => {
      state.selectedRows = action.payload
    },
    setModalAlert: (state, action) => {
      state.modalAlert = action.payload
    },
    setEditModal: (state, action) => {
      state.modalEdit = action.payload
    },
    newRows: (state, action) => {
      state.newData = action.payload
    },
    resetDefault: (state, action) => {
      state.newData = action.payload
    },
    setFiles: (state, action) => {
      state.files = action.payload
    },
    setProject: (state, action) => {
      state.project = action.payload
    },
    setProjectOptions: (state, action) => {
      state.projectOptions = action.payload
    }
  }
})

export const {
  setData,
  setModalAlert,
  setSelectableRows,
  setSelectedRows,
  setEditModal,
  newRows,
  resetDefault,
  setFiles,
  setProject,
  setProjectOptions
} = billSlice.actions

export default billSlice.reducer
