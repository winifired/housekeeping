import Api from "../../utils/api.js";
import request from "../../utils/request.js";
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		imagesUrl: {
			type: Array,
			value: [],
		},
		isEdit:{
			type:Boolean,
			value:false
		}
	},

	/**
	 * 组件的初始数据
	 */
	data: {},

	/**
	 * 组件的方法列表
	 */
	methods: {
		prevImg(e) {
			let arr=[];
			this.data.imagesUrl.map(item=>{
				if(item.type=='图片'){
					arr.push(item.content)
				}
			})
			if (e.currentTarget.dataset.item.type == '图片') {
				wx.previewImage({
				  current: e.currentTarget.dataset.item.content,
				  urls:arr,
				})
			}
		},
		removeImg(e) {
			let index = e.currentTarget.dataset.index;
			this.data.imagesUrl.splice(index, 1);
			this.setData({
				imagesUrl: this.data.imagesUrl,
			});
			this.triggerEvent('getImg', this.data.imagesUrl);
		},
		addImg() {
			let that = this;
			wx.chooseMedia({
				count: 9,
				maxDuration: 30,
				mediaType: ['image', 'video'],
				sourceType: ['album', 'camera'],
				success: (chooseImageRes) => {
					const tempFilePaths = [];
					chooseImageRes.tempFiles.map(item => {
						tempFilePaths.push({
							type: item.fileType == "video" ? '视频' : '图片',
							content: item.tempFilePath
						});
					});
					wx.showLoading({
						mask:true
					});
					let newOld=tempFilePaths.length+that.data.imagesUrl.length;
					tempFilePaths.map(item => {
						wx.uploadFile({
							url: Api.upload_file,
							filePath: item.content,
							name: 'file',
							success: (uploadFileRes) => {
								that.data.imagesUrl.push({
									type: item.type,
									content: JSON.parse(uploadFileRes.data).url
								});
								that.setData({
									imagesUrl: that.data.imagesUrl,
								})
								wx.hideLoading();
								console.log(newOld)
								console.log(that.data.imagesUrl.length)
								if (newOld == that.data.imagesUrl.length) {
									that.triggerEvent('getImg', that.data.imagesUrl);
								}
							},
							fail() {
								wx.hideLoading();
							}
						});
					})
				}
			});
		}
	}
})