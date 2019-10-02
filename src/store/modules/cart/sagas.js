import { call, put, all, takeLatest } from 'redux-saga/effects';
import { addToCartSucess } from './actions';
import api from '../../../services/api';

function* addToCart({ id }) {
  const response = yield call(api.get, `/products/${id}`);

  yield put(addToCartSucess(response.data));
}

export default all([takeLatest('@cart/ADD_REQUEST', addToCart)]);
