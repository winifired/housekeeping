const request = (url, options) => {
	return new Promise((resolve, reject) => {
		wx.showLoading({
			mask: true
		});
		wx.request({
			url: `${url}`,
			method: options.method,
			data: options.data && options.data.data ? options.data.data : {},
			header: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			success(request) {
				wx.hideLoading();
				if (request.statusCode == 200) {
					if (request.data.code != 0) {
						wx.showToast({
							title: request.data.msg,
							icon: 'none',
							duration:2000
						});
						resolve(request.data)
					} else {
						resolve(request.data)
					}
				} else if (request.statusCode == 401) {
					wx.navigateTo({
						url: '/pages/login/login',
					})
				} else {
					wx.showToast({
						title: '网络错误，请稍后重试',
						icon: 'none'
					})
					reject(request.data)
				}
			},
			fail(error) {
				wx.hideLoading({
					success: () => {
						wx.showToast({
							title: '网络错误，请稍后重试',
							icon: 'none'
						})
						reject(error.data)
					},
				})
			}
		})
	})
}
const get = (url, options = {}) => {
	return request(url, {
		method: 'GET',
		data: options
	})
}

const post = (url, options) => {
	return request(url, {
		method: 'POST',
		data: options
	})
}

const put = (url, options) => {
	return request(url, {
		method: 'PUT',
		data: options
	})
}

// 不能声明DELETE（关键字）
const remove = (url, options) => {
	return request(url, {
		method: 'DELETE',
		data: options
	})
}

module.exports = {
	get,
	post,
	put,
	remove
}