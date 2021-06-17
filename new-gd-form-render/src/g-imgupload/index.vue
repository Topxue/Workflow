<template>
  <g-form-item
    :decorator="dataInfo.rules"
    prop="value"
    :label="dataInfo.name"
    :required="dataInfo.options.required"
  >
    <el-upload
      :data="params"
      :action="action"
      :accept="accept"
      :headers="headers"
      :auto-upload="true"
      :list-type="listType"
      :file-list="fileList"
      :limit="dataInfo.options.length"
      :multiple="dataInfo.options.multiple"
      :on-exceed="handleExceed"
      :before-upload="handleBeforeUpload"
      :on-remove="handleRemove"
      :on-preview="handlePictureCardPreview"
      :on-success="handleUploadSuccess"
      :disabled="dataInfo.options.disabled || dataInfo.options.writeable === false"
    >
      <i class="el-icon-plus"></i>
      <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png/jpeg文件，且不超过30M</div> -->
    </el-upload>

    <el-dialog :visible.sync="dialogVisible" :append-to-body="true">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </g-form-item>
</template>

<script>
import { uploadConfig } from '../../utils/config'
import valueMixin from '../mixins/valueMixin'

const ERROR_OK = 10000

export default {
  name: 'gImgupload',
  mixins: [valueMixin],
  data() {
    return {
      fileIds: [],
      fileList: [],
      disabled: false,
      dialogImageUrl: '',
      uploadLength: null,
      dialogVisible: false,
      listType: 'picture-card',
      accept: '.jpg, .jpeg, .png',
      params: uploadConfig.params,
      action: uploadConfig.action,
      headers: uploadConfig.headers
    }
  },
  mounted() {
    this.uploadLength = this.dataInfo.options.length

    this.imageDataBackShow()
    this.contralImageUpload()
  },
  methods: {
    // 图片数据回显
    imageDataBackShow() {
      const imageData = this.dataInfo.value

      if (imageData && imageData.length) {
        this.fileList = imageData.map(item => {
          return {
            url: uploadConfig.getFileUrl(item.url),
            fileName: item.fileName
          }
        })

        this.fileIds = [...imageData]
      }
    },

    contralImageUpload() {
      const disabled = this.dataInfo.options.disabled || this.dataInfo.options.writeable === false

      if (disabled) {
        const uploadWarper = document.querySelector('.el-upload--picture-card')
        if (uploadWarper) uploadWarper.style.display = 'none'
      }
    },

    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },

    handleRemove(file, fileList) {
      const fileIds = fileList.map(res => {
        if ('response' in res) {
          return {
            url: res.response.data.id,
            fileName: res.response.data.originalFilename
          }
        }
      })

      this.value = fileIds
      this.fileIds = fileIds
    },

    handleBeforeUpload(file) {
      const isLt30M = file.size / 1024 / 1024 < 30
      if (!isLt30M) {
        this.$message.error('上传文件大小不能超过 30MB!')
        return false
      }
    },

    // * 文件上传成功
    handleUploadSuccess(res) {
      if (res.code === ERROR_OK) {
        const { id, originalFilename } = res.data

        this.fileIds.push({
          url: id,
          fileName: originalFilename
        })
      }

      this.value = this.fileIds
    },

    handleExceed() {
      return this.$message.error(`文件数量限制最多${this.uploadLength}个！`)
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/.el-upload-list--picture-card .el-upload-list__item,
/deep/.el-upload--picture-card {
  width: 100px;
  height: 100px;
  line-height: 100px;
}
/deep/.el-upload-list--picture-card .el-upload-list__item .el-icon-check,
.el-upload-list--picture-card .el-upload-list__item .el-icon-circle-check {
  position: relative;
  top: -34px;
}
</style>
