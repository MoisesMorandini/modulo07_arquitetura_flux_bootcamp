import { call, select, put, all, takeLatest } from 'redux-saga/effects';
import { addToCartSucess, updateAmountSucess } from './actions';
import { formatPrice } from '../../../util/format';
import api from '../../../services/api';
import history from '../../../services/history';

import { toast } from 'react-toastify';
function* addToCart({ id }) {
  const productExists = yield select(state =>
    state.cart.find(p => p.id === id)
  );
  //pega do api a quantidadade do stock
  const stock = yield call(api.get, `/stock/${id}`);
  //salve o stock
  const stockAmount = stock.data.amount;
  //veririca se o quanto de produto ja foi solicitado pro carrinho. Se existir, salva este valor
  // else, inicia com 0
  const currentAmount = productExists ? productExists.amount : 0;

  const amount = currentAmount + 1;

  if (amount > stockAmount) {
    toast.error('Quantidade solicitada fora do estoque');
    return;
  }

  if (productExists) {
    yield put(updateAmountSucess(id, amount));
  } else {
    const response = yield call(api.get, `/products/${id}`);

    const data = {
      ...response.data,
      amount: 1,
      priceFormatted: formatPrice(response.data.price),
    };

    yield put(addToCartSucess(data));
    history.push('/cart');
  }
}

function* updateAmount({ id, amount }) {
  if (amount <= 0) return;

  const stock = yield call(api.get, `stock/${id}`);
  const stockAmount = stock.data.amount;

  if (amount > stockAmount) {
    toast.error('Quantidade solicitada fora do estoque');
    return;
  }
  yield put(updateAmountSucess(id, amount));
}

export default all([
  takeLatest('@cart/ADD_REQUEST', addToCart),
  takeLatest('@cart/UPDATE_AMOUNT_REQUEST', updateAmount),
]);
