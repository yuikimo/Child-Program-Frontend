import request from '@/utils/request'

// 查询博客文章列表
export function listBlog(query) {
  return request({
    url: '/system/blog/list',
    method: 'get',
    params: query
  })
}

// 查询博客文章详细
export function getBlog(id) {
  return request({
    url: '/system/blog/' + id,
    method: 'get'
  })
}

// 新增博客文章
export function addBlog(data) {
  return request({
    url: '/system/blog',
    method: 'post',
    data: data
  })
}

// 修改博客文章
export function updateBlog(data) {
  return request({
    url: '/system/blog',
    method: 'put',
    data: data
  })
}

// 删除博客文章
export function delBlog(id) {
  return request({
    url: '/system/blog/' + id,
    method: 'delete'
  })
}
