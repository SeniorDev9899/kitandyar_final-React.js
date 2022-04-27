import { SET_LANGUAGE_ACTION, SET_CURRENCY_ACTION } from '../../constants/constants'

export const changeLang = text => (
  {
    type: SET_LANGUAGE_ACTION,
    text
  })

export const changeCur = text => (
  {
    type: SET_CURRENCY_ACTION,
    text
  })