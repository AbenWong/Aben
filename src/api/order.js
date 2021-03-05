import request from '@/utils/request'
import qs from 'qs'

export function add(data) {
  return request({
    url: 'api/posOrder',
    method: 'post',
    data
  })
}

export function getOrderPay(orderNo) {
  return request({
    url: 'api/posOrder/get-pay/' + orderNo,
    method: 'post'
  })
}

export function sumFee(data) {
  return request({
    url: 'api/posOrder/sum-fee?' + qs.stringify(data, { indices: false }),
    method: 'post'
  })
}

export function getOrderGoods(orderId) {
  return request({
    url: 'api/posOrder/get-goods/' + orderId,
    method: 'post'
  })
}

export function del(ids) {
  return request({
    url: 'api/posOrder/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/posOrder',
    method: 'put',
    data
  })
}

export default { add, edit, del, getOrderPay, getOrderGoods, sumFee }
