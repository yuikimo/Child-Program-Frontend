import request from '@/utils/request'

// 查询用户意见列表
export function listAdvice(query) {
  return request({
    url: '/system/advice/list',
    method: 'get',
    params: query
  })
}

// 查询用户意见详细
export function getAdvice(id) {
  return request({
    url: '/system/advice/' + id,
    method: 'get'
  })
}

// 新增用户意见
export function addAdvice(data) {
  return request({
    url: '/system/advice',
    method: 'post',
    data: data
  })
}

// 修改用户意见
export function updateAdvice(data) {
  return request({
    url: '/system/advice',
    method: 'put',
    data: data
  })
}

// 删除用户意见
export function delAdvice(id) {
  return request({
    url: '/system/advice/' + id,
    method: 'delete'
  })
}
